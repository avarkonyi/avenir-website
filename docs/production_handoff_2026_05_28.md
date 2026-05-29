# Avenir Website Production Handoff — 2026-05-28

This file is the single handoff document for another ChatGPT thread or a new
developer. It summarizes the current production state, architecture, safety
rules, open backlog, and the exact areas that matter after launch.

Canonical roadmap and backlog documents:

- `docs/product_roadmap.md`
- `docs/post_launch_backlog.md`
- `docs/project_handover_avenir_website.md`

Repository:

`C:\Users\andra\avenir-website`

Production URL:

https://www.afm.hu

Current branch at handoff time:

`main`

Recent commits at handoff time:

- `d108f3c style(footer): add LinkedIn icon link`
- `7cce7c8 content(entity): add official LinkedIn profile`
- `062d03d fix(analytics): use standard gtag bootstrap`
- `1f037b9 fix(analytics): send explicit GA4 page views`
- `e44277c test(analytics): assert GA4 collect flow`
- `61df2c2 docs(launch): update post-launch translation and runbook notes`
- `8168ea9 content(proof): replace creditworthiness claim with D&B AA`
- `7131b28 test(analytics): add consent-gated GA4 QA`
- `86027b9 test(analytics): add consent-gated GA4 QA`
- `e560679 fix(analytics): allow GA4 endpoints in CSP`
- `61e5e81 feat(analytics): add consent-gated GA4 tracking`
- `c59f769 fix(nav): prevent unfinished locale 404 flows`

Important current working tree note:

There is an uncommitted docs-only synchronization pass in progress at the time
this handoff file was created. Check `git status --short` before starting.
The docs-only changes update README, AGENTS, roadmap, architecture, runbook,
copy/proof docs, analytics privacy review, service playbook and translation
notes to reflect the live HU/EN production state.

Validation already run for the docs-only sync:

```bash
git diff --check
```

Result: passed.

No code/runtime changes were made in that docs-only pass.

---

## 1. Production State

The public website is live at:

https://www.afm.hu

Production-live scope:

- HU homepage: `/hu`
- EN homepage: `/en`
- 8 HU service detail pages
- 8 EN service detail pages
- HU legal pages:
  - `/hu/adatvedelem`
  - `/hu/aszf`
  - `/hu/impresszum`
- EN legal pages under Hungarian legal slugs:
  - `/en/adatvedelem`
  - `/en/aszf`
  - `/en/impresszum`
- HU article/news layer:
  - `/hu/hirek`
  - `/hu/hirek/[slug]` when article readiness passes
- `/sitemap.xml`
- `/robots.txt`
- `/llms.txt`
- `/llms-full.txt`

Production sitemap state:

- includes HU/EN homepages;
- includes HU/EN legal routes;
- includes ready HU/EN service detail routes;
- includes ready HU article routes;
- excludes DE/ZH service detail routes;
- excludes DE/ZH legal routes;
- excludes DE/ZH news routes;
- excludes legacy service slugs;
- excludes admin/API/internal routes.

Indexing state:

- production noindex is absent for HU/EN public pages;
- preview/staging still receive noindex/noindex-nofollow protections;
- DE/ZH homepage/partial-localization surfaces are not production-ready for
  service/legal/news detail and should remain noindexed/excluded from sitemap
  until full localization exists.

DE/ZH state:

- DE/ZH are homepage/partial-localization surfaces only.
- Do not create public DE/ZH service, legal, or news detail flows unless the
  route/content/review policy is explicitly completed.
- Do not link users to non-ready DE/ZH routes.

---

## 2. Canonical Service Layer

There are exactly 8 canonical service slugs.

| # | HU label | EN label | Slug | Legacy alias |
|---:|---|---|---|---|
| 1 | Élőerős objektumőrzés | On-site Security Guarding | `objektumorzes` | `security` |
| 2 | Recepciós és portaszolgálat | Reception and Gatehouse Services | `portaszolgalat` | `reception` |
| 3 | Biztonságtechnika | Security Technology | `biztonsagtechnika` | `building` |
| 4 | Távfelügyelet és vonulószolgálat | Remote Monitoring and Response Service | `tavfelugyelet-vonuloszolgalat` | `technical` |
| 5 | Próbavásárlás és szolgáltatásaudit | Mystery Shopping and Service Audit | `mystery-shopping-helyszini-audit` | `mystery` |
| 6 | Rendezvénybiztosítás | Event Security | `rendezvenybiztositas` | `cleaning` |
| 7 | Hard FM | Hard FM | `hard-fm` | `hardfm` |
| 8 | Soft FM | Soft FM | `soft-fm` | `green` |

HU service URLs:

- `/hu/szolgaltatasok/objektumorzes`
- `/hu/szolgaltatasok/portaszolgalat`
- `/hu/szolgaltatasok/biztonsagtechnika`
- `/hu/szolgaltatasok/tavfelugyelet-vonuloszolgalat`
- `/hu/szolgaltatasok/mystery-shopping-helyszini-audit`
- `/hu/szolgaltatasok/rendezvenybiztositas`
- `/hu/szolgaltatasok/hard-fm`
- `/hu/szolgaltatasok/soft-fm`

EN service URLs:

- `/en/szolgaltatasok/objektumorzes`
- `/en/szolgaltatasok/portaszolgalat`
- `/en/szolgaltatasok/biztonsagtechnika`
- `/en/szolgaltatasok/tavfelugyelet-vonuloszolgalat`
- `/en/szolgaltatasok/mystery-shopping-helyszini-audit`
- `/en/szolgaltatasok/rendezvenybiztositas`
- `/en/szolgaltatasok/hard-fm`
- `/en/szolgaltatasok/soft-fm`

Legacy service detail URLs should remain unavailable unless a redirect policy
is explicitly approved later. Legacy aliases remain useful for contact prefill
and notification-label fallback only.

Service detail publication rule:

A service detail page is public only if the requested locale has required
localized fields in the DB and the row is active/published. Do not infer
readiness from static labels alone.

Required service-page structure:

1. H1 / label / breadcrumb;
2. hero value proposition;
3. body / long description;
4. use cases / best-fit situations;
5. included items and process steps;
6. trust items, related services, FAQ and CTA.

Related services:

- stored in `relatedServiceSlugs`;
- canonical slugs only;
- no self-links;
- no legacy slugs;
- no everything-to-everything map.

---

## 3. Main Architecture

Framework and hosting:

- Next.js App Router
- TypeScript
- Drizzle ORM
- Neon PostgreSQL
- Vercel
- Vercel Blob for admin uploads
- NextAuth v5 with Microsoft Entra ID
- Resend for email notifications
- Upstash/Vercel KV-compatible Redis REST rate limiter
- Direct GA4 analytics, consent-gated, not GTM

Important app routes:

- `app/[locale]/page.tsx`: locale homepage
- `app/[locale]/szolgaltatasok/[slug]/page.tsx`: service detail pages
- `app/[locale]/hirek/page.tsx`: HU-first news index
- `app/[locale]/hirek/[slug]/page.tsx`: HU-first news detail
- `app/[locale]/adatvedelem/page.tsx`: privacy/legal page
- `app/[locale]/aszf/page.tsx`: terms/legal page
- `app/[locale]/impresszum/page.tsx`: impressum/legal page
- `app/api/contact/route.ts`: public contact form API
- `app/api/admin/upload-image/route.ts`: admin image upload
- `app/api/admin/upload-pdf/route.ts`: admin PDF upload
- `app/sitemap.ts`: sitemap generation
- `app/robots.ts`: robots policy
- `proxy.ts`: preview/staging noindex and routing protection

Important shared code:

- `lib/db/schema.ts`: Drizzle schema
- `lib/db/queries/services.ts`: service readiness/public service queries
- `lib/service-detail-links.ts`: locale-aware ready service href helper
- `lib/legal-routes.ts`: legal route locales, slugs and alternates
- `lib/i18n/*.ts`: static localized homepage/card/contact/footer text
- `lib/seo-data.ts`: SEO, schema, official profile, proof-sensitive SEO text
- `lib/contact-schema.ts`: contact form validation
- `lib/rate-limit.ts`: contact rate limiter
- `lib/admin/require-admin.ts`: shared admin allowlist helper
- `lib/upload-file-signatures.ts`: upload magic-byte validation
- `lib/analytics/consent.ts`: analytics consent storage/events
- `lib/analytics/events.ts`: PII-safe analytics event helper

Important components:

- `components/Nav.tsx`
- `components/Hero.tsx`
- `components/Services.tsx`
- `components/Footer.tsx`
- `components/Contact.tsx`
- `components/News.tsx`
- `components/PartnerLogoStrip.tsx`
- `components/analytics/AnalyticsConsentBanner.tsx`
- `components/analytics/GoogleAnalytics.tsx`
- `components/analytics/CookieSettingsButton.tsx`
- `components/analytics/TrackedContactLink.tsx`
- `components/analytics/TrackedServiceCardLink.tsx`
- `components/analytics/TrackedServiceCtaLink.tsx`

High-level request flow:

```text
Visitor
  -> /hu or /en homepage
  -> service cards/footer links use DB-backed ready locale+slug paths
  -> /hu|/en/szolgaltatasok/[slug]
  -> CTA /<locale>?service=<canonical-slug>#contact
  -> Contact component normalizes service query
  -> POST /api/contact
     -> origin check
     -> body-size guard
     -> JSON parse
     -> Zod validation
     -> honeypot
     -> Redis/KV rate limit
     -> DB message insert
     -> Resend notification fail-soft after DB storage
```

---

## 4. SEO, Sitemap, Hreflang and AI Search

SEO files/routes:

- `app/sitemap.ts`
- `app/robots.ts`
- `app/[locale]/layout.tsx`
- `app/[locale]/szolgaltatasok/[slug]/page.tsx`
- `public/llms.txt`
- `public/llms-full.txt`
- `lib/seo-data.ts`

Homepage metadata:

- HU and EN are indexable.
- DE/ZH are partial surfaces and should remain noindexed/excluded from sitemap
  until ready.
- Homepage hreflang currently advertises HU/EN and x-default to HU.

Service metadata:

- canonical URL uses the requested ready locale;
- hreflang advertises only ready locales for that service;
- current service layer should include HU and EN service alternates;
- x-default points to HU service URL where HU is ready;
- Service JSON-LD and BreadcrumbList are rendered;
- FAQPage JSON-LD only where visible FAQ renders.

Legal metadata:

- legal routes are reviewed/published for HU/EN only;
- legal hreflang should include only HU, EN and x-default;
- do not advertise `/en/privacy`, `/en/terms`, `/en/imprint`, DE/ZH legal
  routes or other non-existing legal aliases.

AI search files:

- `llms.txt` and `llms-full.txt` are public AI/retrieval grounding files;
- include canonical public URLs and proof-safe facts only;
- include official LinkedIn profile;
- include D&B AA High Creditworthy 2026 as Dun & Bradstreet claim;
- do not include unapproved client/partner/testimonial/case-study claims;
- do not call D&B AA an OPTEN A+ claim.

---

## 5. Analytics and Consent

Analytics implementation:

- Direct GA4 `gtag.js`, not Google Tag Manager.
- Env var: `NEXT_PUBLIC_GA4_ID`.
- Current production measurement ID: `G-W1TRX8R1J3`.
- GA4 does not load before analytics consent.
- Rejecting consent keeps GA4 blocked.
- Missing `NEXT_PUBLIC_GA4_ID` disables GA4 without breaking the site.
- Cookie settings in the footer reopens consent choice.

GA4 loader behavior:

- initializes `window.dataLayer`;
- defines `window.gtag`;
- loads `https://www.googletagmanager.com/gtag/js?id=<measurementId>` only
  after consent;
- uses `send_page_view: false`;
- sends explicit `page_view` after script load;
- sends route-change page views only after consent and script load;
- does not send PII.

Allowed events:

- `page_view`
- `contact_submit_success`
- `contact_submit_error`
- `phone_click`
- `email_click`
- `service_cta_click`
- `special_service_option_selected`

Forbidden analytics payload:

- name;
- email;
- phone;
- company;
- message body;
- free-text form fields;
- explicit IP address;
- secrets.

Automated QA:

```bash
npm run qa:analytics
npm run qa:analytics -- https://<preview-url>
npm run qa:analytics -- https://www.afm.hu --allow-production
```

The QA wrapper:

- uses Playwright;
- blocks production unless `--allow-production` or
  `ANALYTICS_QA_ALLOW_PRODUCTION=1`;
- mocks `/api/contact` so no real DB write/email happens;
- tests before-consent, reject, accept, route change, business events, PII
  absence and CSP domain scope;
- includes a real-script smoke test that allows `gtag.js` and intercepts GA
  collect with 204 so no real GA test hit is sent.

CSP policy:

- allow direct GA4 endpoints only;
- do not add GTM;
- do not add Google Ads, DoubleClick, pagead, Floodlight, Google Fonts or Tag
  Assistant badge assets just because debug tools request them.

---

## 6. Contact API and Rate Limiting

Contact API:

`app/api/contact/route.ts`

Contact flow:

1. production origin check;
2. request body size guard;
3. JSON parse;
4. Zod validation;
5. honeypot `_website`;
6. IP-based rate limit;
7. DB insert into `messages`;
8. Resend notification email.

Storage rule:

- DB insert is primary storage.
- If DB insert fails, return error.
- Notification email is fail-soft after DB storage.

Rate limiter:

`lib/rate-limit.ts`

Supported env name pairs:

- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

or:

- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`

Do not use:

- `KV_REST_API_READ_ONLY_TOKEN`
- `REDIS_URL`
- `KV_URL`

unless the Redis client is explicitly changed to support them.

Production behavior:

- production fails closed if Redis/KV REST URL/token are missing or unusable;
- local and preview may use in-memory fallback with a non-secret warning;
- IP is hashed before Redis key use;
- do not log tokens, full Redis URLs, message body, phone, email or secrets.

Open item:

- production contact-form smoke should be considered pending unless a
  non-sensitive real test submission has been separately recorded.

---

## 7. Admin Security and Uploads

Admin auth:

- NextAuth v5 with Microsoft Entra ID.
- Shared helper: `lib/admin/require-admin.ts`.
- The helper calls `auth()`, requires `session.user.email`, lowercases it and
  checks it against `ALLOWED_ADMIN_EMAILS`.
- The allowlist must not be leaked to the client.

Admin areas using `requireAdmin()`:

- dashboard layout/page;
- services actions;
- partners actions;
- news actions;
- messages actions;
- certifications actions;
- positions actions;
- settings actions;
- upload image API;
- upload PDF API.

Upload protection:

- image upload: `app/api/admin/upload-image/route.ts`
- PDF upload: `app/api/admin/upload-pdf/route.ts`
- helper: `lib/upload-file-signatures.ts`

Magic-byte validation:

- PDF: `%PDF` (`25 50 44 46`)
- JPEG: `FF D8 FF`
- PNG: `89 50 4E 47 0D 0A 1A 0A`
- WEBP: `RIFF....WEBP`

Rules:

- do not trust client MIME only;
- preserve size limits;
- preserve folder/path allowlists;
- do not add SVG support;
- do not log binary contents, file contents, secrets or unnecessary user data.

---

## 8. DB, Neon and Production Launch Data

DB stack:

- Neon PostgreSQL
- Drizzle ORM
- DB schema: `lib/db/schema.ts`
- Migrations: `drizzle/`

Known Neon endpoints:

- staging endpoint: `ep-twilight-sound-al2b7jsb`
- production endpoint: `ep-young-meadow-aln5ux5m`

Known Neon branches:

| Purpose | Branch ID | Branch name |
|---|---|---|
| Production/main | `br-divine-silence-almpoz68` | production/main |
| Staging | `br-round-fog-al4isa1i` | staging |
| Backup before launch | `br-polished-tooth-al7hswta` | `prod-backup-before-afm-launch-20260524-1922` |
| Preserved old production | `br-super-art-alhsoh24` | `prod-preserved-during-afm-launch-20260524-1930` |

Launch mechanism:

- Production DB was restored from the approved staging Neon branch.
- This was a Neon branch-level restore, not app seed/import/migration writes.
- Do not assume future production DB writes are approved because launch is
  complete.

DB target safety:

- `scripts/verify-db-target.mjs` checks target endpoint.
- staging target must match `ep-twilight-sound-al2b7jsb`.
- production target must match `ep-young-meadow-aln5ux5m`.
- production requires explicit `--allow-production`.
- never print full `DATABASE_URL`.

Important local rule:

After any production DB operation, restore `.env.local` to staging and verify:

```bash
node scripts/verify-db-target.mjs --target staging --runtime-only
```

Production verification command:

```bash
node scripts/verify-db-target.mjs --target production --allow-production --runtime-only
```

Do not run production migrations/seeds/imports unless explicitly approved.

---

## 9. Important Package Scripts

Static/local checks:

```bash
npx tsc --noEmit
npm run lint
npm run build
git diff --check
```

Preview/production smoke:

```bash
npm run qa:preview -- https://<preview-url>
npm run qa:preview -- https://www.afm.hu --allow-production
```

Analytics QA:

```bash
npm run qa:analytics
npm run qa:analytics -- https://<preview-url>
npm run qa:analytics -- https://www.afm.hu --allow-production
```

DB target verification:

```bash
npm run db:verify-target
npm run db:verify-target:prod
```

Production DB scripts exist, but require explicit approval before use:

```bash
npm run db:import-service-translations:prod -- --locale en --file docs/translations/public_site_translation_matrix_en.csv --include-draft --include-legal-review --dry-run
npm run db:update-service-display-copy:prod -- --dry-run
npm run db:update-service-related-slugs:prod -- --dry-run
npm run db:sync-pilot-service-content:prod -- --dry-run
```

Never skip dry-run before apply.

---

## 10. Claims, Proof and Governance

Source of truth:

`docs/verified_claims.md`

Approved facts that should not be questioned as false:

- ISO 9001
- ISO 27001
- Hungarian security activity licence / vagyonvédelmi engedély
- 24/7 dispatch / monitoring background
- 30+ active sites
- 200+ professionals / staff
- D&B AA High Creditworthy 2026

Review these facts only for:

- placement;
- scope-safe wording;
- no SLA interpretation;
- no overclaim;
- no excessive repetition;
- HU/EN consistency;
- proof-policy alignment.

D&B / OPTEN rule:

- D&B AA High Creditworthy 2026 is a Dun & Bradstreet proof item.
- Certificate facts:
  - issuer: Dun & Bradstreet;
  - label: AA High Creditworthy 2026;
  - company: Avenir Facility Ltd.;
  - tax number: 26395124-2-41;
  - D-U-N-S: 401251621;
  - date: 26 May 2026;
  - proof file: `20260526 Avenir Facility Kft a.pdf`.
- This is not OPTEN A+ proof.
- Do not call it OPTEN unless a separate OPTEN-specific document exists and is
  reviewed.
- At handoff time, the proof PDF is referenced but not stored in the repo.

LinkedIn:

- official profile:
  https://www.linkedin.com/company/avenir-facility-management
- allowed as footer profile link, JSON-LD `sameAs`, llms entity/profile link;
- not a proof/certification/client/partner/testimonial claim;
- no LinkedIn Insight Tag, pixel, script or UTM parameters.

Security licence number:

- the exact licence number may appear in legal/proof/tender/onboarding context;
- do not place the exact licence number in service body copy, trust cards,
  service card descriptions or related-service descriptions.

Partner logo strip:

- public logo strip is proof-gated;
- logo requires active/published row, logo asset, opt-in and approval metadata;
- do not add partner/client relationship claims or schema from logo strip alone.

---

## 11. Special Services Boundary

Special Services are future website-scope concepts, not current public routes
and not AOS modules.

Planned/discovery-only candidates:

- Helyszíni biztonsági audit / Site Security Audit
- Adatvédelmi és GDPR-folyamatfelmérés / Data Protection and GDPR Process Review
- Magánnyomozás / Private Investigation

Naming decision:

- use `Adatvédelmi és GDPR-folyamatfelmérés`, not `GDPR audit`;
- use `Data Protection and GDPR Process Review`, not `GDPR Audit`.

Guardrails:

- no routes now;
- no sitemap entries now;
- no DB schema now;
- no seed scripts now;
- no service copy now unless explicitly requested;
- legal/proof/content review required before publication;
- standard contact form must warn against sensitive personal-data submissions.

Mystery Shopping remains separate from Private Investigation.

---

## 12. AOS Boundary

AOS is a separate internal application track, not website `/admin`.

Do not implement AOS modules inside `avenir-website` unless explicitly
approved.

AOS belongs to the separate `avenir-aos` repository/application.

Website production release must not assume:

- AOS deploy;
- AOS migrations;
- AOS seed data;
- AOS production readiness.

Future AOS examples:

- AOS Guard Log / Elektronikus őrnapló;
- AI Report Assistant;
- internal operations workflows;
- proposal generation;
- document workflows.

These must stay compliance-safe and separate from the public website.

---

## 13. Open Backlog

P1 / near-term:

- Production contact-form smoke with non-sensitive test content, if not already
  verified outside this repo.
- Google Search Console sitemap submission/status.
- Bing Webmaster Tools sitemap submission/status.
- GA4 Realtime and consented event check.
- HU/EN privacy policy version sync and DPO/legal review.
- DE/ZH public-flow cleanup if any link to non-ready route reappears.
- EN news route/content policy: hide EN news or clearly link to HU until EN
  article content exists.
- Mobile overflow review on real devices/narrow viewports.
- Consent banner placement review on mobile.
- Partner logo proof population.
- D&B/OPTEN governance finalization.

P2:

- Vercel Analytics / Speed Insights decision.
- Periodic Lighthouse and accessibility monitoring.
- Sitemap `lastModified` from reliable DB `updatedAt`.
- CSP nonce/hash hardening.
- NextAuth beta/stability review.
- Slug/canonical helper consolidation.
- More automated tests beyond smoke and analytics QA.
- Trust Center / megfelelőségi page after proof assets are organized.
- Public document library / dokumentumtár concept for reviewed documents.
- Etikai kódex / Code of Ethics publication plan.
- Panaszkezelési process / complaint handling public summary.
- Public privacy/compliance document map for procurement teams.
- 3-5 HU tudástár articles.

P3 / future:

- DE/ZH full localization.
- EN news content/routes.
- Sector landing pages.
- Special Services content layer.
- Supplier/procurement documentation pack.
- ESG/sustainability documentation layer, only with proof-safe wording.
- Whistleblowing / ethics reporting route only after legal review and process
  ownership are clear.
- LinkedIn Insight Tag only if separate marketing and consent decision is made.

---

## 14. Development Roadmap

This is the broader product/content roadmap that should travel with the
handoff. It is intentionally split into phases so another developer does not
mix public website polish, legal/compliance documents, future trust pages and
AOS product work.

### Phase 0 — Post-launch stabilization

Goal: make sure the live HU/EN website is stable, measurable and indexable.

Work:

- production contact-form smoke with non-sensitive test content;
- `qa:preview` and `qa:analytics` against production when explicitly intended;
- Search Console sitemap submission and coverage review;
- Bing Webmaster Tools sitemap submission and coverage review;
- GA4 Realtime and event validation after accepted analytics consent;
- Vercel logs review for contact, admin uploads and public route errors;
- mobile overflow and consent banner placement review;
- EN news and DE/ZH public-flow cleanup if any broken links reappear.

Exit criteria:

- contact form works in production;
- no production noindex on HU/EN public pages;
- sitemap accepted by search tools;
- consented GA4 page_view and business events are visible;
- no obvious public 404 navigation flows for ready locales.

### Phase 1 — Legal, privacy and governance cleanup

Goal: align the public legal/privacy layer with the production site behavior.

Work:

- HU/EN Privacy Policy version sync;
- DPO/legal review for analytics wording;
- review GA4 Enhanced Measurement account settings, especially form
  interactions;
- confirm contact form sensitive-data warning wording;
- review `Magánnyomozás` / Private Investigation dropdown handling and warning;
- decide how DE/ZH legal links should behave until full legal translations
  exist;
- document owner decision for OPTEN/A+ public-use governance;
- preserve D&B AA High Creditworthy 2026 as a separate Dun & Bradstreet proof
  item.

Exit criteria:

- legal/privacy pages match actual consent/contact behavior;
- public proof language does not confuse D&B AA with OPTEN A+;
- special-service contact risks are documented;
- no unreviewed legal aliases are advertised.

### Phase 2 — Trust Center and public document library

Goal: create a structured public trust/compliance area for procurement,
tenders and AI-search grounding.

Potential public surfaces:

- Trust Center / Megfelelőségi központ page;
- document library / dokumentumtár;
- certificates and licences overview;
- official company profile links;
- privacy and data-protection documents;
- complaint handling summary;
- Code of Ethics / Etikai kódex;
- supplier due-diligence summary;
- downloadable public documents where approved.

Candidate document types:

- ISO 9001 certificate summary or approved certificate file;
- ISO 27001 certificate summary or approved certificate file;
- security activity licence summary;
- D&B AA High Creditworthy 2026 proof-safe statement;
- privacy notice;
- terms/legal notices;
- complaint handling policy / panaszkezelési tájékoztató;
- Code of Ethics / Etikai kódex;
- anti-corruption / conflict-of-interest statement if approved;
- data-processing and security overview for tender/procurement use;
- sustainability / ESG preparation statement, without unverified achieved
  ratings.

Guardrails:

- do not publish confidential tender-only evidence;
- do not publish personal data;
- do not publish client-specific, contract-specific or internal audit evidence;
- do not add EcoVadis achieved/rating/medal claims unless verified;
- do not add client/partner/testimonial/case-study claims without approval;
- do not expose exact licence numbers in generic marketing surfaces unless
  legal/proof context is intended and approved.

Exit criteria:

- every document has owner, source, status, allowed public surface and review
  date;
- `docs/verified_claims.md` references all public proof claims;
- public pages and AI files use the same proof-safe wording.

### Phase 3 — Complaint handling and ethics layer

Goal: make Avenir look procurement-ready and governance-mature without
overstating legal/compliance claims.

Public concepts:

- Panaszkezelés / Complaint handling;
- Etikai kódex / Code of Ethics;
- client complaint intake path;
- complaint response expectations, without SLA guarantees unless approved;
- escalation owner or department, if approved;
- non-retaliation/ethics wording only after legal review;
- whistleblowing / ethics report route only if the legal/process framework is
  genuinely ready.

Important distinction:

- Complaint handling is not the same as a whistleblowing system.
- Ethics reporting may have legal, labor-law, privacy and retention
  implications.
- Do not create an ethics/whistleblowing form or route until the owner,
  workflow, retention and legal basis are defined.

Exit criteria:

- approved public complaint-handling wording;
- no implied legal guarantee;
- no unowned intake channel;
- data-handling boundaries are clear.

### Phase 4 — Content growth / tudástár

Goal: build search and AI-search depth without risky proof claims.

First HU article themes:

1. Hogyan készüljön fel egy cég objektumőrzés indítására?
2. Kamerarendszer és adatvédelem: milyen szempontokat érdemes előre tisztázni?
3. Portaszolgálat és látogatói folyamat: mi legyen szabályzatban?
4. Rendezvénybiztosítás tervezése céges eseményeknél.
5. Hard FM és Soft FM: mikor érdemes külön folyamatot kialakítani?

Rules:

- educational, not legal advice;
- no client names;
- no case studies unless separately approved;
- no guaranteed outcome;
- no unverified performance metrics;
- add article URLs to `llms` files only after publication and review.

### Phase 5 — Conversion and measurement optimization

Goal: improve lead quality and measurement after the stable launch baseline.

Ideas:

- thank-you state or confirmation page;
- more structured service inquiry context;
- better quote-preparation expectation copy;
- event tracking review after GA4 baseline is stable;
- optional Vercel Analytics / Speed Insights;
- A/B tests only after consent, privacy and analytics policy are clear.

Guardrails:

- do not add dark-pattern consent flows;
- do not send PII to analytics;
- do not add LinkedIn Insight Tag or other marketing pixels without a separate
  consent/legal decision.

### Phase 6 — DE/ZH localization

Goal: expand only when translation, legal review and route readiness are real.

Work:

- translate service detail pages with full HU/EN parity review;
- legal/privacy translations by counsel or legal reviewer;
- sitemap/hreflang only after routes are actually ready;
- visual QA for German long strings and Chinese typography;
- avoid HU fallback masquerading as localized content.

Exit criteria:

- ready localized fields in DB;
- route returns 200 only for complete locale;
- hreflang and sitemap advertise only real routes;
- contact/legal/news flows do not generate 404s.

### Phase 7 — Special Services layer

Goal: add sensitive, compliance-heavy services separately from the 8 main
operational service cards.

Candidate services:

- Helyszíni biztonsági audit / Site Security Audit;
- Adatvédelmi és GDPR-folyamatfelmérés / Data Protection and GDPR Process
  Review;
- Magánnyomozás / Private Investigation.

Rules:

- separate visual/content layer from main service cards;
- preliminary consultation CTA, not standard instant quote framing;
- strong warning not to submit sensitive personal data via general contact;
- legal/proof/content review before routes, sitemap or public copy;
- no employee surveillance, hidden monitoring, police/authority role, legal
  advice or GDPR compliance guarantee.

### Phase 8 — Separate AOS product track

Goal: build internal operations capability in the separate `avenir-aos` app,
not inside the public website.

Potential AOS modules:

- electronic guard log / AOS Guard Log;
- site instructions and shift handover;
- incident reporting;
- photo/document attachments with privacy controls;
- supervisor review;
- AI Report Assistant as human-reviewed draft support;
- client-report export workflow;
- proposal generation;
- internal document workflows.

Guardrails:

- separate repo, DB, Vercel project and release process;
- no website production release should include AOS migrations/deploys;
- no employee surveillance framing;
- AI must not invent facts, assign blame or make legal conclusions.

---

## 15. Do-Not-Do Rules

Unless explicitly requested and approved:

- do not deploy production;
- do not write production DB;
- do not run migrations;
- do not run seed scripts;
- do not run import scripts;
- do not edit `.env.local`;
- do not edit `.gitignore`;
- do not change service copy;
- do not change slugs or routes;
- do not change sitemap policy casually;
- do not add client names, partner names, testimonials or case studies;
- do not add EcoVadis achieved/rating/medal claims;
- do not add OPTEN A+ from the D&B certificate;
- do not add SLA/guaranteed response/arrival/repair-time wording;
- do not add legal/GDPR/NAIH compliance guarantees;
- do not add police/public-authority role wording;
- do not add LinkedIn Insight Tag or tracking pixels;
- do not send PII to analytics;
- do not print secrets or full connection strings.

---

## 16. Recommended Next Steps

If a new developer or ChatGPT picks this up, start here:

1. Check repo state:

```bash
git branch --show-current
git status --short
git log --oneline -12
```

2. If the docs-only sync is still uncommitted, review and commit it:

```bash
git diff --check
git add AGENTS.md AVENIR_FINAL_ROADMAP_2026_05_07.md README.md docs/code_architecture.md docs/copy_strategy.md docs/legal/analytics-privacy-review.md docs/service_pages_playbook.md docs/staging_runbook.md docs/translations/translation_notes.md docs/verified_claims.md docs/production_handoff_2026_05_28.md
git commit -m "docs: sync post-launch production state"
git push
```

3. Run production-safe smoke only when explicitly intended:

```bash
npm run qa:preview -- https://www.afm.hu --allow-production
npm run qa:analytics -- https://www.afm.hu --allow-production
```

4. Prioritize the remaining launch ops:

- contact form smoke;
- Search Console/Bing sitemap;
- GA4 Realtime/events;
- privacy HU/EN legal review;
- DE/ZH flow audit;
- EN news policy.

5. For any DB operation, verify target first and never skip dry-run.

---

## 17. Source Documents To Read Next

Use these docs as detailed references:

- `docs/product_roadmap.md`
- `docs/post_launch_backlog.md`
- `docs/project_handover_avenir_website.md`
- `README.md`
- `AGENTS.md`
- `AVENIR_FINAL_ROADMAP_2026_05_07.md`
- `docs/staging_runbook.md`
- `docs/code_architecture.md`
- `docs/service_pages_playbook.md`
- `docs/copy_strategy.md`
- `docs/verified_claims.md`
- `docs/legal/analytics-privacy-review.md`
- `docs/translations/translation_notes.md`
- `docs/aos_separation_decision.md`
- `docs/aos_guard_log.md`

This file is the shortest single-file context bridge; the files above are the
source-of-truth detail layer.
