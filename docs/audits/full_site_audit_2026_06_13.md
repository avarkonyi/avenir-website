# Avenir full-site audit - 2026-06-13

Production URL: https://www.afm.hu  
Repository: `C:\Users\andra\avenir-website`  
Branch: `main`  
Audited commit: `8f9bba4 fix(privacy): add GA4 processor and transfer wording`  
Audit type: read-only, evidence-based production and source audit  
Runtime / DB / route / copy changes made: none

## Executive summary

Overall score: **8.2 / 10**  
Verdict: **GO WITH EXCEPTIONS**

There is no confirmed P0 launch blocker. Build, lint, unit tests, copy guard, production route smoke and analytics QA pass. Security posture is materially stronger than a typical launch site: hardened admin allowlist, guarded upload APIs with magic-byte validation, consent-gated direct GA4, strong production headers, no GTM / LinkedIn Insight Tag / ads endpoints, and a public security.txt with responsible-disclosure pages.

The main confirmed launch-risk class is not technical availability; it is **legal/proof/copy drift around fixed response-time wording**. The live site still shows "2 munkanapon belül / within 2 working days" in the HU/EN terms and two service process sections, while current copy governance says fixed response-time promises should not be reintroduced without owner/legal approval. The same wording also appears in `llms-full.txt`, so AI/search systems can cite it.

### Top risks

| Rank | Risk | Severity | Evidence |
|---:|---|---|---|
| 1 | Fixed response-time wording is live in HU/EN ASZF and two service pages. | P1 | `/hu/aszf`, `/en/aszf`, `/hu|en/szolgaltatasok/objektumorzes`, `/hu|en/szolgaltatasok/portaszolgalat` |
| 2 | `llms-full.txt` still advertises "2-working-day response wording". | P1 | `https://www.afm.hu/llms-full.txt`, line source `public/llms-full.txt:73` |
| 3 | `verified_claims.md` still treats response-time claims as approved, while copy strategy says they were removed. | P1 | `docs/verified_claims.md:29-31`, `docs/copy_strategy.md:360-364` |
| 4 | GA4 privacy wording is live, but account-side evidence/settings review remains a DPO/legal governance item. | P1 | `docs/trust_center/open_decisions.md:25`, `docs/legal/analytics-privacy-review.md:82-89` |
| 5 | Sitemap static lastModified uses `2026-05-07` for many route classes despite later June releases. | P2 | `app/sitemap.ts:23` |
| 6 | WebSite JSON-LD advertises HU/EN/DE/ZH/KO as site languages although DE/ZH/KO are partial/noindex or closed layers. | P2 | `app/[locale]/layout.tsx:262-267` |
| 7 | `package.json` has duplicate `@playwright/test` devDependency entries. | P2 | `package.json` devDependencies |
| 8 | Production migration/push scripts exist and are guarded, but remain high-risk commands without dry-run semantics. | P2 | `package.json` `db:migrate:prod`, `db:push:prod` |
| 9 | CSP still depends on `unsafe-inline` for scripts/styles. | P2 | `next.config.ts:7`, `next.config.ts:78` |
| 10 | Full Lighthouse / axe / visual regression coverage is not automated in the checked command set. | P3 | QA commands pass, but no Lighthouse/axe command present |

### Top quick wins

| Rank | Quick win | Suggested prompt type |
|---:|---|---|
| 1 | Remove or owner-approve the live fixed response-time wording from ASZF and the two service process rows. | legal/proof review + content quick fix |
| 2 | Remove the same fixed response-time claim from `llms-full.txt`. | quick fix |
| 3 | Align `docs/verified_claims.md` with the no-SLA copy policy. | docs-only |
| 4 | Confirm GA4 account-side settings: DPA, retention, Signals, Ads personalization, data sharing. | legal/proof review |
| 5 | Update sitemap lastModified strategy for static/legal/trust routes. | runtime bugfix |
| 6 | Narrow WebSite JSON-LD `inLanguage` to production-indexable languages or represent partial locales more carefully. | SEO quick fix |
| 7 | Remove duplicate `@playwright/test` entry. | quick fix |
| 8 | Add an extra refusal wrapper or manual confirmation gate around `db:migrate:prod` / `db:push:prod`. | script safety |
| 9 | Add periodic Lighthouse/axe checks to the QA runbook. | backlog |
| 10 | Start a CSP nonce/hash hardening plan after launch stability. | backlog |

### What is excellent

- Production HU and EN core site layers are live and QA passing.
- DE route policy is consistent with review/noindex status: DE homepage, service, legal and news routes can render, but are not in sitemap/hreflang.
- ZH/KO service/legal/news/trust/disclosure surfaces remain closed or noindex as expected.
- Admin actions and upload APIs use shared `requireAdmin()` allowlist enforcement.
- Upload APIs validate PDF/image magic bytes and preserve file-size/folder restrictions.
- Contact API has origin allowlist, body-size limit, honeypot, production fail-closed Redis/KV rate limit, DB insert and fail-soft Resend notification.
- GA4 is direct and consent-gated; `qa:analytics` confirms no analytics before consent and PII-safe event behavior.
- Security headers are strong, production is not noindex, and no Ads/DoubleClick/pagead endpoints are allowlisted.
- Trust Center is proof-safe: pending D&B/liability/DPA evidence is not overpublished.
- AutoWallis Pest reference is proof-safe and not written as a testimonial or case study.

### What should not be changed

- Do not replace the direct GA4 implementation with GTM unless a separate marketing-tag strategy is approved.
- Do not expose DE/ZH/KO routes in sitemap/hreflang until final localization approval.
- Do not add exact licence numbers into service marketing copy or service cards.
- Do not expand private investigation into a public service CTA/dropdown/service page without legal/process approval.
- Do not publish raw DPA/SCC/LIA, signed reference consent, raw insurance policy or unapproved proof PDFs.
- Do not loosen admin/upload/contact API security controls.

## Score table

| Category | Score /10 | Notes |
|---|---:|---|
| Security / headers / app safety | 8.8 | Strong headers, admin allowlist, upload sniffing, contact abuse controls. CSP still uses unsafe-inline. |
| Code quality / architecture | 8.2 | App Router structure and route helpers are clean; duplicate dependency and some legacy source drift remain. |
| DB / script safety | 8.0 | Most write scripts guarded/dry-run; prod migrate/push remain high-risk commands. |
| Technical SEO | 8.0 | Core HU/EN indexability and sitemap are good; static lastmod and JSON-LD language scope need polish. |
| Structured data / JSON-LD | 8.0 | Safe JSON-LD escaping and proof-safe schemas; WebSite language scope is too broad. |
| LLM / AI-search / GEO | 7.4 | llms files are useful, but `llms-full.txt` contains stale fixed response-time claim. |
| Copy / i18n / compliance copy | 7.8 | HU/EN service layer is strong; live no-SLA drift remains on legal/service pages. |
| Legal / privacy / proof governance | 7.5 | Privacy v1.3 is detailed; GA4 account-side evidence and response-time governance need cleanup. |
| Accessibility / UX | 8.3 | Skip link, focus states, labels and form states are good; no automated axe/visual confirmation. |
| Performance / CWV readiness | 7.6 | Build is healthy and static-heavy; no Lighthouse evidence in this pass. |
| Operations / QA / release | 8.6 | Production smoke/analytics pass; transient first smoke failure should be monitored if recurring. |

## P0 / P1 findings

| ID | Severity | Category | Title | Status |
|---|---|---|---|---|
| F-001 | P1 | Legal / copy / proof | Fixed response-time wording is live on legal and service pages | Confirmed |
| F-002 | P1 | AI-search / llms | `llms-full.txt` advertises stale fixed response-time wording | Confirmed |
| F-003 | P1 | Proof governance | Verified-claims governance conflicts with current no-SLA copy policy | Confirmed |
| F-004 | P1 | Privacy governance | GA4 account-side legal/proof evidence remains pending while privacy v1.3 is live | Confirmed governance item |

### F-001

ID: F-001  
Severity: P1  
Category: Legal / copy / proof  
Title: Fixed response-time wording is live on legal and service pages

Evidence:
- `/hu/aszf`: "A Szolgáltató vállalja, hogy a beérkezett ajánlatkérésre 2 munkanapon belül visszajelez."
- `/en/aszf`: "The Provider undertakes to respond to incoming requests within 2 business days."
- `/hu/szolgaltatasok/objektumorzes`: "A megkeresésre 2 munkanapon belül visszajelzünk..."
- `/en/szolgaltatasok/objektumorzes`: "We respond to your enquiry within 2 working days..."
- `/hu/szolgaltatasok/portaszolgalat`: "A megkeresésre 2 munkanapon belül visszajelzünk..."
- `/en/szolgaltatasok/portaszolgalat`: "We respond to your enquiry within 2 working days..."

Source/live path:
- Live: `https://www.afm.hu/hu/aszf`
- Live: `https://www.afm.hu/en/aszf`
- Live: `https://www.afm.hu/hu/szolgaltatasok/objektumorzes`
- Live: `https://www.afm.hu/en/szolgaltatasok/objektumorzes`
- Live: `https://www.afm.hu/hu/szolgaltatasok/portaszolgalat`
- Live: `https://www.afm.hu/en/szolgaltatasok/portaszolgalat`
- Source: `lib/i18n/hu.ts:310`, `lib/i18n/en.ts:307`
- Source: `scripts/seed-pilot-objektumorzes.ts:82`, `scripts/seed-pilot-portaszolgalat.ts:81`

Reproduction:
```powershell
node -e "fetch('https://www.afm.hu/hu/aszf').then(r=>r.text()).then(t=>console.log(/2 munkanap/i.test(t)))"
node -e "fetch('https://www.afm.hu/en/szolgaltatasok/objektumorzes').then(r=>r.text()).then(t=>console.log(/within 2|2 working/i.test(t)))"
```

Impact:
- Converts a soft "what happens next" expectation into a fixed response-time commitment.
- Conflicts with the current no-SLA/no-guarantee guardrail in `docs/copy_strategy.md`.
- Can be interpreted by users, procurement teams or AI systems as a service-level promise.

Recommendation:
- Owner/legal should decide whether the response-time promise is intentionally approved.
- If not approved, replace with non-SLA wording in ASZF/legal source and the two service process rows.
- Check whether the term is also present in translation matrices or seed/import sources before any future sync.

Autofix safe? No, because the ASZF/legal wording needs owner/legal approval.  
Needs owner/legal/proof decision? Yes.  
Confidence: High. Verified by source and live production fetch.  
Suggested prompt type: legal/proof review + content quick fix.

### F-002

ID: F-002  
Severity: P1  
Category: LLM / AI-search / GEO  
Title: `llms-full.txt` advertises stale fixed response-time wording

Evidence:
- `https://www.afm.hu/llms-full.txt` contains: "2-working-day response wording for contact follow-up."
- Source line: `public/llms-full.txt:73`.

Source/live path:
- Live: `https://www.afm.hu/llms-full.txt`
- Source: `public/llms-full.txt:73`

Reproduction:
```powershell
node -e "fetch('https://www.afm.hu/llms-full.txt').then(r=>r.text()).then(t=>console.log(t.includes('2-working-day response wording')))"
```

Impact:
- AI-search systems can cite the fixed response-time wording even where visible form copy no longer uses it.
- This undermines the no-SLA copy policy and can cause hallucination reinforcement.

Recommendation:
- Remove the fixed response-time bullet unless owner/legal explicitly approves the claim.
- If approved, define exact allowed wording and scope in `verified_claims.md` and legal pages.

Autofix safe? Yes for removal if owner confirms no-SLA policy remains current; otherwise no.  
Needs owner/legal/proof decision? Yes.  
Confidence: High. Verified by source and live production fetch.  
Suggested prompt type: quick fix with proof-policy confirmation.

### F-003

ID: F-003  
Severity: P1  
Category: Proof governance  
Title: Verified-claims governance conflicts with current no-SLA copy policy

Evidence:
- `docs/verified_claims.md:29-31` lists:
  - "2 munkanapon belüli visszajelzés"
  - "1-3 munkanapos első egyeztetési / előkészítési folyamat"
  - "5 munkanapon belüli ajánlati előkészítés..."
- `docs/copy_strategy.md:360-364` states that "2 munkanapon belül / within 2 business days" success wording was removed and should not be reintroduced without owner/legal approval.
- Live production still contains fixed response-time wording as described in F-001.

Source/live path:
- Source: `docs/verified_claims.md`
- Source: `docs/copy_strategy.md`
- Live: ASZF and service pages in F-001

Reproduction:
```powershell
rg -n "2 munkanap|1-3 munkanap|5 munkanap|within 2 business days" docs/verified_claims.md docs/copy_strategy.md
```

Impact:
- Future developers may reintroduce SLA-like copy because the claim still appears approved.
- The proof governance layer and copy strategy give opposite instructions.

Recommendation:
- Decide whether response-time claims are approved public-use facts.
- If not, move them from approved claim list to rejected/requires-approval status.
- If yes, document exact allowed wording, route placement and legal owner approval.

Autofix safe? No.  
Needs owner/legal/proof decision? Yes.  
Confidence: High. Verified by two source documents plus live production drift.  
Suggested prompt type: legal/proof review.

### F-004

ID: F-004  
Severity: P1  
Category: Privacy / analytics governance  
Title: GA4 account-side legal/proof evidence remains pending while privacy v1.3 is live

Evidence:
- `lib/current-privacy-content.ts` v1.3 names Google Analytics 4 as processor/provider and includes transfer wording.
- `docs/legal/analytics-privacy-review.md:82-89` says GA4 Enhanced Measurement/account-side settings remain a separate review item.
- `docs/trust_center/open_decisions.md:25` asks whether GA4 DPA, transfer safeguards, retention, Google Signals, Ads personalization, Ads link and data-sharing configuration have been reviewed and archived.
- Runtime QA passes consent gating, so this is not a technical GA4 bug.

Source/live path:
- Source: `lib/current-privacy-content.ts`
- Source: `docs/legal/analytics-privacy-review.md`
- Source: `docs/trust_center/open_decisions.md`
- Live: `https://www.afm.hu/hu/adatvedelem`, `https://www.afm.hu/en/adatvedelem`

Reproduction:
```powershell
rg -n "GA4|Google Analytics|Enhanced Measurement|DPA|retention|Google Signals|Ads personalization" docs/legal/analytics-privacy-review.md docs/trust_center/open_decisions.md lib/current-privacy-content.ts
npm run qa:analytics -- https://www.afm.hu --allow-production
```

Impact:
- Privacy copy is technically aligned with runtime behavior, but DPO/legal evidence remains incomplete as a governance record.
- If account settings diverge from the privacy text, the notice may become misleading.

Recommendation:
- Archive GA4 DPA / Data Processing Terms acceptance, retention setting, Google Signals status, Ads personalization status, Ads link status and data-sharing settings.
- Update `docs/trust_center/open_decisions.md` after review.

Autofix safe? No.  
Needs owner/legal/proof decision? Yes.  
Confidence: High for governance gap; not a runtime defect.  
Suggested prompt type: legal/proof review.

## P2 findings

| ID | Category | Title |
|---|---|---|
| F-005 | SEO / sitemap | Static sitemap lastModified is stale for many routes |
| F-006 | Structured data | WebSite JSON-LD `inLanguage` overstates partial/noindex locales |
| F-007 | Package hygiene | Duplicate `@playwright/test` devDependency entries |
| F-008 | DB / script safety | Guarded production migrate/push scripts remain high-risk operational commands |
| F-009 | Security hardening | CSP relies on `unsafe-inline` for script/style |
| F-010 | Proof governance | D&B public wording is approved, but Trust Center proof-publication status remains pending |
| F-011 | Legal/source data | `SEO_DATA_PROCESSORS` is stale and omits GA4 |
| F-012 | SEO | News article titles are long |

### F-005

ID: F-005  
Severity: P2  
Category: SEO / sitemap  
Title: Static sitemap lastModified is stale for many routes

Evidence:
- `app/sitemap.ts:23` sets `SITE_LAST_MODIFIED = new Date("2026-05-07T00:00:00.000Z")`.
- The repository has multiple post-May changes: privacy v1.3, Trust Center, references, responsible disclosure, DE/EN news rollout.

Source/live path:
- Source: `app/sitemap.ts`
- Live: `https://www.afm.hu/sitemap.xml`

Reproduction:
```powershell
Get-Content -Raw app/sitemap.ts
node -e "fetch('https://www.afm.hu/sitemap.xml').then(r=>r.text()).then(t=>console.log(t.slice(0,300)))"
```

Impact:
- Search engines get stale freshness signals for static/legal/trust pages.
- Not a blocker, but weakens crawl prioritization after frequent post-launch changes.

Recommendation:
- Use route-specific known publication/update dates or a central content-version map.
- Keep DB-backed news lastModified from `updatedAt/date`, which is already handled separately.

Autofix safe? Partly; date policy needs owner/SEO preference.  
Needs owner/legal/proof decision? No.  
Confidence: High.  
Suggested prompt type: SEO quick fix.

### F-006

ID: F-006  
Severity: P2  
Category: Structured data / i18n  
Title: WebSite JSON-LD `inLanguage` overstates partial/noindex locales

Evidence:
- `app/[locale]/layout.tsx:262-267` emits `WebSite.inLanguage: [...SEO_LOCALES]`.
- Source/live route policy shows HU/EN are full indexable production languages; DE is noindex review; ZH/KO are partial/noindex.
- Production route checks confirm `/de`, `/zh`, `/ko` are `noindex, follow`.

Source/live path:
- Source: `app/[locale]/layout.tsx`
- Live: `https://www.afm.hu/hu` JSON-LD

Reproduction:
```powershell
rg -n "inLanguage|SEO_LOCALES|WebSite" app/[locale]/layout.tsx
node -e "fetch('https://www.afm.hu/de').then(r=>r.text()).then(t=>console.log(t.match(/name=\"robots\" content=\"([^\"]+)/)?.[1]))"
```

Impact:
- Structured data suggests a broader full multilingual website than the indexable public layer supports.
- Can confuse AI/search systems about DE/ZH/KO completeness.

Recommendation:
- Restrict WebSite `inLanguage` to HU/EN, or add a clearly intentional policy for review/noindex locales.

Autofix safe? Yes if SEO owner accepts HU/EN-only.  
Needs owner/legal/proof decision? No.  
Confidence: High.  
Suggested prompt type: SEO quick fix.

### F-007

ID: F-007  
Severity: P2  
Category: Package hygiene  
Title: Duplicate `@playwright/test` devDependency entries

Evidence:
- `package.json` includes both `"@playwright/test": "^1.60.0"` and `"@playwright/test": "^1.57.0"` under `devDependencies`.

Source/live path:
- Source: `package.json`

Reproduction:
```powershell
Get-Content -Raw package.json
```

Impact:
- JSON parsers keep only the last duplicate key, creating ambiguity between intended and actual dependency version.
- Can cause inconsistent local/CI behavior after install.

Recommendation:
- Keep one `@playwright/test` entry and refresh lockfile if needed.

Autofix safe? Yes.  
Needs owner/legal/proof decision? No.  
Confidence: High.  
Suggested prompt type: quick fix.

### F-008

ID: F-008  
Severity: P2  
Category: DB / script safety  
Title: Guarded production migrate/push scripts remain high-risk operational commands

Evidence:
- `package.json` includes:
  - `db:migrate:prod`: guarded by `verify-db-target` with `--allow-production`
  - `db:push:prod`: guarded by `verify-db-target` with `--allow-production`
- Unlike content sync scripts, migrations/pushes do not have dry-run semantics.
- The guard is good; the residual issue is operational blast radius.

Source/live path:
- Source: `package.json`
- Guard source: `scripts/verify-db-target.mjs`

Reproduction:
```powershell
rg -n "db:migrate:prod|db:push:prod|verify-db-target" package.json scripts/verify-db-target.mjs
```

Impact:
- Accidental execution is unlikely because target guard exists, but impact would be high.
- Post-launch teams may misread these as routine commands.

Recommendation:
- Add an extra refusal wrapper, manual confirmation process, or runbook-only policy for production schema commands.
- Keep production content scripts dry-run-first.

Autofix safe? Partly; choose policy first.  
Needs owner/legal/proof decision? No, but owner/devops decision needed.  
Confidence: Medium-high.  
Suggested prompt type: script safety backlog.

### F-009

ID: F-009  
Severity: P2  
Category: Security hardening  
Title: CSP relies on `unsafe-inline` for script/style

Evidence:
- `next.config.ts:7` includes `script-src 'self' 'unsafe-inline'`.
- `next.config.ts:78` includes `style-src 'self' 'unsafe-inline'`.
- Comments explain the current need: JSON-LD / Next runtime inline scripts and inline style usage.

Source/live path:
- Source: `next.config.ts`
- Live header: `Content-Security-Policy` on `https://www.afm.hu/hu`

Reproduction:
```powershell
rg -n "unsafe-inline|Content-Security-Policy" next.config.ts
node -e "fetch('https://www.afm.hu/hu').then(r=>console.log(r.headers.get('content-security-policy')))"
```

Impact:
- Acceptable for launch given framework constraints, but weaker than nonce/hash-based CSP.
- Reduces protection against injected inline script/style payloads.

Recommendation:
- Plan nonce/hash CSP hardening after launch stability.
- Keep GA4 allowlist narrow; do not add Ads/DoubleClick/pagead endpoints.

Autofix safe? No.  
Needs owner/legal/proof decision? No.  
Confidence: High.  
Suggested prompt type: backlog.

### F-010

ID: F-010  
Severity: P2  
Category: Proof governance  
Title: D&B public wording is approved, but Trust Center proof-publication status remains pending

Evidence:
- `docs/verified_claims.md` approves D&B AA High Creditworthy 2026 public wording and explicitly rejects OPTEN/A+ substitution.
- `docs/trust_center/proof_catalog.md:156-171` marks `dnb_aa_creditworthiness` as `pending_review`.
- `docs/trust_center/open_decisions.md:11-12` still asks whether the certificate PDF is public/downloadable and exact Trust Center wording.

Source/live path:
- Source: `docs/verified_claims.md`
- Source: `docs/trust_center/proof_catalog.md`
- Source: `docs/trust_center/open_decisions.md`

Reproduction:
```powershell
rg -n "D&B|Dun|pending_review|OPTEN" docs/verified_claims.md docs/trust_center
```

Impact:
- No public overclaim was found, but governance status is split across documents.
- Future Trust Center expansion could accidentally publish a proof file before owner approval.

Recommendation:
- Decide whether the D&B certificate is internal-only, summary-only, or public-download.
- Align `proof_catalog.md`, `open_decisions.md` and runtime Trust Center inclusion.

Autofix safe? No.  
Needs owner/legal/proof decision? Yes.  
Confidence: High.  
Suggested prompt type: legal/proof review.

### F-011

ID: F-011  
Severity: P2  
Category: Legal/source data  
Title: `SEO_DATA_PROCESSORS` is stale and omits GA4

Evidence:
- `lib/seo-data.ts:314-342` lists Resend, Vercel and Neon processors.
- Privacy v1.3 in `lib/current-privacy-content.ts` now includes Google Analytics 4 (GA4) as processor/provider.

Source/live path:
- Source: `lib/seo-data.ts`
- Source: `lib/current-privacy-content.ts`

Reproduction:
```powershell
rg -n "SEO_DATA_PROCESSORS|Google Analytics 4|GA4" lib/seo-data.ts lib/current-privacy-content.ts
```

Impact:
- If `SEO_DATA_PROCESSORS` is reused for schema/docs later, it can reintroduce stale processor lists.
- Not confirmed as a live rendering bug in this audit.

Recommendation:
- Either update the central processor list or rename it if it is intentionally historical.

Autofix safe? Yes if source owner accepts central data alignment.  
Needs owner/legal/proof decision? Possibly DPO review for exact wording.  
Confidence: Medium.  
Suggested prompt type: docs/source data cleanup.

### F-012

ID: F-012  
Severity: P2  
Category: SEO  
Title: News article titles are long

Evidence from sampled production metadata:
- `/hu/hirek/megujult-az-avenir-weboldala-es-arculata`: title length 74.
- `/en/hirek/megujult-az-avenir-weboldala-es-arculata`: title length 84.
- `/de/hirek/megujult-az-avenir-weboldala-es-arculata`: title length 82.
- Service page titles are mostly within a safer range.

Source/live path:
- Live news article URLs above.

Reproduction:
```powershell
node -e "fetch('https://www.afm.hu/en/hirek/megujult-az-avenir-weboldala-es-arculata').then(r=>r.text()).then(t=>console.log(t.match(/<title>(.*?)<\\/title>/)?.[1]))"
```

Impact:
- Search snippets may truncate titles.
- Not a blocker; article content and route status are good.

Recommendation:
- Shorten article SEO titles while preserving H1/body copy.

Autofix safe? Yes with copy approval.  
Needs owner/legal/proof decision? No.  
Confidence: Medium-high.  
Suggested prompt type: SEO polish.

## P3 backlog

| ID | Category | Title | Recommendation |
|---|---|---|---|
| F-013 | Accessibility QA | No automated axe scan in checked command set | Add axe/Playwright a11y smoke for homepage, service, contact, legal. |
| F-014 | Performance QA | Lighthouse/CWV not measured in this audit | Add scheduled Lighthouse or Vercel Speed Insights review cadence. |
| F-015 | UX | Contact form labels are accessible but mostly visually hidden | Consider visible labels if conversion testing shows field ambiguity. |
| F-016 | Ops monitoring | First `qa:preview` run had transient 500s on expected 404s, later disproved | Monitor if recurring; no current confirmed route bug. |
| F-017 | CSP hardening | Move toward nonce/hash CSP and reduce inline style dependence | Long-term security hardening after UI stabilizes. |

## False positives / disproved findings

| Suspected issue | Result | Evidence |
|---|---|---|
| Production noindex accidentally present | Disproved | `/hu` and `/en` return `index, follow`; production headers have no `X-Robots-Tag: noindex`. |
| HU/EN service pages missing | Disproved | 8 HU + 8 EN service pages returned 200 and are indexable. |
| DE review pages in sitemap/hreflang | Disproved | Sitemap checks show no `/de/szolgaltatasok`, no `/de/hirek`, no `/de/adatvedelem`. |
| ZH/KO service pages exposed | Disproved | `/zh/szolgaltatasok/objektumorzes` returns 404; ZH/KO homepage routes are noindex. |
| GA4 loads before consent or sends PII events | Disproved by QA | `npm run qa:analytics -- https://www.afm.hu --allow-production` passed 16/16. |
| LinkedIn tracking / Insight Tag added | Disproved | Source/header checks show only a public LinkedIn profile link, no LinkedIn scripts/pixels. |
| Admin upload relies only on MIME type | Disproved | `lib/upload-file-signatures.ts` validates PDF/JPEG/PNG/WebP magic bytes. |
| Multiple H1 on sampled pages | Disproved | Sampled home, service, legal and trust pages had one H1. |
| Closed legacy slugs are indexable | Disproved | `/hu/szolgaltatasok/security` and `/en/szolgaltatasok/security` return 404/noindex. |
| First production smoke 500s on closed routes | Not reproduced | Direct fetches and rerun `qa:preview` returned expected 404s and passed 422 checks. |

## Already fixed / no action needed

| Area | Evidence |
|---|---|
| Admin allowlist enforcement | `lib/admin/require-admin.ts` and `auth.ts` enforce `ALLOWED_ADMIN_EMAILS`. |
| Upload file signature validation | `app/api/admin/upload-image/route.ts`, `app/api/admin/upload-pdf/route.ts`, `lib/upload-file-signatures.ts`. |
| Contact rate-limit env compatibility | `lib/rate-limit.ts` supports Upstash and Vercel KV REST env names, fails closed in production. |
| Consent-gated GA4 | `components/analytics/GoogleAnalytics.tsx`, `npm run qa:analytics` pass. |
| Responsible disclosure | `/.well-known/security.txt`, `/hu/felelos-hibabejelentes`, `/en/responsible-disclosure`. |
| Trust Center HU/EN MVP | `/hu/megfelelosegi-kozpont`, `/en/trust-center` return 200/index. |
| AutoWallis reference card | `lib/references.ts`, `components/References.tsx`; no testimonial/performance claim. |
| DE review noindex route policy | DE home/service/legal/news routes render with `noindex, follow` and are excluded from sitemap. |

## Legal / proof decision register

| Decision | Priority | Current status | Owner |
|---|---|---|---|
| Fixed response-time wording: keep, scope, or remove | P1 | Conflicting live/source/docs evidence | Owner + legal/proof |
| GA4 account-side evidence and settings archive | P1 | Runtime works; evidence review pending | DPO / analytics owner |
| D&B certificate publication model | P2 | Public wording approved; Trust Center proof publication pending | Proof owner |
| Liability insurance public summary / policy-number visibility | P2 | Pending review in proof catalog | Legal / proof owner |
| DE legal/news/service final SEO launch | Strategic | Live review/noindex; sitemap/hreflang gated | Owner + SEO + native reviewer |
| CSP nonce/hash hardening | P2/P3 | Not launch-blocking | Engineering |

## Route matrix summary

Production route checks were performed with Node `fetch()` against `https://www.afm.hu`.

| Route class | Actual production status | Robots/indexing | Sitemap/hreflang status | Audit result |
|---|---|---|---|---|
| HU homepage | 200 | index, follow | in sitemap / alternates | OK |
| EN homepage | 200 | index, follow | in sitemap / alternates | OK |
| DE homepage | 200 | noindex, follow | not in sitemap | OK for review mode |
| ZH/KO homepages | 200 | noindex, follow | not in sitemap | OK partial mode |
| 8 HU service pages | 200 | index, follow | in sitemap / HU-EN alternates | OK |
| 8 EN service pages | 200 | index, follow | in sitemap / HU-EN alternates | OK |
| 8 DE service pages | 200 | noindex, follow | not in sitemap / not hreflang | OK review mode |
| ZH service detail sample | 404 | noindex | not in sitemap | OK |
| HU/EN legal pages | 200 | index, follow | in sitemap / HU-EN alternates | OK |
| DE legal pages | 200 | noindex, follow | not in sitemap / not hreflang | OK review mode; note this is current prod state |
| EN legal aliases `/en/privacy`, `/en/terms`, `/en/imprint` | 404 | noindex | not in sitemap | OK |
| HU/EN news index + launch article | 200 | index, follow | in sitemap / HU-EN alternates | OK |
| DE news index + launch article | 200 | noindex, follow | not in sitemap / not hreflang | OK review mode |
| ZH/KO news | 404 | noindex | not in sitemap | OK |
| HU/EN Trust Center | 200 | index, follow | in sitemap / alternates | OK |
| DE Trust Center | 404 | noindex | not in sitemap | OK |
| HU/EN disclosure | 200 | index, follow | not required in sitemap | OK |
| DE/ZH/KO disclosure | 404 | noindex | not in sitemap | OK |
| Legacy service slugs | 404 | noindex | not in sitemap | OK |

## Locale status matrix

| Locale | Homepage | Services | Legal | News | Trust Center | Indexing status | Notes |
|---|---|---|---|---|---|---|---|
| HU | live | 8 live | live | live | live | indexable | Primary authoritative language |
| EN | live | 8 live | live under Hungarian legal slugs | live | live | indexable | Full production layer |
| DE | live | 8 live review | legal live review | news live review | closed | noindex/review | Not final SEO launch |
| ZH | partial live | closed | closed | closed | closed | noindex/partial | No sitemap/hreflang |
| KO | partial live | closed | closed | closed | closed | noindex/partial | No sitemap/hreflang |

## Trust Center proof matrix

| Proof / claim | Runtime status | Governance status | Audit result |
|---|---|---|---|
| ISO 9001 | Public Trust Center summary + certificate asset | Approved public proof | OK |
| ISO 27001 | Public Trust Center summary + certificate asset | Approved public proof | OK |
| Security activity licence | Public legal/proof summary | Approved legal/proof context | OK |
| Security technology regulated activity | Public legal/proof summary | Approved legal/proof context | OK |
| Private investigation licence | Legal-only/proof context | Explicitly not marketing/service CTA | OK |
| D&B AA High Creditworthy 2026 | Homepage/stat wording allowed; Trust Center publication pending | Split: verified wording approved, proof publication pending | P2 decision |
| Professional liability insurance | Legal notice context; public Trust Center inclusion pending | Pending proof/legal review | OK, do not expand yet |
| AutoWallis Pest reference | Public reference card | Approved proof-safe reference | OK |
| Google Analytics processor notice | Privacy v1.3 public | Runtime verified, account-side evidence pending | P1 governance |
| DPA/SCC/LIA evidence | Not public | Internal-only | OK |

## Security audit

Production headers on `/hu`:
- HSTS: `max-age=63072000; includeSubDomains`
- CSP: present, narrow GA4 allowlist, no Ads/DoubleClick/pagead/googleadservices
- X-Frame-Options: `DENY`
- frame-ancestors: `none`
- X-Content-Type-Options: `nosniff`
- Referrer-Policy: `strict-origin-when-cross-origin`
- Permissions-Policy: camera/microphone/geolocation/payment/usb disabled
- COOP/CORP: present
- Production noindex header: absent

Security posture is strong. No confirmed P0/P1 security bug found. Main hardening backlog is CSP `unsafe-inline` and continued operational discipline around production DB commands.

## Code / architecture audit

The codebase has clear separation between:
- locale routing helpers (`lib/news-routing.ts`, `lib/legal-routes.ts`, `lib/trust-center-routes.ts`);
- runtime content/data modules;
- guarded admin helpers;
- QA scripts.

The strongest architecture pattern is route-readiness being expressed in helpers and mirrored by sitemap/hreflang behavior. The main code hygiene issue is duplicate dependency metadata and legacy source drift around old legal/i18n terms.

## DB / script safety audit

Observed safety controls:
- `scripts/verify-db-target.mjs` verifies staging/production Neon endpoints and redacts DB URL output.
- Production target requires `--allow-production`.
- Broad production seed scripts are refused via `scripts/refuse-unsafe-db-write.mjs`.
- Service/display/related/import/cert scripts use dry-run/apply patterns where relevant.

Residual risk:
- Production schema commands exist and are guarded, but should be treated as manual runbook-only operations.

No DB writes, migrations, seeds or imports were run during this audit.

## Analytics / consent audit

`npm run qa:analytics -- https://www.afm.hu --allow-production` passed 16/16.

Confirmed behavior:
- no GA before consent;
- reject persists and blocks GA;
- accept loads direct GA4;
- collect/pageview behavior is tested with interception;
- contact and service-quote events are PII-guarded;
- no GTM;
- no LinkedIn Insight Tag;
- CSP only allows GA4/tag domains, not Ads/DoubleClick/pagead.

Governance gap remains account-side evidence/settings review, not runtime behavior.

## SEO audit

Positive:
- HU/EN indexable pages are present and sitemaped.
- DE review pages are noindex and excluded from sitemap/hreflang.
- ZH/KO closed layers do not leak into sitemap.
- Canonicals sampled correctly.
- Service SEO titles/descriptions are mostly reasonable.

Findings:
- Static sitemap lastModified is stale.
- News article titles are long.
- WebSite JSON-LD language scope is broader than the final indexable site.

## JSON-LD / structured data audit

Positive:
- `components/JsonLd.tsx` safely stringifies JSON-LD and escapes dangerous characters.
- Organization sameAs uses only the official LinkedIn profile.
- No review/rating/testimonial schema was found.
- ISO credentials are represented carefully.

Finding:
- WebSite `inLanguage` should not imply full production readiness for DE/ZH/KO.

## LLM / AI-search / GEO audit

Positive:
- `llms.txt` and `llms-full.txt` exist and describe GA4/Trust Center route status.
- No GTM/LinkedIn Insight/Ads claim appears as active tracking.
- LinkedIn profile is factual.

Finding:
- `llms-full.txt` contains stale fixed response-time wording. This is the most important AI-search risk.

## Content / copy / i18n audit

Positive:
- HU/EN service labels are consistent.
- DE service/legal/news review-mode status is coherent.
- Private investigation remains legal/proof context, not public service marketing.
- AutoWallis reference is not a testimonial.

Finding:
- Fixed response-time text remains live on ASZF and two service pages.
- The same legal wording appears in old i18n sources and should not be left as a future reimport trap.

## Legal / privacy / proof audit

Positive:
- Privacy v1.3 clearly describes GA4 consent gating and no PII in analytics.
- security.txt and responsible disclosure are present.
- Trust Center avoids unapproved proof-document publication.

Findings:
- Response-time governance conflict needs owner/legal/proof decision.
- GA4 account-side evidence review remains open.
- D&B proof status needs final Trust Center publication decision.

## Accessibility / UX audit

Positive source evidence:
- skip-to-content link exists;
- focus-visible styles exist for contact fields, FAQ summaries, cards and footer/social controls;
- contact form has labels and accessible error/status states;
- service quote CTA moves focus to first field and avoids PII analytics.

Not verified in this pass:
- automated axe scan;
- contrast measurements;
- mobile visual screenshots.

## Performance audit

Build result is healthy: Next 16 build completed with 75 static pages. The site is mostly static for public routes, with dynamic API/admin surfaces separated.

Not verified:
- Lighthouse performance;
- field Core Web Vitals;
- visual LCP/CLS measurements.

## Operations / QA audit

Commands passed:
- TypeScript
- ESLint
- unit tests
- copy guard
- production route smoke
- analytics QA
- build
- npm audit

One first `qa:preview` run showed 28 failures where expected-404 routes returned 500, but direct independent fetches and a second full smoke run returned expected 404s and passed. This is recorded as not confirmed; monitor only if recurring.

## Recommended sprint order

| Sprint | Priority | Scope | Suggested prompts |
|---|---|---|---|
| Sprint 1 | P1 | Remove/approve fixed response-time wording across ASZF, service process rows, `llms-full.txt`, `verified_claims.md`. | legal/proof review + content quick fix |
| Sprint 1 | P1 | Archive GA4 account-side DPO evidence and close open decision. | legal/proof review |
| Sprint 2 | P2 | SEO technical polish: sitemap lastModified, WebSite `inLanguage`, news title length. | SEO quick fix |
| Sprint 2 | P2 | Script/package hygiene: duplicate Playwright dependency, production schema command guard policy. | quick fix + script safety |
| Sprint 3 | P2/P3 | Add Lighthouse/axe/visual regression monitoring and start CSP nonce/hash plan. | backlog |

## Suggested next Codex prompts

1. "Run a legal/proof-safe response-time cleanup pass: remove unapproved fixed response-time wording from ASZF, two service process rows, llms-full and verified_claims, without changing unrelated service copy."
2. "Close the GA4 account-side privacy governance checklist in docs after owner/DPO confirms Google Analytics settings."
3. "Run SEO technical polish for sitemap lastModified, WebSite JSON-LD language scope and news SEO title lengths."
4. "Run a package/script safety hygiene pass: remove duplicate Playwright dependency and add an extra manual gate for production schema commands."
5. "Add automated axe/Lighthouse smoke checks for homepage, one service page, contact form and Trust Center."

## Evidence and commands run

Repository state:
```powershell
git branch --show-current
git status --short
git log --oneline -8
```

Static/build/QA:
```powershell
npx tsc --noEmit
npm run lint
npm run test
npm run qa:copy
npm run build
npm run qa:preview -- https://www.afm.hu --allow-production
npm run qa:analytics -- https://www.afm.hu --allow-production
npm audit --omit=dev
```

Production route/header/content probes:
```powershell
node -e "fetch('https://www.afm.hu/hu').then(r=>console.log(r.status, r.headers.get('content-security-policy')))"
node -e "fetch('https://www.afm.hu/sitemap.xml').then(r=>r.text()).then(t=>console.log(t.includes('/de/szolgaltatasok/objektumorzes')))"
node -e "fetch('https://www.afm.hu/llms-full.txt').then(r=>r.text()).then(t=>console.log(t.includes('2-working-day response wording')))"
```

Source probes:
```powershell
rg -n -C 2 "2-working-day|2 munkanap|2 business days|2 Werktagen|Visszajelzés 2|within 2|2 working" public/llms-full.txt public/llms.txt lib/seo-data.ts lib/i18n/hu.ts lib/i18n/en.ts lib/legal-content.ts lib/current-privacy-content.ts scripts/seed-pilot-objektumorzes.ts scripts/seed-pilot-portaszolgalat.ts docs/verified_claims.md docs/trust_center/proof_catalog.md docs/copy_strategy.md docs/post_launch_backlog.md
rg -n "pending_review|D&B|Dun|insurance|liability|Google Analytics|GA4|DPA|DPF|SCC|OPTEN|private investigation|magánnyomoz" docs/trust_center docs/verified_claims.md docs/legal/analytics-privacy-review.md lib/trust-center-content.ts lib/current-privacy-content.ts lib/legal-content.ts
rg -n "sameAs|inLanguage|WebSite|Organization|ProfessionalService|SecurityService|JsonLd|EducationalOccupationalCredential" app/[locale]/layout.tsx app/[locale]/page.tsx app/[locale]/szolgaltatasok/[slug]/page.tsx components/JsonLd.tsx lib/seo-data.ts
rg -n "unsafe-inline|Content-Security-Policy|googletagmanager|google-analytics|doubleclick|googleadservices|LinkedIn|linkedin" next.config.ts components/analytics lib/analytics public/llms-full.txt public/llms.txt
```

## Final go/no-go recommendation

No confirmed P0 blocker was found. The site can remain live, but the fixed response-time wording should be treated as a P1 cleanup because it is both live and present in AI/proof governance surfaces. The best next move is a narrow legal/proof-safe cleanup pass, not a broad service rewrite.
