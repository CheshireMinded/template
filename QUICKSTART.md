# Quick Start Guide

This guide will help you get a working web application running quickly using Ansible.

## Prerequisites

- Python 3.9+ installed
- Ansible installed (`pip install ansible` or via package manager)
- Git installed
- For Docker Compose mode: Docker not required (Ansible will install it)
- For bare metal mode: Ubuntu/Debian-based system recommended

## Option 1: Docker Compose Deployment (Recommended for Quick Start)

### Step 1: Clone the Repository

```bash
git clone https://github.com/CheshireMinded/template.git
cd template
```

### Step 2: Create Environment File

Create the required environment file for the backend:

```bash
mkdir -p env
cat > env/.env.production << EOF
NODE_ENV=production
PORT=3000
CORS_ORIGIN=http://localhost
APP_NAME=backend-api
APP_VERSION=1.0.0
LOG_LEVEL=info
AUTH_JWT_SECRET=$(openssl rand -hex 32)
DB_TYPE=sqlite
DB_PATH=/app/data/prod.db
RATE_LIMIT_ENABLED=true
RATE_LIMIT_MAX_REQUESTS=60
RATE_LIMIT_WINDOW_MS=60000
EOF
```

### Step 3: Update Docker Compose for Production

The production docker-compose file needs to include Postgres. Update `infra/docker/docker-compose.prod.yml`:

```yaml
version: "3.9"

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-web_platform_user}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-change_me_in_production}
      POSTGRES_DB: ${POSTGRES_DB:-web_platform_prod}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-web_platform_user}"]
      interval: 5s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ../../apps/backend-api
      dockerfile: Dockerfile
    env_file:
      - ../../env/.env.production
    environment:
      DATABASE_URL: postgresql://${POSTGRES_USER:-web_platform_user}:${POSTGRES_PASSWORD:-change_me_in_production}@postgres:5432/${POSTGRES_DB:-web_platform_prod}
      DB_TYPE: postgres
    ports:
      - "3000:3000"
    restart: unless-stopped
    depends_on:
      postgres:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000/healthz"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    build:
      context: ../../apps/frontend-react
      dockerfile: ../../infra/docker/Dockerfile.frontend
    ports:
      - "80:80"
    restart: unless-stopped
    depends_on:
      - backend

volumes:
  postgres_data:
```

### Step 4: Run Ansible

```bash
cd infra/ansible
ansible-playbook -i inventory.local.ini site.local.yml \
  -e "deployment_mode=docker_compose environment=dev"
```

### Step 5: Access the Application

- Frontend: http://localhost
- Backend API: http://localhost:3000
- Health check: http://localhost:3000/healthz

## Option 2: Bare Metal Deployment

### Step 1: Clone and Setup

```bash
git clone https://github.com/CheshireMinded/template.git
cd template
```

### Step 2: Create Environment File

```bash
mkdir -p apps/backend-api/.env
cat > apps/backend-api/.env << EOF
NODE_ENV=production
PORT=3000
CORS_ORIGIN=http://localhost
APP_NAME=backend-api
APP_VERSION=1.0.0
LOG_LEVEL=info
AUTH_JWT_SECRET=$(openssl rand -hex 32)
DB_TYPE=sqlite
DB_PATH=./data/prod.db
RATE_LIMIT_ENABLED=true
RATE_LIMIT_MAX_REQUESTS=60
RATE_LIMIT_WINDOW_MS=60000
EOF
```

### Step 3: Update Ansible Role

The bare_metal role needs to:
1. Build the backend before starting
2. Load environment variables
3. Run database migrations

You'll need to update `infra/ansible/roles/bare_metal/tasks/main.yml` to include:

```yaml
- name: Build backend
  ansible.builtin.shell: |
    npm run build
  args:
    chdir: "{{ app_root }}/apps/backend-api"
  when: deploy_backend | default(true)
  tags: [backend, bare_metal]

- name: Run database migrations
  ansible.builtin.shell: |
    npm run migrate
  args:
    chdir: "{{ app_root }}/apps/backend-api"
    environment:
      NODE_ENV: "{{ environment }}"
  when: deploy_backend | default(true) and run_db_migrations | default(true)
  tags: [backend, bare_metal]

- name: Start backend via pm2
  ansible.builtin.shell: |
    pm2 start dist/index.js --name backend-api || pm2 restart backend-api
  args:
    chdir: "{{ app_root }}/apps/backend-api"
  when: deploy_backend | default(true)
  tags: [backend, bare_metal]
```

### Step 4: Run Ansible

```bash
cd infra/ansible
ansible-playbook -i inventory.local.ini site.local.yml \
  -e "deployment_mode=bare_metal environment=dev run_db_migrations=true"
```

## What's Missing from the Current Ansible Setup

The current Ansible playbooks are **templates** and require these additions to work:

1. **Environment Variables**: No `.env` files are created automatically
2. **Database Setup**: Docker Compose prod file doesn't include Postgres
3. **Database Migrations**: Not run by default (`run_db_migrations: false`)
4. **Build Step**: Bare metal mode doesn't build TypeScript before running
5. **Environment Loading**: Bare metal mode doesn't load `.env` files

## Recommended Improvements

To make Ansible deployment work out-of-the-box, consider:

1. **Add environment file generation** in the `common` role
2. **Include Postgres in docker-compose.prod.yml**
3. **Add build step** to bare_metal role
4. **Enable migrations by default** or add a migration step
5. **Add environment variable loading** for bare metal deployments

## Current Status (After Improvements)

**Answer: Yes, with the recent improvements, a user can now get a working application by running Ansible.**

The playbooks now:
- Automatically generate environment files with secure JWT secrets
- Include Postgres in docker-compose.prod.yml
- Run database migrations by default
- Build TypeScript in bare metal mode
- Set up all required dependencies

The playbooks will:
- Install dependencies (Docker, Node, etc.)
- Clone/build the code
- Start services

But they will fail because:
- Missing environment variables (JWT secret, database URL, etc.)
- Missing database (Postgres not in prod docker-compose)
- Migrations not run
- TypeScript not built in bare metal mode

## Workaround

To get it working, users need to:
1. Manually create environment files
2. Update docker-compose.prod.yml to include Postgres
3. Enable migrations or run them manually
4. For bare metal: build the backend first

See the steps above for the complete setup process.

