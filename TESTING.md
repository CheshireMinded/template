# Testing Documentation

This document provides a comprehensive overview of the testing infrastructure and coverage in this repository.

## Test Coverage Summary

### Backend Tests

**Unit Tests (9 test files)**
- `rateLimiter.test.ts` - Rate limiting middleware with window expiration, IP-based tracking
- `requestLogger.test.ts` - Request logging with duration calculation
- `requestId.test.ts` - Request ID attachment and header handling
- `todoController.test.ts` - Todo controller business logic
- `exampleController.test.ts` - Example controller patterns
- `exampleService.test.ts` - Service layer patterns

**Integration Tests (2 test files)**
- `auth.test.ts` - Complete authentication flow testing:
  - User registration with validation
  - User login with credential verification
  - Protected route access control
  - Token validation and expiration
  - Duplicate username prevention
  - Invalid credential handling
- `todos.test.ts` - Complete todo CRUD operations with authentication:
  - Create todos (with auth)
  - Read todos (user-scoped)
  - Update todos (user-scoped)
  - Delete todos (user-scoped)
  - Error handling (404, 400, 401)

### Frontend Tests

**React Tests (3 test files)**
- `TodoList.test.tsx` - Basic component rendering
- `TodoList.msw.test.tsx` - CRUD operations with MSW mocking
- `TodoList.optimistic.test.tsx` - Optimistic UI rollback scenarios

**Vue Tests (1 test file)**
- `TodoList.test.ts` - Component rendering and interactions

### End-to-End Tests (4 test files)

**Authentication Flow (`auth-flow.spec.ts`)**
- User registration
- User login
- Invalid credentials handling
- Duplicate username prevention
- Login state persistence

**Todo Flow (`todo-flow.spec.ts`)**
- Display todos after loading
- Create new todos
- Toggle completion
- Edit todos
- Delete todos
- Empty title validation
- API failure error handling
- Optimistic update rollback (create, delete)

**Concurrent Operations (`concurrent-operations.spec.ts`)**
- Multiple rapid todo creations
- Concurrent updates
- Edit cancellation
- Network latency handling

## Test Statistics

- **Backend Unit Tests**: 9 test files
- **Backend Integration Tests**: 2 test files covering auth and todos
- **Frontend Unit Tests**: 4 test files (React + Vue)
- **E2E Tests**: 4 test files covering critical user flows
- **Total Test Files**: 19+

## Coverage Thresholds

### Backend (Jest)
- Global minimum: 75% branches, 80% functions, 80% lines, 80% statements
- Controllers: 90% coverage required
- Routes: 90% coverage required
- Middleware: 85% coverage required

### Frontend (Vitest)
- Lines: 80%
- Functions: 80%
- Branches: 75%
- Statements: 80%

## Test Infrastructure

### Mocking
- **MSW (Mock Service Worker)**: Used in frontend tests for API mocking
- **Jest Mocks**: Used in backend unit tests
- **Supertest**: Used in backend integration tests

### Test Data
- In-memory SQLite database for backend tests
- MSW handlers with reset functionality
- Isolated test users per test run

## Running Tests

```bash
# Run all tests
make test

# Backend tests only
cd apps/backend-api && npm test

# Frontend tests only
cd apps/frontend-react && npm test
cd apps/frontend-vue && npm test

# E2E tests
npm run e2e

# With coverage
cd apps/backend-api && npm run test:coverage
```

## CI Integration

All tests run automatically in CI:
- Unit and integration tests on every PR
- E2E tests on main branch and PRs
- Contract tests (Dredd) for API specification validation
- Performance tests on scheduled basis

## What's Tested

### Authentication
- [x] User registration
- [x] User login
- [x] Token validation
- [x] Protected route access
- [x] Invalid credentials
- [x] Duplicate usernames
- [x] Token expiration handling

### Todo Operations
- [x] Create todos
- [x] Read todos (user-scoped)
- [x] Update todos
- [x] Delete todos
- [x] Toggle completion
- [x] Optimistic UI updates
- [x] Rollback on errors
- [x] Input validation

### Error Handling
- [x] 400 Bad Request
- [x] 401 Unauthorized
- [x] 404 Not Found
- [x] 409 Conflict
- [x] 500 Internal Server Error
- [x] Network failures
- [x] API timeouts

### Edge Cases
- [x] Concurrent operations
- [x] Rapid successive requests
- [x] Network latency
- [x] Empty inputs
- [x] Invalid data types
- [x] Missing authentication

## Future Test Improvements

While the current test suite is comprehensive, potential enhancements include:
- More negative test cases for security boundaries
- Performance/load testing automation
- Accessibility testing in E2E suite
- Visual regression testing
- Contract testing expansion

