from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from pydantic import BaseModel
from typing import List, Optional
from app.database import get_db_session
from app.models.models import Startup, VCFirm, Metric, Portfolio
from app.auth import get_current_user, UserContext, require_roles

router = APIRouter(prefix="/startups", tags=["Startups"])

class StartupResponse(BaseModel):
    id: str
    name: str
    domain: Optional[str] = None
    vc_firm_id: str

    class Config:
        orm_mode = True

class MetricResponse(BaseModel):
    timestamp: str
    arr: float
    mrr: float
    growth_rate: float
    burn_rate: float

@router.get("", response_model=List[StartupResponse])
async def list_startups(
    db: AsyncSession = Depends(get_db_session),
    current_user: UserContext = Depends(get_current_user)
):
    # Retrieve VC Firms belonging to the user's organization to ensure tenant-level isolation
    vc_result = await db.execute(
        select(VCFirm.id).where(VCFirm.organization_id == current_user.organization_id)
    )
    vc_firm_ids = vc_result.scalars().all()
    
    if not vc_firm_ids:
        return []
        
    # Query startups matching these VC firm IDs
    result = await db.execute(
        select(Startup).where(Startup.vc_firm_id.in_(vc_firm_ids))
    )
    return result.scalars().all()

@router.get("/{id}/metrics", response_model=List[MetricResponse])
async def get_startup_metrics(
    id: str,
    db: AsyncSession = Depends(get_db_session),
    current_user: UserContext = Depends(get_current_user)
):
    # Verify the startup belongs to user's tenant organization
    vc_result = await db.execute(
        select(VCFirm.id).where(VCFirm.organization_id == current_user.organization_id)
    )
    vc_firm_ids = vc_result.scalars().all()
    
    startup_check = await db.execute(
        select(Startup).where(Startup.id == id, Startup.vc_firm_id.in_(vc_firm_ids))
    )
    startup = startup_check.scalars().first()
    if not startup:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Startup profile not found"
        )
        
    # Query metrics via Portfolio link
    metrics_result = await db.execute(
        select(Metric)
        .join(Portfolio, Portfolio.id == Metric.portfolio_id)
        .where(Portfolio.startup_id == id)
        .order_by(Metric.timestamp.asc())
    )
    metrics = metrics_result.scalars().all()
    
    return [
        MetricResponse(
            timestamp=m.timestamp.isoformat(),
            arr=float(m.arr),
            mrr=float(m.mrr),
            growth_rate=float(m.growth_rate),
            burn_rate=float(m.burn_rate)
        )
        for m in metrics
    ]
