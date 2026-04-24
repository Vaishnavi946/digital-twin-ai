from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    monthly_income:     Optional[float] = None
    monthly_expenses:   Optional[float] = None
    current_savings:    Optional[float] = None
    total_debt:         Optional[float] = None
    monthly_emi:        Optional[float] = None
    monthly_investment: Optional[float] = None
    risk_appetite:      Optional[str]   = None

class UserResponse(BaseModel):
    id:         int
    full_name:  str
    email:      str
    is_active:  bool
    created_at: datetime

    monthly_income:     float
    monthly_expenses:   float
    current_savings:    float
    total_debt:         float
    monthly_emi:        float
    monthly_investment: float
    risk_appetite:      str

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type:   str
    user:         UserResponse