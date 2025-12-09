# Cookie & Session Security (Template)

This document outlines secure defaults for cookies and session management.

> **WARNING: Template Scope:** This document provides guidance only. The template does not implement a production session store or cookie configuration. You must design and configure these for your actual authentication flows.

---

## Secure Cookie Attributes

Always enable:

- `Secure` - Only sent over HTTPS
- `HttpOnly` - Not accessible via JavaScript (prevents XSS token theft)
- `SameSite=Strict` - Prevents CSRF attacks
- `Path=/` - Appropriate path scope

---

## CSRF Protection

**When CSRF matters:**
- Cookie-based authentication (sessions)
- HTML form submissions
- State-changing operations (POST, PUT, DELETE)

**When CSRF is less critical:**
- Token-in-header authentication (JWT in Authorization header)
- Pure API-only SPAs with no cookies

**CSRF Protection Strategies:**

1. **SameSite Cookies** (Recommended)
   ```javascript
   // Example: Set SameSite=Strict on session cookies
   res.cookie('session', token, {
     httpOnly: true,
     secure: true,
     sameSite: 'strict'
   });
   ```

2. **CSRF Tokens**
   - Generate token on GET requests
   - Include token in form submissions or custom header
   - Validate token on state-changing requests

3. **Double-Submit Cookies**
   - Set random value in cookie and custom header
   - Verify they match on server

**Note:** The current template uses JWT tokens in Authorization headers, which reduces CSRF risk. If you add cookie-based auth, you **must** implement CSRF protection.

---

## Session Guidelines

- Rotate session identifiers after login  
- Invalidate sessions on logout  
- Use short session TTLs  
- Do not store PII in sessions  

---

## Token Storage Best Practices

- **Do not** store JWTs in `localStorage` (vulnerable to XSS)
- Prefer HttpOnly cookies for session tokens
- If using JWTs:
  - Keep payload minimal  
  - Set short expiration times  
  - Rotate signing keys

