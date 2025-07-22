# backend/main.py
import os
from fastapi import FastAPI, Depends
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv() # Load variables from .env file

app = FastAPI()

# Dependency to get a Supabase client
def get_supabase_client() -> Client:
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_KEY")
    return create_client(url, key)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Triathlon Plan API"}

# Placeholder for generating a plan
@app.get("/plan/week")
def get_weekly_plan(supabase: Client = Depends(get_supabase_client)):
    return {
        "week": 1,
        "plan": {
            "monday": {"activity": "Rest"},
            "tuesday": {"activity": "Swim", "details": "1500m"},
            "wednesday": {"activity": "Bike", "details": "45 mins"},
            "thursday": {"activity": "Run", "details": "5k"},
            "friday": {"activity": "Rest"},
            "saturday": {"activity": "Bike", "details": "90 mins"},
            "sunday": {"activity": "Run", "details": "10k long run"}
        }
    }