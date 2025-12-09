#!/bin/bash
set -e

helm upgrade --install web-platform \
  ./infra/helm/web-platform \
  --namespace web-platform-local \
  --create-namespace \
  -f ./infra/helm/web-platform/values.yaml

echo "Deployed to local kind cluster."

