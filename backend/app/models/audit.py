from sqlalchemy import Column, String, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID
from .base import Base, SoftDeleteMixin

class AuditLog(SoftDeleteMixin, Base):
    __tablename__ = "audit_logs"
    
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=False, index=True)
    actor_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    action = Column(String, nullable=False, index=True) # e.g., 'CREATE_DEAL', 'UPDATE_COMPANY'
    resource_type = Column(String, nullable=False) # e.g., 'deal', 'company'
    resource_id = Column(UUID(as_uuid=True), nullable=False)
    payload = Column(JSON, default={}) # GIN Index recommended
