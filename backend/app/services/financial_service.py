from ..models.db_models import FinancialMetrics
from pydantic import BaseModel

class FinancialHealthRequest(BaseModel):
    arr: float
    mrr: float
    growth_rate: float
    burn_rate: float
    gross_margin: float
    cac: float
    ltv: float
    net_revenue_retention: float

class FinancialHealthResult(BaseModel):
    burn_multiple: float
    rule_of_40: float
    ltv_cac_ratio: float
    runway_months: float
    cash_conversion_cycle_proxy: float # Placeholder if data is missing
    financial_health_score: float
    growth_quality_score: float
    efficiency_score: float
    sustainability_score: float

class FinancialHealthService:
    @staticmethod
    def analyze(data: FinancialHealthRequest, cash_balance: float = 1000000.0) -> FinancialHealthResult:
        # Derived metrics
        net_new_arr = data.arr * data.growth_rate
        burn_multiple = (data.burn_rate * 12) / net_new_arr if net_new_arr > 0 else float('inf')
        
        # Rule of 40 (Growth Rate + EBITDA margin). We proxy EBITDA margin via Gross Margin - Burn as % of ARR.
        estimated_ebitda_margin = data.gross_margin - ((data.burn_rate * 12) / data.arr if data.arr > 0 else 1.0)
        rule_of_40 = (data.growth_rate * 100) + (estimated_ebitda_margin * 100)
        
        ltv_cac_ratio = data.ltv / data.cac if data.cac > 0 else 0
        runway_months = cash_balance / data.burn_rate if data.burn_rate > 0 else float('inf')
        
        # Scoring Logic (0-100)
        # Efficiency Score
        efficiency_score = min(100.0, max(0.0, (ltv_cac_ratio / 3.0) * 100))
        if burn_multiple < 1.5: efficiency_score += 20
        elif burn_multiple > 3.0: efficiency_score -= 20
        efficiency_score = min(100.0, max(0.0, efficiency_score))
        
        # Growth Quality
        growth_quality_score = min(100.0, max(0.0, (data.net_revenue_retention / 1.2) * 100))
        
        # Sustainability
        sustainability_score = min(100.0, max(0.0, (runway_months / 18.0) * 100))
        
        # Overall Financial Health
        health_score = (efficiency_score * 0.4) + (growth_quality_score * 0.4) + (sustainability_score * 0.2)
        
        return FinancialHealthResult(
            burn_multiple=burn_multiple,
            rule_of_40=rule_of_40,
            ltv_cac_ratio=ltv_cac_ratio,
            runway_months=runway_months,
            cash_conversion_cycle_proxy=30.0, # default 30 days
            financial_health_score=health_score,
            growth_quality_score=growth_quality_score,
            efficiency_score=efficiency_score,
            sustainability_score=sustainability_score
        )
