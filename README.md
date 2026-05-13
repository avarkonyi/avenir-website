# Avenir Website

Next.js App Router website for Avenir Facility Management.

This repo is the public B2B lead-generation website and SEO/GEO-ready service
platform for Avenir. It currently includes the public marketing site, admin CMS,
Hungarian service detail pages, a proof-gated partner logo strip, HU-first
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
- Eight ready HU service detail pages
- Homepage/footer links to ready HU service details
- Admin-managed Partner Logo Strip with proof gating
- HU public article layer: `/hu/hirek` and `/hu/hirek/[slug]`
- Contact form with service prefill
- Legal pages
- `/sitemap.xml`
- `/robots.txt`
- `/llms.txt`
- `/llms-full.txt`

## Service Detail Layer

Current HU service detail URLs:

- `/hu/szolgaltatasok/objektumorzes`
- `/hu/szolgaltatasok/portaszolgalat`
- `/hu/szolgaltatasok/biztonsagtechnika`
- `/hu/szolgaltatasok/tavfelugyelet-vonuloszolgalat`
- `/hu/szolgaltatasok/mystery-shopping-helyszini-audit`
- `/hu/szolgaltatasok/rendezvenybiztositas`
- `/hu/szolgaltatasok/hard-fm`
- `/hu/szolgaltatasok/soft-fm`

Legacy detail URLs remain 404 unless a redirect policy is explicitly approved.
Legacy slugs may still be accepted as contact aliases and email-label fallback
values. EN/DE/ZH service detail pages are intentionally gated until their own
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
