from crewai import Agent, Task

class CompanyIntelligenceAgent:
    def __init__(self):
        self.agent = Agent(
            role='Company Historian & Strategic Analyst',
            goal='Generate comprehensive company timelines, tracking leadership changes, acquisitions, partnerships, patents, litigation, and regulatory actions.',
            backstory='You are a meticulous researcher capable of extracting complex timelines and mapping corporate developments over years.',
            verbose=True,
            allow_delegation=False
        )

    def create_task(self, context: str) -> Task:
        return Task(
            description=f'Analyze the following company data and historical context: {context}',
            expected_output='Company Timeline including funding, leadership, acquisitions, and critical litigation/regulatory events.',
            agent=self.agent
        )

class CompetitorIntelligenceAgent:
    def __init__(self):
        self.agent = Agent(
            role='Competitor Strategy Analyst',
            goal='Map competitors, generate competitive matrices, SWOT analysis, pricing comparison, and assess moats.',
            backstory='You are a ruthless corporate strategist who identifies weaknesses in competitors and highlights market positioning.',
            verbose=True,
            allow_delegation=False
        )

    def create_task(self, context: str) -> Task:
        return Task(
            description=f'Analyze the competitive landscape based on the following context: {context}',
            expected_output='Market Map, Competitive Matrix, SWOT Analysis, Pricing Comparison Matrix, and Moat Assessment.',
            agent=self.agent
        )

class MarketSizingAgent:
    def __init__(self):
        self.agent = Agent(
            role='Market Sizing Quant Analyst',
            goal='Calculate TAM, SAM, and SOM using bottom-up and top-down methodologies.',
            backstory='You are an expert at estimating market sizes based on demographic data, industry reports, and pricing models.',
            verbose=True,
            allow_delegation=False
        )

    def create_task(self, context: str) -> Task:
        return Task(
            description=f'Calculate the market size (TAM, SAM, SOM) given the following context and pricing metrics: {context}',
            expected_output='Detailed TAM, SAM, and SOM calculations with methodological explanations and visualization data points.',
            agent=self.agent
        )
