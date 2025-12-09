# Security Headers

The platform must return the following HTTP headers on all user-facing endpoints.

> **WARNING: HTTPS Everywhere:** All non-local environments must terminate HTTPS at either a load balancer, ingress controller, or Nginx, with HSTS and modern TLS configuration (TLS 1.2+, TLS 1.3 preferred). Never deploy to production over HTTP.

## 1. Required Headers

- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` (HSTS - enforce HTTPS)
- `Content-Security-Policy: ...` (see below)
- `X-Content-Type-Options: nosniff` (prevent MIME type sniffing)
- `X-Frame-Options: DENY` (or `SAMEORIGIN` if framing is required)
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: ...` (limit access to camera, microphone, geolocation, etc.)

**TLS Configuration:**
- Minimum TLS 1.2 (TLS 1.3 preferred)
- Strong cipher suites only
- Certificate validation enforced
- No mixed content (HTTP resources on HTTPS pages)

## 2. Content-Security-Policy (CSP)

Example template (to be adapted):

```text
default-src 'self';
script-src 'self';
style-src 'self' 'unsafe-inline';
img-src 'self' data:;
font-src 'self';
connect-src 'self' https://api.example.com;
frame-ancestors 'none';
upgrade-insecure-requests;
```

Adjust directives as needed for analytics, CDNs, and third-party services.

## 3. Implementation

- **Frontend static hosting:** configure headers at CDN / reverse proxy (e.g., NGINX).
- **Backend API:** helmet middleware sets secure defaults.
- **Ingress:** use annotations or snippets to enforce additional headers.

## 4. Validation

- Manually verify via browser dev tools (Network → Response Headers).
- Use tools like securityheaders.com or similar.
- Automate checks where possible in CI/CD or smoke tests.

Document any exceptions and their justification.
