# Security Scripts

These scripts are **example security automation hooks** provided as templates. They are not a complete DevSecOps pipeline.

## Status

These scripts demonstrate security automation patterns but:

- **May require additional tools** (e.g., `trivy`, `npm audit`, `git-secrets`, `syft`) that are not installed by default
- **Are not automatically executed** in CI/CD (you must integrate them)
- **Should be adapted** to your specific tooling and requirements

## Scripts

- `check-secrets.sh` - Basic grep-based secret scanning (requires manual review)
- `scan-deps.sh` - Dependency vulnerability scanning (requires `npm audit` or similar)
- `scan-container.sh` - Container image scanning (requires `trivy` or similar)
- `generate-sbom.sh` - Software Bill of Materials generation (requires `syft` or similar)
- `audit-docs.sh` - Documentation audit helper

## Usage

1. **Install required tools:**
   ```bash
   # Example: Install Trivy for container scanning
   # See: https://aquasecurity.github.io/trivy/latest/getting-started/installation/
   
   # Example: Install syft for SBOM generation
   # See: https://github.com/anchore/syft#installation
   ```

2. **Adapt scripts to your environment:**
   - Update paths and tool commands
   - Configure tool-specific options
   - Integrate with your CI/CD pipeline

3. **Integrate into CI/CD:**
   - Add as GitHub Actions jobs
   - Run as pre-commit hooks
   - Schedule as periodic scans

## Note

Running these scripts does **not** mean your system is fully secure. They are examples of security automation patterns. You must:

- Configure and maintain the underlying security tools
- Review and act on scan results
- Integrate with your broader security program
- Adapt to your specific threat model and requirements

