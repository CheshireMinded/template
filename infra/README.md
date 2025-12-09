# Infra Overview

This directory contains infrastructure definitions for the web platform:

- `ansible/` - Ansible playbooks for deployment automation (Docker, K8s, bare metal, static)
- `k8s/` - raw Kubernetes manifests (or Helm chart templates)
- `helm/` - Helm chart for deploying frontend + backend to Kubernetes
- `terraform/` - Infrastructure-as-Code for AWS (ECR, S3, CloudFront, DNS/TLS)
- `docker/` - Docker Compose configurations for local and production use

The overall flow is:

1. **Terraform** provisions AWS infrastructure:
   - ECR repositories for Docker images
   - S3 bucket + CloudFront distribution + Route53 records for static site
   - ACM certificate + DNS validation via Route53
2. **GitHub Actions** build & push Docker images to ECR on each deploy.
3. **Helm** deploys the latest images to the Kubernetes cluster.

---

## Structure

```text
infra/
  README.md

  ansible/              # Ansible deployment automation
    inventory.ini       # Remote server inventory
    inventory.local.ini # Localhost inventory
    site.yml            # Main playbook
    site.local.yml      # Local deployment playbook
    group_vars/
      all.yml           # Configuration defaults
    roles/
      common/           # Base setup (git, packages)
      docker_compose/   # Docker Compose deployment
      k8s_helm/         # Kubernetes Helm deployment
      bare_metal/       # Node + Nginx direct deployment
      static_only/      # Static site only deployment

  k8s/                  # (optional) raw manifests or legacy
    ...                 # you may still keep basic manifests here

  helm/
    web-platform/       # Helm chart for the platform
      Chart.yaml
      values.yaml
      values-staging.yaml
      values-prod.yaml
      templates/
        namespace.yaml
        frontend-deployment.yaml
        frontend-service.yaml
        backend-deployment.yaml
        backend-service.yaml
        ingress.yaml
        hpa-frontend.yaml
        hpa-backend.yaml
        pdb-frontend.yaml
        pdb-backend.yaml
        networkpolicy-backend.yaml

  docker/               # Docker Compose configurations
    docker-compose.dev.yml
    docker-compose.prod.yml

  terraform/
    envs/
      staging/
        main.tf
        variables.tf
        outputs.tf
        backend.tf
      prod/
        main.tf
        variables.tf
        outputs.tf
        backend.tf
    modules/
      static_site/      # S3 + CloudFront + Route53 alias
      web_app/          # ECR repos for frontend/backend images
      dns_tls/          # ACM certificate + Route53 validation
```

## Terraform Flow (AWS)

### 1. Prerequisites

- An S3 bucket for Terraform state.
- A Route53 hosted zone for your root domain (e.g. `example.com`).
- AWS credentials configured locally (`AWS_PROFILE` or env vars).

### 2. Apply Staging

```bash
cd infra/terraform/envs/staging

terraform init      # uses backend.tf to configure state
terraform plan
terraform apply
```

This will:

**Create:**
- ECR repositories (`web-platform-frontend`, `web-platform-backend`)
- S3 bucket for static site
- CloudFront distribution using the ACM certificate
- Route53 A record for `static_site_subdomain.domain_name`

**Request & validate an ACM certificate for:**
- `example.com`
- `app.example.com`
- `api.example.com`
- `static_site_subdomain.example.com`

After apply, check outputs:

```bash
terraform output
```

### 3. Apply Prod

```bash
cd infra/terraform/envs/prod

terraform init
terraform plan
terraform apply
```

Same idea, but for production URLs and tags.

## GitHub Actions Flow

GitHub Actions workflows (in `.github/workflows/`) orchestrate:

**CI** (`ci.yml`):
- Install dependencies
- Lint, test, and build all apps

**Security:**
- `security-sast.yml` - SAST (e.g. Semgrep)
- `dependency-review.yml` - dependency change scan on PRs

**Deploy - Staging** (`deploy-staging.yml`):
- Triggered on push to `develop`
- Builds frontend and backend Docker images
- Pushes images to ECR (`web-platform-frontend`, `web-platform-backend`)
- Calls Helm:

```bash
helm upgrade --install web-platform \
  infra/helm/web-platform \
  --namespace web-platform-staging \
  --create-namespace \
  -f infra/helm/web-platform/values-staging.yaml \
  --set image.frontend.tag="staging-${GITHUB_SHA}" \
  --set image.backend.tag="staging-${GITHUB_SHA}"
```

**Deploy - Prod** (`deploy-prod.yml`):
- Triggered on pushing tags `v*.*.*`
- Same flow, but uses a semantic version tag for image tags and production namespace/values.

## Helm Flow (Kubernetes)

The `web-platform` Helm chart manages:

- Frontend Deployment + Service
- Backend Deployment + Service
- Ingress (NGINX or another controller)
- Autoscaling (HPAs)
- PodDisruptionBudgets
- NetworkPolicy for backend

Key values in `infra/helm/web-platform/values.yaml`:

```yaml
image:
  frontend:
    repository: "<ACCOUNT>.dkr.ecr.<REGION>.amazonaws.com/web-platform-frontend"
    tag: "latest"
  backend:
    repository: "<ACCOUNT>.dkr.ecr.<REGION>.amazonaws.com/web-platform-backend"
    tag: "latest"

ingress:
  hosts:
    app: "app.example.com"
    api: "api.example.com"
  tls:
    enabled: true
    secretName: "web-platform-tls"
```

Staging and prod override hosts and tags via `values-staging.yaml` and `values-prod.yaml`, plus CI `--set` flags.

## Local vs Cloud

**Local dev:**
- Apps run via `npm run dev` or `make dev-*`
- Backend uses `.env` and runs on `http://localhost:3000`
- Frontends run on `http://localhost:5173`, etc.

**Cloud (staging/prod):**
- Docker images built & pushed to ECR by CI
- Helm releases deployed to your Kubernetes cluster
- Static assets deployed to S3/CloudFront (you can script uploads later)
- DNS/TLS fully managed via Terraform

## Next Steps

- Add a script or GitHub Action for uploading `static-landing` build artifacts to the S3 bucket from Terraform outputs.
- Connect monitoring/observability (logs, metrics, alerts) to K8s workloads and CloudFront.
- Keep `docs/` in sync with infra changes (especially runbooks, environments, and ADRs).

