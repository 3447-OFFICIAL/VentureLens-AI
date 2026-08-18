import uuid
from typing import List, Optional

from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel, ConfigDict
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from ..api.deps import get_current_user
from ..core.database import get_db
from ..models.crm import Company
from ..models.ic_dd import ICVote
from ..models.user import User

router = APIRouter(prefix="/ic", tags=["Investment Committee"])

class VoteCreate(BaseModel):
    company_id: str
    partner_name: str
    partner_role: str = "General Partner"
    vote: str # YES, NO, CONDITIONAL, ABSTAIN
    conviction_score: int = 8
    covenants: Optional[str] = None
    notes: Optional[str] = None

class VoteResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    company_id: str
    partner_name: str
    partner_role: str
    vote: str
    conviction_score: int
    covenants: Optional[str] = None
    notes: Optional[str] = None

class ICSummaryResponse(BaseModel):
    company_id: str
    company_name: str
    total_votes: int
    yes_votes: int
    no_votes: int
    conditional_votes: int
    abstain_votes: int
    average_conviction: float
    quorum_met: bool
    final_status: str # Approved, Rejected, Pending Quorum, Conditional
    votes: List[VoteResponse]

@router.get("/summary", response_model=ICSummaryResponse)
async def get_ic_summary(
    company_id: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Returns aggregated Investment Committee votes, quorum validation, and partner breakdown.
    """
    # Fetch first company if not specified
    if not company_id:
        comp_res = await db.execute(select(Company))
        first_comp = comp_res.scalars().first()
        company_id = str(first_comp.id) if first_comp else str(uuid.uuid4())
        company_name = first_comp.name if first_comp else "Acme Corp"
    else:
        try:
            cid = uuid.UUID(company_id)
            comp_res = await db.execute(select(Company).filter(Company.id == cid))
            comp = comp_res.scalars().first()
            company_name = comp.name if comp else "Selected Company"
        except Exception:
            company_name = "Target Company"

    votes_res = await db.execute(select(ICVote).filter(ICVote.company_id == uuid.UUID(company_id) if len(company_id) == 36 else ICVote.company_id == company_id))
    votes = votes_res.scalars().all()

    # If no votes in DB yet, return structured default committee seed state
    if not votes:
        dummy_votes = [
            VoteResponse(
                id=str(uuid.uuid4()),
                company_id=company_id,
                partner_name="Arjun Mehta",
                partner_role="Managing Partner",
                vote="YES",
                conviction_score=9,
                covenants="Require $5M Cyber Insurance & board observer seat",
                notes="Top quartile unit economics with impressive founder velocity."
            ),
            VoteResponse(
                id=str(uuid.uuid4()),
                company_id=company_id,
                partner_name="Sarah Jenkins",
                partner_role="General Partner",
                vote="YES",
                conviction_score=8,
                covenants="12-month founder vesting acceleration clause",
                notes="Massive TAM expansion potential in enterprise vertical."
            ),
            VoteResponse(
                id=str(uuid.uuid4()),
                company_id=company_id,
                partner_name="Marcus Vance",
                partner_role="Principal",
                vote="CONDITIONAL",
                conviction_score=7,
                covenants="Must clarify customer concentration risks before closing",
                notes="Strong product moat, but top 3 customers represent 28% ARR."
            )
        ]
        return ICSummaryResponse(
            company_id=company_id,
            company_name=company_name,
            total_votes=3,
            yes_votes=2,
            no_votes=0,
            conditional_votes=1,
            abstain_votes=0,
            average_conviction=8.0,
            quorum_met=True,
            final_status="Approved with Conditions",
            votes=dummy_votes
        )

    yes = sum(1 for v in votes if v.vote.upper() == "YES")
    no = sum(1 for v in votes if v.vote.upper() == "NO")
    cond = sum(1 for v in votes if v.vote.upper() == "CONDITIONAL")
    abstain = sum(1 for v in votes if v.vote.upper() == "ABSTAIN")
    avg_score = sum(v.conviction_score for v in votes) / len(votes) if votes else 0.0
    quorum = len(votes) >= 3

    status = "Approved" if yes >= 2 and no == 0 else "Conditional" if cond > 0 else "Rejected" if no > 1 else "Pending Quorum"

    return ICSummaryResponse(
        company_id=company_id,
        company_name=company_name,
        total_votes=len(votes),
        yes_votes=yes,
        no_votes=no,
        conditional_votes=cond,
        abstain_votes=abstain,
        average_conviction=round(avg_score, 1),
        quorum_met=quorum,
        final_status=status,
        votes=[
            VoteResponse(
                id=str(v.id),
                company_id=str(v.company_id),
                partner_name=v.partner_name,
                partner_role=v.partner_role,
                vote=v.vote,
                conviction_score=v.conviction_score,
                covenants=v.covenants,
                notes=v.notes
            ) for v in votes
        ]
    )

@router.post("/vote", response_model=VoteResponse)
async def submit_ic_vote(
    vote_in: VoteCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Submits or records an Investment Committee vote for a deal.
    """
    cid = uuid.UUID(vote_in.company_id) if len(vote_in.company_id) == 36 else uuid.uuid4()
    new_vote = ICVote(
        tenant_id=current_user.tenant_id,
        company_id=cid,
        partner_name=vote_in.partner_name,
        partner_role=vote_in.partner_role,
        vote=vote_in.vote.upper(),
        conviction_score=vote_in.conviction_score,
        covenants=vote_in.covenants,
        notes=vote_in.notes
    )
    db.add(new_vote)
    await db.commit()
    await db.refresh(new_vote)

    return VoteResponse(
        id=str(new_vote.id),
        company_id=str(new_vote.company_id),
        partner_name=new_vote.partner_name,
        partner_role=new_vote.partner_role,
        vote=new_vote.vote,
        conviction_score=new_vote.conviction_score,
        covenants=new_vote.covenants,
        notes=new_vote.notes
    )
