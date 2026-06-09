from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_auth_no_token():
    response = client.post("/api/intelligence/montecarlo", json={"base_arr": 10000, "base_growth_rate": 0.2, "growth_volatility": 0.1, "base_churn_rate": 0.05, "churn_volatility": 0.02})
    assert response.status_code == 403 # HTTPBearer missing

def test_auth_invalid_token():
    response = client.post(
        "/api/intelligence/montecarlo", 
        json={"base_arr": 10000, "base_growth_rate": 0.2, "growth_volatility": 0.1, "base_churn_rate": 0.05, "churn_volatility": 0.02},
        headers={"Authorization": "Bearer invalid_token"}
    )
    # Our PyJWT logic will fail fetching JWKS or decoding
    assert response.status_code == 401
