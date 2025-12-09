# Logging Standards

## Goals
- Enable structured logs for filtering and analysis
- Maintain consistent fields across all services
- Facilitate correlation and tracing

---

## Required Log Fields

| Field | Description |
|-------|-------------|
| `timestamp` | ISO8601 timestamp |
| `level` | info, warn, error |
| `service` | backend-api, frontend-react, etc |
| `requestId` | UUID per request |
| `userId` | If logged in |
| `path` | HTTP path |
| `method` | HTTP method |
| `durationMs` | Request handling time |

### Example

```json
{
  "timestamp": "2025-01-01T00:00:00.000Z",
  "level": "info",
  "service": "backend-api",
  "requestId": "abc-123",
  "userId": "42",
  "path": "/api/v1/example",
  "method": "GET",
  "durationMs": 12
}
```

