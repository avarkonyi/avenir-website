# Avenir Website Product Roadmap

Last updated: 2026-05-28

Production URL: https://www.afm.hu

## Executive Summary

The Avenir public website has completed its HU/EN production launch. The live
site now contains the Hungarian and English homepages, the eight canonical
service detail pages in both languages, reviewed HU/EN legal routes under the
Hungarian legal slugs, HU-first news routes, proof-safe SEO/AI-search files,
consent-gated direct GA4 analytics, and the official non-tracking LinkedIn
company profile link.

The next development period is no longer a launch sprint. It is a
post-launch product-development program: stabilize production, close legal and
privacy gaps, build a public trust/document layer, add complaint and ethics
process communication, grow educational content, improve conversion, decide the
DE/ZH localization model, prepare Special Services separately, and keep the
AOS internal product track outside the public website roadmap.

## Status Model

| Status | Meaning |
| --- | --- |
| Completed | Implemented and production-live or already accepted as a baseline. |
| Now | Current post-launch stabilization and governance work. |
| Next | High-value work after stabilization, usually proof, legal, content or conversion. |
| Later | Strategic expansion that needs preparation, review or separate product scope. |
| Strategic decision required | Owner/legal/business decision needed before implementation. |

## Completed Baseline

- HU and EN production site live at `https://www.afm.hu`.
- Eight HU service detail pages live.
- Eight EN service detail pages live.
- HU/EN legal pages live:
  - `/hu/adatvedelem`, `/hu/aszf`, `/hu/impresszum`
  - `/en/adatvedelem`, `/en/aszf`, `/en/impresszum`
- Production sitemap includes HU/EN services and legal routes.
- Production noindex is absent from ready public HU/EN pages.
- DE/ZH are homepage/partial-localization surfaces only.
- Direct GA4 is implemented with analytics consent; Google Tag Manager is not
  used.
- Analytics events are PII-guarded.
- Official LinkedIn company profile is added as a non-tracking profile/entity
  link.
- D&B AA High Creditworthy 2026 is the current proof-backed public
  creditworthiness wording; it is tracked separately from OPTEN/A+.
- Contact rate limiter supports Upstash REST and Vercel KV REST env names.
- Shared `requireAdmin()` allowlist enforcement is implemented.
- Admin uploads include PDF/JPEG/PNG/WEBP magic-byte validation.

---

## Phase 0 — Post-launch Stabilization

Purpose: stabilize the live HU/EN production site after launch.

Status: Now.

This phase is operational. It verifies that the live site is reachable,
measurable, crawlable, and not leaking broken user flows.

Scope:

- Real production contact form smoke test with non-sensitive test content.
- Google Search Console setup and sitemap submission.
- Bing Webmaster Tools setup and sitemap submission.
- IndexNow submission when explicitly approved.
- GA4 Realtime verification and event monitoring after accepted analytics
  consent.
- Production route smoke monitoring.
- Mobile overflow checks on realistic device widths.
- Consent banner placement review, especially on mobile.
- EN news broken-link handling.
- DE/ZH partial-localization flow cleanup.

Production QA commands:

```bash
npm run qa:preview -- https://www.afm.hu --allow-production
npm run qa:analytics -- https://www.afm.hu --allow-production
```

Exit criteria:

- Production contact form is verified with a safe test.
- Production sitemap is submitted and accepted for processing.
- GA4 page views and business events appear after consent.
- No ready-locale public navigation path leads to an avoidable 404.
- DE/ZH remain intentionally partial and do not expose unfinished routes.

Ownership / decision needed:

- Owner approval for IndexNow submissions.
- Owner or operator confirmation of contact-form smoke result.

---

## Phase 1 — Legal, Privacy and Governance Cleanup

Purpose: clean up legal, privacy, proof and sensitive-service governance after
launch.

Status: Now / Next.

This phase aligns the legal/privacy layer with actual production behavior and
keeps proof-sensitive claims controlled.

Scope:

- HU/EN Privacy Policy version sync.
- Analytics legal/privacy review.
- GA4 consent/privacy documentation review.
- GA4 Enhanced Measurement settings review, especially form interactions.
- Private investigation dropdown explanation.
- Sensitive-data warning improvements.
- OPTEN vs D&B governance is resolved in public wording: use D&B AA High
  Creditworthy 2026, and do not use OPTEN/A+ unless separate OPTEN-specific
  proof is approved.
- D&B AA High Creditworthy 2026 proof wording.
- `docs/verified_claims.md` updates.
- Proof-sensitive claim policy maintenance.

Guardrails:

- No legal advice wording.
- No GDPR compliance guarantee.
- No NAIH guarantee.
- No OPTEN A+ claim from the D&B certificate.
- No sensitive personal data through the general public contact form.

Exit criteria:

- Privacy/legal pages describe the actual consent and contact behavior.
- D&B AA and OPTEN/A+ are clearly separated.
- Public creditworthiness surfaces use D&B AA wording only.
- Special/sensitive service contact risks are documented.
- Proof-sensitive claims have allowed wording, source, status and owner.

Ownership / decision needed:

- Legal/DPO review of analytics and privacy copy.
- Separate owner/proof review only if an OPTEN-specific public claim is ever
  requested later.

---

## Phase 2 — Trust Center and Public Document Library

Purpose: create a dedicated public proof and procurement-support layer.

Status: Next.

This phase must be explicit. It should not be buried under generic proof
governance, because procurement teams need a predictable place to find approved
company, compliance and tender-support materials.

Public surfaces:

- Trust Center / Megfelelőségi központ.
- Public document library / dokumentumtár.
- Procurement / tender readiness page.
- Downloadable procurement/tender pack.
- Capability statement PDF in HU/EN.

Document and proof types:

- ISO 9001 certificate.
- ISO 27001 certificate.
- Licence summary.
- Security activity licence summary.
- Private investigation licence summary if publicly scoped.
- Professional liability insurance summary if approved.
- D&B AA proof-safe statement.
- Privacy documents.
- Data protection documents.
- Complaints information.
- Ethics / Code of Conduct documents.
- Supplier due diligence documents.
- ESG / sustainability documentation only in proof-safe framing.

Procurement / tender readiness page should cover:

- company data;
- licences;
- ISO certificates;
- insurance;
- D&B certificate;
- D-U-N-S number;
- DPO/legal contacts;
- downloadable documents;
- service scope overview.

Proof status model:

- Approved public use.
- Internal only.
- Pending review.

Proof library governance:

For each claim or proof asset, track:

- claim;
- source document;
- issuer;
- expiry date;
- approved public-use status;
- allowed wording;
- restricted wording;
- where it appears;
- owner/reviewer.

Strong rule:

Do not publish proof documents or claims without approval and expiry/status
tracking.

Guardrails:

- Do not publish confidential tender-only evidence.
- Do not publish personal data.
- Do not publish client-specific, contract-specific or internal audit evidence.
- Do not add EcoVadis achieved/rating/medal claims unless verified.
- Do not add client/partner/testimonial/case-study claims without approval.
- Do not expose exact licence numbers in generic marketing surfaces unless a
  legal/proof context is intended and approved.

Partner/logo strip decision:

- Option A: approved logo wall with explicit logo-usage proof.
- Option B: industry sectors instead of named partners.
- Option C: sector icons with no named partner/client claims.

Exit criteria:

- Trust Center IA and document categories approved.
- Every public document has status, source, owner, expiry/review information
  and allowed surfaces.
- Capability statement PDF content is proof-safe and matches the website.

Ownership / decision needed:

- Document owner for each proof category.
- Decision on whether public logo wall is approved or replaced with sector
  signalling.

---

## Phase 3 — Complaint Handling and Ethics Layer

Purpose: create a professional public process layer for complaints, conduct
and escalation.

Status: Next.

This phase makes Avenir procurement-ready without implying a legal guarantee or
a regulated whistleblowing system that has not been created.

Public concepts:

- Panaszkezelés.
- Complaint handling page or section.
- Etikai kódex / Code of Ethics.
- Complaint intake path.
- Escalation/process owner.
- Expected response model without SLA overclaim.
- What information users should not submit through the public form.
- Separation from service quote/contact form if needed.
- Internal routing to responsible owner.

Important distinction:

- Complaint handling is not the same as whistleblowing.
- Whistleblowing should only be added after separate legal/process review.
- Do not imply a regulated whistleblowing system unless the company has one
  and it is legally reviewed.

Exit criteria:

- Public complaint handling wording is approved.
- Ethics/code-of-conduct document owner is defined.
- Complaint intake path and internal routing are clear.
- Any future whistleblowing concept is explicitly separated from general
  complaints.

Ownership / decision needed:

- Business owner for complaint handling.
- Legal/process owner for ethics and any whistleblowing decision.

---

## Phase 4 — Content Growth / Tudástár

Purpose: develop the site from a launch brochure into a knowledge and
procurement-support site.

Status: Next / Later.

First 5 HU article topics:

1. Hogyan épül fel egy jó objektumőrzési szolgálati rend?
2. Mit tartalmazzon egy portaszolgálati és recepciós működési protokoll?
3. Mit jelent a távfelügyeleti riasztás-verifikáció és eszkaláció?
4. Hard FM és Soft FM: mi a különbség vállalati helyszíneken?
5. Mit tud és mit nem tud egy próbavásárlás és szolgáltatásaudit?

Older content ideas to preserve:

- Procurement checklists.
- Security scope templates.
- Event security brief checklist.
- Data-protection-aware security technology explainer.
- Service audit limitations article.
- Integrated site operations explainer.

Future EN article workflow:

- HU article first.
- EN translation after content review.
- Structured Article JSON-LD.
- No client names without approval.
- No case-study claims without proof.

Industry landing page candidates:

- logistics sites;
- office buildings;
- industrial parks;
- retail/commercial sites;
- multi-site portfolios;
- event venues.

Integrated operations page candidate:

- HU: Integrált telephelyüzemeltetés és vagyonvédelmi működés.
- EN: Integrated Facility and Security Operations.
- Positioning:
  - one operating model;
  - one reporting rhythm;
  - one escalation structure.

Exit criteria:

- First HU article set is published and proof-safe.
- Article URLs are added to AI-search files only after review.
- EN translations are created only after HU content is approved.

Ownership / decision needed:

- Editorial owner.
- Legal/proof reviewer for data-protection and compliance-adjacent articles.

---

## Phase 5 — Conversion and Measurement Optimization

Purpose: improve lead quality, conversion clarity and analytics after the live
launch.

Status: Later.

Scope:

- Lead quality review.
- Contact form thank-you state.
- Quote-preparation copy.
- Better “what happens next” explanation.
- Form service selection quality.
- Phone/email click tracking review.
- `contact_submit_success` as GA4 key event.
- `service_cta_click` analysis.
- `special_service_option_selected` review.
- GA4 event monitoring.
- Vercel Analytics / Speed Insights.
- Search Console and Bing query monitoring.

Analytics guardrails:

- No PII in analytics events.
- No marketing pixels without consent/privacy review.
- GTM only if multiple marketing tags become necessary and the consent/legal
  model is updated accordingly.

Exit criteria:

- Contact journey is clearer for serious B2B leads.
- Key conversion events are defined and monitored.
- Analytics remains privacy-first.

Ownership / decision needed:

- Decision whether GA4-only remains sufficient or GTM becomes necessary later.
- Decision whether Vercel Analytics / Speed Insights should be enabled.

---

## Phase 6 — DE/ZH Localization

Purpose: decide and implement the long-term German and Chinese localization
model.

Status: Strategic decision required.

### Option A — Full DE/ZH rollout

Scope:

- DE/ZH legal pages.
- DE/ZH service detail pages.
- DE/ZH news policy.
- Reviewed translations.
- Hreflang and sitemap inclusion.
- Route readiness rules.
- QA smoke for DE/ZH.

Requirements:

- no machine-translated legal page without clear disclaimer/review;
- no HU fallback masquerading as localized detail content;
- route returns 200 only when locale content is complete;
- service/legal/news links work for that locale.

### Option B — Partial homepage-only localization

Scope:

- DE/ZH homepage only.
- No DE/ZH service detail routes.
- No DE/ZH legal/news routes.
- Noindex if appropriate.
- Route-aware language switcher.
- Footer legal links point only to existing HU/EN legal pages.
- No broken DE/ZH 404 user flows.

Shared localization rules:

- Route readiness controls publication.
- Hreflang advertises only real routes.
- Sitemap includes only reviewed ready URLs.
- Language switcher must not link to non-existing routes.
- Footer legal links must point only to existing legal pages.
- Translation review status must be explicit.

Exit criteria:

- Strategic choice between full rollout and partial homepage-only model.
- Sitemap, hreflang and language switcher match that choice.
- No public DE/ZH route creates avoidable 404 flows.

Ownership / decision needed:

- Owner decision on business value of DE/ZH.
- Legal decision on non-HU legal translation requirements.

---

## Phase 7 — Special Services Layer

Purpose: prepare sensitive/special services separately from the core 8 service
pages.

Status: Strategic decision required / planned only.

Candidate services:

- Helyszíni biztonsági audit / Site Security Audit.
- Adatvédelmi és GDPR-folyamatfelmérés / Data Protection and GDPR Process
  Review.
- Magánnyomozás / Private Investigation.

Guardrails:

- Planned/discovery-only until approved.
- No public route until legal/proof/content review.
- No GDPR compliance guarantee.
- No legal advice.
- No hidden monitoring framing.
- No employee-surveillance framing.
- No police/authority framing.
- No sensitive personal data through standard public contact form.
- Private investigation requires preliminary consultation / special intake.
- Complaint handling and private investigation must not be conflated.
- Special-service contact flow needs separate warning and routing.

Next deliverables:

- Content brief.
- Legal/proof review.
- Intake model.
- Sensitive-data guardrails.
- Decision whether each service becomes:
  - public page;
  - hidden sales scope;
  - controlled inquiry flow.

Exit criteria:

- Legal/proof-reviewed service boundaries.
- Approved intake model.
- Approved routing and sitemap decision.

Ownership / decision needed:

- Legal/proof reviewer.
- Owner decision on public vs controlled inquiry positioning.

---

## Phase 8 — Separate AOS Product Track

Purpose: keep the internal AOS product roadmap separate from the public website
roadmap.

Status: Later / separate product.

AOS is a separate product/workstream, not the public website.

Potential AOS modules:

- Guard log.
- Site instructions.
- Incident reporting.
- Supervisor review.
- AI Report Assistant.
- Proposal generation.
- Internal document workflows.
- Operational handover documents.
- Service instruction templates.
- Internal escalation matrix.
- Admin/operator workflows.

Guardrails:

- Do not mix AOS internal workflows with public website service copy.
- No AOS promises on the public site unless product scope is confirmed.
- No AI-generated report promise in public service copy unless operationally
  approved.
- Proposal generation is internal tooling unless separately launched.
- AOS should have separate repo, DB, deployment target, migration plan and QA.

Exit criteria:

- AOS roadmap is managed separately from website releases.
- Public website does not promise internal tools as live services.

Ownership / decision needed:

- Separate AOS product owner.
- Separate AOS technical/release plan.
