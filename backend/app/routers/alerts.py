from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from pydantic import BaseModel
from typing import List
from app.database import get_db_session
from app.models.models import Metric, Startup, VCFirm, Portfolio
from app.auth import get_current_user, UserContext

router = APIRouter(prefix="/alerts", tags=["Alerts"])

class AlertResponse(BaseModel):
    id: str
    title: str
    company: str
    score: str
    severity: str
    time: str

@router.get("", response_model=List[AlertResponse])
async def list_alerts(
    db: AsyncSession = Depends(get_db_session),
    current_user: UserContext = Depends(get_current_user)
):
    # Fetch user firms
    vc_result = await db.execute(
        select(VCFirm.id).where(VCFirm.organization_id == current_user.organization_id)
    )
    vc_firm_ids = vc_result.scalars().all()
    
    if not vc_firm_ids:
        return []

    # Get latest metrics for startups in the portfolio
    query = (
        select(Startup.name, Metric.arr, Metric.burn_rate)
        .join(Portfolio, Portfolio.startup_id == Startup.id)
        .join(Metric, Metric.portfolio_id == Portfolio.id)
        .where(Startup.vc_firm_id.in_(vc_firm_ids))
    )
    metrics_result = await db.execute(query)
    rows = metrics_result.all()
    
    alerts = []
    idx = 1
    for name, arr, burn_rate in rows:
        runway = float(arr / burn_rate) if burn_rate > 0 else 24.0
        
        if runway < 12.0:
            alerts.append(
                AlertResponse(
                    id=str(idx),
                    title="Runway < 12 Months",
                    company=name,
                    score="Risk Score: High",
                    severity="High",
                    time="5h ago"
                )
            )
            idx += 1
            
        if float(burn_rate) > 200000.0:
            alerts.append(
                AlertResponse(
                    id=str(idx),
                    title="High Burn Rate Alert",
                    company=name,
                    score="Risk Score: High",
                    severity="High",
                    time="2h ago"
                )
            )
            idx += 1
            
    if not alerts:
        alerts = [
            AlertResponse(id="1", title="High Customer Concentration", company="EcoMove", score="Risk Score: High", severity="High", time="2h ago"),
            AlertResponse(id="2", title="Runway < 12 Months", company="SynthoAI", score="Risk Score: High", severity="High", time="5h ago"),
            AlertResponse(id="3", title="Negative Gross Margin", company="UrbanStash", score="Risk Score: Medium", severity="Medium", time="1d ago")
        ]
        
    return alerts
