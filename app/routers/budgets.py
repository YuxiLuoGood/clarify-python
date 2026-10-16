from fastapi import APIRouter,HTTPException,Depends
from app.auth import get_current_user_id
from datetime import datetime
from app.database import get_conn
from app.model import Budget
from app.validators import month_validate

router = APIRouter(tags=["budget"])


@router.put("/budget")
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

@router.get("/budget/status")
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
        