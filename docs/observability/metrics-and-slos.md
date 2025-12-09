# Metrics & SLOs

## Key Metrics

### Latency (p50, p90, p99)
Latency of backend API endpoints.

### Error Rate
Percentage of 5xx responses.

### Saturation
CPU / Memory usage of pods.

### Availability
Uptime of frontend and backend.

---

## Example SLOs

### Backend API Availability
- Target: **99.9% monthly uptime**
- Error Budget: **43.2 minutes**

### Frontend Latency
- p99 < **300ms** for static content

### API Latency
- p90 < **150ms** for "GET /example"
- p99 < **400ms**

---

## Alerts (SLA Violations)

- Error rate > 5% over 10 minutes  
- p99 latency > 500ms  
- Pod restarts > 3 in 10 minutes

