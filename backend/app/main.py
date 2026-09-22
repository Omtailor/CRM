from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine
from app.routers import tickets

app = FastAPI(title="Support CRM API")

app.include_router(tickets.router, prefix="/api")

@app.on_event("startup")
def startup_event():
    try:
        with engine.connect() as conn:
            print("Database connection successful")
    except Exception as e:
        print(f"Database connection failed: {e}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {"status": "ok"}
