import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres:password@db:5432/venturelens")
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://redis:6379/0")
    QDRANT_URL: str = os.getenv("QDRANT_URL", "http://qdrant:6333")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    LLAMA_CLOUD_API_KEY: str = os.getenv("LLAMA_CLOUD_API_KEY", "")
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "your-super-secret-jwt-key-for-venturelens-ai-rebuild")

    class Config:
        env_file = ".env"

settings = Settings()
