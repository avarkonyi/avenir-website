# Avenir Website Code Architecture

Last updated: 2026-05-14

Status: current architecture reference for `staging-service-pages`.

This document describes the current code architecture of the Avenir website and
the intended evolution path toward Avenir Operating System (AOS). It is a
technical orientation document, not an implementation ticket list.

## 1. Executive Overview

The Avenir website is a Next.js App Router application for Avenir Facility
Management. It is currently built as a public B2B lead-generation website with
an admin CMS, DB-backed content surfaces, proof-safe trust signals, and
SEO/GEO/AI-search grounding.

The current product layers are:

- Public website: locale homepages, public legal pages, services, references,
  certifications, HU public articles/news teasers, career block, and contact
  form.
- Service detail layer: eight ready Hungarian service detail pages, using
  canonical public slugs and DB-backed readiness checks.
- Article layer: HU-first public article index and detail routes backed by the
  existing news admin table and strict readiness checks.
- Trust/partner layer: admin-managed partner records with a proof-gated
  homepage logo strip.
- Lead intake: contact form with canonical and legacy service prefill, DB
  message storage, and notification email generation.
- Admin CMS: authenticated management of services, partners, news, messages,
  certifications, positions, and settings.
- SEO/GEO/AI-search: metadata, canonical/hreflang, sitemap, robots, JSON-LD,
  `llms.txt`, and `llms-full.txt`.
- Release safety: staging-first DB target checks, pilot seed guards, sanitized
  DB error output, preview noindex, and production approval rules.
- Future AOS: mini-CRM, Guard Log, AI Report Assistant, document workflows,
  proposal generation, Trust Center, and tender material flows. These are
  documented future concepts, not current implementation.

The current priority remains public website stability, service pages, trust
signals, SEO/GEO, and conversion before deeper AOS modules.

## 2. High-Level Architecture Diagram

```text
Public user
  -> Next.js public routes
     -> /[locale]
     -> /[locale]/szolgaltatasok/[slug]
     -> /hu/hirek and /hu/hirek/[slug]
     -> /[locale]/adatvedelem | /aszf | /impresszum
     -> /sitemap.xml | /robots.txt | /llms.txt | /llms-full.txt
  -> DB-backed public queries
     -> services readiness and content
     -> partner logo proof gating
     -> news/article/certification listings
  -> Contact form
     -> /api/contact
     -> Zod validation, honeypot, origin/rate controls
     -> Neon DB messages table
     -> Resend notification email

Admin user
  -> Microsoft Entra ID via NextAuth
  -> /admin CMS routes
  -> server actions
  -> Neon DB
  -> public revalidation
  -> Vercel Blob uploads for approved assets

Build/SEO systems
  -> generateStaticParams and sitemap
  -> DB-backed published service and HU article path queries
  -> sanitized fail-loud behavior on DB lookup failure
  -> AI-search grounding files
```

## 3. Route Architecture

### Public Locale Homepages

Route: `app/[locale]/page.tsx`

Supported locale segments:

- `/hu`
- `/en`
- `/de`
- `/zh`

The homepage composes the public sections:

- `Nav`
- `Hero`
- `About`
- `Services`
- `References` with `PartnerLogoStrip`
- `Certifications`
- `News`
- `Career`
- `Contact`
- `Footer`

The page is server-rendered with ISR (`revalidate = 3600`). It fetches:

- active top-level services for service cards, footer, and contact options;
- DB-backed ready HU service detail slugs for homepage/footer detail links;
- locale-published news teasers, with HU links only for HU-ready articles;
- partner logos indirectly through `PartnerLogoStrip`.

### Service Detail Pages

Route: `app/[locale]/szolgaltatasok/[slug]/page.tsx`

This route renders public service detail pages only when the DB row is active,
published, and has the required localized detail fields for the requested
locale. Missing, inactive, unpublished, legacy, or incomplete-locale pages
return `notFound()`.

### HU Public Article Routes

Routes:

- `app/[locale]/hirek/page.tsx`
- `app/[locale]/hirek/[slug]/page.tsx`

The current public article layer is HU-first:

- `/hu/hirek`
- `/hu/hirek/[slug]`

EN/DE/ZH article routes are intentionally not public yet and return 404.

The shared news queries in `lib/db/queries/news.ts` publish an article only
when the row is not deleted, `publishedHu = true`, `slug`, `titleHu`, `leadHu`,
`bodyHu`, and `date` are present, and `date <= now()`.

Article detail pages render safe plain text paragraphs, not raw HTML and not
Markdown. Article metadata/JSON-LD images accept only relative local paths or
approved Vercel Blob public URLs; arbitrary third-party image hotlinks are
ignored.

Build-time article path generation uses
`getAllPublishedNewsPathsHuForBuild(surface)`, which fails loudly with
sanitized DB target information if the DB-backed path query cannot run.

### Legal Pages

The locale legal routes are:

- `/[locale]/adatvedelem`
- `/[locale]/aszf`
- `/[locale]/impresszum`

All four locale pages can render, but the sitemap intentionally lists only the
Hungarian legal URLs until non-HU legal translations are reviewed and approved.

### Admin Routes

Admin routes live under `app/admin`. The `(dashboard)` route group renders at
`/admin` and does not appear in the URL.

Current admin modules:

- `/admin`
- `/admin/services`
- `/admin/partners`
- `/admin/news`
- `/admin/messages`
- `/admin/certifications`
- `/admin/positions`
- `/admin/settings`
- `/admin/login`

Admin is authenticated with NextAuth and Microsoft Entra ID. Server actions
also call `auth()` directly as defense in depth.

### API Routes

Current API routes:

- `/api/contact`
- `/api/auth/[...nextauth]`
- `/api/admin/upload-image`
- `/api/admin/upload-pdf`

Contact is public and validated. Upload routes are admin-only and re-check
session server-side.

### Sitemap, Robots, and AI-Search Files

- `app/sitemap.ts` generates `/sitemap.xml`.
- `app/robots.ts` generates `/robots.txt`.
- `public/llms.txt` is a concise AI-search grounding file.
- `public/llms-full.txt` is a fuller proof-safe AI-search summary.

`/llms.txt` and `/llms-full.txt` are static public files. They should include
only canonical public URLs and verified facts.

## 4. Locale Architecture

Supported locales are defined across the i18n and SEO layers as:

- `hu`
- `en`
- `de`
- `zh`

The public homepage exists for all four locales. Service detail pages are
locale-aware but currently ready only in Hungarian.

Rules:

- HU service detail pages are public only when HU required detail fields exist.
- EN/DE/ZH service detail pages remain 404 until their own required localized
  fields exist.
- HU fallback is used for some listing surfaces such as names/descriptions, but
  must not publish non-HU service detail pages.
- Hreflang for service detail pages advertises only ready locales.
- Service detail pages currently advertise `hu` and `x-default` only.
- Non-HU legal pages are excluded from the sitemap until reviewed/approved.

Locale metadata is generated in `app/[locale]/layout.tsx` using `SEO_DATA`,
`META_TAGLINES`, `META_DESCRIPTIONS`, and `OG_LOCALE_MAP`.

## 5. Service Detail Architecture

### Current Ready HU Service Pages

The current staging HU service detail layer contains these canonical URLs:

| Service | Canonical URL | Legacy slug |
| --- | --- | --- |
| Eloeros objektumorzes | `/hu/szolgaltatasok/objektumorzes` | `security` |
| Recepcio es portaszolgalat | `/hu/szolgaltatasok/portaszolgalat` | `reception` |
| Biztonsagtechnika | `/hu/szolgaltatasok/biztonsagtechnika` | `building` |
| Tavfelugyelet es vonuloszolgalat | `/hu/szolgaltatasok/tavfelugyelet-vonuloszolgalat` | `technical` |
| Mystery Shopping es helyszini audit | `/hu/szolgaltatasok/mystery-shopping-helyszini-audit` | `mystery` |
| Rendezvenybiztositas | `/hu/szolgaltatasok/rendezvenybiztositas` | `cleaning` |
| Hard FM | `/hu/szolgaltatasok/hard-fm` | `hardfm` |
| Soft FM | `/hu/szolgaltatasok/soft-fm` | `green` |

Canonical/legacy map:

- `security` -> `objektumorzes`
- `reception` -> `portaszolgalat`
- `building` -> `biztonsagtechnika`
- `technical` -> `tavfelugyelet-vonuloszolgalat`
- `mystery` -> `mystery-shopping-helyszini-audit`
- `cleaning` -> `rendezvenybiztositas`
- `hardfm` -> `hard-fm`
- `green` -> `soft-fm`

### Readiness Predicate

The source of truth is `lib/db/queries/services.ts`.

A service detail page is public for a locale only when:

- `services.isPublished = true`
- `services.isActive = true`
- the locale-specific required fields are non-empty:
  - `seoTitle*`
  - `seoDescription*`
  - `longDesc*`
  - `valueProposition*`

The route, static params, sitemap, related services, and ready homepage/footer
links all depend on this same readiness model.

Build-time path generation uses:

- `getAllPublishedServicePaths()`
- `getAllPublishedServicePathsForBuild(surface)`

The build helper fails loudly with a sanitized error if the DB-backed readiness
query cannot run. It must not emit a fake or empty service layer silently.

### Public Route Behavior

`app/[locale]/szolgaltatasok/[slug]/page.tsx`:

- calls `getPublishedServiceDetailBySlug(slug, locale)`;
- returns 404 via `notFound()` when the row is not ready;
- renders Service JSON-LD and BreadcrumbList JSON-LD;
- renders FAQPage JSON-LD only when visible FAQ content exists;
- builds canonical and hreflang metadata from ready locales only;
- links the CTA to `/<locale>?service=<canonical-slug>#contact`;
- hydrates related services through `getPublishedServicesBySlugs`.

Legacy detail URLs must remain 404 unless a redirect strategy is explicitly
approved later.

### Sitemap Behavior

`app/sitemap.ts` includes:

- locale homepages for `hu`, `en`, `de`, `zh`;
- HU legal pages only;
- service detail paths returned by `getAllPublishedServicePathsForBuild`.

It must not include:

- legacy service detail URLs;
- EN/DE/ZH service detail URLs until localized content is ready;
- admin/API routes;
- draft, inactive, or incomplete service pages.

### Related Services

Service rows store `relatedServiceSlugs` as a locale-independent JSON array.
Related slugs must use canonical slugs only. The public related-service query
filters missing, inactive, unpublished, or locale-incomplete related rows
safely, so a stale related slug should not break the page.

### Homepage and Footer Links

Homepage service cards and footer service links are rendered from active
top-level services. Detail links are HU-only and are added only when the slug is
present in the DB-backed ready HU service detail slug list.

Files:

- `app/[locale]/page.tsx`
- `components/Services.tsx`
- `components/Footer.tsx`
- `lib/service-detail-links.ts`

Rules:

- HU ready services link to `/hu/szolgaltatasok/<canonical-slug>`.
- EN/DE/ZH service cards/footer entries do not link to service detail pages.
- Unready services fall back to safe homepage anchor behavior.
- Legacy slugs are never used for public service detail links.

### Contact Prefill

Service detail CTAs and service cards use query parameters before the hash:

```text
/hu?service=objektumorzes#contact
```

`components/Contact.tsx` normalizes legacy query aliases to canonical slugs.
Form submission uses the canonical slug. Unknown query values are ignored
safely.

### Admin Edit Behavior

The Services admin module can edit homepage-card fields and service-detail
fields. Publishing is guarded by a HU baseline requirement. Public routes still
apply the stricter locale-specific readiness predicate, so admin publication
does not accidentally publish EN/DE/ZH pages without their required fields.

Service admin mutations revalidate:

- `/sitemap.xml`
- `/hu`, `/en`, `/de`, `/zh`
- affected service detail paths across all locales when the slug is known
- both old and new slug paths when a slug changes
- existing admin paths

### Service Seed Behavior

Service content operations are split:

- `scripts/seed-services.ts` seeds the baseline eight top-level services from
  i18n source data and preserves service-detail enrichment fields.
- `scripts/seed-pilot-*.ts` scripts apply one service detail page at a time.

New service pages should be added one by one. Pilot seeds intentionally write
HU detail fields only and intentionally do not write `nameHu`.

## 6. Partner / References / Trust Architecture

### Data Model

Partner records live in the `partners` table in `lib/db/schema.ts`.

Important fields:

- `name`
- `slug`
- `logoUrl`
- `websiteUrl`
- `sortOrder`
- `isActive`
- `isPublished`
- `showInLogoStrip`
- `logoUsageApprovedAt`
- `logoUsageApprovedBy`
- `logoUsageScope`

### Admin Partner Flow

Partner management lives under:

- `app/admin/(dashboard)/partners`
- `app/admin/(dashboard)/partners/_actions.ts`
- `app/admin/(dashboard)/partners/_components/PartnerForm.tsx`

Publishing a partner requires a name and logo URL. Showing a partner in the
homepage logo strip is a separate opt-in and requires proof metadata.

### Public Logo Strip Query

`lib/db/queries/partners.ts` exposes `getHomepagePartnerLogos()`.

The public query returns logos only when all conditions are true:

- active;
- published;
- `showInLogoStrip = true`;
- logo URL exists and is non-empty;
- approval date exists;
- approver/proof owner exists and is non-empty;
- usage scope exists and is non-empty.

If the logo-strip columns are missing before migration, the query returns an
empty list and logs a warning instead of exposing unapproved data.

### PartnerLogoStrip Component

`components/PartnerLogoStrip.tsx`:

- renders nothing when no approved logos exist;
- accepts only local paths or HTTPS Vercel Blob public asset URLs;
- does not hotlink arbitrary external logo URLs;
- uses static grid behavior for fewer than eight logos;
- uses CSS marquee behavior for eight or more logos;
- keeps duplicate marquee content decorative with `aria-hidden`;
- keeps logos non-clickable in Phase 1;
- uses meaningful alt text for visible logo images.

The `References` section currently frames this trust layer with neutral partner
wording, not testimonial or endorsement wording.

### Proof Registry

`docs/verified_claims.md` is the proof registry for partner logo usage and
other public claims. Partner logos must not be displayed unless public usage is
approved and recorded. Partner logos must not be converted into Organization
schema relationships, `sameAs`, `memberOf`, `brand`, customer, or endorsement
claims unless separately verified.

## 7. Contact / Lead Architecture

### Public Form

`components/Contact.tsx` is a client component rendered on the homepage. It
receives DB-backed service options from `app/[locale]/page.tsx`.

Key behavior:

- service prefill reads `?service=...`;
- legacy values are normalized to canonical slugs;
- unknown values are ignored safely;
- fallback options exist for known canonical service slugs;
- selected service submitted to the API is canonical;
- the `magannyomozas` dropdown option is hardcoded and triggers a special data
  warning.

### API Endpoint

`app/api/contact/route.ts` handles form submissions.

Request pipeline:

1. Production origin check.
2. Body size guard at 32 KB.
3. JSON parse.
4. Zod validation through `lib/contact-schema.ts`.
5. Honeypot check through `_website`; non-empty returns silent 200 with no DB
   write and no email.
6. IP rate limit through `lib/rate-limit.ts` in production only.
7. DB insert into `messages`.
8. Resend notification, fail-soft after DB storage.

The DB insert is primary storage. If message storage fails, the endpoint returns
500 because the lead cannot be safely accepted without persistence.

### Email Notification Labels

`lib/email-templates/notification.ts` maps both canonical and legacy service
slugs to Hungarian labels. This protects the notification email from stale
legacy submissions while the public site moves to canonical slugs.

## 8. Admin Architecture

### Authentication

Authentication is configured in `auth.ts` with NextAuth v5 and Microsoft Entra
ID. Admin access is restricted by a code-side email allowlist.

`proxy.ts` gates `/admin` routes and redirects unauthenticated users to
`/admin/login`. Admin server actions also call `auth()` directly because server
actions can be reached by direct POST.

### Admin Modules

Current modules:

- Services: DB-backed service list, hierarchy, detail fields, publish/active
  state, sort order, related slugs.
- Partners: logo/reference records, logo-strip proof fields, publish/active
  state, sort order.
- News: locale-published news teasers, HU public article source data, safe
  plain-text body editing, and admin image support.
- Messages: contact-form messages and mini-CRM lead fields.
- Certifications: certificate metadata and PDF/image support.
- Positions: career/job rows.
- Settings: general admin settings surface.

### Upload Routes

Admin uploads use Vercel Blob:

- `app/api/admin/upload-image/route.ts`
- `app/api/admin/upload-pdf/route.ts`

The upload routes:

- require an authenticated admin session;
- validate folder allowlists;
- validate MIME type and size;
- use UUID-derived filenames, not user-supplied filenames;
- return public Blob URLs.

### Public Revalidation

Admin service mutations revalidate public service surfaces because homepage
cards, footer links, detail pages, and sitemap can all depend on service data.

Admin partner mutations revalidate the partner admin paths and locale
homepages, because the homepage logo strip depends on partner data.

Admin news mutations revalidate `/hu`, `/hu/hirek`, affected HU article detail
paths when the slug is known, and `/sitemap.xml`.

## 9. Database / Migration Architecture

### Database Stack

The project uses:

- Neon PostgreSQL;
- Drizzle ORM;
- `drizzle/` SQL migrations;
- `drizzle/meta/` journal and snapshot metadata;
- `lib/db/schema.ts` as the TypeScript schema source;
- `lib/db` as the DB connection export.

### Important Tables

Current main tables include:

- `news`
- `positions`
- `messages`
- `certifications`
- `services`
- `partners`

### Service Detail Migration

Migration `0011_add_service_detail_fields.sql` adds service detail columns:

- localized SEO title and description;
- localized value proposition;
- localized use cases;
- localized included items;
- localized process steps;
- localized trust items;
- localized FAQ;
- `related_service_slugs`.

These fields back the public service detail page, metadata, JSON-LD, related
services, and pilot seed content.

### Partner Logo Strip Migrations

Migration `0012_partner_logo_strip_approval.sql` adds partner logo-strip proof
fields.

Migration `0013_partner_logo_strip_full_proof_index.sql` introduced a fuller
proof index under a separate name.

Migration `0014_partner_logo_strip_recreate_full_proof_index.sql` drops the
old partial indexes and recreates `idx_partners_logo_strip_public` with the
full proof predicate:

- active;
- published;
- `show_in_logo_strip`;
- logo URL exists;
- approval date exists;
- approver exists and is non-empty;
- usage scope exists and is non-empty.

`lib/db/schema.ts` and `lib/db/queries/partners.ts` should stay aligned with
that predicate.

### Migration Policy

Do not run migrations casually. The intended flow is:

1. Create migration and metadata.
2. Test on staging DB.
3. Verify app build and preview.
4. Get explicit approval before production migration.

Do not use `db:push` casually. It is a schema-sync tool, not the normal release
path for tracked migrations.

## 10. Seed / Content Operations

### Baseline Service Seed

`scripts/seed-services.ts` seeds the canonical eight top-level services from
`lib/i18n/{hu,en,de,zh}.ts`.

It owns homepage-card baseline fields:

- slug;
- icon;
- localized names;
- localized short descriptions;
- highlights;
- sort order;
- publish/active flags.

It intentionally preserves service-detail enrichment fields where possible. It
should be run before pilot detail seeds, not as a casual reset after them.

### Pilot Service Seeds

Pilot seed scripts:

- `seed-pilot-objektumorzes.ts`
- `seed-pilot-portaszolgalat.ts`
- `seed-pilot-biztonsagtechnika.ts`
- `seed-pilot-tavfelugyelet-vonuloszolgalat.ts`
- `seed-pilot-mystery-shopping-helyszini-audit.ts`
- `seed-pilot-rendezvenybiztositas.ts`
- `seed-pilot-hard-fm.ts`
- `seed-pilot-soft-fm.ts`

Each pilot seed:

- targets one canonical slug;
- accepts one legacy fallback slug;
- requires exactly one matching row;
- stops on no row or duplicate canonical+legacy rows;
- supports `--dry-run`;
- prints DB host/db only, never full `DATABASE_URL`;
- runs `ensureStagingDbTarget()` before SELECT/UPDATE;
- sets the canonical slug;
- sets `isPublished = true` and `isActive = true`;
- fills HU detail fields only;
- does not fill EN/DE/ZH fields;
- does not write `nameHu`;
- writes canonical `relatedServiceSlugs`.

Re-running a pilot seed overwrites that service's DB copy with the script copy.
This is intentional for staging content operations, but admins should remember
that manual edits can be overwritten.

### DB Target Guards

`scripts/verify-db-target.mjs` protects npm DB scripts by verifying the Neon
endpoint for staging or production.

`scripts/ensure-staging-db.ts` protects direct pilot seed execution, including
`npx tsx scripts/seed-pilot-*.ts`, and refuses non-staging endpoints. It prints
only redacted target information.

## 11. SEO / GEO / AI-Search Architecture

### Metadata

`app/[locale]/layout.tsx` generates locale homepage metadata:

- title;
- description;
- keywords;
- canonical;
- hreflang;
- Open Graph;
- Twitter card.

`app/[locale]/szolgaltatasok/[slug]/page.tsx` generates service detail
metadata from DB service detail fields and ready-locale checks.

### Canonical and Hreflang

Homepage canonical URLs are per locale. Homepage hreflang includes all four
locales and `x-default` to HU.

Service detail canonical URLs use the requested ready locale and canonical slug.
Service detail hreflang includes only locales that pass the readiness predicate.
For the current service layer that means HU and `x-default`.

### Sitemap

`app/sitemap.ts` emits:

- `/hu`, `/en`, `/de`, `/zh`;
- `/hu/adatvedelem`, `/hu/aszf`, `/hu/impresszum`;
- ready service detail URLs from the DB-backed readiness helper;
- `/hu/hirek` and ready HU article detail URLs when at least one HU-ready
  article exists.

It intentionally excludes:

- non-HU legal pages;
- legacy service detail URLs;
- non-ready EN/DE/ZH service detail URLs;
- EN/DE/ZH article URLs;
- admin/API/draft/internal routes.

### Robots

`app/robots.ts`:

- disallows all crawling outside production;
- allows public crawling in production;
- disallows `/admin` and `/api`;
- includes an explicit sitemap URL;
- lists AI-search/retrieval bots with the same public/admin split.

`proxy.ts` also adds `X-Robots-Tag: noindex, nofollow` for previews,
Vercel preview hosts, and staging hostnames.

### JSON-LD

Homepage layout JSON-LD includes:

- Organization;
- ProfessionalService/SecurityService;
- ItemList of services;
- WebSite;
- published certifications as EducationalOccupationalCredential.

Service detail pages include:

- BreadcrumbList;
- Service;
- FAQPage only when visible FAQ content renders.

HU article detail pages include:

- BreadcrumbList;
- Article;
- publisher and author as the Avenir organization, not invented people.

Do not add unverified partner/customer/award/rating/schema relationships.
Partner logos are visual trust assets, not schema proof.

### AI-Search Files

`public/llms.txt` is the concise AI-search reference.

`public/llms-full.txt` is the fuller proof-safe reference.

Rules:

- include only canonical public URLs;
- include the eight canonical HU service detail URLs;
- add public article URLs only after the article content is approved for
  AI-search grounding;
- exclude legacy slugs;
- exclude EN/DE/ZH service detail URLs until ready;
- exclude EN/DE/ZH article URLs until localized article routes and content are
  approved;
- exclude admin/API/internal URLs;
- exclude unapproved partner/client names;
- exclude OPTEN/EcoVadis/award/rating claims unless verified;
- omit future AOS/Shadow concepts as current public products.

### Verified Claims

`docs/verified_claims.md` is the guardrail for:

- numbers;
- certificates;
- licenses;
- response-time wording;
- partner/logo proof;
- schema-sensitive claims.

New public claims must be checked against it before publishing.

## 12. Security / Release Safety

### Production Safety

Production is protected by policy, not only by code. Do not assume a production
deploy, production migration, or production seed unless Andras explicitly
approves it.

The normal path is:

1. Feature or staging branch.
2. Vercel Preview.
3. Staging DB for migrations/content.
4. Public and admin QA.
5. Approval.
6. Merge.
7. Production migration/deploy only after separate approval.

### Secret and DB URL Safety

Rules:

- never print full `DATABASE_URL`;
- use `verify-db-target.mjs` for DB npm scripts;
- use `ensure-staging-db.ts` in pilot seed scripts;
- sanitize DB errors in build-time service path generation;
- never write directly to production from review/documentation tasks.

### Public Indexing Safety

Rules:

- admin/API routes are not in sitemap;
- preview/staging gets `noindex`;
- non-ready service detail pages return 404;
- legacy service detail URLs return 404;
- non-HU service detail pages stay 404 until required fields exist;
- build-time DB service path failure fails loudly rather than emitting stale
  SEO artifacts.

### Upload Safety

Admin upload routes:

- require session;
- validate MIME type;
- enforce file size;
- whitelist folders;
- use UUID filenames;
- avoid user-supplied destination names.

## 13. Future AOS Architecture

Future AOS concepts are documented for direction only. They are not current
implementation and should not overtake public website/trust/SEO priorities.

### Mini-CRM

The Messages module already contains early lead-management fields. Future
mini-CRM work may add dashboards, next-action views, activity timeline, exports,
ownership, and reminders. It should grow from actual lead-handling usage.

### AOS Guard Log

`docs/aos_guard_log.md` documents the future electronic guard log concept:

- tablet-first field app;
- guard/reception/site-operator workflows;
- registers for key handover, visitor entry, suppliers, vehicles, incidents,
  patrol/checkpoints, shift handover, found items, FM issues;
- supervisor review;
- exports and client reporting later.

Do not position it as employee surveillance, worker tracking, hidden
monitoring, or performance policing.

### AI Report Assistant

The AI Report Assistant is a future human-in-the-loop drafting tool. It may
transform raw guard notes into structured report drafts and flag missing
fields, but it must not:

- invent facts;
- overwrite raw notes;
- infer blame, intent, liability, legal breach, or disciplinary responsibility;
- send client reports automatically;
- act as a legal assessment tool.

Client-facing reports require explicit human approval.

### Document Workflows

Future document workflows may connect public compliance documents, internal
proof, OneDrive/SharePoint folders, tenders, reports, proposals, and Trust
Center materials. The public website should only expose approved public
documents or approved public links.

### Proposal Generation

Proposal generation is a later AOS module. It should build on lead data,
service scope, approved claims, trust materials, and document workflows. It
should not be built before the public lead-generation and mini-CRM foundations
are stable.

### Trust Center

The future Trust Center may include certificates, licenses, policies,
complaint-handling, sustainability/compliance documentation, and tender
materials. EcoVadis must remain preparation wording only until a verified
rating/medal/assessment exists.

## 14. Extension Playbooks

### Add a New Service Detail Page

1. Confirm the existing baseline service row, i18n key, legacy slug, and
   canonical public slug.
2. Patch `scripts/seed-services.ts` if a legacy slug must canonicalize safely.
3. Add contact alias support if the service has a legacy query value.
4. Add email notification labels for both canonical and legacy slugs.
5. Create a one-service pilot seed script from the existing pattern.
6. Fill HU detail fields only unless real localized content exists.
7. Do not write `nameHu` in the pilot seed.
8. Use canonical related service slugs only.
9. Run dry-run against staging.
10. Run write mode against staging only after review.
11. QA route 200, legacy 404, EN/DE/ZH 404, sitemap, hreflang, related links,
    contact prefill, and copy compliance.
12. Update AGENTS, staging runbook, service playbook, and roadmap as needed.

### Add Partner Logo Approval

1. Create or edit a partner in admin.
2. Upload a local/Vercel Blob logo asset.
3. Keep `isActive` and `isPublished` aligned with public intent.
4. Enable `showInLogoStrip` only if public logo usage is approved.
5. Record approval date.
6. Record approver/proof owner.
7. Record usage scope.
8. Verify the logo renders only on the homepage and does not become a schema
   relationship claim.
9. Record proof in `docs/verified_claims.md` or the approved proof registry.

### Extend the Article/News Layer

The HU article layer already uses `/hu/hirek` and `/hu/hirek/[slug]`.

For future article work:

1. Keep HU readiness strict: not deleted, HU-published, slug, title, lead,
   body, date, and no future date.
2. Keep EN/DE/ZH article routes private until their localized content and
   route policy are approved.
3. Add per-locale metadata and hreflang only when a locale is actually ready.
4. Add sitemap inclusion only for published locale-ready articles.
5. Keep draft, future-dated, deleted, incomplete, and untranslated articles out
   of public routes and sitemap.
6. Keep body rendering safe; add sanitized Markdown only as a separate approved
   phase.
7. Do not add client, partner, testimonial, case-study, award, rating, OPTEN,
   or EcoVadis claims unless verified.

### Add EN/DE/ZH Service Translations Later

1. Translate and review every required field for the target locale.
2. Fill `seoTitle*`, `seoDescription*`, `longDesc*`, and
   `valueProposition*`.
3. Fill supporting arrays and FAQ if used.
4. Verify the route returns 200 for that locale only after readiness is met.
5. Verify hreflang now includes that ready locale.
6. Verify sitemap includes the new ready locale URL.
7. Verify no HU fallback content is accidentally exposed as localized detail
   content.

## 15. Do-Not-Break Rules

Before changing this project, check:

- Do not publish legacy service detail URLs.
- Do not publish EN/DE/ZH service detail pages without localized required
  fields.
- Do not use legacy slugs in public service detail links.
- Do not print full DB URLs.
- Do not run production migrations without explicit approval.
- Do not run production seed scripts without explicit approval.
- Do not add unverified client, partner, OPTEN, EcoVadis, award, rating, or
  testimonial claims.
- Do not show partner logos unless approval date, approver/proof owner, usage
  scope, active/published state, logo asset, and logo-strip opt-in are present.
- Do not add partner/customer relationships to schema from the logo strip.
- Do not let future AOS ideas overtake the public website, trust, SEO, and
  conversion priorities.
- Do not change service readiness logic casually; route generation, sitemap,
  homepage/footer links, related services, and hreflang depend on it.
- Do not treat pilot seeds as harmless: they can overwrite staging DB copy for
  their target service.
- Do not rely on local `.next` artifacts for final SEO QA; verify the live
  Vercel Preview before merge.
