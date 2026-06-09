import os
import asyncio
from celery import Celery
from .agents.workflow import run_due_diligence_workflow
from .vector_store import search_documents

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

celery_app = Celery(
    "venturelens_worker",
    broker=REDIS_URL,
    backend=REDIS_URL
)

celery_app.conf.update(
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    task_track_started=True,
    worker_prefetch_multiplier=1, # Long running tasks
    task_time_limit=3600, # 1 hour max
    task_soft_time_limit=3300
)

# Wrapper to run async workflow inside sync celery task
def run_async_workflow(document_context: str, tenant_id: str):
    return asyncio.run(run_due_diligence_workflow(document_context, tenant_id))

@celery_app.task(bind=True, name="run_analysis_workflow")
def run_analysis_workflow_task(self, query: str, limit: int, tenant_id: str):
    # 1. Retrieve relevant context from Qdrant
    self.update_state(state='PROGRESS', meta={'message': 'Searching documents'})
    relevant_chunks = search_documents(query, tenant_id=tenant_id, limit=limit)
    
    if not relevant_chunks:
        return {"error": "No relevant documents found for analysis.", "status": "failed"}
        
    document_context = "\n\n---\n\n".join(relevant_chunks)
    
    # 2. Run LangGraph Workflow
    self.update_state(state='PROGRESS', meta={'message': 'Running multi-agent analysis'})
    result = run_async_workflow(document_context, tenant_id)
    
    return result
