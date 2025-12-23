from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
import models
from database import engine, SessionLocal
from dotenv import load_dotenv
import auth

# Load environment variables
load_dotenv()

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

# --- V1 Implementation ---
from fastapi.security import OAuth2PasswordBearer

# Dummy Secret & Token (For V1 Development ONLY)
# In production, use environment variables and real JWT libraries (python-jose)
FAKE_SECRET_TOKEN = "secret-token-v1"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/token") # For Swagger UI support

# Dependency: Get Current User
async def get_current_user(token: str = Depends(oauth2_scheme)):
    if token != FAKE_SECRET_TOKEN:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    # Return dummy admin user
    return models.User(id=1, email="admin@example.com", hashed_password="admin")

# Startup Event: Seed Admin User
@app.on_event("startup")
def startup_event():
    db = SessionLocal()
    user = db.query(models.User).filter(models.User.email == "admin@example.com").first()
    if not user:
        # Create admin user
        # NOTE: Storing plain text password for V1 convenience. 
        # MUST CHANGE TO HASHED IN PRODUCTION.
        admin_user = models.User(email="admin@example.com", hashed_password="admin") 
        db.add(admin_user)
        db.commit()
    db.close()

# --- Auth Endpoints ---

@app.post("/api/login", response_model=models.Token)
async def login(form_data: models.UserLogin, db: Session = Depends(get_db)):
    # 1. Fetch user
    user = db.query(models.User).filter(models.User.email == form_data.email).first()
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    # 2. Verify password (simple string comparison for V1)
    if user.hashed_password != form_data.password:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    # 3. Return dummy token
    return {"access_token": FAKE_SECRET_TOKEN, "token_type": "bearer"}

# --- Google OAuth Endpoint ---

@app.post("/api/auth/google")
async def google_auth(request: dict, db: Session = Depends(get_db)):
    """
    Verify Google OAuth token and create/login user
    """
    token = request.get('token')
    if not token:
        raise HTTPException(status_code=400, detail="Token is required")
    
    # Verify token with Google
    user_info = auth.verify_google_token(token)
    
    # Check if user exists
    user = db.query(models.User).filter(models.User.email == user_info['email']).first()
    
    if not user:
        # Create new user
        user = models.User(
            email=user_info['email'],
            hashed_password="google_oauth"  # Placeholder for OAuth users
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    
    # Return user information
    return {
        "user": {
            "id": str(user.id),
            "email": user.email,
            "name": user_info.get('name', ''),
            "picture": user_info.get('picture', '')
        },
        "access_token": FAKE_SECRET_TOKEN,  # In production, generate proper JWT
        "token_type": "bearer"
    }

# --- Asset Endpoints (Protected) ---

@app.post("/api/assets", response_model=models.AssetResponse, status_code=status.HTTP_201_CREATED)
async def create_asset(
    asset: models.AssetCreate, 
    current_user: models.User = Depends(get_current_user), # Requires Auth
    db: Session = Depends(get_db)
):
    db_asset = models.Asset(
        user_id=current_user.id,
        type=asset.type,
        amount=asset.amount,
        description=asset.description
    )
    db.add(db_asset)
    db.commit()
    db.refresh(db_asset)
    return db_asset

@app.get("/api/assets", response_model=list[models.AssetResponse])
async def get_assets(
    current_user: models.User = Depends(get_current_user), # Requires Auth
    db: Session = Depends(get_db)
):
    return db.query(models.Asset).filter(models.Asset.user_id == current_user.id).all()

# --- Public Endpoints ---

@app.get("/")
def read_root():
    return {"message": "API is running"}
