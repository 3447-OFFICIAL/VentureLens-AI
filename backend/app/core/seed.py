import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.tenant import Tenant
from app.models.user import User
from app.models.auth import OrganizationUsers
from app.models.crm import Company, Deal, Task, Memo
from app.core.security import get_password_hash

async def seed_db(db: AsyncSession):
    # Check if a user already exists
    result = await db.execute(select(User))
    if result.scalars().first():
        return # already seeded
        
    print("[SEED] Starting database seeding...")
    
    # 1. Create Tenant
    tenant = Tenant(name="VentureLens Capital")
    db.add(tenant)
    await db.flush()
    
    # 2. Create User (arjun@venturelens.ai / password123)
    user = User(
        email="arjun@venturelens.ai",
        hashed_password=get_password_hash("password123")
    )
    db.add(user)
    await db.flush()
    
    # 3. Org Mapping
    org_mapping = OrganizationUsers(
        user_id=user.id,
        tenant_id=tenant.id,
        role="owner"
    )
    db.add(org_mapping)
    
    # 4. Companies & Deals
    companies_data = [
        {"name": "SynthAI", "stage": "Series A", "arr": 12400000, "runway": "14 mo", "owner": "Arjun Mehta", "health": 84, "amount": 5000000, "deal_stage": "Term Sheet"},
        {"name": "QuantumDB", "stage": "Series Seed", "arr": 3200000, "runway": "18 mo", "owner": "Riya Shah", "health": 88, "amount": 1500000, "deal_stage": "IC"},
        {"name": "Nemora Labs", "stage": "Seed", "arr": 1100000, "runway": "12 mo", "owner": "Karen Patel", "health": 72, "amount": 800000, "deal_stage": "DD"},
        {"name": "Vectora", "stage": "Seed", "arr": 2400000, "runway": "10 mo", "owner": "Arjun Mehta", "health": 68, "amount": 1200000, "deal_stage": "DD"},
        {"name": "Greenlyst", "stage": "Pre-Seed", "arr": 700000, "runway": "16 mo", "owner": "Neha Gupta", "health": 64, "amount": 300000, "deal_stage": "Screen"},
        {"name": "HealthSync", "stage": "Seed", "arr": 2100000, "runway": "16 mo", "owner": "Riya Shah", "health": 75, "amount": 1000000, "deal_stage": "Closed"},
        {"name": "UrbanStash", "stage": "Seed", "arr": 1400000, "runway": "8 mo", "owner": "Neha Gupta", "health": 58, "amount": 600000, "deal_stage": "DD"},
        {"name": "PayFlow", "stage": "Seed", "arr": 1800000, "runway": "11 mo", "owner": "Karen Patel", "health": 56, "amount": 900000, "deal_stage": "Closed"},
        {"name": "FinFlow", "stage": "Seed", "arr": 500000, "runway": "7 mo", "owner": "Riya Shah", "health": 60, "amount": 400000, "deal_stage": "Screen"}
    ]
    
    for c_data in companies_data:
        company = Company(
            tenant_id=tenant.id,
            name=c_data["name"],
            stage=c_data["stage"],
            sector="B2B SaaS / Fintech",
            website=f"https://{c_data['name'].lower().replace(' ', '')}.com",
            description=f"Automated intelligence description for {c_data['name']}.",
            metadata_blob={"runway": c_data["runway"], "owner": c_data["owner"], "health": c_data["health"]}
        )
        db.add(company)
        await db.flush()
        
        deal = Deal(
            tenant_id=tenant.id,
            company_id=company.id,
            stage=c_data["deal_stage"],
            amount=c_data["amount"],
            probability=0.85 if c_data["deal_stage"] == "Closed" else 0.50
        )
        db.add(deal)
        
    # 5. Tasks
    tasks_data = [
        {"title": "Review FinModel - SynthAI", "priority": "High", "due": "Due today", "assignee": "JD", "company": "SynthAI", "status": "todo"},
        {"title": "Technical DD - Nexora Labs", "priority": "High", "due": "Due in 1 day", "assignee": "JD", "company": "Nexora Labs", "status": "todo"},
        {"title": "Market Analysis - Vectora", "priority": "Medium", "due": "Due in 2 days", "assignee": "ES", "company": "Vectora", "status": "todo"},
        {"title": "IC Memo - QuantumDB", "priority": "High", "due": "Due in 3 days", "assignee": "JD", "company": "QuantumDB", "status": "todo"},
        {"title": "Follow up - Greenlyst", "priority": "Low", "due": "Due in 5 days", "assignee": "AK", "company": "Greenlyst", "status": "todo"},
        {"title": "Schedule Partner Pitch with FinSync", "priority": "Low", "due": "Completed", "assignee": "AK", "company": "FinSync", "status": "done"}
    ]
    for t_data in tasks_data:
        task = Task(
            tenant_id=tenant.id,
            title=t_data["title"],
            priority=t_data["priority"],
            due=t_data["due"],
            assignee=t_data["assignee"],
            company=t_data["company"],
            status=t_data["status"]
        )
        db.add(task)
        
    # 6. Memos
    memos_data = [
        {"title": "Investment Memo - SynthAI Series A", "company_name": "SynthAI", "status": "Final", "score": 84.0, "owner": "Arjun Mehta"},
        {"title": "Investment Memo - QuantumDB Seed", "company_name": "QuantumDB", "status": "In Review", "score": 88.0, "owner": "Riya Shah"},
        {"title": "Investment Memo - Nexora Labs Seed", "company_name": "Nexora Labs", "status": "Draft", "score": 72.0, "owner": "Neha Gupta"},
        {"title": "Investment Memo - EcoMove Series A", "company_name": "EcoMove", "status": "Draft", "score": 62.0, "owner": "Karan Patel"},
        {"title": "Investment Memo - Vectora Seed", "company_name": "Vectora", "status": "Draft", "score": 68.0, "owner": "Arjun Mehta"},
        {"title": "Investment Memo - HealthSync Seed", "company_name": "HealthSync", "status": "Final", "score": 75.0, "owner": "Riya Shah"}
    ]
    for m_data in memos_data:
        memo = Memo(
            tenant_id=tenant.id,
            title=m_data["title"],
            company_name=m_data["company_name"],
            status=m_data["status"],
            score=m_data["score"],
            owner=m_data["owner"]
        )
        db.add(memo)
        
    await db.commit()
    print("[SEED] Seeding completed successfully!")
