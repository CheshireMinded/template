# Development Conventions

This document defines the coding, naming, and structural conventions used across this template.

> **Note:**  
> These conventions are opinionated defaults intended for consistency, clarity, and long-term maintainability.

---

## 1. Branch Naming

Use:

- `feature/<short-description>`  
- `fix/<brief-description>`  
- `chore/<task>`  
- `docs/<section>`  

Examples:

- `feature/add-login-endpoint`
- `fix/cors-config`
- `docs/update-architecture`

---

## 2. File & Folder Structure

Backend:

- `controllers/` - Request handling
- `routes/` - Routing definitions
- `middleware/` - Reusable Express middleware
- `config/` - Environment, logging
- `tests/` - Unit + integration

Frontend:

- `src/components/` - Reusable UI components  
- `src/pages/` - Page-level views  
- `src/hooks/` - Custom hooks  
- `tests/` - Unit tests with Vitest  

---

## 3. Coding Style

- Follow ESLint + Prettier rules in `/config`  
- Use TypeScript everywhere  
- Prefer async/await  
- Avoid deeply nested logic  
- Use dependency injection where practical  

---

## 4. Error Handling

- Always return structured error objects  
- Never leak internal error messages  
- Log errors with context + request ID  

---

## 5. Naming Conventions

- Variables: `camelCase`
- Types/interfaces: `PascalCase`
- Environment variables: `SCREAMING_SNAKE_CASE`
- File names: `kebab-case.ts`

---

## 6. Logging Conventions

Every log must include:

- timestamp  
- request_id (from requestId middleware)  
- log level  
- message  
- metadata  

---

## 7. Testing Conventions

- Unit tests for logic  
- Integration tests for endpoints  
- E2E tests for full flows (Playwright)  
- Coverage thresholds enforced (90% for controllers/routes)

---

## 8. Documentation Requirements

Every feature must update:

- `CHANGELOG.md`  
- API spec (`openapi.yaml`)  
- Relevant docs in `/docs`  

This ensures long-term maintainability and clarity.

