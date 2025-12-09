# Security Policy

## Supported Environments

Security fixes apply to:

- `main` branch (current production)
- Latest tagged release (`vX.Y.Z`)

## Reporting a Vulnerability

Please **do not file public GitHub issues** for security problems.

Instead, email: `security@example.com`  
Include:

- Description of the issue
- Impact (e.g., data exposure, RCE)
- Steps to reproduce (PoC)
- Affected environment (dev/staging/prod)
- Any logs or screenshots

We aim to:

- Acknowledge within **3 business days**
- Provide a remediation plan within **10 business days**

## Hardening Baseline

We enforce:

- HTTPS everywhere (HSTS, redirect HTTP → HTTPS)
- Strict security headers (`Content-Security-Policy`, `X-Frame-Options`, etc.)
- No secrets in source control (`.env` + secret manager only)
- Automated dependency scanning (GitHub Dependency Review, npm audit)
- Automated SAST on PRs (see `.github/workflows/security-sast.yml`)
- Principle of least privilege in infra (Terraform IAM, K8s RBAC)

See `docs/security/security-headers.md` and `THREAT_MODEL.md` for more details.

