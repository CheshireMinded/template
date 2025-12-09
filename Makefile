.PHONY: install install-apps lint test build dev-backend dev-react dev-vue dev-static pre-commit security-scan security-audit deploy-local-bare-metal deploy-local-docker deploy-local-static post-deploy-checks post-deploy-checks-prod

install:
	npm install
	npm run install:apps

install-apps:
	npm run install:apps

lint:
	bash ./scripts/lint-all.sh

test:
	bash ./scripts/test-all.sh

build:
	bash ./scripts/build-all.sh

dev-backend:
	cd apps/backend-api && npm run dev

dev-react:
	cd apps/frontend-react && npm run dev

dev-vue:
	cd apps/frontend-vue && npm run dev

dev-static:
	cd apps/static-landing && npm run dev

pre-commit:
	bash ./scripts/pre-commit-checks.sh

security-scan:
	bash ./scripts/security/check-secrets.sh
	bash ./scripts/security/scan-deps.sh

security-audit:
	bash ./scripts/security/audit-docs.sh
	bash ./scripts/security/scan-deps.sh

deploy-local-bare-metal:
	ansible-playbook -i infra/ansible/inventory.local.ini infra/ansible/site.local.yml \
	  -e "deployment_mode=bare_metal environment=dev"

deploy-local-docker:
	ansible-playbook -i infra/ansible/inventory.local.ini infra/ansible/site.local.yml \
	  -e "deployment_mode=docker_compose environment=dev"

deploy-local-static:
	ansible-playbook -i infra/ansible/inventory.local.ini infra/ansible/site.local.yml \
	  -e "deployment_mode=static_only environment=prod"

post-deploy-checks:
	ENVIRONMENT=staging BASE_URL=http://localhost \
	  scripts/post-deploy/run-post-deploy-checks.sh

post-deploy-checks-prod:
	ENVIRONMENT=prod BASE_URL=https://your-prod-domain.example.com \
	  scripts/post-deploy/run-post-deploy-checks.sh

