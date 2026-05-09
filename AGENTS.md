# AGENTS.md

## Project

This repository contains the Avenir website at afm.hu.

The project is not just a brochure website. It is being developed into a serious B2B lead-generation, SEO/GEO-ready platform, and later into the foundation of the Avenir Operating System: CRM, document workflows, service operations, reporting, and internal admin tooling.

## Current priority order

Follow this order unless the user explicitly says otherwise:

1. Staging and preview safety
2. Service detail pages
3. Special services as a discreet secondary service layer
4. References and partner trust signals
5. Compliance, sustainability, certificates, policies, and document library
6. SEO / GEO / AI-search readiness
7. Conversion improvements
8. Mini-CRM / AOS modules
9. OneDrive / SharePoint workflows
10. Proposal generator
11. Trust Center and tender materials

Do not prioritize internal AOS features ahead of the public lead-generation layer unless explicitly requested.

## Production safety

Never assume production deployment unless confirmed.

Do not make production DB migrations before the same migration has been tested on staging.

Do not push service-detail work directly to main without QA.

Every meaningful change should go through:

1. feature or staging branch
2. Vercel Preview
3. staging DB if migration is involved
4. public + admin QA
5. approval
6. merge to main
7. production migration/deploy only after approval

## SEO indexing principle

Only real, published, useful URLs should be indexable.

Drafts, admin routes, API routes, preview URLs, legacy spam URLs, incomplete service pages, and incomplete locale pages must not leak into sitemap or public route generation.

If a URL is not ready for users, it should not be in the sitemap.

If a service detail page is not ready, return 404.

## Service detail page rules

Service detail pages are currently implemented at:

app/[locale]/szolgaltatasok/[slug]/page.tsx

Current canonical pilot service:

- canonical slug: objektumorzes
- legacy slug: security
- service: Élőerős objektumőrzés

Do not bulk-generate pages for all old homepage service cards.

A service detail URL is public only if the required detail fields are present.

Before publishing multiple locales, verify that each locale has real localized content. Do not publish EN/DE/ZH pages from incomplete or weak fallback content.

Sitemap generation, route generation, metadata generation, and related service linking should use the same service-publication readiness logic.

## Mandatory checks for service pages

For every service detail page, check:

- route returns 200 only when ready;
- unfinished services return 404;
- sitemap includes only ready public service pages;
- canonical is correct;
- hreflang alternates are correct;
- page has exactly one H1;
- Service JSON-LD is present when appropriate;
- BreadcrumbList JSON-LD is present;
- FAQPage JSON-LD is included only if visible FAQ content is rendered;
- CTA links to contact with a valid service prefill;
- copy is specific to the service, not generic.

## Contact prefill rule

Use query parameters before the hash:

Correct:

/hu?service=objektumorzes#contact

Incorrect:

/hu#contact?service=objektumorzes

Use canonical service slugs in URLs.

## Compliance and document layer rules

Avenir is preparing a public compliance / sustainability / document layer,
but EcoVadis must be described as preparation only until an actual verified
rating, medal, or assessment exists.

Allowed wording:

- EcoVadis felkészülés;
- fenntarthatósági és megfelelőségi dokumentáció;
- nagyvállalati beszállítói elvárások támogatása;
- külső fenntarthatósági értékelésekre való felkészülés.

Forbidden unless later verified:

- EcoVadis tanúsított;
- EcoVadis minősített;
- EcoVadis auditált;
- EcoVadis medal / badge claims.

Separate documents into:

1. public website documents;
2. public but approval-required documents;
3. internal / audit-only / tender-only documents.

Do not publish confidential, personal, client-specific, contract-specific, or
internal audit evidence publicly.

## Planning agent roles

When planning roadmap/documentation-level work, reason through:

- Avenir Product / Roadmap Agent;
- Avenir Compliance Guard Agent;
- Avenir SEO/GEO Agent;
- Avenir UX / Navigation Agent;
- Avenir AOS / Document Workflow Agent;
- Avenir Copywriter Research Agent.

## Copywriting rules

Default language: Hungarian.

Avenir copy should be:

- serious;
- B2B-oriented;
- specific;
- operational;
- trustworthy;
- not overhyped;
- not generic.

Avoid vague phrases unless made concrete:

- modern megoldások;
- innovatív szolgáltatás;
- profi csapat;
- teljes körű szolgáltatás;
- egyedi igényekre szabva;
- magas minőség.

Every service page should explain:

1. what the service is;
2. when it is needed;
3. what Avenir actually does;
4. how the cooperation starts;
5. how control, reporting, escalation, or SLA-like operation works;
6. what related services connect to it;
7. what the visitor should do next.

Do not invent:

- client names;
- testimonials;
- logos;
- case studies;
- performance numbers;
- certifications;
- guarantees;
- legal claims;
- pricing claims.

Use placeholders or ask for confirmation if proof is missing.

## Code quality

Follow existing project structure and conventions.

Prefer small, focused changes.

Do not introduce new dependencies unless necessary.

Run the available checks before completing work:

- npm run build
- npm run lint
- npx tsc --noEmit

If a command cannot be run, explain why.

## Admin and DB rules

Admin service forms must remain compatible with the service detail fields.

For DB changes:

1. create migration;
2. test on staging DB;
3. seed only staging unless production approval is explicit;
4. do not assume production env variables;
5. keep production DB separate.

## Review before final answer

Before finishing a task, review against:

- docs/code_review.md
- docs/copy_strategy.md
- docs/service_pages_playbook.md
- docs/staging_runbook.md

Summarize:

1. files changed;
2. implementation decisions;
3. checks run;
4. SEO/indexing impact;
5. known limitations;
6. recommended next task.
