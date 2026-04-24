from fastapi import APIRouter
from models.financial_profile import FinancialProfile
from services.future_simulator import run_future_simulation

router = APIRouter()

@router.post("/run")
def run_simulation(profile: FinancialProfile):
    result = run_future_simulation(
        monthly_income    = profile.monthly_income,
        monthly_expenses  = profile.monthly_expenses,
        current_savings   = profile.current_savings,
        monthly_investment= profile.monthly_investment,
        months            = 60,
        simulations       = 1000
    )
    return {"status": "success", "data": result}