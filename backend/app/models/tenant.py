from sqlalchemy import Column, String
from .base import Base, SoftDeleteMixin

class Tenant(SoftDeleteMixin, Base):
    __tablename__ = "tenants"
    
    name = Column(String, nullable=False)
    
    # RLS is NOT applied to this table, as this is the root tenant table.
