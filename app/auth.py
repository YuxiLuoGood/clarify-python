import jwt
from app.config import SECRET_KEY,algorithm,expire_minutes
from datetime import datetime,timedelta,timezone
from fastapi import Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi import HTTPException


bear_scheme = HTTPBearer()

def create_access_token(user_id):
    payload = {
        "sub":str(user_id),
        "exp":datetime.now(timezone.utc)+timedelta(minutes=expire_minutes)
    }
    token = jwt.encode(payload, SECRET_KEY,algorithm=algorithm)
    return token

def get_current_user_id(credentials: HTTPAuthorizationCredentials = Depends(bear_scheme)):
    token = credentials.credentials
    try:
        decoded = jwt.decode(token,SECRET_KEY,algorithms = [algorithm])
        return int(decoded["sub"])
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401,detail="Token expired or not allowed")