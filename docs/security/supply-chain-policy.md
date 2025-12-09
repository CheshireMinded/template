# Supply Chain Security Policy

This document outlines supply chain security practices, including image signing, SBOM generation, and policy-as-code examples.

## Overview

Supply chain security ensures the integrity and provenance of software artifacts throughout the development and deployment lifecycle.

## Image Signing

### Cosign Verification

We use [Cosign](https://github.com/sigstore/cosign) for container image signing and verification.

#### Signing Images

```bash
# Sign an image after building
cosign sign --key cosign.key ${ECR_REPO}:${TAG}

# Sign with keyless (uses Sigstore)
cosign sign ${ECR_REPO}:${TAG}
```

#### Verifying Images

```bash
# Verify signature
cosign verify --key cosign.pub ${ECR_REPO}:${TAG}

# Verify with keyless
cosign verify ${ECR_REPO}:${TAG}
```

#### CI/CD Integration

In GitHub Actions, add verification step:

```yaml
- name: Verify image signature
  run: |
    cosign verify --key cosign.pub ${ECR_REPO}:${TAG}
```

**Note:** For this template, image signing is demonstrated conceptually. In production, you would:
- Generate signing keys securely
- Store keys in a secret manager
- Verify signatures before deployment
- Integrate with policy enforcement tools

## SBOM Generation

### CycloneDX Format

We generate Software Bill of Materials (SBOM) in CycloneDX format for all applications.

#### Generation

```bash
# Generate SBOM for Node.js apps
npm install -g @cyclonedx/cyclonedx-npm
cyclonedx-npm --output-file bom.json

# Or use the provided script
scripts/security/generate-sbom.sh
```

#### SBOM Contents

- Package dependencies
- Version information
- License information
- Vulnerability data (when available)

#### Storage

- SBOMs are generated in CI/CD
- Stored as build artifacts
- Attached to container images (as metadata)
- Archived for compliance

See `scripts/security/generate-sbom.sh` for implementation.

## SLSA (Supply-chain Levels for Software Artifacts)

### SLSA Levels

We aim for **SLSA Level 2** compliance:

- **Level 1:** Documentation of build process
- **Level 2:** Version control + hosted build service
- **Level 3:** Non-falsifiable provenance
- **Level 4:** Two-person review + all changes traceable

### Current Implementation

- **Version Control:** All code in Git
- **Build Service:** GitHub Actions (hosted)
- **Provenance:** Build metadata in CI artifacts
- **SBOM:** Generated for all artifacts

### Future Enhancements (SLSA Level 3+)

- **Provenance Attestations:** Use SLSA provenance format
- **Two-Person Review:** Require PR approvals
- **Audit Logging:** Track all changes
- **Policy Enforcement:** Automated checks

## Policy as Code

### OPA/Conftest for Kubernetes

We use [Conftest](https://www.conftest.dev/) with Open Policy Agent (OPA) to validate Kubernetes manifests.

#### Example Policy

```rego
# policies/k8s-security.rego
package main

# Deny containers running as root
deny[msg] {
    input.kind == "Deployment"
    container := input.spec.template.spec.containers[_]
    container.securityContext.runAsUser == 0
    msg := "Container must not run as root user"
}

# Require non-root user
deny[msg] {
    input.kind == "Deployment"
    container := input.spec.template.spec.containers[_]
    not container.securityContext.runAsUser
    msg := "Container must specify runAsUser (non-root)"
}

# Require resource limits
deny[msg] {
    input.kind == "Deployment"
    container := input.spec.template.spec.containers[_]
    not container.resources.limits
    msg := "Container must specify resource limits"
}
```

#### Validation

```bash
# Validate K8s manifests
conftest test infra/k8s/*.yaml --policy policies/
```

#### CI Integration

Add to pre-commit or CI:

```yaml
- name: Validate K8s policies
  run: |
    conftest test infra/k8s/*.yaml --policy policies/
```

### Terraform Policy (Checkov)

We use [Checkov](https://www.checkov.io/) for Terraform security scanning.

#### Example Checks

- S3 buckets must not be public
- ECR repositories must have image scanning enabled
- CloudFront distributions must use HTTPS
- IAM policies must follow least privilege

#### Validation

```bash
# Scan Terraform
checkov -d infra/terraform/
```

See `.github/workflows/terraform-sec.yml` for CI integration.

## Dependency Management

### Vulnerability Scanning

- **npm audit:** Automated in CI
- **Snyk/OSV:** Optional integration
- **Dependabot:** Automated PRs for updates

### Update Policy

- **Security Updates:** Apply immediately
- **Minor Updates:** Review monthly
- **Major Updates:** Plan quarterly

See `scripts/security/scan-deps.sh` for implementation.

## Container Security

### Base Images

- Use official, minimal base images (Alpine Linux)
- Regularly update base images
- Scan images for vulnerabilities

### Image Scanning

- **Trivy:** Container vulnerability scanning
- **ECR Scanning:** AWS ECR native scanning
- **Grype:** Alternative scanner

See `scripts/security/scan-container.sh` for implementation.

## Secrets Management

### Policy

- **Never commit secrets** to version control
- Use secret managers (AWS Secrets Manager, HashiCorp Vault)
- Rotate secrets regularly
- Audit secret access

### Detection

- **git-secrets:** Pre-commit hooks
- **truffleHog:** Secret scanning in CI
- **GitHub Secret Scanning:** Native detection

See `scripts/security/check-secrets.sh` for implementation.

## Compliance

### Frameworks

- **SLSA:** Supply chain security levels
- **SPDX:** Software package data exchange
- **CycloneDX:** SBOM format standard
- **OWASP:** Dependency and container security

### Documentation

- SBOMs for all artifacts
- Build provenance records
- Security scan results
- Policy compliance reports

## Implementation Status

### Current

- SBOM generation (CycloneDX)
- Dependency scanning (npm audit)
- Container scanning (Trivy)
- Secret detection (git-secrets)
- Policy examples (OPA/Conftest)

### Planned

- 🔄 Image signing (Cosign)
- 🔄 SLSA Level 3 provenance
- 🔄 Automated policy enforcement
- 🔄 Supply chain attestations

## References

- [SLSA Framework](https://slsa.dev/)
- [CycloneDX Specification](https://cyclonedx.org/)
- [Cosign Documentation](https://github.com/sigstore/cosign)
- [OPA Policy Language](https://www.openpolicyagent.org/docs/latest/policy-language/)
- [Checkov Policies](https://www.checkov.io/3.Scans/resource-enforcement-policies.html)

---

**This policy demonstrates supply chain security best practices. In production, implement these controls based on your organization's requirements and compliance needs.**

