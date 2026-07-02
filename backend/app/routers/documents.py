from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, Request
from ..core.limiter import limiter
from typing import List
import os
import uuid
import re
from ..storage import storage_service
from ..document_processor import process_document
from ..vector_store import store_document_vectors
from ..auth import verify_clerk_token, require_role, UserContext

router = APIRouter(
    prefix="/api/documents", 
    tags=["documents"],
    dependencies=[Depends(verify_clerk_token)]
)

@router.post("/upload")
@limiter.limit("10/minute")
async def upload_document(
    request: Request,
    file: UploadFile = File(...),
    current_user: UserContext = Depends(require_role(["admin", "analyst"]))
):
    try:
        # 1. Read file content
        file_content = await file.read()
        
        # Sanitize filename to prevent path traversal and XSS
        safe_filename = re.sub(r'[^a-zA-Z0-9_\-\.]', '_', os.path.basename(file.filename))
        unique_filename = f"{uuid.uuid4()}_{safe_filename}"
        file_url = storage_service.upload_file(file_content, unique_filename)
        
        # 3. Process Document (Parse using LlamaParse)
        # Assuming process_document returns a list of text chunks or documents
        # Note: Since LlamaParse might require an accessible URL or a file path,
        # we will use the local path for now since we are stubbing S3.
        chunks = await process_document(file_url, file.filename)
        
        # 4. Generate Embeddings and Store in Qdrant
        await store_document_vectors(chunks, metadata={"filename": file.filename, "user_id": current_user.user_id, "tenant_id": current_user.tenant_id})
        
        return {
            "message": "Document uploaded and processed successfully",
            "file_url": file_url,
            "filename": file.filename,
            "chunks_processed": len(chunks)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
