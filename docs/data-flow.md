# Data Flow

## 1. Authentication Flow (Example)

1. User visits `https://app.example.com`.
2. Frontend loads and, if necessary, redirects to login.
3. User submits credentials to `POST /api/v1/auth/login`.
4. Backend validates credentials and returns:
   - Session cookie **or**
   - JWT access/refresh tokens.
5. Frontend stores only non-sensitive data in local/session storage.
6. Subsequent API requests include:
   - Auth cookie (HttpOnly, Secure) **or**
   - Authorization header (`Bearer <token>`).

## 2. Basic Request Flow

1. Browser sends request → `CDN/WAF`.
2. Request forwarded to K8s Ingress.
3. Ingress routes to appropriate Service (`frontend` or `backend`).
4. Backend:
   - Validates input.
   - Interacts with database/external services.
   - Returns sanitized JSON response.
5. Logs are written in structured JSON (including request ID, status code, latency).

## 3. Error Flow

- If request fails due to client error (4xx):
  - Backend returns standardized error body:
    ```json
    {
      "error": true,
      "code": "ERR_CODE",
      "message": "Human-readable message",
      "trace_id": "request-id"
    }
    ```
- If internal server error (5xx):
  - No internal stack traces in response.
  - Details only in server-side logs.
  - `trace_id` can be used to correlate client reports with logs.

## 4. Data at Rest

- Application data is stored in a managed database (fill in type: Postgres/MySQL/etc.).
- Encryption at rest enabled where supported.
- Secrets (e.g., DB credentials, API keys) are stored in:
  - Kubernetes Secrets (for runtime).
  - External secret manager where appropriate.

Use this document as a base and update it when data flows change (e.g., adding S3, MQ, etc.).
