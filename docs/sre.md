# Site Reliability Engineering (SRE)

## Service Level Objectives (SLOs)
VentureLens AI targets strict uptime and performance metrics:
- **API Availability**: 99.99% per month.
- **Synchronous p95 Latency**: < 50ms.
- **Async Workflow Enqueuing p95**: < 100ms.

## Incident Management Integration
- **Prometheus AlertManager**: Configured to route critical alerts (e.g., Redis outages, 5xx spikes) directly to PagerDuty.
- **Automated Ticketing**: Non-critical warnings (e.g., elevated LLM timeouts) automatically route to Jira via webhook bridges.

## Chaos Engineering Resilience
VentureLens AI is hardened against infrastructure failure:
- **Redis Outages**: SlowAPI rate limiting degrades gracefully, failing open.
- **Kubernetes Node Evictions**: Celery gracefully handles `Retry` exceptions to seamlessly re-queue AI RAG tasks on healthy worker nodes.
