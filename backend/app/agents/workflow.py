import os
import logging
from typing import TypedDict, List, Optional
from langgraph.graph import StateGraph, END

logger = logging.getLogger("venturelens_agents")

# 1. Model Switching Abstraction Layer
class BaseLLM:
    def __init__(self, provider: str = "openai", model_name: Optional[str] = None):
        self.provider = provider
        self.model_name = model_name or self._get_default_model(provider)
        self.api_key = os.getenv(f"{provider.upper()}_API_KEY", "")

    def _get_default_model(self, provider: str) -> str:
        defaults = {
            "openai": "gpt-4o",
            "claude": "claude-3-5-sonnet",
            "gemini": "gemini-1.5-pro",
            "local": "llama3"
        }
        return defaults.get(provider, "gpt-4o")

    def call(self, prompt: str) -> str:
        if not self.api_key and self.provider != "local":
            logger.warning(f"No API key configured for {self.provider}. Utilizing offline Mock model.")
            return f"[Mock {self.model_name} response for prompt: {prompt[:30]}...]"
        
        return f"[LLM {self.provider}/{self.model_name} generated response for prompt]"

# 2. Define Agent State
class AgentState(TypedDict):
    company_name: str
    arr: float
    burn_rate: float
    market_size: float
    financial_report: str
    market_report: str
    final_memo: str

# 3. Agent Functions
def financial_analyst_agent(state: AgentState) -> AgentState:
    logger.info("Executing Financial Analyst Agent")
    llm = BaseLLM(provider="openai")
    
    prompt = f"Analyze financials: ARR={state['arr']}, Burn Rate={state['burn_rate']} for company {state['company_name']}"
    report = llm.call(prompt)
    
    return {
        **state,
        "financial_report": f"Financial evaluation results: {report}"
    }

def market_research_agent(state: AgentState) -> AgentState:
    logger.info("Executing Market Research Agent")
    llm = BaseLLM(provider="claude")
    
    prompt = f"Research market size of {state['market_size']}B for company {state['company_name']}"
    report = llm.call(prompt)
    
    return {
        **state,
        "market_report": f"Market Opportunity analysis: {report}"
    }

def investment_committee_agent(state: AgentState) -> AgentState:
    logger.info("Executing Investment Committee Agent")
    llm = BaseLLM(provider="gemini")
    
    prompt = (
        f"Synthesize Investment Thesis for {state['company_name']}.\n"
        f"Financials: {state['financial_report']}\n"
        f"Market: {state['market_report']}"
    )
    memo = llm.call(prompt)
    
    return {
        **state,
        "final_memo": f"VC Investment Thesis Memo:\n\n{memo}"
    }

# 4. Construct LangGraph Workflow
def build_diligence_graph():
    workflow = StateGraph(AgentState)
    
    # Add Nodes
    workflow.add_node("financials", financial_analyst_agent)
    workflow.add_node("market", market_research_agent)
    workflow.add_node("committee", investment_committee_agent)
    
    # Set entry point
    workflow.set_entry_point("financials")
    
    # Route sequentially
    workflow.add_edge("financials", "market")
    workflow.add_edge("market", "committee")
    workflow.add_edge("committee", END)
    
    return workflow.compile()

# Compilation
diligence_engine = build_diligence_graph()
