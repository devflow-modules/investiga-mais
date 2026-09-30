# INVESTIGA+ — CV PROPOSAL (POST-AUDIT)

**Commit audited:** `d07940cb9331111b30b349efd4bf27c8c27e8100`  
**Decision:** `D3_REWRITE_EXPERIENCE`  
**PROMOTE_CVS_AFTER_REVISION:** YES (using SAFE/BOUNDED claims only)  
**Official CVs / LinkedIn modified in this phase:** NO  

---

## Current experience assessment

| Current line | Verdict |
|--------------|---------|
| Concepção, arquitetura e desenvolvimento completo de SaaS em produção para consulta e análise de CNPJs. | **REWRITE** — keep ownership + CNPJ SaaS; bound “produção”. |
| Consulta inteligente com cache e fallback, histórico com filtros, perfil de usuário e gestão de bônus. | **REWRITE** — feature soup; “fallback” and “gestão de bônus” misrepresent mechanisms. |
| Autenticação JWT com cookies HttpOnly, ReceitaWS e webhooks Kirvano; CI com testes automatizados. | **REWRITE** — facts OK but underrepresents concurrency, webhook auth, failure mapping. |

**Overall current CV stance:** UNDERREPRESENTED on verified engineering; OVERCLAIMED on bonus / fallback / (ATS) Docker·Railway.

---

## Header (keep / light adjust)

**PT**

Investiga+ | Santos/SP | Remoto  
Criador & Desenvolvedor Full Stack | mai/2025 - ago/2025

**EN**

Investiga+ | Santos/SP | Remote  
Creator & Full Stack Developer | May 2025 - Aug 2025

---

## PT ATS (max 4 bullets)

- Concebi e desenvolvi SaaS full stack de consulta de CNPJ (Next.js, Express, Prisma), com autenticação JWT em cookies HttpOnly e histórico filtrado por usuário autenticado.
- Estruturei cache persistente de CNPJ com single-flight por chave e tratamento de conflito de unicidade (P2002) para evitar stampede e falhas sob consultas concorrentes ao mesmo CNPJ.
- Implementei webhook autenticado de compra (Kirvano, shared secret fail-closed) com provisionamento de conta seguro a duplicatas via unicidade de email/CPF, incluindo replays concorrentes testados.
- Modelei falhas da ReceitaWS (timeout, retry, 404/429/payload inválido) em respostas HTTP explícitas; validei fluxos críticos com Jest (mocks de provider + integração SQLite descartável) e gates de CI/security.

---

## PT Recruiter (max 3 bullets)

- Criei o Investiga+ ponta a ponta: produto SaaS de inteligência de CNPJ com login seguro (JWT HttpOnly), consulta, cache e histórico autenticado.
- Tratei limites reais de integração — stampede de cache na ReceitaWS e webhooks de compra duplicados — com mecanismos verificáveis em código e testes de concorrência.
- Fechei o ciclo com CI automatizado (testes backend/frontend e checagens de segurança), sem claims de escala ou métricas inventadas.

---

## EN ATS (max 4 bullets)

- Designed and built a full-stack CNPJ lookup SaaS (Next.js, Express, Prisma) with JWT sessions in HttpOnly cookies and authenticated, filterable consultation history.
- Implemented a persistent CNPJ cache with per-key single-flight and unique-constraint/P2002 handling to prevent stampedes and 5xx races on concurrent identical lookups.
- Secured Kirvano purchase webhooks with a fail-closed shared secret and duplicate-safe account provisioning on unique email/CPF (including concurrent replay tests on disposable SQLite).
- Mapped ReceitaWS failure modes (timeout, retry, 404/429/invalid payload) to explicit HTTP errors; validated critical paths with Jest (mocked providers + SQLite integration) and CI/security gates.

---

## EN Recruiter (max 3 bullets)

- Built Investiga+ end-to-end: a CNPJ intelligence SaaS with secure browser auth (JWT HttpOnly), lookup, cache, and authenticated history.
- Focused on real integration edges — ReceitaWS cache stampedes and duplicate purchase webhooks — with mechanisms backed by concurrency tests.
- Shipped automated CI (backend/frontend tests plus security checks) without inventing scale or business metrics.

---

## What changed vs old bullets

| Old emphasis | New emphasis |
|--------------|--------------|
| Feature list (perfil, bônus, filtros) | Integration boundaries + concurrency invariants |
| Vague “cache e fallback” | Cache-first + single-flight + uniqueness |
| “Webhooks Kirvano” name-drop | Authenticated webhook + duplicate-safe provisioning |
| “Gestão de bônus” | Removed (timestamp flag ≠ credit system) |
| Stack dump | Stack only where it supports the mechanism |

---

## Optional one-liner for LinkedIn featured / project blurb (BOUNDED)

**PT:** SaaS de consulta de CNPJ com cache concorrente à prova de stampede, JWT HttpOnly e webhook de compra autenticado com provisionamento idempotente por identidade.  
**EN:** CNPJ lookup SaaS with stampede-safe concurrent caching, JWT HttpOnly sessions, and an authenticated purchase webhook with identity-keyed duplicate-safe provisioning.

---

## Promotion gate checklist

Before applying to official CV/PDF/LinkedIn:

- [ ] No Docker/Railway unless separate evidence appears  
- [ ] No “exactly-once” / HMAC Kirvano / credit ledger  
- [ ] No user/revenue/SLA numbers  
- [ ] Bonus mentioned only as profile-completion flag if at all  
- [ ] Prefer “duplicate-safe provisioning” over “idempotent webhook” without qualifier  

**PROMOTE_CVS_AFTER_REVISION = YES**
