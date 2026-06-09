from fastapi import APIRouter, Depends, HTTPException, Request
from ..core.limiter import limiter
from pydantic import BaseModel
from ..auth import verify_clerk_token, require_role, UserContext
from ..worker import run_analysis_workflow_task
from celery.result import AsyncResult

router = APIRouter(
    prefix="/api/analysis", 
    tags=["analysis"],
    dependencies=[Depends(verify_clerk_token)]
)

class AnalysisRequest(BaseModel):
    query: str
    limit: int = 10

@router.post("/run")
@limiter.limit("2/minute")
async def run_analysis(
    data: AnalysisRequest,
    request: Request,
    current_user: UserContext = Depends(require_role(["admin", "analyst"]))
):
    try:
        # Dispatch to Celery worker
        task = run_analysis_workflow_task.delay(data.query, data.limit, current_user.tenant_id)
        
        return {
            "message": "Analysis job started.",
            "job_id": task.id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/job/{job_id}")
async def get_job_status(
    job_id: str,
    current_user: UserContext = Depends(require_role(["admin", "analyst"]))
):
    try:
        task_result = AsyncResult(job_id)
        if task_result.state == 'PENDING':
            return {"status": "PENDING"}
        elif task_result.state != 'FAILURE':
            return {
                "status": task_result.state,
                "result": task_result.result if task_result.state == 'SUCCESS' else None,
                "info": task_result.info
            }
        else:
            return {
                "status": "FAILURE",
                "error": str(task_result.info)
            }
