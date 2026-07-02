from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_auth_no_token():
    response = client.get("/api/v1/startups")
    assert response.status_code == 401

def test_auth_invalid_token():
    response = client.get(
        "/api/v1/startups",
        headers={"Authorization": "Bearer invalid_token"}
    )
    assert response.status_code == 401

def test_login_invalid_credentials():
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "wrong@vc.com", "password": "wrongpassword"}
    )
    assert response.status_code == 401
