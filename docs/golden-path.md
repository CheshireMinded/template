# Golden Path: Shipping a Feature End-to-End

This document describes the **ideal workflow** for taking a change from idea → code → production in this platform.

It is written for engineers who want to understand how the whole system fits together: frontend, backend, CI/CD, Kubernetes, and AWS.

---

## 1. Plan & Design

1. **Create an issue**:
   - Use the appropriate issue template (bug/feature/doc).
   - Include acceptance criteria and any edge cases.

2. **Update docs if needed**:
   - If you are changing architecture or tech choices:
     - Add or update an ADR in `docs/adr/`.
   - If you are changing flows or contracts:
     - Update `docs/architecture.md` or `docs/data-flow.md`.

---

## 2. Develop Locally

### 2.1 Setup

```bash
git checkout -b feature/my-new-feature

# install root + apps
make install
# or
npm install
npm run install:apps
```

### 2.2 Backend

```bash
cd apps/backend-api
cp .env.example .env
npm run dev
# API on http://localhost:3000
```

Make backend changes (routes, controllers, etc.):

- Add or update handlers under `src/controllers/` and `src/routes/`.
- Use structured JSON errors via `HttpError` and central `errorHandler`.
- Log important actions via `logger`.

### 2.3 Frontend (React or Vue)

**React:**

```bash
cd apps/frontend-react
npm run dev
# http://localhost:5173
```

**Vue:**

```bash
cd apps/frontend-vue
npm run dev
# http://localhost:5174
```

Point frontend to the local API in your `.env` and config where appropriate (e.g. `http://localhost:3000`).

## 3. Tests & Linting

From the repo root:

```bash
# Lint all apps
make lint

# Run tests (backend + any configured frontend tests)
make test
```

**Backend-specific:**

```bash
cd apps/backend-api
npm test
```

Update or add tests:

- Unit tests in `apps/backend-api/tests/unit`
- Integration tests in `apps/backend-api/tests/integration`

When adding new endpoints, add at least:

- One unit test for core logic
- One integration test for the HTTP route

## 4. Commit & Open PR

Commit your changes:

```bash
git status
git add .
git commit -m "feat: implement my new feature"
```

Push and open a PR:

```bash
git push origin feature/my-new-feature
```

CI will run automatically:

- `ci.yml`:
  - Lint
  - Tests
  - Build

Resolve any CI issues before requesting review.

## 5. Review & Merge

Get at least one approval.

Ensure:

- Docs updated where relevant (`docs/`).
- No secrets committed.
- Security or performance implications considered.

When ready, merge into `develop` for staging:

```
feature/my-new-feature -> develop
```

## 6. Deploy to Staging

Merge into `develop` triggers `deploy-staging.yml`:

1. CI builds the apps (`npm run build`).
2. CI builds Docker images:
   - Frontend → `web-platform-frontend:staging-<SHA>`
   - Backend → `web-platform-backend:staging-<SHA>`
3. CI pushes images to ECR.
4. CI runs Helm:

```bash
helm upgrade --install web-platform \
  infra/helm/web-platform \
  --namespace web-platform-staging \
  --create-namespace \
  -f infra/helm/web-platform/values-staging.yaml \
  --set image.frontend.tag="staging-<SHA>" \
  --set image.backend.tag="staging-<SHA>"
```

5. Kubernetes rolls out new pods in `web-platform-staging` namespace.

## 7. Validate in Staging

Open staging URLs:

- React app: `https://staging.app.example.com`
- API: `https://staging.api.example.com/healthz`

Run smoke tests:

- Verify login / main flows.
- Check logs for errors (if you have log aggregation).
- Confirm no obvious performance or UX regressions.

Update the PR / issue with staging validation notes.

**If something is wrong:**

- Fix in code → push → new CI run → new staging deploy.

## 8. Promote to Production

Once staging is validated:

1. Create a tag for the current `main` (or the commit you want to release):

```bash
git checkout main
git merge develop   # or cherry-pick if you use a different release strategy
git tag v1.2.3
git push origin main --tags
```

2. Pushing `v1.2.3` triggers `deploy-prod.yml`:

   - CI builds the apps and Docker images.
   - Tags images as:
     - `web-platform-frontend:v1.2.3` and `:latest`
     - `web-platform-backend:v1.2.3` and `:latest`
   - Pushes images to ECR.
   - Runs Helm with version tag:

```bash
helm upgrade --install web-platform \
  infra/helm/web-platform \
  --namespace web-platform \
  -f infra/helm/web-platform/values-prod.yaml \
  --set image.frontend.tag="v1.2.3" \
  --set image.backend.tag="v1.2.3"
```

3. K8s updates the `web-platform` namespace with the new version.

## 9. Post-Deploy Checks (Production)

After deployment:

- Hit:
  - `https://app.example.com`
  - `https://api.example.com/healthz`
- Monitor:
  - Error rates (HTTP 5xx/4xx).
  - Latency.
  - Resource usage (CPU/memory).

**If you detect a serious issue:**

- Use `docs/runbooks/rollback.md` to roll back to a previous version.
- File an incident using `docs/security/incident-response-template.md` if it's security-related or large impact.

## 10. Infra Changes (Terraform)

When changing AWS infrastructure (ECR, S3, CloudFront, DNS, TLS):

1. Edit Terraform in `infra/terraform/modules/` or `infra/terraform/envs/*`.
2. Validate with:

```bash
cd infra/terraform/envs/staging
terraform fmt
terraform validate
terraform plan
```

3. Apply to staging, test, then apply to prod.

**Infra changes should be accompanied by:**

- Updates in `docs/architecture.md` or `docs/environments.md` if behavior changes.
- Possibly a new ADR if you changed major design (e.g., moved from CloudFront to ALB).

## 11. Security & Quality Considerations

**Security:**

- Review changes against `docs/security/security-headers.md` and `SECURITY.md`.
- Ensure no secrets are hardcoded in code or configs.
- For new features touching auth, data access, or sensitive flows:
  - Consider threat modeling updates in `THREAT_MODEL.md`.

**Performance & Accessibility:**

- Use `docs/qa/performance-budget.md` as a reference when adding heavy assets or large JS.
- Use `docs/qa/accessibility-checklist.md` when touching UI.

## 12. Summary Cheat Sheet

**Local dev:**
- `make dev-backend`
- `make dev-react`
- `make dev-vue`
- `make dev-static`

**Checks before commit:**
- `make lint`
- `make test`

**Deploy staging:** merge into `develop`, CI does the rest.

**Deploy prod:** tag `vX.Y.Z` on `main`, CI does the rest.

**Infra updates:** Terraform in `infra/terraform/envs/{staging,prod}`.

---

This is the golden path; deviations (hotfixes, emergency patches) should still follow the same general principle: automated, tested, observable.

