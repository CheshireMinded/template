# CI/CD Pipeline Overview

This document describes how code moves from a local change to running in staging and production.

## 1. Pipelines

We use GitHub Actions for:

- **Continuous Integration (CI)** - build, lint, test, static analysis
- **Continuous Delivery/Deployment (CD)** - staging and production deployments
- **Security Scans** - SAST, dependency checks, Terraform scanning, SBOMs

## 2. CI (`ci.yml`)

Runs on:

- Push to `main` or `develop`
- PRs targeting `main` or `develop`

Stages:

1. Checkout
2. Node setup
3. Install dependencies
4. `npm run lint` / `make lint`
5. `npm test` / `make test`
6. `npm run build` / `make build`

Fails fast on lint or test failures.

## 3. Deploy to Staging (`deploy-staging.yml`)

Trigger:

- Push to `develop`
- Manual `workflow_dispatch` (optional)

Steps:

1. Build apps
2. Configure AWS credentials
3. Build & push Docker images:
   - `web-platform-frontend:staging-<GITHUB_SHA>`
   - `web-platform-backend:staging-<GITHUB_SHA>`
4. Helm deploy:
   - Chart: `infra/helm/web-platform`
   - Namespace: `web-platform-staging`
   - Values: `values-staging.yaml`
   - Overrides: `image.frontend.tag` and `image.backend.tag`

## 4. Deploy to Production (`deploy-prod.yml`)

Trigger:

- Tag push: `v*.*.*`

Steps:

1. Build apps
2. Configure AWS
3. Build & push Docker images:
   - `:vX.Y.Z` and `:latest`
4. Helm deploy:
   - Chart: `infra/helm/web-platform`
   - Namespace: `web-platform`
   - Values: `values-prod.yaml`
   - Overrides: `image.*.tag=VERSION`

## 5. Security Workflows

- `sbom.yml` - generate CycloneDX SBOM
- `container-scan.yml` - Trivy FS scan
- `terraform-sec.yml` - tfsec + Checkov
- `node-audit.yml` - `npm audit` on schedule
- `codeql.yml` - CodeQL static analysis (optional)

These workflows provide defense-in-depth and supply chain insight.

## 6. Rollbacks

- Use `helm history web-platform` and `helm rollback web-platform <REVISION>` to roll back.
- Or update Helm values to previous Docker tag and redeploy.

See `docs/runbooks/rollback.md` for detailed steps.

