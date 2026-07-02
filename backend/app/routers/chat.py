from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import asyncio
import os
from app.auth import get_current_user, UserContext

router = APIRouter(prefix="/chat", tags=["Chat"])

class ChatRequest(BaseModel):
    message: str

@router.post("/stream")
async def stream_chat(
    req: ChatRequest,
    current_user: UserContext = Depends(get_current_user)
):
    async def event_generator():
        message = req.message.lower()
        
        if "runway" in message or "synthoai" in message:
            response_text = (
                "Based on the latest financial metrics, SynthoAI has an ARR of $12.4M and a monthly burn of $250k. "
                "This yields approximately 14 months of remaining runway. While their growth rate (+33%) is strong, "
                "we recommend monitoring their marketing spend efficiency to prevent early capital exhaustion."
            )
        elif "ecomove" in message or "concentration" in message:
            response_text = (
                "EcoMove is currently showing a high risk alert due to customer concentration: their top 3 clients "
                "represent 48% of total MRR. We recommend negotiating longer-term contract terms before closing the Series A."
            )
        else:
            response_text = (
                "Hello! I am VentureLens AI, your due diligence copilot. I can analyze startup deck files, "
                "run Monte Carlo cash flow simulations, build post-money cap tables, and identify portfolio risks."
            )

        words = response_text.split(" ")
        for word in words:
            yield f"data: {word} \n\n"
            await asyncio.sleep(0.15)
            
    return StreamingResponse(event_generator(), media_type="text/event-stream")
