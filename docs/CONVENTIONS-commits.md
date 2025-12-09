# Commit Message Conventions

We use a lightweight convention inspired by Conventional Commits.

## Format

```
<type>: <short summary>

[optional body]

[optional footer]
```

## Types

- `feat:` - new feature
- `fix:` - bug fix
- `chore:` - tooling, build, deps, no production behavior change
- `docs:` - documentation only
- `refactor:` - internal refactor, no behavior change
- `test:` - tests only
- `perf:` - performance improvements
- `ci:` - CI/CD pipeline changes
- `infra:` - infrastructure / Terraform / Kubernetes changes
- `revert:` - reverts previous commit

## Examples

```
feat: add basic user settings page
fix: handle null values in request parser
infra: add staging route53 records
docs: update golden path for staging deploy
```

Keep subjects under ~72 chars and write in the imperative ("add", "fix", "update").

