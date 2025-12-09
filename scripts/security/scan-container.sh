#!/usr/bin/env bash
set -e

IMAGE_NAME=${1:-"template-backend:latest"}

echo "Scanning container image: $IMAGE_NAME"

if ! command -v trivy &> /dev/null; then
  echo "Trivy not installed. Install from https://aquasecurity.github.io/trivy/"
  exit 1
fi

trivy image --severity HIGH,CRITICAL "$IMAGE_NAME"

echo "Container security scan complete."

