from fastapi import WebSocket
from typing import List, Dict
import logging

logger = logging.getLogger("venturelens_ws")

class ConnectionManager:
    def __init__(self):
        # Maps tenant_id to a list of active WebSockets
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, tenant_id: str):
        await websocket.accept()
        if tenant_id not in self.active_connections:
            self.active_connections[tenant_id] = []
        self.active_connections[tenant_id].append(websocket)
        logger.info(f"WebSocket client connected to tenant: {tenant_id}")

    def disconnect(self, websocket: WebSocket, tenant_id: str):
        if tenant_id in self.active_connections:
            if websocket in self.active_connections[tenant_id]:
                self.active_connections[tenant_id].remove(websocket)
                logger.info(f"WebSocket client disconnected from tenant: {tenant_id}")
            if not self.active_connections[tenant_id]:
                del self.active_connections[tenant_id]

    async def send_personal_message(self, message: dict, websocket: WebSocket):
        await websocket.send_json(message)

    async def broadcast_to_tenant(self, message: dict, tenant_id: str):
        if tenant_id in self.active_connections:
            logger.info(f"Broadcasting websocket message to tenant {tenant_id}: {message}")
            for connection in self.active_connections[tenant_id]:
                try:
                    await connection.send_json(message)
                except Exception as e:
                    logger.warning(f"Failed to send message over WS: {e}")
                    # Disconnect broken connections safely
                    self.disconnect(connection, tenant_id)

manager = ConnectionManager()
