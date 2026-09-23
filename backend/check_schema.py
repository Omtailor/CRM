from app.database import engine
from sqlalchemy import text

with engine.connect() as conn:
    result = conn.execute(text("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'tickets' AND column_name IN ('created_at', 'updated_at')"))
    for row in result:
        print(dict(row._mapping))
