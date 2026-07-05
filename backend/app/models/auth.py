from sqlalchemy import Column, String, ForeignKey, Boolean, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from .base import Base, SoftDeleteMixin

class Session(SoftDeleteMixin, Base):
    __tablename__ = "sessions"
    
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=False)
    device_info = Column(String)
    ip_address = Column(String)
    is_revoked = Column(Boolean, default=False)
    last_active = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class OrganizationUsers(SoftDeleteMixin, Base):
    __tablename__ = "organization_users"
    
    # Using SoftDeleteMixin means this table will have its own UUID 'id' as primary key.
    # Alternatively we could use Composite PK, but sticking to the standard id is fine.
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=False)
    role = Column(String, nullable=False, default="member") # owner, admin, member, guest
