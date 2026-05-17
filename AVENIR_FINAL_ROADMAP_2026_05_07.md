# Avenir Roadmap - Current Staging Status

**Last updated:** 2026-05-15  
**Branch focus:** `staging-service-pages`  
**Status:** decision roadmap and release guardrail, not an automatic production approval.

This roadmap replaces the original May 2026 post-launch schedule with the
current state of the Avenir website. The project has moved from "plan the public
foundation" to "finish proof, content review, Preview QA, and production release
planning".

## 1. Current Status Summary

The public website foundation is implemented on staging. The current staging
branch includes:

- public lead-generation homepage;
- eight ready HU service detail pages;
- canonical/legacy service slug model;
- service readiness gating for route generation, sitemap, metadata, hreflang,
  related services, homepage links, and footer links;
- contact prefill with canonical values and legacy aliases;
- Partner Logo Strip MVP with admin-managed proof gating;
- HU public article layer Phase 1: `/hu/hirek` and `/hu/hirek/[slug]`;
- article image safety, optimized public image rendering, and upload
  normalization;
- SEO/GEO/AI-search files: `/llms.txt` and `/llms-full.txt`;
- CI workflow, README cleanup, code architecture documentation, and staging
  runbook updates;
- manual Vercel Preview smoke-test script;
- admin/news/service hardening and sanitized DB error handling;
- durable contact rate limiter code using Upstash/Vercel KV-compatible Redis;
- Hero performance refactor;
- request-scoped service query deduplication.

The current strategic direction is:

1. finish proof and trust population;
2. finish human service-copy review;
3. prepare 3-5 HU tudastar articles;
4. complete live Preview QA;
5. build a production release plan.

AOS may continue in the separate `avenir-aos` application track, but it is not
part of the website release. Do not start EN/DE/ZH service rollout, case
studies, or partner/client name publication in the website until the proof and
release gates below are closed.

## 2. Completed / Staging-Complete Phases

### Public Foundation

Status: **completed on staging**.

Implemented:

- locale homepages for HU/EN/DE/ZH;
- public navigation and contact flow;
- legal page routing;
- sitemap and robots policies;
- admin CMS baseline;
- DB-backed public content surfaces.

### Service Detail MVP

Status: **completed on staging**.

The first HU service detail MVP contains exactly eight ready Hungarian service
pages:

| Service | Canonical public URL | Legacy slug |
| --- | --- | --- |
| Elos objektumorzes | `/hu/szolgaltatasok/objektumorzes` | `security` |
| Recepcios es portaszolgalat | `/hu/szolgaltatasok/portaszolgalat` | `reception` |
| Biztonsagtechnika | `/hu/szolgaltatasok/biztonsagtechnika` | `building` |
| Tavfelugyelet es vonuloszolgalat | `/hu/szolgaltatasok/tavfelugyelet-vonuloszolgalat` | `technical` |
| Mystery Shopping es helyszini audit | `/hu/szolgaltatasok/mystery-shopping-helyszini-audit` | `mystery` |
| Rendezvenybiztositas | `/hu/szolgaltatasok/rendezvenybiztositas` | `cleaning` |
| Hard FM | `/hu/szolgaltatasok/hard-fm` | `hardfm` |
| Soft FM | `/hu/szolgaltatasok/soft-fm` | `green` |

Rules that remain active:

- canonical HU URLs are public when DB readiness fields are present;
- legacy detail URLs return 404 unless redirects are explicitly approved later;
- EN/DE/ZH service detail URLs remain 404 until localized required detail
  fields exist;
- sitemap includes only ready HU service detail URLs;
- hreflang advertises only ready service locales;
- homepage and footer links are readiness-driven and use canonical slugs only;
- pilot seed scripts are HU-only and may overwrite DB copy for their service.

### Partner Logo Strip MVP

Status: **completed on staging; content population pending approval**.

Implemented:

- admin-managed partner logo source;
- `showInLogoStrip` opt-in;
- approval date, approver/proof owner, and usage-scope fields;
- public query that requires active, published, logo-present, opt-in, and full
  proof metadata;
- compact homepage logo strip that renders nothing when no approved logos are
  available;
- no partner/customer schema claims in Phase 1.

No real partner logos or names should be published until approval is recorded.

### SEO / GEO / AI-Search Foundation

Status: **completed on staging**.

Implemented:

- canonical and metadata behavior for ready public pages;
- service JSON-LD, article JSON-LD, FAQPage where visible, and BreadcrumbList;
- sitemap policy for locale homepages, HU legal pages, ready HU service pages,
  and ready HU article pages;
- robots policy with Preview/noindex safeguards;
- `/llms.txt`;
- `/llms-full.txt`;
- proof-safe AI-search rules that exclude legacy URLs, non-ready locale URLs,
  admin/API/internal URLs, unapproved partner/client names, EcoVadis claims, and
  OPTEN claims unless separately approved.

### HU Article Layer Phase 1

Status: **completed on staging**.

Implemented:

- `/hu/hirek`;
- `/hu/hirek/[slug]`;
- HU readiness gate based on deleted status, HU publish flag, slug, title, lead,
  body, date, and non-future date;
- Article JSON-LD and breadcrumb schema;
- safe plain-text body rendering;
- safe image URL allowlist and optimized image rendering;
- sitemap inclusion only for ready HU articles;
- EN/DE/ZH article routes intentionally unpublished.

### CI / Onboarding / Architecture Docs

Status: **completed on staging**.

Implemented:

- lightweight GitHub Actions CI for install, typecheck, and lint;
- project-specific README;
- `docs/code_architecture.md`;
- updated staging runbook;
- manual Preview smoke-test script.

The lightweight CI intentionally does not run migrations, seed scripts, deploys,
IndexNow, or production commands. Production build remains a manual/Vercel
Preview gate because it can depend on DB-backed static generation and external
network access.

### Security / Performance Hardening Baseline

Status: **completed on staging**.

Implemented:

- sanitized DB error handling for public build/path surfaces;
- service and article image allowlists;
- safe article image rendering;
- admin upload optimization and safer image processing;
- news modal accessibility fixes;
- contact API service allowlist and normalization;
- durable Redis/KV-backed rate limiter code;
- Hero server-component refactor;
- service DB query deduplication;
- admin server-action error sanitization.

## 3. In Progress / Approval Needed

The following items block production release approval even though the branch is
safe to continue on staging:

- Service copy human review.
- OPTEN A+ / Bonitasi minosites proof decision or replacement.
- Approved partner logo population and logo-usage proof records.
- Production Upstash/Vercel Redis environment setup for contact rate limiting.
- Live Vercel Preview QA, including the manual smoke-test script.
- Final sitemap, robots, schema, llms, legal, and SEO QA on the live Preview.
- Production migration/content/proof plan.
- Explicit release approval from Andras.

## 4. Next Recommended Sprint

Recommended next sprint: **proof/trust population plus HU tudastar planning**.

Scope:

- collect and record approved partner logo proof;
- populate only partner logos with explicit homepage usage approval;
- decide OPTEN A+ wording: verify, soften, replace, or remove;
- prepare 3-5 HU tudastar article outlines/drafts;
- optionally plan a compact homepage "Hogyan dolgozunk" process block.

Why this is the best next sprint:

- competitor research shows Avenir is already structurally strong versus many
  Hungarian competitors;
- the biggest visible gaps are proof/trust density and article depth;
- it does not conflict with ongoing service-copy review;
- it does not require AOS, localization, schema expansion, or case-study
  approval;
- it improves B2B trust and AI-search grounding without adding risky claims.

Recommended first HU tudastar topics:

1. Hogyan keszuljon fel egy ceg objektumorzes inditasara?
2. Kamerarendszer es adatvedelem: milyen szempontokat erdemes elore tisztazni?
3. Portaszolgalat es latogatoi folyamat: mi legyen szabalyzatban?
4. Rendezvenybiztositas tervezese ceges esemenyeknel.
5. Hard FM es Soft FM: mikor erdemes kulon folyamatot kialakitani?

All article copy must remain educational, proof-safe, and non-legal-advice
worded.

## 5. Medium-Term Roadmap

### Trust Center / Megfeleloseg Page

Build after proof assets are ready.

Possible contents:

- licenses and permits;
- ISO certificates with carefully scoped wording;
- public compliance/sustainability preparation wording;
- document request/contact path;
- proof-safe explanation of what Avenir can share publicly and what remains
  tender/internal only.

EcoVadis may be described only as preparation unless verified rating/medal proof
exists.

### Article / Tudastar Phase 2

After the first HU articles are reviewed:

- add richer article QA process;
- consider categories/tags only if needed;
- consider sanitized Markdown or richer editor only after the plain-text model
  proves limiting;
- add article URLs to AI-search files only after content approval;
- keep EN/DE/ZH article routes deferred.

### Sector Landing Pages

Possible later HU landing pages:

- irodahazak;
- ipari es logisztikai telephelyek;
- kereskedelmi es szolgaltatoi helyszinek;
- rendezvenyhelyszinek;
- tobb telephelyes mukodesek.

These should reuse verified service and proof content without inventing sector
case studies.

### Conversion / Contact UX Improvements

Potential improvements:

- thank-you state or confirmation page if analytics tracking is planned;
- clearer "ajanlat elokeszites" expectations;
- optional process block before contact;
- follow-up flow for article/service visitors.

Do not add guarantees or hard response-time promises beyond verified claims.

### Special Services Layer

Status: **planned / discovery only; not public and not an implementation task**.

Special Services are a future website-scope content layer for sensitive,
compliance-heavy services. They are not AOS modules, not app features, and not
part of the current eight operational service-page rollout.

Candidate services:

| HU working title | EN working title | Documentation-only URL candidate |
| --- | --- | --- |
| Helyszíni biztonsági audit | Site Security Audit / On-site Security Audit | `/hu/szolgaltatasok/helyszini-biztonsagi-audit` |
| Adatvédelmi és GDPR-folyamatfelmérés | Data Protection and GDPR Process Review | `/hu/szolgaltatasok/gdpr-adatvedelmi-folyamatfelmeres` |
| Magánnyomozás | Private Investigation | `/hu/szolgaltatasok/magannyomozas` |

Sequencing:

1. finish core service-page review and translation workflow;
2. complete partner/trust proof population;
3. curate related services;
4. keep SEO/GEO groundwork stable;
5. only then plan Special Services discovery and legal review.

Guardrails:

- keep Mystery Shopping separate from Private Investigation;
- do not frame Site Security Audit as authority, police, or regulatory
  inspection;
- do not promise GDPR compliance or legal advice for GDPR Process Review;
- do not frame Private Investigation as general surveillance, hidden
  monitoring, employee surveillance, or disciplinary automation;
- do not invite users to submit sensitive personal data through the standard
  contact form;
- use preliminary consultation wording, not a standard quote-request flow;
- require legal/proof review before any public publication.

Future page structure should cover: what the service is, when it is appropriate,
when it is not the right service, required preliminary consultation,
legal/data-protection boundaries, what not to send through the contact form,
what the client receives, what Avenir does not undertake, and compliance-safe
FAQ.

### Production Release Plan

Create a separate production release checklist before merge/deploy:

- migration list and status;
- DB target verification;
- production Redis/KV env;
- production content seed/admin plan;
- service copy approval;
- partner logo proof audit;
- OPTEN decision;
- sitemap/robots/schema/llms QA;
- legal review where needed;
- rollback plan.

### AOS Separate Track Decision

AOS development has started as a separate app/repo track in `avenir-aos`.

Decision: Avenir Operating System is not part of the website production release.
The website release scope remains limited to the public website, CMS, service
detail pages, article layer, Partner Logo Strip, contact flow, SEO/GEO files,
and related documentation.

AOS release scope is handled separately in the `avenir-aos` repository. AOS may
continue in parallel, but it must not block, replace, or be bundled into the
website proof/release workflow.

Reference: `docs/aos_separation_decision.md`.

## 6. Deferred / Future-Only

These are intentionally deferred:

- EN/DE/ZH service rollout;
- EN/DE/ZH article routes;
- Special Services public pages and routes;
- client case studies;
- named partner/customer references without proof;
- Shadow Audit microsite or sub-brand;
- full Trust Center/tender-material portal;
- heavy article taxonomy or rich editor work.

AOS items such as Mini-CRM expansion, AOS Guard Log, AI Report Assistant,
proposal generation, and document workflows are no longer website-admin scope.
They belong to the separate `avenir-aos` application and release track.

## 7. Production Release Warning

Production deploy is **not approved** from this roadmap status alone.

Production requires:

1. explicit approval from Andras;
2. production DB target verification;
3. approved migration plan;
4. approved production seed/content plan;
5. service copy approval;
6. partner proof audit;
7. OPTEN proof decision or public-copy replacement;
8. production Redis/KV configuration for contact rate limiting;
9. final legal/SEO/schema/sitemap/robots/llms QA;
10. Vercel Preview smoke test and production release checklist.

The website production release must not deploy AOS, run AOS migrations, seed
AOS data, or assume AOS production readiness.

Do not treat staging-complete as production-approved.

## 8. Stale Roadmap Material Removed

The following old roadmap concepts are now obsolete or replaced:

- old daily schedule;
- old proposed commit sequence;
- five/six/seven service-page status references;
- Partner Logo Strip as future-only;
- HU article routes as future-only;
- `llms.txt` / `llms-full.txt` as future-only;
- generic "next step" sections that predate the eight-page MVP;
- production cutover language without the current proof/release gates.

## 9. Competitor Research Integration

Recent benchmark research indicates:

- Avenir is technically and structurally strong compared with many Hungarian
  competitors because the service architecture, canonical URLs, sitemap policy,
  contact prefill, and AI-search files are already disciplined.
- International benchmarks are stronger in proof density, knowledge depth,
  sector-specific positioning, and process explanation.
- The biggest Avenir gaps are visible proof/trust assets and tudastar depth,
  not more routes or AOS scope.
- The next strategic content priorities are approved logos, verified
  certificates/licenses, proof-safe process explanation, and 3-5 operational HU
  articles.
- Do not copy competitor claims, testimonials, named customer references,
  guarantee wording, legal-compliance promises, or logo usage without proof.

## 10. Claim Safety Rules

Do not add or approve:

- OPTEN A+ / Bonitasi minosites unless proof is recorded and approved;
- EcoVadis achieved certification, rating, medal, or audit claims unless proof
  exists;
- unapproved client names;
- unapproved partner names;
- testimonials;
- case studies;
- response-time or repair-time guarantees;
- legal/GDPR compliance guarantees;
- partner/customer relationships in schema based on the logo strip alone.

Use `docs/verified_claims.md` as the public-claim guardrail. If a claim is not
there and proof is missing, either remove it, soften it, or ask for approval.

## 11. Final Priority Order

Current practical order:

1. Service copy human review and proof decisions.
2. Approved partner logo population.
3. HU tudastar article outlines and drafts.
4. Optional homepage process block planning.
5. Live Preview QA and release checklist.
6. Production release planning.
7. Trust Center / Megfeleloseg page.
8. Article Phase 2 and sector pages.
9. Conversion improvements.
10. Special Services discovery, legal/proof review, and content strategy.
11. Coordinate separately with the `avenir-aos` application track if internal
    operations work is active in parallel.

This keeps the public lead-generation and proof layer separate from internal
AOS application development.
