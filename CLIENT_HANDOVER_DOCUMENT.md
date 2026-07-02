# Client Handover Document - VentureLens AI

Welcome to the VentureLens AI Handover Package. This document details the architectural topology, deployment configuration, and security settings required to run and maintain the platform.

---

## 1. System Components
- **Frontend App**: Next.js 16 + React 19 (TypeScript & Tailwind).
- **Backend API Gateway**: FastAPI (Python 3.11).
- **Relational Storage**: PostgreSQL.
- **Semantic Vector Storage**: Qdrant.
- **Asynchronous Task Queue**: Celery (backed by Redis broker).

---

## 2. Maintenance Operations

### Manual Seeding
To re-seed development data rooms:
```bash
cd backend
.\venv\Scripts\python -m app.seed
```

### Production Security Parameters
- Enforce Clerk RBAC roles in frontend routing.
- Set `NEXT_PUBLIC_MOCK_AUTH=false` in production.
