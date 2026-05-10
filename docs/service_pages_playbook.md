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

## Current HU service detail layer

Status: current staging HU service detail layer.

| Order | Service | Canonical slug | Legacy slug |
| --- | --- | --- | --- |
| 1 | Élőerős objektumőrzés | `objektumorzes` | `security` |
| 2 | Recepciós és portaszolgálat | `portaszolgalat` | `reception` |
| 3 | Biztonságtechnika | `biztonsagtechnika` | `building` |
| 4 | Távfelügyelet és vonulószolgálat | `tavfelugyelet-vonuloszolgalat` | `technical` |
| 5 | Mystery Shopping és helyszíni audit | `mystery-shopping-helyszini-audit` | `mystery` |
| 6 | Rendezvénybiztosítás | `rendezvenybiztositas` | `cleaning` |
| 7 | Hard FM | `hard-fm` | `hardfm` |

Canonical HU slugs are used in public URLs and new CTA links. Legacy slugs are only for seed/contact/email safety and should keep returning 404 as service-detail URLs unless explicit redirects are approved later.

## First HU service page order

1. objektumorzes
2. portaszolgalat
3. biztonsagtechnika
4. tavfelugyelet-vonuloszolgalat
5. mystery-shopping-helyszini-audit
6. rendezvenybiztositas
7. hard-fm
8. soft-fm based on business priority

## Main vs special services

The existing 8 homepage service cards remain the main public service layer.

Special services should not be added as loud 9th/10th/11th homepage cards.
They belong in a secondary, visually quieter homepage block after the 8 main
service cards and before trust/compliance/references.

Secondary block:

- title: Speciális biztonsági és vizsgálati szolgáltatások
- intro: Bizonyos helyzetek nem általános őrzési vagy facility feladatot
  igényelnek, hanem célzott vizsgálatot, helyszíni auditot vagy szabályozott
  tényfeltárást.

Planned special-service URLs:

- /hu/szolgaltatasok/magannyomozas
- /hu/szolgaltatasok/helyszini-biztonsagi-audit
- /hu/szolgaltatasok/vizsgalati-ellenorzesi-szolgaltatasok

Special-service copy must be discreet, regulated, B2B, and compliance-aware.
Do not imply unlawful covert surveillance, blanket employee monitoring,
recording, or legal/compliance audit unless that scope is explicitly approved.

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

Rendezvénybiztosítás is part of the current staging HU service detail layer. It remains a separate service detail page, not a subsection of objektumőrzés.

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

/hu?service=<canonical-slug>#contact

Example:

/hu?service=objektumorzes#contact
