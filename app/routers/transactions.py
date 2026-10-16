from fastapi import APIRouter, HTTPException,Depends
from app.database import get_conn
from app.auth import get_current_user_id
from app.model import Transactions



router = APIRouter(tags = ["transaction"])


@router.post("/transaction")
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

@router.get("/transaction")
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

@router.delete("/transaction/{transaction_id}")
def delete_transaction(transaction_id:int,user_id:int = Depends(get_current_user_id)):
    conn = get_conn()
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM transactions where id = ? and user_id = ?",(transaction_id,user_id))
        deleted = cursor.rowcount
        if deleted == 0:
            raise HTTPException(status_code = 404, detail = "Transaction not found")
        
        conn.commit()
        return {"message":"DELETE SUCCESSFULLY","ID":transaction_id}
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()

@router.put("/transaction/{transaction_id}")
def update_transaction(transaction_id:int, transaction: Transactions,user_id:int = Depends(get_current_user_id)):
    conn = get_conn()
    cursor = conn.cursor()
    try:
        cursor.execute("UPDATE transactions SET description = ?, amount = ?, date = ?, category = ? WHERE id = ? and user_id = ?",(transaction.description,transaction.amount,transaction.date, transaction.category,transaction_id,user_id))
        updated = cursor.rowcount
        if updated == 0:
            raise HTTPException(status_code = 404, detail = "Transaction ID not found")
        
        conn.commit()
        return {"message":"Updated Successfully","Transaction_id":transaction_id} 
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()