#!/usr/bin/env bash
set -e

echo "Scanning JavaScript dependencies..."

npm audit --audit-level=moderate || true

echo "Scanning for outdated dependencies..."
npm outdated || true

echo "Dependency scan complete."

