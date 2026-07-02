from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_forget_me_invalid_confirmation():
    response = client.delete(
        "/api/privacy/forget_me",
        json={"confirmation_text": "yes"}
    )
    assert response.status_code == 400
    assert "Invalid confirmation text" in response.json()["detail"]

def test_forget_me_valid_confirmation():
    response = client.delete(
        "/api/privacy/forget_me",
        json={"confirmation_text": "PERMANENTLY_DELETE_MY_DATA"}
    )
    assert response.status_code == 202
    assert response.json()["status"] == "accepted"
