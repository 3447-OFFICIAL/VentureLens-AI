import asyncio
from sqlalchemy.future import select
from app.database import async_session_maker, Base, engine
from app.models.models import Organization, User, VCFirm, Startup, Deal, DueDiligence, Portfolio, Metric, AuditLog, Task

async def seed_data():
    async with async_session_maker() as session:
        # Check if user already exists to prevent duplicate seeds
        user_check = await session.execute(select(User).where(User.email == "analyst@vc.com"))
        if user_check.scalars().first():
            print("Database already seeded. Skipping.")
            return

        # 1. Create Organization
        org = Organization(name="VentureLens AI Partners")
        session.add(org)
        await session.flush()

        # 2. Create User (Arjun Mehta)
        user = User(
            email="analyst@vc.com",
            password_hash="password", # Match UI signin action
            full_name="Arjun Mehta",
            role="partner",
            organization_id=org.id
        )
        session.add(user)

        # 3. Create VC Firm
        vc = VCFirm(name="VentureLens VC", organization_id=org.id)
        session.add(vc)
        await session.flush()

        # 4. Create Startups
        startups = [
            Startup(name="SynthoAI", domain="syntho.ai", vc_firm_id=vc.id),
            Startup(name="QuantumDB", domain="quantumdb.io", vc_firm_id=vc.id),
            Startup(name="EcoMove", domain="ecomove.co", vc_firm_id=vc.id),
            Startup(name="HealthSync", domain="healthsync.com", vc_firm_id=vc.id),
            Startup(name="UrbanStash", domain="urbanstash.com", vc_firm_id=vc.id)
        ]
        for s in startups:
            session.add(s)
        await session.flush()

        # 5. Create Deals & Due Diligence for each
        for s in startups:
            deal = Deal(
                startup_id=s.id,
                vc_firm_id=vc.id,
                stage="DueDiligence" if s.name in ["SynthoAI", "QuantumDB", "EcoMove"] else "Screening",
                target_valuation=25000000.0,
                investment_amount=5000000.0
            )
            session.add(deal)
            await session.flush()

            diligence = DueDiligence(
                deal_id=deal.id,
                status="Active",
                health_score=84 if s.name == "SynthoAI" else 88 if s.name == "QuantumDB" else 62 if s.name == "EcoMove" else 75 if s.name == "HealthSync" else 58
            )
            session.add(diligence)

            # Create Portfolio entry
            portfolio = Portfolio(
                startup_id=s.id,
                vc_firm_id=vc.id,
                initial_investment=3000000.0,
                current_value=4500000.0,
                ownership_percentage=12.5 if s.name == "SynthoAI" else 8.7 if s.name == "QuantumDB" else 15.2 if s.name == "EcoMove" else 9.3 if s.name == "HealthSync" else 7.1
            )
            session.add(portfolio)
            await session.flush()

            # Create Metric
            from datetime import date
            metric = Metric(
                portfolio_id=portfolio.id,
                timestamp=date.today(),
                arr=12400000.0 if s.name == "SynthoAI" else 3200000.0 if s.name == "QuantumDB" else 8700000.0 if s.name == "EcoMove" else 2100000.0 if s.name == "HealthSync" else 1400000.0,
                mrr=1000000.0,
                growth_rate=33.0,
                burn_rate=250000.0,
                nrr=115.0
            )
            session.add(metric)

        # Seed Tasks
        tasks_list = [
            Task(title="Review FinModel - SynthoAI", priority="High", due="Due today", user_id=user.id),
            Task(title="Technical DD - Nexora Labs", priority="High", due="Due in 1 day", user_id=user.id),
            Task(title="Market Analysis - Vectora", priority="Medium", due="Due in 2 days", user_id=user.id),
            Task(title="IC Memo - QuantumDB", priority="High", due="Due in 3 days", user_id=user.id),
            Task(title="Follow up - Greenlyst", priority="Low", due="Due in 5 days", user_id=user.id)
        ]
        for t in tasks_list:
            session.add(t)

        await session.commit()
        print("Database seeded successfully!")


if __name__ == "__main__":
    asyncio.run(seed_data())
