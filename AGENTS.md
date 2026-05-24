# AGENTS.md

## Project

This repository contains the Avenir website at afm.hu.

The project is not just a brochure website. It is being developed into a serious B2B lead-generation, SEO/GEO-ready platform, and the public website/CMS counterpart to the separate Avenir Operating System application track.

## Current priority order

Follow this order unless the user explicitly says otherwise:

1. Staging and preview safety
2. Service copy review, proof decisions, and production-release planning
3. References, approved partner logos, and other trust signals
4. HU tudastar / article depth
5. SEO / GEO / AI-search readiness
6. Conversion improvements
7. Trust Center and tender materials
8. Mini-CRM / AOS modules
9. OneDrive / SharePoint workflows
10. Proposal generator

Special services, compliance/document layers, Shadow Audit, and AOS Guard Log are important roadmap items, but they must not overtake the current public website/service-page, translation, trust, SEO, and conversion priorities unless the user explicitly reprioritizes them.

Do not implement internal AOS features inside the website unless explicitly approved.

## Special Services separation rule

Special Services are a future website-scope content layer, not AOS and not part
of the current eight operational service pages.

Planned/discovery-only candidates:

- `helyszini-biztonsagi-audit` — Site Security Audit;
- `gdpr-adatvedelmi-folyamatfelmeres` — Data Protection and GDPR Process
  Review;
- `magannyomozas` — Private Investigation.

Naming decisions:

- use `Adatvédelmi és GDPR-folyamatfelmérés` / `Data Protection and GDPR
  Process Review`;
- do not use `GDPR audit` / `GDPR Audit` as the main public title.

Do not create routes, schema, seed scripts, contact options, sitemap entries, or
public copy for these services unless explicitly requested. They require
separate legal/proof review, content strategy, and contact/data-submission
warnings before publication.

Guardrails:

- Mystery Shopping remains a service-quality/customer-journey audit, not
  Private Investigation.
- Site Security Audit must not be framed as authority, police, or regulatory
  inspection.
- Data Protection and GDPR Process Review may cover camera-system data points,
  access-control processes, visitor logs, gatehouse/reception data flow,
  retention logic, access rights, data-subject information, and operational
  documentation.
- Data Protection and GDPR Process Review must not promise GDPR compliance,
  provide legal advice, or sign off legal basis, LIA, DPIA, or NAIH compliance.
- Legal basis and final legal/data-protection decisions remain with the client
  and its advisers.
- Private Investigation must not be framed as general surveillance, hidden
  monitoring, employee surveillance, or automatic disciplinary reporting.
- Do not invite sensitive personal-data submissions through the standard
  contact form.

Current staging-complete layers:

- eight HU service detail pages;
- canonical/legacy service slug model;
- service readiness gating;
- homepage/footer service links to ready HU services;
- related services;
- contact prefill and server-side service allowlist;
- Partner Logo Strip MVP with proof gating;
- HU public article layer: `/hu/hirek` and `/hu/hirek/[slug]`;
- SEO/GEO files: `llms.txt` and `llms-full.txt`;
- CI, README, code architecture docs, staging runbook, and Preview smoke test;
- baseline hardening including durable contact rate limiter code, Hero refactor,
  and service DB query deduplication.

Do not start EN/DE/ZH service rollout, EN/DE/ZH article routes, case studies,
or named partner/client publication in the website until the proof, content,
and production-release gates are explicitly closed. AOS may continue separately
in `avenir-aos`, but it is not part of the website release.

## AOS separation rule

AOS is a separate internal application, not part of the website admin.

- Do not implement AOS modules inside `avenir-website` unless explicitly
  approved.
- AOS work belongs in the separate `avenir-aos` app/repo.
- Website `/admin` remains the CMS/admin surface for website content, not the
  internal AOS operations app.
- Website production release must not assume or include AOS deployment, AOS
  migrations, AOS seed data, or AOS production readiness.
- If website and AOS work happen in parallel, treat them as two separate
  releases with separate Vercel projects, Neon databases, domains, migration
  plans, QA, and approval gates.

## Future AOS Guard Log Scope

AOS Guard Log / Elektronikus őrnapló is a future AOS module, not an immediate website task.

Treat the future scope as an AOS Field App / Tablet App concept as well as an admin/reporting module. The field app should be tablet-first for guards, reception/porta staff, and site operators, with only field-relevant functions such as current shift, site instructions, quick guard log, incidents, registers, checkpoints, handover, site tasks, photos, and internal messages.

Checkpoint/GPS scope must stay compliance-safe: QR checkpoint MVP, NFC later, and GPS only tied to a specific check-in, task, incident, or report. Do not frame it as continuous employee tracking, worker tracking, hidden monitoring, or employee surveillance.

Future scope may include industry-specific registers and an AI Report Assistant, but only as a human-reviewed drafting workflow:

- guards create raw notes;
- AI may create a structured draft and flag missing fields;
- supervisors or territorial managers approve or request correction;
- client-facing reports are sent only after human approval;
- raw notes, AI drafts, edited versions, approved versions, and sent versions must be preserved.

AI must not invent facts, overwrite raw notes, make legal conclusions, assign blame without recorded evidence, or send reports automatically.

Use compliance-safe wording: structured service documentation, operational reporting, incident and handover logging, supervisor-approved report workflow, and AI-assisted draft. Avoid employee surveillance, worker tracking, hidden monitoring, and automatic disciplinary reporting.

The AI assistant must only transform and structure recorded facts. It must not be framed as automated decision-making, employee surveillance, disciplinary automation, automatic client notification, or a legal assessment tool. Future implementation planning must address lawful basis, data minimization, retention, role-based access, client-visible personal data, AI provider data processing, prompt/output storage, AI-assisted draft marking, and audit logging of corrections and supervisor decisions.

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

Current HU service detail layer:

Status: current staging HU service detail layer.

| Service | Canonical public slug | Legacy slug |
| --- | --- | --- |
| Élőerős objektumőrzés | `objektumorzes` | `security` |
| Recepciós és portaszolgálat | `portaszolgalat` | `reception` |
| Biztonságtechnika | `biztonsagtechnika` | `building` |
| Távfelügyelet és vonulószolgálat | `tavfelugyelet-vonuloszolgalat` | `technical` |
| Próbavásárlás és szolgáltatásaudit | `mystery-shopping-helyszini-audit` | `mystery` |
| Rendezvénybiztosítás | `rendezvenybiztositas` | `cleaning` |
| Hard FM | `hard-fm` | `hardfm` |
| Soft FM | `soft-fm` | `green` |

Service detail pages are added one by one.

Use canonical HU slugs in public service URLs and new CTA links. Legacy slugs may remain supported for seed lookup, contact query aliases, and email label safety, but legacy detail routes should keep returning 404 unless redirects are explicitly approved later.

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

/hu?service=portaszolgalat#contact

/hu?service=biztonsagtechnika#contact

/hu?service=tavfelugyelet-vonuloszolgalat#contact

/hu?service=mystery-shopping-helyszini-audit#contact

/hu?service=rendezvenybiztositas#contact

/hu?service=hard-fm#contact

/hu?service=soft-fm#contact

Incorrect:

/hu#contact?service=objektumorzes

Use canonical service slugs in URLs.

Legacy query aliases currently expected for backwards compatibility:

- `security` -> `objektumorzes`
- `reception` -> `portaszolgalat`
- `building` -> `biztonsagtechnika`
- `technical` -> `tavfelugyelet-vonuloszolgalat`
- `mystery` -> `mystery-shopping-helyszini-audit`
- `cleaning` -> `rendezvenybiztositas`
- `hardfm` -> `hard-fm`
- `green` -> `soft-fm`

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
