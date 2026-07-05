def test_health_check(client):
    """
    Ensure the main FastAPI health check returns 200 OK.
    """
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "version": "0.1.0"}

def test_auth_login_unauthorized(client):
    """
    Ensure missing credentials return a 401/422.
    """
    response = client.post("/api/v1/auth/login", data={})
    assert response.status_code == 422 # FastAPI validation error for missing form data
