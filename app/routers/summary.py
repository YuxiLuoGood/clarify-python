from fastapi import HTTPException, APIRouter,Depends
from app.database import get_conn
from app.auth import get_current_user_id
from app.validators import month_validate


router = APIRouter(tags = ["summary"])


    
        
@router.get("/summary")
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