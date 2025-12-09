#!/usr/bin/env bash
set -euo pipefail

echo "==> Linting backend-api"
npm --prefix apps/backend-api run lint

echo "==> Linting frontend-react"
npm --prefix apps/frontend-react run lint

echo "==> Linting frontend-vue"
npm --prefix apps/frontend-vue run lint

# static-landing currently only has a placeholder lint
echo "==> Linting static-landing (if configured)"
npm --prefix apps/static-landing run lint || echo "static-landing lint skipped/placeholder"

echo "==> Linting done"
