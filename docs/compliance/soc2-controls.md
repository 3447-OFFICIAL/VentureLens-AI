# VentureLens AI - SOC 2 & ISO 27001 Controls Reference

## Logical Access Control
1. **Authentication:** All access to APIs requires valid Bearer tokens issued by Clerk (JWT) verified locally.
2. **Authorization:** Role-Based Access Control (RBAC) restricts endpoints by user role (e.g., admin, analyst, limited_partner).
3. **Tenant Isolation:** All database and vector database (Qdrant) queries are strictly filtered by `tenant_id`.

## Data Security & Privacy
1. **Encryption at Rest:** Supported via PostgreSQL (TDE) and AWS EBS encryption in production.
2. **Encryption in Transit:** All data transmits over TLS 1.3 (HTTPS via Load Balancer).
3. **Data Sanitization:** The `SecurityService` explicitly sanitizes inputs for XSS, SQLi, and prompt injection before reaching the LLM or DB.

## Monitoring & Observability
1. **Audit Logging:** Structured JSON logging (structlog) is implemented.
2. **Tracing:** OpenTelemetry provides distributed tracing across components.
3. **Rate Limiting:** Fine-grained API rate limiting is enforced via Redis and SlowAPI to prevent DoS attacks.
4. **Vulnerability Scanning:** CI/CD pipeline enforces Trivy container scanning and Bandit SAST checks on all commits.

## Infrastructure
1. **Container Security:** Multi-stage Docker builds using minimal images (python:3.11-slim) running under a non-root user (`venturelens`).
2. **Dependency Management:** Dependencies are locked and scanned.

## High Availability
1. **Kubernetes:** Managed deployments with ReplicaSets and Horizontal Pod Autoscalers (HPA) for both API and background workers.
2. **Broker Resilience:** Celery workers backed by Redis queue ensure long-running intelligence tasks are executed reliably even under load.
