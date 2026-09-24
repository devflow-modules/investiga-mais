# Investiga+ Engineering Evidence

**Date:** 2026-09-24  
**Pre-publication baseline HEAD:** `06983d7090382d6a4a967506ba03207685030c95`  
**Publication tip (Phase 5 docs-link commit follows):** see Published Commits below  
**Scope:** LOCAL · SYNTHETIC · MOCKED EXTERNAL APIs  
**Production accessed:** NO

This document consolidates Phases 2–5 security, reliability, CI, and publication evidence for Investiga+.

---

## Published Commits (Phase 5)

| ID | SHA | Subject |
|----|-----|---------|
| INV-PUB-1 | `2dd214b31bc353fc7626e1d164c071517700adc8` | fix(security): authenticate purchase webhook and harden provisioning |
| INV-PUB-2 | `70d8b6bfab6c61f591fbf8275c7f6fd538fb18db` | fix(perf): prevent concurrent CNPJ cache stampedes |
| INV-PUB-3 | `8b026ed023ea9e25bfda30c2630dae0e08142d7b` | fix(auth): align logout endpoint contract |
| INV-PUB-4 | `73b4b405ad40852b286efa6dc342de88ad25aa13` | fix(admin): restore liberar conversa control in chat UI |
| INV-PUB-5 | `8d1f19491c0a495f593a17d4f034fed2c99c2a2c` | test: isolate database fixtures and expand security coverage |
| INV-PUB-6 | `7cdb6e2794bf6062952e5b3b4c08d7240a51e3ef` | fix(security): remediate vulnerable dependencies |
| INV-PUB-7 | `d07891669c53d7b598ac6fd3ed7fb0ab27634539` | ci: run application tests and security gates |
| INV-PUB-8 | `393729c6f5081d733399f4d470e160db04cf563d` | docs: add Investiga+ engineering evidence |

Note: webhook auth + concurrent provisioning were published as a single commit (INV-PUB-1) because `webhookService` and its tests were inseparable without a broken intermediate suite.

### GitHub Actions on INV-PUB-8

| Workflow / Job | Run ID | Result |
|----------------|--------|--------|
| CI / Backend tests | 36037909065 | **PASS** |
| CI / Frontend tests and build | 36037909065 | **PASS** |
| Security / npm audit backend | 36037909036 | **PASS** |
| Security / npm audit frontend | 36037909036 | **PASS** |
| Security / CodeQL | 36037909036 | **PASS** |
| Security / Gitleaks (action wrapper) | 36037909036 | **FAIL** — org requires `GITLEAKS_LICENSE` (not a secret finding; CI config follow-up switches to OSS CLI) |

---

## Environment

| Item | Value |
|------|--------|
| Runtime | Node.js 22.x |
| Backend ORM | Prisma 6.x + SQLite (`file:` URL only in experiments) |
| Frontend | Next.js 15.5.x |
| Test runner | Jest |
| External providers in tests | Mocked (axios-mock-adapter / Jest mocks) |
| Databases used for evidence | Disposable local SQLite under `/tmp` or `prisma/ci.db` |

Safety rule enforced in experiments: `DATABASE_URL` must start with `file:`.

---

## Methodology

1. **Phase 2 — BEFORE:** measure unauthenticated webhook, concurrency races, cache stampede, IDOR, logout mismatch, sensitive logs, test isolation. No product fixes.
2. **Phase 3 — AFTER:** surgical hardening + regression tests. No commit/push/deploy.
3. **Phase 4 — Consolidation:** dependency remediation, CI/security gates, evidence packaging, ChatLiberar triage.
4. **Phase 5 — Publication:** semantic commits pushed to `origin/main`; GitHub Actions verified.

Concurrency levels exercised: C1, C2, C5, C10, **C20**.

Fault injection (ReceitaWS, mocked): 200, 404, 429, 500, timeout, network error, invalid schema.

Datasets: synthetic emails/CPFs/CNPJs only. No real customer data.

---

## Baseline (Phase 2 BEFORE)

| Scenario | Result |
|----------|--------|
| Kirvano unauthenticated POST | **201** + Usuario created |
| Kirvano C20 | 2xx=1, 5xx=19, finalUsers=1 |
| Cache miss C20 | externalCalls=20, 5xx=19, rows=1 |
| Backend tests (seeded) | 81/90 |
| Backend tests (isolated) | 90/90 ×2 |
| Logout POST | 404, cookie persisted |
| Password/hash logging | present on failed login |
| IDOR (tested routes) | no cross-user rows |

---

## Phase 3 AFTER

| Scenario | Result |
|----------|--------|
| Kirvano unauthenticated POST | **401**, no DB mutation |
| Kirvano wrong secret | **401**, no mutation |
| Kirvano C20 | 2xx=20, 5xx=0, finalUsers=1 |
| Cache miss C20 | externalCalls=1, 5xx=0, rows=1 |
| 10 different CNPJs concurrent | PASS (no cross-key mixing) |
| Logout POST | 200 + cookie cleared |
| Password/hash logging | removed |
| Backend tests | **113/113** |

### Key fixes

- Shared-secret webhook auth (`KIRVANO_WEBHOOK_SECRET` + `X-Webhook-Secret`), fail-closed
- Webhook P2002 on email/cpf → re-read → existing-user semantic
- Per-CNPJ single-flight + Consulta gate; malformed cache invalidate/refetch
- `POST /api/auth/logout` aligned with frontend
- Test fixture CPF uniqueness

---

## Phase 4 consolidation

### Frontend failure (ChatLiberar)

- Reproduced isolated **3/3 failures** before fix
- Classification: **STALE TEST** + **PRODUCT GAP** (`BotaoLiberarConversa` existed but was not mounted; test looked for obsolete label “Liberar Atendimento”)
- Fix: mount liberar when `atendenteId` set; align test to “Liberar conversa”
- After fix: **27/27** PASS; frontend production build PASS

### Dependency security

| Scope | BEFORE | AFTER |
|-------|--------|-------|
| Backend full | C2 H16 M4 L4 | C0 H6 M0 L2 (remaining highs = **dev** tooling) |
| Backend prod (`--omit=dev`) | C2 H12 M4 L2 | **C0 H0 M0 L0** |
| Frontend full | C2 H13 M4 L2 | C0 H9 M3 L2 (dev/transitive residual) |
| Frontend prod | C2 H4 M2 L0 | **C0 H0 M1 L0** (yaml moderate) |

Remediation highlights:

- Removed unused runtime deps `sqlite3`, `nodemailer` (email uses Resend; Prisma owns SQLite)
- Upgraded `axios` → 1.20.x (clears form-data critical path)
- Frontend `next` 15.3.2 → **15.5.26** (non-major within 15.x)
- Targeted `overrides` for `jws`, `path-to-regexp`, `form-data`, `nanoid`, `postcss`
- **Did not** use `npm audit fix --force` / Next 16 major

### CI / security gates

Correct path: `.github/workflows/` (legacy typo `.github/worflows/` retained as deprecated).

| Workflow | Purpose |
|----------|---------|
| `ci.yml` | backend `npm ci` + Prisma generate/validate/migrate + Jest ×2 on disposable SQLite; frontend tests + build |
| `security.yml` | `npm audit --omit=dev --audit-level=high`; Gitleaks; CodeQL JS/TS |

Webhook tests use synthetic secrets only (`ci-kirvano-webhook-secret`).

---

## Evidence registry

See also: [EVIDENCE_REGISTRY.md](./EVIDENCE_REGISTRY.md)

| ID | Title |
|----|-------|
| INV-E1 | Webhook authentication |
| INV-E2 | Webhook concurrent provisioning |
| INV-E3 | Cache stampede |
| INV-E4 | User isolation |
| INV-E5 | Test isolation |
| INV-E6 | Dependency remediation |
| INV-E7 | CI/security gates |
| INV-E8 | Historical Secret Exposure & Remediation (history sanitized) |
| INV-E9 | Runtime Secret Handling Hardening |

---

## Safe career claims

- Audited historical credential exposure, hardened runtime secret handling, and sanitized Git history (full-history secret-scan findings 5 → 0 on this repository)

- JWT HttpOnly cookie auth with role gates
- Authenticated purchase webhook (shared-secret; fail-closed)
- Duplicate-safe user provisioning under concurrent retries (tested C20, local SQLite)
- Persistent CNPJ cache with process-local single-flight
- User-scoped consultation history (tested routes)
- Automated Jest suites with isolated SQLite CI
- Dependency critical/high production audit remediation
- Security workflows: audit + secret scan + CodeQL

## Do not claim

- Provider-side revocation of the five historical credentials (proof unavailable)
- Removal of historical secrets from third-party forks/clones/caches

- Exactly-once delivery / Kirvano official HMAC
- Production concurrency / throughput / multi-region idempotency
- Production scale proven
- WhatsApp end-to-end production reliability (integration exists; not Phase 2–4 focus)

## Limitations

- Single-flight is **in-process** (multi-instance still relies on unique constraints + P2002 handling)
- Shared-secret is not provider HMAC (no HMAC contract in-repo)
- CodeQL/Gitleaks effectiveness depends on GitHub plan/permissions
- Residual frontend prod moderate (`yaml`); backend residual highs are in **dev** toolchain
- Git history sanitized in Phase 8B (full-history Gitleaks 5 → 0 on this repository)
- HISTORICAL_REVOCATION_PROOF remains UNAVAILABLE (do not claim provider-side revoke)
- Forks/clones/caches outside this repository may retain historical credential material

---

## Production declaration

- Production scale: **NOT PROVEN**
- Production accessed: **NO**
- Deploy performed in Phases 2–4: **NO**
