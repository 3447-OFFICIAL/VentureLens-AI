from fastapi import APIRouter, Depends, HTTPException, status
from app.auth import get_current_user, UserContext
from app.services.captable_service import CapTableService, CapTableSimulationRequest, CapTableSimulationResult
from app.services.financial_service import FinancialHealthService, FinancialHealthRequest, FinancialHealthResult
from app.services.montecarlo_service import MonteCarloService, MonteCarloRequest, MonteCarloResult
from app.services.valuation_service import ValuationService, ValuationRequest, ValuationResult
from app.services.market_intelligence import MarketIntelligenceService, MarketIntelligenceRequest, MarketIntelligenceResult

router = APIRouter(prefix="/valuation", tags=["Valuation & Simulations"])

@router.post("/calculate", response_model=ValuationResult)
def calculate_valuation(
    req: ValuationRequest,
    current_user: UserContext = Depends(get_current_user)
):
    try:
        return ValuationService.analyze(req)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Valuation calculation failed: {str(e)}"
        )

@router.post("/simulate-dilution", response_model=CapTableSimulationResult)
def simulate_dilution(
    req: CapTableSimulationRequest,
    current_user: UserContext = Depends(get_current_user)
):
    try:
        return CapTableService.simulate_dilution(req)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cap Table dilution simulation failed: {str(e)}"
        )

@router.post("/simulate-montecarlo", response_model=MonteCarloResult)
def simulate_montecarlo(
    req: MonteCarloRequest,
    current_user: UserContext = Depends(get_current_user)
):
    try:
        return MonteCarloService.run_simulations(req)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Monte Carlo simulation failed: {str(e)}"
        )

@router.post("/market-intelligence", response_model=MarketIntelligenceResult)
def gather_market_intelligence(
    req: MarketIntelligenceRequest,
    current_user: UserContext = Depends(get_current_user)
):
    try:
        return MarketIntelligenceService.gather_intelligence(req)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Market Intelligence gathering failed: {str(e)}"
        )
