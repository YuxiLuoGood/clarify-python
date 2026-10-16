from pydantic import BaseModel,Field

class Transactions(BaseModel):
    description: str
    amount: float
    date: str
    category: str
    
class User(BaseModel):
    user_name:str
    password:str

class Budget(BaseModel):
    category:str
    monthly_limit:float = Field(ge = 0)