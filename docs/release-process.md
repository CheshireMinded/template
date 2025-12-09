# Release Process (Template)

This describes how teams using this template can manage releases.

---

## Versioning

Use **Semantic Versioning**:

- `MAJOR.MINOR.PATCH`

Examples:

- `1.0.0` - initial stable release  
- `1.1.0` - new feature  
- `1.1.1` - bug fix  

---

## Release Steps

1. Ensure all tests pass  
2. Update `CHANGELOG.md`  
3. Tag version:

```bash
git tag -a v1.2.0 -m "Release 1.2.0"
git push origin v1.2.0
```

4. CI builds artifacts (optional)  
5. Automated deployment (if configured)

---

## Rollback Procedure

1. Identify the last known good version  
2. Deploy that tag  
3. Create postmortem documenting root cause  

---

## Release Cadence

Recommended:

- Patch releases: weekly  
- Minor releases: bi-weekly or monthly  
- Major releases: quarterly  

This cadence ensures predictable, stable evolution.

