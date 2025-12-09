# Project Index Map

This guide explains every major directory in the monorepo, what it contains, and who typically works with it.

---

## Root

- `/README.md` - Primary documentation overview
- `/CHANGELOG.md` - Version history
- `/Makefile` - Build, test, lint, deploy commands
- `/package.json` - Root-level scripts & shared tools

---

## Applications

- `/apps/backend-api/` - Node.js TypeScript API service
- `/apps/frontend-react/` - React-based frontend
- `/apps/frontend-vue/` - Vue-based frontend
- `/apps/static-landing/` - Static HTML/CSS/JS landing site

Each includes:

- `Dockerfile`
- `tsconfig`
- `/src` directory with clean architecture
- `/tests` (where applicable)

---

## Infrastructure

- `/infra/docker/` - docker-compose dev/prod environments
- `/infra/k8s/` - Raw Kubernetes manifests
- `/infra/helm/web-platform/` - Full Helm chart for all services
- `/infra/terraform/` - AWS IaC (modules + envs)

---

## Documentation

- `/docs/architecture.md`
- `/docs/environments/`
- `/docs/runbooks/`
- `/docs/security/`
- `/docs/qa/`
- `/docs/diagrams.md`
- `/docs/glossary.md`
- `/docs/project-index.md`

Everything needed to onboard new engineers, PMs, DevOps, and SREs.

---

## Config

- `/config/eslint.base.cjs`
- `/config/jest.config.base.cjs`
- `/config/prettier.config.cjs`
- `/config/stylelint.config.cjs`

Shared formatting and linting.

---

## Scripts

- `/scripts/setup/` - Node, Docker, Python setup scripts
- `/scripts/build-all.sh`
- `/scripts/test-all.sh`
- `/scripts/lint-all.sh`
- `/scripts/pre-commit-checks.sh`
- `/scripts/k8s/` - Kind/Minikube scripts

---

## Public

- `/public/404.html`
- `/public/500.html`
- `/public/maintenance.html`

Static error pages.

---

## Requirements

- `/requirements/README.md` - Requirements overview and installation guide
- `/requirements/python-requirements.txt` - Python package dependencies
- `/requirements/system-requirements.md` - System-level requirements documentation

## Policies

- `/SECURITY.md`
- `/THREAT_MODEL.md`
- `/CODEOWNERS`
- `/LICENSE`

---

## Quick "Where Do I Put X?" Guide

| Task | Directory |
|------|-----------|
| Add API endpoint | `/apps/backend-api/src/routes/` |
| Add UI feature | `/apps/frontend-react/src/` |
| Change infra | `/infra/terraform/` |
| Change K8s deployment | `/infra/helm/web-platform/` |
| Add docs | `/docs/` |
| Add CI/CD workflows | `/.github/workflows/` |
| Add a script | `/scripts/` |

