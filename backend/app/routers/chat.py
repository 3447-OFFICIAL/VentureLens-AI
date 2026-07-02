from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import logging
from app.auth import get_current_user, UserContext
from app.vector_store import search_documents_with_scores
from app.services.llm_provider import LLMProvider

logger = logging.getLogger("venturelens_chat")
router = APIRouter(prefix="/chat", tags=["Chat"])

class ChatRequest(BaseModel):
    message: str

@router.post("/stream")
async def stream_chat(
    req: ChatRequest,
    current_user: UserContext = Depends(get_current_user)
):
    # 1. Retrieve tenant-isolated context from Qdrant vector store
    tenant_id = current_user.organization_id
    logger.info(f"Querying Qdrant for tenant {tenant_id} with query: {req.message}")
    
    try:
        relevant_chunks = search_documents_with_scores(query=req.message, tenant_id=tenant_id, limit=3)
    except Exception as e:
        logger.error(f"Error querying Qdrant search: {e}")
        relevant_chunks = []

    # 2. Assemble context prompt
    if relevant_chunks:
        context = "\n\n---\n\n".join([c["text"] for c in relevant_chunks])
        prompt = (
            f"Context from uploaded tenant documents:\n"
            f"{context}\n\n"
            f"User Question: {req.message}\n\n"
            f"Answer the question concisely utilizing the context above. If the context does not contain the answer, "
            f"use your general knowledge of venture capital and financials, but prioritize document context."
        )
    else:
        prompt = req.message

    system_instruction = (
        "You are VentureLens AI, an institutional-grade VC Due Diligence and Portfolio Intelligence assistant. "
        "Your tone is professional, analytical, objective, and precise. Help analysts, associates, and partners "
        "audit startups, calculate runways, and evaluate metrics."
    )

    async def event_generator():
        # Call LLM provider stream helper
        try:
            stream = LLMProvider.generate_stream(prompt, system_instruction)
            for chunk in stream:
                yield f"data: {chunk}\n\n"
            
            # 3. Stream Citations and Trust Scores
            if relevant_chunks:
                yield "data: \n\n---\n**Sources & RAG Citations:**\n"
                for idx, c in enumerate(relevant_chunks):
                    # Clamp similarity score helper (e.g. if stub returned 0.1)
                    score_pct = round(max(c["score"], 0.0) * 100, 1)
                    yield f"data: * {c['file_name']} (Relevance Match: {score_pct}%)\n"
                yield "data: \n\n"
        except Exception as e:
            logger.error(f"Streaming failed: {e}")
            yield f"data: Error in LLM stream: {str(e)}\n\n"
            
    return StreamingResponse(event_generator(), media_type="text/event-stream")
