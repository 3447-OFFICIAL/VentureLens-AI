from ..auth import verify_clerk_token, require_role, UserContext
from fastapi import APIRouter, HTTPException, Depends, Request
from ..core.limiter import limiter
from fastapi.responses import FileResponse
from pydantic import BaseModel
from ..services.pdf_service import PDFGenerationService
import os
import re
import html

router = APIRouter(
    prefix="/api/reports", 
    tags=["reports"],
    dependencies=[Depends(verify_clerk_token)]
)

class MemoDataRequest(BaseModel):
    company_name: str
    executive_summary: str
    arr: str
    burn_multiple: str
    rule_of_40: str
    verdict: str
    ic_notes: str

@router.post("/memo/{company_id}/pdf")
@limiter.limit("2/minute")
async def generate_memo_pdf(
    company_id: str, 
    data: MemoDataRequest,
    request: Request,
    current_user: UserContext = Depends(require_role(["admin", "analyst"]))
):
    try:
        # Sanitize company_id
        safe_company_id = re.sub(r'[^a-zA-Z0-9_\-]', '', company_id)
        
        # Prevent XSS/SSRF in WeasyPrint by escaping inputs
        sanitized_data = {
            k: html.escape(str(v)) for k, v in data.dict().items()
        }
        
        service = PDFGenerationService()
        pdf_path = service.generate_investment_memo(safe_company_id, sanitized_data)
        
        if not os.path.exists(pdf_path):
            raise HTTPException(status_code=500, detail="Failed to generate PDF")
            
        return FileResponse(
            path=pdf_path, 
            media_type='application/pdf', 
            filename=f"VentureLens_Memo_{data.company_name}.pdf"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
