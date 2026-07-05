from sqlalchemy import Column, String, Integer, Float, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID
from .base import Base, SoftDeleteMixin

class Subscription(SoftDeleteMixin, Base):
    __tablename__ = "subscriptions"
    
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=False, unique=True, index=True)
    stripe_customer_id = Column(String, unique=True, index=True)
    stripe_subscription_id = Column(String, unique=True, index=True)
    plan_tier = Column(String, default="starter") # starter, pro, enterprise
    status = Column(String, default="incomplete") # active, past_due, canceled
    seats_allocated = Column(Integer, default=1)
    current_period_end = Column(DateTime(timezone=True))

class UsageRecord(SoftDeleteMixin, Base):
    __tablename__ = "usage_records"
    
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=False, index=True)
    stripe_subscription_id = Column(String, index=True)
    tokens_consumed = Column(Integer, default=0)
    agent_type = Column(String) # e.g. 'financial', 'legal'
    cost_incurred = Column(Float, default=0.0) # If metered billing applies

class Invoice(SoftDeleteMixin, Base):
    __tablename__ = "invoices"
    
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=False, index=True)
    stripe_invoice_id = Column(String, unique=True, index=True)
    amount_due = Column(Float, default=0.0)
    amount_paid = Column(Float, default=0.0)
    status = Column(String) # draft, open, paid, uncollectible, void
    pdf_url = Column(String)
