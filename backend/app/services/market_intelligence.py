from pydantic import BaseModel
from typing import Dict, List, Optional

class MarketIntelligenceRequest(BaseModel):
    company_name: str
    domain: str
    
class MarketIntelligenceResult(BaseModel):
    funding_history: List[Dict[str, str]]
    hiring_trends: Dict[str, str]
    market_momentum: str
    traffic_trends: Dict[str, str]
    customer_sentiment: str
    patent_activity: List[str]
    regulatory_exposure: str
    sources: List[str]

class MarketIntelligenceService:
    @staticmethod
    def gather_intelligence(data: MarketIntelligenceRequest) -> MarketIntelligenceResult:
        # These are stubbed integrations for external providers
        # Crunchbase integration (stub)
        funding_history = [
            {"date": "2023-01-15", "round": "Seed", "amount": "$3M", "investors": "Sequoia Scout"},
            {"date": "2024-05-20", "round": "Series A", "amount": "$15M", "investors": "A16z"}
        ]
        
        # LinkedIn Company Signals (stub)
        hiring_trends = {
            "headcount_growth_6m": "+25%",
            "key_hires": "VP of Engineering from Stripe, CMO from Shopify"
        }
        
        # SimilarWeb / Google Trends (stub)
        traffic_trends = {
            "monthly_visits": "150K",
            "growth_mom": "+12%",
            "top_geography": "United States"
        }
        
        # G2 Reviews / News API (stub)
        customer_sentiment = "Positive overall, highly rated for ease of use but noted lack of enterprise integrations."
        
        # Patent Databases (stub)
        patent_activity = [
            "US20240123456 - System for AI Due Diligence Automation"
        ]
        
        # SEC EDGAR / Regulatory (stub)
        regulatory_exposure = "Low risk. Standard SaaS compliance (SOC2/GDPR)."
        
        return MarketIntelligenceResult(
            funding_history=funding_history,
            hiring_trends=hiring_trends,
            market_momentum="High Growth",
            traffic_trends=traffic_trends,
            customer_sentiment=customer_sentiment,
            patent_activity=patent_activity,
            regulatory_exposure=regulatory_exposure,
            sources=["Crunchbase API", "LinkedIn Scraper Stub", "SimilarWeb Stub", "USPTO Stub"]
        )
