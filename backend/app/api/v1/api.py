from fastapi import APIRouter
from ...routers import auth, deals, ai, companies, tasks, memos, ic, dd, portfolio

api_router = APIRouter()

# Grouping all enterprise routers under v1
api_router.include_router(auth.router, tags=["Authentication"])
api_router.include_router(deals.router, tags=["Deal Flow"])
api_router.include_router(ai.router, tags=["AI Copilot"])
api_router.include_router(companies.router, tags=["Companies"])
api_router.include_router(tasks.router, tags=["Tasks"])
api_router.include_router(memos.router, tags=["Memos"])
api_router.include_router(ic.router, tags=["Investment Committee"])
api_router.include_router(dd.router, tags=["Due Diligence"])
api_router.include_router(portfolio.router, tags=["Portfolio Analytics"])
