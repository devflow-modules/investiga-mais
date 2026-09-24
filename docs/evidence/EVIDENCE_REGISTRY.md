# Investiga+ Evidence Registry

Date: 2026-09-24 · LOCAL · SYNTHETIC · MOCKED EXTERNAL APIs

---

## INV-E1 Webhook authentication

| Field | Content |
|-------|---------|
| PROBLEM | `POST /api/webhook/compra-confirmada` accepted unauthenticated requests and created users |
| BASELINE | Phase 2: unauth → 201 + Usuario |
| CHANGE | `kirvanoWebhookAuth` shared-secret (`X-Webhook-Secret` / `KIRVANO_WEBHOOK_SECRET`), fail-closed, timing-safe compare |
| RESULT | missing/wrong → 401 no mutation; valid SALE_APPROVED processes |
| METHOD | Supertest + disposable SQLite |
| EVIDENCE | Phase 3 AFTER harness; `webhookController` + `kirvanoWebhookAuth` tests |
| LIMITATION | Shared-secret ≠ official Kirvano HMAC (not documented in-repo) |
| DATE | 2026-09-24 |

## INV-E2 Webhook concurrent provisioning

| Field | Content |
|-------|---------|
| PROBLEM | Check-then-act race → C20 produced 19× HTTP 500 (unique CPF) while keeping 1 user |
| BASELINE | Phase 2 C20: 2xx=1 5xx=19 finalUsers=1 |
| CHANGE | On relevant Prisma P2002 (email/cpf) re-read canonical user → 200 existing semantic |
| RESULT | C20: 2xx=20 5xx=0 finalUsers=1 |
| METHOD | Concurrent Supertest C1–C20 integration tests |
| EVIDENCE | `webhookConcurrency.integration.test.js`; Phase 3 AFTER JSON |
| LIMITATION | Not event-id idempotency; duplicate-safe provisioning only |
| DATE | 2026-09-24 |

## INV-E3 Cache stampede

| Field | Content |
|-------|---------|
| PROBLEM | Concurrent cache miss → N ReceitaWS calls + unique constraint 500s |
| BASELINE | Phase 2 C20: externalCalls=20 5xx=19 rows=1 |
| CHANGE | Per-CNPJ in-process single-flight + P2002 re-read; Consulta gate; malformed invalidate |
| RESULT | C20: externalCalls=1 5xx=0 rows=1; 10 distinct CNPJs no cross-mix |
| METHOD | axios-mock-adapter delayed replies + concurrent HTTP |
| EVIDENCE | `cacheConcurrency.integration.test.js` |
| LIMITATION | Single-flight is process-local |
| DATE | 2026-09-24 |

## INV-E4 User isolation

| Field | Content |
|-------|---------|
| PROBLEM | Need proof User A cannot read/mutate User B history/profile |
| BASELINE | Phase 2: PROVEN IN TESTED ROUTES (0 cross-user rows) |
| CHANGE | No ownership model change required |
| RESULT | Phase 3/4 IDOR smoke: crossUserRows=0; cliente→admin 403 |
| METHOD | Dual synthetic users + JWT cookie probes |
| EVIDENCE | Phase 2/3 harness probes |
| LIMITATION | Limited to tested local routes |
| DATE | 2026-09-24 |

## INV-E5 Test isolation

| Field | Content |
|-------|---------|
| PROBLEM | Seed CPF `99999999999` collided with security fixture → 81/90 |
| BASELINE | Seeded 81/90; isolated 90/90 |
| CHANGE | Unique CPF/email in `segurancaController.test.js`; CI disposable SQLite |
| RESULT | 113/113 seeded + isolated ×2 (Phase 3); Phase 4 revalidated |
| METHOD | Reset migrate + Jest `--runInBand` |
| EVIDENCE | Suite JSON under `/tmp/investiga-phase3` / Phase 4 runs |
| LIMITATION | Integration concurrency tests skip unless `DATABASE_URL` is `file:` |
| DATE | 2026-09-24 |

## INV-E6 Dependency remediation

| Field | Content |
|-------|---------|
| PROBLEM | Production audit critical/high (axios/form-data/tar/next/sqlite3/nodemailer paths) |
| BASELINE | BE prod C2 H12; FE prod C2 H4 |
| CHANGE | Remove unused sqlite3/nodemailer; axios 1.20; next 15.5.26; targeted overrides |
| RESULT | BE prod **C0 H0**; FE prod **C0 H0** (+1 moderate yaml) |
| METHOD | `npm audit` before/after; no `--force` majors |
| EVIDENCE | `/tmp/investiga-phase4/*audit*` + lockfiles |
| LIMITATION | Residual **dev** highs (jest/babel); FE yaml moderate |
| DATE | 2026-09-24 |

## INV-E7 CI/security gates

| Field | Content |
|-------|---------|
| PROBLEM | Broken CI under `.github/worflows` (typo), root npm install, mocha nonexistent |
| BASELINE | Suite not executed in Actions |
| CHANGE | `.github/workflows/ci.yml` + `security.yml` (audit / Gitleaks / CodeQL) |
| RESULT | CI app jobs PASS on `393729c`; audit PASS; CodeQL PASS; first Gitleaks Action run FAIL due to missing org `GITLEAKS_LICENSE` (config follow-up: OSS CLI) |
| METHOD | GitHub Actions on push to `main` |
| EVIDENCE | Runs 36037909065 (CI), 36037909036 (Security); commits INV-PUB-1…8 |
| LIMITATION | Gitleaks Action wrapper requires paid org license; OSS CLI used as remediation |
| DATE | 2026-09-24 |

## INV-E8 Historical Secret Exposure & Remediation

| Field | Content |
|-------|---------|
| PROBLEM | Gitleaks full-history found 5 legitimate historical credentials in `ecosystem.config.js` (introduced historically; removed from later working trees but retained in Git history) |
| BASELINE | 5 legitimate historical secret findings (Gitleaks OSS 8.21.2); Security workflow FAIL on Gitleaks only while CI/audit/CodeQL PASS |
| TRIAGE | Real historical credentials (JWT, Resend, IPQS, Abstract, Google Safe Browsing shapes). ACTIVE_PRODUCTION_RUNTIME = NO. ACTIVE_COMPROMISED_CREDENTIALS_OBSERVED = 0 in verified current accounts. HISTORICAL_REVOCATION_PROOF = UNAVAILABLE |
| RUNTIME HARDENING | Completed (INV-E9): JWT fail-closed, provider/Resend fail-closed, safe `.env.example`, secret-handling tests |
| HISTORY SANITIZATION | Controlled `git-filter-repo --replace-text` replacing the 5 historical values with `***REMOVED-HISTORICAL-SECRET***` across rewritten history (Phase 8B). Pre-rewrite recovery bundle retained locally |
| RESULT | Full-history Gitleaks findings 5 → 0; current HEAD tree preserved (`086e349c…`); rewritten historical commit count 102; feature branch tip trees preserved or only secret-replaced where tip contained secrets |
| METHOD | Gitleaks triage; disposable dry-run (8A); verified bundle; isolated rewrite; force-with-lease on `main`, `feat/lp-melhorias-v1`, `feat/whatsapp-atendimento` |
| LIMITATION | Sanitization applies to this GitHub repository history. Forks/clones/caches outside the repository may retain historical data. Does **not** claim provider-side revocation of the five historical credentials |
| DATE | 2026-09-24 |

## INV-E9 Runtime Secret Handling Hardening

| Field | Content |
|-------|---------|
| PROBLEM | JWT used hardcoded fallback `chave-secreta-dev`; IPQS/Abstract/Safe Browsing could call providers with `undefined` keys |
| BASELINE | Fallback present in `authService` + `auth` middleware; provider services read env without fail-closed |
| CHANGE | `config/securityEnv.js` (CORE JWT + FEATURE keys); remove JWT fallback; provider/Resend fail-closed; `backend/.env.example`; Jest `setupEnv` synthetic secrets; `secretHandling.test.js` |
| TEST | Missing JWT fails closed; missing provider keys → 0 HTTP; prod Resend without key does not send; source tree free of `chave-secreta-dev` |
| RESULT | Current-tree secret handling hardened; published on pre-sanitization history then retained through history rewrite (tree-identical) |
| LIMITATION | Provider APIs that require API key in query string still place key in outbound URL when configured (not exposed to frontend) |
| EVIDENCE | `backend/tests/secretHandling.test.js`; Phase 7A.1/7A.2 |
| DATE | 2026-09-24 |
