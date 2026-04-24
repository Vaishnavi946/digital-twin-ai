# Digital Twin — Personal Finance Platform

I built this project to help people understand their financial health better. Most people don't know if they're saving enough, taking too much debt, or whether they'll have enough money in 5 years. Digital Twin tries to solve that.

---

## What it does

You enter your income, expenses, savings and debt. The platform then:

- Runs thousands of simulations to show your possible financial futures
- Gives you a risk score out of 100 with a detailed breakdown
- Predicts where your savings will be in 1, 3 and 5 years
- Explains exactly why your score is what it is — factor by factor
- Lets you chat with an AI advisor for personalized guidance
- Helps you track financial goals like buying a car or building an emergency fund

---

## Tech used

For the frontend I used React with Recharts for all the graphs and charts. Vite for the build setup.

For the backend I used FastAPI in Python. User data is stored in SQLite using SQLAlchemy. Authentication is done with JWT tokens and passwords are hashed with bcrypt.

The AI parts are built with NumPy for the simulations, Prophet by Meta for the savings forecast, and a custom explainability engine that works similar to SHAP used in financial risk systems. The chatbot uses the Claude API by Anthropic.

---

## How to run it

You need Python and Node.js installed.

**Backend:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser. The API docs are at `http://localhost:8000/docs`.

---

## Pages

- Landing page
- Login and Signup
- Onboarding — where you fill in your financial details
- Dashboard — overview of everything
- Future Simulator — runs 1000 scenarios
- Risk Intelligence — your risk score with breakdown
- Savings Forecast — ML prediction for next 1-5 years
- Goals and Budget Planner
- AI Chatbot Advisor
- XAI Explainer — why your score is what it is
- Pricing page


## Project structure
digital-twin-ai/
├── backend/
│   ├── database/        # SQLite setup and user model
│   ├── routers/         # API routes
│   ├── services/        # AI and ML engines
│   └── main.py
├── frontend/
│   └── src/
│       └── pages/       # All 11 React pages
└── README.md

---

## Project structure
