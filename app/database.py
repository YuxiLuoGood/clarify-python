import sqlite3
from app.config import DB_PATH


def get_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
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
        