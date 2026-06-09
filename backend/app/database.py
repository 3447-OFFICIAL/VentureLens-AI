from sqlmodel import SQLModel
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Use asyncpg directly in the URL
    DATABASE_URL: str = "postgresql+asyncpg://postgres:password@db:5432/venturelens"
    QDRANT_URL: str = "http://qdrant:6333"
    LLAMA_CLOUD_API_KEY: str = ""
    OPENAI_API_KEY: str = ""
    CLERK_SECRET_KEY: str = ""
    CLERK_ISSUER: str = ""

    class Config:
        env_file = ".env"

settings = Settings()

from sqlalchemy.pool import NullPool

# Institutional Database Setup with Connection Pooling
engine = create_async_engine(
    settings.DATABASE_URL, 
    echo=False, # Disable echo in production for performance
    pool_size=20,
    max_overflow=10,
    pool_timeout=30,
    pool_recycle=1800 # Recycle connections after 30 minutes
)

async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)

async def get_session():
    async with AsyncSession(engine) as session:
        yield session
