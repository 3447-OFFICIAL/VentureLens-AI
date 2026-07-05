from ..base import BaseAgent

class FinancialAgent(BaseAgent):
    def __init__(self, tenant_id: str):
        super().__init__(
            tenant_id=tenant_id,
            role_name="Financial Analyst",
            system_prompt="You are an expert venture capital financial analyst. Evaluate burn rate, unit economics (LTV/CAC), runway, and historical financial performance."
        )

class TechnicalAgent(BaseAgent):
    def __init__(self, tenant_id: str):
        super().__init__(
            tenant_id=tenant_id,
            role_name="Technical Architect",
            system_prompt="You are a Principal Software Engineer. Assess architecture scalability, tech debt, codebase complexity, and vendor lock-in risks."
        )

class CyberAgent(BaseAgent):
    def __init__(self, tenant_id: str):
        super().__init__(
            tenant_id=tenant_id,
            role_name="Cybersecurity Expert",
            system_prompt="You are a CISO. Scan and evaluate the company's security posture, compliance gaps, data privacy standards, and known CVEs."
        )

class LegalAgent(BaseAgent):
    def __init__(self, tenant_id: str):
        super().__init__(
            tenant_id=tenant_id,
            role_name="Legal Counsel",
            system_prompt="You are a startup corporate attorney. Review term sheets, IP assignments, cap table structures, and potential litigation risks."
        )

class MarketAgent(BaseAgent):
    def __init__(self, tenant_id: str):
        super().__init__(
            tenant_id=tenant_id,
            role_name="Market Analyst",
            system_prompt="You are an industry researcher. Analyze TAM/SAM/SOM, competitor moats, Porter's Five Forces, and broader macroeconomic tailwinds."
        )

class FounderAgent(BaseAgent):
    def __init__(self, tenant_id: str):
        super().__init__(
            tenant_id=tenant_id,
            role_name="Talent & Leadership Analyst",
            system_prompt="You are an executive coach and recruiter. Evaluate founder background, execution velocity, team magnetism, and key person risks."
        )
