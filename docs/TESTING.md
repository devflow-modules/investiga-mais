# Investiga+ Testing Strategy

This document describes the testing strategy for Investiga+ as a production-oriented SaaS case.

The goal of the test suite is to protect the most important backend behaviors: authentication, protected access, validation, CNPJ lookup, cache/history behavior and error handling.

## Testing Goals

- Validate authentication behavior.
- Validate protected route access.
- Validate CNPJ lookup behavior.
- Validate request input rules.
- Validate cache and history boundaries.
- Validate external provider failure handling.
- Validate standardized error responses.
- Keep services and controllers testable through mocks.

## Test Categories

### Unit Tests

Unit tests should cover isolated business logic.

Examples:

- CPF/CNPJ/email/phone validators where applicable
- Utility functions
- Service-level decisions
- Error formatting helpers

### Controller Tests

Controller tests should validate HTTP-level behavior without relying on real external services.

Examples:

- Successful request responses
- Missing required fields
- Invalid input
- Unauthorized access
- Expected status codes
- Standardized response shape

### Middleware Tests

Middleware tests should validate authentication and request protection.

Examples:

- Missing JWT
- Invalid JWT
- Expired JWT
- Valid JWT attaches user context
- Protected routes block unauthenticated access

### Service Tests

Service tests should validate business flow behavior.

Examples:

- Cache hit returns local result
- Cache miss calls external provider
- Successful external response is normalized
- Consultation history is persisted
- External provider failures are handled safely

### Integration Boundary Tests

Integration boundary tests should mock external systems while validating how the application reacts to them.

Examples:

- External CNPJ API returns valid data
- External CNPJ API returns not found
- External CNPJ API times out
- External CNPJ API returns malformed payload

## Mocking Strategy

External dependencies should be mocked in automated tests.

Common mocks:

- Prisma client
- External CNPJ provider
- Authentication helpers
- Email or webhook services when applicable
- Axios/fetch requests

This keeps tests deterministic and avoids relying on live third-party services.

## Critical Flows to Protect

```text
Login
  ↓
JWT cookie creation
  ↓
Protected dashboard/API access
  ↓
CNPJ consultation
  ↓
Cache lookup or external API call
  ↓
History persistence
  ↓
Safe response to frontend
```

## Error Scenarios

The test suite should protect common failure paths:

- Invalid credentials
- Missing token
- Invalid token
- Invalid CNPJ
- External API unavailable
- Database failure
- Cache failure
- Unexpected internal error

## Recommended Commands

Depending on repository setup:

```bash
npm test
npm run test:coverage
```

or:

```bash
pnpm test
pnpm test:coverage
```

## Recruiter Notes

The test strategy demonstrates:

- Awareness of SaaS-critical flows
- Mocked integration boundaries
- Controller and middleware reliability
- Validation and error handling discipline
- Backend maintainability

For a technical review, prioritize tests around authentication, protected access, CNPJ lookup, external provider mocks and standardized error responses.
