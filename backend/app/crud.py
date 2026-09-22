from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.models import Ticket, Note
from datetime import datetime, timedelta
import re

VALID_PRIORITIES = ("Low", "Medium", "High", "Urgent")
DEFAULT_PRIORITY = "Medium"
SLA_THRESHOLDS = {
    "Urgent": timedelta(hours=4),
    "High": timedelta(hours=24),
    "Medium": timedelta(hours=48),
    "Low": timedelta(hours=72),
}

def normalize_priority(priority: str = None) -> str:
    if priority in VALID_PRIORITIES:
        return priority
    return DEFAULT_PRIORITY

def is_sla_breached(ticket: Ticket) -> bool:
    if ticket.status == "Closed":
        return False

    created_at = ticket.created_at
    if not created_at:
        return False

    priority = normalize_priority(getattr(ticket, "priority", None))
    return datetime.utcnow() - created_at > SLA_THRESHOLDS[priority]

def generate_ticket_id(db: Session) -> str:
    # Get the highest existing ticket_id
    result = db.query(Ticket.ticket_id).order_by(Ticket.ticket_id.desc()).first()
    
    if result is None:
        # No tickets exist, start with TKT-0001
        return "TKT-0001"
    
    # Extract the numeric part from the highest ticket_id
    highest_ticket_id = result[0]
    match = re.match(r'TKT-(\d+)', highest_ticket_id)
    
    if match:
        next_number = int(match.group(1)) + 1
        return f"TKT-{next_number:04d}"
    else:
        # If format doesn't match, start fresh
        return "TKT-0001"

def create_ticket(db: Session, ticket_data: dict) -> Ticket:
    ticket_id = generate_ticket_id(db)
    
    db_ticket = Ticket(
        ticket_id=ticket_id,
        customer_name=ticket_data["customer_name"],
        customer_email=ticket_data["customer_email"],
        subject=ticket_data["subject"],
        description=ticket_data.get("description"),
        status="Open",
        priority=normalize_priority(ticket_data.get("priority"))
    )
    
    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)
    
    return db_ticket

def get_tickets(db: Session, status: str = None, search: str = None):
    query = db.query(Ticket)
    
    # Apply status filter if provided
    if status:
        query = query.filter(Ticket.status == status)
    
    # Apply search filter if provided (case-insensitive)
    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            or_(
                Ticket.customer_name.ilike(search_pattern),
                Ticket.customer_email.ilike(search_pattern),
                Ticket.ticket_id.ilike(search_pattern),
                Ticket.subject.ilike(search_pattern)
            )
        )
    
    # Order by created_at descending (most recent first)
    query = query.order_by(Ticket.created_at.desc())
    
    return query.all()

def get_ticket_by_id(db: Session, ticket_id: str):
    # Fetch ticket by ticket_id
    ticket = db.query(Ticket).filter(Ticket.ticket_id == ticket_id).first()
    
    if ticket:
        # Load notes separately and attach them to the relationship
        notes = db.query(Note).filter(
            Note.ticket_id == ticket_id
        ).order_by(Note.created_at.asc()).all()
        ticket.notes = notes
    
    return ticket

def update_ticket(db: Session, ticket_id: str, status: str = None, priority: str = None, notes: str = None):
    # Fetch the ticket
    ticket = db.query(Ticket).filter(Ticket.ticket_id == ticket_id).first()
    
    if not ticket:
        return None
    
    made_changes = False
    
    # Validate and update status if provided
    valid_statuses = ['Open', 'In Progress', 'Closed']
    if status is not None:
        if status not in valid_statuses:
            raise ValueError(f"Invalid status. Must be one of: {', '.join(valid_statuses)}")
        ticket.status = status
        made_changes = True

    if priority is not None:
        ticket.priority = normalize_priority(priority)
        made_changes = True
    
    # Add note if provided (non-empty string after stripping whitespace)
    if notes and notes.strip():
        new_note = Note(
            ticket_id=ticket_id,
            note_text=notes.strip()
        )
        db.add(new_note)
        made_changes = True
    
    # Update the updated_at timestamp only if changes were made
    if made_changes:
        ticket.updated_at = datetime.utcnow()
    
    # Commit changes
    db.commit()
    
    # Re-query to get the ticket with notes properly ordered
    updated_ticket = db.query(Ticket).filter(Ticket.ticket_id == ticket_id).first()
    
    if updated_ticket:
        # Load notes separately and attach them
        notes = db.query(Note).filter(
            Note.ticket_id == ticket_id
        ).order_by(Note.created_at.asc()).all()
        updated_ticket.notes = notes
    
    return updated_ticket
