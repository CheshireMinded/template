# Glossary of Tools, Technologies, and Concepts

This monorepo uses a modern, production-grade, cloud-native stack.  
This glossary explains each major component.

---

## Core Application Stack

### **Node.js**
JavaScript runtime used for the backend API and tooling.

### **npm**
Package manager for JavaScript dependencies.

### **TypeScript**
Typed superset of JavaScript used to improve maintainability and reliability.

### **React / Vue**
Modern frontend frameworks used to build interactive UIs.

### **Vite**
Ultra-fast build tool for frontend applications.

---

## Containerization & Runtime

### **Docker**
Used to containerize applications and produce reproducible builds.

### **Docker Compose**
Used for multi-service local development environments.

### **Buildx**
Advanced builder for multi-platform Docker images.

---

## Kubernetes Ecosystem

### **Kubernetes (K8s)**
Orchestrates containers in production; we deploy backend & frontend here.

### **kubectl**
CLI for interacting with Kubernetes clusters.

### **Helm**
Package manager for Kubernetes; used to deploy apps with versioned, templated charts.

### **Ingress Controller**
Handles external traffic (typically nginx-ingress).

### **HPA (Horizontal Pod Autoscaler)**
Automatically scales pods based on CPU/memory.

### **PDB (Pod Disruption Budget)**
Controls eviction behavior during upgrades and failures.

### **NetworkPolicy**
Restricts service-to-service network traffic.

---

## AWS Infrastructure

### **Terraform**
Infrastructure-as-Code tool used to manage:
- Route53 (DNS)
- ACM (TLS certificates)
- CloudFront
- S3 static hosting
- ECR container repositories

### **Route53**
DNS service.

### **ACM**
Manages TLS certificates.

### **ECR**
Docker image registry.

### **S3**
Static file storage (for websites and Terraform state).

### **CloudFront**
CDN in front of S3-hosted sites.

---

## Security & DevSecOps

### **Trivy**
Container and filesystem vulnerability scanner.

### **tfsec / Checkov**
Terraform static security scanners.

### **CodeQL**
Static analysis engine used for deep application security scanning.

### **SBOM (CycloneDX)**
Software Bill of Materials - inventory of dependencies.

### **GitHub Dependabot / Renovate**
Dependency auto-update tools.

---

## Testing & Quality

### **Jest**
Testing framework for backend API.

### **ESLint / Prettier / Stylelint**
Linters and formatters for JavaScript, TypeScript, and CSS.

---

## Tooling & Scripting

### **Makefile**
Provides unified commands to lint, build, test, and deploy.

### **Bash Scripts**
Automate Docker, K8s, setup tasks, pre-commit checks, and more.

### **Pre-commit Hooks**
Automated lint/test/security checks before committing.

---

## Documentation & Process

### **ADR (Architecture Decision Record)**
Historical record of why architectural decisions were made.

### **Runbooks**
Operations documentation for deploys, rollbacks, incidents.

### **Threat Model**
High-level attack surface outline.

### **OpenAPI**
Formal API contract for backend services.

