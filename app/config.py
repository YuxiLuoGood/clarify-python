import os
import dotenv

dotenv.load_dotenv()

DATABASE_URL = os.environ["DATABASE_URL"]

SECRET_KEY = os.environ.get("SECRET_KEY","c3b03c1e3381384575af12386117f894d3fb8bac6e0783fc5b43f2146747d613")
FRONTEND_ORIGIN = os.environ.get("FRONTEND_ORIGIN","http://localhost:5173")
ALGORITHM = "HS256"
EXPIRE_MINUTES = 5