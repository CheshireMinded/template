#!/usr/bin/env bash
set -euo pipefail

echo "==> Running pre-commit checks: lint + test + config validation"

bash ./scripts/lint-all.sh
bash ./scripts/test-all.sh

# Optional: Run config validation (non-blocking)
if [ -f "./scripts/verify-config.sh" ]; then
  echo "==> Running config validation..."
  bash ./scripts/verify-config.sh || echo "==> Config validation completed with warnings (non-blocking)"
fi

echo "==> Pre-commit checks passed"
