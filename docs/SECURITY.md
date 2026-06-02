# Investiga+ Security Model

This document summarizes the main security decisions behind Investiga+.

Investiga+ is a SaaS platform that handles authenticated access, company lookup workflows and user-scoped consultation history. The security model focuses on protecting authentication, keeping records scoped to the correct user and avoiding unsafe handling of credentials or secrets.

## Security Goals

- Protect authenticated user sessions.
- Avoid exposing JWTs to client-side JavaScript storage.
- Keep consultation history scoped to the authenticated user.
- Validate requests before business logic execution.
- Keep secrets and environment-specific values outside source code.
- Avoid leaking internal errors in production responses.

## Authentication

Investiga+ uses JWT-based authentication with HttpOnly Cookies.

```text
User submits login credentials
  ↓
Backend validates credentials
  ↓
Backend signs JWT
  ↓
JWT is sent through an HttpOnly Cookie
  ↓
Protected routes validate token through middleware
```

## Why HttpOnly Cookies

HttpOnly Cookies reduce token exposure to client-side scripts.

This is preferable to storing JWTs in `localStorage` for browser-based SaaS flows because it reduces the risk of token extraction through XSS.

## Protected Routes

Protected backend routes should validate the authenticated user before executing business logic.

Expected behavior:

- Missing token returns unauthorized response.
- Invalid token returns unauthorized response.
- Expired token returns unauthorized response.
- Valid token attaches user context to the request.

## User-Scoped Records

Consultation history and user-related records should always be scoped by authenticated user context.

This prevents one user from accessing another user's history or account-specific records.

## Environment Configuration

Secrets and environment-specific values should be handled through environment variables.

Examples:

- JWT secret
- Database URL
- External API credentials
- Email or webhook credentials when applicable

Rules:

- Do not commit `.env` files.
- Provide safe `.env.example` files only.
- Never commit production secrets.
- Keep local, staging and production values separated.

## Validation

Requests should be validated before reaching business logic.

Validation should cover:

- Required fields
- CNPJ format
- Email format where applicable
- Authentication state
- Input length and shape

## Error Handling

The backend should centralize error handling and avoid leaking sensitive details.

Expected behavior:

- User-facing errors should be clear and safe.
- Internal errors should be logged but not exposed with stack traces in production.
- Validation errors should be explicit.
- Authentication errors should not reveal unnecessary internal details.

## External API Integration

CNPJ lookup depends on an external company data provider.

Security considerations:

- External provider failures should be handled gracefully.
- Provider responses should be normalized before storage or response.
- Repeated searches should use cache where possible.
- API credentials should stay in environment variables.

## Data Protection Notes

Investiga+ deals primarily with company data and authenticated user records.

Important boundaries:

- User account data must remain scoped to the authenticated user.
- Search history must not be exposed across users.
- Cache records should not bypass authorization checks when connected to user history.

## Recruiter Notes

This security model demonstrates practical SaaS security decisions:

- JWT with HttpOnly Cookies
- Middleware-protected backend routes
- User-scoped records
- Environment-based secrets
- Request validation
- Centralized error handling
- Safe external API integration boundaries
