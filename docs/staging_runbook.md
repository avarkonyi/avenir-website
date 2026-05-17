# Staging Runbook — Avenir Website

Last updated: 2026-05-15

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

Main production route:

`/hu`

Locales:

- `/hu`
- `/en`
- `/de`
- `/zh`

Current important branch:

`staging-service-pages`

## Current Branch Status

Status: staging-complete public foundation, not production-approved.

The current branch includes:

- eight HU service detail pages;
- readiness-driven homepage/footer service links;
- related services and contact prefill;
- Partner Logo Strip MVP with proof gating;
- HU public article layer: `/hu/hirek` and `/hu/hirek/[slug]`;
- SEO/GEO files: `/llms.txt` and `/llms-full.txt`;
- CI workflow, README cleanup, code architecture docs, and Preview smoke test;
- admin/news/service hardening;
- durable contact rate limiter code;
- Hero performance refactor;
- DB service query deduplication.

Known approval gates before production:

- service copy human review;
- OPTEN A+ / Bonitasi minosites proof decision or replacement;
- approved partner logo population and proof records;
- production Upstash/Vercel Redis environment variables;
- live Vercel Preview QA;
- production migration/content/proof plan;
- explicit approval from Andras.

Do not treat staging-complete as production-approved.

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

## Current HU Service Detail Layer

Status: current staging HU service detail layer.

The current ready HU service detail pages on staging are:

| Service | Canonical public URL | Legacy slug |
| --- | --- | --- |
| Élőerős objektumőrzés | `/hu/szolgaltatasok/objektumorzes` | `security` |
| Recepciós és portaszolgálat | `/hu/szolgaltatasok/portaszolgalat` | `reception` |
| Biztonságtechnika | `/hu/szolgaltatasok/biztonsagtechnika` | `building` |
| Távfelügyelet és vonulószolgálat | `/hu/szolgaltatasok/tavfelugyelet-vonuloszolgalat` | `technical` |
| Próbavásárlás és szolgáltatásaudit | `/hu/szolgaltatasok/mystery-shopping-helyszini-audit` | `mystery` |
| Rendezvénybiztosítás | `/hu/szolgaltatasok/rendezvenybiztositas` | `cleaning` |
| Hard FM | `/hu/szolgaltatasok/hard-fm` | `hardfm` |
| Soft FM | `/hu/szolgaltatasok/soft-fm` | `green` |

Expected legacy detail URLs should return 404:

- `/hu/szolgaltatasok/security`
- `/hu/szolgaltatasok/reception`
- `/hu/szolgaltatasok/building`
- `/hu/szolgaltatasok/technical`
- `/hu/szolgaltatasok/mystery`
- `/hu/szolgaltatasok/cleaning`
- `/hu/szolgaltatasok/hardfm`
- `/hu/szolgaltatasok/green`

Expected EN/DE/ZH service detail URLs should remain 404 until their own localized required content exists.

## Core Rule

Production is protected.

Do not assume that a change is production-ready unless András explicitly approves it.

Never run production database migrations before the same migration has been tested on staging.

Never merge service-detail work directly to main without QA.

Production deploy remains out of scope unless a migration/content release plan is explicitly approved.

## Environments

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

The script checks the eight HU service pages, expected legacy/non-HU 404s,
`/hu/hirek`, sitemap policy, robots policy, and `llms.txt` / `llms-full.txt`
content safeguards. It does not require secrets, does not read `.env.local`, and
does not submit forms or mutate data.

The script refuses to run against `https://www.afm.hu` unless
`--allow-production` is passed for an explicitly approved production smoke test:

```bash
npm run qa:preview -- https://www.afm.hu --allow-production
```

Do not add this smoke test to lightweight CI yet. It is a manual Vercel Preview
QA gate.

### AI-search file QA

The Vercel Preview should expose:

- `/llms.txt`
- `/llms-full.txt`

Before merging SEO / GEO / AI-search changes, verify:

- both files return 200 on Preview;
- both files include only canonical public URLs;
- the eight HU service detail URLs are present;
- legacy service detail URLs are absent;
- EN/DE/ZH service detail URLs are absent until localized service detail content is ready;
- admin, API, draft, migration, seed, and internal URLs are absent;
- unapproved partner names, customer names, testimonials, case studies, ratings, awards, and EcoVadis claims are absent;
- future concepts such as Shadow Audit sub-branding, AOS Guard Log, and AI Report Assistant are not described as current public products;
- `/sitemap.xml` still follows the current policy: locale homepages, HU legal pages, ready HU service detail pages, and ready HU article pages only.

### Build-time service path DB dependency

Service detail `generateStaticParams`, `/sitemap.xml`, and data-driven homepage/footer service detail links depend on the DB-backed service readiness query.

If that query fails during build or sitemap generation because `DATABASE_URL` is missing, points at the wrong target, or Neon is unavailable, the app should fail the generation with a sanitized error instead of emitting an empty or stale service detail layer.

The error may print only a credential-free DB target summary such as host and database name. It must never print the full `DATABASE_URL`.

This is intentional: a Preview or production build with an unavailable service-readiness source is not a reliable SEO artifact. Fix the DB target or retry the build, then verify the live Preview `/sitemap.xml`.

## Public News / Article QA Checklist

Status: HU-first public article layer.

Before merging public news/article work, verify on the Vercel Preview URL:

- `/hu/hirek` returns 200 only when at least one HU-ready article exists;
- `/hu/hirek` returns 404 if there are no HU-ready articles;
- `/hu/hirek/[slug]` returns 200 only for HU-ready articles;
- draft, soft-deleted, future-dated, title-only, lead-empty, and body-empty articles return 404 on detail URLs;
- EN/DE/ZH article detail/index URLs are not linked and are not included in the sitemap;
- homepage HU news cards link to `/hu/hirek/[slug]` only for HU-ready articles;
- EN/DE/ZH homepage news cards keep the existing safe modal behavior and do not link to non-ready article routes;
- `/sitemap.xml` includes `/hu/hirek` only when at least one HU-ready article exists;
- `/sitemap.xml` includes only ready HU article detail URLs;
- Article JSON-LD uses `Article`, not `NewsArticle`, unless the content type is explicitly changed later;
- BreadcrumbList JSON-LD is present on article detail pages;
- article body rendering does not render raw HTML or unsanitized Markdown;
- no client, partner, testimonial, case-study, award, OPTEN, EcoVadis, or unverified claims appear unless separately approved in `docs/verified_claims.md`.

## Service Detail QA Checklist

Before merging service-detail work, verify on the Vercel Preview URL:

- the eight canonical HU service detail URLs return 200;
- the eight legacy detail URLs listed above return 404;
- EN/DE/ZH service detail URLs for the eight services return 404;
- `/sitemap.xml` includes exactly the eight ready HU service detail URLs;
- `/sitemap.xml` does not include legacy service detail URLs;
- `/sitemap.xml` does not include EN/DE/ZH service detail URLs;
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

## Contact Rate-Limit QA

`/api/contact` uses a durable Upstash Redis / Vercel KV-compatible REST rate
limiter when these environment variables are configured:

- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

Production requires both values. If they are missing or Redis is unavailable in
production, contact submissions fail closed before DB insert/email. Local
development and Vercel Preview may fall back to the in-memory limiter and log a
non-secret warning so QA is not blocked.

The current policy is 5 submissions per minute per client IP. The IP is derived
from Vercel/proxy-controlled forwarded headers when available and is hashed
before being used in Redis keys. Do not print Redis REST URLs or tokens in logs,
screenshots, or support notes.

For Preview QA, verify:

- normal form submission still succeeds when the limit is not exceeded;
- repeated submissions from the same client receive `429` after the limit;
- missing Preview Redis credentials produce only a non-secret fallback warning;
- production deploys have Redis credentials configured before contact testing.
