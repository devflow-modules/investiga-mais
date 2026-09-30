# INVESTIGA+ — CLAIM REGISTRY

**Commit audited:** `d07940cb9331111b30b349efd4bf27c8c27e8100`  
**Date:** 2026-09-30  

Classification:

- **SAFE** — accurate and defensible as written  
- **BOUNDED** — accurate only with scope limits stated  
- **UNSUPPORTED** — do not use

Columns ATS / Recruiter / Interview / LinkedIn: **Y** = ok to use in that channel when classified SAFE/BOUNDED; **N** = avoid.

| Claim | Evidence | Confidence | Class | ATS | Recruiter | Interview | LinkedIn |
|-------|----------|------------|-------|-----|-----------|-----------|----------|
| Built full-stack CNPJ consultation SaaS (Next.js + Express + Prisma) | monorepo apps, routes, schema | STRONG | SAFE | Y | Y | Y | Y |
| Creator/owner of Investiga+ product loop (landing → auth → consulta → history) | git author majority; product modules | STRONG | SAFE | Y | Y | Y | Y |
| JWT auth via HttpOnly cookies (Secure in production, SameSite=Lax, 1d expiry) | `authController`, `authService` | STRONG | SAFE | Y | Y | Y | Y |
| Backend middleware validates JWT from cookies on protected APIs | `middleware/auth.js` | STRONG | SAFE | Y | Y | Y | Y |
| Role-based access (cliente vs admin) on API routes | `somenteRoles`, routes | STRONG | SAFE | Y | Y | Y | Y |
| JWT signing fails closed without secure `JWT_SECRET` | `securityEnv.js`, tests | STRONG | SAFE | Y | bounded | Y | Y |
| Consultation history scoped by authenticated user CPF | `listarConsultasService` where `{ cpf }` | STRONG | BOUNDED | Y | Y | Y | Y |
| Persistent CNPJ cache in DB keyed by CNPJ | `DadosCNPJ` model + service | STRONG | SAFE | Y | Y | Y | Y |
| Cache-first lookup; on miss calls ReceitaWS with timeout/retry | `consultaService` | STRONG | SAFE | Y | Y | Y | Y |
| Per-CNPJ single-flight to prevent cache stampede under concurrency | `inflightByCnpj` + C20 integration test | STRONG | SAFE | Y | Y | Y | Y |
| Unique constraint + P2002 handling on cache writes | PK + `isUniqueCnpjConflict` | STRONG | SAFE | Y | Y | Y | Y |
| Malformed cached payloads invalidated and refetched | service + integration test | STRONG | SAFE | Y | Y | Y | Y |
| Maps ReceitaWS failure modes to explicit HTTP errors (404/429/502/500) | service error branches + mocked tests | STRONG | SAFE | Y | Y | Y | Y |
| Authenticated Kirvano purchase webhook via shared secret header | `kirvanoWebhookAuth` | STRONG | SAFE | Y | Y | Y | Y |
| Webhook rejects unauthenticated/wrong-secret requests (fail-closed) | middleware + tests | STRONG | SAFE | Y | Y | Y | Y |
| SALE_APPROVED provisions user account (generated password + optional Resend email) | `webhookService` | STRONG | SAFE | Y | Y | Y | Y |
| Duplicate purchase webhooks do not create duplicate users (email/cpf uniqueness) | unique + P2002 + concurrency tests | STRONG | BOUNDED | Y | Y | Y | Y |
| Concurrent identical webhooks remain duplicate-safe (tested locally on SQLite) | `webhookConcurrency.integration.test.js` | STRONG | BOUNDED | Y | Y | Y | Y |
| CI runs backend Jest twice on disposable SQLite + frontend tests/build | `ci.yml` + green run on tip | STRONG | SAFE | Y | Y | Y | Y |
| Security workflows: prod dependency audit, secret scan, CodeQL | `security.yml` + Actions history | STRONG | SAFE | Y | Y | Y | Y |
| Deploy oriented around PM2 on a VPS (`ecosystem.config.js`, deploy scripts) | scripts/ecosystem | STRONG | BOUNDED | Y | Y | Y | N* |
| Live product referenced at investigamais.com | README | PARTIAL | BOUNDED | Y | Y | Y | Y |
| Profile completion sets one-time `bonusConcedidoAt` flag | `perfilService` | STRONG | BOUNDED | Y | N | Y | N |
| “Consulta inteligente com cache e fallback” | “fallback” ≠ secondary provider | WEAK | UNSUPPORTED as-is | N | N | N | N |
| “Gestão de bônus” / credit system / ledger | only timestamp flag | WEAK | UNSUPPORTED | N | N | N | N |
| Exactly-once Kirvano processing / event-id idempotency | no event store | NOT_FOUND | UNSUPPORTED | N | N | N | N |
| Official Kirvano HMAC verification | shared secret only | NOT_FOUND | UNSUPPORTED | N | N | N | N |
| High-availability multi-instance cache coordination | process-local single-flight | PARTIAL limit | UNSUPPORTED if absolute | N | N | N | N |
| Cache TTL / stale-while-revalidate | no TTL | NOT_FOUND | UNSUPPORTED | N | N | N | N |
| Docker-based delivery (as repo-proven) | no Dockerfile | NOT_FOUND | UNSUPPORTED | N | N | N | N |
| Railway deployment (as repo-proven) | no Railway config | NOT_FOUND | UNSUPPORTED | N | N | N | N |
| Production scale / QPS / revenue / SLA / user counts | none | NOT_FOUND | UNSUPPORTED | N | N | N | N |
| Fault-tolerant / enterprise-grade / highly scalable architecture | marketing absolutes | WEAK | UNSUPPORTED | N | N | N | N |
| CSRF-protected cookie session architecture | SameSite only | WEAK | UNSUPPORTED | N | N | N | N |
| Refresh-token session architecture | absent | NOT_FOUND | UNSUPPORTED | N | N | N | N |
| Prisma transactional bonus/credit consistency | no `$transaction` | NOT_FOUND | UNSUPPORTED | N | N | N | N |

\*LinkedIn: prefer product/engineering wording over host path details.

## Interview talking points (SAFE)

1. Why HttpOnly cookies instead of `localStorage` for this SaaS browser app.  
2. Why cache-first + single-flight before ReceitaWS under concurrent identical CNPJs.  
3. Why shared-secret webhook auth is fail-closed and what is *not* claimed (HMAC/event-id).  
4. How unique constraints turned race 500s into duplicate-safe 200 semantics.  
5. What CI proves vs mocks (local SQLite + mocked provider HTTP).

## Explicit non-claims

Do not invent metrics, SLA, conversion, cost savings, or “exactly-once”.  
Do not upgrade PARTIAL mechanisms into absolute distributed guarantees.
