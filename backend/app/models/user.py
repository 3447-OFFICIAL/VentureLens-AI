from sqlalchemy import Column, String, Boolean
from .base import Base, SoftDeleteMixin

class User(SoftDeleteMixin, Base):
    __tablename__ = "users"
    
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)

    @property
    def tenant_id(self):
        return getattr(self, "_tenant_id", None)

    @tenant_id.setter
    def tenant_id(self, value):
        self._tenant_id = value

