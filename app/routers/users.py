from fastapi import HTTPException,APIRouter
import sqlite3
from app.database import get_conn
from app.model import User
from app.auth import create_access_token
import bcrypt

router = APIRouter(tags= ["user"])

@router.post("/login")
def check_login(user:User):
    conn = get_conn()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT password_hash, user_id FROM users WHERE user_name = ?",(user.user_name,))
        output = cursor.fetchone()
        if output is None :
            raise HTTPException(status_code=401,detail="Invalid user name or password.")
        if bcrypt.checkpw(user.password.encode("utf-8"),output["password_hash"].encode("utf-8")):
            token = create_access_token(output["user_id"])
            return {"access_token":token,"token_type":"bearer"}
        else:
            raise HTTPException(status_code=401,detail="Invalid user name or password.")
    finally:
        conn.close()
    
    

@router.post("/register")
def add_user(user: User):
    conn = get_conn()
    cursor = conn.cursor()
    try:
        hash1 = bcrypt.hashpw(user.password.encode("utf-8"),bcrypt.gensalt())
        password_hash = hash1.decode("utf-8")
        cursor.execute("INSERT INTO users(user_name,password_hash) VALUES(?,?)",(user.user_name,password_hash))
        conn.commit()
        return {"message":"user register successfully"}
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400,detail="User name exists")
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()    