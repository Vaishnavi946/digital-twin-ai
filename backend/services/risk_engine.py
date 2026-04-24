from typing import Dict

def calculate_risk_score(
    monthly_income: float,
    monthly_expenses: float,
    current_savings: float,
    total_debt: float,
    monthly_emi: float
) -> Dict:

    score = 100

    # Rule 1: Debt-to-income ratio
    dti = (monthly_emi / monthly_income) * 100
    if dti > 50:   score -= 30
    elif dti > 30: score -= 15

    # Rule 2: Savings rate
    net = monthly_income - monthly_expenses
    savings_rate = (net / monthly_income) * 100
    if savings_rate < 0:   score -= 40
    elif savings_rate < 10: score -= 20
    elif savings_rate < 20: score -= 10

    # Rule 3: Emergency fund (ideal = 6 months of expenses)
    months_covered = current_savings / monthly_expenses if monthly_expenses > 0 else 0
    if months_covered < 1: score -= 20
    elif months_covered < 3: score -= 10
    elif months_covered < 6: score -= 5

    score = max(0, score)

    if score < 40:   level = "critical"
    elif score < 60: level = "high"
    elif score < 80: level = "medium"
    else:            level = "low"

    flags = []
    if dti > 40:
        flags.append("High debt load — EMIs consuming too much income")
    if savings_rate < 10:
        flags.append("Low savings rate — review your monthly expenses")
    if months_covered < 3:
        flags.append("Emergency fund critically low — build a 3-month buffer first")

    return {
        "risk_score":             score,
        "risk_level":             level,
        "debt_to_income_ratio":   round(dti, 1),
        "savings_rate":           round(savings_rate, 1),
        "emergency_months":       round(months_covered, 1),
        "flags":                  flags
    }