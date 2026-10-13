def get_token(client,user_name,password = "123456"):
    client.post("/register",json = {"user_name":user_name,"password":password})
    response = client.post("/login",json = {"user_name":user_name,"password":password})
    return response.json()["access_token"]

def auth_header(token):
    return {"Authorization":f"Bearer {token}"}

def test_summary_success_without_category(client):
    token1 = get_token(client,"Tom",password="123456")
    client.post("/transaction",headers = auth_header(token1),json = {"description":"popeyes","amount":12,"date":"2026-10-12","category":"food"})
    client.post("/transaction",headers = auth_header(token1),json = {"description":"popeyes","amount":18,"date":"2026-10-09","category":"food"})
    client.post("/transaction",headers = auth_header(token1),json = {"description":"grocery","amount":58,"date":"2026-10-09","category":"shopping"})
    client.post("/transaction",headers = auth_header(token1),json = {"description":"grocery","amount":58,"date":"2026-09-09","category":"shopping"})  
    response = client.get("/summary",headers = auth_header(token1),params = {"month":"2026-10"})
    assert response.json()[0]["total"] == 30
    assert response.json()[0]["category"] == "food"
    assert len(response.json()) == 2
    
def test_summary_wrong_format_month(client):
    token1 = get_token(client,"Tom",password="123456")
    client.post("/transaction",headers = auth_header(token1),json = {"description":"popeyes","amount":12,"date":"2026-10-12","category":"food"})
    client.post("/transaction",headers = auth_header(token1),json = {"description":"popeyes","amount":18,"date":"2026-10-09","category":"food"})
    client.post("/transaction",headers = auth_header(token1),json = {"description":"grocery","amount":58,"date":"2026-10-09","category":"shopping"})
    client.post("/transaction",headers = auth_header(token1),json = {"description":"grocery","amount":58,"date":"2026-09-09","category":"shopping"})  
    response = client.get("/summary",headers = auth_header(token1),params = {"month":"2026"})
    assert response.status_code == 400
    
def test_summary_with_month_category_success(client):
    token1 = get_token(client,"Tom",password="123456")
    client.post("/transaction",headers = auth_header(token1),json = {"description":"popeyes","amount":12,"date":"2026-10-12","category":"food"})
    client.post("/transaction",headers = auth_header(token1),json = {"description":"popeyes","amount":18,"date":"2026-10-09","category":"food"})
    client.post("/transaction",headers = auth_header(token1),json = {"description":"grocery","amount":58,"date":"2026-10-09","category":"shopping"})
    client.post("/transaction",headers = auth_header(token1),json = {"description":"grocery","amount":58,"date":"2026-09-09","category":"shopping"})  
    response = client.get("/summary",headers = auth_header(token1),params = {"month":"2026-10","category":"food"})
    assert response.json()[0]["total"] == 30
    assert response.json()[0]["category"] == "food"
    assert len(response.json()) == 1   

def test_summary_with_month_no_transaction(client):
    token1 = get_token(client,"Tom",password="123456")
    client.post("/transaction",headers = auth_header(token1),json = {"description":"popeyes","amount":12,"date":"2026-10-12","category":"food"})
    client.post("/transaction",headers = auth_header(token1),json = {"description":"popeyes","amount":18,"date":"2026-10-09","category":"food"})
    client.post("/transaction",headers = auth_header(token1),json = {"description":"grocery","amount":58,"date":"2026-10-09","category":"shopping"})
    client.post("/transaction",headers = auth_header(token1),json = {"description":"grocery","amount":58,"date":"2026-09-09","category":"shopping"})  
    response = client.get("/summary",headers = auth_header(token1),params = {"month":"2026-12","category":"food"})
    assert len(response.json()) == 0   
    
    
