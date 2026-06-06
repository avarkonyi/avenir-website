# Avenir Website Project Handover

Last updated: 2026-06-06

Production URL: https://www.afm.hu

Repository: `C:\Users\andra\avenir-website`

## Purpose

This document gives a new developer or product owner enough context to continue
the Avenir website after the HU/EN production launch. It summarizes the current
state, architecture, safety rules, roadmap references, and next decisions.

The detailed Phase 0-8 product roadmap lives in:

- `docs/product_roadmap.md`

The actionable post-launch backlog lives in:

- `docs/post_launch_backlog.md`

The proof and public-claim governance source of truth is:

- `docs/verified_claims.md`

## Current Production Scope

The production site is live for:

- HU homepage: `/hu`
- EN homepage: `/en`
- KO homepage draft: `/ko`
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
- HU news index/detail routes when article readiness passes:
  - `/hu/hirek`
  - `/hu/hirek/[slug]`
- `sitemap.xml`, `robots.txt`, `llms.txt`, `llms-full.txt`

DE now has controlled review-mode service and legal routes. ZH remains a
homepage/partial-localization surface only. KO is a homepage-only draft
scaffold and is translation-review-required. These locales should not expose
indexable service detail, legal or news detail flows until a full localization
decision and review process is completed.

German current-state note:

- `/de` is live as a partial homepage, but it is noindex and excluded from the
  sitemap.
- `/de/szolgaltatasok/*` is implemented in review mode in the current source:
  after deploy the eight canonical service detail routes return 200 with
  `noindex, follow` and remain outside sitemap/hreflang.
- `/de/adatvedelem`, `/de/aszf` and `/de/impresszum` are implemented in legal
  review mode: after deploy they return 200 with `noindex, follow` and remain
  outside sitemap/hreflang.
- `/de/hirek` and `/de/hirek/[slug]` are intentionally closed.
- DE footer/contact legal links use the DE legal review-mode pages.
- 2026-06-06 DE framework polish (runtime only): operative value pillars,
  native German consent copy, `Dienstleistungen` nav terminology, FM-aligned
  hero eyebrow and `Geschulte Mitarbeitende`; routes/indexing/DB unchanged;
  native review pending.
- DE Phase 0 audit and rollout plan: `docs/de_phase0_audit.md`.
- German terminology seed: `docs/translations/german_glossary.md`.

## Architecture Summary

Technology:

- Next.js App Router
- TypeScript
- Drizzle ORM
- Neon PostgreSQL
- Vercel
- Vercel Blob for admin uploads
- NextAuth v5 with Microsoft Entra ID
- Resend for contact notification email
- Upstash/Vercel KV-compatible Redis REST rate limiter
- Direct consent-gated GA4, not Google Tag Manager

Main public routes:

- `app/[locale]/page.tsx`
- `app/[locale]/szolgaltatasok/[slug]/page.tsx`
- `app/[locale]/hirek/page.tsx`
- `app/[locale]/hirek/[slug]/page.tsx`
- `app/[locale]/adatvedelem/page.tsx`
- `app/[locale]/aszf/page.tsx`
- `app/[locale]/impresszum/page.tsx`

Main APIs:

- `app/api/contact/route.ts`
- `app/api/admin/upload-image/route.ts`
- `app/api/admin/upload-pdf/route.ts`

Main architecture references:

- `docs/code_architecture.md`
- `docs/staging_runbook.md`
- `docs/service_pages_playbook.md`

## Service Layer

There are 8 canonical services.

| HU label | EN label | Slug |
| --- | --- | --- |
| Élőerős objektumőrzés | On-site Security Guarding | `objektumorzes` |
| Recepciós és portaszolgálat | Reception and Gatehouse Services | `portaszolgalat` |
| Biztonságtechnika | Security Technology | `biztonsagtechnika` |
| Távfelügyelet és vonulószolgálat | Remote Monitoring and Response Service | `tavfelugyelet-vonuloszolgalat` |
| Próbavásárlás és szolgáltatásaudit | Mystery Shopping and Service Audit | `mystery-shopping-helyszini-audit` |
| Rendezvénybiztosítás | Event Security | `rendezvenybiztositas` |
| Hard FM | Hard FM | `hard-fm` |
| Soft FM | Soft FM | `soft-fm` |

Service readiness is DB-backed. A service detail page should only render for a
locale when that exact locale has the required localized detail fields and the
row is active/published. Do not infer readiness from static i18n labels alone.

Legacy service aliases are kept for contact/query/email compatibility but must
not become public service detail URLs unless a redirect policy is approved.

## SEO, Hreflang and Sitemap

Production sitemap should include:

- HU and EN homepages;
- HU and EN legal pages;
- ready HU and EN service detail pages;
- ready HU article URLs.

Production sitemap should exclude:

- DE/ZH/KO service detail routes;
- DE/ZH/KO legal routes;
- DE/ZH/KO news routes;
- legacy service slugs;
- admin/API/internal routes.

Hreflang should advertise only existing, publishable routes. Legal hreflang is
HU/EN only. Service hreflang should reflect ready service locales only.

## Analytics

The site uses direct GA4 through `NEXT_PUBLIC_GA4_ID`.

Current production measurement ID:

`G-W1TRX8R1J3`

Consent rules:

- GA4 must not load before analytics consent.
- Rejecting analytics must keep GA4 blocked.
- Missing `NEXT_PUBLIC_GA4_ID` must not break the site.
- No PII may be sent to analytics.

Events:

- `page_view`
- `contact_submit_success`
- `contact_submit_error`
- `phone_click`
- `email_click`
- `service_cta_click`
- `special_service_option_selected`

Do not add GTM or other marketing pixels unless a separate consent/privacy
decision is made.

## Contact Form

Contact API flow:

1. origin check;
2. body size guard;
3. JSON parse;
4. Zod validation;
5. honeypot;
6. Redis/KV rate limit;
7. DB insert;
8. Resend notification email.

Rate-limit env pairs:

- `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`
- or `KV_REST_API_URL` / `KV_REST_API_TOKEN`

Do not use `KV_REST_API_READ_ONLY_TOKEN` for rate limiting.

Production contact submissions fail closed if durable Redis/KV REST limiting is
not configured or unavailable.

## Admin and Upload Security

Admin access uses the shared `requireAdmin()` helper:

- `lib/admin/require-admin.ts`

The helper calls `auth()`, requires `session.user.email`, normalizes it and
checks it against `ALLOWED_ADMIN_EMAILS`.

Upload routes validate magic bytes:

- PDF: `%PDF`
- JPEG: `FF D8 FF`
- PNG: `89 50 4E 47 0D 0A 1A 0A`
- WEBP: `RIFF....WEBP`

Do not weaken admin auth or upload validation without a separate security
review.

## Neon / Database Context

Known endpoints:

- staging: `ep-twilight-sound-al2b7jsb`
- production: `ep-young-meadow-aln5ux5m`

Known branches:

| Purpose | Branch ID | Branch name |
| --- | --- | --- |
| Production/main | `br-divine-silence-almpoz68` | production/main |
| Staging | `br-round-fog-al4isa1i` | staging |
| Backup before launch | `br-polished-tooth-al7hswta` | `prod-backup-before-afm-launch-20260524-1922` |
| Preserved old production | `br-super-art-alhsoh24` | `prod-preserved-during-afm-launch-20260524-1930` |

The production DB was restored from staging through a Neon branch-level restore.
That does not grant permission for future production DB writes.

Always verify target before DB operations:

```bash
node scripts/verify-db-target.mjs --target staging --runtime-only
node scripts/verify-db-target.mjs --target production --allow-production --runtime-only
```

## Roadmap Overview

The ongoing roadmap is Phase 0-8:

- Phase 0: Post-launch stabilization.
- Phase 1: Legal, privacy and governance cleanup.
- Phase 2: Trust Center and public document library.
- Phase 3: Complaint handling and ethics layer.
- Phase 4: Content growth / Tudástár.
- Phase 5: Conversion and measurement optimization.
- Phase 6: DE/ZH/KO localization.
- Phase 7: Special Services layer.
- Phase 8: Separate AOS product track.

Read `docs/product_roadmap.md` for the full roadmap and
`docs/post_launch_backlog.md` for the working backlog.

## Strategic Ideas Preserved

The roadmap intentionally preserves these older ideas:

- industry landing pages for logistics sites, office buildings, industrial
  parks, retail/commercial sites, multi-site portfolios and event venues;
- Integrated Facility and Security Operations page;
- procurement / tender readiness page;
- HU/EN capability statement PDF;
- proof library / verified claims governance;
- partner/logo strip decision between logo wall, sector icons or sector text;
- career expansion with `/karrier`, job detail pages and JobPosting schema;
- future EN-native slug architecture with `/en/services/...` and redirects;
- document library / dokumentumtár;
- Etikai kódex / Code of Ethics;
- panaszkezelés / complaint handling;
- Special Services;
- separate AOS product track.

## Do-Not-Do Rules

Unless explicitly approved:

- do not deploy production;
- do not write production DB;
- do not run migrations;
- do not run seeds/imports;
- do not edit `.env.local` or `.gitignore`;
- do not change service copy;
- do not change routes or slugs;
- do not change sitemap policy;
- do not add client names, partner names, testimonials or case studies;
- do not add unverified certification, ESG, EcoVadis or OPTEN claims;
- do not add legal/GDPR/NAIH guarantees;
- do not add SLA or guaranteed response/arrival/repair-time wording;
- do not add marketing pixels without consent/privacy review;
- do not send PII to analytics;
- do not expose secrets or full connection strings.

## Recommended Start for the Next Developer

1. Check git state.
2. Read `docs/product_roadmap.md`.
3. Read `docs/post_launch_backlog.md`.
4. Run docs/static validation only if working on docs.
5. For production smoke, use explicit production flags.
6. For DB work, verify target and run dry-run first.
