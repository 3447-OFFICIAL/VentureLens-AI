# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-06-09 - Institutional Release
### Added
- **Multi-Agent LangGraph Framework**: Replaced legacy sequential chains with a state-machine driven multi-agent RAG workflow (Financial, Legal, Thesis).
- **Context Trust Scoring**: New LangGraph node that detects untrusted sources and RAG poisoning attempts before LLM generation.
- **Monte Carlo Async Vectorization**: Rewrote legacy Python loops in C-level NumPy, reducing simulation times by 95% (5000 simulations in 18ms).
- **GDPR Readiness**: Implemented `DELETE /api/privacy/forget_me` cascading hard-deletions across Postgres and Qdrant.
- **PagerDuty & Jira Integrations**: AlertManager routing for critical application faults.
- **Disaster Recovery**: Kubernetes S3 Backup CronJobs.
- **SOC 2 Hardening**: Eliminated SSRF vulnerabilities via explicit `requests` whitelisting and timeout enforcements.
- **Strict RBAC & Tenant Isolation**: Re-engineered IDOR protection across all Postgres/Qdrant queries.

### Removed
- Legacy synchronous `/api/intelligence/memo` endpoint in favor of async Celery queuing.
