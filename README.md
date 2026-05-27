# Avenir Website

Next.js App Router website for Avenir Facility Management.

This repo is the public B2B lead-generation website and SEO/GEO-ready service
platform for Avenir. It currently includes the public marketing site, admin CMS,
Hungarian and English service detail pages, a proof-gated partner logo strip, HU-first
public articles, contact intake, and search/AI-search grounding files. Longer
term, the codebase is expected to evolve toward the Avenir Operating System
(AOS), but public website, trust, SEO, and conversion work remain the current
priority.

## Tech Stack

- Next.js App Router
- TypeScript
- Drizzle ORM
- Neon PostgreSQL
- Vercel
- Vercel Blob uploads for admin-managed assets
- NextAuth with Microsoft Entra ID for admin access
- Resend for email notification delivery
- ESLint

## Current Public Layers

- Locale homepages: `/hu`, `/en`, `/de`, `/zh`
- Eight ready HU and EN service detail pages
- Homepage/footer links to ready locale-specific service details
- Admin-managed Partner Logo Strip with proof gating
- HU public article layer: `/hu/hirek` and `/hu/hirek/[slug]`
- Contact form with service prefill
- Legal pages
- `/sitemap.xml`
- `/robots.txt`
- `/llms.txt`
- `/llms-full.txt`

## Service Detail Layer

Current HU and EN service detail URLs use the same canonical slugs:

- `/hu/szolgaltatasok/objektumorzes`
- `/en/szolgaltatasok/objektumorzes`
- `/hu/szolgaltatasok/portaszolgalat`
- `/en/szolgaltatasok/portaszolgalat`
- `/hu/szolgaltatasok/biztonsagtechnika`
- `/en/szolgaltatasok/biztonsagtechnika`
- `/hu/szolgaltatasok/tavfelugyelet-vonuloszolgalat`
- `/en/szolgaltatasok/tavfelugyelet-vonuloszolgalat`
- `/hu/szolgaltatasok/mystery-shopping-helyszini-audit`
- `/en/szolgaltatasok/mystery-shopping-helyszini-audit`
- `/hu/szolgaltatasok/rendezvenybiztositas`
- `/en/szolgaltatasok/rendezvenybiztositas`
- `/hu/szolgaltatasok/hard-fm`
- `/en/szolgaltatasok/hard-fm`
- `/hu/szolgaltatasok/soft-fm`
- `/en/szolgaltatasok/soft-fm`

Legacy detail URLs remain 404 unless a redirect policy is explicitly approved.
Legacy slugs may still be accepted as contact aliases and email-label fallback
values. DE/ZH service detail pages are intentionally gated until their own
localized required content exists.

Canonical/legacy service slug map:

- `security` -> `objektumorzes`
- `reception` -> `portaszolgalat`
- `building` -> `biztonsagtechnika`
- `technical` -> `tavfelugyelet-vonuloszolgalat`
- `mystery` -> `mystery-shopping-helyszini-audit`
- `cleaning` -> `rendezvenybiztositas`
- `hardfm` -> `hard-fm`
- `green` -> `soft-fm`

## Partner Logo Strip

The homepage partner logo strip is admin-managed and proof-gated. A logo may
render publicly only when the partner row is active, published, opted into the
logo strip, has a logo URL, and has recorded approval metadata:

- approval date
- approver or proof owner
- usage scope

Phase 1 keeps logos as visual trust assets only. Do not add partner/customer
relationships to JSON-LD schema from the logo strip. Do not show unapproved
logos, placeholder logos, fake partner names, testimonials, or case studies.

## Article Layer

Public articles are HU-first:

- `/hu/hirek`
- `/hu/hirek/[slug]`

EN/DE/ZH article routes are not public yet. Public article readiness requires a
non-deleted, HU-published, non-future article with slug, HU title, HU lead, HU
body, and date.

The article body currently renders as safe plain text split into paragraphs. It
does not render Markdown and does not render raw HTML. A future Phase 2 may add
sanitized Markdown if needed.

## Contact Rate Limiting

`/api/contact` uses a durable Upstash Redis / Vercel KV-compatible REST rate
limiter when either `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` or
Vercel KV's `KV_REST_API_URL` + `KV_REST_API_TOKEN` are configured. The current
policy is 5 submissions per minute per client IP. The IP value is hashed before
it is used in Redis keys.

Production contact submissions fail closed if Redis credentials are missing or
Redis is unavailable, so a horizontally scaled Vercel deployment cannot fall
back to a per-instance limiter. Local development and Vercel Preview may use
the in-memory fallback and log a non-secret warning. The implementation assumes
forwarded IP headers are controlled by Vercel or the trusted deployment proxy.

Do not commit Redis credentials or print full Redis REST URLs/tokens.

## Consent-Gated GA4 Analytics

GA4 is integrated directly, not through Google Tag Manager. Configure the public
measurement ID with:

- `NEXT_PUBLIC_GA4_ID`

The site does not inject `gtag.js` until the visitor accepts analytics consent.
If the visitor rejects analytics, or if `NEXT_PUBLIC_GA4_ID` is missing, GA4 is
not loaded and the site continues to work.

Verification checklist:

- Fresh profile before consent: no request to `googletagmanager.com/gtag/js`
  and no GA collect request.
- Reject analytics: banner hides, choice persists after refresh, GA4 remains
  unloaded.
- Accept analytics: `gtag.js` loads, the Network panel shows a GA4
  `/g/collect` page-view request, and GA4 Realtime should show a page view
  after the usual processing delay.
- Cookie settings in the footer reopens the analytics choice.

Automated QA:

```bash
npm run qa:analytics
npm run qa:analytics -- https://<preview-url>
npm run qa:analytics -- https://www.afm.hu --allow-production
```

The automated analytics QA uses Playwright with Chromium. Most tests mock
`gtag.js`; the real-script smoke test allows `gtag.js` to load and intercepts
GA collect endpoints with `204`, so no real GA test hit is sent. `/api/contact`
is also intercepted, so contact-form tests do not reach the real API and do not
write to the database. Production runs are blocked unless `--allow-production`
or `ANALYTICS_QA_ALLOW_PRODUCTION=1` is provided.

The test verifies consent gating, rejection persistence, accepted-consent
`gtag.js` loading, `dataLayer` initialization, contact success/error events,
private-investigation selection, phone/email click events, PII absence in event
payloads, and CSP domain scope. It does not verify GA4 Realtime processing;
check Realtime manually after a consented page view when needed.

Events emitted after consent only:

- `contact_submit_success`
- `contact_submit_error`
- `phone_click`
- `email_click`
- `service_cta_click`
- `special_service_option_selected`

Analytics events must not include personal form content. Do not send names,
email addresses, phone numbers, company names, message text, IP addresses or
other free-text personal details.

## SEO / GEO / AI-Search

The project includes:

- metadata and canonical URLs
- hreflang
- sitemap
- robots
- JSON-LD
- `llms.txt`
- `llms-full.txt`

Only verified claims should be used in public copy, schema, sitemap-adjacent
metadata, and AI-search files. Do not add unapproved partner/customer names,
testimonials, case studies, OPTEN claims, EcoVadis claims, awards, ratings, or
metrics unless they are recorded as approved in `docs/verified_claims.md`.

## Local Development

Install dependencies:

```bash
npm ci
```

Use `npm ci` for reproducible installs from `package-lock.json`. For local
exploration, `npm install` is acceptable when dependency updates are intentional.

Start local dev:

```bash
npm run dev
```

Useful verification commands:

```bash
npx tsc --noEmit
npm run lint
```

Run a production build only when DB, env, and network requirements are
understood:

```bash
npm run build
```

The build can depend on DB-backed static generation and Google Fonts network
fetching. Vercel Preview remains the normal pre-merge build gate.

## Database and Migrations

The database stack is Drizzle ORM + Neon PostgreSQL.

Use the npm scripts that run target verification before DB operations. Do not
run `db:push` casually. Production migrations require explicit approval and a
release plan.

Examples:

```bash
npm run db:verify-target
npm run db:migrate
```

Production scripts exist, but they must not be used without explicit approval:

```bash
npm run db:verify-target:prod
npm run db:migrate:prod
```

Never print full `DATABASE_URL` values.

## Seed Scripts

Service content operations are split:

- `scripts/seed-services.ts` is the baseline service seed.
- `scripts/seed-pilot-*.ts` scripts publish one HU service detail page at a
  time.

Run dry-runs first and verify the DB target before writing. Pilot seed scripts
can overwrite service copy in the DB for their target service. Do not run seed
scripts on production without an approved release plan.

## Safe Commands

Generally safe review/development commands:

```bash
npx tsc --noEmit
npm run lint
npm run build
npm run db:verify-target
```

Pilot seed dry-runs are acceptable only when the target is verified and the task
explicitly allows seed script execution:

```bash
npx tsx scripts/seed-pilot-hard-fm.ts --dry-run
```

## Forbidden / Dangerous Commands

Do not do these without explicit approval:

- production deploys
- production migrations
- production seed scripts
- casual `db:push`
- IndexNow submissions
- committing secrets
- printing full `DATABASE_URL`
- writing directly to production data

## QA Checklist

Before merge or release, verify:

- eight HU service detail URLs return 200
- legacy service detail URLs return 404
- EN/DE/ZH service detail URLs return 404 until localized fields exist
- homepage/footer service links are readiness-driven
- related services use canonical slugs only
- contact prefill works for canonical and legacy aliases
- partner logo strip renders only proof-approved logos
- `/hu/hirek` and ready `/hu/hirek/[slug]` routes work
- EN/DE/ZH article routes are not public
- sitemap contains only expected public URLs
- robots policy is correct for the environment
- `llms.txt` and `llms-full.txt` are proof-safe
- admin service/news mutations revalidate public paths and sitemap

## Key Docs

- [AGENTS.md](AGENTS.md)
- [docs/staging_runbook.md](docs/staging_runbook.md)
- [docs/service_pages_playbook.md](docs/service_pages_playbook.md)
- [docs/copy_strategy.md](docs/copy_strategy.md)
- [docs/verified_claims.md](docs/verified_claims.md)
- [docs/shadow_audit_strategy.md](docs/shadow_audit_strategy.md)
- [docs/aos_guard_log.md](docs/aos_guard_log.md)
- [docs/code_architecture.md](docs/code_architecture.md)
