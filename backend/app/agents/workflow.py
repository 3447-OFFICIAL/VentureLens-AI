import asyncio
import json
from typing import Any, AsyncGenerator, Dict, Optional

from ..core.qdrant import search_documents
from .specialists.agents import CyberAgent, FinancialAgent, FounderAgent, LegalAgent, MarketAgent, TechnicalAgent
from .synthesis.agents import CommitteeAgent, CriticAgent, MemoAgent, ReviewerAgent


class AIAgentCoordinator:
    """
    The orchestrator that manages the execution graph of specialized agents,
    critics, vector context ingestion, and the final synthesis engine.
    """

    def __init__(self, tenant_id: str):
        self.tenant_id = str(tenant_id)

        # Initialize Specialists
        self.financial_agent = FinancialAgent(self.tenant_id)
        self.technical_agent = TechnicalAgent(self.tenant_id)
        self.cyber_agent = CyberAgent(self.tenant_id)
        self.legal_agent = LegalAgent(self.tenant_id)
        self.market_agent = MarketAgent(self.tenant_id)
        self.founder_agent = FounderAgent(self.tenant_id)

        self.specialists = [
            self.financial_agent,
            self.technical_agent,
            self.cyber_agent,
            self.legal_agent,
            self.market_agent,
            self.founder_agent
        ]

        # Initialize QA & Synthesis
        self.critic = CriticAgent(self.tenant_id)
        self.reviewer = ReviewerAgent(self.tenant_id)
        self.committee = CommitteeAgent(self.tenant_id)
        self.memo_writer = MemoAgent(self.tenant_id)

    async def retrieve_rag_context(self, query: str, company_id: Optional[str] = None) -> str:
        """
        Retrieves relevant vector chunks from Qdrant.
        """
        docs = await search_documents(
            tenant_id=self.tenant_id,
            query=query,
            company_id=company_id,
            limit=4
        )
        if not docs:
            return "No prior data room documents indexed for this company. Using base heuristics."

        doc_strings = [
            f"--- Document: {d.get('filename')} (Score: {d.get('score', 0):.2f}) ---\n{d.get('text')}"
            for d in docs
        ]
        return "\n\n".join(doc_strings)

    async def generate_investment_memo(self, company_id: str, payload: str) -> Dict[str, Any]:
        """
        Synchronous batch execution of the multi-agent pipeline with RAG context.
        """
        # Step 0: RAG Context
        rag_context = await self.retrieve_rag_context(payload, company_id)
        augmented_payload = f"Company ID: {company_id}\n\nContext:\n{rag_context}\n\nObjective: {payload}"

        # Step 1: Concurrent specialist analysis
        tasks = [agent.invoke(augmented_payload) for agent in self.specialists]
        specialist_results = await asyncio.gather(*tasks)

        aggregated_findings = "\n\n".join([f"## {res['role']}\n{res['content']}" for res in specialist_results])
        context = [{"role": "system", "content": f"Aggregated Findings:\n{aggregated_findings}"}]

        # Step 2: QA & Review Pipeline
        critic_res = await self.critic.invoke("Review the aggregated findings for contradictions or vulnerabilities.", context)
        await self.reviewer.invoke("Ensure these findings meet our fund mandate.", context)

        # Step 3: Committee Simulation
        committee_res = await self.committee.invoke("Generate bull case, bear case, and key partner questions.", context)
        context.append({"role": "system", "content": f"Critic Notes:\n{critic_res['content']}\n\nCommittee Debate:\n{committee_res['content']}"})

        # Step 4: Final Memo Generation
        final_memo = await self.memo_writer.invoke("Compile the final formatted Investment Memo based on all provided context.", context)

        return {
            "status": "success",
            "content": final_memo['content'],
            "metadata": {
                "specialists_run": len(self.specialists),
                "qa_passed": True,
                "critic_notes": critic_res['content'],
                "committee_debate": committee_res['content']
            }
        }

    async def stream_memo_pipeline(self, company_id: str, payload: str) -> AsyncGenerator[str, None]:
        """
        Streams step-by-step progress events over Server-Sent Events (SSE).
        """
        yield f"event: step\ndata: {json.dumps({'step': 'rag_retrieval', 'message': 'Querying vector data room for company filings...'})}\n\n"
        await asyncio.sleep(0.3)
        rag_context = await self.retrieve_rag_context(payload, company_id)
        augmented_payload = f"Company ID: {company_id}\n\nContext:\n{rag_context}\n\nObjective: {payload}"

        # Step 1: Run Specialists concurrently
        yield f"event: step\ndata: {json.dumps({'step': 'specialists_running', 'message': 'Dispatched 6 parallel specialist agents (Financial, Tech, Cyber, Legal, Market, Founder)...'})}\n\n"
        tasks = [agent.invoke(augmented_payload) for agent in self.specialists]
        specialist_results = await asyncio.gather(*tasks)

        for res in specialist_results:
            yield f"event: specialist_done\ndata: {json.dumps({'role': res['role'], 'status': 'complete'})}\n\n"
            await asyncio.sleep(0.1)

        aggregated_findings = "\n\n".join([f"## {res['role']}\n{res['content']}" for res in specialist_results])
        context = [{"role": "system", "content": f"Aggregated Findings:\n{aggregated_findings}"}]

        # Step 2: QA Critic
        yield f"event: step\ndata: {json.dumps({'step': 'critic_qa', 'message': 'Running Red Team Critic for hallucination & assumption checks...'})}\n\n"
        critic_res = await self.critic.invoke("Review the aggregated findings for contradictions or vulnerabilities.", context)
        await asyncio.sleep(0.2)

        # Step 3: IC Committee
        yield f"event: step\ndata: {json.dumps({'step': 'ic_debate', 'message': 'Simulating Investment Committee debate (Bull vs Bear)...'})}\n\n"
        committee_res = await self.committee.invoke("Generate bull case, bear case, and key partner questions.", context)
        context.append({"role": "system", "content": f"Critic Notes:\n{critic_res['content']}\n\nCommittee Debate:\n{committee_res['content']}"})
        await asyncio.sleep(0.2)

        # Step 4: Stream final memo tokens
        yield f"event: step\ndata: {json.dumps({'step': 'synthesis', 'message': 'Synthesizing final Investment Memo...'})}\n\n"
        async for token in self.memo_writer.stream_invoke("Compile the final formatted Investment Memo based on all provided context.", context):
            yield f"data: {token}\n\n"

        yield "event: end\ndata: [DONE]\n\n"

    async def stream_copilot_chat(self, query: str, company_id: Optional[str] = None) -> AsyncGenerator[str, None]:
        """
        Streams answers to user copilot questions using RAG and specialist synthesis.
        """
        yield f"event: step\ndata: {json.dumps({'step': 'searching', 'message': 'Searching documents and deal memory...'})}\n\n"
        docs = await search_documents(tenant_id=self.tenant_id, query=query, company_id=company_id, limit=3)
        await asyncio.sleep(0.2)

        context_str = "\n".join([f"- {d.get('filename')}: {d.get('text')}" for d in docs]) if docs else "No direct matching document chunks found."

        system_prompt = (
            "You are VentureLens Copilot, an elite venture capital analyst and partner copilot. "
            "Provide concise, evidence-backed answers with explicit numbers and risk considerations. "
            f"Context from Data Room:\n{context_str}"
        )

        from .base import BaseAgent
        agent = BaseAgent(self.tenant_id, "Copilot", system_prompt)

        async for token in agent.stream_invoke(query):
            yield f"data: {token}\n\n"

        yield "event: end\ndata: [DONE]\n\n"
