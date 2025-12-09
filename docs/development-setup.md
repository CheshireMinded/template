# Developer Setup Guide

This document explains how to set up a local development environment for this template repository, including:

- Node.js + npm
- Docker
- (Optional) Python virtual environment for tooling
- Terraform, kubectl, and Helm
- Local dev + test + build commands
- All helper scripts and what they do

> **Note:** This is a template repository intended for learning and as a starting point for your own projects. The setup demonstrates production-grade patterns but is not a supported production system.

---

## 1. Prerequisites Overview

You'll get the most seamless experience on:

- **OS:** Ubuntu / Debian / WSL  
- **Node:** LTS (configured via `.nvmrc`)  
- **Docker:** Engine + Buildx + Compose  
- **Python:** 3.x (for optional tools)  

**Quick Setup:** For automated installation of all requirements, see `requirements/README.md` or run:
```bash
chmod +x scripts/setup/install-requirements.sh
./scripts/setup/install-requirements.sh
```

Supported environments:

| Component     | Required | Notes                                             |
|--------------|----------|---------------------------------------------------|
| Node.js      | Yes      | Used for all apps (backend, React, Vue, static)   |
| Docker       | Yes      | Used for images, docker-compose, K8s workflows    |
| Python 3     | Optional | Used for security / infra tooling (future)   |
| Terraform    | Optional | Needed only for infra changes                |
| kubectl      | Optional | Needed only if you interact with K8s         |
| Helm         | Optional | Needed for local Helm releases / testing     |

---

## 2. Clone the Repository

```bash
git clone https://github.com/CheshireMinded/web-platform-monorepo.git web-platform-monorepo
cd web-platform-monorepo
```

## 3. Node.js + npm Setup

We pin Node using `.nvmrc`:

```bash
# If you use nvm:
nvm install   # installs the version specified in .nvmrc
nvm use       # switch to that version
```

Verify:

```bash
node -v
npm -v
```

Install root and app dependencies:

```bash
# From repo root
npm install
npm run install:apps
# or via Makefile
make install
```

This installs:

- Root dev dependencies (eslint, prettier, etc.)
- App dependencies under:
  - `apps/backend-api`
  - `apps/frontend-react`
  - `apps/frontend-vue`
  - `apps/static-landing`

## 4. Docker Setup (Required)

Docker is used for:

- Building images for the frontend + backend
- Running docker-compose environments under `infra/docker`
- Aligning with CI/CD builds that push to ECR

If you're on Ubuntu/WSL and want a one-command install, use the helper script:

```bash
chmod +x scripts/setup/install_docker.sh
sudo ./scripts/setup/install_docker.sh
```

This script:

- Installs Docker Engine
- Configures Docker's apt repo and GPG keys
- Installs Buildx and Compose plugins

Afterwards:

```bash
sudo usermod -aG docker "$USER"   # optional: run docker without sudo (log out/in after)
docker version
docker info
```

If you're on macOS or Windows:

- Install Docker Desktop from Docker's site
- You do not need this script; use the native installer

## 5. Python Virtual Environment (Optional but Recommended)

Python is optional, but helpful for:

- Terraform linting helpers
- Security tooling (e.g., Checkov, custom scripts)
- SBOM or log-processing utilities

Use the helper script to create a local `venv/`:

```bash
chmod +x scripts/setup/install_python_venv.sh
./scripts/setup/install_python_venv.sh
```

After running, activate the venv (as the script instructs):

```bash
source venv/bin/activate
# or on Windows PowerShell: venv\Scripts\Activate.ps1
```

Install any Python-based tools you use inside this venv.

## 6. Terraform, kubectl, and Helm (Infra Only)

If you plan to work on infrastructure (`infra/terraform`, `infra/helm`, `infra/k8s`), install:

### Terraform

```bash
# Example (Ubuntu); adjust for your environment
sudo apt-get update
sudo apt-get install -y gnupg software-properties-common curl

curl -fsSL https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] \
https://apt.releases.hashicorp.com $(lsb_release -cs) main" \
| sudo tee /etc/apt/sources.list.d/hashicorp.list

sudo apt-get update
sudo apt-get install terraform
terraform -version
```

### kubectl

```bash
curl -LO "https://dl.k8s.io/release/$(curl -L -s \
https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl
sudo mv kubectl /usr/local/bin/
kubectl version --client
```

### Helm

```bash
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
helm version
```

## 7. Running the Apps Locally

From the repo root:

### Backend API

```bash
cd apps/backend-api
cp .env.example .env   # if present
npm run dev
# API on http://localhost:3000
```

### React Frontend

```bash
cd apps/frontend-react
npm run dev
# Typically http://localhost:5173
```

### Vue Frontend

```bash
cd apps/frontend-vue
npm run dev
# Typically http://localhost:5173+N
```

### Static Landing

```bash
cd apps/static-landing
npm run dev
# Vite dev server for static pages
```

Or, using the Makefile (from repo root):

```bash
make dev-backend
make dev-react
make dev-vue
make dev-static
```

## 8. Using infra/docker (docker-compose)

The `infra/docker` directory includes:

- `docker-compose.dev.yml` - dev environment
- `docker-compose.prod.yml` - production-like stack
- `Dockerfile.backend`, `Dockerfile.frontend`, and `nginx.conf`

For local containerized dev (from repo root):

```bash
cd infra/docker
docker compose -f docker-compose.dev.yml up --build
```

This:

- Builds images for backend and frontend
- Starts services defined in the compose file

To stop:

```bash
docker compose -f docker-compose.dev.yml down
```

## 9. Lint, Test, and Build (All Apps)

From repo root, use either npm scripts or the Makefile.

### Lint everything

```bash
# Recommended
make lint

# Equivalent (uses scripts/lint-all.sh)
bash scripts/lint-all.sh
```

### Run tests

```bash
make test
# or
bash scripts/test-all.sh
```

### Build all apps

```bash
make build
# or
bash scripts/build-all.sh
```

Each of those scripts delegates to the individual app commands under:

- `apps/backend-api`
- `apps/frontend-react`
- `apps/frontend-vue`
- `apps/static-landing`

## 10. Pre-commit Hooks

You can enforce consistent quality checks before every commit using pre-commit.

Install:

```bash
pip install pre-commit  # or brew install pre-commit
pre-commit install
pre-commit install --hook-type commit-msg
```

This wires up `.pre-commit-config.yaml`, which runs:

- YAML/JSON checks
- Trailing whitespace and EOF fixers
- ESLint on application source
- Markdown linting
- Optional gitlint on commit messages

## 11. Script Reference

### `scripts/setup/install_docker.sh`

- Installs Docker Engine, Buildx, and Compose (Ubuntu/WSL)
- Adds Docker's official apt repository and GPG key
- Ideal for first-time dev setup in Linux-like environments

### `scripts/setup/install_python_venv.sh`

- Installs `python3-venv` (if missing)
- Creates a `venv/` folder in the repo
- Prints activation instructions
- Intended for Python-based tooling and infra helpers

### `scripts/lint-all.sh`

Runs linting across all registered apps:

- `apps/backend-api`
- `apps/frontend-react`
- `apps/frontend-vue`
- (Optionally) `apps/static-landing`

### `scripts/test-all.sh`

Runs tests:

- Backend API Jest tests
- Optional frontend tests if/when configured

### `scripts/build-all.sh`

Builds all apps:

- Static landing site
- React frontend
- Vue frontend
- Backend API (TypeScript build)

### `scripts/pre-commit-checks.sh`

Convenience wrapper:

- `lint-all.sh`
- `test-all.sh`

Ideal to run manually before committing:

```bash
bash scripts/pre-commit-checks.sh
```

## 12. Troubleshooting

### Node version mismatch

If you see errors like:

```
SyntaxError: Unexpected token '??' or old Node features missing
```

Run:

```bash
nvm use
node -v
```

Ensure the version matches `.nvmrc`.

### Docker permission issues

If you get:

```
permission denied while trying to connect to the Docker daemon socket
```

Run:

```bash
sudo usermod -aG docker "$USER"
# Log out and back in
```

Or prefix commands with `sudo` in the meantime.

### Dependency issues

Try:

```bash
rm -rf node_modules
npm install
npm run install:apps
```

