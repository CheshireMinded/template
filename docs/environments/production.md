# Production Environment

## Overview

Production is the live, customer-facing environment. All changes must be tested in staging before being promoted here.

## AWS / DNS

- **Root domain:** `example.com`
- **Primary subdomains:**
  - `app.example.com` → React app
  - `api.example.com` → Backend API
  - `www.example.com` or `landing.example.com` → Static landing page (CloudFront)
- **Route53 Hosted Zone:** `example.com`
- **ACM certificate:**
  - Subject: `example.com`
  - SANs: `app.example.com`, `api.example.com`, `www.example.com` (or chosen subdomain)

## Kubernetes

- **Namespace:** `web-platform`
- **Ingress class:** `nginx` (or whichever is deployed)

### Workloads

- `frontend-react` Deployment (primary app UI)
- `frontend-vue` (admin/internal app, if deployed)
- `backend-api` Deployment
- Service objects for each
- HPAs, PDBs, NetworkPolicies

## CI/CD

- **Branch:** `main`
- **Release mechanism:** semantic version tags (`vX.Y.Z`)
- **Workflow:** `.github/workflows/deploy-prod.yml`
- **Image tags:**
  - `web-platform-frontend:vX.Y.Z` + `:latest`
  - `web-platform-backend:vX.Y.Z` + `:latest`

Deploy flow:

1. Changes merged to `main`.
2. Tag created:
   ```bash
   git tag v1.2.3
   git push origin v1.2.3
   ```
3. CI:
   - Builds & tests
   - Builds Docker images
   - Pushes to ECR
   - Runs Helm upgrade on `web-platform` namespace

## Safety

Rollbacks via:

- `helm rollback` with previous revision
- Or previous version tag `vX.Y.(Z-1)`

Incident handling:

- See `docs/runbooks/incident-site-down.md`
- See `docs/security/incident-response-template.md`

## Monitoring & Observability

Integrate production environment with:

- Centralized logging
- Metrics dashboard (latency, error rates, resource usage)
- Alerts on SLO violations and key error conditions

Update this doc as observability tooling matures.

