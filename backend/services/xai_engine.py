import numpy as np
from typing import Dict, List

def calculate_shap_values(
    monthly_income: float,
    monthly_expenses: float,
    current_savings: float,
    total_debt: float,
    monthly_emi: float,
    monthly_investment: float,
) -> Dict:

    # Calculate key financial ratios
    savings_rate      = ((monthly_income - monthly_expenses) / monthly_income) * 100
    dti               = (monthly_emi / monthly_income) * 100
    emergency_months  = current_savings / monthly_expenses if monthly_expenses > 0 else 0
    investment_rate   = (monthly_investment / monthly_income) * 100
    debt_to_savings   = (total_debt / current_savings) if current_savings > 0 else 0
    expense_ratio     = (monthly_expenses / monthly_income) * 100

    # Base risk score
    base_score = 60.0

    # Calculate SHAP-like contributions for each feature
    # Positive = improves score, Negative = hurts score

    contributions = {}

    # 1. Savings Rate contribution
    if savings_rate >= 30:
        contributions['Savings Rate'] = +20.0
    elif savings_rate >= 20:
        contributions['Savings Rate'] = +12.0
    elif savings_rate >= 10:
        contributions['Savings Rate'] = +4.0
    elif savings_rate >= 0:
        contributions['Savings Rate'] = -8.0
    else:
        contributions['Savings Rate'] = -25.0

    # 2. Debt-to-Income contribution
    if dti <= 10:
        contributions['Debt-to-Income'] = +15.0
    elif dti <= 20:
        contributions['Debt-to-Income'] = +8.0
    elif dti <= 30:
        contributions['Debt-to-Income'] = +2.0
    elif dti <= 40:
        contributions['Debt-to-Income'] = -10.0
    else:
        contributions['Debt-to-Income'] = -22.0

    # 3. Emergency Fund contribution
    if emergency_months >= 6:
        contributions['Emergency Fund'] = +15.0
    elif emergency_months >= 3:
        contributions['Emergency Fund'] = +7.0
    elif emergency_months >= 1:
        contributions['Emergency Fund'] = -5.0
    else:
        contributions['Emergency Fund'] = -18.0

    # 4. Investment Rate contribution
    if investment_rate >= 20:
        contributions['Investment Rate'] = +12.0
    elif investment_rate >= 10:
        contributions['Investment Rate'] = +6.0
    elif investment_rate >= 5:
        contributions['Investment Rate'] = +2.0
    else:
        contributions['Investment Rate'] = -5.0

    # 5. Expense Ratio contribution
    if expense_ratio <= 40:
        contributions['Expense Ratio'] = +10.0
    elif expense_ratio <= 55:
        contributions['Expense Ratio'] = +3.0
    elif expense_ratio <= 70:
        contributions['Expense Ratio'] = -7.0
    else:
        contributions['Expense Ratio'] = -15.0

    # 6. Debt-to-Savings contribution
    if debt_to_savings <= 0.5:
        contributions['Debt vs Savings'] = +8.0
    elif debt_to_savings <= 1.0:
        contributions['Debt vs Savings'] = +2.0
    elif debt_to_savings <= 2.0:
        contributions['Debt vs Savings'] = -6.0
    else:
        contributions['Debt vs Savings'] = -12.0

    # Final score
    final_score = base_score + sum(contributions.values())
    final_score = max(0, min(100, final_score))

    # Build feature list sorted by absolute impact
    features = []
    for name, value in contributions.items():
        features.append({
            "feature":     name,
            "shap_value":  round(value, 2),
            "impact":      "positive" if value > 0 else "negative",
            "magnitude":   abs(round(value, 2))
        })

    features.sort(key=lambda x: x["magnitude"], reverse=True)

    # Top positive and negative factors
    top_positive = [f for f in features if f["impact"] == "positive"][:3]
    top_negative = [f for f in features if f["impact"] == "negative"][:3]

    return {
        "base_score":        round(base_score, 1),
        "final_score":       round(final_score, 1),
        "features":          features,
        "top_positive":      top_positive,
        "top_negative":      top_negative,
        "total_positive":    round(sum(v for v in contributions.values() if v > 0), 2),
        "total_negative":    round(sum(v for v in contributions.values() if v < 0), 2),
        "key_metrics": {
            "savings_rate":     round(savings_rate, 1),
            "dti":              round(dti, 1),
            "emergency_months": round(emergency_months, 1),
            "investment_rate":  round(investment_rate, 1),
            "expense_ratio":    round(expense_ratio, 1),
            "debt_to_savings":  round(debt_to_savings, 2),
        }
    }