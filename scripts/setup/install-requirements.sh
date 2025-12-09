#!/usr/bin/env bash
# install-requirements.sh
# Installs all requirements for the template repository

set -e

echo "=== Template Repository Requirements Installation ==="
echo ""

# Check if running as root
if [ "$EUID" -eq 0 ]; then
  echo "Error: Do not run this script as root."
  echo "It will use sudo when needed for system packages."
  exit 1
fi

# Detect OS
if [ -f /etc/os-release ]; then
  . /etc/os-release
  OS=$ID
else
  echo "Warning: Cannot detect OS. Assuming Ubuntu/Debian."
  OS="ubuntu"
fi

echo "Detected OS: $OS"
echo ""

# Function to check if command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# 1. Check Node.js
echo "=== Checking Node.js ==="
if command_exists node; then
  NODE_VERSION=$(node -v)
  echo "Node.js found: $NODE_VERSION"
  if [ -f .nvmrc ]; then
    REQUIRED_VERSION=$(cat .nvmrc)
    echo "Required version (from .nvmrc): v$REQUIRED_VERSION"
  fi
else
  echo "Node.js not found. Please install Node.js:"
  echo "  - Using nvm: nvm install"
  echo "  - Or download from: https://nodejs.org/"
  exit 1
fi
echo ""

# 2. Check Docker
echo "=== Checking Docker ==="
if command_exists docker; then
  DOCKER_VERSION=$(docker --version)
  echo "Docker found: $DOCKER_VERSION"
else
  echo "Docker not found."
  read -p "Install Docker? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    if [ -f scripts/setup/install_docker.sh ]; then
      chmod +x scripts/setup/install_docker.sh
      sudo ./scripts/setup/install_docker.sh
    else
      echo "Docker install script not found. Please install Docker manually."
      echo "See: https://docs.docker.com/get-docker/"
    fi
  else
    echo "Skipping Docker installation."
  fi
fi
echo ""

# 3. Check Python
echo "=== Checking Python ==="
if command_exists python3; then
  PYTHON_VERSION=$(python3 --version)
  echo "Python found: $PYTHON_VERSION"
else
  echo "Python 3 not found. Installing..."
  if [ "$OS" = "ubuntu" ] || [ "$OS" = "debian" ]; then
    sudo apt update
    sudo apt install -y python3 python3-pip python3-venv
  else
    echo "Please install Python 3 manually."
    exit 1
  fi
fi
echo ""

# 4. Setup Python virtual environment
echo "=== Setting up Python virtual environment ==="
if [ ! -d "venv" ]; then
  echo "Creating Python virtual environment..."
  if [ -f scripts/setup/install_python_venv.sh ]; then
    chmod +x scripts/setup/install_python_venv.sh
    ./scripts/setup/install_python_venv.sh
  else
    python3 -m venv venv
  fi
  echo "Virtual environment created."
else
  echo "Virtual environment already exists."
fi

echo "Activating virtual environment..."
source venv/bin/activate || {
  echo "Failed to activate virtual environment."
  exit 1
}
echo ""

# 5. Install Python requirements
echo "=== Installing Python requirements ==="
if [ -f requirements/python-requirements.txt ]; then
  pip install --upgrade pip
  pip install -r requirements/python-requirements.txt
  echo "Python requirements installed."
else
  echo "python-requirements.txt not found. Skipping."
fi
echo ""

# 6. Check Ansible
echo "=== Checking Ansible ==="
if command_exists ansible; then
  ANSIBLE_VERSION=$(ansible --version | head -n 1)
  echo "Ansible found: $ANSIBLE_VERSION"
else
  echo "Ansible not found. Installing from requirements..."
  pip install ansible
  echo "Ansible installed."
fi
echo ""

# 7. Install Node.js dependencies
echo "=== Installing Node.js dependencies ==="
if command_exists npm; then
  echo "Installing root dependencies..."
  npm install
  echo "Installing app dependencies..."
  npm run install:apps || echo "Warning: install:apps script may not exist yet."
else
  echo "npm not found. Please install Node.js first."
  exit 1
fi
echo ""

# 8. Optional tools
echo "=== Optional Tools ==="
echo "The following tools are optional but recommended:"
echo ""

if ! command_exists terraform; then
  echo "  - Terraform: https://developer.hashicorp.com/terraform/downloads"
fi

if ! command_exists kubectl; then
  echo "  - kubectl: https://kubernetes.io/docs/tasks/tools/"
fi

if ! command_exists helm; then
  echo "  - Helm: https://helm.sh/docs/intro/install/"
fi

echo ""
echo "=== Installation Complete ==="
echo ""
echo "Next steps:"
echo "  1. Activate Python venv: source venv/bin/activate"
echo "  2. Run tests: make test"
echo "  3. Run linting: make lint"
echo "  4. Read docs/development-setup.md for more details"
echo ""

