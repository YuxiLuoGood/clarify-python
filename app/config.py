import os
import dotenv

dotenv.load_dotenv()

DATABASE_URL = os.environ["DATABASE_URL"]

SECRET_KEY = os.environ["SECRET_KEY"]
FRONTEND_ORIGIN = os.environ.get("FRONTEND_ORIGIN","http://localhost:5173")
ALGORITHM = "HS256"
EXPIRE_MINUTES = 60