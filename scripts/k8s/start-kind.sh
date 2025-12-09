#!/bin/bash
set -e

kind create cluster --name web-platform --wait 60

kubectl cluster-info
echo "Kind cluster 'web-platform' created."

