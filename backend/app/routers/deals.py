from fastapi import APIRouter, Depends, HTTPException
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

class DealUpdate(BaseModel):
    stage: str | None = None
    amount: float | None = None
    probability: float | None = None

class DealResponse(BaseModel):
    id: str
    company_id: str
    company_name: str
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
    result = await db.execute(
        select(Deal, Company.name.label("company_name"))
        .join(Company, Deal.company_id == Company.id)
    )
    deals_with_company = []
    for row in result.all():
        deal = row[0]
        company_name = row[1]
        deals_with_company.append({
            "id": str(deal.id),
            "company_id": str(deal.company_id),
            "company_name": company_name,
            "stage": deal.stage,
            "amount": deal.amount,
            "probability": deal.probability
        })
    return deals_with_company

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
    
    return {
        "id": str(new_deal.id),
        "company_id": str(new_deal.company_id),
        "company_name": deal_in.company_name,
        "stage": new_deal.stage,
        "amount": new_deal.amount,
        "probability": new_deal.probability
    }

@router.patch("/{deal_id}", response_model=DealResponse)
async def update_deal(
    deal_id: str,
    deal_in: DealUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Updates the stage, amount, or probability of a deal.
    """
    result = await db.execute(select(Deal).filter(Deal.id == deal_id))
    deal = result.scalars().first()
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")
        
    if deal_in.stage is not None:
        deal.stage = deal_in.stage
    if deal_in.amount is not None:
        deal.amount = deal_in.amount
    if deal_in.probability is not None:
        deal.probability = deal_in.probability
        
    await db.commit()
    await db.refresh(deal)
    
    comp_result = await db.execute(select(Company).filter(Company.id == deal.company_id))
    company = comp_result.scalars().first()
    company_name = company.name if company else "Unknown"
    
    return {
        "id": str(deal.id),
        "company_id": str(deal.company_id),
        "company_name": company_name,
        "stage": deal.stage,
        "amount": deal.amount,
        "probability": deal.probability
    }

