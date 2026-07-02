import asyncio
from sqlalchemy.future import select
from app.database import async_session_maker, Base, engine
from app.models.models import Organization, User, VCFirm, Startup, Deal, DueDiligence, Portfolio, Metric, AuditLog, Task, Founder, Investor, Meeting, Report, Comment, Notification

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

        # Seed Founders, Investors, Meetings, Comments, Notifications
        from datetime import datetime
        
        # 1. Seed Founders for SynthoAI and QuantumDB
        s_syntho = startups[0]
        s_quantum = startups[1]
        
        founders_list = [
            Founder(startup_id=s_syntho.id, full_name="Sarah Jenkins", email="sarah@syntho.ai", title="CEO & Co-founder", shares_owned=500000),
            Founder(startup_id=s_syntho.id, full_name="David Chen", email="david@syntho.ai", title="CTO & Co-founder", shares_owned=300000),
            Founder(startup_id=s_quantum.id, full_name="Elena Rostova", email="elena@quantumdb.io", title="CEO", shares_owned=600000)
        ]
        for f in founders_list:
            session.add(f)
            
        # Get portfolio entries
        portfolio_results = await session.execute(select(Portfolio))
        portfolios = portfolio_results.scalars().all()
        
        if portfolios:
            p_syntho = portfolios[0]
            investors_list = [
                Investor(portfolio_id=p_syntho.id, name="VentureLens VC", shares_owned=200000, ownership_percentage=12.50, share_class="Preferred Series A"),
                Investor(portfolio_id=p_syntho.id, name="Founders Group", shares_owned=800000, ownership_percentage=50.00, share_class="Common"),
                Investor(portfolio_id=p_syntho.id, name="Angel Syndicate", shares_owned=100000, ownership_percentage=6.25, share_class="Common")
            ]
            for inv in investors_list:
                session.add(inv)
                
        # Seed Meetings
        meetings_list = [
            Meeting(startup_id=s_syntho.id, title="Introductory Call & Pitch Deck Walkthrough", notes="Sarah presented unit economics. Impressive LTV/CAC.", scheduled_at=datetime.utcnow()),
            Meeting(startup_id=s_quantum.id, title="Technical Deep Dive", notes="Database benchmark discussions. Competes with CockroachDB.", scheduled_at=datetime.utcnow())
        ]
        for m in meetings_list:
            session.add(m)
            
        # Seed Comments & Notifications
        deals_results = await session.execute(select(Deal))
        deals = deals_results.scalars().all()
        if deals:
            c1 = Comment(deal_id=deals[0].id, user_id=user.id, content="Runway looks safe at 14 months. Ready to draft memo.")
            session.add(c1)
            
        n1 = Notification(user_id=user.id, title="New Document Processed", message="SynthoAI pitch deck has been vectorized in Qdrant.")
        session.add(n1)

        await session.commit()
        print("Database seeded successfully!")


if __name__ == "__main__":
    asyncio.run(seed_data())
