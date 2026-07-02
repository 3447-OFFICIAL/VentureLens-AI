import pytest
import asyncio
import os

# Set testing environment variable BEFORE importing database/main modules
os.environ["TESTING"] = "true"

from app.database import engine, Base

@pytest.fixture(autouse=True, scope="session")
def setup_database():
    async def create_tables():
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.drop_all)
            await conn.run_sync(Base.metadata.create_all)
    
    # Run async setup event loop
    loop = asyncio.get_event_loop_policy().new_event_loop()
    loop.run_until_complete(create_tables())
    loop.close()
    yield
