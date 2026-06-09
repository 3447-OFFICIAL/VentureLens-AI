from crewai import Agent, Task
from pydantic import BaseModel

class FinancialAnalystAgent:
    def __init__(self):
        self.agent = Agent(
            role='Startup Financial Analyst',
            goal='Analyze startup financial statements, revenue metrics, burn rate, and unit economics to assess financial health.',
            backstory='You are a highly analytical quantitative analyst focusing on startup unit economics, runway estimation, and SaaS metrics (ARR, LTV, CAC).',
            verbose=True,
            allow_delegation=False
        )

    def create_financial_task(self, context_documents: str) -> Task:
        return Task(
            description=f'''
            Review the following document context extracted from the startup's financial models and statements:
            
            {context_documents}
            
            Extract and calculate the following metrics if possible:
            - ARR / MRR
            - Growth Rate
            - Gross Margin
            - EBITDA
            - CAC & LTV
            - Burn rate & Runway estimation
            
            Based on these metrics, generate a Financial Health Score and a Sustainability Score.
            ''',
            expected_output='''
            A markdown formatted report containing:
            1. Key Financial Metrics (ARR, MRR, Growth, Margin, EBITDA, CAC, LTV)
            2. Burn Rate & Runway Analysis
            3. Financial Health Score (0-100)
            4. Sustainability Score (0-100)
            5. Key Financial Risks
            ''',
            agent=self.agent
        )
