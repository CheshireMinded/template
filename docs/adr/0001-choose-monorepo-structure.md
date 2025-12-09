# ADR 0001: Choose Monorepo Structure

- **Date:** 2025-01-01
- **Status:** Accepted

## Context

We have multiple related applications:

- Static landing page
- React frontend
- Vue frontend
- Backend API
- Shared infra (Kubernetes, Terraform)

Managing these in separate repositories would increase overhead for:

- Cross-cutting changes
- Consistent tooling and security controls
- Shared CI/CD pipelines

## Decision

We will use a **single monorepo**:

- `apps/` for application code
- `infra/` for infra-as-code
- `docs/` for documentation

We will centralize:

- ESLint/Prettier configs
- CI pipelines
- Security policies and templates

## Consequences

- **Pros:**
  - Easier to make coordinated changes.
  - Single source of truth for infra and docs.
  - Shared tooling and enforcement.

- **Cons:**
  - Larger repository; slower clones.
  - Needs conventions to avoid conflicts (e.g., lint rules, test runs).

We accept these trade-offs and will revisit if repo size becomes a significant operational issue.
