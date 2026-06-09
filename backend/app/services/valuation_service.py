from pydantic import BaseModel
from typing import Dict

class ValuationRequest(BaseModel):
    current_revenue: float
    projected_revenue_year_5: float
    industry_revenue_multiple: float
    target_return_multiple: float
    shares_outstanding: int
    wacc: float
    fcf_projections: list[float] # List of 5 years FCF
    terminal_growth_rate: float

class ValuationResult(BaseModel):
    vc_method_valuation: float
    vc_method_post_money: float
    dcf_enterprise_value: float
    dcf_equity_value: float
    comparables_valuation: float
    blended_base_valuation: float
    bear_valuation: float
    bull_valuation: float

class ValuationService:
    @staticmethod
    def calculate_vc_method(data: ValuationRequest) -> Dict[str, float]:
        exit_value = data.projected_revenue_year_5 * data.industry_revenue_multiple
        post_money_valuation = exit_value / data.target_return_multiple
        # Rough proxy
        pre_money = post_money_valuation * 0.8
        return {
            "exit_value": exit_value,
            "post_money_valuation": post_money_valuation,
            "pre_money_valuation": pre_money
        }

    @staticmethod
    def calculate_dcf(data: ValuationRequest) -> Dict[str, float]:
        # Calculate PV of FCFs
        pv_fcfs = sum(fcf / ((1 + data.wacc) ** (i + 1)) for i, fcf in enumerate(data.fcf_projections))
        
        # Calculate Terminal Value using Gordon Growth Model
        final_year_fcf = data.fcf_projections[-1]
        terminal_value = (final_year_fcf * (1 + data.terminal_growth_rate)) / (data.wacc - data.terminal_growth_rate)
        pv_tv = terminal_value / ((1 + data.wacc) ** 5)
        
        enterprise_value = pv_fcfs + pv_tv
        return {
            "enterprise_value": enterprise_value,
            "equity_value": enterprise_value # assuming 0 debt/cash for simplicity here
        }

    @staticmethod
    def calculate_comparables(data: ValuationRequest) -> float:
        return data.current_revenue * data.industry_revenue_multiple

    @staticmethod
    def analyze(data: ValuationRequest) -> ValuationResult:
        vc_res = ValuationService.calculate_vc_method(data)
        dcf_res = ValuationService.calculate_dcf(data)
        comp_val = ValuationService.calculate_comparables(data)
        
        # Blended valuation (weighting methods)
        blended = (vc_res["post_money_valuation"] * 0.5) + (dcf_res["enterprise_value"] * 0.3) + (comp_val * 0.2)
        
        # Generate scenarios based on standard deviation proxy
        bear_val = blended * 0.70
        bull_val = blended * 1.40
        
        return ValuationResult(
            vc_method_valuation=vc_res["pre_money_valuation"],
            vc_method_post_money=vc_res["post_money_valuation"],
            dcf_enterprise_value=dcf_res["enterprise_value"],
            dcf_equity_value=dcf_res["equity_value"],
            comparables_valuation=comp_val,
            blended_base_valuation=blended,
            bear_valuation=bear_val,
            bull_valuation=bull_val
        )
