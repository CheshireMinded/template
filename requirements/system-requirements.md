# System Requirements

This document lists the system-level dependencies needed to work with this template repository.

---

## Required

### Node.js
- **Version:** See `.nvmrc` (currently Node.js 20)
- **Installation:**
  - Using nvm: `nvm install` (reads from `.nvmrc`)
  - Direct download: https://nodejs.org/
- **Used for:** All applications (backend, React, Vue, static landing)

### Docker
- **Version:** Docker Engine 20.10+ with Docker Compose plugin
- **Installation:**
  - Ubuntu/Debian: Use `scripts/setup/install_docker.sh`
  - macOS: Docker Desktop from https://www.docker.com/products/docker-desktop
  - Windows: Docker Desktop from https://www.docker.com/products/docker-desktop
- **Used for:** Container builds, docker-compose, Kubernetes workflows

### Git
- **Version:** 2.30+
- **Installation:** Usually pre-installed or via package manager
- **Used for:** Version control

---

## Optional (but recommended)

### Python 3
- **Version:** Python 3.9+
- **Installation:**
  - Ubuntu/Debian: `sudo apt install python3 python3-pip python3-venv`
  - macOS: `brew install python3`
  - Or use `scripts/setup/install_python_venv.sh` to create a venv
- **Used for:** Ansible, security tooling (Checkov, Semgrep), pre-commit hooks

### Ansible
- **Version:** Ansible 8.0+
- **Installation:**
  ```bash
  pip install ansible
  # Or via package manager:
  # Ubuntu: sudo apt install ansible
  # macOS: brew install ansible
  ```
- **Used for:** Deployment automation (see `infra/ansible/`)

### Terraform
- **Version:** Terraform 1.5+
- **Installation:**
  - Ubuntu/Debian: See https://developer.hashicorp.com/terraform/downloads
  - macOS: `brew install terraform`
- **Used for:** AWS infrastructure provisioning

### kubectl
- **Version:** Latest stable
- **Installation:**
  - Ubuntu/Debian: `sudo apt install kubectl`
  - macOS: `brew install kubectl`
  - Or: https://kubernetes.io/docs/tasks/tools/
- **Used for:** Kubernetes cluster interaction

### Helm
- **Version:** Helm 3.12+
- **Installation:**
  - Ubuntu/Debian: `curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash`
  - macOS: `brew install helm`
- **Used for:** Kubernetes package management

### Make
- **Version:** GNU Make 4.0+
- **Installation:**
  - Usually pre-installed on Linux/macOS
  - Windows: Use WSL or install via Chocolatey
- **Used for:** Running repository Makefile targets

---

## Development Tools (Optional)

### VS Code
- Recommended IDE with extensions:
  - ESLint
  - Prettier
  - Docker
  - Kubernetes
  - Terraform

### k6
- **Version:** k6 0.48+
- **Installation:** https://k6.io/docs/getting-started/installation/
- **Used for:** Load testing (see `tests/load/`)

### Playwright
- **Version:** Latest
- **Installation:** `npx playwright install` (after npm install)
- **Used for:** End-to-end testing (see `tests/e2e/`)

---

## Platform-Specific Notes

### Ubuntu / Debian / WSL
- Most tools can be installed via `apt`
- Use provided setup scripts in `scripts/setup/`

### macOS
- Use Homebrew for most installations
- Docker Desktop required for Docker

### Windows
- Use WSL2 for best compatibility
- Or use Docker Desktop for Windows

---

## Quick Setup Scripts

The repository includes setup scripts:

- `scripts/setup/install_docker.sh` - Install Docker Engine and Compose
- `scripts/setup/install_python_venv.sh` - Create Python virtual environment

See `docs/development-setup.md` for detailed setup instructions.

