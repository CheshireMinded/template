# Roles & Responsibilities

This document explains how roles interact with this monorepo.  
Even in a small team, these roles provide clarity and ownership.

---

## Full-Stack Developer

**Owns:**
- React / Vue frontend features
- Backend API routes, controllers, validation, and tests
- TypeScript code quality and consistency

**Responsibilities:**
- Add API endpoints in alignment with OpenAPI spec  
- Maintain frontend-to-backend integration  
- Write unit and integration tests  
- Ensure accessibility & performance budgets are met

---

## DevOps / Platform Engineer

**Owns:**
- CI/CD pipelines (GitHub Actions)
- Dockerfiles & base images
- Kubernetes manifests & Helm charts
- Terraform infrastructure

**Responsibilities:**
- Maintain staging/prod environments  
- Enforce container security and non-root images  
- Own disaster recovery, rollbacks, and deployments  
- Ensure observability (metrics, logs, tracing)

---

## Security Engineer

**Owns:**
- Vulnerability scanning pipelines  
- Dependency auditing (Dependabot/Renovate)  
- Secret rotation policies & security headers  
- Threat modeling & incident response framework  

**Responsibilities:**
- Maintain SBOM accuracy  
- Review Terraform & K8s security posture  
- Validate PRs for security regressions  

---

## Product / Technical PM

**Owns:**
- Feature roadmap  
- Ensuring docs & ADRs are updated  
- Change management and release tracking

**Responsibilities:**
- Approve production deployments  
- Communicate breaking changes  
- Coordinate release timelines  

---

## QA Engineer

**Owns:**
- Test strategy  
- Performance budgets  
- Accessibility compliance  

**Responsibilities:**
- Verify staging builds  
- Report regressions  
- Ensure automated tests are sufficient

