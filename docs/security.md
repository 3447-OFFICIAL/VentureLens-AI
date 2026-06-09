# Security Architecture

VentureLens AI incorporates institutional-grade security measures across the entire stack.

## Authentication & Authorization
- **JWT Authentication**: All endpoints require cryptographically signed JSON Web Tokens (via Clerk or internal providers).
- **Role-Based Access Control (RBAC)**: Specific intelligence routes (e.g., `reports.py`) enforce role dependencies (`admin`, `analyst`).

## Tenant Isolation (IDOR Defense)
Deep isolation prevents cross-tenant data leakage. Every relational query and Qdrant vector retrieval inherently filters by the authenticated `tenant_id`.

## Input Sanitization
- **Path Traversal Mitigation**: File uploads and PDF generation engines (e.g., WeasyPrint) strictly escape HTML payloads and sanitize paths to prevent SSRF and XSS.
- **SQLi Protection**: Full reliance on `sqlalchemy` ORM with bound parameters; no raw SQL concatenation.

## CI/CD Security
Every PR is gated by:
- `Trivy` for container vulnerability scanning.
- `Bandit` and `Semgrep` for Python SAST.
