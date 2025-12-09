# Security Quickstart Guide

This guide helps developers quickly adopt secure practices when using this template.

---

## 1. Before You Start

- Do **not** commit secrets - use `.env` files or a secret manager
- Run `make lint` and `make test` before PRs  
- Keep dependencies updated  
- Read the Threat Model (`THREAT_MODEL.md`)  

---

## 2. During Development

### Validate Input  
All controllers and routes should sanitize / validate user input.

### Enforce Authorization
Every privileged operation must check user role/permissions.

### Use Safe Patterns
- Parameterized queries  
- No eval / unsafe dynamic execution  
- No inline JS in HTML templates  

### Logging
Log:
- request ID  
- user ID (if authenticated)  
- errors w/ stack (but no sensitive data)  

---

## 3. Checklist Before Submitting a PR

- [ ] No secrets in code  
- [ ] No new high-risk dependencies  
- [ ] Unit + integration tests added  
- [ ] OpenAPI spec updated  
- [ ] ASVS checklist reviewed  
- [ ] Security PR checklist reviewed  

---

## 4. Production Hardening (If Using This Template)

- Enable HTTPS + HSTS  
- Deploy using minimal-privilege IAM roles  
- Build containers with non-root users  
- Apply network policies  
- Set resource limits in K8s  

---

## 5. Additional Resources

- [Security Index](index.md)  
- [Security PR Checklist](security-pr-review-checklist.md)  
- [ASVS Checklist](asvs-security-checklist.md)  

This guide ensures new contributors use the template securely from day one.

