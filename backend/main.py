from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import finance, predict, simulate, auth, xai
from database.database import engine
from database import models

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Digital Twin API",
    description="AI Financial Digital Twin — Simulation & Prediction Engine",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router,     prefix="/api/auth",     tags=["Auth"])
app.include_router(finance.router,  prefix="/api/finance",  tags=["Finance"])
app.include_router(predict.router,  prefix="/api/predict",  tags=["Prediction"])
app.include_router(simulate.router, prefix="/api/simulate", tags=["Simulation"])
app.include_router(xai.router,      prefix="/api/xai",      tags=["XAI"])

@app.get("/")
def root():
    return {"message": "Digital Twin API is running"}