# Cookie & Session Security (Template)

This document outlines secure defaults for cookies and session management.

---

## Secure Cookie Attributes

Always enable:

- `Secure`
- `HttpOnly`
- `SameSite=Strict`
- `Path=/`

---

## Session Guidelines

- Rotate session identifiers after login  
- Invalidate sessions on logout  
- Use short session TTLs  
- Do not store PII in sessions  

---

## Token Storage Best Practices

- **Do not** store JWTs in `localStorage`  
- Prefer HttpOnly cookies for session tokens  
- If using JWTs:
  - Keep payload minimal  
  - Set short expiration times  
  - Rotate signing keys  

