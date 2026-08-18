import pytest
import uuid
from httpx import AsyncClient, ASGITransport
from main import app
from app.core.security import create_access_token
from app.core.database import AsyncSessionLocal
from app.core.seed import seed_db

@pytest.mark.asyncio
async def test_domain_modules_endpoints():
    async with AsyncSessionLocal() as session:
        await seed_db(session)

    token = create_access_token(data={"sub": "arjun@venturelens.ai", "tenant_id": str(uuid.uuid4())})
    headers = {"Authorization": f"Bearer {token}"}
    
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        
        # 1. Test IC Summary & Voting
        ic_res = await client.get("/api/v1/ic/summary", headers=headers)
        assert ic_res.status_code == 200
        ic_data = ic_res.json()
        assert "quorum_met" in ic_data
        assert "votes" in ic_data
        
        vote_res = await client.post("/api/v1/ic/vote", json={
            "company_id": ic_data["company_id"],
            "partner_name": "Arjun Mehta",
            "partner_role": "Managing Partner",
            "vote": "YES",
            "conviction_score": 9,
            "covenants": "Board seat required",
            "notes": "Strong unit economics"
        }, headers=headers)
        assert vote_res.status_code == 200
        assert vote_res.json()["vote"] == "YES"

        # 2. Test DD Checklist
        dd_res = await client.get("/api/v1/dd/", headers=headers)
        assert dd_res.status_code == 200
        dd_data = dd_res.json()
        assert "items" in dd_data
        assert dd_data["total_items"] > 0
        
        # 3. Test Portfolio Overview & Metrics
        port_res = await client.get("/api/v1/portfolio/overview", headers=headers)
        assert port_res.status_code == 200
        port_data = port_res.json()
        assert "aggregate_arr" in port_data
        assert len(port_data["sector_breakdown"]) > 0
