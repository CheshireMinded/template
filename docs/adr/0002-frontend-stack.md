# ADR 0002: Frontend Stack

- **Date:** 2025-01-01
- **Status:** Accepted

## Context

We need:

- A modern SPA framework for the main user-facing app.
- A framework for admin/internal tools.
- A simple static site generator/build setup for the landing page.

## Decision

- Use **React + TypeScript + Vite** for the primary frontend (`frontend-react`).
- Use **Vue 3 + TypeScript + Vite** for the admin frontend (`frontend-vue`).
- Use **Vite + plain HTML/CSS/JS** for the static landing page (`static-landing`).

Shared choices:

- Use ESLint + Prettier for consistency.
- Use Jest (or Vitest) for unit tests.
- Use the same Node.js LTS version across all frontends.

## Consequences

- **Pros:**
  - Modern, widely adopted stacks.
  - Fast dev builds and HMR via Vite.
  - Easy to share patterns across frontends.

- **Cons:**
  - Two SPA frameworks (React + Vue) require some team familiarity.
  - Slightly more CI complexity (multiple frontend builds).

If we find maintaining both React and Vue burdensome, we may consolidate in a future ADR.
