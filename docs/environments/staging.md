# Staging Environment

## Overview

Staging is a pre-production environment used to validate changes before they are promoted to production. It mirrors production as closely as practical.

## AWS / DNS

- **Root domain:** `example.com` (replace as needed)
- **Subdomains (staging):**
  - `staging.app.example.com` → React app
  - `staging.api.example.com` → Backend API
  - `staging.landing.example.com` (or similar) → Static landing (CloudFront)

- **Route53 Hosted Zone:** same as production root domain
- **ACM Certificate (via Terraform):**
  - SANs include:
    - `example.com`
    - `app.example.com`
    - `api.example.com`
    - `staging.*` subdomains as configured

## Kubernetes

- **Cluster:** shared or dedicated staging cluster (implementation-specific)
- **Namespace:** `web-platform-staging`
- **Ingress class:** `nginx` (config in `infra/helm/web-platform/values-staging.yaml`)

### Workloads

- `frontend-react` Deployment
- `frontend-vue` (if deployed to staging)
- `backend-api` Deployment
- Related Services, HPAs, PDBs, and NetworkPolicies

## CI/CD

- **Branch:** `develop`
- **Workflow:** `.github/workflows/deploy-staging.yml`
- **Image tags:** `staging-<GITHUB_SHA>`

Deploy flow:

1. Merge PR → `develop`.
2. CI builds & tests.
3. Docker images built and pushed to ECR.
4. Helm release:
   - Chart: `infra/helm/web-platform`
   - Values: `values-staging.yaml`
   - Namespace: `web-platform-staging`

## Usage

- Use staging for:
  - UAT / exploratory testing
  - Regression tests
  - Pre-release validation

No external customers should rely on staging for production use.

