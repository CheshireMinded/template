#!/usr/bin/env bash
set -euo pipefail

# Right now only backend has tests, but this script is future-proof.

echo "==> Running backend-api tests"
npm --prefix apps/backend-api test

# Placeholders for future frontend tests:
if npm --prefix apps/frontend-react run test -- --help >/dev/null 2>&1; then
  echo "==> Running frontend-react tests"
  npm --prefix apps/frontend-react test
else
  echo "==> frontend-react tests not configured yet, skipping"
fi

if npm --prefix apps/frontend-vue run test -- --help >/dev/null 2>&1; then
  echo "==> Running frontend-vue tests"
  npm --prefix apps/frontend-vue test
else
  echo "==> frontend-vue tests not configured yet, skipping"
fi

echo "==> All tests completed"
