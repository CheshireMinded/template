#!/usr/bin/env bash
set -euo pipefail

echo "==> Running pre-commit checks: lint + test (backend only for now)"

bash ./scripts/lint-all.sh
bash ./scripts/test-all.sh

echo "==> Pre-commit checks passed"
