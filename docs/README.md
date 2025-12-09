# Documentation Index

This directory contains project documentation for the web platform monorepo.

## High-Level

- `architecture.md` - Overall system architecture
- `data-flow.md` - Request and data flows
- `environments.md` - Summary of environments
- `golden-path.md` - End-to-end developer workflow
- `diagrams.md` - Mermaid diagrams for architecture & pipelines
- `development-setup.md` - Local development environment setup guide
- `onboarding.md` - New developer onboarding guide
- `glossary.md` - Glossary of tools, technologies, and concepts
- `roles-and-responsibilities.md` - Team roles and ownership
- `project-index.md` - Directory structure and navigation guide
- `tech-choices.md` - Technology selection rationale
- `governance.md` - Governance model and decision-making
- `release-process.md` - Release and versioning process

## Environments

- `environments/staging.md` - Staging details
- `environments/production.md` - Production details

## ADRs (Architectural Decision Records)

- `adr/0001-choose-monorepo-structure.md`
- `adr/0002-frontend-stack.md`
- `adr/0003-backend-stack.md`

## QA / Quality

- `qa/test-strategy.md` - Test levels & expectations
- `qa/testing-architecture.md` - Complete testing architecture overview
- `qa/accessibility-checklist.md` - A11y checks
- `qa/performance-budget.md` - Performance constraints

## Security

See [Security Documentation Index](security/index.md) for the complete security documentation suite.

- `security/index.md` - Complete security documentation index
- `security/security-headers.md` - Required HTTP headers
- `security/incident-response-template.md` - Incident report structure
- `security/pentest-scope-template.md` - External test scope template
- `security/asvs-security-checklist.md` - OWASP ASVS-inspired checklist
- `security/secure-sdlc-checklist.md` - Secure SDLC checklist
- `security/security-pr-review-checklist.md` - PR security review checklist
- `security/pentest-report-template.md` - Penetration test report template
- `security/red-team-simulation-plan.md` - Red team simulation planning
- `security/security-risk-register.md` - Risk tracking template
- `security/architecture-risk-analysis.md` - Architecture risk analysis
- `security/soc2-starter-controls.md` - SOC2/ISO27001 control mapping
- `security/devsecops-maturity-model.md` - DevSecOps maturity assessment
- `security/security-incident-postmortem.md` - Security incident postmortem
- `security/service-security-questionnaire.md` - Vendor security questionnaire
- `security/bug-bounty-template.md` - Bug bounty submission template
- `security/vulnerability-writeup-template.md` - Vulnerability write-up template
- `security/pentest-rules-of-engagement.md` - Pentest RoE template
- `security/security-dashboard.md` - Security posture dashboard
- `security/security-quickstart.md` - Developer security quickstart
- `security/security-review-cadence.md` - Security review schedule
- `security/security-controls-owners.md` - Security controls ownership
- `security/terraform-hardening.md` - Terraform security practices
- `security/dependency-policy.md` - Dependency governance policy
- `security/cookie-session-security.md` - Cookie and session security
- `security/cors-policy.md` - CORS policy template
- `security/data-classification.md` - Data classification guide
- `../SECURITY.md` - Security policy
- `../THREAT_MODEL.md` - Threat model

## Runbooks

- `runbooks/deploy.md` - Deploy to staging & prod
- `runbooks/rollback.md` - Rollback procedure
- `runbooks/incident-site-down.md` - Site outage handling
- `runbooks/rotate-secrets.md` - Secret rotation process

## Pipelines

- `pipelines/ci-cd-overview.md` - CI/CD pipeline documentation

## Observability

- `observability/logging-standards.md` - Structured logging requirements
- `observability/metrics-and-slos.md` - Metrics, SLOs, and alerting
- `observability/tracing-instrumentation.md` - Distributed tracing guide

## Conventions

- `CONVENTIONS-commits.md` - Commit message format
- `CONVENTIONS-development.md` - Development conventions and standards
- `../CONTRIBUTING.md` - Contribution guidelines

## Contributing to Docs

- Keep docs **short, accurate, and up to date**.
- When making a major change to architecture or tech choices, add an ADR to `docs/adr/`.
- When operational steps change, update relevant runbooks under `docs/runbooks/`.

PRs that touch infra or behavior should usually touch docs as well.

