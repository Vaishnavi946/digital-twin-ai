from fastapi import APIRouter
from models.financial_profile import FinancialProfile
from services.xai_engine import calculate_shap_values

router = APIRouter()

@router.post("/explain")
def explain_prediction(profile: FinancialProfile):
    result = calculate_shap_values(
        monthly_income    = profile.monthly_income,
        monthly_expenses  = profile.monthly_expenses,
        current_savings   = profile.current_savings,
        total_debt        = profile.total_debt,
        monthly_emi       = profile.monthly_emi,
        monthly_investment= profile.monthly_investment,
    )
    return {"status": "success", "data": result}