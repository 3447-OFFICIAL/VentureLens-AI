from sqlalchemy import Column, ForeignKey, Index, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID

from .base import Base, SoftDeleteMixin


class ICVote(SoftDeleteMixin, Base):
    __tablename__ = "ic_votes"
    __table_args__ = (
        Index('ix_ic_vote_tenant_id', 'tenant_id', 'id'),
    )

    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=False, index=True)
    company_id = Column(UUID(as_uuid=True), ForeignKey("companies.id"), nullable=False, index=True)
    partner_name = Column(String, nullable=False)
    partner_role = Column(String, default="General Partner") # Managing Partner, General Partner, Principal
    vote = Column(String, nullable=False) # YES, NO, CONDITIONAL, ABSTAIN
    conviction_score = Column(Integer, default=8) # 1 - 10
    covenants = Column(Text, nullable=True) # e.g. "Board seat + Founder vesting reset"
    notes = Column(Text, nullable=True)

class DDItem(SoftDeleteMixin, Base):
    __tablename__ = "dd_items"
    __table_args__ = (
        Index('ix_dd_item_tenant_id', 'tenant_id', 'id'),
    )

    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=False, index=True)
    company_id = Column(UUID(as_uuid=True), ForeignKey("companies.id"), nullable=False, index=True)
    category = Column(String, nullable=False) # Financial, Legal, Technical, Cybersecurity, Market, Team
    item_name = Column(String, nullable=False)
    status = Column(String, default="In Review") # Passed, Flagged, In Review, Waived
    severity = Column(String, default="Medium") # Critical, High, Medium, Low
    assignee = Column(String, default="Unassigned")
    notes = Column(Text, nullable=True)
