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
| `level` | debug, info, warn, error |
| `service` | backend-api, frontend-react, etc |
| `request_id` | UUID per request (from requestId middleware) |
| `userId` | If logged in (optional) |
| `path` | HTTP path |
| `method` | HTTP method |
| `duration` | Request handling time in milliseconds (from requestLogger middleware) |
| `status` | HTTP status code |
| `message` | Log message |

### Example

```json
{
  "timestamp": "2025-01-01T00:00:00.000Z",
  "level": "info",
  "service": "backend-api",
  "message": "http_request",
  "request_id": "abc-123",
  "userId": "42",
  "path": "/api/v1/example/echo",
  "method": "POST",
  "status": 200,
  "duration": 12
}
```

**Note:** Field names match the actual implementation in `apps/backend-api/src/middleware/requestLogger.ts` and `apps/backend-api/src/config/logger.ts`.

