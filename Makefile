.PHONY: install install-apps lint test build dev-backend dev-react dev-vue dev-static pre-commit

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

