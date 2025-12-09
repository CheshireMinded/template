# Testing Architecture

This document summarizes the testing layers across the platform.

---

## Layers

1. **Unit Tests**
   - Backend (Jest)
   - Frontend (Vitest)

2. **Integration Tests**
   - Backend HTTP tests (Jest, supertest-style patterns)
   - Validating controllers + routes + middleware

3. **Contract Tests**
   - Dredd + `openapi.yaml`
   - Ensures backend implementation matches API specification

4. **End-to-End Tests**
   - Playwright tests against running frontend + backend
   - Validates critical user flows

5. **Load/Performance Tests**
   - k6 scripts targeting frontend and backend
   - Smoke-level scenarios, extendable to stress tests

---

## Where Tests Live

- Backend:
  - `apps/backend-api/tests/unit/`
  - `apps/backend-api/tests/integration/`
- Frontend:
  - `apps/frontend-react/tests/unit/`
  - `apps/frontend-vue/tests/unit/`
- Contract:
  - `tests/contract/`
- E2E:
  - `tests/e2e/`
- Load:
  - `tests/load/`

---

## CI Integration

- `tests.yml`:
  - Runs unit + integration tests on every PR & push
  - Runs contract tests
  - Optionally runs E2E tests

Load tests can be run:

- On-demand by engineers  
- On a nightly/weekly schedule (recommended for larger deployments)

---

## Coverage

As a next step, coverage thresholds can be enforced:

- Backend Jest:
  - Configure `collectCoverage` and `coverageThreshold`
- Vitest:
  - Use `coverage` option in `vitest.config.mts`

We treat coverage as a guardrail, not a hard gate; critical paths should have high coverage.

