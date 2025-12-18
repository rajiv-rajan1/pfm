from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from pydantic import BaseModel, EmailStr
from database import Base

# SQLAlchemy Model
class WaitlistEntry(Base):
    __tablename__ = 'waitlist'
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)

# Pydantic Model for Input
class WaitlistCreate(BaseModel):
    email: EmailStr

# Pydantic Model for Response
class WaitlistResponse(BaseModel):
    id: int
    email: str
    message: str
