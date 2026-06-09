from pydantic import BaseModel
from typing import List

class CapTableEntryInput(BaseModel):
    shareholder_name: str
    share_class: str
    shares_owned: int

class CapTableSimulationRequest(BaseModel):
    current_cap_table: List[CapTableEntryInput]
    new_investment_amount: float
    pre_money_valuation: float
    option_pool_increase_percentage: float # e.g. 0.10 for 10%

class CapTableSimulationResult(BaseModel):
    post_money_valuation: float
    price_per_share: float
    new_shares_issued: int
    option_pool_shares_added: int
    total_post_money_shares: int
    simulated_cap_table: List[dict]

class CapTableService:
    @staticmethod
    def simulate_dilution(data: CapTableSimulationRequest) -> CapTableSimulationResult:
        current_total_shares = sum(entry.shares_owned for entry in data.current_cap_table)
        
        # Prevent div by zero
        if current_total_shares == 0:
            return CapTableSimulationResult(
                post_money_valuation=0, price_per_share=0, new_shares_issued=0, 
                option_pool_shares_added=0, total_post_money_shares=0, simulated_cap_table=[]
            )

        price_per_share = data.pre_money_valuation / current_total_shares
        post_money_valuation = data.pre_money_valuation + data.new_investment_amount
        
        # Calculate new shares issued to investors
        new_shares_issued = int(data.new_investment_amount / price_per_share)
        
        # Calculate target option pool based on post-money shares
        # target_pool_shares = option_pool_increase_percentage * total_post_money_shares
        # total_post_money_shares = current_total_shares + new_shares_issued + target_pool_shares
        # total_post_money_shares * (1 - option_pool_increase_percentage) = current_total_shares + new_shares_issued
        # total_post_money_shares = (current_total_shares + new_shares_issued) / (1 - option_pool_increase_percentage)
        
        total_post_money_shares = int((current_total_shares + new_shares_issued) / (1 - data.option_pool_increase_percentage))
        option_pool_shares_added = total_post_money_shares - current_total_shares - new_shares_issued
        
        # Build simulated cap table
        simulated_cap_table = []
        for entry in data.current_cap_table:
            simulated_cap_table.append({
                "shareholder_name": entry.shareholder_name,
                "share_class": entry.share_class,
                "shares_owned": entry.shares_owned,
                "ownership_percentage": (entry.shares_owned / total_post_money_shares) * 100
            })
            
        simulated_cap_table.append({
            "shareholder_name": "New Investors (Series X)",
            "share_class": "Preferred",
            "shares_owned": new_shares_issued,
            "ownership_percentage": (new_shares_issued / total_post_money_shares) * 100
        })
        
        simulated_cap_table.append({
            "shareholder_name": "New Option Pool Expansion",
            "share_class": "Common",
            "shares_owned": option_pool_shares_added,
            "ownership_percentage": (option_pool_shares_added / total_post_money_shares) * 100
        })
        
        return CapTableSimulationResult(
            post_money_valuation=post_money_valuation,
            price_per_share=price_per_share,
            new_shares_issued=new_shares_issued,
            option_pool_shares_added=option_pool_shares_added,
            total_post_money_shares=total_post_money_shares,
            simulated_cap_table=simulated_cap_table
        )
