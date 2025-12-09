# Security Quickstart Guide

This guide helps developers quickly adopt secure practices when using this template.

> **WARNING: Template Scope Reminder**  
> The security materials in this repo are **examples and starting points**. They do not make your system automatically secure or legally compliant.  
> 
> You are responsible for:
> - Implementing XSS/CSRF protections appropriate to your actual features
> - Configuring cookies/sessions safely in your real authentication flows
> - Defining and meeting any legal/regulatory requirements (GDPR, CCPA, COPPA, etc.)
> 
> Use these docs as a *baseline toolkit*, not as a substitute for a real security and compliance program.

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

## 5. Security Scripts

The template includes example security scripts in `scripts/security/`:

- Secret scanning
- Dependency vulnerability scanning
- Container image scanning
- SBOM generation

**Important:** These scripts are examples and may require additional tools (Trivy, syft, etc.) to be installed. They are not automatically executed in CI/CD. See `scripts/security/README.md` for details.

---

## 6. Additional Resources

- [Security Index](index.md)  
- [Security PR Checklist](security-pr-review-checklist.md)  
- [ASVS Checklist](asvs-security-checklist.md)
- [API Security Checklist](api-security-checklist.md)
- [Privacy & Compliance](privacy-and-compliance.md)

This guide ensures new contributors use the template securely from day one.

