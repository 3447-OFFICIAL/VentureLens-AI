# System Architecture

VentureLens AI employs an event-driven, asynchronous microservices architecture to process massive streams of unstructured financial data with minimal latency.

## High-Level Data Flow

```mermaid
sequenceDiagram
    participant User
    participant Gateway as FastAPI Gateway
    participant Celery as Celery Worker
    participant LangGraph as AI Workflow
    participant Qdrant as Vector DB
    participant Postgres as Relational DB

    User->>Gateway: POST /api/reports/generate (JWT)
    Gateway->>Gateway: Auth & RBAC Check
    Gateway->>Postgres: Store Request State
    Gateway->>Celery: enqueue(generate_memo)
    Gateway-->>User: 202 Accepted (Job ID)
    
    Celery->>LangGraph: trigger_due_diligence()
    LangGraph->>LangGraph: Detect Prompt Injection
    LangGraph->>Qdrant: retrieve_context(tenant_id)
    LangGraph->>LangGraph: Evaluate Context Trust Score
    LangGraph->>LangGraph: Execute Agent Nodes (Financial, Thesis, Legal)
    LangGraph-->>Celery: Return Final Memo
    
    Celery->>Postgres: Update Job Status
```

## Core Components

- **FastAPI Gateway**: Handles synchronous HTTP traffic, utilizing `asyncio.to_thread` for CPU-bound computations.
- **PostgreSQL**: Stores relational data, tenant states, and job tracking logic. Integrated via `asyncpg`.
- **Qdrant**: High-performance vector database utilized exclusively for semantic retrieval within the RAG pipeline.
- **Celery & Redis**: Redis acts as both the message broker for Celery and the cache for SlowAPI rate-limiting.
- **LangGraph Orchestrator**: Manages state transitions and strict trust boundaries between adversarial agents and internal analysis tools.
