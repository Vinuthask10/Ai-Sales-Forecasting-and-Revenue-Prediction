from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

import models
from database import engine, get_db
from routers import forecast

# Create all database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Ai Sales Forecasting Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(forecast.router)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "EpicurePredict API is running"}

@app.get("/api/branches")
def get_branches(db: Session = Depends(get_db)):
    branches = db.query(models.Branch).all()
    return branches

@app.post("/api/branches")
def create_branch(name: str, location: str, db: Session = Depends(get_db)):
    db_branch = models.Branch(name=name, location=location)
    db.add(db_branch)
    db.commit()
    db.refresh(db_branch)
    return db_branch
