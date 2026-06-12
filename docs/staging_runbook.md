# Staging Runbook — Avenir Website

Last updated: 2026-05-28

## Purpose

This document defines how development, staging, preview, database migrations, QA, and production deployment should work for the Avenir website.

The goal is simple:

Do not experiment directly on production.

All meaningful development should go through a controlled preview / staging workflow before it reaches the live site.

## Project

Website:

https://www.afm.hu

Repository:

`C:\Users\andra\avenir-website`

Production URL:

https://www.afm.hu

Main production route:

`/hu`

Locales:

- `/hu`
- `/en`
- `/de`
- `/zh`

Current important branch:

`main`

## Current Branch Status

Status: production-launched HU/EN public website with staging-first operations
still required for future changes.

The current production scope includes:

- eight HU and EN service detail pages;
- readiness-driven homepage/footer service links;
- related services and contact prefill;
- Partner Logo Strip MVP with proof gating;
- HU public article layer: `/hu/hirek` and `/hu/hirek/[slug]`;
- HU and EN legal pages:
  - `/hu/adatvedelem`, `/hu/aszf`, `/hu/impresszum`;
  - `/en/adatvedelem`, `/en/aszf`, `/en/impresszum`;
- SEO/GEO files: `/llms.txt` and `/llms-full.txt`;
- CI workflow, README cleanup, code architecture docs, Preview/production
  smoke test, and consent-gated analytics QA;
- admin/news/service hardening;
- durable contact rate limiter code with Upstash and Vercel KV REST env-name
  support;
- direct consent-gated GA4, not GTM;
- non-tracking LinkedIn company profile entity link;
- Hero performance refactor;
- DB service query deduplication.

Known production/post-launch notes:

- production noindex is absent;
- production sitemap includes HU/EN homepages, HU/EN legal routes, ready HU/EN
  service detail pages, and ready HU article URLs;
- DE/ZH are homepage/partial-localization surfaces only and are noindexed /
  excluded from sitemap until full localization is ready;
- `npm run qa:preview -- https://www.afm.hu --allow-production` is the
  production route smoke command;
- `npm run qa:analytics -- https://www.afm.hu --allow-production` is the
  production consent/GA4 QA command;
- D&B AA High Creditworthy 2026 public claim is synced from the Dun &
  Bradstreet certificate dated 26 May 2026;
- OPTEN/A+ is not an approved public creditworthiness claim unless a separate
  OPTEN-specific proof document is provided and reviewed;
- approved partner logo population and proof records;
- contact form production smoke should be treated as pending unless a real
  non-sensitive test submission is separately recorded.

Do not treat this launch state as permission to run future production DB
scripts, migrations, seeds, or deploys without a separate approval.

## AOS Release Separation

AOS is a separate internal operations application in the `avenir-aos`
repository. It is not part of this website application and is not implemented
inside website `/admin`.

Website staging/production QA does not cover AOS. AOS has a separate:

- repository;
- Vercel project;
- Neon database;
- migration process;
- staging or preview environment;
- production domain target: `aos.afm.hu`;
- staging domain target: `aos-staging.afm.hu` or Vercel Preview;
- release checklist and approval flow.

Do not run AOS migrations, AOS seed scripts, AOS deploy steps, or AOS production
checks as part of a website release. If both website and AOS are prepared in
parallel, treat them as two separate releases.

See `docs/aos_separation_decision.md`.

## Current HU/EN Service Detail Layer

Status: current production HU/EN service detail layer.

The current ready HU and EN service detail pages in production use the same
canonical slugs:

| Service | HU URL | EN URL | Legacy slug |
| --- | --- | --- |
| Élőerős objektumőrzés / On-site Security Guarding | `/hu/szolgaltatasok/objektumorzes` | `/en/szolgaltatasok/objektumorzes` | `security` |
| Recepciós és portaszolgálat / Reception and Gatehouse Services | `/hu/szolgaltatasok/portaszolgalat` | `/en/szolgaltatasok/portaszolgalat` | `reception` |
| Biztonságtechnika / Security Technology | `/hu/szolgaltatasok/biztonsagtechnika` | `/en/szolgaltatasok/biztonsagtechnika` | `building` |
| Távfelügyelet és vonulószolgálat / Remote Monitoring and Response Service | `/hu/szolgaltatasok/tavfelugyelet-vonuloszolgalat` | `/en/szolgaltatasok/tavfelugyelet-vonuloszolgalat` | `technical` |
| Próbavásárlás és szolgáltatásaudit / Mystery Shopping and Service Audit | `/hu/szolgaltatasok/mystery-shopping-helyszini-audit` | `/en/szolgaltatasok/mystery-shopping-helyszini-audit` | `mystery` |
| Rendezvénybiztosítás / Event Security | `/hu/szolgaltatasok/rendezvenybiztositas` | `/en/szolgaltatasok/rendezvenybiztositas` | `cleaning` |
| Hard FM | `/hu/szolgaltatasok/hard-fm` | `/en/szolgaltatasok/hard-fm` | `hardfm` |
| Soft FM | `/hu/szolgaltatasok/soft-fm` | `/en/szolgaltatasok/soft-fm` | `green` |

Expected legacy detail URLs should return 404:

- `/hu/szolgaltatasok/security`
- `/en/szolgaltatasok/security`
- `/hu/szolgaltatasok/reception`
- `/en/szolgaltatasok/reception`
- `/hu/szolgaltatasok/building`
- `/en/szolgaltatasok/building`
- `/hu/szolgaltatasok/technical`
- `/en/szolgaltatasok/technical`
- `/hu/szolgaltatasok/mystery`
- `/en/szolgaltatasok/mystery`
- `/hu/szolgaltatasok/cleaning`
- `/en/szolgaltatasok/cleaning`
- `/hu/szolgaltatasok/hardfm`
- `/en/szolgaltatasok/hardfm`
- `/hu/szolgaltatasok/green`
- `/en/szolgaltatasok/green`

Expected EN service detail URLs currently return 200. DE/ZH service detail
URLs should remain 404 until their own localized required content exists.

## Production DB Launch Restore

Production data was launched by Neon branch-level restore from the approved
staging branch into the production/main branch. This was a database branch
operation, not an application seed/import/migration run.

Known Neon branches:

| Purpose | Branch ID | Branch name |
| --- | --- | --- |
| Production/main | `br-divine-silence-almpoz68` | production/main |
| Staging source | `br-round-fog-al4isa1i` | staging |
| Backup before launch | `br-polished-tooth-al7hswta` | `prod-backup-before-afm-launch-20260524-1922` |
| Preserved old production | `br-super-art-alhsoh24` | `prod-preserved-during-afm-launch-20260524-1930` |

Known endpoints:

- staging: `ep-twilight-sound-al2b7jsb`
- production: `ep-young-meadow-aln5ux5m`

Before any local DB operation after production work, restore and verify local
`.env.local` is pointing back to staging:

```bash
node scripts/verify-db-target.mjs --target staging --runtime-only
```

Production DB operations require explicit target verification and explicit
approval. Never run staging-only DB scripts against production.

## Post-Launch DB Script Safety Matrix

All write-capable CLI scripts must run behind a target guard. The required
Neon endpoints are:

- staging: `ep-twilight-sound-al2b7jsb`
- production: `ep-young-meadow-aln5ux5m`

The local staging preflight remains:

```bash
node scripts/verify-db-target.mjs --target staging --runtime-only
```

The production preflight is allowed only for an explicitly approved production
operation:

```bash
node scripts/verify-db-target.mjs --target production --allow-production --runtime-only
```

Dry-run before apply is mandatory. Post-launch package behavior is:

| Script family | Default package behavior | Write command | Production behavior |
| --- | --- | --- | --- |
| `db:seed` | staging dry-run | `db:seed:apply` | `db:seed:prod` is disabled |
| `db:seed-services` | staging dry-run | `db:seed-services:apply` | `db:seed-services:prod` is disabled |
| `scripts/seed-pilot-*.ts` | staging dry-run | direct `--apply` only after explicit approval | staging-only guard; no production target |
| `db:update-certs` | staging dry-run | `db:update-certs:apply` | `db:update-certs:prod` is production dry-run unless `-- --apply` is added |
| `db:update-positions` | staging dry-run | `db:update-positions:apply` | `db:update-positions:prod` is production dry-run unless `-- --apply` is added |
| `db:update-service-display-copy` | staging dry-run | add `-- --apply` | `:prod` requires production preflight and `--allow-production` |
| `db:import-service-translations` | requires file/locale args; defaults to dry-run mode | add `--apply` | `:prod` requires production preflight and `--allow-production` |
| `db:update-service-related-slugs` | staging dry-run | add `-- --apply` | `:prod` requires production preflight and `--allow-production` |
| `db:sync-pilot-service-content` | staging dry-run | `db:sync-pilot-service-content:apply` | `:prod` requires production preflight and `--allow-production` |

Broad baseline seeds are intentionally not production tools after launch.
Production data synchronization should use Neon branch-level restore or the
targeted guarded sync scripts that print planned field-level changes and
support dry-run/apply. Never use `.env.local` target switching as the only
safety mechanism; always run the explicit target verifier first.

Migration tooling (`db:migrate:prod`, `db:push:prod`) remains separate from
content synchronization. Use it only with a written migration plan, staging
test result, backup/rollback path, and explicit production approval.

## Core Rule

Production is protected.

Do not assume that a change is production-ready unless András explicitly approves it.

Never run production database migrations before the same migration has been tested on staging.

Never merge service-detail work directly to main without QA.

Production deploy remains out of scope unless a migration/content release plan is explicitly approved.

## Environments

Use these environments for different purposes:

- Local development: coding, local type/lint/build checks, and non-production
  UI review.
- Vercel Preview: public route, sitemap, robots, metadata, legal-link,
  analytics-consent, and admin QA before release.
- Production: `https://www.afm.hu`; use only for approved smoke checks and
  post-launch monitoring.
- Production DB branch operations: explicit Neon branch-level operations only,
  with backup/restore plan and target verification.

### Local Development

Used for:

- coding;
- local build;
- local lint;
- TypeScript checks;
- initial manual testing.

Local commands:

```bash
npm ci
npm run dev
npm run build
npm run lint
npx tsc --noEmit
```

`npm run build` is a manual/local or Vercel Preview gate. It can depend on
DB-backed static generation and Google Fonts network fetching, so it is not
part of the lightweight CI workflow yet.

### Lightweight CI

GitHub Actions workflow: `.github/workflows/ci.yml`

Runs on:

- pull requests;
- pushes to `main`;
- pushes to `staging-service-pages`.

CI runs:

- `npm ci`;
- `npx tsc --noEmit`;
- `npm run lint`.

CI must not run seed scripts, migrations, `db:push`, production commands,
deploy commands, or IndexNow submission. Production build remains a manual /
Vercel Preview verification step until the DB and external-network build
dependencies are CI-stable.

### Onboarding Docs

Use `README.md` as the short contributor onboarding entry point. Use
`docs/code_architecture.md` for the current route, content, DB, seed, SEO/GEO,
admin, and future-AOS architecture reference.

### Vercel Preview

Used for:

- public route QA;
- sitemap and robots checks;
- metadata/canonical/hreflang checks;
- admin QA against staging DB;
- content review before merge.

The Vercel Preview `/sitemap.xml` must be checked after service seed/content updates.

Do not rely on local `.next` sitemap artifacts for final SEO QA. They may be stale or generated from a different DB snapshot. Live Preview is the source of truth for pre-merge indexing checks.

### Manual Preview Smoke Test

After a Vercel Preview deploy is available, run the GET-only smoke test against
the Preview URL:

```bash
npm run qa:preview -- https://avenir-website-git-staging-service-pages.vercel.app
```

The script checks the eight HU and eight EN service pages, expected legacy and
DE/ZH service 404s, HU/EN legal pages, English legal alias 404s, `/hu/hirek`,
sitemap policy, Preview robots/noindex policy, and `llms.txt` /
`llms-full.txt` content safeguards. It does not require secrets, does not read
`.env.local`, and does not submit forms or mutate data.

The script refuses to run against `https://www.afm.hu` unless
`--allow-production` is passed for an explicitly approved production smoke test:

```bash
npm run qa:preview -- https://www.afm.hu --allow-production
```

Do not add this smoke test to lightweight CI yet. It is a manual Vercel Preview
QA gate.

For post-launch production checks, the same script is the production smoke
gate when explicitly allowed:

```bash
npm run qa:preview -- https://www.afm.hu --allow-production
```

Production expected behavior:

- `/hu` and `/en` return 200 and are indexable;
- eight HU service detail pages return 200;
- eight EN service detail pages return 200;
- HU and EN legal routes under Hungarian slugs return 200;
- legacy service detail slugs return unavailable;
- DE/ZH service, legal, and news detail routes remain unavailable unless
  completed later;
- production must not send `X-Robots-Tag: noindex, nofollow`.

### Step 2 Foundation Test Baseline

Before embedded service quote forms are added, keep this baseline green:

```bash
npm run test
npm run qa:copy
npm run ci:local
```

Current coverage:

- `npm run test` covers pure contact payload validation, contact service-key
  normalization, honeypot schema acceptance, and helper-level analytics PII
  filtering. It does not call the contact API, database, Resend, Redis/KV, or
  production services.
- `npm run qa:preview -- <url>` covers public route status, HU/EN service
  readiness, DE/ZH and legacy service unavailability, legal route policy,
  sitemap/robots/llms safeguards, and production noindex policy when explicitly
  allowed.
- `npm run qa:analytics -- <url>` covers consent-gated direct GA4 behavior,
  analytics rejection/acceptance, GA collect attempts, safe business events,
  contact-form analytics with `/api/contact` mocked, and PII absence in
  analytics payloads.
- `npm run qa:copy` scans source/public service-marketing surfaces for stale
  service labels, prohibited proof-sensitive wording, exact licence-number
  placement in service seed copy, and known claim guardrails.
- `npm run ci:local` runs lint, TypeScript, unit tests, copy guard, and a local
  production build. It is for local/pre-release use where the local DB target
  is intentionally configured and verified.

Not yet covered:

- real production contact-form submission; keep this as a manual, explicitly
  approved non-sensitive smoke test;
- database write-path integration tests;
- Resend delivery integration;
- Redis/KV live integration;
- visual regression and mobile overflow automation.

The GitHub Actions workflow runs the safe subset that does not require DB
secrets: install, typecheck, lint, unit tests, and `qa:copy`. It does not run
production smoke tests, migrations, seed scripts, or DB writes.

### AI-search file QA

The Vercel Preview should expose:

- `/llms.txt`
- `/llms-full.txt`

Before merging SEO / GEO / AI-search changes, verify:

- both files return 200 on Preview;
- both files include only canonical public URLs;
- the eight HU service detail URLs are present;
- the eight EN service detail URLs are present;
- legacy service detail URLs are absent;
- DE/ZH service detail URLs are absent until localized service detail content is ready;
- admin, API, draft, migration, seed, and internal URLs are absent;
- unapproved partner names, customer names, testimonials, case studies, ratings, awards, and EcoVadis claims are absent;
- future concepts such as Shadow Audit sub-branding, AOS Guard Log, and AI Report Assistant are not described as current public products;
- `/sitemap.xml` still follows the current policy: locale homepages, reviewed HU/EN legal pages, ready HU/EN service detail pages, and ready HU article pages only.

### Build-time service path DB dependency

Service detail `generateStaticParams`, `/sitemap.xml`, and data-driven homepage/footer service detail links depend on the DB-backed service readiness query.

If that query fails during build or sitemap generation because `DATABASE_URL` is missing, points at the wrong target, or Neon is unavailable, the app should fail the generation with a sanitized error instead of emitting an empty or stale service detail layer.

The error may print only a credential-free DB target summary such as host and database name. It must never print the full `DATABASE_URL`.

This is intentional: a Preview or production build with an unavailable service-readiness source is not a reliable SEO artifact. Fix the DB target or retry the build, then verify the live Preview `/sitemap.xml`.

## Security.txt / Responsible Disclosure QA

Status: PL-090 source implementation prepared after owner confirmation that
`security@afm.hu` is active and monitored.

Before merging or deploying security/trust utility changes, verify:

- `/.well-known/security.txt` returns 200;
- `security.txt` contains `security@afm.hu`, `dpo@afm.hu`, `info@afm.hu`,
  `Policy: https://www.afm.hu/en/responsible-disclosure`, and an `Expires:`
  timestamp;
- `/hu/felelos-hibabejelentes` returns 200;
- `/en/responsible-disclosure` returns 200;
- `/de/felelos-hibabejelentes`, `/de/responsible-disclosure`,
  `/zh/responsible-disclosure`, and `/ko/responsible-disclosure` return 404;
- no response-time SLA, guaranteed fix time, bug-bounty reward promise, PGP key,
  acknowledgement/Hall-of-Fame promise, or expanded physical/social-engineering
  scope is added without separate owner/legal/process approval.

The pages are discoverable through `security.txt`; sitemap policy is not
expanded for PL-090.

## Public News / Article QA Checklist

Status: HU/EN public article layer plus DE noindex review layer.

News detail static path generation is intentionally softer than service-detail
readiness. If the build cannot read the article path list, the article detail
route may continue with no pre-rendered article paths and rely on dynamic
request-time rendering. This preserves build reliability while still enforcing
the public locale policy. The public article query must return `notFound()` for
unsupported locales, unknown slugs, draft rows, soft-deleted rows, future-dated
rows, or rows missing the selected locale's title/lead/body content.

Before merging public news/article work, verify on the Vercel Preview URL:

- `/hu/hirek` and `/en/hirek` return 200 only when at least one ready article
  exists for that locale;
- `/de/hirek` may return 200 only as a `noindex, follow` review surface;
- `/hu/hirek/[slug]` and `/en/hirek/[slug]` return 200 only for ready articles
  in that locale;
- `/de/hirek/[slug]` may return 200 only as a `noindex, follow` review surface;
- draft, soft-deleted, future-dated, title-only, lead-empty, and body-empty articles return 404 on detail URLs;
- ZH/KO article detail/index URLs are not linked and are not included in the sitemap;
- homepage HU/EN/DE news cards link to the matching locale's `/hirek/[slug]`
  only for locale-ready articles;
- `/sitemap.xml` includes `/hu/hirek` and `/en/hirek` only when ready articles exist;
- `/sitemap.xml` includes only ready HU/EN article detail URLs;
- `/sitemap.xml` and hreflang do not include DE news while it is noindex review-mode;
- Article JSON-LD uses `Article`, not `NewsArticle`, unless the content type is explicitly changed later;
- BreadcrumbList JSON-LD is present on article detail pages;
- article body rendering does not render raw HTML or unsanitized Markdown;
- no client, partner, testimonial, case-study, award, OPTEN, EcoVadis, or unverified claims appear unless separately approved in `docs/verified_claims.md`.

## Service Detail QA Checklist

Before merging service-detail work, verify on the Vercel Preview URL:

- the eight canonical HU service detail URLs return 200;
- the eight canonical EN service detail URLs return 200 when EN detail content is ready;
- the eight legacy detail URLs listed above return 404;
- DE/ZH service detail URLs for the eight services return 404 until ready;
- `/sitemap.xml` includes the ready HU/EN service detail URLs;
- `/sitemap.xml` does not include legacy service detail URLs;
- `/sitemap.xml` does not include DE/ZH service detail URLs until ready;
- canonical URLs point to the ready HU URLs;
- hreflang advertises only ready locales;
- FAQPage JSON-LD exists only where the visible FAQ block renders;
- related service links do not render broken public links;
- admin edits do not publish incomplete locale pages.

## Contact Prefill QA

The contact form should accept canonical and legacy query values, but form submission should use canonical slugs.

Canonical examples:

- `/hu?service=objektumorzes#contact`
- `/hu?service=portaszolgalat#contact`
- `/hu?service=biztonsagtechnika#contact`
- `/hu?service=tavfelugyelet-vonuloszolgalat#contact`
- `/hu?service=mystery-shopping-helyszini-audit#contact`
- `/hu?service=rendezvenybiztositas#contact`
- `/hu?service=hard-fm#contact`
- `/hu?service=soft-fm#contact`

Legacy alias examples:

- `/hu?service=security#contact`
- `/hu?service=reception#contact`
- `/hu?service=building#contact`
- `/hu?service=technical#contact`
- `/hu?service=mystery#contact`
- `/hu?service=cleaning#contact`
- `/hu?service=hardfm#contact`
- `/hu?service=green#contact`

Unknown service query values should be ignored safely.

## Embedded Service Quote QA

The service detail pages include an embedded quote CTA. The collapsed state is
intentionally minimal and shows only the localized quote button:

- HU: `Ajánlatkérés`
- EN: `Request a quote`

Embedded quote submissions post to the same `/api/contact` endpoint as the
homepage contact form. They include the existing contact fields plus operational
context:

- `service`: canonical service slug;
- `form_variant`: `service_embedded`;
- `source_path`: current page path.

No database schema change has been made for Step 4A. The `messages` table
persists the existing `service` field, so admin list/detail views can show the
selected service. `source_path` and `form_variant` are not persisted in the DB
yet; they are included in the Resend lead notification email for operational
triage. A future CRM/admin enhancement can add first-class columns if that
context needs to be searchable or auditable in the admin UI.

Real production smoke checklist, only with non-sensitive test content and
explicit owner approval:

- submit a non-sensitive embedded quote test on
  `/hu/szolgaltatasok/objektumorzes`;
- expect inline UI success;
- expect one `admin/messages` row;
- expect Resend notification delivery;
- verify the admin row shows the selected service context;
- verify the notification email includes service label, service slug,
  `form_variant=service_embedded`, and `source_path`;
- verify GA4 shows a consented `service_quote_form_submit_success` event;
- verify no name, email, phone, company, message body, or free-text field is
  present in the analytics event payload.

## Service Quote Analytics QA

The embedded service quote funnel is measured only after analytics consent and
must never send submitted lead data to GA4.

Expected event sequence:

- `service_quote_cta_click`: the collapsed `Ajánlatkérés` / `Request a quote`
  button is clicked;
- `service_quote_form_open`: the inline form opens;
- `service_quote_form_start`: the user first interacts with a visible form
  field, once per open form session;
- `service_quote_form_submit_success`: `/api/contact` returns success;
- `service_quote_form_submit_error`: `/api/contact` returns an error or the
  submission fails.

Allowed parameters for these events:

- `locale`;
- `path`;
- `service_slug`;
- `service_label` when it is a predefined canonical service label;
- `form_variant=service_embedded`;
- `event_type=service_quote`.

Forbidden parameters:

- name;
- email;
- phone;
- company;
- message body;
- any free-text form value;
- IP address.

Manual console check after accepting analytics:

```js
window.dataLayer?.filter(
  (entry) =>
    Array.from(entry).at(0) === "event" &&
    String(Array.from(entry).at(1)).startsWith("service_quote_"),
);
```

Use non-sensitive test data only. The expected event parameter object should
contain the allowed keys above and no submitted field values. After production
verification, `service_quote_form_submit_success` should be considered for GA4
key-event marking. If reporting needs segmentation, register `service_slug`,
`form_variant`, and `locale` as GA4 custom dimensions; do not register fields
that could contain personal or free-text lead data.

## Contact Rate-Limit QA

`/api/contact` uses a durable Upstash Redis / Vercel KV-compatible REST rate
limiter when these environment variables are configured:

- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

Vercel KV REST env names are also supported:

- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`

Do not use `KV_REST_API_READ_ONLY_TOKEN` for contact rate limiting; the limiter
must be able to increment counters.

Production requires a usable REST URL/token pair. If they are missing or Redis
is unavailable in production, contact submissions fail closed before DB
insert/email. Local development and Vercel Preview may fall back to the
in-memory limiter and log a non-secret warning so QA is not blocked.

The current policy is 5 submissions per minute per client IP. The IP is derived
from Vercel/proxy-controlled forwarded headers when available and is hashed
before being used in Redis keys. Do not print Redis REST URLs or tokens in logs,
screenshots, or support notes.

For Preview QA, verify:

- normal form submission still succeeds when the limit is not exceeded;
- repeated submissions from the same client receive `429` after the limit;
- missing Preview Redis credentials produce only a non-secret fallback warning;
- production deploys have Redis credentials configured before contact testing.

## Consent-Gated GA4 QA

GA4 uses direct `gtag.js` loading after analytics consent. It does not use
Google Tag Manager.

Required environment variable:

- `NEXT_PUBLIC_GA4_ID`

Expected behavior:

- Before consent: no request to `https://www.googletagmanager.com/gtag/js` and
  no GA collect request.
- Reject analytics: banner closes, the rejection persists in localStorage, and
  GA4 remains unloaded after refresh.
- Accept analytics: `gtag.js` loads with `NEXT_PUBLIC_GA4_ID`, the Network
  panel shows a GA4 `/g/collect` page-view request, and GA4 Realtime should
  show a page view after the normal delay.
- Footer Cookie settings reopens the consent choice.
- If `NEXT_PUBLIC_GA4_ID` is missing, no GA script loads and the site remains
  functional.

Automated QA commands:

```bash
npm run qa:analytics
npm run qa:analytics -- https://<preview-url>
npm run qa:analytics -- https://www.afm.hu --allow-production
```

`ANALYTICS_QA_BASE_URL` can be used instead of the CLI URL. Production targets
require `--allow-production` or `ANALYTICS_QA_ALLOW_PRODUCTION=1`; otherwise
the wrapper aborts before launching Playwright.

The analytics QA:

- mocks `https://www.googletagmanager.com/gtag/js` in most tests;
- runs one real-script smoke that allows `gtag.js` to load and intercepts GA
  collect endpoints with `204`, so no real GA test hit is sent;
- intercepts `/api/contact` and returns test JSON, so no real contact request,
  email or DB write happens;
- verifies `window.dataLayer` entries for page config, explicit page-view
  events and business events;
- fails if analytics event payloads contain the test name, email, phone,
  company or message text;
- checks CSP for direct GA4 domains and rejects Ads/DoubleClick/pagead
  endpoints.

The automated test deliberately does not verify GA4 Realtime ingestion. For
that, accept analytics on a deployed environment and check GA4 Realtime after
the normal processing delay.

Events emitted after consent only:

- `page_view`
- `contact_submit_success`
- `contact_submit_error`
- `phone_click`
- `email_click`
- `service_cta_click`
- `service_quote_cta_click`
- `service_quote_form_open`
- `service_quote_form_start`
- `service_quote_form_submit_success`
- `service_quote_form_submit_error`
- `special_service_option_selected`

PII guardrails:

- Do not send name, email, phone, company, message body, IP address or any
  free-text form field to GA4.
- Allowed parameters are limited to locale, path, predefined service key or
  service slug, predefined service label, form variant and event type.

## Post-Launch Backlog

P1:

- Contact form production smoke status: pending unless a real non-sensitive
  production test submission is separately recorded after env changes.
- Mobile overflow review if still present on narrow devices.
- Consent banner placement/visual polish if it remains intrusive in manual QA.
- DE/ZH/KO public-flow cleanup: keep partial surfaces noindexed and prevent
  links to unfinished service/legal/news routes. DE service/legal/news may exist
  as review-mode noindex routes only.
- EN news route/content policy: source-resolved for the launch article; verify
  `/en/hirek` and the EN launch article after deploy.
- Privacy Policy HU/EN version sync and DPO/legal review.
- D&B AA versus OPTEN/A+ governance: public wording uses D&B AA High
  Creditworthy 2026. Keep D&B and OPTEN as separate proof tracks; OPTEN/A+
  remains unavailable for public use unless separately proved.
- Upload magic-byte sniff is implemented in source; continue regression tests
  for admin upload routes.
- Shared `requireAdmin()` allowlist enforcement is implemented in source;
  continue regression checks for admin actions and upload APIs.

P2:

- Vercel Analytics / Speed Insights if the owner wants additional performance
  monitoring beyond GA4.
- Periodic Lighthouse and accessibility monitoring.
- Google Search Console and Bing Webmaster Tools monitoring after sitemap
  submission.
- Sitemap `lastModified` from DB `updatedAt` where reliable.
- CSP nonce/hash hardening beyond the current direct GA4-compatible policy.
- NextAuth beta/stability review and pinning strategy.
- Slugify/canonical slug utility consolidation.
- Automated tests beyond smoke/analytics QA.
- LinkedIn Insight Tag only if a separate marketing and consent decision is
  approved later.
