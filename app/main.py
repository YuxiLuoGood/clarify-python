from fastapi import FastAPI
from app.database import init_db
from app.routers import users,transactions,summary,budgets
from fastapi.middleware.cors import CORSMiddleware
from app.config import FRONTEND_ORIGIN


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_ORIGIN],
    allow_methods=["*"],
    allow_headers=["*"],
)

init_db()
  
app.include_router(users.router)
app.include_router(transactions.router)
app.include_router(summary.router)
app.include_router(budgets.router)

    

        
