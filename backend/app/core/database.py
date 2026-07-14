from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy import text
from contextvars import ContextVar
from typing import AsyncGenerator

from .config import settings

# Note: settings.DATABASE_URL must be updated to use 'postgresql+asyncpg://'
engine = create_async_engine(settings.DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://"), pool_pre_ping=True)
AsyncSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine, class_=AsyncSession)

Base = declarative_base()

# Context variable to hold the current tenant ID from auth middleware
current_tenant_id: ContextVar[str | None] = ContextVar("current_tenant_id", default=None)

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    Dependency to get DB session.
    Injects tenant context for Row Level Security (RLS) if present.
    """
    async with AsyncSessionLocal() as session:
        tenant_id = current_tenant_id.get()
        
        if tenant_id and session.bind.dialect.name == 'postgresql':
            # Enforce RLS at the database level for this transaction (PostgreSQL only)
            await session.execute(text("SET LOCAL rls.tenant_id = :tenant_id"), {"tenant_id": tenant_id})
        
        yield session

