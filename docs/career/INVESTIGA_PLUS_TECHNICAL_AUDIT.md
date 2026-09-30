# INVESTIGA+ — TECHNICAL CAREER EVIDENCE AUDIT

**Date:** 2026-09-30  
**Repository:** `devflow-modules/investiga-mais`  
**Commit audited:** `d07940cb9331111b30b349efd4bf27c8c27e8100` (`main`)  
**Scope:** READ-ONLY product audit for career positioning  
**Production code modified:** NO  
**Production accessed:** NO  

Related prior engineering evidence (not marketing):  
`docs/evidence/INVESTIGA_PLUS_ENGINEERING_EVIDENCE.md`, `docs/evidence/EVIDENCE_REGISTRY.md`

---

## 1. Repository map

| Area | Location | Evidence strength |
|------|----------|-------------------|
| Frontend | `frontend/` (Next.js 15.5.x, React 19, Chakra UI, Framer Motion) | STRONG |
| Backend | `backend/` (Express 5, Prisma 6, Jest) | STRONG |
| Shared validators | `shared/validators/` | STRONG |
| Prisma schema + migrations | `backend/prisma/` | STRONG |
| Auth | `authService`, `auth` middleware, `authController`, `authRoutes` | STRONG |
| ReceitaWS / CNPJ | `consultaService`, `consultaController`, `consultaRoutes` | STRONG |
| Kirvano webhook | `kirvanoWebhookAuth`, `webhookService`, `webhookRoutes` | STRONG |
| Bonus | `Usuario.bonusConcedidoAt` + `perfilService` | STRONG (mechanism = timestamp flag) |
| Risk checks | `segurancaService` (IPQS / Abstract / Safe Browsing) | STRONG code; PARTIAL product relevance for CV |
| Admin WhatsApp chat | `whatsapp*`, `admin*`, `Conversa`/`Mensagem` | STRONG code; not in current CV bullets |
| Tests | `backend/tests/*`, `frontend/__tests__/*` | STRONG |
| CI | `.github/workflows/ci.yml`, `security.yml` | STRONG |
| Deploy | `scripts/deploy-*.sh`, `ecosystem.config.js` (PM2/VPS paths) | STRONG for PM2; NOT_FOUND for Docker/Railway configs |
| ADRs | — | NOT_FOUND |

**Architecture found (not inferred beyond code):**

```text
Browser (Next.js App Router)
  ├── Landing / login / password recovery
  ├── Dashboard (consulta, histórico, perfil, segurança)
  └── Admin chat UI
        ↓  cookie `token` (credentials)
Express API (`backend/src/app.js`)
  ├── Auth / recovery
  ├── Consulta (+ role cliente)
  ├── Perfil / Segurança
  ├── Webhook Kirvano (shared secret)
  └── Admin / WhatsApp (role admin)
        ↓
Services → Prisma Client
        ↓
SQLite (schema.prisma provider) / deploy scripts imply remote host DB via DATABASE_URL
        ↕
External: ReceitaWS, Kirvano, Resend, IPQS, AbstractAPI, Google Safe Browsing
```

**Note:** README lists Docker + Railway. No `Dockerfile*` and no Railway config files were found in this repository. Deploy evidence points to **PM2 on a VPS** (`/var/www/investiga-mais`, `ecosystem.config.js`).

---

## 2. Authentication / authorization

### Mechanisms verified

| Question | Answer | Evidence | Confidence |
|----------|--------|----------|------------|
| Where JWT is created | `authService.autenticarUsuario` via `jwt.sign` (claims: id, email, cpf, nome, role; `expiresIn: '1d'`) | `backend/src/services/authService.js` | STRONG |
| Where validated | `middleware/auth.js` `verifyToken` reads `req.cookies.token`, `jwt.verify`, attaches `req.user` | same | STRONG |
| How reaches browser | `authController.login` sets `res.cookie('token', …)` | `authController.js` | STRONG |
| HttpOnly | `httpOnly: true` | `authController.js` | STRONG |
| Secure / SameSite | `secure: NODE_ENV === 'production'`, `sameSite: 'lax'`, `maxAge` 24h | `authController.js` | STRONG |
| Refresh token | None found | Grep / auth modules | NOT_FOUND |
| Logout | Clears cookie via `Set-Cookie` Max-Age=0 HttpOnly SameSite=Lax; POST + GET routes | `authService.invalidarTokenCookie`, `authRoutes` | STRONG |
| Protected API routes | `verifyToken` on consulta/perfil/seguranca/admin | routes | STRONG |
| Frontend route gate | Next middleware redirects if cookie **absent** (does not verify JWT) | `frontend/middleware.ts` | PARTIAL |
| Authorization beyond auth | `somenteRoles([...])` — cliente for consulta; admin for admin | `somenteRoles.js`, routes | STRONG |
| User scoping | History/list filtered by `cpf` from JWT; profile by `usuarioId` | `consultaService`, `perfilService` | STRONG (tested routes) |
| Cross-user access | Evidence registry INV-E4 claims 0 cross-user rows on tested routes; Consulta has **no FK** to Usuario (scoped by CPF string) | schema + EVIDENCE_REGISTRY | PARTIAL |
| JWT secret fail-closed | `securityEnv.getJwtSecret` — no hardcoded fallback; rejects short/insecure values | `securityEnv.js`, `secretHandling.test.js` | STRONG |
| CORS | Hardcoded `origin: 'http://localhost:3000'` + `credentials: true` in `app.js` | `app.js` | STRONG (local-oriented); production CORS not evidenced in code |
| CSRF | No CSRF token/double-submit found; SameSite=Lax is the only related control | — | WEAK / NOT_FOUND for dedicated CSRF |

### Defensible auth claims

- SAFE: JWT session delivered via HttpOnly cookie; Secure in production env; SameSite=Lax; 1-day expiry.
- SAFE: Backend middleware rejects missing/invalid tokens; role gates for cliente vs admin.
- SAFE: JWT signing secret is fail-closed (no insecure default).
- BOUNDED: Frontend “protection” is cookie presence only.
- UNSUPPORTED: “Secure authentication architecture”, refresh rotation, CSRF-hardened SPA, multi-tenant authz.

---

## 3. ReceitaWS / “consulta inteligente”

### Real flow

```text
GET /api/consulta/:cnpj
  → verifyToken + role cliente
  → validarCNPJ
  → consultarCNPJService(cnpj, cpfFromJWT)
       → find Consulta by (cpf, cnpj)
       → acquireDadosCNPJ(cnpj):
            1. DB cache DadosCNPJ by PK cnpj
            2. If payload malformed → delete row → treat as miss
            3. If miss → per-CNPJ in-process single-flight Map
            4. Re-check DB inside flight
            5. axios GET https://receitaws.com.br/v1/cnpj/:cnpj
               (timeout env RECEITAWS_TIMEOUT_MS default 5s, max 30s;
                up to 3 attempts, 300ms delay;
                404 "not in cache" and 429 abort without further retry)
            6. Validate payload (status + nome/fantasia)
            7. create DadosCNPJ; on P2002 re-read canonical row
       → ensureConsultaRecord (per cpf:cnpj single-flight)
       → mark status Consultado
       → return { consultado, consulta, empresa }
```

### What “cache” means

| Property | Reality | Confidence |
|----------|---------|------------|
| Store | Persistent table `DadosCNPJ` (PK = cnpj, JSON payload) | STRONG |
| Key | CNPJ string | STRONG |
| TTL / staleness eviction | **None** — cache kept until malformed invalidation | STRONG (absence) |
| Process layer | In-memory `inflightByCnpj` single-flight | STRONG |
| Multi-instance | Single-flight is **process-local**; uniqueness + P2002 handle races across processes partially | STRONG limitation |

### What “fallback” means

Controller comment: *“Consulta CNPJ com validação e fallback via ReceitaWS.”*

**Verified meaning:** on cache miss, call ReceitaWS (primary external source).  
**Not found:** secondary provider, mock/default company data as success path, HA multi-region failover.

There is **retry** for some transient axios failures (max 3). Specific provider statuses 404/429 map to user-facing errors without treating another API as fallback.

**Career precision:** prefer “cache-first ReceitaWS lookup with retry and single-flight” over “cache and fallback” as a senior claim.

### Provider error mapping (application)

| Condition | HTTP to client | Evidence |
|-----------|----------------|----------|
| NOT_IN_CACHE (404) | 404 | `consultaService` |
| 429 | 429 | same |
| INVALID_API_RESPONSE | 502 | same |
| API_ERROR after retries | 500 | same |
| Unexpected; may create Consulta status `Erro` | 500 path | same |

Tests: mocked axios + Prisma unit/controller tests; integration concurrency with `axios-mock-adapter` (`cacheConcurrency.integration.test.js`).

---

## 4. Kirvano webhook

### Flow

```text
POST /api/webhook/compra-confirmada
  → verificarKirvanoWebhookSecret
       header X-Webhook-Secret vs KIRVANO_WEBHOOK_SECRET
       timing-safe compare; fail-closed if secret unset
       (escape hatch ALLOW_UNAUTHENTICATED_WEBHOOK=true)
  → registrarUsuarioViaCompra(body)
       require event === SALE_APPROVED + email + cpf
       validate email/CPF formats
       if user exists (email OR cpf) → 200 “já cadastrado”
       else create Usuario (bcrypt hash, generated password)
            on P2002 email/cpf → re-read → 200 existing
       production → Resend welcome email with credentials
```

### Duplicate delivery question

**If the same Kirvano event arrives twice, what happens?**

1. Auth must succeed both times.
2. First successful create → **201** + user row (+ email in production).
3. Second (same email/cpf) → **200** “Usuário já cadastrado”; **no second user**.
4. Concurrent duplicates (tested C1–C20): ≤1 user, 0 unexpected 5xx — via unique constraints + P2002 handling.

**IDEMPOTENCY classification:** **PARTIAL**

- STRONG for **duplicate-safe user provisioning** keyed by email/cpf uniqueness.
- ABSENT for **event-id / delivery-id idempotency**, ordering guarantees, webhook audit ledger, official Kirvano HMAC (explicitly documented as shared-secret, not HMAC).

---

## 5. Bonus / credits domain

| Question | Finding | Confidence |
|----------|---------|------------|
| Data model | `Usuario.bonusConcedidoAt DateTime?` only | STRONG |
| Ledger / balance / credits | **Not found** | NOT_FOUND |
| Created when | First profile update with all of: nome, telefone, nascimento, cidade, uf, genero and `bonusConcedidoAt` null | STRONG |
| Consumed | **Never consumed** in code | NOT_FOUND |
| Kirvano link | Webhook does **not** set bonus | STRONG |
| Transaction | No `$transaction` in backend | STRONG (absence) |
| Concurrency | Read-then-update TOCTOU possible; no DB constraint enforcing one-shot beyond nullable timestamp overwrite race | PARTIAL / WEAK |
| Tests | Mocked perfil tests for grant/skip paths | PARTIAL |

**Career implication:** “gestão de bônus” overstates. Accurate: one-time profile-completion bonus **flag/timestamp**, not credit economy.

---

## 6. Data model / invariants

### Database-enforced (schema/migrations)

| Invariant | Mechanism |
|-----------|-----------|
| Unique user email | `Usuario.email @unique` |
| Unique user CPF | `Usuario.cpf @unique` |
| Unique CNPJ cache row | `DadosCNPJ.cnpj` PK |
| Unique recovery token | `TokenRecuperacao.token @unique` |
| Unique WhatsApp conversation number | `Conversa.numero @unique` |
| FK Usuario → recovery/logs/risk | relations present |
| Consulta ownership FK | **Absent** — Consulta stores `cpf`/`cnpj` strings only |
| Unique (cpf, cnpj) history | **Absent** — duplicate Consulta rows possible across instances |
| Bonus one-shot DB constraint | **Absent** |

### Application-enforced

| Behavior | Mechanism | Limit |
|----------|-----------|-------|
| Cache stampede control | `inflightByCnpj` | process-local |
| History duplicate gate | `inflightConsultaByKey` | process-local; no unique index |
| Role defaults on webhook create | omit `role` → schema default `cliente` | body cannot escalate via create path |
| Webhook auth | shared secret middleware | not HMAC |

**No Prisma interactive transactions found** in `backend/src`.

---

## 7. Failure modes table

| FAILURE MODE | CURRENT BEHAVIOR | MECHANISM | EVIDENCE | CAREER VALUE |
|--------------|------------------|-----------|----------|--------------|
| ReceitaWS unavailable / network | After retries → 500 API_ERROR; may mark Consulta `Erro` if new | retry loop + mapped errors | `consultaService` + mocked tests | HIGH |
| ReceitaWS timeout | axios timeout → retry → API_ERROR | `RECEITAWS_TIMEOUT_MS` | code | HIGH |
| ReceitaWS malformed | INVALID_API_RESPONSE / 502 or 500 | `isValidEmpresaPayload` | code + tests | HIGH |
| Cache miss | Call ReceitaWS; persist | acquireDadosCNPJ | code + tests | HIGH |
| Cache stale | **No TTL** — returns stored JSON indefinitely | absence | schema/service | MEDIUM (honesty) |
| Malformed cache row | Delete + refetch | invalidation path + integration test | STRONG |
| Concurrent cache miss | Single-flight → 1 external call | Map + P2002 | C20 integration | **VERY HIGH** |
| Invalid / expired / missing JWT | 401/403 | verifyToken | middleware tests | HIGH |
| Cross-user history | Scoping by JWT cpf on list/consulta | service filters; INV-E4 | PARTIAL→HIGH |
| Duplicate Kirvano webhook | 200 existing / concurrent ≤1 user | unique + P2002 | integration tests | **VERY HIGH** |
| Invalid Kirvano webhook | 401 / 503 if misconfigured | shared secret fail-closed | tests | HIGH |
| DB failure | Controllers return 500 | try/catch | controller tests | MEDIUM |
| Bonus update race | Possible double “grant” semantics under concurrency | no txn/lock | code absence | LOW (document gap) |
| Concurrent bonus “consumption” | N/A — no consumption | — | — | — |
| Frontend API failure (chat) | Retry helpers / UI tests | frontend chat tests | MEDIUM (admin surface) |
| CORS misconfig in prod | Hardcoded localhost origin in source | `app.js` | ops risk; do not claim polished CORS | |

---

## 8. Testing audit

### What exists

| Layer | Examples | What it proves |
|-------|----------|----------------|
| Unit / controller (mocked Prisma/axios) | auth, consulta, webhook, perfil, admin, seguranca, validacoes | HTTP contracts + business branches with **mocks** |
| Middleware | authMiddleware, kirvanoWebhookAuth | token/secret fail paths |
| Secret handling | secretHandling.test.js | fail-closed JWT/provider keys; no insecure default |
| Integration (real SQLite file: + mocked ReceitaWS HTTP) | cacheConcurrency, webhookConcurrency | concurrency invariants under disposable DB |
| Frontend | Chat unit + integration RTL | admin chat UX behaviors (mocked fetch) |
| CI | backend Jest ×2 on reset SQLite; frontend Jest + production build; npm audit; Gitleaks CLI; CodeQL | gates **configured**; HEAD `d07940c` CI run **success** (2026-09-24) |

### Gaps (absence is evidence)

- No live ReceitaWS/Kirvano E2E against production providers in CI.
- No dedicated concurrency test for bonus timestamp.
- No CSRF tests.
- Consulta unit tests mock auth middleware (do not re-prove JWT on those cases).
- Frontend dashboard consulta/histórico largely without equivalent deep tests vs chat.

---

## 9. CI/CD and deployment

| Item | Status |
|------|--------|
| `.github/workflows/ci.yml` | CONFIGURED + VERIFIED green on audited tip push |
| `.github/workflows/security.yml` | CONFIGURED; scheduled Security success 2026-09-28; tip Security success with CI |
| Legacy `.github/worflows/` | Present (typo path); superseded by `workflows/` |
| Docker | README claim only — **NOT_FOUND** in repo |
| Railway | README claim only — **NOT_FOUND** in repo |
| PM2 + shell deploy | CONFIGURED (`ecosystem.config.js`, `scripts/deploy-*.sh`) |
| Migrations in CI | `prisma migrate deploy` on disposable SQLite | VERIFIED by workflow |
| Live product URL | README `https://investigamais.com` | claim in docs; metrics **NOT proven** here |

---

## 10. Strongest verified senior signals (max 5)

1. **CNPJ cache stampede control** — per-key single-flight + PK + P2002; C20 tests.  
2. **Purchase webhook auth + duplicate-safe provisioning** — shared-secret fail-closed; unique email/cpf; concurrent replay tests.  
3. **Provider failure mapping** — timeout/retry/status → explicit client errors; malformed cache invalidate.  
4. **JWT HttpOnly + role authorization + fail-closed secrets** — cookies, `somenteRoles`, `securityEnv`.  
5. **CI reliability gates** — isolated DB double-run tests + audit/Gitleaks/CodeQL.

---

## 11. Seniority assessment (code evidence)

| Dimension | Rating | Rationale |
|-----------|--------|-----------|
| Product ownership | STRONG | Solo/creator git majority; landing→pay→provision→dashboard product loop |
| Full-stack depth | STRONG | Next + Express + Prisma + shared validators + admin chat |
| Data modeling | MODERATE | Useful uniques; missing Consulta ownership FK / (cpf,cnpj) unique / transactions |
| Integration engineering | STRONG | ReceitaWS + Kirvano + Resend + risk APIs with fail-closed keys |
| Reliability | MODERATE→STRONG | Strong concurrency fixes on cache/webhook; process-local limits; no TTL |
| Security | MODERATE→STRONG | Cookie JWT, roles, webhook secret, secret hardening; CORS/CSRF/frontend cookie-only gaps |
| Testing | STRONG | Meaningful concurrency + security tests beyond CRUD mocks |
| Operations | MODERATE | PM2 scripts + CI; Docker/Railway claims unsupported by repo files |

**Overall seniority evidence for Investiga+ case:** **STRONG** (not VERY_STRONG — gaps in transactional domain model, event-id idempotency, bonus/credit narrative, and overstated deploy stack in older materials).

---

## 12. Portfolio differentiation

Vs ApplyFlow (OCC/local-first), Prospecta (M2M ingest), WhatsApp Platform (Meta HMAC/tenant/ledger), HealthSafe (browser automation):

**Unique Investiga+ signal:** end-to-end **CNPJ intelligence SaaS** with a **persistent provider-cache boundary** under concurrent miss (single-flight + DB uniqueness) **and** a **payment→account provisioning** webhook that is authenticated and duplicate-safe on identity keys — productized as authenticated consultation history, not only an integration spike.

Avoid claiming OCC, Meta HMAC, M2M, or automation uniqueness here.

---

## 13. Current CV phrase assessment

| Phrase | Verdict | Why |
|--------|---------|-----|
| “Concepção, arquitetura e desenvolvimento completo de SaaS em produção para consulta e análise de CNPJs.” | **REWRITE** | Ownership + CNPJ SaaS supported; “em produção” is weakly evidenced (live URL/docs + PM2 paths) — keep bounded (“deployed/live product”) without scale claims. |
| “Consulta inteligente com cache e fallback, histórico com filtros, perfil de usuário e gestão de bônus.” | **REWRITE** | Feature inventory; “inteligente/fallback/gestão de bônus” imprecise vs mechanisms. |
| “Autenticação JWT com cookies HttpOnly, ReceitaWS e webhooks Kirvano; CI com testes automatizados.” | **REWRITE** (keep facts, deepen) | Technically true but underrepresents concurrency/idempotency/security hardening proven later. |

**Aggregate current CV:** **UNDERREPRESENTED** on verified engineering; **OVERCLAIMED** on bonus wording and historical Docker/Railway ATS stack items.

---

## 14. Final decision

**D3_REWRITE_EXPERIENCE**

Evidence supports rewriting bullets into PROBLEM → DECISION → MECHANISM → VALIDATION form without inventing metrics. Current text is not false overall, but misaligned with the depth available and with peer cases on the same résumé.

**PROMOTE_CVS_AFTER_REVISION = YES** — only using SAFE/BOUNDED claims from the claim registry; do not promote more stack laundry or “gestão de bônus” as credits.

---

## 15. Production / safety declaration

- Ambiente utilizado: repositório local Cloud Agent (read-only product code).  
- Operações mutáveis no produto: **nenhuma**.  
- Migrations / seeds / deploy: **não executados** contra produção.  
- Únicos artefatos novos: documentos sob `docs/career/`.  
- Produção **não** modificada.
