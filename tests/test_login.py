def test_login_success(client):
    client.post("/register",json = {"user_name":"Tom","password":"123456"})
    response = client.post("/login",json = {"user_name":"Tom","password":"123456"})
    assert response.status_code == 200

def test_login_wrong_password(client):
    client.post("/register",json = {"user_name":"Tom","password":"123456"})
    response = client.post("/login",json = {"user_name":"Tom","password":"123"})
    assert response.status_code == 401