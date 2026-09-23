from app.database import SessionLocal
from app.models import Ticket
from app.crud import is_sla_breached

db = SessionLocal()
try:
    tickets = db.query(Ticket).all()
    print(f"Total tickets: {len(tickets)}")
    
    for ticket in tickets:
        print(f"\nTicket: {ticket.ticket_id}")
        print(f"created_at: {ticket.created_at}")
        print(f"created_at type: {type(ticket.created_at)}")
        print(f"created_at tzinfo: {ticket.created_at.tzinfo if ticket.created_at else None}")
        print(f"status: {ticket.status}")
        print(f"priority: {ticket.priority}")
        
        try:
            breached = is_sla_breached(ticket)
            print(f"SLA breached: {breached}")
        except Exception as e:
            print(f"SLA check error: {e}")
finally:
    db.close()
