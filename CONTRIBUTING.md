# Contributing Guide

## Development Workflow

1. Create a feature branch from `develop` (or `main` if no `develop` branch)
2. Make your changes
3. Run linting and tests locally: `make lint && make test`
4. Commit with clear messages
5. Push and create a Pull Request
6. Ensure CI passes before requesting review

## Code Standards

- Follow ESLint and Prettier configurations in `config/`
- Write tests for new features
- Update documentation as needed
- Follow the existing code style

## Pull Request Process

- Use the PR template (`.github/pull_request_template.md`)
- Ensure all CI checks pass
- Get at least one approval before merging
- Squash commits when merging (unless preserving history is important)

## Commit Messages

Use conventional commits format:

```
feat: add user authentication
fix: resolve CORS issue in API
docs: update architecture diagram
chore: update dependencies
```

## Questions?

Open an issue or contact the maintainers listed in `CODEOWNERS`.

