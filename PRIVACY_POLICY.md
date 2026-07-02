# Privacy Policy - VentureLens AI

**Effective Date: July 2, 2026**

VentureLens AI ("we", "us", "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and share personal data in connection with our VC Due Diligence & Portfolio Intelligence platform.

---

## 1. Data Collection & Processing

We process data in compliance with:
- **General Data Protection Regulation (GDPR)** (EU)
- **Digital Personal Data Protection Act (DPDPA), 2023** (India)

### Information We Collect:
- **Account Data**: Name, email, company, and credentials processed securely via Clerk Auth.
- **Due Diligence Uploads**: Pitch decks, financial metrics, and cap tables uploaded by users. These are isolated strictly by tenant organization.
- **Usage Data**: Access logs, page requests, and diagnostic information processed via OpenTelemetry.

---

## 2. Data Security & Storage

All data is stored inside secure, encrypted databases hosted in compliance with Tier-1 industry standards.
- Database access is restricted to verified roles using Clerk RBAC.
- Vector embeddings in Qdrant are segregated using strict multi-tenant payload identifiers.

---

## 3. Your Rights

Under GDPR and DPDP, you have the right to:
- Access your data.
- Correct inaccurate data.
- Request deletion of your personal data ("Right to be Forgotten"). You can invoke this by contacting security@venturelens.ai or calling our cascade API endpoint.
