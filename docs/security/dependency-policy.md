# Dependency Governance Policy (Template)

This policy defines how dependencies should be added, updated, and evaluated.

---

## Adding New Dependencies

- Must be reviewed for:
  - Licensing compatibility  
  - Maintenance activity  
  - Known vulnerabilities  
  - Size and performance impact  

---

## Updating Dependencies

- Use Renovate or Dependabot  
- Updates must pass:
  - Unit tests  
  - Integration tests  
  - Linting  
  - Type checking  

---

## Auditing Dependencies

Run:

```bash
npm audit
npm outdated
```

For containers:

```bash
trivy image <container>
```

---

## Removing Dependencies

Remove dependencies that:

- Are unmaintained
- Introduce vulnerabilities
- Are too heavy for the use case

