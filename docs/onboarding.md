# Onboarding Guide (Template)

Welcome to the platform template! This guide will help new developers get started quickly.

---

## 1. Requirements

Install:

- Node.js 18+  
- Docker  
- Git  
- VS Code (recommended)  
- `make`  
- Python3 (optional for venv)  

---

## 2. First-Time Setup

```bash
make install
make dev
```

---

## 3. Running the Apps

Backend:
```bash
cd apps/backend-api
npm run dev
```

React Frontend:
```bash
cd apps/frontend-react
npm run dev
```

Vue Frontend:
```bash
cd apps/frontend-vue
npm run dev
```

---

## 4. Running Tests

```bash
make test
make lint
```

---

## 5. Understanding the Repository

- `apps/` - all application code
- `infra/` - Docker, Kubernetes, Terraform
- `docs/` - documentation
- `tests/` - E2E, load, contract testing

---

## 6. Creating Your First PR

1. Create a branch
2. Make changes
3. Run linting + tests
4. Open a PR using the template
5. Ensure CI passes

That's it! You're contributing like a pro.

