# API Security Checklist

Use this checklist when designing, implementing, or reviewing API endpoints.

---

## Authentication & Authorization

- [ ] All endpoints require authentication (except public routes)
- [ ] Authorization checks verify user permissions for each operation
- [ ] User context is extracted from token/session, not trusted from request body
- [ ] Principle of least privilege: users can only access their own resources (unless explicitly authorized)
- [ ] Token expiration and rotation are configured appropriately

---

## Input Validation

- [ ] All input is validated against a schema (e.g., Zod, Joi, express-validator)
- [ ] Type checking prevents injection attacks (SQL, NoSQL, command injection)
- [ ] File uploads are validated (type, size, content scanning)
- [ ] Rate limiting prevents abuse and DoS
- [ ] Input length limits prevent buffer overflows

---

## Output Encoding & Sanitization

- [ ] JSON responses are properly serialized (no XSS via JSON injection)
- [ ] Error messages don't leak sensitive information (stack traces, DB errors, file paths)
- [ ] PII is redacted from logs and error responses
- [ ] Response headers don't expose internal details (remove `X-Powered-By`, etc.)

---

## Error Handling

- [ ] Generic error messages in production (no internal details)
- [ ] Detailed errors logged server-side with request ID for correlation
- [ ] Error responses follow consistent format
- [ ] 401/403 errors don't reveal whether resource exists
- [ ] 500 errors don't expose stack traces to clients

---

## Logging & Monitoring

- [ ] All requests are logged with request ID
- [ ] Authentication failures are logged (but not passwords)
- [ ] Sensitive data (passwords, tokens, PII) is never logged
- [ ] Logs include user context (user ID) when available
- [ ] Anomalous patterns are monitored (failed logins, rate limit violations)

---

## Rate Limiting & Abuse Protection

- [ ] Rate limits are configured per route/endpoint
- [ ] Different limits for authenticated vs unauthenticated users
- [ ] Rate limit headers are included in responses (`X-RateLimit-*`)
- [ ] DDoS protection at infrastructure level (WAF, CDN)
- [ ] Account lockout after repeated failures

---

## HTTPS & TLS

- [ ] All non-local environments use HTTPS
- [ ] TLS 1.2+ is enforced (TLS 1.3 preferred)
- [ ] HSTS header is configured
- [ ] Certificate validation is enforced
- [ ] No mixed content (HTTP resources on HTTPS pages)

---

## Idempotency & Replay Protection

- [ ] State-changing operations are idempotent where possible
- [ ] Idempotency keys are supported for critical operations
- [ ] Replay attacks are prevented (nonce, timestamp validation)
- [ ] Request signing for sensitive operations (optional)

---

## Dependency Security

- [ ] Dependencies are regularly updated
- [ ] Known vulnerabilities are patched promptly
- [ ] SBOM (Software Bill of Materials) is maintained
- [ ] Dependency scanning is automated in CI/CD

---

## API Design Security

- [ ] RESTful endpoints follow least privilege (users can't access others' data)
- [ ] GraphQL queries are rate-limited and depth-limited
- [ ] Webhooks use signature verification
- [ ] API versioning prevents breaking changes
- [ ] OpenAPI/Swagger docs don't expose sensitive endpoints

---

## Related Documents

- [Security PR Review Checklist](security-pr-review-checklist.md)
- [ASVS Security Checklist](asvs-security-checklist.md)
- [Cookie & Session Security](cookie-session-security.md)
- [CORS Policy](cors-policy.md)

---

> **Note:** This checklist is a starting point. Adapt it to your specific API architecture and threat model.

