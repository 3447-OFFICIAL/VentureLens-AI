from typing import Optional
from sqlmodel import SQLModel, Field

class FinancialMetrics(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    company_id: str = Field(index=True)
    year: int
    arr: float
    mrr: float
    growth_rate: float
    burn_rate: float
    gross_margin: float
    cac: float
    ltv: float
    net_revenue_retention: float

class ValuationScenario(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    company_id: str = Field(index=True)
    scenario_type: str # Bull, Base, Bear
    enterprise_value: float
    exit_value: float
    wacc: float

class CapTableEntry(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    company_id: str = Field(index=True)
    shareholder_name: str
    share_class: str
    shares_owned: int
    ownership_percentage: float
