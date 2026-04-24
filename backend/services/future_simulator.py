import numpy as np
from typing import Dict

def run_future_simulation(
    monthly_income: float,
    monthly_expenses: float,
    current_savings: float,
    monthly_investment: float,
    months: int = 60,
    simulations: int = 1000
) -> Dict:

    results = []

    for _ in range(simulations):
        savings = current_savings
        monthly_data = []

        for month in range(months):
            income_variation  = np.random.normal(1.0, 0.03)
            expense_variation = np.random.normal(1.0, 0.05)

            actual_income   = monthly_income   * income_variation
            actual_expenses = monthly_expenses * expense_variation

            emergency      = np.random.choice([0, 1], p=[0.98, 0.02])
            emergency_cost = emergency * np.random.uniform(5000, 50000)

            net_monthly = actual_income - actual_expenses - emergency_cost

            investment_return = monthly_investment * (
                1 + np.random.normal(0.007, 0.04)
            )

            savings += net_monthly + investment_return
            monthly_data.append(round(savings, 2))

        results.append(monthly_data)

    results_array = np.array(results)

    return {
        "best_case":              round(float(np.percentile(results_array[:, -1], 90)), 2),
        "median_case":            round(float(np.median(results_array[:, -1])), 2),
        "worst_case":             round(float(np.percentile(results_array[:, -1], 10)), 2),
        "bankruptcy_probability": round(float(np.mean(results_array[:, -1] < 0) * 100), 2),
        "expected_1yr":           round(float(np.median(results_array[:, 11])), 2),
        "expected_3yr":           round(float(np.median(results_array[:, 35])), 2),
        "expected_5yr":           round(float(np.median(results_array[:, -1])), 2),
        "monthly_median":         np.median(results_array, axis=0).tolist(),
    }
