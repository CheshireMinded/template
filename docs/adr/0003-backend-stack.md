# ADR 0003: Backend Stack

- **Date:** 2025-01-01
- **Status:** Accepted

## Context

The backend must:

- Expose REST APIs.
- Be easy to containerize and run on Kubernetes.
- Provide strong TypeScript support and familiar tooling.

## Decision

- Use **Node.js + Express + TypeScript** for the backend API.
- Use:
  - `helmet` for security headers.
  - `cors` for CORS configuration.
  - Custom middleware for request ID, structured logging, and error handling.
- Use Jest for tests and a simple internal logging abstraction for structured logs.

## Consequences

- **Pros:**
  - Well-known ecosystem.
  - Easy integration with frontends and infra tooling.
  - Type safety with TypeScript.

- **Cons:**
  - Not as opinionated as some frameworks; more conventions needed.
  - Need to manage performance characteristics for high-load scenarios.

We may revisit for more complex needs (e.g., microservices, GraphQL, etc.).
