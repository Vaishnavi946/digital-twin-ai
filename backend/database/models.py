from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean
from sqlalchemy.sql import func
from database.database import Base

class User(Base):
    __tablename__ = "users"

    id            = Column(Integer, primary_key=True, index=True)
    full_name     = Column(String, nullable=False)
    email         = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active     = Column(Boolean, default=True)
    created_at    = Column(DateTime(timezone=True), server_default=func.now())

    # Financial profile
    monthly_income     = Column(Float, default=0)
    monthly_expenses   = Column(Float, default=0)
    current_savings    = Column(Float, default=0)
    total_debt         = Column(Float, default=0)
    monthly_emi        = Column(Float, default=0)
    monthly_investment = Column(Float, default=0)
    risk_appetite      = Column(String, default="medium")