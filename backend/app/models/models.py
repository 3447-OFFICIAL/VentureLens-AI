import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Numeric, DateTime, ForeignKey, Text, Date, Boolean
from sqlalchemy.orm import relationship
from app.database import Base

class Organization(Base):
    __tablename__ = "organizations"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    users = relationship("User", back_populates="organization", cascade="all, delete-orphan")
    vc_firms = relationship("VCFirm", back_populates="organization", cascade="all, delete-orphan")

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, default="analyst") # admin, analyst, partner
    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    organization = relationship("Organization", back_populates="users")
    memos = relationship("InvestmentMemo", back_populates="author")
    audit_logs = relationship("AuditLog", back_populates="user")
    tasks = relationship("Task", back_populates="user", cascade="all, delete-orphan")


class VCFirm(Base):
    __tablename__ = "vc_firms"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)

    # Relationships
    organization = relationship("Organization", back_populates="vc_firms")
    startups = relationship("Startup", back_populates="vc_firm", cascade="all, delete-orphan")
    deals = relationship("Deal", back_populates="vc_firm", cascade="all, delete-orphan")
    portfolio_startups = relationship("Portfolio", back_populates="vc_firm", cascade="all, delete-orphan")

class Startup(Base):
    __tablename__ = "startups"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False, index=True)
    domain = Column(String(255), nullable=True)
    vc_firm_id = Column(String(36), ForeignKey("vc_firms.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    vc_firm = relationship("VCFirm", back_populates="startups")
    deals = relationship("Deal", back_populates="startup", cascade="all, delete-orphan")
    portfolio_profile = relationship("Portfolio", uselist=False, back_populates="startup", cascade="all, delete-orphan")

class Deal(Base):
    __tablename__ = "deals"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    startup_id = Column(String(36), ForeignKey("startups.id", ondelete="CASCADE"), nullable=False)
    vc_firm_id = Column(String(36), ForeignKey("vc_firms.id", ondelete="CASCADE"), nullable=False)
    stage = Column(String(50), nullable=False, default="Screening") # Screening, DueDiligence, Committee, Passed, Closed
    target_valuation = Column(Numeric(15, 2), nullable=True)
    investment_amount = Column(Numeric(15, 2), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    startup = relationship("Startup", back_populates="deals")
    vc_firm = relationship("VCFirm", back_populates="deals")
    due_diligence = relationship("DueDiligence", uselist=False, back_populates="deal", cascade="all, delete-orphan")

class DueDiligence(Base):
    __tablename__ = "due_diligence"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    deal_id = Column(String(36), ForeignKey("deals.id", ondelete="CASCADE"), unique=True, nullable=False)
    status = Column(String(50), nullable=False, default="Active") # Active, Finished, Suspended
    health_score = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    deal = relationship("Deal", back_populates="due_diligence")
    memos = relationship("InvestmentMemo", back_populates="due_diligence", cascade="all, delete-orphan")
    documents = relationship("Document", back_populates="due_diligence", cascade="all, delete-orphan")

class InvestmentMemo(Base):
    __tablename__ = "investment_memos"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    due_diligence_id = Column(String(36), ForeignKey("due_diligence.id", ondelete="CASCADE"), nullable=False)
    recommendation = Column(String(50), nullable=False) # Strong Buy, Buy, Hold, Pass
    bull_case = Column(Text, nullable=True)
    bear_case = Column(Text, nullable=True)
    created_by = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    due_diligence = relationship("DueDiligence", back_populates="memos")
    author = relationship("User", back_populates="memos")

class Portfolio(Base):
    __tablename__ = "portfolio"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    startup_id = Column(String(36), ForeignKey("startups.id", ondelete="CASCADE"), unique=True, nullable=False)
    vc_firm_id = Column(String(36), ForeignKey("vc_firms.id", ondelete="CASCADE"), nullable=False)
    initial_investment = Column(Numeric(15, 2), nullable=False)
    current_value = Column(Numeric(15, 2), nullable=False)
    ownership_percentage = Column(Numeric(5, 2), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    startup = relationship("Startup", back_populates="portfolio_profile")
    vc_firm = relationship("VCFirm", back_populates="portfolio_startups")
    metrics = relationship("Metric", back_populates="portfolio", cascade="all, delete-orphan")

class Metric(Base):
    __tablename__ = "metrics"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    portfolio_id = Column(String(36), ForeignKey("portfolio.id", ondelete="CASCADE"), nullable=False)
    timestamp = Column(Date, nullable=False, index=True)
    arr = Column(Numeric(15, 2), nullable=False)
    mrr = Column(Numeric(15, 2), nullable=False)
    growth_rate = Column(Numeric(5, 2), nullable=False)
    burn_rate = Column(Numeric(15, 2), nullable=False)
    nrr = Column(Numeric(5, 2), nullable=True)

    # Relationships
    portfolio = relationship("Portfolio", back_populates="metrics")

class Document(Base):
    __tablename__ = "documents"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    due_diligence_id = Column(String(36), ForeignKey("due_diligence.id", ondelete="CASCADE"), nullable=False)
    file_name = Column(String(255), nullable=False)
    s3_key = Column(String(500), nullable=False)
    file_type = Column(String(100), nullable=True)
    status = Column(String(50), nullable=False, default="Uploaded") # Uploaded, Processing, Completed, Failed
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    due_diligence = relationship("DueDiligence", back_populates="documents")

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    action = Column(String(255), nullable=False)
    ip_address = Column(String(45), nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="audit_logs")

class Task(Base):
    __tablename__ = "tasks"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(255), nullable=False)
    priority = Column(String(50), nullable=False, default="Medium")
    due = Column(String(100), nullable=True)
    completed = Column(Boolean, default=False)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="tasks")

