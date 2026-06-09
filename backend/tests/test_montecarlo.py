from app.services.montecarlo_service import MonteCarloService, MonteCarloRequest

def test_montecarlo_simulation_benchmark():
    service = MonteCarloService()
    request = MonteCarloRequest(
        base_arr=1_000_000,
        base_growth_rate=0.20,
        growth_volatility=0.10,
        base_churn_rate=0.05,
        churn_volatility=0.02,
        months=12,
        simulations=5000
    )
    result = service.run_simulations(request)
    
    assert len(result.percentile_10) == 12
    assert len(result.percentile_50) == 12
    assert len(result.percentile_90) == 12
    # The median ARR at the end of the year should be higher than base_arr due to 20% growth vs 5% churn
    assert result.percentile_50[-1] > 1_000_000
    assert 0 <= result.bankruptcy_probability <= 100
