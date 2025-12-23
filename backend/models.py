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

# --- V1 Models ---

# SQLAlchemy: User
class User(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String) # For V1, we might simulate hashing or just store plain text if strictly local dummy
    created_at = Column(DateTime, default=datetime.utcnow)

# SQLAlchemy: Asset
class Asset(Base):
    __tablename__ = 'assets'
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True) # Foreign Key relationship handled loosely for V1
    type = Column(String) # Cash, FD, Gold, Equity, etc.
    amount = Column(Integer) # Store as integer (e.g., paisa/cents) or standard int
    description = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

# Pydantic: Auth
class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

# Pydantic: Assets
class AssetCreate(BaseModel):
    type: str # Enum could be enforced, but string is flexible for V1
    amount: float
    description: str | None = None

class AssetResponse(BaseModel):
    id: int
    type: str
    amount: float
    description: str | None
    created_at: datetime
    
    class Config:
        from_attributes = True
