# Environments

We maintain separate environments for isolation and safety.

## 1. Development

- **Purpose:** Local development.
- **Location:** Developer machines, `docker-compose.dev.yml`.
- **URLs:**
  - React app: `http://localhost:5173`
  - Backend API: `http://localhost:3000`
- **Characteristics:**
  - Debug logging enabled.
  - Hot-reload for frontend and backend.
  - Uses local or sandbox services.

## 2. Staging

- **Purpose:** Pre-production validation.
- **Access:** Restricted to team members.
- **URLs:**  
  - App: `https://staging.app.example.com`
  - API: `https://staging.api.example.com`
- **Characteristics:**
  - As close to production as possible.
  - Used for end-to-end tests and UAT.
  - Feature flags may default to "on" for testing.

## 3. Production

- **Purpose:** Live user traffic.
- **URLs:**  
  - App: `https://app.example.com`
  - API: `https://api.example.com`
- **Characteristics:**
  - Strict monitoring, alerting, and SLOs.
  - Changes only via CI/CD and approved processes.
  - Feature flags used for controlled rollouts.

## 4. Environment Configuration

- Shared and environment-specific config stored in:
  - `/env/.env.development.example`
  - `/env/.env.staging.example`
  - `/env/.env.production.example`

Secrets are never committed; they must be stored in the chosen secret management solution.

Update this document when new environments or URLs are added.
