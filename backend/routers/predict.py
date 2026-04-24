from fastapi import APIRouter
from models.financial_profile import FinancialProfile
from services.prediction_engine import predict_savings

router = APIRouter()

@router.post("/savings")
def predict(profile: FinancialProfile):
    result = predict_savings(
        monthly_income    = profile.monthly_income,
        monthly_expenses  = profile.monthly_expenses,
        current_savings   = profile.current_savings,
        monthly_investment= profile.monthly_investment,
        months            = 36
    )
    return {"status": "success", "data": result}