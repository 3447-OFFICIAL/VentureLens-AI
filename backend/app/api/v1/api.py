from fastapi import APIRouter
from ...routers import auth, deals, ai

api_router = APIRouter()

# Grouping all existing routers under v1 with clean prefixes
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(deals.router, prefix="/deals", tags=["Deal Flow"])
api_router.include_router(ai.router, prefix="/ai", tags=["AI Copilot"])
