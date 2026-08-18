import os
import uuid
import aiofiles
import logging
from typing import Optional

logger = logging.getLogger(__name__)

UPLOAD_STORAGE_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "storage")
os.makedirs(UPLOAD_STORAGE_DIR, exist_ok=True)

class StorageService:
    """
    Storage adapter handling data room files, memos, and OCR documents.
    Supports local filesystem persistence with S3 / Cloudflare R2 compatibility.
    """
    
    def __init__(self):
        self.storage_dir = UPLOAD_STORAGE_DIR

    async def save_file(self, tenant_id: str, filename: str, content: bytes) -> str:
        tenant_dir = os.path.join(self.storage_dir, str(tenant_id))
        os.makedirs(tenant_dir, exist_ok=True)
        
        file_id = f"{uuid.uuid4()}_{filename}"
        destination = os.path.join(tenant_dir, file_id)
        
        async with aiofiles.open(destination, "wb") as f:
            await f.write(content)
            
        return destination

    async def get_file_bytes(self, file_path: str) -> Optional[bytes]:
        if not os.path.exists(file_path):
            return None
        async with aiofiles.open(file_path, "rb") as f:
            return await f.read()

storage_service = StorageService()
