import pytest
import uuid
from app.agents.base import BaseAgent
from app.agents.workflow import AIAgentCoordinator
from app.core.qdrant import upsert_document_chunks, search_documents, generate_embedding

@pytest.mark.asyncio
async def test_base_agent_invoke():
    agent = BaseAgent(tenant_id="tenant-1", role_name="Financial Analyst", system_prompt="You are a financial analyst.")
    result = await agent.invoke("Analyze Acme Corp burn rate of $450k/mo")
    assert result["role"] == "Financial Analyst"
    assert "status" in result
    assert len(result["content"]) > 20

@pytest.mark.asyncio
async def test_qdrant_embeddings_and_search():
    tenant_id = str(uuid.uuid4())
    company_id = str(uuid.uuid4())
    doc_id = str(uuid.uuid4())
    
    # 1. Test embedding vector creation
    vec = await generate_embedding("Series A investment term sheet")
    assert len(vec) == 1536
    
    # 2. Upsert chunks
    chunks = [
        "Acme Corp generated $2.1M ARR in 2025 with 78% gross margins.",
        "The technical architecture runs on AWS with zero critical CVEs."
    ]
    count = await upsert_document_chunks(
        tenant_id=tenant_id,
        company_id=company_id,
        doc_id=doc_id,
        filename="acme_dd.pdf",
        chunks=chunks
    )
    assert count == 2
    
    # 3. Search within tenant scope
    results = await search_documents(tenant_id=tenant_id, query="What is Acme ARR?", limit=2)
    assert len(results) > 0
    assert results[0]["filename"] == "acme_dd.pdf"

@pytest.mark.asyncio
async def test_ai_coordinator_memo_pipeline():
    tenant_id = str(uuid.uuid4())
    company_id = str(uuid.uuid4())
    coordinator = AIAgentCoordinator(tenant_id=tenant_id)
    
    memo_result = await coordinator.generate_investment_memo(
        company_id=company_id,
        payload="Generate Series A evaluation for Acme Corp"
    )
    assert memo_result["status"] == "success"
    assert "content" in memo_result
    assert memo_result["metadata"]["specialists_run"] == 6
