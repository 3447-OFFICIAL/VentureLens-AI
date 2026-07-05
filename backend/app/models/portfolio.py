from sqlalchemy import Column, String, ForeignKey, Float, Date, Index
from sqlalchemy.dialects.postgresql import UUID
from .base import Base, SoftDeleteMixin

class Metric(SoftDeleteMixin, Base):
    __tablename__ = "metrics"
    __table_args__ = (
        Index('ix_metric_tenant_id', 'tenant_id', 'id'),
    )
    
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=False, index=True)
    company_id = Column(UUID(as_uuid=True), ForeignKey("companies.id"), nullable=False)
    metric_name = Column(String, nullable=False) # ARR, Burn, Cash, Gross Margin
    metric_value = Column(Float, nullable=False)
    date_recorded = Column(Date, nullable=False)
