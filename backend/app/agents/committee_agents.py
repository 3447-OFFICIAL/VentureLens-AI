from crewai import Agent, Task

class BullPartnerAgent:
    def __init__(self):
        self.agent = Agent(
            role='The Visionary Bull Partner',
            goal='Identify the 100x upside scenario. Focus on market expansion, network effects, paradigm shifts, and why this company could dominate.',
            backstory='You are an optimistic VC partner known for spotting decacorns early. You focus on what could go right rather than what could go wrong.',
            verbose=True,
            allow_delegation=False
        )

    def create_task(self, context: str) -> Task:
        return Task(
            description=f'Write the Bull Case based on: {context}',
            expected_output='A compelling bull case highlighting the maximum upside, market expansion opportunities, and key drivers of hyper-growth.',
            agent=self.agent
        )

class BearPartnerAgent:
    def __init__(self):
        self.agent = Agent(
            role='The Skeptical Bear Partner',
            goal='Identify critical flaws, existential threats, structural weaknesses, and why this startup will fail.',
            backstory='You are a deeply cynical, analytical VC partner who has seen thousands of startups fail. You poke holes in the business model and unit economics.',
            verbose=True,
            allow_delegation=False
        )

    def create_task(self, context: str) -> Task:
        return Task(
            description=f'Write the Bear Case based on: {context}',
            expected_output='A devastating bear case detailing the most likely reasons the startup will fail, including market risks, competition, and structural flaws.',
            agent=self.agent
        )

class RiskPartnerAgent:
    def __init__(self):
        self.agent = Agent(
            role='Risk Management & Compliance Partner',
            goal='Assess technical debt, regulatory risks, IP vulnerability, key person risk, and operational vulnerabilities.',
            backstory='You are an ex-lawyer and auditor who identifies hidden liabilities that could wipe out the fund\'s investment.',
            verbose=True,
            allow_delegation=False
        )

    def create_task(self, context: str) -> Task:
        return Task(
            description=f'Assess the Risk Profile based on: {context}',
            expected_output='A comprehensive risk matrix identifying regulatory, technical, operational, and legal risks, along with mitigation strategies.',
            agent=self.agent
        )

class SectorPartnerAgent:
    def __init__(self):
        self.agent = Agent(
            role='Sector Specialist Partner',
            goal='Provide deep domain expertise on the specific industry, evaluating the tech stack, GTM motion, and product-market fit within the specific vertical.',
            backstory='You have 20 years of experience in this specific vertical. You know all the players, the standard metrics, and the buyer behavior.',
            verbose=True,
            allow_delegation=False
        )

    def create_task(self, context: str) -> Task:
        return Task(
            description=f'Provide vertical-specific analysis based on: {context}',
            expected_output='A deep-dive sector analysis confirming whether the startup\'s approach makes sense within the specific industry dynamics.',
            agent=self.agent
        )

class ManagingPartnerAgent:
    def __init__(self):
        self.agent = Agent(
            role='Managing Partner & Final Decision Maker',
            goal='Synthesize the views of the Bull, Bear, Risk, and Sector partners to make a final investment recommendation (Pass, Monitor, or Invest) with proposed terms.',
            backstory='You are the head of the firm. You weigh upside against downside risk, considering portfolio construction and fund economics. You make the final call.',
            verbose=True,
            allow_delegation=False
        )

    def create_task(self, context: str) -> Task:
        return Task(
            description=f'Synthesize the partner feedback and make a final decision based on: {context}',
            expected_output='The final investment verdict (Invest / Pass / Monitor), investment thesis, proposed terms/valuation, and key conditions for investment.',
            agent=self.agent
        )
