from app.database import engine
from sqlalchemy import text
from app.models import Ticket

with engine.connect() as conn:
    result = conn.execute(text("SELECT ticket_id, created_at, updated_at FROM tickets LIMIT 1"))
    for row in result:
        print(f"Raw data: {row}")
        print(f"created_at type: {type(row.created_at)}")
        print(f"created_at tzinfo: {row.created_at.tzinfo if row.created_at else None}")
        print(f"updated_at type: {type(row.updated_at)}")
        print(f"updated_at tzinfo: {row.updated_at.tzinfo if row.updated_at else None}")
