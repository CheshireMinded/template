# Architecture Overview

## 1. System Components

The platform consists of:

- **Static Landing Page**
  - Deployed as static assets behind a CDN.
  - Purpose: marketing / landing.

- **React Frontend (`frontend-react`)**
  - SPA for end users.
  - Communicates with the backend API via HTTPS (`/api/v1/...`).

- **Vue Frontend (`frontend-vue`)**
  - SPA for admin / internal dashboards.
  - Restricted access (e.g., SSO, VPN, IP allow-list).

- **Backend API (`backend-api`)**
  - Node.js/Express service.
  - Provides REST endpoints for frontends.
  - Responsible for authentication, authorization, and business logic.

- **Infrastructure**
  - Kubernetes cluster hosting frontend + backend services.
  - Ingress controller providing HTTPS entrypoint.
  - ConfigMaps and Secrets for configuration and credentials.
  - Optional: managed DB, cache, message queues (fill in as needed).

## 2. High-Level Diagram (Textual)

```text
[Browser] 
   |
   v
[CDN / WAF] --> [K8s Ingress] --> [Frontend Service(s)]
                                 |
                                 v
                             [Backend Service] --> [Database / Other deps]
```

## 3. Responsibilities

### Frontends

- Render UI, call backend APIs.
- No direct DB access.
- Must not store secrets in source code or unencrypted local storage.

### Backend

- Validates input, enforces access control.
- Emits structured logs for audit and debugging.
- Never exposes internal error details to clients.

## 4. Security & Observability (High-Level)

- TLS termination at ingress or CDN/WAF.
- Security headers enforced (see `security/security-headers.md`).
- Centralized logging and metrics (error rate, latency, health).
- Health checks for readiness and liveness for all services.

See `data-flow.md` for more detailed data paths.
