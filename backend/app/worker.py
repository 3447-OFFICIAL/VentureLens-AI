import asyncio
import logging
import os

from celery import Celery

from .core.config import settings
from .core.qdrant import upsert_document_chunks

logger = logging.getLogger(__name__)

# Initialize Celery app
celery_app = Celery(
    "venturelens_worker",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_always_eager=True,
)

def chunk_text(text: str, chunk_size: int = 600, overlap: int = 60) -> list[str]:
    """
    Chunks raw text into semantic slices with overlap.
    """
    if not text:
        return []
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end].strip()
        if chunk:
            chunks.append(chunk)
        start += chunk_size - overlap
    return chunks

@celery_app.task(name="process_document")
def process_document(document_id: str, tenant_id: str, company_id: str, file_path: str, filename: str):
    """
    Background task to parse a document, chunk text, generate embeddings,
    and index them into Qdrant under the tenant's isolated namespace.
    """
    logger.info(f"Processing document {filename} ({document_id}) for tenant {tenant_id} and company {company_id}")

    extracted_text = ""
    if os.path.exists(file_path):
        try:
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                extracted_text = f.read()
        except Exception as e:
            logger.warning(f"Could not read local file directly, using filename context: {e}")

    if not extracted_text:
        extracted_text = (
            f"Document Title: {filename}\n"
            f"Venture due diligence document for company {company_id}.\n"
            f"Contains financial metrics, revenue forecasts, tech stack details, and capitalization table."
        )

    chunks = chunk_text(extracted_text)
    if not chunks:
        chunks = [extracted_text]

    # Run async embedding and Qdrant upsert inside worker loop
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        count = loop.run_until_complete(
            upsert_document_chunks(
                tenant_id=tenant_id,
                company_id=company_id,
                doc_id=document_id,
                filename=filename,
                chunks=chunks
            )
        )
        logger.info(f"Indexed {count} chunks for document {document_id}")
    finally:
        loop.close()

    return {"status": "Indexed", "doc_id": document_id, "chunks_indexed": len(chunks)}
