# Contributing Guide

Thank you for your interest in this **template repository**!  
This project is intended as a learning resource and starting point for your own applications.

While contributions that improve the template are welcome, please note:

> **This repository is not an actively supported production project, and maintainers do not provide individual assistance or direct contact.**

---

## Development Workflow

If you wish to contribute improvements to the template:

1. Create a feature branch from `main`
2. Make your changes
3. Run linting and tests locally:  
   ```bash
   make lint && make test
   ```
4. Commit with clear, descriptive messages
5. Push your branch and open a Pull Request (PR)
6. Ensure CI passes before requesting review

## Code Standards

To maintain quality and consistency:

- Follow ESLint, Prettier, and Stylelint configurations in `config/`
- Write tests for any new or changed functionality
- Update documentation when applicable
- Keep code style consistent with existing patterns

## Pull Request Process

All contributors should follow this workflow:

- Use the PR template located in `.github/pull_request_template.md`
- Ensure all CI checks pass (linting, tests, build steps, etc.)
- Keep PRs reasonably small and focused
- When merging, use "Squash and Merge" unless preserving commits is intentional

Pull requests may be reviewed as time permits, but acceptance is not guaranteed.

## Commit Messages

Please follow Conventional Commits:

```
feat: add new landing page layout
fix: correct null handling in controller
docs: update README with setup instructions
chore: bump dependencies
refactor: simplify router logic
test: add coverage for auth middleware
```

This format ensures clear project history and automated tooling compatibility.

## Support & Questions

This template is provided as-is, without active support.

If you have questions about how to use it:

- Please open a GitHub Issue rather than attempting direct contact.
- Issues will be reviewed periodically, but responses are not guaranteed.

## Thank You

Your improvements help keep this template useful and high-quality for others.  
We appreciate contributions of all sizes!
