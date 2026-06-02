# Investiga+

**Investiga+** is a production-oriented SaaS platform for **CNPJ intelligence and company data analysis**, created by [Gustavo Marques](https://www.linkedin.com/in/gustavo-marques-00/) as part of the **DevFlow Labs** product ecosystem.

**Live:** https://investigamais.com  
**Portfolio ecosystem:** https://github.com/devflow-modules/devflow  
**Recruiter Guide:** https://github.com/devflow-modules/devflow/blob/main/docs/RECRUITER-GUIDE.md

---

## Recruiter Summary

Investiga+ demonstrates end-to-end SaaS product engineering: frontend, backend, database modeling, authentication, API integration, caching, user history, automated tests, deployment-oriented structure and product documentation.

It is one of the strongest projects to review for evaluating fullstack delivery, secure authentication, API integration, backend modularity and product thinking.

---

## Product Overview

Investiga+ helps users consult and analyze Brazilian company data through a SaaS workflow built around CNPJ lookup, cached results, authenticated usage and historical records.

The project was built to show how public/company data can become a structured product experience with secure access, a responsive dashboard and maintainable backend architecture.

---

## Business Problem

Company data verification is often fragmented across public websites, manual searches, spreadsheets and disconnected tools.

This creates operational friction for workflows such as:

- Sales qualification
- Vendor/customer onboarding
- Company validation
- Internal business intelligence
- Repeated CNPJ checks
- Historical lookup tracking

---

## Solution

Investiga+ centralizes the CNPJ lookup workflow into a SaaS product with authentication, history, cache and dashboard UX.

The platform reduces repeated manual checks by storing previous lookups and associating consultation history with authenticated users.

---

## Core Features

- Secure authentication with **JWT + HttpOnly Cookies**
- CNPJ lookup with external API integration
- Local cache strategy for repeated searches
- Search history by authenticated user
- User profile and usage management
- Responsive dashboard UI
- Modular backend architecture
- Centralized validation and error handling
- Automated tests with Jest
- Docker and CI/CD-ready structure

---

## Business Impact

Investiga+ turns company lookup into a repeatable product workflow.

Instead of manually checking CNPJ data across external sources every time, users can authenticate, run consultations, reuse cached information and keep a history of previous searches.

This type of product can support real business use cases such as sales intelligence, onboarding validation, compliance pre-checks and internal data enrichment.

---

## Tech Stack

### Frontend

- Next.js
- React.js
- Chakra UI
- Framer Motion

### Backend

- Node.js
- Express.js
- Prisma ORM
- REST APIs
- JWT authentication

### Database

- PostgreSQL
- SQLite for local development

### Quality & DevOps

- Jest
- Docker
- GitHub Actions
- Railway

---

## Architecture Overview

```text
Next.js frontend
  ├── Landing and authentication flows
  ├── Dashboard UI
  ├── CNPJ consultation experience
  ├── History and profile pages
  └── Protected client routes

Node.js + Express backend
  ├── Auth module
  ├── CNPJ consultation module
  ├── History module
  ├── Validation layer
  ├── Error handling layer
  └── Protected API routes

Database layer
  ├── Prisma ORM
  ├── PostgreSQL / SQLite
  ├── Users
  ├── Search history
  └── Cached company records

External integrations
  ├── ReceitaWS / company data provider
  ├── Payment/webhook context when applicable
  └── Email or notification flows where applicable
```

Detailed documentation:

- [Architecture](docs/ARCHITECTURE.md)
- [Security](docs/SECURITY.md)
- [Testing Strategy](docs/TESTING.md)

---

## Security Highlights

- JWT authentication using **HttpOnly Cookies**
- Protected backend routes through middleware
- User-scoped records and history
- Environment-based configuration
- Centralized error handling
- Validation before business logic execution
- No credentials or secrets should be committed to the repository

See [docs/SECURITY.md](docs/SECURITY.md) for the security model.

---

## Testing Strategy

The project includes automated tests focused on backend reliability, controller behavior, validation scenarios, authentication boundaries, service behavior and integration boundaries.

The testing goal is to protect the main SaaS flows:

- Authentication behavior
- Protected route access
- CNPJ lookup behavior
- Cache and history behavior
- Validation errors
- Internal error responses
- External provider boundaries through mocks

See [docs/TESTING.md](docs/TESTING.md) for details.

---

## Screenshots

Screenshots should be added under `docs/assets/` as the portfolio is polished.

Recommended screenshots:

- Login / authentication flow
- Dashboard overview
- CNPJ lookup result
- Search history
- User profile or usage screen

---

## Recruiter Notes

This project is most relevant for evaluating:

- Fullstack SaaS delivery
- Secure authentication with JWT and HttpOnly Cookies
- REST API design with Node.js and Express
- Prisma/PostgreSQL data modeling
- External API integration
- Cache strategy and authenticated history
- Testing discipline with Jest
- Product-oriented documentation

Suggested review order:

1. Read this README.
2. Review the architecture documentation.
3. Review the security model.
4. Review the testing strategy.
5. Check the live product link.

---

## Why this project matters

Investiga+ is a complete SaaS product case that shows practical experience with product thinking, fullstack architecture, API integration, authentication, database modeling, testing and deployment-oriented development.

It demonstrates the ability to turn a real operational problem into a structured product with frontend, backend, persistence, integrations and documentation.

---

## Author

Created and developed by **Gustavo Marques de Lima** as part of the **DevFlow Labs** product ecosystem.

- DevFlow Labs GitHub: https://github.com/devflow-modules
- LinkedIn: https://www.linkedin.com/in/gustavo-marques-00
- GitHub: https://github.com/gustavomarques00
- Portfolio: https://devflowlabs.com.br
- Email: gustavomarquesmm@gmail.com
