from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth, startups, diligence
from .core.limiter import setup_rate_limiting
from .core.telemetry import setup_telemetry
from slowapi.middleware import SlowAPIMiddleware
import os

app = FastAPI(
    title="VentureLens AI API",
    description="Institutional Financial Due Diligence Assistant Backend API",
    version="1.0.0",
)

setup_telemetry(app)
setup_rate_limiting(app)
app.add_middleware(SlowAPIMiddleware)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:3000")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1")
app.include_router(startups.router, prefix="/api/v1")
app.include_router(diligence.router, prefix="/api/v1")
