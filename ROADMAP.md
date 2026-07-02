# ROADMAP: VentureLens AI Development Plan

This document outlines the 20-phase roadmap to transform the VentureLens AI prototype into a fully production-ready, enterprise-grade Venture Capital Due Diligence Platform.

---

## Phase 1: Core Application Fixes & Component Implementations
- **Navigation & Routing**: Fix the sidebar navigation tab matching (lowercase vs capitalized states) and construct conditional views/pages for each tab.
- **Table Controls**: Add client-side and server-side sorting, filtering, searching, and pagination to the startups datagrid.
- **Forms & Validation**: Implement form validation using React Hook Form & Zod for document uploads, company creation, and task additions.
- **Loading & Error Handling**: Inject loading indicators (skeletons, progress bars) and React Error Boundaries for network resilience.

## Phase 2: Enterprise Authentication (Clerk & RBAC)
- **Authentication Gateway**: Set up Clerk Provider in frontend and Clerk Middleware in Next.js router.
- **Role-Based Access Control**: Implement roles: `Admin`, `Partner`, `Associate`, `Analyst`, `Viewer`.
- **Backend Verification**: Implement Clerk JWT token signature verification in FastAPI gateway.
- **Tenant Isolation**: Secure all queries by tenant-id/organization-id.

## Phase 3: Robust Backend APIs (FastAPI & Pydantic)
- **FastAPI Refactor**: Standardize all endpoints with Pydantic request/response models.
- **Dependency Injection**: Utilize FastAPI `Depends` for database sessions, authentication context, and service instances.
- **Structured Logging**: Configure `structlog` for machine-readable JSON logging in production.

## Phase 4: Normalized Relational Database (PostgreSQL & Alembic)
- **Extended Schema**: Create PostgreSQL models for all 20+ entities: `Users`, `Organizations`, `Companies`, `Founders`, `Investors`, `Deals`, `DueDiligence`, `Documents`, `Reports`, `InvestmentMemos`, `Meetings`, `Tasks`, `PortfolioCompanies`, `Alerts`, `Notifications`, `AuditLogs`, `Comments`, `Attachments`, `VersionHistory`.
- **Database Migrations**: Setup Alembic migrations and ensure database schemas are version-controlled.

## Phase 5: Complete Company Module
- **CRUD Operations**: Support creating, editing, archiving, and deleting company profiles.
- **Extended Views**: Financial dashboards, Cap Table dilution simulators, Competitor lists, and interactive timelines.

## Phase 6: Document Intelligence (Ingestion & OCR)
- **Multi-Format Ingestion**: Handle PDF, DOCX, XLSX, CSV, PowerPoint, and images.
- **Extraction Pipeline**: Integrate LlamaParse and offline tools to extract plain text, tables, financial statements, and key performance indicators (KPIs).

## Phase 7: AI Provider Abstraction
- **Model Switcher**: Implement an abstract LLM interface supporting Gemini, GPT, Claude, DeepSeek, and Llama.
- **Streaming Core**: Support server-sent events (SSE) for streaming LLM text output.

## Phase 8: RAG-Powered AI Copilot
- **Semantic Copilot**: Upgrade the chat assistant to answer startup questions, generate IC Memos, and analyze runway using vector store context.

## Phase 9: High-Performance Vector Search
- **Qdrant Storage**: Set up vector collections in Qdrant. Generate chunks and embeddings, and support hybrid semantic + keyword search with citation tracking.

## Phase 10: Automatic Due Diligence Engine
- **Calculated Scoring**: Compute composite scores (Investment, Risk, Founder, Market, Financial, Moat) with detailed textual explanations.

## Phase 11: Investment Committee Workflow
- **Deal Progression**: Multi-stage approval flow: Analyst → Associate → Partner → Investment Committee. Track history and send real-time approval requests.

## Phase 12: Real-time Portfolio Dashboard
- **Financial Visualizations**: Display live IRR, MOIC, Cash Flow, Burn Rate, and Runway charts backed by REST APIs.

## Phase 13: Enterprise Report Generation
- **Exports**: Build PDF, DOCX, and Markdown generators for due diligence audits and investment memos.

## Phase 14: WebSocket Notifications
- **Real-time Alerting**: Broadcast document parsing progress, AI completions, and task assignments over WebSockets.

## Phase 15: Global Search
- **Universal Query**: Implement global keyword + semantic search across all companies, documents, tasks, and notes.

## Phase 16: Infrastructure & Orchestration
- **Docker Compose**: Orchestrate Redis, Celery, PostgreSQL, Qdrant, and local S3 stack.
- **CI/CD & Monitoring**: Set up GitHub Actions, health check endpoints, and Prometheus metrics.

## Phase 17: Security Hardening
- **OWASP Compliance**: Secure file uploads, enforce rate limits via Redis, prevent CSRF, and log all admin actions.

## Phase 18: Performance Tuning
- **Optimization**: Implement React Query cache invalidation, lazy loading, and db indexing.

## Phase 19: Testing & Coverage
- **Tests**: Write pytest suites, Playwright E2E tests, and achieve >80% coverage.

## Phase 20: Code Quality Assurance
- **Strict Compliance**: Achieve zero TypeScript/ESLint warnings, clean up deprecated stubs, and enforce strict type definitions.
