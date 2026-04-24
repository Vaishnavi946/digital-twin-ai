from fastapi import APIRouter
from models.financial_profile import FinancialProfile
from services.risk_engine import calculate_risk_score

router = APIRouter()

@router.post("/risk-score")
def get_risk_score(profile: FinancialProfile):
    result = calculate_risk_score(
        monthly_income   = profile.monthly_income,
        monthly_expenses = profile.monthly_expenses,
        current_savings  = profile.current_savings,
        total_debt       = profile.total_debt,
        monthly_emi      = profile.monthly_emi
    )
    return {"status": "success", "data": result}