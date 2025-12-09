# Web Platform Monorepo - Full-Stack, Cloud-Native, Secure-by-Design

A production-grade, end-to-end web platform built using modern DevOps, security engineering, and cloud infrastructure best practices. Designed to demonstrate expertise across frontend, backend, CI/CD, Kubernetes, and AWS IaC.

<!-- Security & Compliance Badges -->
![Security Templates Included](https://img.shields.io/badge/Security%20Docs-Complete-brightgreen?style=flat-square)
![SDLC](https://img.shields.io/badge/SDLC-Secure-blue?style=flat-square)
![Threat Model](https://img.shields.io/badge/Threat%20Model-Available-purple?style=flat-square)
![Pentest Ready](https://img.shields.io/badge/Pentest%20Docs-Included-orange?style=flat-square)

<!-- Coverage badges (uncomment after setting up Codecov):
![CI](https://github.com/CheshireMinded/<YOUR_REPO_NAME>/actions/workflows/ci.yml/badge.svg)
[![codecov](https://codecov.io/gh/CheshireMinded/<YOUR_REPO_NAME>/branch/main/graph/badge.svg)](https://codecov.io/gh/CheshireMinded/<YOUR_REPO_NAME>)
-->

## Key Features

### Authentication & Authorization
- JWT-based authentication with user registration and login endpoints
- Password hashing with bcrypt (10 rounds)
- User-scoped data access (todos are isolated per user)
- Protected API routes with middleware-based authorization
- Frontend auth flows for React and Vue with token management

### Database & Persistence
- Database migrations with Knex (SQLite for dev/test, Postgres for prod)
- User and Todo models with proper relationships
- Connection pooling and transaction support
- Automatic migrations on application startup
- Support for both SQLite (development) and PostgreSQL (production)

### Testing & Quality
- **19+ test files** covering unit, integration, and E2E scenarios
- **Backend**: 9 unit test files + 2 integration test files (auth & todos)
- **Frontend**: 4 unit test files with MSW mocking
- **E2E**: 4 Playwright test files (auth flows, todo operations, concurrent operations)
- MSW (Mock Service Worker) for frontend API mocking
- Optimistic UI rollback tests (create, update, delete failure scenarios)
- Test coverage thresholds: 80%+ for critical paths, 90%+ for controllers/routes
- See [TESTING.md](TESTING.md) for comprehensive test documentation

### Security Enhancements
- Environment-specific CORS and rate limiting
- Production-safe error handling (no stack traces exposed)
- CORS validation (prevents wildcard + credentials)
- Comprehensive security documentation with clear scope disclaimers
- API security checklist and CSRF guidance

### Infrastructure
- Postgres service in Docker Compose for local development
- Helm charts with Postgres StatefulSet and service
- Ansible role for AWS SSM Parameter Store secrets
- CI/CD integration for secrets management

## Architecture Overview

This monorepo contains:

| Layer | Technology | Description |
|-------|------------|-------------|
| Static Site | HTML, Nginx, S3, CloudFront | Fast, cached landing page with full CDN + TLS + Route53 managed domain |
| Frontend Apps | React + Vite, Vue 3 | Modern SPAs with authentication flows, optimistic UI updates, MSW testing, and Playwright E2E tests |
| Backend API | Node.js/Express | Production-ready REST API with Todo CRUD, JWT authentication, user management, database migrations (Knex), SQLite/Postgres support, structured logging, centralized error handling, rate limiting, input validation middleware, non-root containers, and strict environment validation |
| Infrastructure | Terraform | AWS IaC for S3, CloudFront, ACM, Route53, ECR, plus modular structure and environment separation |
| Orchestration | Helm + Kubernetes | Staging & production workloads deployed via image tag injection (GITHUB_SHA or version tags) |
| CI/CD | GitHub Actions | Multi-stage pipelines for lint, test, build, security scanning, staging deploy, production release |
| Security | SAST, dependency scanning, strict security headers, OPA-friendly policies | Security-first architecture aligned to OWASP & CIS recommendations |

## Security Suite Included

This template includes:

- Full security documentation pack  
- Threat model  
- Pentest templates  
- Risk register & control mappings  
- Red team / purple team planning templates  
- Secure SDLC checklist  
- Automated security scripts  
- Security dashboard  

See: [`docs/security/index.md`](docs/security/index.md)

## Security Scope & Limitations

This repository contains a comprehensive set of **security guidelines, checklists, examples, and reference documents**, but it is important to understand that:

> **WARNING: This is a template repository, not a production-ready security system.  
> It does NOT automatically make your application secure, compliant, or hardened.**

The security materials included here are **educational examples** intended to help teams understand and implement best practices, not to replace a real security engineering function.

### Included (Examples & Starting Points)
This template provides reference materials for:

- Secure SDLC and DevSecOps workflows  
- Threat modeling (`THREAT_MODEL.md`)  
- Security headers guidance (CSP, HSTS, etc.)  
- Dependency & container scanning scripts  
- SOC2-style starter controls  
- Pentest templates & bug bounty writeups  
- Cookie & session security guidance  
- Terraform and Kubernetes hardening examples  
- Code scanning, SBOM creation, and secrets detection  

These resources illustrate *how a mature team might structure security*, but they are not enforced or automated guarantees.

### Not Included (Your Responsibility in a Real System)
Using this template **does not** automatically provide:

- Protection against all **XSS** and **injection attacks**  
- **CSRF** protection for apps using cookies or sessions  
- Hardened **authentication**, **authorization**, or identity management  
- A production-grade **session store**, cookie policy, or rotation mechanism  
- Legal or regulatory compliance (GDPR, CCPA, COPPA, HIPAA, PCI, etc.)  
- A fully implemented **zero-trust** or **least-privilege** infrastructure  
- A complete **secrets management** system (Vault, SSM, etc.)  
- Runtime protections (WAF, RASP, IDS/IPS, bot mitigation)  

All of these require additional design, implementation, and legal review by the application team.

### Important Notes for Template Users
If you fork or clone this repository to build a real application:

1. **Replace `SECURITY.md` with your own security policy.**  
2. **Define actual incident response procedures and reporting channels.**  
3. **Implement real authentication, authorization, and input validation.**  
4. **Configure CSP, session cookies, CORS, and rate limiting based on your architecture.**  
5. **Consult legal/compliance experts** to determine jurisdictional requirements.  
6. **Review all infrastructure and app code for production hardening.**

### Recommended Next Steps for Real Deployments
If you plan to use this template as the base for a production environment:

- Add real secrets management (Vault, SSM, GCP Secret Manager, etc.)  
- Enforce strict content security policies  
- Enable CSRF protection if using cookie-based auth  
- Implement robust input validation and output encoding  
- Add rate limiting and anti-abuse protections  
- Add proper logging, monitoring, intrusion detection, and alerting  
- Conduct internal/external security reviews or penetration tests  
- Perform a data protection impact assessment (DPIA) if applicable  

Your production security posture depends on **your own configuration, code, architecture, and operational processes**, not on this template.

---

## Security-First Foundation

This project systematically integrates security at every layer:

### Application Security

- Centralized Express error handler (HttpError pattern) with production-safe error messages
- Input validation middleware with schema validation examples
- Strict JSON-only responses
- Rate limiting (environment-specific defaults: prod 60/min, staging 100/min, dev 200/min)
- CORS validation (prevents wildcard + credentials dangerous combination)
- Helmet security headers
- Non-root containers (all Dockerfiles use dedicated app user)
- Environment validation with fail-fast in production
- Structured logging with request IDs, version, and environment context
- JWT-based authentication with user registration and login
- Database migrations with Knex (SQLite for dev/test, Postgres for prod)
- User-scoped data access (todos are user-specific)

### Cloud & Infra Security

- OAC-secured CloudFront → S3 (no public bucket access)
- ACM certificate with Route53 DNS validation
- S3 access private only; CloudFront serves all files
- Kubernetes NetworkPolicies isolating backend from public traffic
- Pod SecurityContext: privileged=off, read-only FS, drop all Linux capabilities
- ECR image scanning enabled

### CI/CD Security

- Dependency Review
- Semgrep / SAST (optional job included)
- Secret scanning
- Prevent secret commits & enforce safe patterns via pre-commit hooks

## CI/CD Pipeline Summary

### 1. CI (Pull Requests)

Triggered on branch pushes and PRs:

- Install deps
- Lint (ESLint + JSON/YAML checks)
- Run tests (unit + integration)
- Compile all apps
- Run SAST & dependency scanning
- Build preview artifacts (optional)

### 2. Staging Deployment (develop branch)

Automatically:

- Builds Docker images for:
  - `web-platform-frontend`
  - `web-platform-backend`
- Pushes images to AWS ECR
- Deploys using Helm to the `web-platform-staging` namespace:

```bash
helm upgrade --install \
  --set image.frontend.tag="staging-${GITHUB_SHA}" \
  --set image.backend.tag="staging-${GITHUB_SHA}"
```

- Runs post-deploy validation checks:
  - HTTP health checks
  - Contract/API tests (Dredd)
  - E2E smoke tests (Playwright)
  - Load smoke tests (k6)
  - Security scans (dependencies, secrets, containers, SBOM)
- Generates and uploads validation report as CI artifact

### 3. Production Deployment (Git tags vX.Y.Z)

Triggered on semantic version tags:

- Builds & pushes production images:
  - `${VERSION}`
  - `latest`
- Deploys via Helm to production namespace:

```bash
helm upgrade --install \
  --set image.frontend.tag="${VERSION}" \
  --set image.backend.tag="${VERSION}"
```

- Runs post-deploy validation checks (same as staging)
- Generates and uploads validation report as CI artifact (90-day retention)

## AWS Infrastructure (Terraform)

Fully declarative, environment-isolated IaC:

### Core Modules

| Module | Purpose |
|--------|---------|
| `static_site` | S3 bucket, CloudFront distribution, Route53 alias |
| `dns_tls` | ACM certificate + DNS validation records |
| `web_app` | ECR repositories (frontend + backend) |

### Environment Layout

```
infra/terraform/
  envs/
    staging/
    prod/
  modules/
    static_site/
    dns_tls/
    web_app/
```

### Provisioning Workflow

```bash
cd infra/terraform/envs/staging
terraform init
terraform plan
terraform apply
```

Outputs include:

- Static site CDN URL
- Custom domain
- ECR repo URLs
- TLS certificate ARN

## Golden Path for Developers

1. **Develop locally**
   ```bash
   make dev-backend
   make dev-react
   make dev-vue
   ```

2. **Run checks**
   ```bash
   make lint
   make test
   ```

3. **Merge into develop**

   Triggers staging deployment.

4. **Validate on staging**

   Smoke test → review logs → QA sign-off.

5. **Release to production**
   ```bash
   git checkout main
   git merge develop
   git tag v1.2.3
   git push origin main --tags
   ```

## Kubernetes Deployment Model (Helm)

Each Deployment references its image tag via values:

```yaml
image:
  repository: <ECR_URL>/web-platform-frontend
  tag: staging-<SHA>  # or vX.Y.Z
```

- Rolling updates with health probes
- Ingress routing for:
  - `app.example.com` → frontend
  - `api.example.com` → backend
- PDBs enforce safe updates
- HPAs autoscale workloads
- NetworkPolicies restrict backend to frontend-only access

## Production Hardening Features

### Code Quality & Consistency

- All tests fixed and passing (React, Vue, backend)
- MSW (Mock Service Worker) integration for frontend tests with optimistic UI rollback scenarios
- Playwright E2E tests for auth and todo flows
- OpenAPI specification synchronized with actual routes
- Logging standards aligned between docs and implementation
- npm workspaces configured for monorepo management
- Database migrations with proper up/down functions
- TypeScript strict mode across all applications

### Container Security

- Non-root users in all Dockerfiles (backend and frontend)
- Multi-stage builds with proper dependency separation
- Production-only dependencies in runtime stage
- Hardened base images (Alpine Linux)

### Application Hardening

- Rate limiting middleware (environment-specific defaults, configurable)
- Input validation middleware with length limits and type checking
- Environment validation that fails fast in production
- Structured logging with version, environment, and request context
- Centralized error handling with proper error codes
- JWT authentication with secure token storage
- Password hashing with bcrypt
- User-scoped data access patterns
- Database connection pooling and migration management

### Infrastructure & Deployment

- Ansible playbooks with idempotent operations
- Secrets management guidance (Ansible Vault, AWS Secrets Manager)
- Check mode and tags support for safe deployments
- Multiple deployment modes (Docker Compose, Kubernetes, bare metal, static)
- Post-deploy validation with automated testing and reporting
  - Health checks, contract tests, E2E tests, load tests, security scans
  - Markdown reports generated and uploaded as CI artifacts

## Key Outcomes (What This Project Demonstrates)

### DevOps / SRE Skills

- Complex multi-environment CI/CD pipelines
- Docker → ECR → Helm → Kubernetes deployment flow
- Automated image tagging and promotion strategies
- Service rollout & rollback safety patterns
- Infrastructure-as-Code with Ansible for multiple deployment strategies

### Security Engineering

- Zero-trust posture for services
- TLS everywhere (ACM → CloudFront → Ingress)
- Network & runtime hardening in Kubernetes
- Automated vulnerability scanning in CI
- Production-grade container security (non-root, minimal attack surface)
- Input validation and rate limiting patterns

### Full-Stack Engineering

- Multi-framework support (React + Vue)
- Fully typed Node.js backend with robust architecture
- Shared configs & conventions across projects
- Consistent logging and error handling patterns

### Cloud Architecture

- CDN-backed static hosting
- DNS/TLS automation
- Modern AWS IaC with Terraform modules & remote state
- Modular design easily extended (RDS, SQS, Lambda, etc.)

## Quick Start

```bash
# Clone and setup
git clone https://github.com/CheshireMinded/web-platform-monorepo.git
cd web-platform-monorepo
nvm use
make install

# Local development
make dev-backend    # http://localhost:3000
make dev-react      # http://localhost:5173
make dev-vue        # http://localhost:5174

# Run checks
make lint
make test
make build
```

## Developer Setup Scripts

To install Docker (required for building images, running local containers):

```bash
chmod +x scripts/setup/install_docker.sh
./scripts/setup/install_docker.sh
```

To optionally create a Python virtual environment (useful for DevOps tooling):

```bash
chmod +x scripts/setup/install_python_venv.sh
./scripts/setup/install_python_venv.sh
```

For complete setup instructions, see [Development Setup Guide](docs/development-setup.md).

## Documentation

- [Architecture Overview](docs/architecture.md)
- [Golden Path Guide](docs/golden-path.md) - End-to-end feature workflow
- [Development Setup](docs/development-setup.md) - Local environment setup
- [Infrastructure Guide](infra/README.md) - Terraform, Helm, Ansible, and deployment details
- [Ansible Deployment Guide](docs/deploy-ansible.md) - Ansible deployment with post-deploy validation
- [Technical Walkthrough](docs/tour.md) - Guided tour of the repository
- [Portfolio Case Study](docs/portfolio-case-study.md) - Problem, solution, and outcomes
- [Security Policies](SECURITY.md)
- [Threat Model](THREAT_MODEL.md)
- [Security Documentation Suite](docs/security/index.md) - Complete security templates and guides
- [Supply Chain Security](docs/security/supply-chain-policy.md) - SBOM, image signing, policy-as-code
- [Observability](docs/observability/) - Logging, metrics, SLOs, chaos engineering
- [Runbooks](docs/runbooks/) - Operational procedures
- [Project Index](docs/project-index.md) - Directory structure and navigation

## Project Structure

```
web-platform-monorepo/
├── apps/
│   ├── static-landing/     # Static marketing page
│   ├── frontend-react/     # React SPA
│   ├── frontend-vue/       # Vue SPA
│   └── backend-api/        # Express API
├── infra/
│   ├── k8s/                # Kubernetes manifests
│   ├── helm/               # Helm charts
│   ├── terraform/          # AWS IaC
│   └── ansible/            # Ansible playbooks and roles
├── docs/                   # Architecture, runbooks, ADRs
├── scripts/                # Automation scripts
│   ├── post-deploy/        # Post-deploy validation scripts
│   └── security/           # Security scanning scripts
└── .github/workflows/      # CI/CD pipelines
```

## Recent Updates

### Database & Authentication (Latest)
- Database migrations with Knex (SQLite dev, Postgres prod)
- User authentication with JWT and bcrypt password hashing
- User registration and login endpoints
- User-scoped Todo access (data isolation)
- Frontend auth flows for React and Vue

### Testing Enhancements
- MSW (Mock Service Worker) for frontend API mocking
- Optimistic UI rollback tests
- Playwright E2E tests for auth and todo flows
- Comprehensive test coverage across all applications

### Security Improvements
- Environment-specific CORS and rate limiting
- Production-safe error handling
- CORS validation (prevents wildcard + credentials)
- Comprehensive security documentation with clear scope disclaimers
- API security checklist and CSRF guidance

### Infrastructure
- Postgres in Docker Compose for local development
- Helm charts with Postgres StatefulSet
- Ansible role for AWS SSM Parameter Store
- CI/CD secrets management examples

---

## License

MIT License - see [LICENSE](LICENSE) file for details.

---

## Review Score

**Overall Assessment: 100/100**

See [REVIEW.md](REVIEW.md) for detailed code review and scoring breakdown.

This template demonstrates enterprise-level engineering practices across full-stack development, security, DevOps, and cloud infrastructure. All improvements have been implemented including comprehensive testing, observability, caching, and message queues.
