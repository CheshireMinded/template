# Chaos Experiments

This document outlines chaos engineering experiments to validate system resilience and failure handling.

## Goals

- Validate that failure scenarios are handled gracefully
- Ensure observability captures failure states
- Verify runbooks and incident response procedures
- Test SLO compliance under failure conditions

---

## Experiment Categories

### 1. Backend Service Failures

#### Experiment: Backend Pod Termination
**Scenario:** Simulate backend pod crash/restart

**Steps:**
```bash
# In Kubernetes
kubectl delete pod -l app=backend-api -n web-platform-staging
```

**Expected Behavior:**
- Kubernetes restarts the pod automatically
- Health checks fail during restart window
- Requests to `/healthz` return 503 during downtime
- Logs show pod termination and restart events
- SLO error budget consumed during downtime

**Validation:**
- Pod restarts within 30 seconds
- No data loss (if using stateless design)
- Monitoring alerts fire appropriately
- Post-deploy validation catches the failure

**Runbook Reference:** `docs/runbooks/incident-site-down.md`

---

#### Experiment: Backend High Latency
**Scenario:** Simulate database or external API latency spike

**Steps:**
```bash
# Using network delay (if using service mesh or network policies)
# Or inject delay in code for testing
```

**Expected Behavior:**
- API responses slow down (p90, p99 increase)
- Timeout errors may occur for long-running requests
- SLO latency thresholds may be breached
- Alerts fire for high latency

**Validation:**
- Latency metrics captured correctly
- SLO error budget consumed
- Alerts trigger as expected
- Frontend handles timeouts gracefully

---

### 2. Frontend Service Failures

#### Experiment: Frontend Pod Termination
**Scenario:** Simulate frontend pod crash

**Steps:**
```bash
kubectl delete pod -l app=frontend-react -n web-platform-staging
```

**Expected Behavior:**
- Kubernetes restarts the pod
- Users see 503 or connection errors during restart
- CDN/CloudFront may cache stale content
- Health checks fail during downtime

**Validation:**
- Pod restarts successfully
- No impact on backend services
- CDN serves cached content when possible

---

### 3. Infrastructure Failures

#### Experiment: Database Connection Loss
**Scenario:** Simulate database unavailability (if using database)

**Steps:**
```bash
# If using managed database, simulate network partition
# Or stop database service in test environment
```

**Expected Behavior:**
- Backend returns 503 or 500 errors
- Error rate increases
- Logs show connection errors
- Health checks may fail

**Validation:**
- Error handling middleware catches database errors
- Structured error responses returned
- Monitoring captures error rate spike
- Alerts fire appropriately

---

#### Experiment: Network Partition
**Scenario:** Simulate network issues between services

**Steps:**
```bash
# Using Kubernetes network policies or service mesh
# Block traffic between frontend and backend
```

**Expected Behavior:**
- Frontend cannot reach backend
- API calls fail with timeout or connection errors
- Frontend shows error messages to users
- Backend continues operating independently

**Validation:**
- Frontend error handling works correctly
- User experience degrades gracefully
- Monitoring shows connection failures
- Runbooks guide recovery

---

## Experiment Execution

### Pre-Experiment Checklist

- [ ] Notify team (if in shared environment)
- [ ] Ensure monitoring dashboards are visible
- [ ] Have runbooks ready
- [ ] Set up alerting notifications
- [ ] Document baseline metrics

### During Experiment

1. Execute the failure scenario
2. Monitor metrics and logs in real-time
3. Verify alerts fire as expected
4. Check user-facing behavior
5. Document observations

### Post-Experiment

1. Restore normal operation
2. Review metrics and logs
3. Update runbooks if gaps found
4. Document findings
5. Create follow-up tasks for improvements

---

## Safety Guidelines

- **Never run chaos experiments in production without approval**
- Start with staging/test environments
- Have rollback procedures ready
- Monitor error budgets closely
- Set time limits for experiments
- Document all experiments and outcomes

---

## Integration with SLOs

Each experiment should validate SLO compliance:

- **Availability SLO:** Measure downtime impact
- **Latency SLO:** Verify latency thresholds under stress
- **Error Rate:** Track error budget consumption
- **Saturation:** Monitor resource usage during failures

See `docs/observability/metrics-and-slos.md` for SLO definitions.

---

## Example: Complete Experiment Run

```bash
# 1. Baseline metrics
kubectl get pods -n web-platform-staging
curl https://staging.app.example.com/healthz

# 2. Execute experiment
kubectl delete pod -l app=backend-api -n web-platform-staging

# 3. Monitor (in separate terminal)
watch -n 1 'kubectl get pods -n web-platform-staging'
# Check Prometheus/Grafana dashboards

# 4. Validate recovery
# Wait for pod to restart
kubectl wait --for=condition=ready pod -l app=backend-api -n web-platform-staging --timeout=60s

# 5. Verify health
curl https://staging.app.example.com/healthz

# 6. Review logs
kubectl logs -l app=backend-api -n web-platform-staging --tail=50
```

---

## Future Experiments

- **Load Testing:** Use k6 to simulate traffic spikes
- **Resource Exhaustion:** CPU/memory limits
- **Configuration Drift:** Deploy incorrect configs
- **Security:** Simulate attack scenarios (in isolated environment)
- **Data Corruption:** Test data validation and recovery

See `tests/load/` for load testing scenarios.

