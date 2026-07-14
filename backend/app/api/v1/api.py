from fastapi import APIRouter
from ...routers import auth, deals, ai, companies, tasks, memos

api_router = APIRouter()

# Grouping all existing routers under v1 with clean prefixes
api_router.include_router(auth.router, tags=["Authentication"])
api_router.include_router(deals.router, tags=["Deal Flow"])
api_router.include_router(ai.router, tags=["AI Copilot"])
api_router.include_router(companies.router, tags=["Companies"])
api_router.include_router(tasks.router, tags=["Tasks"])
api_router.include_router(memos.router, tags=["Memos"])


