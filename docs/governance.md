# Governance Model (Template)

This template follows a lightweight governance model inspired by real-world engineering orgs.

> **No direct contact with maintainers is required or expected.**  
> Governance applies only to forks or real deployments.

---

## Roles

### Engineering
- Owns application logic  
- Maintains code quality  
- Writes tests  
- Updates documentation  

### DevOps
- Owns infrastructure (K8s, Terraform, CI/CD)  
- Ensures security scanning is configured  

### Security (Template Role)
- Defines policies  
- Reviews controls  
- Updates threat models  

---

## Decision-Making Model

1. Propose changes via PR  
2. Document major decisions in ADRs (`docs/adr/`)  
3. Approve changes through code review  
4. Merge using squash merge  

---

## Architecture Decisions

All significant architectural changes require:

- Updated ADR  
- Updated diagrams  
- Updated documentation  

This ensures long-term clarity and coherence.

