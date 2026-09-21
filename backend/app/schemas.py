from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List


class TicketCreate(BaseModel):
    customer_name: str
    customer_email: EmailStr
    subject: str
    description: Optional[str] = None

class TicketUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None

class NoteOut(BaseModel):
    id: int
    ticket_id: str
    note_text: str
    created_at: datetime

    class Config:
        from_attributes = True

class TicketOut(BaseModel):
    id: int
    ticket_id: str
    customer_name: str
    customer_email: str
    subject: str
    description: Optional[str] = None
    status: str
    created_at: datetime
    updated_at: datetime
    notes: List[NoteOut] = []

    class Config:
        from_attributes = True


class NoteCreate(BaseModel):
    note_text: str
