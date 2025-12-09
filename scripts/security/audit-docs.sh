#!/usr/bin/env bash
set -e

echo "Auditing security documentation..."

DOCS=(
  "docs/security/index.md"
  "docs/security/security-risk-register.md"
  "docs/security/asvs-security-checklist.md"
  "THREAT_MODEL.md"
)

for d in "${DOCS[@]}"; do
  if [ ! -f "$d" ]; then
    echo "Missing required doc: $d"
  else
    echo "Found: $d"
  fi
done

echo "Recommend reviewing all docs quarterly."

