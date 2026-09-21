from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import TicketCreate, TicketOut, TicketUpdate
from app.crud import create_ticket, get_tickets, get_ticket_by_id, update_ticket

router = APIRouter()

@router.post("/tickets", response_model=TicketOut, status_code=201)
def create_ticket_endpoint(ticket: TicketCreate, db: Session = Depends(get_db)):
    try:
        db_ticket = create_ticket(db, ticket.model_dump())
        return db_ticket
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
                "created_at": ticket.created_at.isoformat() if ticket.created_at else None
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
                "created_at": note.created_at.isoformat() if note.created_at else None
            })
    
    return {
        "id": ticket.id,
        "ticket_id": ticket.ticket_id,
        "customer_name": ticket.customer_name,
        "customer_email": ticket.customer_email,
        "subject": ticket.subject,
        "description": ticket.description,
        "status": ticket.status,
        "created_at": ticket.created_at.isoformat() if ticket.created_at else None,
        "updated_at": ticket.updated_at.isoformat() if ticket.updated_at else None,
        "notes": notes_list
    }

@router.put("/tickets/{ticket_id}", response_model=dict)
def update_ticket_endpoint(ticket_id: str, update_data: TicketUpdate, db: Session = Depends(get_db)):
    try:
        updated_ticket = update_ticket(
            db, 
            ticket_id, 
            status=update_data.status, 
            notes=update_data.notes
        )
        
        if not updated_ticket:
            raise HTTPException(
                status_code=404,
                detail=f"Ticket with ID {ticket_id} not found"
            )
        
        return {
            "success": True,
            "updated_at": updated_ticket.updated_at.isoformat() if updated_ticket.updated_at else None
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
