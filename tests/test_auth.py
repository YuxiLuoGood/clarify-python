def test_register_success(client):
    response = client.post("/register",json = {"user_name":"Tom","password":"123456"})
    assert response.status_code == 200
    assert response.json()["message"] == "user register successfully"
    
def test_register_duplicate(client):
    client.post("/register",json = {"user_name":"Tom","password":"123456"})
    response = client.post("/register",json = {"user_name":"Tom","password":"123456"})
    assert response.status_code == 400
    