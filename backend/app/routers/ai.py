import os
import uuid
from typing import Optional

import aiofiles
from fastapi import APIRouter, Depends, File, Form, UploadFile
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from ..agents.workflow import AIAgentCoordinator
from ..api.deps import get_current_user
from ..core.database import get_db
from ..core.qdrant import search_documents
from ..models.crm import Document
from ..models.user import User
from ..worker import process_document

router = APIRouter(prefix="/ai", tags=["ai"])

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

class ChatQuery(BaseModel):
    company_id: Optional[str] = None
    query: str

class GenerateMemoQuery(BaseModel):
    company_id: str
    payload: str = "Generate comprehensive Series A investment memo"

class SearchQuery(BaseModel):
    query: str
    company_id: Optional[str] = None
    limit: int = 5

@router.post("/chat")
async def ask_ai(
    query: ChatQuery,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    RAG endpoint to query the specialist AI agents via Server-Sent Events (SSE).
    Streams reasoning tokens directly from the agent coordinator.
    """
    coordinator = AIAgentCoordinator(tenant_id=str(current_user.tenant_id))
    return StreamingResponse(
        coordinator.stream_copilot_chat(query.query, query.company_id),
        media_type="text/event-stream"
    )

@router.post("/generate-memo")
async def stream_generate_memo(
    query: GenerateMemoQuery,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Orchestrates the complete 10-agent pipeline (Specialists -> Critic QA -> IC Committee -> Memo)
    and streams progressive status events + final markdown tokens via SSE.
    """
    coordinator = AIAgentCoordinator(tenant_id=str(current_user.tenant_id))
    return StreamingResponse(
        coordinator.stream_memo_pipeline(query.company_id, query.payload),
        media_type="text/event-stream"
    )

@router.post("/search")
async def search_knowledge_base(
    query: SearchQuery,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Searches the tenant's vector database in Qdrant for semantic citations.
    """
    results = await search_documents(
        tenant_id=str(current_user.tenant_id),
        query=query.query,
        company_id=query.company_id,
        limit=query.limit
    )
    return {"results": results, "count": len(results)}

@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    company_id: str = Form(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Uploads a data room document, saves it to local/cloud storage,
    persists a Document record to PostgreSQL, and triggers the async embedding worker.
    """
    doc_id = uuid.uuid4()
    safe_filename = f"{doc_id}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, safe_filename)

    # Save file to disk
    async with aiofiles.open(file_path, "wb") as out_file:
        content = await file.read()
        await out_file.write(content)

    # Save document record to DB
    doc_record = Document(
        id=doc_id,
        tenant_id=current_user.tenant_id,
        company_id=uuid.UUID(company_id) if len(company_id) == 36 else doc_id,
        title=file.filename or "Untitled Document",
        s3_url=file_path,
        doc_type="DataRoom",
        status="Processing"
    )
    db.add(doc_record)
    await db.commit()

    # Trigger background worker for text chunking & vector indexing
    task = process_document.delay(
        str(doc_id),
        str(current_user.tenant_id),
        company_id,
        file_path,
        file.filename or "Document"
    )

    return {
        "status": "processing",
        "filename": file.filename,
        "task_id": task.id if task else None,
        "doc_id": str(doc_id)
    }
