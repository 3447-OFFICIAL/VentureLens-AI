from crewai import Agent, Task

class FounderIntelligenceAgent:
    def __init__(self):
        self.agent = Agent(
            role='Founder Intelligence Analyst',
            goal='Analyze founder backgrounds, track record, and founder-market fit.',
            backstory='You specialize in human capital assessment, identifying execution risk and key person risk based on founder histories.',
            verbose=True,
            allow_delegation=False
        )

    def create_task(self, context: str) -> Task:
        return Task(
            description=f'Assess the founders based on this context: {context}',
            expected_output='A Founder Risk Score and Leadership Assessment report.',
            agent=self.agent
        )

class MarketIntelligenceAgent:
    def __init__(self):
        self.agent = Agent(
            role='Market Intelligence Analyst',
            goal='Research TAM, SAM, SOM, and industry trends.',
            backstory='You are an expert at sizing markets and identifying macro tailwinds.',
            verbose=True,
            allow_delegation=False
        )

    def create_task(self, context: str) -> Task:
        return Task(
            description=f'Analyze the market opportunity based on this context: {context}',
            expected_output='Market Opportunity Score and analysis of TAM/SAM/SOM.',
            agent=self.agent
        )

class CompetitiveIntelligenceAgent:
    def __init__(self):
        self.agent = Agent(
            role='Competitive Intelligence Analyst',
            goal='Map competitors and analyze product differentiation and moats.',
            backstory='You are a strategist who uncovers the competitive landscape and positioning.',
            verbose=True,
            allow_delegation=False
        )

    def create_task(self, context: str) -> Task:
        return Task(
            description=f'Analyze the competitive landscape based on this context: {context}',
            expected_output='Competitive Positioning Matrix and SWOT Analysis.',
            agent=self.agent
        )

class LegalRiskAgent:
    def __init__(self):
        self.agent = Agent(
            role='Legal Counsel & Risk Assessor',
            goal='Analyze contracts, compliance, corporate structure, and IP for risks.',
            backstory='You are a corporate lawyer identifying litigation, compliance, and regulatory concerns.',
            verbose=True,
            allow_delegation=False
        )

    def create_task(self, context: str) -> Task:
        return Task(
            description=f'Evaluate legal and compliance risks based on this context: {context}',
            expected_output='Legal Risk Report highlighting red flags and compliance issues.',
            agent=self.agent
        )

class ProductIntelligenceAgent:
    def __init__(self):
        self.agent = Agent(
            role='Product Intelligence Analyst',
            goal='Evaluate product roadmap, technical architecture, and defensibility.',
            backstory='You are a former VP of Product evaluating product-market fit and innovation level.',
            verbose=True,
            allow_delegation=False
        )

    def create_task(self, context: str) -> Task:
        return Task(
            description=f'Assess the product and technology based on this context: {context}',
            expected_output='Product Maturity Score and defensibility analysis.',
            agent=self.agent
        )

class RiskCommitteeAgent:
    def __init__(self):
        self.agent = Agent(
            role='Risk Committee Chair',
            goal='Aggregate risk outputs and generate Red/Yellow/Green flags across all categories.',
            backstory='You oversee all risk parameters (Financial, Operational, Legal, Market, Founder, Product).',
            verbose=True,
            allow_delegation=False
        )

    def create_task(self) -> Task:
        return Task(
            description='Review all prior analyses and summarize the risk flags.',
            expected_output='Overall Risk Rating and list of Red, Yellow, Green flags.',
            agent=self.agent
        )

class InvestmentCommitteeAgent:
    def __init__(self):
        self.agent = Agent(
            role='Investment Committee Partner',
            goal='Act as the final decision maker and produce the Investment Recommendation.',
            backstory='You are the Managing Partner who makes the final call on whether to invest, providing a Confidence Score and Conviction Level.',
            verbose=True,
            allow_delegation=False
        )

    def create_task(self) -> Task:
        return Task(
            description='Review the comprehensive due diligence findings and make a final investment decision.',
            expected_output='Investment Recommendation (Strong Buy/Buy/Watchlist/Pass), Confidence Score, and Conviction Level.',
            agent=self.agent
        )
