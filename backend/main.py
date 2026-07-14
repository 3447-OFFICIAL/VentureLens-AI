from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.api import api_router
from app.core.exceptions import VentureLensException, global_exception_handler, generic_exception_handler
from app.core.middleware import IdempotencyMiddleware
from app.core.database import engine, AsyncSessionLocal
from app.models import Base
from app.core.seed import seed_db

from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

limiter = Limiter(key_func=get_remote_address, default_limits=["100/minute"])

app = FastAPI(
    title="VentureLens AI API",
    description="Enterprise OS for VC Firms",
    version="0.1.0",
)

@app.on_event("startup")
async def startup_event():
    async with engine.begin() as conn:
        # Automatically create database tables on startup
        await conn.run_sync(Base.metadata.create_all)
    
    async with AsyncSessionLocal() as session:
        # Seed default database data for client presentation
        await seed_db(session)



# Exception Handlers
app.add_exception_handler(VentureLensException, global_exception_handler)
app.add_exception_handler(Exception, generic_exception_handler)
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Middleware
app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)
app.add_middleware(IdempotencyMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Main v1 Router
app.include_router(api_router, prefix="/api/v1")

@app.get("/api/health")
def health_check():
    return {"status": "ok", "version": "0.1.0"}
