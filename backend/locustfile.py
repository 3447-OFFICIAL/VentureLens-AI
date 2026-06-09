from locust import HttpUser, task, between

class VentureLensUser(HttpUser):
    wait_time = between(1, 2)
    
    # In a real environment, we would fetch a valid JWT
    token = "mock_jwt_token_for_load_test"

    @task(3)
    def run_montecarlo(self):
        self.client.post(
            "/api/intelligence/montecarlo",
            json={
                "base_arr": 5000000,
                "base_growth_rate": 0.15,
                "growth_volatility": 0.05,
                "base_churn_rate": 0.02,
                "churn_volatility": 0.01,
                "months": 36,
                "simulations": 1000
            },
            headers={"Authorization": f"Bearer {self.token}"}
        )

    @task(1)
    def generate_report(self):
        # Assuming the /api/reports/generate endpoint expects this
        self.client.post(
            "/api/reports/generate",
            json={"company_id": "test-company-123", "data": {}},
            headers={"Authorization": f"Bearer {self.token}"}
        )
        
    def on_start(self):
        """Prepare user for high concurrency execution."""
        # For a 10,000 concurrent user load test, we'd run locust in distributed mode
        # E.g. `locust -f locustfile.py --worker` across 10-20 instances
        pass
