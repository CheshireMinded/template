#!/usr/bin/env bash
set -euo pipefail

# Post-deploy validation script
# Runs smoke tests, basic security checks, and writes a markdown report.

ENVIRONMENT="${ENVIRONMENT:-staging}"
BASE_URL="${BASE_URL:-http://localhost}"
REPORT_DIR="reports/post-deploy"
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
REPORT_FILE="${REPORT_DIR}/post-deploy-${ENVIRONMENT}-${TIMESTAMP}.md"

mkdir -p "${REPORT_DIR}"

echo "Writing post-deploy report to ${REPORT_FILE}"

# Helper to append to report
append() {
  echo "$@" >> "${REPORT_FILE}"
}

append "# Post-Deploy Validation Report"
append ""
append "- Environment: \`${ENVIRONMENT}\`"
append "- Base URL: \`${BASE_URL}\`"
append "- Timestamp: \`${TIMESTAMP}\`"
append ""

# -------------------------
# 1) Basic HTTP health check
# -------------------------
append "## 1. HTTP Health Check"
append ""

HEALTH_URL="${BASE_URL%/}/healthz"

if curl -fsS "${HEALTH_URL}" >/tmp/healthz.json 2>/tmp/healthz.err; then
  append "- [PASS] \`${HEALTH_URL}\` returned 2xx"
  append ""
  append "Response:"
  append ""
  append '```json'
  cat /tmp/healthz.json >> "${REPORT_FILE}"
  append '```'
else
  append "- [FAIL] Health check FAILED for \`${HEALTH_URL}\`"
  append ""
  append "Error output:"
  append ""
  append '```txt'
  cat /tmp/healthz.err >> "${REPORT_FILE}" || true
  append '```'
fi

append ""

# -------------------------
# 2) Contract / API tests (Dredd)
# -------------------------
append "## 2. Contract / API Tests (Dredd)"
append ""

if command -v dredd >/dev/null 2>&1 && [ -f "tests/contract/dredd.yml" ]; then
  if dredd tests/contract/dredd.yml "${BASE_URL}" >/tmp/dredd.out 2>/tmp/dredd.err; then
    append "- [PASS] Dredd contract tests PASSED"
  else
    append "- [FAIL] Dredd contract tests FAILED"
  fi

  append ""
  append "Output:"
  append ""
  append '```txt'
  cat /tmp/dredd.out >> "${REPORT_FILE}" || true
  cat /tmp/dredd.err >> "${REPORT_FILE}" || true
  append '```'
else
  append "- [SKIP] Dredd not installed or config missing; skipping contract tests."
fi

append ""

# -------------------------
# 3) E2E / UI smoke tests (Playwright)
# -------------------------
append "## 3. E2E / UI Smoke Tests (Playwright)"
append ""

if command -v npx >/dev/null 2>&1 && [ -d "tests/e2e" ]; then
  export PW_BASE_URL="${BASE_URL}"
  if npx playwright test --config=tests/e2e/playwright.config.ts >/tmp/pw.out 2>/tmp/pw.err; then
    append "- [PASS] Playwright tests PASSED"
  else
    append "- [FAIL] Playwright tests FAILED"
  fi

  append ""
  append "Output:"
  append ""
  append '```txt'
  cat /tmp/pw.out >> "${REPORT_FILE}" || true
  cat /tmp/pw.err >> "${REPORT_FILE}" || true
  append '```'
else
  append "- [SKIP] Playwright not available or tests/e2e missing; skipping E2E tests."
fi

append ""

# -------------------------
# 4) Load smoke tests (k6)
# -------------------------
append "## 4. Load Smoke Tests (k6)"
append ""

if command -v k6 >/dev/null 2>&1 && [ -f "tests/load/k6-api-smoke.js" ]; then
  if API_BASE_URL="${BASE_URL}" k6 run tests/load/k6-api-smoke.js >/tmp/k6.out 2>/tmp/k6.err; then
    append "- [PASS] k6 API smoke tests PASSED"
  else
    append "- [FAIL] k6 API smoke tests FAILED"
  fi

  append ""
  append "Output:"
  append ""
  append '```txt'
  cat /tmp/k6.out >> "${REPORT_FILE}" || true
  cat /tmp/k6.err >> "${REPORT_FILE}" || true
  append '```'
else
  append "- [SKIP] k6 not installed or tests/load missing; skipping load tests."
fi

append ""

# -------------------------
# 5) Security checks (using your existing scripts)
# -------------------------
append "## 5. Security Checks"
append ""

# 5.1 Dependency scan
if [ -x "scripts/security/scan-deps.sh" ]; then
  if scripts/security/scan-deps.sh >/tmp/scan-deps.out 2>/tmp/scan-deps.err; then
    append "- [PASS] Dependency scan (scan-deps.sh) PASSED"
  else
    append "- [FAIL] Dependency scan (scan-deps.sh) FAILED"
  fi

  append ""
  append "Output:"
  append ""
  append '```txt'
  cat /tmp/scan-deps.out >> "${REPORT_FILE}" || true
  cat /tmp/scan-deps.err >> "${REPORT_FILE}" || true
  append '```'
else
  append "- [SKIP] scripts/security/scan-deps.sh not executable or missing; skipping dependency scan."
fi

append ""

# 5.2 Secrets check
if [ -x "scripts/security/check-secrets.sh" ]; then
  if scripts/security/check-secrets.sh >/tmp/check-secrets.out 2>/tmp/check-secrets.err; then
    append "- [PASS] Secrets scan (check-secrets.sh) PASSED"
  else
    append "- [FAIL] Secrets scan (check-secrets.sh) FAILED"
  fi

  append ""
  append "Output:"
  append ""
  append '```txt'
  cat /tmp/check-secrets.out >> "${REPORT_FILE}" || true
  cat /tmp/check-secrets.err >> "${REPORT_FILE}" || true
  append '```'
else
  append "- [SKIP] scripts/security/check-secrets.sh not executable or missing; skipping secrets scan."
fi

append ""

# 5.3 Container scan (if you have images built)
if [ -x "scripts/security/scan-container.sh" ]; then
  if scripts/security/scan-container.sh >/tmp/scan-container.out 2>/tmp/scan-container.err; then
    append "- [PASS] Container scan (scan-container.sh) PASSED"
  else
    append "- [FAIL] Container scan (scan-container.sh) FAILED"
  fi

  append ""
  append "Output:"
  append ""
  append '```txt'
  cat /tmp/scan-container.out >> "${REPORT_FILE}" || true
  cat /tmp/scan-container.err >> "${REPORT_FILE}" || true
  append '```'
else
  append "- [SKIP] scripts/security/scan-container.sh not executable or missing; skipping container scan."
fi

append ""

# 5.4 SBOM generation (optional)
if [ -x "scripts/security/generate-sbom.sh" ]; then
  if scripts/security/generate-sbom.sh >/tmp/sbom.out 2>/tmp/sbom.err; then
    append "- [PASS] SBOM generated successfully (generate-sbom.sh)"
  else
    append "- [FAIL] SBOM generation (generate-sbom.sh) FAILED"
  fi

  append ""
  append "Output:"
  append ""
  append '```txt'
  cat /tmp/sbom.out >> "${REPORT_FILE}" || true
  cat /tmp/sbom.err >> "${REPORT_FILE}" || true
  append '```'
else
  append "- [SKIP] scripts/security/generate-sbom.sh not executable or missing; skipping SBOM generation."
fi

append ""

append "---"
append "_End of report_"

echo "Post-deploy checks complete. See: ${REPORT_FILE}"

