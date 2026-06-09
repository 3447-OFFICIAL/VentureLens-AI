# Compliance & Governance

VentureLens AI maps seamlessly to standard institutional risk and compliance frameworks.

## SOC 2 Type II & ISO 27001
- **Logical Access**: Strict RBAC and enforced MFA capabilities via external identity providers.
- **System Monitoring**: Comprehensive audit logging through `structlog` and OpenTelemetry tracing.
- **Data Encryption**: TLS 1.3 enforced in transit; AES-256 assumed at rest via infrastructure deployments (AWS EBS / RDS).

## GDPR & CCPA
- **Right to be Forgotten**: Native implementation via the `DELETE /api/privacy/forget_me` endpoint.
- **Cascading Execution**: Authenticated deletion requests cascade through PostgreSQL relational stores and hard-delete associated embeddings in Qdrant.
- **Data Minimization**: Only essential financial telemetry is extracted from parsed documents.
