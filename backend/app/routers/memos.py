from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from pydantic import BaseModel
from typing import List, Dict, Any

from ..core.database import get_db
from ..api.deps import get_current_user
from ..models.user import User
from ..models.crm import Memo

router = APIRouter(prefix="/memos", tags=["memos"])

# Schemas
class MemoCreate(BaseModel):
    title: str
    company_name: str
    status: str = "Draft"
    score: float = 0.0
    owner: str

class MemoUpdate(BaseModel):
    title: str | None = None
    company_name: str | None = None
    status: str | None = None
    score: float | None = None
    owner: str | None = None

class MemoResponse(BaseModel):
    id: str
    title: str
    company_name: str
    status: str
    score: float
    owner: str
    
    class Config:
        from_attributes = True

@router.get("/", response_model=List[MemoResponse])
async def get_memos(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(Memo))
    memos = result.scalars().all()
    
    return [
        MemoResponse(
            id=str(m.id),
            title=m.title,
            company_name=m.company_name,
            status=m.status,
            score=m.score,
            owner=m.owner
        ) for m in memos
    ]

@router.post("/", response_model=MemoResponse)
async def create_memo(
    memo_in: MemoCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_memo = Memo(
        tenant_id=current_user.tenant_id,
        title=memo_in.title,
        company_name=memo_in.company_name,
        status=memo_in.status,
        score=memo_in.score,
        owner=memo_in.owner
    )
    db.add(new_memo)
    await db.commit()
    await db.refresh(new_memo)
    return new_memo

@router.patch("/{memo_id}", response_model=MemoResponse)
async def update_memo(
    memo_id: str,
    memo_in: MemoUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(Memo).filter(Memo.id == memo_id))
    memo = result.scalars().first()
    if not memo:
        raise HTTPException(status_code=404, detail="Memo not found")
        
    if memo_in.title is not None:
        memo.title = memo_in.title
    if memo_in.company_name is not None:
        memo.company_name = memo_in.company_name
    if memo_in.status is not None:
        memo.status = memo_in.status
    if memo_in.score is not None:
        memo.score = memo_in.score
    if memo_in.owner is not None:
        memo.owner = memo_in.owner
        
    await db.commit()
    await db.refresh(memo)
    return memo
