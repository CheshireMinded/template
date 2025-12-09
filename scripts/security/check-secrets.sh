#!/usr/bin/env bash
set -e

echo "Running secrets scan..."

grep -RIn --exclude-dir={.git,node_modules,dist,build,coverage} \
    -e "AWS_SECRET" \
    -e "API_KEY" \
    -e "BEGIN RSA PRIVATE KEY" \
    -e "password=" \
    -e "secret" \
    . || true

echo "Secret scan complete (manual review advised)."

