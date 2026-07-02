from app.services.financial_service import FinancialHealthService, FinancialHealthRequest

def test_financial_health_calculation():
    service = FinancialHealthService()
    request = FinancialHealthRequest(
        arr=10_000_000,
        mrr=833_333,
        growth_rate=1.2,
        burn_rate=500_000,
        gross_margin=0.85,
        cac=5000,
        ltv=25000,
        net_revenue_retention=1.2
    )
    result = service.analyze(request, cash_balance=12_000_000)
    
    # Runway = 12M / 0.5M = 24 months
    assert result.runway_months == 24.0
    
    # Burn Multiple = Burn / Net New ARR.
    # Net new ARR = 10M * 1.2 = 12M.
    # Burn = 500K * 12 = 6M.
    # Burn multiple = 6M / 12M = 0.5.
    assert result.burn_multiple == 0.5
    assert result.financial_health_score > 0
