from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from database.database import get_db
from database import schemas
from services.auth_service import (
    create_user, authenticate_user,
    create_access_token, get_user_by_email, verify_token
)

router  = APIRouter()
security = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    user = verify_token(credentials.credentials, db)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return user

@router.post("/signup", response_model=schemas.Token)
def signup(data: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = get_user_by_email(db, data.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user = create_user(db, data.full_name, data.email, data.password)
    token = create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer", "user": user}

@router.post("/login", response_model=schemas.Token)
def login(data: schemas.UserLogin, db: Session = Depends(get_db)):
    user = authenticate_user(db, data.email, data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer", "user": user}

@router.get("/me", response_model=schemas.UserResponse)
def get_me(current_user = Depends(get_current_user)):
    return current_user

@router.put("/profile", response_model=schemas.UserResponse)
def update_profile(
    data: schemas.UserUpdate,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    for field, value in data.dict(exclude_none=True).items():
        setattr(current_user, field, value)
    db.commit()
    db.refresh(current_user)
    return current_user

@router.get("/status")
def auth_status():
    return {"message": "Auth router is ready"}