# Requirements

This directory contains dependency requirements and installation instructions for the template repository.

---

## Quick Start

### 1. Install System Requirements

See [system-requirements.md](system-requirements.md) for detailed instructions.

**Minimum required:**
- Node.js (see `.nvmrc`)
- Docker
- Git

**For full functionality:**
- Python 3.9+
- Ansible
- Terraform (for infrastructure)
- kubectl & Helm (for Kubernetes)

### 2. Install Python Dependencies

If you plan to use Ansible, security tools, or pre-commit hooks:

```bash
# Create a virtual environment (recommended)
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python requirements
pip install -r requirements/python-requirements.txt
```

### 3. Install Node.js Dependencies

From the repository root:

```bash
# Install root dependencies
npm install

# Install all app dependencies
npm run install:apps
# Or use Makefile:
make install
```

---

## Files in This Directory

- **python-requirements.txt** - Python packages (Ansible, security tools, etc.)
- **system-requirements.md** - System-level dependencies and installation guides

---

## Installation Methods

### Automated Setup (Recommended)

Use the provided setup scripts:

```bash
# Install Docker
chmod +x scripts/setup/install_docker.sh
sudo ./scripts/setup/install_docker.sh

# Create Python virtual environment
chmod +x scripts/setup/install_python_venv.sh
./scripts/setup/install_python_venv.sh
source venv/bin/activate
pip install -r requirements/python-requirements.txt
```

### Manual Installation

Follow the guides in `system-requirements.md` for manual installation of each tool.

---

## Verification

After installation, verify your setup:

```bash
# Check Node.js
node -v
npm -v

# Check Docker
docker --version
docker compose version

# Check Python (if using)
python3 --version
pip --version

# Check Ansible (if installed)
ansible --version

# Check Terraform (if installed)
terraform version

# Check kubectl (if installed)
kubectl version --client

# Check Helm (if installed)
helm version
```

---

## Troubleshooting

### Node.js Version Mismatch

If you see errors about Node.js version:

```bash
# Use nvm to switch to the correct version
nvm use
node -v  # Should match .nvmrc
```

### Docker Permission Issues

```bash
# Add your user to the docker group
sudo usermod -aG docker $USER
# Log out and back in, or:
newgrp docker
```

### Python Virtual Environment

If Python tools aren't found:

```bash
# Ensure venv is activated
source venv/bin/activate  # Linux/macOS
# or
venv\Scripts\activate  # Windows

# Reinstall requirements
pip install -r requirements/python-requirements.txt
```

---

## Next Steps

After installing requirements:

1. Read `docs/development-setup.md` for complete setup instructions
2. Run `make install` to install all Node.js dependencies
3. Run `make lint` and `make test` to verify everything works
4. See `docs/deploy-ansible.md` if you want to use Ansible deployment

---

## Additional Resources

- **Development Setup:** `docs/development-setup.md`
- **Ansible Deployment:** `docs/deploy-ansible.md`
- **Project Index:** `docs/project-index.md`

