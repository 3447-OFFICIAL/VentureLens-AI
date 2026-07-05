from sqlalchemy import Column, String, Float, Text, ForeignKey, JSON, Index
from sqlalchemy.dialects.postgresql import UUID
from .base import Base, SoftDeleteMixin

class Company(SoftDeleteMixin, Base):
    __tablename__ = "companies"
    __table_args__ = (
        Index('ix_company_tenant_id', 'tenant_id', 'id'),
    )
    
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=False, index=True)
    name = Column(String, nullable=False, index=True)
    website = Column(String)
    sector = Column(String)
    stage = Column(String) # e.g., Seed, Series A
    description = Column(Text)
    metadata_blob = Column(JSON, default={}) # GIN Index recommended

class Deal(SoftDeleteMixin, Base):
    __tablename__ = "deals"
    __table_args__ = (
        Index('ix_deal_tenant_id', 'tenant_id', 'id'),
    )
    
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=False, index=True)
    company_id = Column(UUID(as_uuid=True), ForeignKey("companies.id"), nullable=False)
    stage = Column(String, nullable=False, default="Lead") # Lead, Screen, DD, IC, Term Sheet, Closed
    amount = Column(Float)
    probability = Column(Float, default=0.0)

class Document(SoftDeleteMixin, Base):
    __tablename__ = "documents"
    __table_args__ = (
        Index('ix_document_tenant_id', 'tenant_id', 'id'),
    )
    
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=False, index=True)
    company_id = Column(UUID(as_uuid=True), ForeignKey("companies.id"), nullable=False)
    title = Column(String, nullable=False)
    s3_url = Column(String, nullable=False)
    doc_type = Column(String) # Financial, Tech, Legal
    status = Column(String, default="Uploaded") # Processing, Indexed, Failed
