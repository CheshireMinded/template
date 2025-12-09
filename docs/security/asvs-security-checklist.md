# OWASP ASVS-Inspired Security Checklist (Template Version)

> **Note:**  
> This is a simplified, educational checklist for teams using this template.  
> It is not a full substitute for the official ASVS.

---

## 1. Architecture

- [ ] Data flow diagram documented
- [ ] Trust boundaries clearly defined
- [ ] External services identified and assessed
- [ ] Threat model created or updated

---

## 2. Authentication

- [ ] Passwords never logged or stored in plaintext
- [ ] MFA supported (if applicable)
- [ ] Authentication failures are rate-limited
- [ ] Sessions expire and are invalidated server-side

---

## 3. Access Control

- [ ] Role- or attribute-based authorization defined
- [ ] Access is denied by default ("deny first")
- [ ] Horizontal privilege checks implemented
- [ ] Vertical privilege checks implemented

---

## 4. Input Validation

- [ ] All user input validated server-side
- [ ] Use parameterized queries (no string concat for SQL)
- [ ] File uploads validated for type, size, and content

---

## 5. Output Encoding

- [ ] HTML escaped to prevent XSS
- [ ] JSON output uses safe serialization
- [ ] Template rendering escapes by default

---

## 6. Error Handling & Logging

- [ ] No sensitive data in logs
- [ ] Structured logging enabled
- [ ] Logs timestamped and correlate to request IDs

---

## 7. Secrets & Configuration

- [ ] Secrets stored only in environment variables or secret manager
- [ ] No secrets committed to Git
- [ ] CI/CD masks secret values
- [ ] Rotatable secrets (no hardcoded tokens)

---

## 8. API Security

- [ ] Rate limiting enabled
- [ ] API authentication enforced
- [ ] OpenAPI spec kept up to date
- [ ] CORS configured restrictively

---

## 9. Frontend Security

- [ ] CSP applied
- [ ] No inline scripts unless hashed
- [ ] Third-party scripts reviewed and pinned

---

## 10. Deployment

- [ ] HTTPS enforced
- [ ] HSTS enabled
- [ ] Security headers configured correctly

---

