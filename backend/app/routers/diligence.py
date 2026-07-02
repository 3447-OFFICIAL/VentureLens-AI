from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from pydantic import BaseModel
from typing import List, Optional
import os
import shutil
import uuid
from app.database import get_db_session
from app.models.models import DueDiligence, Document, Deal, VCFirm
from app.auth import get_current_user, UserContext

router = APIRouter(prefix="/due-diligence", tags=["Due Diligence"])

class DocumentResponse(BaseModel):
    id: str
    file_name: str
    file_type: Optional[str] = None
    status: str

class AnalysisResponse(BaseModel):
    id: str
    deal_id: str
    status: str
    health_score: Optional[int] = None

@router.post("/{id}/documents/upload", response_model=DocumentResponse)
async def upload_document(
    id: str,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db_session),
    current_user: UserContext = Depends(get_current_user)
):
    # Verify the due diligence record belongs to user's tenant organization
    vc_result = await db.execute(
        select(VCFirm.id).where(VCFirm.organization_id == current_user.organization_id)
    )
    vc_firm_ids = vc_result.scalars().all()
    
    diligence_check = await db.execute(
        select(DueDiligence)
        .join(Deal, Deal.id == DueDiligence.deal_id)
        .where(DueDiligence.id == id, Deal.vc_firm_id.in_(vc_firm_ids))
    )
    diligence = diligence_check.scalars().first()
    if not diligence:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Due diligence record not found"
        )
        
    # Save the file to local sandbox / mock S3 bucket
    file_id = str(uuid.uuid4())
    upload_dir = "uploads"
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, f"{file_id}_{file.filename}")
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # Register document record in database
    doc = Document(
        id=file_id,
        due_diligence_id=id,
        file_name=file.filename,
        s3_key=file_path,
        file_type=file.content_type,
        status="Uploaded"
    )
    db.add(doc)
    await db.commit()
    await db.refresh(doc)
    
    return DocumentResponse(
        id=doc.id,
        file_name=doc.file_name,
        file_type=doc.file_type,
        status=doc.status
    )

@router.get("/{id}/analysis", response_model=AnalysisResponse)
async def get_analysis(
    id: str,
    db: AsyncSession = Depends(get_db_session),
    current_user: UserContext = Depends(get_current_user)
):
    vc_result = await db.execute(
        select(VCFirm.id).where(VCFirm.organization_id == current_user.organization_id)
    )
    vc_firm_ids = vc_result.scalars().all()
    
    diligence_check = await db.execute(
        select(DueDiligence)
        .join(Deal, Deal.id == DueDiligence.deal_id)
        .where(DueDiligence.id == id, Deal.vc_firm_id.in_(vc_firm_ids))
    )
    diligence = diligence_check.scalars().first()
    if not diligence:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Due diligence record not found"
        )
        
    return AnalysisResponse(
        id=diligence.id,
        deal_id=diligence.deal_id,
        status=diligence.status,
        health_score=diligence.health_score
    )
