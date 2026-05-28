# Service Pages Playbook

## Goal

Service pages are SEO/GEO landing surfaces and B2B lead-generation pages.

They must not be thin template pages.

Each service page must have distinct structure, distinct copy, and real operational detail.

## Publication rule

A service page can be public only when it is useful for a real visitor.

Required before public indexing:

- SEO title
- SEO description
- H1
- long description
- value proposition
- use cases
- included items
- process steps
- trust/control/reporting items
- CTA
- related services
- visible FAQ if FAQ schema is used

## Current HU/EN service detail layer

Status: production-live HU and EN service detail layer on `https://www.afm.hu`.

| Order | HU label | EN label | Canonical slug | Legacy slug |
| --- | --- | --- | --- | --- |
| 1 | Élőerős objektumőrzés | On-site Security Guarding | `objektumorzes` | `security` |
| 2 | Recepciós és portaszolgálat | Reception and Gatehouse Services | `portaszolgalat` | `reception` |
| 3 | Biztonságtechnika | Security Technology | `biztonsagtechnika` | `building` |
| 4 | Távfelügyelet és vonulószolgálat | Remote Monitoring and Response Service | `tavfelugyelet-vonuloszolgalat` | `technical` |
| 5 | Próbavásárlás és szolgáltatásaudit | Mystery Shopping and Service Audit | `mystery-shopping-helyszini-audit` | `mystery` |
| 6 | Rendezvénybiztosítás | Event Security | `rendezvenybiztositas` | `cleaning` |
| 7 | Hard FM | Hard FM | `hard-fm` | `hardfm` |
| 8 | Soft FM | Soft FM | `soft-fm` | `green` |

Canonical slugs are used in HU and EN public URLs and new CTA links. Legacy
slugs are only for seed/contact/email safety and should keep returning 404 as
service-detail URLs unless explicit redirects are approved later.

## Current service page order

1. objektumorzes
2. portaszolgalat
3. biztonsagtechnika
4. tavfelugyelet-vonuloszolgalat
5. mystery-shopping-helyszini-audit
6. rendezvenybiztositas
7. hard-fm
8. soft-fm

The HU and EN service-page rollout is production-live when these eight
canonical pages in both locales return 200, are sitemap-visible, have reciprocal
ready-locale hreflang, and legacy detail URLs return unavailable.

Current status: the eight HU and eight EN service pages are production-live.
DE/ZH service detail pages remain gated until their own localized required
fields and review are completed.

Standard service-detail structure:

1. H1/service label and breadcrumb;
2. hero value proposition;
3. long body/description;
4. best-fit/use case list;
5. scope/included items and process steps;
6. trust/control/reporting items, related services, FAQ and CTA.

Related services use the curated canonical-slug graph stored in
`relatedServiceSlugs`. Do not use legacy slugs, self-links, or
everything-to-everything related-service maps.

## Main vs special services

The existing 8 homepage service cards remain the main public service layer.

Special services are a future website-scope layer for sensitive,
compliance-heavy services. They are planned/discovery only and must not be
added as loud 9th/10th/11th homepage cards. They belong in a secondary,
visually quieter homepage block or tab after the 8 main service cards and after
the current production service layer, future DE/ZH translation workflow,
partner/trust population, related-services curation, and SEO/GEO groundwork.

Secondary block:

- title: Speciális biztonsági és vizsgálati szolgáltatások
- intro: Bizonyos helyzetek nem általános őrzési vagy facility feladatot
  igényelnek, hanem célzott vizsgálatot, helyszíni auditot vagy szabályozott
  tényfeltárást.

Planned special-service URLs:

- /hu/szolgaltatasok/helyszini-biztonsagi-audit
- /hu/szolgaltatasok/gdpr-adatvedelmi-folyamatfelmeres
- /hu/szolgaltatasok/magannyomozas

Working names:

- Helyszíni biztonsági audit — Site Security Audit
- Adatvédelmi és GDPR-folyamatfelmérés — Data Protection and GDPR Process
  Review
- Magánnyomozás — Private Investigation

Naming decisions:

- Use `Adatvédelmi és GDPR-folyamatfelmérés` as the HU title, not `GDPR
  audit`.
- Use `Data Protection and GDPR Process Review` as the EN title, not `GDPR
  Audit`.
- Treat the GDPR/data-protection service as process review,
  technical/operational input, and data-protection-aware assessment. Do not
  frame it as legal advice, formal certification, or guaranteed compliance.

Special-service copy must be discreet, regulated, B2B, and compliance-aware.
Do not imply unlawful covert surveillance, blanket employee monitoring,
recording, or legal/compliance audit unless that scope is explicitly approved.

Additional guardrails:

- Mystery Shopping must remain separate from Private Investigation.
- Site Security Audit must not be framed as authority, police, or regulatory
  inspection.
- Site Security Audit may cover security processes, access control, guarding
  model, escalation, camera/alarm process, documentation, and site-specific
  risks.
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
- Do not invite sensitive personal data through the standard contact form.
- CTA language should emphasize preliminary consultation, not immediate
  standard quote request.

Future special-service page structure:

- what this service is;
- when it is appropriate;
- when it is not the right service;
- required preliminary consultation;
- legal/data-protection boundaries;
- what information not to send through the contact form;
- what the client receives;
- what Avenir does not undertake;
- compliance-safe FAQ.

## Object guarding page angle

Objektumőrzés should focus on:

- physical site security;
- trained guards;
- site-specific protocols;
- entry and exit control;
- visitor/vendor handling;
- patrol;
- incident escalation;
- dispatch or supervisory support;
- reporting;
- documented operation;
- integration with security technology;
- site security audit as a cross-service module.

## Security technology page angle

Biztonságtechnika should not be a generic camera/alarm page.

It should connect technical security with live guarding:

- CCTV;
- access control;
- intrusion detection;
- alarm flow;
- monitoring;
- escalation;
- integration with guarding and dispatch;
- maintenance and operational reliability.

## Monitoring page angle

Távfelügyelet should focus on:

- signal handling;
- escalation protocol;
- response chain;
- dispatch / vonulószolgálat based on contract and technical setup;
- event logging;
- documentation;
- service continuity.

Avoid guaranteed arrival-time, universal SLA, armed-response, or immediate-dispatch overclaims unless the exact contract and operational proof support them.

## Reception and gatehouse page angle

Portaszolgálat should focus on:

- reception;
- guest handling;
- supplier/vendor handling;
- key handling;
- front desk and gatehouse process;
- visitor registration and handover;
- connection to guarding, access control, and reporting.

## Mystery shopping / site audit angle

This page should focus on:

- próbavásárlás;
- szolgáltatásaudit;
- brand audit;
- situation shopping;
- customer journey / ügyfélút audit;
- próbautazás;
- service quality measurement;
- agreed compliance-point measurement;
- structured reporting;
- actionable improvement recommendations.

Compliance notes:

- audit scope must be agreed in advance;
- findings are operational observations and improvement recommendations;
- do not promise guaranteed improvement numbers;
- do not imply hidden employee monitoring outside a lawful approved scope;
- do not mention recording unless explicitly scoped and lawful.
- do not position this page as magánnyomozás;
- do not use covert-surveillance, spying, beépülés, lebuktatás, bizonyítékgyűjtés, or titkos ellenőrzés language;
- transport/taxi-type audits may be one use case, not the whole page;
- keep this distinct from the future helyszíni biztonsági audit service page, which should focus on physical security risks.

## Event security planning note

Rendezvénybiztosítás / Event Security is part of the current production HU/EN
service detail layer. It remains a separate service detail page, not a
subsection of objektumőrzés.

Canonical slug:

`rendezvenybiztositas`

Legacy slug:

`cleaning`

Positioning notes:

- beléptetés and guest flow;
- event venue security;
- personal and property safety;
- conflict prevention;
- event security / stewarding staff;
- VIP, backstage, or restricted-area handling;
- parking or traffic coordination where relevant;
- organizer contact chain;
- incident escalation;
- documented event handling;
- legal and contractual scope limits.

## Hard FM angle

Hard FM should focus on:

- maintenance coordination;
- technical issue handling;
- operational risk;
- supplier coordination;
- documentation;
- response times;
- preventive operation.

## Soft FM angle

Soft FM is part of the current production HU/EN service detail layer.

Canonical slug: `soft-fm`

Legacy slug: `green`

Soft FM should focus on:

- cleaning;
- green area;
- daily operational support;
- quality checks;
- coordination;
- reporting.

## FAQ rule

Only add FAQPage JSON-LD if the FAQ is visibly rendered on the page.

## CTA rule

Service CTAs should link to:

/<locale>?service=<canonical-slug>#contact

Example:

/hu?service=objektumorzes#contact
/en?service=objektumorzes#contact

## Proof-sensitive facts rule

These facts are approved business facts and should not be questioned as false
in service-page review:

- ISO 9001;
- ISO 27001;
- Hungarian security activity licence / vagyonvédelmi engedély;
- 24/7 dispatch / monitoring background;
- 30+ active sites;
- 200+ professionals / staff.

Review them only for placement, scope-safe wording, non-SLA interpretation,
excessive repetition, and HU/EN consistency. Do not place the exact security
licence number in service body copy, service trust cards, service card
descriptions, or related-service descriptions; exact numbers belong in legal,
proof, tender, Trust Center, or contractual onboarding contexts.

Canonical naming guardrails:

- HU: `Próbavásárlás és szolgáltatásaudit`, not `Mystery Shopping és
  helyszíni audit` as the canonical label.
- EN: `Mystery Shopping and Service Audit`, not `Mystery Shopping and On-site
  Audits`.
- EN: `Remote Monitoring and Response Service` as the service label; shorter
  `Remote Monitoring and Response` may be used only in natural prose/SEO where
  intentional.
