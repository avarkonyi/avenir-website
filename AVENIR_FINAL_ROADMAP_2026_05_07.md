# Avenir Roadmap - Current Production Status

**Last updated:** 2026-05-28
**Branch focus:** `main`
**Status:** post-launch roadmap and release guardrail for the production HU/EN website.

This roadmap replaces the original May 2026 post-launch schedule with the
current state of the Avenir website. The project has moved from "finish proof,
content review, Preview QA, and production release planning" to "operate the
live HU/EN website safely, monitor launch quality, and continue proof/legal
governance".

## 1. Current Status Summary

The public website foundation is live at `https://www.afm.hu`. The current
production scope includes:

- public lead-generation homepage;
- eight ready HU service detail pages;
- eight ready EN service detail pages;
- HU/EN legal pages:
  - `/hu/adatvedelem`, `/hu/aszf`, `/hu/impresszum`;
  - `/en/adatvedelem`, `/en/aszf`, `/en/impresszum`;
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
- manual Vercel Preview/production smoke-test script;
- automated consent-gated analytics QA;
- admin/news/service hardening and sanitized DB error handling;
- durable contact rate limiter code using Upstash/Vercel KV-compatible Redis;
- direct consent-gated GA4, not GTM;
- official non-tracking LinkedIn company profile/entity link;
- Hero performance refactor;
- request-scoped service query deduplication.

The current strategic direction is:

1. monitor the launched production site;
2. complete post-launch contact, indexing, analytics and legal checks;
3. continue proof/trust governance, including D&B AA versus OPTEN/A+ policy;
4. prepare 3-5 HU tudastar articles;
5. keep future DE/ZH rollout and Special Services behind review gates.

AOS may continue in the separate `avenir-aos` application track, but it is not
part of the website release. Do not start DE/ZH service rollout, case studies,
or partner/client name publication in the website until the proof and review
gates below are closed.

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

### Service Detail Rollout

Status: **completed in production for HU and EN**.

The production service layer contains exactly eight ready Hungarian and eight
ready English service pages:

| Service | HU URL | EN URL | Legacy slug |
| --- | --- | --- | --- |
| Élőerős objektumőrzés / On-site Security Guarding | `/hu/szolgaltatasok/objektumorzes` | `/en/szolgaltatasok/objektumorzes` | `security` |
| Recepciós és portaszolgálat / Reception and Gatehouse Services | `/hu/szolgaltatasok/portaszolgalat` | `/en/szolgaltatasok/portaszolgalat` | `reception` |
| Biztonságtechnika / Security Technology | `/hu/szolgaltatasok/biztonsagtechnika` | `/en/szolgaltatasok/biztonsagtechnika` | `building` |
| Távfelügyelet és vonulószolgálat / Remote Monitoring and Response Service | `/hu/szolgaltatasok/tavfelugyelet-vonuloszolgalat` | `/en/szolgaltatasok/tavfelugyelet-vonuloszolgalat` | `technical` |
| Próbavásárlás és szolgáltatásaudit / Mystery Shopping and Service Audit | `/hu/szolgaltatasok/mystery-shopping-helyszini-audit` | `/en/szolgaltatasok/mystery-shopping-helyszini-audit` | `mystery` |
| Rendezvénybiztosítás / Event Security | `/hu/szolgaltatasok/rendezvenybiztositas` | `/en/szolgaltatasok/rendezvenybiztositas` | `cleaning` |
| Hard FM | `/hu/szolgaltatasok/hard-fm` | `/en/szolgaltatasok/hard-fm` | `hardfm` |
| Soft FM | `/hu/szolgaltatasok/soft-fm` | `/en/szolgaltatasok/soft-fm` | `green` |

Rules that remain active:

- canonical HU/EN URLs are public when DB readiness fields are present for the
  exact locale;
- legacy detail URLs return 404 unless redirects are explicitly approved later;
- DE/ZH service detail URLs remain 404 until localized required detail fields
  exist;
- sitemap includes ready HU/EN service detail URLs;
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
- sitemap policy for HU/EN homepages, HU/EN legal pages, ready HU/EN service
  pages, and ready HU article pages;
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

## 3. Post-Launch Backlog / Approval Needed

The following items remain open after production launch:

- Contact form production smoke status if not separately recorded after env
  changes.
- Google Search Console and Bing sitemap monitoring.
- GA4 Realtime/events monitoring after consented test visits.
- OPTEN/A+ public-use governance remains owner-deferred; D&B AA High
  Creditworthy 2026 is tracked separately as Dun & Bradstreet proof.
- Approved partner logo population and logo-usage proof records.
- HU/EN privacy policy version sync and DPO/legal review.
- DE/ZH 404-flow/noindex cleanup if any public links reappear.
- EN news route/content policy.
- Mobile overflow and consent-banner placement polish if still present in
  manual QA.

## 4. Next Recommended Sprint

Recommended next sprint: **post-launch monitoring plus proof/trust governance**.

Scope:

- verify contact form production smoke with non-sensitive test content;
- check Search Console/Bing sitemap status and IndexNow only when explicitly
  approved;
- confirm GA4 Realtime/events after accepted consent;
- collect and record approved partner logo proof;
- populate only partner logos with explicit homepage usage approval;
- maintain D&B AA / OPTEN distinction: do not call the D&B certificate OPTEN
  proof;
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
| Helyszíni biztonsági audit | Site Security Audit | `/hu/szolgaltatasok/helyszini-biztonsagi-audit` |
| Adatvédelmi és GDPR-folyamatfelmérés | Data Protection and GDPR Process Review | `/hu/szolgaltatasok/gdpr-adatvedelmi-folyamatfelmeres` |
| Magánnyomozás | Private Investigation | `/hu/szolgaltatasok/magannyomozas` |

Naming decisions:

- use `Adatvédelmi és GDPR-folyamatfelmérés` as the HU name, not `GDPR
  audit`;
- use `Data Protection and GDPR Process Review` as the EN name, not `GDPR
  Audit`;
- keep this service framed as process review, technical/operational input, and
  data-protection-aware assessment.

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
- Site Security Audit may cover security processes, access control, guarding
  model, escalation, camera/alarm process, documentation, and site-specific
  risks;
- Data Protection and GDPR Process Review may cover camera-system data points,
  access-control processes, visitor logs, gatehouse/reception data flow,
  retention logic, access rights, data-subject information, and operational
  documentation;
- do not promise GDPR compliance, legal advice, legal-basis sign-off, LIA,
  DPIA, or NAIH-compliance sign-off for Data Protection and GDPR Process
  Review;
- legal basis and final legal/data-protection decisions remain with the client
  and its advisers;
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

### Production / Post-Launch Release Plan

For future releases, create a separate production release checklist before
merge/deploy:

- migration list and status;
- DB target verification;
- production Redis/KV env;
- production content seed/admin plan;
- service copy approval;
- partner logo proof audit;
- D&B/OPTEN governance status;
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

- DE/ZH service rollout;
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

## 7. Production Change Warning

The HU/EN website is live in production. Future production deploys, database
operations, migrations, seed/import scripts, or content syncs are **not
approved** from this roadmap status alone.

Future production changes require:

1. explicit approval from Andras;
2. production DB target verification;
3. approved migration plan when schema changes are involved;
4. approved production content sync plan when DB content changes are involved;
5. partner/proof audit where public proof surfaces are touched;
6. D&B/OPTEN proof-policy check where creditworthiness wording is touched;
7. Redis/KV configuration check when contact infrastructure is touched;
8. final legal/SEO/schema/sitemap/robots/llms QA where those surfaces are
   affected;
9. Preview smoke, analytics QA if analytics is touched, and production smoke
   after release approval.

The website production release must not deploy AOS, run AOS migrations, seed
AOS data, or assume AOS production readiness.

Do not treat prior launch approval as blanket approval for later production
changes.

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
D&B AA High Creditworthy 2026 is the current approved creditworthiness claim
from Dun & Bradstreet proof. It must not be described as OPTEN A+ unless a
separate OPTEN-specific proof document is provided and reviewed.

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
