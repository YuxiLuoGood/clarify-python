from app.config import DATABASE_URL
import psycopg
from psycopg.rows import dict_row


def get_conn():
    return psycopg.connect(DATABASE_URL,row_factory=dict_row)

def init_db():
    conn = get_conn()
    cursor = conn.cursor()
    try:
        cursor.execute("""
                        CREATE TABLE IF NOT EXISTS users(
                        user_id SERIAL PRIMARY KEY,
                        user_name TEXT NOT NULL UNIQUE,
                        password_hash TEXT NOT NULL,
                        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
                    )
                    """)
        cursor.execute("""
                    CREATE TABLE IF NOT EXISTS transactions(
                        id SERIAL PRIMARY KEY,
                        user_id INTEGER NOT NULL REFERENCES users(user_id),
                        description TEXT NOT NULL,
                        amount NUMERIC(12,2) NOT NULL,
                        date DATE NOT NULL,
                        category TEXT NOT NULL
                    )
                    """)
        
        cursor.execute("""
                    CREATE TABLE IF NOT EXISTS budgets(
                        budget_id SERIAL PRIMARY KEY,
                        user_id INTEGER NOT NULL REFERENCES users(user_id),
                        category TEXT NOT NULL,
                        monthly_limit NUMERIC(12,2) NOT NULL,
                        month TEXT NOT NULL,
                        UNIQUE(user_id, category,month)
                    )
                    """)
        conn.commit()
    finally:
        conn.close()
        