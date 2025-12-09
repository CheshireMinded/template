#!/usr/bin/env bash
set -euo pipefail

echo "==> Building static-landing"
npm --prefix apps/static-landing run build

echo "==> Building frontend-react"
npm --prefix apps/frontend-react run build

echo "==> Building frontend-vue"
npm --prefix apps/frontend-vue run build

echo "==> Building backend-api"
npm --prefix apps/backend-api run build

echo "==> Build complete"
