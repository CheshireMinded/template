# Web Platform Monorepo - Full-Stack, Cloud-Native, Secure-by-Design

A production-grade, end-to-end web platform built using modern DevOps, security engineering, and cloud infrastructure best practices. Designed to demonstrate expertise across frontend, backend, CI/CD, Kubernetes, and AWS IaC.

<!-- Coverage badges (uncomment after setting up Codecov):
![CI](https://github.com/CheshireMinded/<YOUR_REPO_NAME>/actions/workflows/ci.yml/badge.svg)
[![codecov](https://codecov.io/gh/CheshireMinded/<YOUR_REPO_NAME>/branch/main/graph/badge.svg)](https://codecov.io/gh/CheshireMinded/<YOUR_REPO_NAME>)
-->

## Architecture Overview

This monorepo contains:

| Layer | Technology | Description |
|-------|------------|-------------|
| Static Site | HTML, Nginx, S3, CloudFront | Fast, cached landing page with full CDN + TLS + Route53 managed domain |
| Frontend Apps | React + Vite, Vue 3 | Modern SPAs deployed via container images |
| Backend API | Node.js/Express | Robust REST API with structured logging, centralized error handler, rate limiting, and environment schema validation |
| Infrastructure | Terraform | AWS IaC for S3, CloudFront, ACM, Route53, ECR, plus modular structure and environment separation |
| Orchestration | Helm + Kubernetes | Staging & production workloads deployed via image tag injection (GITHUB_SHA or version tags) |
| CI/CD | GitHub Actions | Multi-stage pipelines for lint, test, build, security scanning, staging deploy, production release |
| Security | SAST, dependency scanning, strict security headers, OPA-friendly policies | Security-first architecture aligned to OWASP & CIS recommendations |

## Security-First Foundation

This project systematically integrates security at every layer:

### Application Security

- Centralized Express error handler (HttpError pattern)
- Input validation and sanitization
- Strict JSON-only responses
- Rate limiting
- Helmet security headers
- Read-only file systems for containers
- Non-root containers enforced in Kubernetes

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

## Key Outcomes (What This Project Demonstrates)

### DevOps / SRE Skills

- Complex multi-environment CI/CD pipelines
- Docker → ECR → Helm → Kubernetes deployment flow
- Automated image tagging and promotion strategies
- Service rollout & rollback safety patterns

### Security Engineering

- Zero-trust posture for services
- TLS everywhere (ACM → CloudFront → Ingress)
- Network & runtime hardening in Kubernetes
- Automated vulnerability scanning in CI

### Full-Stack Engineering

- Multi-framework support (React + Vue)
- Fully typed Node.js backend with robust architecture
- Shared configs & conventions across projects

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
- [Infrastructure Guide](infra/README.md) - Terraform, Helm, and deployment details
- [Security Policies](SECURITY.md)
- [Threat Model](THREAT_MODEL.md)
- [Runbooks](docs/runbooks/) - Operational procedures

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
│   └── terraform/          # AWS IaC
├── docs/                   # Architecture, runbooks, ADRs
├── scripts/                # Automation scripts
└── .github/workflows/      # CI/CD pipelines
```

## License

MIT License - see [LICENSE](LICENSE) file for details.
