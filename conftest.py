import os
os.environ["DB_PATH"] = "test.db"

import pytest
from fastapi.testclient import TestClient
from clarify import app, get_conn

@pytest.fixture
def client():
    conn = get_conn()
    conn.execute("DELETE FROM transactions")
    conn.execute("DELETE FROM users")
    conn.commit()
    conn.close()
    return TestClient(app)
    