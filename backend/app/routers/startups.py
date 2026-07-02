from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from pydantic import BaseModel
from typing import List, Optional
from app.database import get_db_session
from app.models.models import Startup, VCFirm, Metric, Portfolio, Task, Document
from app.auth import get_current_user, UserContext, require_roles

router = APIRouter(prefix="/startups", tags=["Startups"])

class SearchResultItem(BaseModel):
    id: str
    type: str # startup, task, document
    title: str
    subtitle: Optional[str] = None

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

class CreateStartupRequest(BaseModel):
    name: str
    domain: Optional[str] = None
    vc_firm_id: Optional[str] = None

class UpdateStartupRequest(BaseModel):
    name: Optional[str] = None
    domain: Optional[str] = None

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

@router.post("", response_model=StartupResponse, status_code=status.HTTP_201_CREATED)
async def create_startup(
    req: CreateStartupRequest,
    db: AsyncSession = Depends(get_db_session),
    current_user: UserContext = Depends(get_current_user)
):
    # Retrieve user firms
    vc_result = await db.execute(
        select(VCFirm).where(VCFirm.organization_id == current_user.organization_id)
    )
    vc_firms = vc_result.scalars().all()
    if not vc_firms:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No VC Firm configured for your organization."
        )
    
    target_vc_id = req.vc_firm_id
    if target_vc_id:
        if not any(f.id == target_vc_id for f in vc_firms):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="VC Firm does not belong to your organization"
            )
    else:
        target_vc_id = vc_firms[0].id

    startup = Startup(
        name=req.name,
        domain=req.domain,
        vc_firm_id=target_vc_id
    )
    db.add(startup)
    await db.commit()
    await db.refresh(startup)
    return startup

@router.patch("/{id}", response_model=StartupResponse)
async def update_startup(
    id: str,
    req: UpdateStartupRequest,
    db: AsyncSession = Depends(get_db_session),
    current_user: UserContext = Depends(get_current_user)
):
    # Verify ownership
    vc_result = await db.execute(
        select(VCFirm.id).where(VCFirm.organization_id == current_user.organization_id)
    )
    vc_firm_ids = vc_result.scalars().all()
    
    result = await db.execute(
        select(Startup).where(Startup.id == id, Startup.vc_firm_id.in_(vc_firm_ids))
    )
    startup = result.scalars().first()
    if not startup:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Startup profile not found"
        )
    
    if req.name is not None:
        startup.name = req.name
    if req.domain is not None:
        startup.domain = req.domain
        
    await db.commit()
    await db.refresh(startup)
    return startup

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_startup(
    id: str,
    db: AsyncSession = Depends(get_db_session),
    current_user: UserContext = Depends(get_current_user)
):
    # Verify ownership
    vc_result = await db.execute(
        select(VCFirm.id).where(VCFirm.organization_id == current_user.organization_id)
    )
    vc_firm_ids = vc_result.scalars().all()
    
    result = await db.execute(
        select(Startup).where(Startup.id == id, Startup.vc_firm_id.in_(vc_firm_ids))
    )
    startup = result.scalars().first()
    if not startup:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Startup profile not found"
        )
        
    await db.delete(startup)
    await db.commit()
    return None

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

@router.get("/global-search", response_model=List[SearchResultItem])
async def global_search(
    q: str,
    db: AsyncSession = Depends(get_db_session),
    current_user: UserContext = Depends(get_current_user)
):
    if len(q) < 2:
        return []
        
    results = []
    
    # 1. Tenant-isolated VC Firm IDs
    vc_result = await db.execute(
        select(VCFirm.id).where(VCFirm.organization_id == current_user.organization_id)
    )
    vc_firm_ids = vc_result.scalars().all()
    if not vc_firm_ids:
        return []
        
    # 2. Search Startups
    startups_result = await db.execute(
        select(Startup).where(
            Startup.vc_firm_id.in_(vc_firm_ids),
            Startup.name.ilike(f"%{q}%")
        )
    )
    for s in startups_result.scalars().all():
        results.append(SearchResultItem(
            id=s.id,
            type="startup",
            title=s.name,
            subtitle=s.domain or "No domain"
        ))
        
    # 3. Search Tasks
    tasks_result = await db.execute(
        select(Task).where(
            Task.user_id == current_user.user_id,
            Task.title.ilike(f"%{q}%")
        )
    )
    for t in tasks_result.scalars().all():
        results.append(SearchResultItem(
            id=t.id,
            type="task",
            title=t.title,
            subtitle=f"Priority: {t.priority} | Due: {t.due}"
        ))
        
    return results
