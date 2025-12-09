# Runbook: Rotate Secrets

## 1. When to Rotate

- Suspected or confirmed credential leak.
- Regularly scheduled rotation (e.g., every 90 days).
- Before granting temporary third-party access.

## 2. Preparation

- Identify secrets to rotate:
  - DB credentials.
  - API keys.
  - JWT signing keys.
- Identify systems and services using those secrets.

## 3. Rotation Steps (Example: Backend Secrets)

1. Generate new secret values securely.
2. Update secret in secret manager or Kubernetes:
   - For K8s:
     - Create updated secret manifest (base64-encoded values).
     - `kubectl apply -f infra/k8s/secret-example.yaml -n web-platform`
3. Trigger a rolling restart:
   - `kubectl rollout restart deploy/backend -n web-platform`

## 4. Coordination with Dependent Systems

- If rotating DB password:
  - Update DB user credential in:
    - Database system.
    - Application secrets.
  - Ensure no other apps use the same credentials (or rotate them as well).

## 5. Verification

- Confirm app is healthy:
  - `kubectl get pods -n web-platform`
  - `curl https://api.example.com/healthz`
- Check logs for authentication failures.

## 6. Cleanup

- Revoke old credentials (DB, API providers).
- Document rotation:
  - When, what, and who.
- Update any internal documentation that references credentials (indirectly, never store actual values).

Adjust this runbook to match your specific secret management solution.
