# Monitoring Setup Guide - VentureLens AI

Detailed instructions to configure system observability in production.

---

## 1. Sentry Integration
Create a Sentry project and set the SDK configurations:
- **Frontend**: Insert `Sentry.init` inside `sentry.client.config.ts`.
- **Backend**: Configure `sentry-sdk` middleware in `app/main.py`.

## 2. Uptime Monitoring
Set up **UptimeRobot** or Pingdom probes:
- Target endpoint: `https://api.venturelens.ai/api/v1/auth/health`
- Alert intervals: 60 seconds.
- Notification triggers: Webhooks sending direct alerts to Slack / Teams.
