from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import TicketCreate, TicketUpdate
from app.crud import create_ticket, get_tickets, get_ticket_by_id, update_ticket, normalize_priority, is_sla_breached
from app.datetime_utils import format_utc_z

router = APIRouter()

def _model_to_dict(model):
    if hasattr(model, "model_dump"):
        return model.model_dump()
    return model.dict()


@router.post("/tickets", response_model=dict, status_code=201)
def create_ticket_endpoint(ticket: TicketCreate, db: Session = Depends(get_db)):
    try:
        db_ticket = create_ticket(db, _model_to_dict(ticket))
        return {
            "id": db_ticket.id,
            "ticket_id": db_ticket.ticket_id,
            "customer_name": db_ticket.customer_name,
            "customer_email": db_ticket.customer_email,
            "subject": db_ticket.subject,
            "description": db_ticket.description,
            "status": db_ticket.status,
            "priority": normalize_priority(db_ticket.priority),
            "is_breached": is_sla_breached(db_ticket),
            "created_at": format_utc_z(db_ticket.created_at),
            "updated_at": format_utc_z(db_ticket.updated_at),
            "notes": [],
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create ticket: {str(e)}"
        )

@router.get("/tickets")
def get_tickets_endpoint(
    ticket_status: str = Query(None, alias="status", description="Filter by ticket status"),
    search: str = Query(None, description="Search across customer name, email, ticket ID, and subject"),
    db: Session = Depends(get_db)
):
    # Validate status if provided
    valid_statuses = ['Open', 'In Progress', 'Closed']
    if ticket_status and ticket_status not in valid_statuses:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status. Must be one of: {', '.join(valid_statuses)}"
        )
    
    try:
        tickets = get_tickets(db, status=ticket_status, search=search)
        # Convert to simplified list format
        return [
            {
                "ticket_id": ticket.ticket_id,
                "customer_name": ticket.customer_name,
                "subject": ticket.subject,
                "status": ticket.status,
                "priority": normalize_priority(ticket.priority),
                "is_breached": is_sla_breached(ticket),
                "created_at": format_utc_z(ticket.created_at)
            }
            for ticket in tickets
        ]
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve tickets: {str(e)}"
        )

@router.get("/tickets/{ticket_id}")
def get_ticket_detail(ticket_id: str, db: Session = Depends(get_db)):
    ticket = get_ticket_by_id(db, ticket_id)
    
    if not ticket:
        raise HTTPException(
            status_code=404,
            detail=f"Ticket with ID {ticket_id} not found"
        )
    
    # Manually construct the response to ensure notes are included
    notes_list = []
    if ticket.notes:
        for note in ticket.notes:
            notes_list.append({
                "id": note.id,
                "ticket_id": note.ticket_id,
                "note_text": note.note_text,
                "created_at": format_utc_z(note.created_at)
            })
    
    return {
        "id": ticket.id,
        "ticket_id": ticket.ticket_id,
        "customer_name": ticket.customer_name,
        "customer_email": ticket.customer_email,
        "subject": ticket.subject,
        "description": ticket.description,
        "status": ticket.status,
        "priority": normalize_priority(ticket.priority),
        "is_breached": is_sla_breached(ticket),
        "created_at": format_utc_z(ticket.created_at),
        "updated_at": format_utc_z(ticket.updated_at),
        "notes": notes_list
    }

@router.put("/tickets/{ticket_id}", response_model=dict)
def update_ticket_endpoint(ticket_id: str, update_data: TicketUpdate, db: Session = Depends(get_db)):
    try:
        updated_ticket = update_ticket(
            db, 
            ticket_id, 
            status=update_data.status, 
            priority=update_data.priority,
            notes=update_data.notes
        )
        
        if not updated_ticket:
            raise HTTPException(
                status_code=404,
                detail=f"Ticket with ID {ticket_id} not found"
            )
        
        return {
            "success": True,
            "updated_at": format_utc_z(updated_ticket.updated_at)
        }
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to update ticket: {str(e)}"
        )
