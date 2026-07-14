from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from pydantic import BaseModel
from typing import List, Dict, Any

from ..core.database import get_db
from ..api.deps import get_current_user
from ..models.user import User
from ..models.crm import Company

router = APIRouter(prefix="/companies", tags=["companies"])

# Schemas
class CompanyCreate(BaseModel):
    name: str
    stage: str
    sector: str = "B2B SaaS / Fintech"
    website: str | None = None
    description: str | None = None
    metadata_blob: Dict[str, Any] = {}

class CompanyUpdate(BaseModel):
    name: str | None = None
    stage: str | None = None
    sector: str | None = None
    website: str | None = None
    description: str | None = None
    metadata_blob: Dict[str, Any] | None = None

class CompanyResponse(BaseModel):
    id: str
    name: str
    stage: str
    sector: str
    website: str | None = None
    description: str | None = None
    metadata_blob: Dict[str, Any] = {}
    
    class Config:
        from_attributes = True

@router.get("/", response_model=List[CompanyResponse])
async def get_companies(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(Company))
    companies = result.scalars().all()
    
    # Map the models to dicts/response schema
    return [
        CompanyResponse(
            id=str(c.id),
            name=c.name,
            stage=c.stage or "Seed",
            sector=c.sector or "Unknown",
            website=c.website,
            description=c.description,
            metadata_blob=c.metadata_blob or {}
        ) for c in companies
    ]

@router.post("/", response_model=CompanyResponse)
async def create_company(
    company_in: CompanyCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_company = Company(
        tenant_id=current_user.tenant_id,
        name=company_in.name,
        stage=company_in.stage,
        sector=company_in.sector,
        website=company_in.website,
        description=company_in.description,
        metadata_blob=company_in.metadata_blob
    )
    db.add(new_company)
    await db.commit()
    await db.refresh(new_company)
    return new_company

@router.patch("/{company_id}", response_model=CompanyResponse)
async def update_company(
    company_id: str,
    company_in: CompanyUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(Company).filter(Company.id == company_id))
    company = result.scalars().first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
        
    if company_in.name is not None:
        company.name = company_in.name
    if company_in.stage is not None:
        company.stage = company_in.stage
    if company_in.sector is not None:
        company.sector = company_in.sector
    if company_in.website is not None:
        company.website = company_in.website
    if company_in.description is not None:
        company.description = company_in.description
    if company_in.metadata_blob is not None:
        company.metadata_blob = {**(company.metadata_blob or {}), **company_in.metadata_blob}
        
    await db.commit()
    await db.refresh(company)
    return company
