from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth, startups, diligence, tasks, alerts, chat, valuation
from .core.limiter import setup_rate_limiting
from .core.telemetry import setup_telemetry
from slowapi.middleware import SlowAPIMiddleware
import os

app = FastAPI(
    title="VentureLens AI API",
    description="Institutional Financial Due Diligence Assistant Backend API",
    version="1.0.0",
)

@app.on_event("startup")
async def on_startup():
    from app.database import engine, Base
    from app.seed import seed_data
    
    # Auto-generate DB schema tables if they do not exist
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        
    # Auto-populate default seed data
    await seed_data()


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
app.include_router(tasks.router, prefix="/api/v1")
app.include_router(alerts.router, prefix="/api/v1")
app.include_router(chat.router, prefix="/api/v1")
app.include_router(valuation.router, prefix="/api/v1")

from app.core.websocket import manager

@app.websocket("/ws/{tenant_id}")
async def websocket_endpoint(websocket: WebSocket, tenant_id: str):
    await manager.connect(websocket, tenant_id)
    try:
        while True:
            # Echo loop or listening for client requests
            data = await websocket.receive_json()
            await manager.send_personal_message({"echo": data}, websocket)
    except WebSocketDisconnect:
        manager.disconnect(websocket, tenant_id)
    except Exception:
        manager.disconnect(websocket, tenant_id)

