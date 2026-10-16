def get_token(client,user_name,password = "123456"):
    client.post("/register",json = {"user_name" : user_name,"password" : password})
    response = client.post("/login",json = {"user_name" : user_name,"password" : password})
    return response.json()["access_token"]

def auth_header(token):
    return {"Authorization":f"Bearer {token}"}

def test_set_budget_success(client):
    token1 = get_token(client,"Tom","123456")
    response1 = client.put("/budget",headers = auth_header(token1),json = {"category":"Food","monthly_limit":500})
    response2 = client.put("/budget",headers = auth_header(token1),json = {"category":"Transportation","monthly_limit":120})
    assert response1.json()["message"] == "Set budget successfully."
    assert response2.json()["message"] == "Set budget successfully."
    assert response1.status_code == 200
    assert response2.status_code == 200

def test_set_budget_wrong_format(client):
    token1 = get_token(client,"Tom","123456")
    response = client.put("/budget",headers = auth_header(token1),json = {"category":"Food","monthly_limit":-500})
    assert response.status_code == 422

def test_budget_status_success(client):
    token1 = get_token(client,"Tom","123456")
    token2 = get_token(client,"Amy","123")
    client.put("/budget",headers = auth_header(token1),json = {"category":"food","monthly_limit":500})
    client.put("/budget",headers = auth_header(token1),json = {"category":"transportation","monthly_limit":120})
    client.put("/budget",headers = auth_header(token1),json = {"category":"food","monthly_limit":400})
    client.post("/transaction",headers = auth_header(token1),json = {"description":"popeyes","amount":12,"date":"2026-10-12","category":"food"})
    client.post("/transaction",headers = auth_header(token1),json = {"description":"popeyes","amount":18,"date":"2026-09-12","category":"food"})
    response = client.get("/budget/status",headers = auth_header(token1),params = {"month":"2026-10"})
    response2 = client.get("/budget/status",headers = auth_header(token2),params = {"month":"2026-10"})
    response3 = client.get("/budget/status",headers = auth_header(token2),params = {"month":"2026-13"})
    data = {row["category"]:row for row in response.json()} 
    assert data["food"]["remaining"] == 388
    assert data["transportation"]["remaining"] == 120
    assert len(response.json()) == 2
    assert response2.json() == []
    assert response3.status_code == 400
    


    
    
    
    