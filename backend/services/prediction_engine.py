import pandas as pd
from prophet import Prophet
from typing import Dict

def predict_savings(
    monthly_income: float,
    monthly_expenses: float,
    current_savings: float,
    monthly_investment: float,
    months: int = 36
) -> Dict:

    # Build historical data (last 12 months simulated)
    net_monthly = monthly_income - monthly_expenses + monthly_investment
    history = []
    for i in range(12):
        history.append({
            "ds": pd.Timestamp.today() - pd.DateOffset(months=12 - i),
            "y":  current_savings + (net_monthly * i)
        })

    df = pd.DataFrame(history)

    model = Prophet(
        yearly_seasonality=False,
        weekly_seasonality=False,
        daily_seasonality=False,
        interval_width=0.80
    )
    model.fit(df)

    future    = model.make_future_dataframe(periods=months, freq="MS")
    forecast  = model.predict(future)

    future_only = forecast.tail(months)

    return {
        "months":     months,
        "predicted":  round(future_only["yhat"].iloc[-1], 2),
        "upper":      round(future_only["yhat_upper"].iloc[-1], 2),
        "lower":      round(future_only["yhat_lower"].iloc[-1], 2),
        "monthly_forecast": [
            {
                "month": row["ds"].strftime("%b %Y"),
                "value": round(row["yhat"], 2)
            }
            for _, row in future_only.iterrows()
        ]
    }
