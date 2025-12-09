#!/usr/bin/env bash
set -e

echo "Generating SBOM (CycloneDX)..."

if ! command -v npx &> /dev/null; then
    echo "npx not found"
    exit 1
fi

npx @cyclonedx/cyclonedx-npm --output sbom.json

echo "SBOM generated: sbom.json"

