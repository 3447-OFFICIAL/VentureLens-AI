# PROJECT AUDIT: VentureLens AI VC Platform

This document presents a comprehensive audit of the VentureLens AI repository, highlighting broken functionality, mock components, architectural weaknesses, security gaps, and technical debt.

---

## 1. Broken Functionality & System Errors

### A. Backend Import & Runtime Crashes
- **Missing Agents Orchestration**: `backend/app/worker.py` attempts to import `run_due_diligence_workflow` from `app.agents.workflow`. However, `app/agents/workflow.py` does not define this function, causing execution to crash.
- **Missing Models Import**: `backend/app/services/financial_service.py` imports `FinancialMetrics` from `..models.db_models`. However, `backend/app/models/db_models.py` does not exist in the codebase, causing import errors.
- **Telemetry Crash Vector**: `backend/app/core/telemetry.py` unconditionally attempts to initialize OpenTelemetry's `OTLPSpanExporter` without checking if a collector is configured or reachable. This can block startup or log spam.

### B. Frontend Navigation Mismatches
- **Sidebar Case Mismatch**: The sidebar in `InstitutionalDashboard.tsx` checks if `activeTab === item.name` (capitalized, e.g., "Overview", "Companies"). However, the zustand store `use-dashboard-store.ts` initializes the state to `"overview"` (lowercase). This leaves the active state styling unhighlighted.
- **Static Tab Redirection**: Changing the active tab in the store only updates the sidebar styling. The main area of the dashboard always renders the "Overview" widgets. There is no conditional rendering to show the Companies list, Due Diligence trackers, or Reports view.

---

## 2. Placeholder Components & Simulated APIs

### A. Simulated File Upload
- **Dummy Upload Form**: `UploadDocument.tsx` performs a mock `setTimeout` for 2000ms and fires a browser alert without sending a POST request to the backend. It has no integration with the actual document upload endpoints.
- **Dummy Analysis Actions**: Clicking "Analyze Deck" on the Startups table or any related buttons inside the dashboard yields no action or raises a JavaScript error.

### B. Fake Backend APIs
- **Mock Chat Stream**: The `/api/v1/chat/stream` endpoint splits hardcoded string responses and streams them with an artificial sleep delay. It does not use any vector store or LLM provider.
- **Mock Alert System**: The `/api/v1/alerts` endpoint relies on hardcoded fallbacks if the database metrics return empty, returning static data for SynthoAI, EcoMove, and UrbanStash.
- **Simulated Celery Worker**: The `parse_document_task` in `tasks.py` writes static values (`health_score = 85`, `status = "Finished"`) instead of performing real OCR/text extraction or LLM-based analysis.

---

## 3. Missing Database Entities (Phase 4 Gap)
The current relational schema in `backend/app/models/models.py` only defines basic tables (`User`, `Organization`, `VCFirm`, `Startup`, `Deal`, `DueDiligence`, `InvestmentMemo`, `Portfolio`, `Metric`, `Document`, `AuditLog`, `Task`). The following database entities requested for enterprise readiness are completely missing:
- **Founders**: No table exists to track founders' profiles, shares, or biographical data.
- **Investors**: No table exists to manage external investors, LPs, or cap table participants.
- **Meetings**: No table exists to track meeting notes, transcripts, or calendar links.
- **Reports**: No table exists to log generated PDF/Docx files or executive summaries.
- **Notifications**: No table exists for storing system-wide or user alerts/notifications.
- **Comments & Attachments**: No table exists for contextual commentary on deals or audit logs.
- **VersionHistory**: No table exists to track changes made to investment memos or uploaded documents.

---

## 4. Technical Debt, Security, & Performance

### A. Redundant Workers
- There are two files defining Celery apps: `backend/app/celery_worker.py` (which includes tasks) and `backend/app/worker.py` (which defines workflow tasks). They duplicate initialization parameters and should be consolidated.

### B. Security Risks (JWT/RBAC/Data Leak)
- **Local Secret Key**: A hardcoded secret key is stored in `config.py` for JWT signature validation.
- **Missing Clerk Integration**: Next.js auth is currently mocked through a local zustand store that reads credentials from an offline file or inputs. There is no Clerk Provider or RBAC enforcement.
- **Unencrypted Uploads**: Uploaded files are written directly into a local directory (`uploads/`) with no antivirus scanning, file size checks, or secure storage buckets (S3).

### C. Performance & UI Polish
- **Static Recharts**: The sparkline charts use a static dataset (`sparkData`) instead of pulling actual financial history.
- **Missing Loading & Error boundaries**: The app lacks loading spinners and React Error Boundaries, causing white screens if a fetch fails.
