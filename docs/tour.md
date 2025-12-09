# Technical Walkthrough

A guided tour of the repository for reviewers, interviewers, and new team members. This document provides a curated path to understand the platform's architecture and implementation.

## Quick Tour (10 minutes)

If you only have 10 minutes, follow this path:

1. **`apps/backend-api/src/index.ts`** → See the Express app structure
2. **`apps/backend-api/openapi.yaml`** → Review API specification
3. **`docs/security/index.md`** → Explore security documentation suite
4. **`infra/helm/web-platform/`** → Examine Kubernetes deployment configuration
5. **`infra/ansible/roles/`** → Review deployment automation
6. **`scripts/post-deploy/run-post-deploy-checks.sh`** → See post-deploy validation
7. **`.github/workflows/deploy-staging.yml`** → Understand CI/CD pipeline

## Detailed Tour (30 minutes)

### 1. Application Layer (15 minutes)

#### Backend API (`apps/backend-api/`)

**Start here:** `src/index.ts`
- Express app setup
- Middleware chain (requestId, requestLogger, errorHandler)
- Route registration

**Key files:**
- `src/controllers/exampleController.ts` - Controller pattern
- `src/middleware/errorHandler.ts` - Centralized error handling
- `src/middleware/requestLogger.ts` - Structured logging
- `src/config/env.ts` - Environment validation
- `openapi.yaml` - API specification

**Tests:**
- `tests/unit/` - Unit tests for controllers and services
- `tests/integration/` - Integration tests for routes

**Dockerfile:**
- Multi-stage build
- Non-root user
- Production optimizations

#### Frontend React (`apps/frontend-react/`)

**Start here:** `src/App.tsx`
- Component structure
- State management example

**Key files:**
- `src/main.tsx` - Entry point
- `vite.config.mts` - Build configuration
- `Dockerfile` - Production image

**Tests:**
- `tests/unit/App.test.tsx` - Component tests

#### Frontend Vue (`apps/frontend-vue/`)

**Start here:** `src/App.vue`
- Vue 3 Composition API
- TypeScript integration

**Key files:**
- `vite.config.mts` - Build configuration
- `Dockerfile` - Production image

**Tests:**
- `tests/unit/App.test.ts` - Component tests

### 2. Infrastructure Layer (10 minutes)

#### Kubernetes (`infra/k8s/`)

**Key files:**
- `deployment.yaml` - Pod specifications
- `service.yaml` - Service definitions
- `ingress.yaml` - Routing configuration
- `network-policy.yaml` - Network security

#### Helm Charts (`infra/helm/web-platform/`)

**Start here:** `values.yaml`
- Default configuration
- Environment-specific overrides (`values-staging.yaml`, `values-prod.yaml`)

**Key files:**
- `templates/` - Kubernetes manifest templates
- `Chart.yaml` - Chart metadata
- `values-*.yaml` - Environment configurations

#### Terraform (`infra/terraform/`)

**Start here:** `modules/static_site/main.tf`
- S3 bucket configuration
- CloudFront distribution
- Route53 DNS

**Structure:**
- `modules/` - Reusable modules
- `envs/staging/` - Staging environment
- `envs/prod/` - Production environment

#### Ansible (`infra/ansible/`)

**Start here:** `site.yml`
- Main playbook
- Role-based organization

**Key roles:**
- `common/` - Base setup (Python, Git)
- `docker_compose/` - Docker installation
- `bare_metal/` - Node.js + Nginx setup
- `post_deploy_validation/` - Post-deploy checks

### 3. CI/CD & Automation (5 minutes)

#### GitHub Actions (`.github/workflows/`)

**Key workflows:**
- `ci.yml` - Continuous integration (lint, test, build)
- `deploy-staging.yml` - Staging deployment
- `deploy-prod.yml` - Production deployment
- `deploy-test-with-validation.yml` - Test environment with validation

**Pattern:**
1. Checkout code
2. Install dependencies
3. Build applications
4. Build Docker images
5. Push to ECR
6. Deploy via Helm
7. Run post-deploy validation
8. Upload reports

#### Scripts (`scripts/`)

**Key scripts:**
- `post-deploy/run-post-deploy-checks.sh` - Post-deploy validation
- `security/scan-deps.sh` - Dependency scanning
- `security/check-secrets.sh` - Secret detection
- `verify-config.sh` - Configuration validation
- `build-all.sh`, `test-all.sh`, `lint-all.sh` - Monorepo automation

### 4. Documentation (5 minutes)

#### Architecture (`docs/`)

**Key documents:**
- `architecture.md` - System architecture overview
- `data-flow.md` - Request flow diagrams
- `golden-path.md` - Feature development workflow
- `project-index.md` - Directory structure guide

#### Security (`docs/security/`)

**Key documents:**
- `index.md` - Security documentation index
- `threat-model.md` - Threat analysis
- `asvs-security-checklist.md` - OWASP ASVS alignment
- `soc2-starter-controls.md` - SOC2 compliance

#### Observability (`docs/observability/`)

**Key documents:**
- `logging-standards.md` - Logging conventions
- `metrics-and-slos.md` - SLO definitions
- `chaos-experiments.md` - Failure scenario testing
- `tracing-instrumentation.md` - Distributed tracing

#### Operations (`docs/runbooks/`)

**Key documents:**
- `deploy.md` - Deployment procedures
- `rollback.md` - Rollback procedures
- `incident-site-down.md` - Incident response

## Deep Dive Areas

### Security Engineering

1. **Threat Model** (`THREAT_MODEL.md`)
   - Threat analysis
   - Risk assessment
   - Mitigation strategies

2. **Security Controls** (`docs/security/security-controls-owners.md`)
   - Control ownership
   - Implementation status
   - Compliance mapping

3. **Security Scanning** (`scripts/security/`)
   - Dependency scanning
   - Container scanning
   - Secret detection
   - SBOM generation

### Observability

1. **Logging** (`docs/observability/logging-standards.md`)
   - Structured logging format
   - Required fields
   - Implementation in code

2. **Metrics & SLOs** (`docs/observability/metrics-and-slos.md`)
   - SLO definitions
   - Error budgets
   - Alert thresholds

3. **Prometheus Rules** (`infra/observability/prometheus-slos.yaml`)
   - SLO calculations
   - Alert definitions
   - Error budget tracking

### Deployment Automation

1. **Ansible** (`infra/ansible/`)
   - Playbook structure
   - Role organization
   - Idempotent operations

2. **Post-Deploy Validation** (`scripts/post-deploy/`)
   - Health checks
   - Contract tests
   - Security scans
   - Report generation

## Code Patterns to Notice

### Backend Patterns

- **Error Handling:** `HttpError` class with centralized handler
- **Logging:** Structured JSON logs with request IDs
- **Validation:** Middleware-based input validation
- **Environment:** Fail-fast environment validation

### Frontend Patterns

- **TypeScript:** Full type safety
- **Testing:** Component tests with testing-library
- **Build:** Vite for fast builds
- **Docker:** Multi-stage builds with non-root users

### Infrastructure Patterns

- **IaC:** Terraform modules for reusability
- **Helm:** Environment-specific values
- **Ansible:** Role-based organization
- **Kubernetes:** Network policies for security

## Questions to Explore

1. **How does request tracing work?**
   - See `src/middleware/requestId.ts` and `requestLogger.ts`

2. **How are errors handled?**
   - See `src/middleware/errorHandler.ts` and `HttpError` class

3. **How is configuration validated?**
   - See `src/config/env.ts` and `scripts/verify-config.sh`

4. **How are deployments automated?**
   - See `infra/ansible/` and `.github/workflows/`

5. **How is security enforced?**
   - See `docs/security/` and `scripts/security/`

6. **How is observability implemented?**
   - See `docs/observability/` and `infra/observability/`

## Next Steps

After this tour, explore:

1. **Run the applications locally:**
   ```bash
   make dev-backend
   make dev-react
   ```

2. **Run tests:**
   ```bash
   make test
   ```

3. **Deploy locally:**
   ```bash
   make deploy-local-docker
   ```

4. **Review security docs:**
   ```bash
   cat docs/security/index.md
   ```

5. **Check post-deploy validation:**
   ```bash
   make post-deploy-checks
   ```

---

**This walkthrough provides a structured path through the repository. For deeper exploration, refer to the specific documentation files mentioned in each section.**

