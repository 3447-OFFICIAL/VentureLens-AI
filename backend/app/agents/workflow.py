import asyncio
from typing import Dict, Any

from .specialists.agents import (
    FinancialAgent, TechnicalAgent, CyberAgent, 
    LegalAgent, MarketAgent, FounderAgent
)
from .synthesis.agents import (
    CriticAgent, ReviewerAgent, CommitteeAgent, MemoAgent
)
from ..core.config import settings

class AIAgentCoordinator:
    """
    The orchestrator that manages the execution graph of specialized agents,
    critics, and the final synthesis engine.
    """
    
    def __init__(self, tenant_id: str):
        self.tenant_id = tenant_id
        
        # Initialize Specialists
        self.specialists = [
            FinancialAgent(tenant_id),
            TechnicalAgent(tenant_id),
            CyberAgent(tenant_id),
            LegalAgent(tenant_id),
            MarketAgent(tenant_id),
            FounderAgent(tenant_id)
        ]
        
        # Initialize QA & Synthesis
        self.critic = CriticAgent(tenant_id)
        self.reviewer = ReviewerAgent(tenant_id)
        self.committee = CommitteeAgent(tenant_id)
        self.memo_writer = MemoAgent(tenant_id)
        
    async def generate_investment_memo(self, company_id: str, payload: str) -> Dict[str, Any]:
        """
        Executes the full multi-agent pipeline:
        1. Parallel Specialist Analysis
        2. QA Loop (Critic + Reviewer)
        3. Committee Simulation
        4. Final Memo Synthesis
        """
        
        # Step 1: Execute all specialized agents concurrently
        print(f"[{self.tenant_id}] Starting parallel specialist analysis...")
        tasks = [agent.invoke(payload) for agent in self.specialists]
        specialist_results = await asyncio.gather(*tasks)
        
        # Compile context for the synthesis layer
        aggregated_findings = "\n\n".join([f"## {res['role']}\n{res['content']}" for res in specialist_results])
        context = [{"role": "system", "content": f"Aggregated Findings:\n{aggregated_findings}"}]
        
        # Step 2: QA & Review Pipeline
        print(f"[{self.tenant_id}] Running QA and Thesis Review...")
        critic_res = await self.critic.invoke("Review the aggregated findings for hallucinations or contradictions.", context)
        reviewer_res = await self.reviewer.invoke("Ensure these findings meet our fund's strict criteria.", context)
        
        # Step 3: Committee Simulation
        print(f"[{self.tenant_id}] Simulating IC Committee Debate...")
        committee_res = await self.committee.invoke("Generate bull case, bear case, and founder questions.", context)
        
        # Update context with QA and Committee thoughts
        context.append({"role": "system", "content": f"Critic Notes:\n{critic_res['content']}\n\nCommittee Debate:\n{committee_res['content']}"})
        
        # Step 4: Final Memo Generation
        print(f"[{self.tenant_id}] Synthesizing Final Investment Memo...")
        final_memo = await self.memo_writer.invoke("Compile the final formatted Investment Memo based on all provided context.", context)
        
        return {
            "status": "success",
            "content": final_memo['content'],
            "metadata": {
                "specialists_run": len(self.specialists),
                "qa_passed": True,
                "critic_notes": critic_res['content']
            }
        }
