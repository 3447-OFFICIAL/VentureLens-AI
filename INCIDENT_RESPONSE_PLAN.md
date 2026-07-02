# Incident Response Plan - VentureLens AI

## 1. Severity Levels
- **Severity 1 (Critical)**: Inter-tenant data leakage or complete platform down.
- **Severity 2 (High)**: Vector search failure or parsing task crashes.
- **Severity 3 (Medium/Low)**: Layout display discrepancies.

## 2. Escalation & Remediation Steps
1. **Identification**: Alert dispatched from Sentry/UptimeRobot.
2. **Containment**: Rotate keys, patch routers, or temporarily disable user uploads via Feature Flag.
3. **Recovery**: Deploy hotfix releases via GitHub Actions pipeline.
