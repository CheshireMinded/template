# Deploying with Ansible

This template includes example Ansible playbooks for deploying the platform in multiple ways:

- Locally on your own machine or VM
- To a remote server
- Using Docker Compose, bare metal (Node + Nginx), or static-only
- Optionally to Kubernetes via Helm

> **Note:**  
> These playbooks are intended as **examples and starting points**, not production-hardened deployment automation.

---

## 1. Prerequisites

**On your control machine (where you run Ansible):**

- Python 3.9+
- Ansible (`pip install ansible` or OS package)
- SSH access to target host(s), unless using local mode

**On target machines:**

- Python 3 (installed automatically by the `common` role)
- Git (installed automatically by the `common` role)
- Other dependencies are installed by the playbooks based on deployment mode

---

## 2. Layout

```text
infra/ansible/
  inventory.ini           # Example remote inventory
  inventory.local.ini     # Localhost inventory
  site.yml                # Main playbook (remote or generic)
  site.local.yml          # Local-focused playbook
  group_vars/
    all.yml               # Global defaults and deployment choices
  roles/
    common/
      tasks/main.yml
    docker_compose/
      tasks/main.yml
    k8s_helm/
      tasks/main.yml
    bare_metal/
      tasks/main.yml
      templates/nginx-static.conf.j2
    static_only/
      tasks/main.yml
      templates/nginx-static.conf.j2
```

---

## 3. Deployment Modes

Set via the `deployment_mode` variable:

- `docker_compose` - use `infra/docker/docker-compose.prod.yml`
- `bare_metal` - install Node + Nginx + pm2 and run apps directly
- `static_only` - build and serve only the static landing page
- `k8s_helm` - use Helm chart in `infra/helm/web-platform` (remote use only, in main `site.yml`)

Defaults are in `infra/ansible/group_vars/all.yml`:

```yaml
deployment_mode: "docker_compose"   # docker_compose, k8s_helm, bare_metal, static_only
environment: "staging"              # dev, staging, prod
deploy_backend: true
deploy_frontend_react: true
deploy_frontend_vue: false
deploy_static_landing: true
```

You can override any of these on the command line:

```bash
ansible-playbook -i inventory.ini site.yml \
  -e "deployment_mode=k8s_helm environment=prod deploy_frontend_vue=true"
```

---

## 4. Local Deployment (Your VM or Laptop)

### 4.1 Local inventory

`infra/ansible/inventory.local.ini`:

```ini
[web]
localhost ansible_connection=local

[all:vars]
ansible_python_interpreter=/usr/bin/python3
```

### 4.2 Local playbook

`infra/ansible/site.local.yml` focuses on non-K8s modes:

- `docker_compose`
- `bare_metal`
- `static_only`

Run it:

```bash
cd infra/ansible
ansible-playbook -i inventory.local.ini site.local.yml
```

You'll be prompted for:

- Deployment mode
- Environment

Or override explicitly:

```bash
ansible-playbook -i inventory.local.ini site.local.yml \
  -e "deployment_mode=bare_metal environment=dev"
```

---

## 5. Makefile Shortcuts

Common local deployment flows are wired into the Makefile:

```bash
# Bare metal: Node + pm2 + Nginx + static builds
make deploy-local-bare-metal

# Docker Compose: use infra/docker/docker-compose.prod.yml
make deploy-local-docker

# Static-only: build and serve apps/static-landing via Nginx
make deploy-local-static
```

These all target localhost using:

- `infra/ansible/inventory.local.ini`
- `infra/ansible/site.local.yml`

---

## 6. Remote Deployment (Server / VPS)

For remote targets, edit `infra/ansible/inventory.ini`:

```ini
[web]
your-server-1 ansible_host=1.2.3.4

[all:vars]
ansible_user=ubuntu
ansible_python_interpreter=/usr/bin/python3
```

Then run:

```bash
cd infra/ansible

# Example: Docker Compose deployment to remote server
ansible-playbook -i inventory.ini site.yml \
  -e "deployment_mode=docker_compose environment=staging"

# Example: K8s + Helm deployment (requires K8s + Helm on target)
ansible-playbook -i inventory.ini site.yml \
  -e "deployment_mode=k8s_helm environment=prod"
```

---

## 7. Static-Only Site Deployment

If you only want a static site (no backend):

The `static_only` role:

- Installs Node + Nginx
- Builds `apps/static-landing`
- Copies the built files to the configured `static_site_root`
- Configures an Nginx server to serve it

**Local:**

```bash
make deploy-local-static
```

**Remote:**

```bash
ansible-playbook -i inventory.ini site.yml \
  -e "deployment_mode=static_only environment=prod"
```

---

## 8. What Gets Installed Per Deployment Mode

The playbooks are designed to install **only what's needed** for each deployment mode:

### docker_compose mode
- **Installed:** Docker Engine, Docker Compose plugin (official Docker repository)
- **Not installed:** Node.js, npm, Nginx, kubectl, Helm
- **Python:** Python 3 + pip (required for Ansible modules)

### k8s_helm mode
- **Installed:** kubectl, Helm
- **Not installed:** Docker, Node.js, npm, Nginx
- **Python:** Python 3 + pip (required for Ansible modules)

### bare_metal mode
- **Installed:** Node.js, npm, Nginx, pm2
- **Not installed:** Docker, kubectl, Helm
- **Python:** Python 3 + pip (required for Ansible modules)
- **Optional:** Python venv + requirements (if `setup_python_venv=true`)

### static_only mode
- **Installed:** Node.js, npm, Nginx
- **Not installed:** Docker, kubectl, Helm, pm2
- **Python:** Python 3 + pip (required for Ansible modules)
- **Optional:** Python venv + requirements (if `setup_python_venv=true`)

**Note:** Python 3 and pip are always installed because Ansible modules require Python on the target machine. However, `python3-venv` is only installed if you enable venv setup.

## 9. Python Virtual Environment (Optional)

By default, the playbooks install Python 3 and pip on target machines but don't create a virtual environment. If you want to install Python packages (like security tools) on the target machine, you can enable venv setup:

```bash
ansible-playbook -i inventory.ini site.yml \
  -e "deployment_mode=bare_metal setup_python_venv=true install_python_requirements=true"
```

This will:
- Create a Python venv at `{{ app_root }}/venv`
- Install packages from `requirements/python-requirements.txt` into that venv

**Note:** Ansible itself must be installed on your control machine (where you run the playbook), not on the target. The venv on the target is only for Python tools that need to run on the target machine.

## 10. Docker Setup Details

The `docker_compose` role installs Docker using the **official Docker repository** (not the Ubuntu package), which provides:

- Latest stable Docker Engine
- Docker Compose plugin (modern version)
- Docker Buildx plugin
- Proper GPG key verification
- Automatic user addition to docker group

This ensures you get the official, up-to-date Docker installation rather than the older `docker.io` package.

## 11. Idempotence & Safety

The playbooks are designed to be idempotent (safe to run multiple times):

- Uses `state: present` for packages (won't reinstall if already present)
- Uses `creates:` checks where appropriate
- Git clone updates existing repos rather than failing

### Running in Check Mode

You can test changes without applying them:

```bash
ansible-playbook -i inventory.ini site.yml --check --diff
```

This shows what would change without making actual modifications.

### Using Tags

Run specific parts of the playbook:

```bash
# Only install Docker
ansible-playbook -i inventory.ini site.yml --tags docker

# Only deploy (skip installation)
ansible-playbook -i inventory.ini site.yml --tags deploy

# Skip common setup
ansible-playbook -i inventory.ini site.yml --skip-tags common
```

## 12. Secrets Management

For production use, **do not** store secrets in plain text. Options:

### Ansible Vault

Encrypt sensitive variables:

```bash
# Create encrypted variable file
ansible-vault create group_vars/production/secrets.yml

# Edit encrypted file
ansible-vault edit group_vars/production/secrets.yml

# Use in playbook
ansible-playbook -i inventory.ini site.yml --ask-vault-pass
```

### External Secret Managers

Integrate with:

- AWS Secrets Manager (via `community.aws.secretsmanager_secret` lookup)
- HashiCorp Vault (via `hashi_vault` lookup)
- Azure Key Vault
- Google Secret Manager

Example with AWS Secrets Manager:

```yaml
# In group_vars/production/secrets.yml (encrypted or external)
api_key: "{{ lookup('aws_secret', 'prod/api-key', region='us-east-1') }}"
```

## 13. Post-Deploy Validation

After a successful Ansible deployment, you can run automated post-deploy checks to validate that everything is working correctly and securely.

### 13.1 Running Post-Deploy Checks Manually

You can run post-deploy validation checks using the Makefile:

```bash
# For staging environment
make post-deploy-checks

# For production environment
make post-deploy-checks-prod
```

Or run the script directly:

```bash
ENVIRONMENT=staging BASE_URL=http://your-server:80 \
  scripts/post-deploy/run-post-deploy-checks.sh
```

### 13.2 Enabling Post-Deploy Validation in Ansible

To automatically run post-deploy checks after deployment completes, enable the validation role:

```bash
ansible-playbook -i inventory.ini site.yml \
  -e "deployment_mode=docker_compose environment=staging run_post_deploy_validation=true"
```

You can also specify a custom base URL:

```bash
ansible-playbook -i inventory.ini site.yml \
  -e "deployment_mode=docker_compose environment=staging run_post_deploy_validation=true post_deploy_base_url=https://staging.example.com"
```

### 13.3 What Gets Validated

The post-deploy validation script runs the following checks:

1. **HTTP Health Check** - Verifies the `/healthz` endpoint returns 2xx
2. **Contract / API Tests** - Runs Dredd contract tests against the live API (if available)
3. **E2E / UI Smoke Tests** - Runs Playwright tests against the live frontend (if available)
4. **Load Smoke Tests** - Runs k6 load tests to verify basic performance (if available)
5. **Security Checks**:
   - Dependency vulnerability scan (`scan-deps.sh`)
   - Secrets scan (`check-secrets.sh`)
   - Container scan (`scan-container.sh`)
   - SBOM generation (`generate-sbom.sh`)

### 13.4 Reports

All validation results are written to a Markdown report in `reports/post-deploy/`:

```
reports/post-deploy/post-deploy-<environment>-<timestamp>.md
```

The report includes:
- Environment and deployment information
- Results for each validation check (PASS/FAIL/SKIP)
- Full output from each test/check
- Timestamp for audit purposes

These reports can be:
- Reviewed manually after deployment
- Uploaded as CI/CD artifacts
- Stored for compliance and audit purposes

### 13.5 CI/CD Integration

In CI/CD pipelines, post-deploy checks should run after the deployment step completes. The reports can be uploaded as artifacts for review. See the CI workflow examples in `.github/workflows/` for integration patterns.

## 14. Notes & Customization

These playbooks are templates, not production-ready automation.

For real-world use:

- Add TLS (e.g., via certbot or a reverse proxy)
- Harden SSH, Nginx, and Node processes
- Wire secrets from a secret manager instead of `.env` files
- Integrate this with your existing CI/CD
- Add health checks and monitoring
- Implement backup and disaster recovery procedures

This Ansible layer is meant to showcase:

- Infrastructure-as-code practices
- Multiple deployment strategies (Docker, K8s, bare metal, static)
- Local and remote flows using the same repository
- Idempotent operations
- Safe deployment practices
- Post-deploy validation and reporting

