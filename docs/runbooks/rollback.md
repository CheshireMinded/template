# Runbook: Rollback Deployment

## 1. When to Roll Back

Consider rolling back when:

- Production is experiencing a SEV-1 or SEV-2 incident caused by a recent deploy.
- Critical paths are broken (e.g., login, checkout).
- Quick fix is not immediately available.

## 2. Rollback Options

### Option A: Kubernetes Rollout Undo

If you used `kubectl apply` and Kubernetes has previous ReplicaSets:

1. Identify the deployment:
   - `kubectl get deploy -n web-platform`
2. Roll back:
   - `kubectl rollout undo deploy/frontend -n web-platform`
   - `kubectl rollout undo deploy/backend -n web-platform`
3. Check status:
   - `kubectl rollout status deploy/frontend -n web-platform`
   - `kubectl rollout status deploy/backend -n web-platform`

### Option B: Re-Deploy Previous Tag

If images are versioned:

1. Identify last known good tag (e.g., `vX.Y.Z`).
2. Update image tags in your manifests or Helm values to `vX.Y.Z`.
3. Apply manifests:
   - `kubectl apply -f infra/k8s/`

## 3. Verify Rollback

- Check health endpoints.
- Run quick functional smoke tests.
- Confirm error rates return to normal.

## 4. After Rollback

- Freeze further deployments until root cause is identified.
- Create or update an incident using `incident-response-template.md`.
- Plan and test a fix before redeploying.

Document every rollback in the incident or change log.
