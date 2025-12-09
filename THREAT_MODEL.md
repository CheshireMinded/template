# Threat Model

## 1. System Overview

See `docs/architecture.md` and `docs/data-flow.md`.

Components:

- Static landing page (public)
- React SPA (authenticated user-facing)
- Vue SPA (admin / internal dashboard)
- Backend API (Node.js / Express)
- PostgreSQL or other DB (behind firewall)
- K8s cluster running web + API
- CDN / WAF in front of public endpoints

## 2. Assets

- User accounts and session tokens
- PII (if any - define explicitly)
- Application configuration and secrets
- Infrastructure credentials

## 3. Trust Boundaries

- Browser ↔ CDN/WAF
- CDN/WAF ↔ K8s Ingress
- Frontend ↔ Backend API
- Backend ↔ Database
- Admin interfaces ↔ internal services

## 4. Threats (STRIDE)

- **Spoofing**: stolen tokens, credential stuffing
- **Tampering**: request manipulation, stored XSS
- **Repudiation**: insufficient logging for security events
- **Information Disclosure**: misconfigured S3 bucket, verbose error responses
- **Denial of Service**: request floods, resource exhaustion
- **Elevation of Privilege**: broken access control, misconfigured RBAC

## 5. Mitigations

- OAuth2 / session management, secure cookies
- CSP, input validation, escaping, output encoding
- Centralized structured logging for auth & admin actions
- Encryption in transit (TLS) and at rest (DB level)
- Rate limiting, WAF rules, autoscaling
- Role-based access control (RBAC) at app & K8s level

## 6. Open Risks / TODO

- [ ] Finalize DPA and data classification
- [ ] Formal pentest before go-live
- [ ] Implement anomaly detection on login events

