from datetime import datetime
from fastapi import HTTPException

def month_validate(month:str):
    try:
        datetime.strptime(month,"%Y-%m")
    except ValueError:
        raise HTTPException(status_code= 400, detail="Month format error.")