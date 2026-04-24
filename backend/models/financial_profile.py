from pydantic import BaseModel
from typing import Optional

class FinancialProfile(BaseModel):
    user_id: str
    monthly_income: float
    monthly_expenses: float
    current_savings: float
    total_debt: float
    monthly_emi: float          # loan payments
    monthly_investment: float
    risk_appetite: str          # low / medium / high

class ScenarioInput(BaseModel):
    profile: FinancialProfile
    scenario_type: str          # loan / job_loss / salary_hike / investment
    scenario_value: float       # amount or percentage
    months: int = 60            # simulation horizon

class PredictionRequest(BaseModel):
    profile: FinancialProfile
    months: int = 36