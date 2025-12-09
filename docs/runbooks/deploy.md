# Runbook: Deploy to Staging and Production

## 1. Deploy to Staging

### Prerequisites

- CI pipeline is green on the branch to be deployed.
- No active SEV-1 or SEV-2 incidents.

### Steps

1. Merge changes into the `develop` branch.
2. CI will:
   - Run tests and builds.
   - Build and push Docker images with `:staging` tags.
   - Apply K8s manifests for the staging namespace.
3. Wait for deployment to complete:
   - `kubectl get deploy -n web-platform-staging`
4. Run smoke tests:
   - Visit `https://staging.app.example.com`.
   - Call `https://staging.api.example.com/healthz`.
5. If smoke tests fail:
   - Investigate logs and metrics.
   - Consider reverting the change or fixing forward.

## 2. Deploy to Production

### Prerequisites

- Staging deployment passed smoke tests.
- No ongoing incidents that would block a deploy.

### Steps

1. Create a tagged release:
   - `git tag vX.Y.Z`  
   - `git push origin vX.Y.Z`
2. CI will:
   - Build and test code for the tag.
   - Build and push Docker images tagged `vX.Y.Z` and `latest`.
   - Apply K8s manifests to production namespace.
3. Confirm rollout:
   - `kubectl rollout status deploy/frontend -n web-platform`
   - `kubectl rollout status deploy/backend -n web-platform`
4. Run production smoke tests:
   - Visit `https://app.example.com`.
   - Call `https://api.example.com/healthz`.

## 3. Post-Deployment

- Monitor:
  - Error rates.
  - Latency.
  - 4xx/5xx ratios.
- If major issues appear, follow `rollback.md`.

Update this runbook as the CI/CD pipeline evolves.
