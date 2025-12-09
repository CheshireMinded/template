#!/usr/bin/env bash
# install_docker.sh
# Installs Docker Engine, Buildx, and Compose plugin on Ubuntu

set -e

echo "=== Updating system packages ==="
sudo apt update -y

echo "=== Installing prerequisites ==="
sudo apt install -y ca-certificates curl gnupg lsb-release

echo "=== Adding Docker's official GPG key ==="
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
  sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo "=== Adding Docker repository ==="
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

echo "=== Installing Docker Engine and Compose ==="
sudo apt update -y
sudo apt install -y docker-ce docker-ce-cli containerd.io \
                    docker-buildx-plugin docker-compose-plugin

echo "=== Enabling Docker service ==="
sudo systemctl enable docker
sudo systemctl start docker

echo "=== Adding current user to docker group ==="
sudo usermod -aG docker "$USER"

echo "=== Installation complete! ==="
echo
echo "Next steps:"
echo "  1. Log out and back in (or run: newgrp docker)"
echo "  2. Test your install with:"
echo "       docker run hello-world"
echo
echo "Docker version:"
docker --version
echo
echo "Docker Compose version:"
docker compose version

