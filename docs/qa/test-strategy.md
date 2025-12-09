# Test Strategy

## 1. Goals

- Catch regressions early and automatically.
- Provide confidence in releases to staging and production.
- Ensure critical paths (auth, main flows) are always covered.

## 2. Test Levels

### 2.1 Unit Tests

- **Scope:** Single functions, components, or modules.
- **Tools:**
  - Frontends: Jest/Vitest + React Testing Library/Vue Test Utils.
  - Backend: Jest.
- **Run:**
  - On every PR in CI.
  - Locally before committing major changes.

### 2.2 Integration Tests

- **Scope:** Multiple components/services interacting (e.g., backend endpoints + DB mock).
- **Tools:**
  - Backend: Jest + Supertest.
- **Run:**
  - In CI on PR and on main branch.

### 2.3 End-to-End (E2E) Tests

- **Scope:** Full user flows from browser perspective.
- **Tools:** Cypress / Playwright (to be chosen and documented here).
- **Run:**
  - Against staging environment.
  - Before major releases.

### 2.4 Non-Functional Tests

- **Performance:** Automated Lighthouse runs during CI for main flows.
- **Accessibility:** Axe or equivalent checks integrated into E2E tests, plus manual reviews.

## 3. Coverage Expectations

- **Unit tests:** Aim for ~70-80% coverage on core services.
- **Critical paths:** Log in, primary user flows, and payment/critical operations must be covered by E2E.

## 4. CI Integration

- CI pipelines must:
  - Run lint → unit/integration tests → build.
  - Fail the build on test or lint failures.
  - Optionally publish coverage reports.

Update this document as new tools or conventions are adopted.
