from fastapi import FastAPI
from app.database import init_db
from app.routers import users,transactions,summary,budgets

app = FastAPI()
init_db()
  
app.include_router(users.router)
app.include_router(transactions.router)
app.include_router(summary.router)
app.include_router(budgets.router)

    

        
