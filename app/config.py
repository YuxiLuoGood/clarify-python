import os

SECRET_KEY = "dev-secret-key"
algorithm = "HS256"
DB_PATH = os.environ.get("DB_PATH","clarify.db")
expire_minutes = 30