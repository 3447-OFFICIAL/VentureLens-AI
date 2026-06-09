from app.services.financial_service import FinancialHealthService, FinancialHealthRequest

def test_financial_health_calculation():
    service = FinancialHealthService()
    request = FinancialHealthRequest(
        arr=10_000_000,
        burn_rate=500_000,
        cash_balance=12_000_000,
        gross_margin=0.85,
        yoy_growth=1.2
    )
    result = service.analyze(request)
    
    # Runway = 12M / 0.5M = 24 months
    assert result.runway_months == 24.0
    
    # Burn Multiple = Burn / Net New ARR.
    # Assuming standard simplistic formula for test.
    assert result.burn_multiple is not None
    assert result.health_score > 0
