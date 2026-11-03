from pydantic import BaseModel,Field,ConfigDict,StringConstraints
from typing import Annotated
from decimal import Decimal
from datetime import date as d

class Transactions(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    description: str = Field(min_length=1)
    amount: Decimal = Field(max_digits=12,decimal_places=2)
    date: d 
    category: str = Field(min_length=1)

class UserRegister(BaseModel):
    user_name: Annotated[str, StringConstraints(strip_whitespace=True, min_length=1)]
    password: str = Field(min_length=6)
class UserLogin(BaseModel):
    user_name: str
    password: str 

class Budget(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    category:str = Field(str_strip_whitespace = True,min_length=1)
    monthly_limit:Decimal = Field(ge = 0,max_digits=12,decimal_places=2)
    month:str