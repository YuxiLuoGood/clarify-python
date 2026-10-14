from fastapi import FastAPI
from fastapi import HTTPException
from pydantic import BaseModel,Field
import json
import os
import sqlite3
import bcrypt
import jwt
from datetime import datetime,timedelta,timezone
from fastapi import Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials


SECRET_KEY = "dev-secret-key"
algorithm = "HS256"
bear_scheme = HTTPBearer()
DB_PATH = os.environ.get("DB_PATH","clarify.db")

app = FastAPI()

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
    
def get_conn():
    conn = sqlite3.connect("DB_PATH")
    conn.row_factory = sqlite3.Row
    return conn

def create_access_token(user_id):
    payload = {
        "sub":str(user_id),
        "exp":datetime.now(timezone.utc)+timedelta(minutes=30)
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
    
def month_validate(month:str):
    try:
        datetime.strptime(month,"%Y-%m")
    except ValueError:
        raise HTTPException(status_code= 400, detail="Month format error.")

#test###
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users")
    for row in cursor.fetchall():
        print(dict(row))
    conn.close()
###

conn = get_conn()
cursor = conn.cursor()
try:
    cursor.execute("""
                CREATE TABLE IF NOT EXISTS transactions(
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL REFERENCES users(user_id),
                    description TEXT NOT NULL,
                    amount REAL NOT NULL,
                    date TEXT NOT NULL,
                    category TEXT NOT NULL
                )
                """)
    cursor.execute("""
                CREATE TABLE IF NOT EXISTS users(
                    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_name TEXT NOT NULL UNIQUE,
                    password_hash TEXT NOT NULL,
                    created_at TEXT DEFAULT CURRENT_TIMESTAMP
                )
                """)
    cursor.execute("""
                CREATE TABLE IF NOT EXISTS budgets(
                    budget_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL REFERENCES users(user_id),
                    category TEXT NOT NULL,
                    monthly_limit REAL NOT NULL,
                    UNIQUE(user_id, category)
                )
                """)
    conn.commit()
finally:
    conn.close()
    
@app.post("/login")
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
    
    

@app.post("/register")
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

@app.post("/transaction")
def create_transaction(transaction:Transactions,user_id:int = Depends(get_current_user_id)):
    conn = get_conn()
    cursor = conn.cursor()
    try:
        cursor.execute("INSERT INTO transactions(user_id,description,amount,date,category) VALUES(?,?,?,?,?)",(user_id,transaction.description,transaction.amount,transaction.date,transaction.category))
        conn.commit()
        return {"message": "Transaction created successfully."}
    except Exception:
        conn.rollback()
        raise
    finally:
         conn.close()

@app.get("/transaction")
def get_transaction(user_id:int = Depends(get_current_user_id)):
    conn = get_conn()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT * FROM transactions WHERE user_id =?",(user_id,))
        output = cursor.fetchall()
        result = []
        for out in output:
            out = dict(out)
            result.append(out)

        return result
    except Exception:
        raise
    finally:
        conn.close()

@app.delete("/transaction/{transaction_id}")
def delete_transaction(transaction_id:int,user_id:int = Depends(get_current_user_id)):
    conn = get_conn()
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM transactions where id = ? and user_id = ?",(transaction_id,user_id))
        deleted = cursor.rowcount
        if deleted == 0:
            raise HTTPException(status_code = 404, detail = "Transaction not found")
        else:
            conn.commit()
            return {"message":"DELETE SUCCESSFULLY","ID":transaction_id}
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()

@app.put("/transaction/{transaction_id}")
def update_transaction(transaction_id:int, transaction: Transactions,user_id:int = Depends(get_current_user_id)):
    conn = get_conn()
    cursor = conn.cursor()
    try:
        cursor.execute("UPDATE transactions SET description = ?, amount = ?, date = ?, category = ? WHERE id = ? and user_id = ?",(transaction.description,transaction.amount,transaction.date, transaction.category,transaction_id,user_id))
        updated = cursor.rowcount
        if updated == 0:
            raise HTTPException(status_code = 404, detail = "Transaction ID not found")
        else:
            conn.commit()
            return {"message":"Updated Successfully","Transaction_id":transaction_id} 
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()
        
@app.get("/summary")
def get_month_summary(month, category = None, user_id:int = Depends(get_current_user_id)):
    month_validate(month)
    conn = get_conn()
    cursor = conn.cursor()
    try:
        sql = "SELECT category, SUM(amount) AS total FROM transactions WHERE user_id = ? and strftime('%Y-%m',date)= ?"
        params = [user_id,month]
        if category != None:
            sql+= "AND category = ?"
            params.append(category)
        #cursor.execute("SELECT category, SUM(amount) AS total FROM transactions WHERE user_id = ? and strftime('%Y-%m',date)= ? GROUP BY category",(user_id,month))
        sql+="GROUP BY category"
        cursor.execute(sql,params)
        output = cursor.fetchall()
        result = []
        for row in output:
            row = dict(row)
            result.append(row)
        return result
    finally:
        conn.close()
        
@app.put("/budget")
def set_budget(budget: Budget, user_id : int = Depends(get_current_user_id)):
    conn = get_conn()
    try:
        cursor = conn.cursor()
        cursor.execute("""INSERT INTO budgets(user_id,category,monthly_limit) VALUES (?,?,?) 
                       ON CONFLICT(user_id,category) DO UPDATE SET monthly_limit = excluded.monthly_limit"""
                       ,(user_id,budget.category,budget.monthly_limit))
        conn.commit()
        return {"message":"Set budget successfully."}
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()

@app.get("/budget/status")
def get_status(month,user_id:int = Depends(get_current_user_id)):
    month_validate(month)
    conn = get_conn()
    try:
        cursor = conn.cursor()
        cursor.execute("""
                    SELECT b.category,b.monthly_limit,COALESCE(t.total,0) AS total
                    FROM budgets AS b
                    LEFT JOIN(
                        SELECT category, SUM(amount) AS total
                        FROM transactions
                        WHERE user_id =? AND strftime('%Y-%m',date) = ?
                        GROUP BY category
                    ) AS t 
                        ON b.category = t.category
                    WHERE b.user_id = ? 
                    ORDER BY b.category
                    """,(user_id,month,user_id))
        output = cursor.fetchall()
        result = []
        for out in output:
            remaining = out["monthly_limit"]-out["total"]
            category = out["category"]
            result.append({"category":category,"monthly_limit":out["monthly_limit"],"spent":out["total"],"remaining":remaining})
        return result
    except Exception:
        raise  
    finally:
        conn.close()
        