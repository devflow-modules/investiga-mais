# INVESTIGA+ — EVIDENCE MATRIX

**Commit audited:** `d07940cb9331111b30b349efd4bf27c8c27e8100`  
**Date:** 2026-09-30  
**Rule:** Confidence reflects code/tests/CI/docs in-repo only. No invented metrics.

Confidence: **STRONG** | **PARTIAL** | **WEAK** | **NOT_FOUND**

Career Value: how much the area differentiates a senior Product/Full Stack narrative **if claimed accurately**.

| Area | Mechanism | Evidence | Confidence | Career Value |
|------|-----------|----------|------------|--------------|
| Auth | JWT signed on login (`expiresIn: 1d`); claims id/email/cpf/nome/role | `authService.js` | STRONG | HIGH |
| Auth delivery | Cookie `token` with `httpOnly: true`, `sameSite: 'lax'`, `secure` when `NODE_ENV=production`, 24h maxAge | `authController.js` | STRONG | HIGH |
| Auth validation | `verifyToken` reads cookie, `jwt.verify`, attaches `req.user`; missing → 401; invalid → 403 | `middleware/auth.js`, `authMiddleware.test.js` | STRONG | HIGH |
| Auth secret | Fail-closed `getJwtSecret`; rejects empty/short/known-insecure; no hardcoded default | `securityEnv.js`, `secretHandling.test.js` | STRONG | HIGH |
| Auth logout | Cookie cleared Max-Age=0; POST canonical (+ GET compat) | `authService`, `authRoutes`, logout fix commit history | STRONG | MEDIUM |
| Auth refresh | Refresh token / rotation | — | NOT_FOUND | — |
| Frontend auth gate | Next middleware redirects protected paths if cookie **absent** (no JWT verify) | `frontend/middleware.ts` | PARTIAL | LOW–MEDIUM |
| Authorization | `somenteRoles` after `verifyToken`; consulta=`cliente`; admin=`admin` | `somenteRoles.js`, routes | STRONG | HIGH |
| Authorization (fine-grained) | Resource ACL beyond role + self id/cpf | Limited to role + self-scoped queries | PARTIAL | MEDIUM |
| User scoping | List/create consultas by JWT `cpf`; perfil by `user.id` | `consultaService`, `perfilService` | STRONG | HIGH |
| Cross-user isolation | Prior local IDOR probes (INV-E4); Consulta lacks Usuario FK | docs/evidence + schema | PARTIAL | HIGH if bounded |
| ReceitaWS client | `axios.get` to `receitaws.com.br/v1/cnpj/:cnpj` | `consultaService.js` | STRONG | HIGH |
| ReceitaWS timeout | Env `RECEITAWS_TIMEOUT_MS` (default 5s, capped 30s) | `getReceitaTimeoutMs` | STRONG | MEDIUM |
| ReceitaWS retry | Up to 3 attempts / 300ms; 404 not-in-cache & 429 abort | `consultarReceitaWSComRetry` | STRONG | HIGH |
| ReceitaWS error map | NOT_IN_CACHE→404, 429→429, invalid→502, API_ERROR→500 | service + controller tests (mocked) | STRONG | HIGH |
| Cache | Persistent `DadosCNPJ` PK=cnpj JSON | schema + service | STRONG | HIGH |
| Cache TTL | Eviction by age | — | NOT_FOUND | Do **not** claim TTL cache |
| Cache malformed | Invalidate delete + refetch | service + integration test | STRONG | HIGH |
| Cache concurrency | Per-CNPJ in-process single-flight + P2002 re-read | `inflightByCnpj`, `cacheConcurrency.integration.test.js` | STRONG | **VERY HIGH** |
| Fallback | Secondary API / HA failover | Comment means cache-miss → ReceitaWS | WEAK as “fallback” wording; STRONG as cache-first path | Prefer rewrite |
| Kirvano endpoint | `POST /api/webhook/compra-confirmada` | `webhookRoutes.js` | STRONG | HIGH |
| Kirvano auth | Shared secret `X-Webhook-Secret` / `KIRVANO_WEBHOOK_SECRET`; timing-safe; fail-closed | `kirvanoWebhookAuth.js` + tests | STRONG | HIGH |
| Kirvano HMAC | Provider HMAC verification | Explicitly absent in comments/docs | NOT_FOUND | Do not claim HMAC |
| Kirvano business rule | `SALE_APPROVED` + valid email/CPF → create user / or existing | `webhookService.js` | STRONG | HIGH |
| Kirvano idempotency | Duplicate-safe provisioning via unique email/cpf + P2002; **no event id** | service + `webhookConcurrency.integration.test.js` | PARTIAL | **VERY HIGH** if bounded |
| Bonus/Credits | One-shot `bonusConcedidoAt` when profile fields complete | `perfilService.js`, schema | STRONG | LOW (as “credits”); MEDIUM as profile flag |
| Bonus ledger | Balance/ledger/consume | — | NOT_FOUND | Remove credit claims |
| Bonus ↔ payment | Kirvano sets bonus | — | NOT_FOUND | — |
| Database | Prisma models + migrations; SQLite provider in schema | `schema.prisma`, migrations | STRONG | HIGH |
| DB uniques | email, cpf, DadosCNPJ PK, Conversa.numero, recovery token | schema | STRONG | HIGH |
| DB ownership FK Consulta | usuarioId FK / composite unique (cpf,cnpj) | — | NOT_FOUND | Gap |
| Transactions | `prisma.$transaction` usage | Grep backend/src | NOT_FOUND | Gap |
| Concurrency (webhook) | C1–C20 same payload → 1 user, 0 unexpected 5xx | integration test | STRONG | **VERY HIGH** |
| Concurrency (cache) | C1–C20 same CNPJ → 1 ReceitaWS call, 1 cache row | integration test | STRONG | **VERY HIGH** |
| Concurrency (bonus) | Race tests / locks | — | NOT_FOUND | — |
| Failure handling | Mapped provider errors; webhook 401; JWT fail-closed; chat UI retries | services + tests | PARTIAL–STRONG | HIGH |
| Testing (backend) | Jest controllers/middleware/integration; many **mocks** | `backend/tests/*` | STRONG | HIGH |
| Testing (frontend) | Jest/RTL focused on admin chat | `frontend/__tests__/*` | PARTIAL | MEDIUM |
| Testing (live providers) | Real ReceitaWS/Kirvano in CI | — | NOT_FOUND | — |
| CI | Backend migrate+Jest×2; frontend test+build | `.github/workflows/ci.yml`; run success on tip | STRONG | HIGH |
| Security CI | npm audit high+; Gitleaks CLI; CodeQL | `security.yml`; recent success runs | STRONG | HIGH |
| Deployment | PM2 ecosystem + `scripts/deploy-*.sh` VPS paths | files present | STRONG | MEDIUM |
| Docker | Dockerfile / compose | — | NOT_FOUND | Do not claim from this repo |
| Railway | Railway config | — | NOT_FOUND | Do not claim from this repo |
| Production scale | Users, QPS, SLA, revenue | — | NOT_FOUND | Forbidden |
| Live URL | README lists investigamais.com | README | PARTIAL | LOW–MEDIUM (existence claim only) |

## Summary for CV writers

**Prioritize:** cache single-flight, webhook auth + duplicate-safe provisioning, JWT HttpOnly + roles, provider error mapping, CI/security gates.

**Deprioritize / reword:** “gestão de bônus”, “fallback”, Docker, Railway, exactly-once, enterprise HA.
