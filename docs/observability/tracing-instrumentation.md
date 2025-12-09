# Tracing Instrumentation Guide

## Why Tracing?
- Understand end-to-end request behavior
- Identify slowness in downstream services
- Correlate logs, metrics, and spans

---

## Required Trace Fields

| Field | Description |
|--------|-------------|
| traceId | Unique per request flow |
| spanId | Each operation within request |
| parentSpanId | Hierarchy of spans |
| service | backend-api, frontend, worker |
| name | Operation name |

---

## Implementation (Backend)

Use `requestId` as a lightweight tracing key, or integrate with OpenTelemetry.

```ts
logger.info(
  {
    requestId,
    traceId,
    spanId,
    userId,
    path,
  },
  "Operation completed"
);
```

