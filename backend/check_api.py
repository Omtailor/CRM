from app.database import SessionLocal
from app.crud import get_tickets, is_sla_breached
from app.datetime_utils import format_utc_z

db = SessionLocal()
try:
    tickets = get_tickets(db)
    print(f"Total tickets from get_tickets: {len(tickets)}")
    
    for ticket in tickets:
        print(f"\nTicket: {ticket.ticket_id}")
        print(f"created_at: {ticket.created_at}")
        print(f"created_at type: {type(ticket.created_at)}")
        print(f"created_at tzinfo: {ticket.created_at.tzinfo if ticket.created_at else None}")
        
        try:
            breached = is_sla_breached(ticket)
            print(f"SLA breached: {breached}")
        except Exception as e:
            print(f"SLA check error: {e}")
            
        try:
            formatted = format_utc_z(ticket.created_at)
            print(f"Formatted: {formatted}")
        except Exception as e:
            print(f"Format error: {e}")
finally:
    db.close()
