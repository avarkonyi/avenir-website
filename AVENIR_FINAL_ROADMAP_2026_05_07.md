# Avenir Website Roadmap

Last updated: 2026-05-28

Status: post-launch roadmap index for the production HU/EN website.

Canonical roadmap:

- `docs/product_roadmap.md`

Working backlog:

- `docs/post_launch_backlog.md`

Project handover:

- `docs/project_handover_avenir_website.md`

## Executive Summary

The May 2026 roadmap has moved from launch preparation to post-launch product
development. The HU/EN website is live at `https://www.afm.hu`, including the
eight canonical service detail pages in both languages, HU/EN legal routes,
HU-first news routes, proof-safe SEO/AI-search files, consent-gated direct GA4,
and the official non-tracking LinkedIn company profile link.

The future roadmap is organized into Phase 0-8. It separates operational
stabilization, legal/privacy cleanup, proof and document-library work,
complaint and ethics communication, content growth, conversion measurement,
DE/ZH localization, Special Services, and the separate AOS product track.

## Completed Baseline

- HU and EN production site live.
- 8 HU service detail pages live.
- 8 EN service detail pages live.
- HU/EN legal pages live.
- DE/ZH remain homepage/partial-localization surfaces only.
- Sitemap includes ready HU/EN public routes and excludes non-ready routes.
- Production noindex is absent for ready HU/EN pages.
- Direct GA4 is consent-gated; GTM is not used.
- Analytics events are PII-guarded.
- D&B AA High Creditworthy 2026 is tracked separately from OPTEN/A+.
- Partner logo strip remains proof-gated.
- Admin allowlist and upload magic-byte hardening are implemented.

## Phase 0-8 Roadmap

### Phase 0 — Post-launch Stabilization

Stabilize the live HU/EN production site after launch.

Focus:

- production contact form smoke test;
- Search Console and Bing sitemap submission;
- IndexNow when approved;
- GA4 verification and event monitoring;
- production route smoke monitoring;
- mobile overflow checks;
- consent banner placement review;
- EN news broken-link handling;
- DE/ZH partial-localization flow cleanup.

Production QA commands:

```bash
npm run qa:preview -- https://www.afm.hu --allow-production
npm run qa:analytics -- https://www.afm.hu --allow-production
```

### Phase 1 — Legal, Privacy and Governance Cleanup

Clean up legal, privacy, proof and sensitive-service governance after launch.

Focus:

- HU/EN Privacy Policy version sync;
- analytics legal/privacy review;
- GA4 consent/privacy documentation;
- private investigation dropdown explanation;
- sensitive-data warning improvements;
- OPTEN vs D&B governance;
- D&B AA High Creditworthy 2026 proof wording;
- `docs/verified_claims.md` governance;
- no legal advice, no GDPR guarantee and no NAIH guarantee guardrails.

### Phase 2 — Trust Center and Public Document Library

Create a dedicated public proof and procurement-support layer.

Focus:

- Trust Center / Megfelelőségi központ;
- public document library / dokumentumtár;
- ISO 9001 certificate;
- ISO 27001 certificate;
- licence summaries;
- professional liability insurance summary if approved;
- D&B AA proof-safe statement;
- privacy and data-protection documents;
- complaints information;
- ethics / Code of Conduct documents;
- supplier due diligence documents;
- ESG / sustainability documentation in proof-safe framing only;
- downloadable procurement/tender pack;
- approved public use / internal only / pending review status model.

Rule: do not publish proof documents or claims without approval and
expiry/status tracking.

### Phase 3 — Complaint Handling and Ethics Layer

Create a professional public process layer for complaints, conduct and
escalation.

Focus:

- Panaszkezelés;
- complaint handling page or section;
- Etikai kódex / Code of Ethics;
- complaint intake path;
- escalation/process owner;
- expected response model without SLA overclaim;
- what information users should not submit through the public form;
- separation from service quote/contact form if needed;
- internal routing to responsible owner.

Important distinction: complaint handling is not the same as whistleblowing.
Do not imply a regulated whistleblowing system unless the company has one and
it is legally reviewed.

### Phase 4 — Content Growth / Tudástár

Develop the site from a launch brochure into a knowledge and
procurement-support site.

First 5 HU article topics:

1. Hogyan épül fel egy jó objektumőrzési szolgálati rend?
2. Mit tartalmazzon egy portaszolgálati és recepciós működési protokoll?
3. Mit jelent a távfelügyeleti riasztás-verifikáció és eszkaláció?
4. Hard FM és Soft FM: mi a különbség vállalati helyszíneken?
5. Mit tud és mit nem tud egy próbavásárlás és szolgáltatásaudit?

Additional preserved ideas:

- procurement checklists;
- security scope templates;
- event security brief checklist;
- data-protection-aware security technology explainer;
- service audit limitations article;
- Integrated Facility and Security Operations page;
- industry landing pages for logistics, office, industrial, retail/commercial,
  multi-site and event-venue audiences.

### Phase 5 — Conversion and Measurement Optimization

Improve lead quality, conversion clarity and analytics after the live launch.

Focus:

- lead quality review;
- contact form thank-you state;
- quote-preparation copy;
- better “what happens next” explanation;
- service selection quality;
- phone/email click tracking review;
- `contact_submit_success` as GA4 key event if approved;
- `service_cta_click` analysis;
- `special_service_option_selected` review;
- GA4 event monitoring;
- Vercel Analytics / Speed Insights;
- Search Console and Bing query monitoring.

Guardrails: no PII in analytics events, no marketing pixels without
consent/privacy review, and GTM only if multiple marketing tags become
necessary.

### Phase 6 — DE/ZH Localization

Decide and implement the long-term German and Chinese localization model.

Option A: full DE/ZH rollout.

- DE/ZH legal pages;
- DE/ZH service detail pages;
- DE/ZH news policy;
- reviewed translations;
- hreflang and sitemap inclusion;
- route readiness rules;
- DE/ZH QA smoke.

Option B: partial homepage-only localization.

- DE/ZH homepage only;
- no DE/ZH service detail routes;
- no DE/ZH legal/news routes;
- noindex if appropriate;
- route-aware language switcher;
- footer legal links point only to existing HU/EN legal pages;
- no broken DE/ZH 404 user flows.

### Phase 7 — Special Services Layer

Prepare sensitive/special services separately from the core 8 service pages.

Candidate services:

- Helyszíni biztonsági audit / Site Security Audit;
- Adatvédelmi és GDPR-folyamatfelmérés / Data Protection and GDPR Process
  Review;
- Magánnyomozás / Private Investigation.

Guardrails:

- planned/discovery-only until approved;
- no public route until legal/proof/content review;
- no GDPR compliance guarantee;
- no legal advice;
- no hidden monitoring or employee-surveillance framing;
- no police/authority framing;
- no sensitive personal data through standard public contact form;
- private investigation requires preliminary consultation / special intake;
- complaint handling and private investigation must not be conflated.

### Phase 8 — Separate AOS Product Track

Keep the internal AOS product roadmap separate from the public website roadmap.

AOS ideas:

- guard log;
- site instructions;
- incident reporting;
- supervisor review;
- AI Report Assistant;
- proposal generation;
- internal document workflows;
- operational handover documents;
- service instruction templates;
- internal escalation matrix;
- admin/operator workflows.

Guardrails:

- do not mix AOS internal workflows with public website service copy;
- no AOS promises on the public site unless product scope is confirmed;
- no AI-generated report promise in public service copy unless operationally
  approved;
- proposal generation is internal tooling unless separately launched.

## Strategic Ideas Preserved

- Industry landing pages.
- Integrated Facility and Security Operations page.
- Procurement / tender readiness page.
- HU/EN capability statement PDF.
- Proof library / verified claims governance.
- Partner/logo strip decision: approved logo wall, industry sectors or sector
  icons.
- Career expansion: `/karrier`, job detail pages, JobPosting schema, security
  guard recruitment and FM operations roles.
- Future EN-native slug architecture with `/en/services/...`, 301 redirect
  plan, canonical/hreflang/sitemap update.

## Source Documents

- `docs/product_roadmap.md`
- `docs/post_launch_backlog.md`
- `docs/project_handover_avenir_website.md`
- `docs/code_architecture.md`
- `docs/service_pages_playbook.md`
- `docs/copy_strategy.md`
- `docs/verified_claims.md`
- `docs/legal/analytics-privacy-review.md`
