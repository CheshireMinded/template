# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-01-XX

### Added
- **Authentication & Authorization**
  - JWT-based authentication with user registration and login endpoints
  - Password hashing with bcrypt (10 rounds)
  - User-scoped data access (todos are isolated per user)
  - Protected API routes with middleware-based authorization
  - Frontend auth flows for React and Vue with token management
  - Login and registration UI components for both frontends

- **Database & Persistence**
  - Database migrations with Knex (SQLite for dev/test, Postgres for prod)
  - User and Todo models with proper relationships
  - Connection pooling and transaction support
  - Automatic migrations on application startup
  - Support for both SQLite (development) and PostgreSQL (production)
  - User repository with password verification
  - Todo repository with user-scoped queries

- **Testing & Quality Assurance**
  - Unit tests for all middleware (rate limiter, request logger, request ID)
  - Comprehensive integration tests for auth endpoints (register, login, protected routes)
  - Integration tests for todo CRUD operations with authentication
  - E2E tests for authentication flows (registration, login, persistence, duplicate prevention)
  - E2E tests for todo operations (create, read, update, delete, optimistic updates)
  - E2E tests for concurrent operations and error handling
  - MSW (Mock Service Worker) integration for frontend API mocking
  - Optimistic UI rollback test scenarios
  - Test coverage configuration with thresholds (80%+ for critical paths)

- **Observability**
  - Prometheus metrics collection (HTTP request duration, counts, errors)
  - Database metrics (query duration, active connections)
  - Business metrics (todos created, users registered)
  - Metrics middleware integrated into Express app
  - `/metrics` endpoint for Prometheus scraping

- **Caching & Performance**
  - Redis caching layer with connection management
  - Cache middleware with TTL support
  - Cache invalidation utilities
  - Example usage in controllers

- **Message Queues**
  - AWS SQS integration with send/receive/delete operations
  - Worker processing examples
  - Queue message types and payloads
  - Example use cases (email notifications, background jobs)

- **Infrastructure**
  - Postgres service in Docker Compose for local development
  - Helm charts with Postgres StatefulSet and service
  - Ansible role for AWS SSM Parameter Store secrets
  - CI/CD integration for secrets management
  - Performance test automation in CI

### Changed
- Updated backend API to require authentication for all todo endpoints
- Frontend apps now include full authentication flows (not just static text)
- Error handling improved to hide internal details in production
- CORS validation prevents dangerous wildcard + credentials combination
- Environment-specific rate limiting defaults

### Fixed
- Database migrations now work correctly with both SQLite and PostgreSQL
- Foreign key constraints properly handled for different database types
- TypeScript types added for better-sqlite3
- Integration tests updated to use authentication tokens

## [1.0.0] - 2024-XX-XX

### Added
- Initial monorepo structure
- Static landing page app
- React frontend app
- Vue frontend app
- Backend API with Express/TypeScript
- Docker and Docker Compose setup
- Kubernetes manifests
- Terraform infrastructure modules
- CI/CD workflows
- Security documentation and threat model
- Basic health check endpoint
- Example controller and service
