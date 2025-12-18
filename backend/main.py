from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
import models
from database import engine, SessionLocal

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI-Driven Personal Finance Manager API")

# CORS
origins = ["*"] # Allow all for MVP, or specify frontend container URL

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/api/waitlist", response_model=models.WaitlistResponse, status_code=status.HTTP_201_CREATED)
async def join_waitlist(entry: models.WaitlistCreate, db: Session = Depends(get_db)):
    db_entry = models.WaitlistEntry(email=entry.email)
    try:
        db.add(db_entry)
        db.commit()
        db.refresh(db_entry)
        return models.WaitlistResponse(id=db_entry.id, email=db_entry.email, message="Successfully joined the waitlist!")
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Email already registered")
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def read_root():
    return {"message": "API is running"}
