# Investiga+ Architecture

Investiga+ is a production-oriented SaaS project for CNPJ intelligence and company data analysis.

The architecture is organized around a clear separation between frontend experience, backend business logic, persistence and external integrations.

## High-Level Architecture

```text
User
  ↓
Next.js Frontend
  ↓
Node.js + Express API
  ↓
Service / Controller Layer
  ↓
Prisma ORM
  ↓
PostgreSQL / SQLite

External Provider
  ↔ CNPJ data API integration
```

## Frontend Layer

The frontend is responsible for user-facing product flows:

- Landing and onboarding experience
- Login and authentication screens
- Dashboard interface
- CNPJ consultation form
- Search result visualization
- Consultation history
- User profile and usage views

Main technologies:

- Next.js
- React
- Chakra UI
- Framer Motion

## Backend Layer

The backend is structured around modular API responsibilities.

Core responsibilities:

- Authentication and session handling
- Protected routes
- CNPJ lookup orchestration
- Cache lookup before external calls
- Search history persistence
- User profile and usage-related operations
- Validation and centralized error handling

Main technologies:

- Node.js
- Express.js
- Prisma ORM
- JWT authentication

## Data Layer

The persistence layer is handled through Prisma ORM.

The project supports:

- PostgreSQL for production-oriented deployment
- SQLite for local development

Main data concepts:

- Users
- Auth/session-related records where applicable
- CNPJ consultation history
- Cached company records
- User-scoped records

## CNPJ Consultation Flow

```text
Authenticated user submits CNPJ
  ↓
Backend validates request
  ↓
Backend checks local cache
  ↓
If cache hit:
    return stored company data
  ↓
If cache miss:
    call external provider
    normalize response
    persist cache record
    persist user history
    return result
```

## Authentication Flow

```text
User login
  ↓
Backend validates credentials
  ↓
JWT is generated
  ↓
Token is stored in HttpOnly Cookie
  ↓
Protected API routes validate cookie token through middleware
  ↓
Authenticated user context is used for scoped operations
```

## Module Boundaries

The project is intended to keep responsibilities separated:

- **Routes:** HTTP endpoint definitions
- **Controllers:** request/response orchestration
- **Services:** business logic and integration handling
- **Middlewares:** authentication, validation, rate limits and error handling
- **Prisma:** database access and persistence
- **Tests:** controller, service, validation and integration boundary coverage

## Design Principles

- Keep authentication secure by avoiding token exposure through client-side storage.
- Keep user data scoped by authenticated user context.
- Cache repeated lookups to reduce unnecessary external API calls.
- Keep business logic outside route definitions.
- Keep external API behavior mockable in tests.
- Keep environment-specific configuration outside source code.

## Recruiter Notes

This architecture demonstrates:

- Fullstack SaaS thinking
- Secure browser-based authentication
- API integration and caching
- Database modeling through Prisma
- Backend modularity
- Testable service boundaries
- Product-oriented engineering decisions
