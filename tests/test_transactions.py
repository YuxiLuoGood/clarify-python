def get_token(client,user_name,password = "123456"):
    client.post("/register",json = {"user_name":user_name,"password":password})
    response = client.post("/login",json = {"user_name":user_name,"password":password})
    return response.json()["access_token"]

def auth_header(token):
    return {"Authorization":f"Bearer {token}"}



def test_get_transaction_without_token(client):
    response = client.get("/transaction")
    assert response.status_code == 401

def test_get_transaction(client):
    token1 = get_token(client,"Tom",password="123456")
    client.post("/transaction",headers = auth_header(token1),json = {"description":"popeyes","amount":12,"date":"2026-10-12","category":"food"})
    token2 = get_token(client,"Amy",password="123456")
    client.post("/transaction",headers = auth_header(token2),json = {"description":"Mcdonalds","amount":7,"date":"2026-10-12","category":"food"})
    response = client.get("/transaction",headers = auth_header(token1))
    assert len(response.json()) == 1
    assert response.json()[0]["description"] == "popeyes"

def test_delete_success(client):
    token1 = get_token(client,"Tom",password="123456")
    client.post("/transaction",headers = auth_header(token1),json = {"description":"popeyes","amount":12,"date":"2026-10-12","category":"food"})
    response = client.get("/transaction",headers = auth_header(token1))
    transaction_id = response.json()[0]["id"]
    response = client.delete(f"/transaction/{transaction_id}",headers = auth_header(token1))
    assert response.json()["message"] == "DELETE SUCCESSFULLY"
    
def test_delete_transaction_others_id(client):
    token1 = get_token(client,"Tom",password="123456")
    token2 = get_token(client,"Amy",password="123456")
    client.post("/transaction",headers = auth_header(token1),json = {"description":"popeyes","amount":12,"date":"2026-10-12","category":"food"})
    response = client.get("/transaction",headers = auth_header(token1))
    transaction_id = response.json()[0]["id"]
    response = client.delete(f"/transaction/{transaction_id}",headers = auth_header(token2))
    assert response.status_code == 404
    response = client.get("/transaction",headers = auth_header(token1))
    assert len(response.json()) == 1
    
def test_update_success(client):
    token1 = get_token(client,"Tom",password="123456")
    client.post("/transaction",headers = auth_header(token1),json = {"description":"popeyes","amount":12,"date":"2026-10-12","category":"food"})
    response = client.get("/transaction",headers = auth_header(token1))
    transaction_id = response.json()[0]["id"]
    response = client.put(f"/transaction/{transaction_id}",headers = auth_header(token1),json = {"description":"popeyes","amount":28,"date":"2026-10-12","category":"food"})
    assert response.json()["message"] == "Updated Successfully"

def test_update_others_id(client):
    token1 = get_token(client,"Tom",password="123456")
    token2 = get_token(client,"Amy",password="123456")
    client.post("/transaction",headers = auth_header(token1),json = {"description":"popeyes","amount":12,"date":"2026-10-12","category":"food"})
    response = client.get("/transaction",headers = auth_header(token1))
    transaction_id = response.json()[0]["id"]
    response = client.put(f"/transaction/{transaction_id}",headers = auth_header(token2),json = {"description":"popeyes","amount":28,"date":"2026-10-12","category":"food"})
    assert response.status_code == 404
    response = client.get("/transaction",headers = auth_header(token1))
    assert response.json()[0]["amount"] == 12
    
    
    