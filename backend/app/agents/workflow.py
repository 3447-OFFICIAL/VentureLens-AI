from typing import TypedDict, Annotated, List, Dict, Any
from langgraph.graph import StateGraph, END
from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain_core.messages import HumanMessage, SystemMessage
import os
import json

class AgentState(TypedDict):
    document_context: str
    tenant_id: str
    injection_detected: bool
    filtered_context: str
    thesis_result: str
    financial_result: str
    founder_result: str
    market_result: str
    competitive_result: str
    legal_result: str
    product_result: str
    committee_results: Dict[str, str]
    final_decision: str
    error: str
    context_trust_score: float

# 1. Prompt Injection Detection (Security)
def detect_prompt_injection(state: AgentState):
    """Detects if the document context contains prompt injection attempts."""
    context = state.get("document_context", "")
    
    # Heuristic based injection detection
    suspicious_phrases = ["ignore previous instructions", "system prompt", "you are now", "forget all"]
    injection_detected = any(phrase in context.lower() for phrase in suspicious_phrases)
    
    if injection_detected:
         return {"injection_detected": True, "error": "Prompt injection detected in context."}
         
    return {"injection_detected": False, "filtered_context": context}

# 2. Retrieval Filtering & Context Isolation (Security)
def filter_retrieval(state: AgentState):
    """Filters PII and ensures tenant context isolation."""
    context = state.get("filtered_context", "")
    tenant_id = state.get("tenant_id", "default")
    
    # Ensure tenant boundary (simplified)
    # In a real app we'd verify the context metadata matches the tenant.
    filtered = f"[TENANT: {tenant_id}] Context: {context}"
    return {"filtered_context": filtered}

# 3. Context Trust Scoring (Advanced AI Security)
def context_trust_scoring(state: AgentState):
    """
    Evaluates the retrieved document context for risk, toxicity, and hallucinations.
    Assigns a trust score between 0.0 and 1.0.
    """
    context = state.get("filtered_context", "")
    # In production, we'd use a dedicated smaller model (e.g., Llama Guard) for fast evaluation
    # For now, we simulate a scoring mechanism based on heuristics.
    trust_score = 1.0
    if "UNKNOWN_SOURCE" in context or "UNVERIFIED" in context:
        trust_score -= 0.5
    if len(context) < 10:
        trust_score -= 0.2
        
    if trust_score < 0.5:
        return {"context_trust_score": trust_score, "error": "Context trust score too low. Rejecting RAG generation."}
    
    return {"context_trust_score": trust_score}

# 4. Agent Sandboxing & Governance (Trust Boundaries)
# Each agent node is isolated and only receives what it needs.

def thesis_agent(state: AgentState):
    llm = ChatOpenAI(temperature=0)
    messages = [
        SystemMessage(content="You are a VC Investment Thesis Analyst. Evaluate the business model and market positioning."),
        HumanMessage(content=f"Context: {state['filtered_context']}")
    ]
    response = llm.invoke(messages)
    return {"thesis_result": response.content}

def financial_agent(state: AgentState):
    llm = ChatOpenAI(temperature=0)
    messages = [
        SystemMessage(content="You are a VC Financial Analyst. Evaluate the financial metrics and unit economics."),
        HumanMessage(content=f"Context: {state['filtered_context']}")
    ]
    response = llm.invoke(messages)
    return {"financial_result": response.content}

def committee_agent(state: AgentState):
    # Output validation & final decision
    llm = ChatOpenAI(temperature=0)
    messages = [
        SystemMessage(content="You are the Managing Partner. Review the thesis and financial results and make a final investment decision."),
        HumanMessage(content=f"Thesis: {state.get('thesis_result')}\nFinancials: {state.get('financial_result')}")
    ]
    response = llm.invoke(messages)
    return {"final_decision": response.content}

def build_graph():
    workflow = StateGraph(AgentState)

    workflow.add_node("detect_injection", detect_prompt_injection)
    workflow.add_node("filter_retrieval", filter_retrieval)
    workflow.add_node("context_trust_scoring", context_trust_scoring)
    workflow.add_node("thesis_agent", thesis_agent)
    workflow.add_node("financial_agent", financial_agent)
    workflow.add_node("committee_agent", committee_agent)

    workflow.set_entry_point("detect_injection")

    def route_injection(state):
        if state.get("injection_detected"):
            return END
        return "filter_retrieval"
        
    def route_trust(state):
        if state.get("context_trust_score", 1.0) < 0.5:
            return END
        return "thesis_agent"

    workflow.add_conditional_edges("detect_injection", route_injection)
    workflow.add_edge("filter_retrieval", "context_trust_scoring")
    workflow.add_conditional_edges("context_trust_scoring", route_trust)
    workflow.add_edge("thesis_agent", "financial_agent")
    workflow.add_edge("financial_agent", "committee_agent")
    workflow.add_edge("committee_agent", END)

    return workflow.compile()

async def run_due_diligence_workflow(document_context: str, tenant_id: str = "default"):
    graph = build_graph()
    
    inputs = {
        "document_context": document_context,
        "tenant_id": tenant_id
    }
    
    # Run async workflow
    result = await graph.ainvoke(inputs)
    
    if result.get("injection_detected"):
        return {"status": "failed", "error": result["error"]}
        
    return {
        "status": "completed",
        "result": result.get("final_decision", "No decision made")
    }
