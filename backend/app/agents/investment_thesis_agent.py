from crewai import Agent, Task
from pydantic import BaseModel

class InvestmentThesisAgent:
    def __init__(self):
        self.agent = Agent(
            role='Venture Capital Investment Thesis Analyst',
            goal='Evaluate the business model, market positioning, and venture-scale potential to generate an investment rationale.',
            backstory='You are a seasoned VC associate with a sharp eye for disruptive business models. You synthesize qualitative data to form strong investment convictions.',
            verbose=True,
            allow_delegation=False
        )

    def create_thesis_task(self, context_documents: str) -> Task:
        return Task(
            description=f'''
            Review the following document context extracted from the startup's pitch deck and materials:
            
            {context_documents}
            
            Based on this information, evaluate the business model and market positioning. 
            Generate an investment rationale including a Bull Case, Base Case, and Bear Case.
            ''',
            expected_output='''
            A markdown formatted report containing:
            1. Business Model Evaluation
            2. Market Positioning Assessment
            3. Bull Case
            4. Base Case
            5. Bear Case
            ''',
            agent=self.agent
        )
