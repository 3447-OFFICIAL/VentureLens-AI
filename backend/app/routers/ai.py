from fastapi import APIRouter, Depends, UploadFile, File, Form
from fastapi.responses import StreamingResponse
import asyncio
from sqlalchemy.orm import Session
from pydantic import BaseModel

from ..core.database import get_db
from ..api.deps import get_current_user
from ..models.user import User
from ..worker import process_document
import uuid

router = APIRouter(prefix="/ai", tags=["ai"])

class ChatQuery(BaseModel):
    company_id: str
    query: str



async def fake_token_generator():
    tokens = ["Based", " on", " the", " Q3", " financials,", " the", " burn", " rate", " is", " $450k/month."]
    for token in tokens:
        yield f"data: {token}\n\n"
        await asyncio.sleep(0.05)
    yield "event: end\ndata: [DONE]\n\n"

@router.post("/chat")
async def ask_ai(
    query: ChatQuery, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    RAG endpoint to query the specialist AI agents via Server-Sent Events (SSE).
    """
    return StreamingResponse(fake_token_generator(), media_type="text/event-stream")

@router.post("/upload")
def upload_document(
    file: UploadFile = File(...), 
    company_id: str = Form(...), 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Upload a document for OCR and embedding to Qdrant.
    Triggers Celery background task.
    """
    # 1. Save file locally or to S3 (Mocked)
    file_path = f"/tmp/{uuid.uuid4()}_{file.filename}"
    
    # 2. Trigger async worker
    doc_id = str(uuid.uuid4())
    task = process_document.delay(doc_id, current_user.tenant_id, file_path)
    
    return {
        "status": "processing", 
        "filename": file.filename, 
        "task_id": task.id,
        "doc_id": doc_id
    }
