# Investiga+ 🚀

**Investiga+** is a SaaS platform for **CNPJ intelligence and company data analysis**, created by [Gustavo Marques](https://www.linkedin.com/in/gustavo-marques-00/) under the TraffikPro brand.

🌍 **Live:** [https://investigamais.com](https://investigamais.com)

---

## Overview

Investiga+ was built as a production-oriented SaaS case study focused on secure authentication, company data lookup, user history, API integration, caching and a modern responsive dashboard.

The project demonstrates end-to-end product engineering: architecture, backend, frontend, database modeling, automated tests, deployment and maintainability.

---

## Core Features

- Secure authentication with **JWT + HttpOnly Cookies**
- CNPJ lookup with external API integration
- Local cache strategy for repeated searches
- Search history by user
- User profile and usage management
- Responsive dashboard UI
- Modular backend architecture
- Automated tests with Jest
- Docker and CI/CD-ready structure

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

## Architecture

```text
Next.js frontend
  └── Dashboard
  └── Auth flows
  └── History and profile pages

Node.js + Express backend
  └── Auth module
  └── CNPJ consultation module
  └── History module
  └── Validation and error handling

Database
  └── Prisma ORM
  └── PostgreSQL / SQLite
  └── User, history and cached company records
```

---

## Security

- JWT authentication using HttpOnly Cookies
- Protected routes through backend middleware
- User-scoped records
- Centralized error handling
- Environment-based configuration

---

## Testing

The project includes automated tests focused on backend reliability, controller behavior, validation scenarios and integration boundaries.

---

## Why this project matters

Investiga+ is a complete SaaS product case that shows practical experience with product thinking, fullstack architecture, API integration, authentication, database modeling, testing and deployment.

---

## Author

Created and developed by **Gustavo Marques de Lima**.

- LinkedIn: [https://www.linkedin.com/in/gustavo-marques-00](https://www.linkedin.com/in/gustavo-marques-00)
- GitHub: [https://github.com/gustavomarques00](https://github.com/gustavomarques00)
- Portfolio: [https://devflowlabs.com.br](https://devflowlabs.com.br)
- Email: [gustavomarquesmm@gmail.com](mailto:gustavomarquesmm@gmail.com)
