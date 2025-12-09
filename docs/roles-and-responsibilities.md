# Roles & Responsibilities

This document provides an example of how roles might interact with a monorepo like this one.  
It demonstrates common team structures and ownership patterns for reference when building your own projects.

> **Note:** This is a template repository. These role definitions are examples, not active assignments.

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

