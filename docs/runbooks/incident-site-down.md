# Runbook: Site Down

## 1. Detection

Typical alerts:

- Uptime monitor for `https://app.example.com` or `https://api.example.com` failed.
- Elevated HTTP 5xx error rate.
- Reports from users or support.

## 2. Initial Response (First 5-10 Minutes)

1. Acknowledge alerts in monitoring system.
2. Quickly confirm:
   - Can you reach the site from a different network?
   - Are both app and API down, or just one?

3. Check recent deployments:
   - Last deploy time and commit SHA.
   - If outage closely follows a deploy, prepare for rollback.

## 3. Diagnostics

### 3.1 Kubernetes

- `kubectl get pods -n web-platform`
- `kubectl describe pod <pod> -n web-platform`
- `kubectl logs <pod> -n web-platform`

Look for:

- Crash loops.
- Readiness/liveness probe failures.
- Resource exhaustion (OOM, CPU throttling).

### 3.2 Ingress / DNS

- Check ingress status:
  - `kubectl get ingress -n web-platform`
- Verify DNS points to correct load balancer.
- Check TLS certificate validity.

### 3.3 Backend

- Check `/healthz`:
  - `curl -v https://api.example.com/healthz`
- Review logs for spikes in 5xx or specific error codes.

## 4. Mitigation

- If a recent deploy is suspected:
  - Consider rollback (see `rollback.md`).
- If infrastructure is failing (cluster/network issue):
  - Escalate to the infra/SRE team.
- If external dependency is down:
  - Implement fallback behavior where possible.

## 5. Communication

- If SEV-1:
  - Notify internal stakeholders (engineering, support, leadership).
  - Update public status page if available.
- Provide regular updates until resolved.

## 6. Post-Incident

- Complete an incident report (see `incident-response-template.md`).
- Implement action items to prevent recurrence.
- Update this runbook if gaps are discovered.
