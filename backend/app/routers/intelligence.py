from fastapi import APIRouter, Depends, HTTPException, Request
from ..core.limiter import limiter
from ..services.financial_service import FinancialHealthService, FinancialHealthRequest, FinancialHealthResult
from ..services.valuation_service import ValuationService, ValuationRequest, ValuationResult
from ..services.market_intelligence import MarketIntelligenceService, MarketIntelligenceRequest, MarketIntelligenceResult

from ..auth import verify_clerk_token, require_role, UserContext
import asyncio

router = APIRouter(
    prefix="/api/intelligence", 
    tags=["intelligence"],
    dependencies=[Depends(verify_clerk_token)]
)

@router.post("/financial", response_model=FinancialHealthResult)
async def analyze_financials(
    request: FinancialHealthRequest,
    current_user: UserContext = Depends(require_role(["admin", "analyst"]))
):
    try:
        service = FinancialHealthService()
        result = await asyncio.to_thread(service.analyze, request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/valuation", response_model=ValuationResult)
async def analyze_valuation(
    request: ValuationRequest,
    current_user: UserContext = Depends(require_role(["admin", "analyst"]))
):
    try:
        service = ValuationService()
        result = await asyncio.to_thread(service.analyze, request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/market", response_model=MarketIntelligenceResult)
async def analyze_market(
    request: MarketIntelligenceRequest,
    current_user: UserContext = Depends(require_role(["admin", "analyst"]))
):
    try:
        service = MarketIntelligenceService()
        result = await asyncio.to_thread(service.gather_intelligence, request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

from ..services.captable_service import CapTableService, CapTableSimulationRequest, CapTableSimulationResult

@router.post("/captable", response_model=CapTableSimulationResult)
async def simulate_captable(
    request: CapTableSimulationRequest,
    current_user: UserContext = Depends(require_role(["admin", "analyst"]))
):
    try:
        service = CapTableService()
        result = await asyncio.to_thread(service.simulate_dilution, request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

from ..services.montecarlo_service import MonteCarloService, MonteCarloRequest, MonteCarloResult

@router.post("/montecarlo", response_model=MonteCarloResult)
@limiter.limit("5/minute")
async def simulate_montecarlo(
    data: MonteCarloRequest, 
    request: Request,
    current_user: UserContext = Depends(require_role(["admin", "analyst"]))
):
    try:
        service = MonteCarloService()
        result = await asyncio.to_thread(service.run_simulations, data)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
