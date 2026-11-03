import os
import dotenv
dotenv.load_dotenv()
os.environ["DATABASE_URL"] = os.environ["TEST_DATABASE_URL"]

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import get_conn

@pytest.fixture
def client():
    conn = get_conn()
    conn.execute("TRUNCATE transactions,users,budgets RESTART IDENTITY CASCADE ")
    conn.commit()
    conn.close()
    return TestClient(app)
    