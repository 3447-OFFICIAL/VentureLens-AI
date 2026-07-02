import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres:password@db:5432/venturelens")

# Fallback to SQLite in-memory database for testing
if os.getenv("TESTING") == "true":
    DATABASE_URL = "sqlite+aiosqlite:///:memory:"

# Create async database engine with custom connection pooling rules
engine_kwargs = {}
if "sqlite" in DATABASE_URL:
    engine_kwargs = {}
else:
    engine_kwargs = {
        "pool_size": 20,
        "max_overflow": 10,
        "pool_timeout": 30,
        "pool_recycle": 1800,
    }

engine = create_async_engine(
    DATABASE_URL,
    echo=False,
    **engine_kwargs
)


# Async session factory
async_session_maker = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False
)

# Declarative base class for SQLAlchemy models
Base = declarative_base()

async def get_db_session():
    """Dependency injection wrapper yielding async sessions"""
    async with async_session_maker() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
