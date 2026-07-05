from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from pydantic import BaseModel
from typing import List

from ..core.database import get_db
from ..api.deps import get_current_user
from ..models.user import User
from ..models.crm import Deal, Company

router = APIRouter(prefix="/deals", tags=["deals"])

# Schemas
class DealCreate(BaseModel):
    company_name: str
    amount: float
    stage: str = "Lead"

class DealResponse(BaseModel):
    id: str
    company_id: str
    stage: str
    amount: float
    probability: float
    
    class Config:
        from_attributes = True

@router.get("/", response_model=List[DealResponse])
async def get_pipeline(
    db: AsyncSession = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    """
    Returns all deals. RLS context in `get_db` automatically filters 
    for the current_user's tenant_id.
    """
    result = await db.execute(select(Deal))
    deals = result.scalars().all()
    return deals

@router.post("/", response_model=DealResponse)
async def create_deal(
    deal_in: DealCreate, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Creates a new deal and company if it doesn't exist.
    """
    # Check if company exists for this tenant
    result = await db.execute(select(Company).filter(Company.name == deal_in.company_name))
    company = result.scalars().first()
    
    if not company:
        company = Company(
            tenant_id=current_user.tenant_id,
            name=deal_in.company_name,
            stage=deal_in.stage
        )
        db.add(company)
        await db.flush()
        
    new_deal = Deal(
        tenant_id=current_user.tenant_id,
        company_id=company.id,
        stage=deal_in.stage,
        amount=deal_in.amount
    )
    db.add(new_deal)
    await db.commit()
    await db.refresh(new_deal)
    
    return new_deal
