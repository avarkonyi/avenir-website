# Avenir Copy Strategy

## Current approval status

The eight HU and eight EN service detail pages are production-live on
`https://www.afm.hu`. Treat the current HU/EN service layer as the baseline
production copy. Do not start a new creative rewrite unless a production audit
finds an actual defect or the owner explicitly requests a new copy pass.

German service detail copy and German legal pages are implemented only in
controlled review mode: after deploy, the eight `/de/szolgaltatasok/*` routes
and `/de/adatvedelem`, `/de/aszf`, `/de/impresszum` are 200/noindex and stay
outside sitemap/hreflang. ZH remains homepage/partial-only. KO has a
homepage-only draft scaffold and is translation-review-required. German must
still proceed through DE-0..DE-6: current-state audit, homepage polish, legal
indexability decision, service draft translation, native/legal review,
sitemap/hreflang/indexing enablement, and later German content growth. Do not
start indexable DE/ZH/KO service rollout, case studies, or named partner/client
references without separate approval, localized content, and proof.

The next content/business layer should focus on proof-safe trust governance,
post-launch legal/privacy alignment, Search Console/Bing monitoring, and 3-5 HU
tudastar articles.

## Security and trust utility copy

The responsible-disclosure surfaces are trust/operations utility pages, not
marketing content. Keep them short, factual and bounded:

- security reports use `security@afm.hu`;
- privacy matters use `dpo@afm.hu`;
- general enquiries use `info@afm.hu`;
- no bug bounty or reward promise;
- no response-time SLA or guaranteed fix time;
- no broad legal safe-harbor wording;
- no permission for physical testing, social engineering, phishing, DoS/DDoS,
  load testing, data exfiltration, internal systems, customer systems, partner
  systems, or third-party systems.

Current approved routes are `/hu/felelos-hibabejelentes` and
`/en/responsible-disclosure`. Do not create DE/ZH/KO disclosure copy or routes
without a separate localization and legal/process review.

## Positioning

Avenir should communicate as a serious B2B operational partner, not as a generic security or facility service provider.

The tone should be:

- professional;
- precise;
- calm;
- trustworthy;
- operational;
- direct.

## Core message

Avenir helps organizations operate safer, more controlled, and better documented sites through security, facility, monitoring, audit, and operational support services.

## Avoid generic copy

Avoid weak phrases:

- modern megoldások;
- innovatív szolgáltatás;
- megbízható partner;
- teljes körű szolgáltatás;
- magas minőség;
- profi csapat.

Replace them with concrete detail.

Example:

Weak:

Megbízható objektumőrzési szolgáltatás modern megoldásokkal.

Better:

Helyszínre szabott őrzési protokollokkal, beléptetési kontrollal, eseménykezeléssel és dokumentált riportálással támogatjuk az objektum biztonságos napi működését.

## Service page structure

Each service page should include:

1. clear H1;
2. B2B value proposition;
3. when this service is needed;
4. what is included;
5. how cooperation starts;
6. reporting/control/escalation;
7. related services;
8. FAQ if useful;
9. CTA.

## CTA style

Prefer specific CTAs:

- Kérek ajánlatot objektumőrzésre
- Egyeztetek helyszíni felmérésről
- Kérek visszahívást
- Megnézem a kapcsolódó szolgáltatásokat

Avoid vague CTAs:

- Tovább
- Küldés

## Special services wording

Special services such as helyszíni biztonsági audit, adatvédelmi és
GDPR-folyamatfelmérés, and magánnyomozás are planned/discovery-only website
scope. They are not AOS, not current public routes, and not part of the eight
main operational service pages.

They must be written as discreet B2B services, not as aggressive consumer-style
investigation offers.

Preferred service names:

- `Helyszíni biztonsági audit` / `Site Security Audit`;
- `Adatvédelmi és GDPR-folyamatfelmérés` / `Data Protection and GDPR Process
  Review`;
- `Magánnyomozás` / `Private Investigation`.

Use `Adatvédelmi és GDPR-folyamatfelmérés` as the HU name, not `GDPR audit`.
Use `Data Protection and GDPR Process Review` as the EN name, not `GDPR
Audit`. The GDPR/data-protection service should read as process review,
technical/operational input, and data-protection-aware assessment, not legal
advice, certification, or compliance sign-off.

Use careful wording:

- előre egyeztetett scope;
- jogszerű, célhoz kötött és arányos vizsgálati keretek;
- működési megfigyelések;
- strukturált riport;
- fejlesztési javaslatok;
- helyszíni biztonsági audit szemlélet.

Avoid:

- unlawful covert surveillance implications;
- hidden employee monitoring without approved lawful scope;
- recording claims unless explicitly approved;
- guaranteed improvement numbers;
- legal or compliance audit claims unless that scope is separately defined;
- GDPR compliance guarantees, legal advice, or legal-basis/LIA/DPIA/NAIH
  sign-off claims.

Service-specific guardrails:

- Mystery Shopping must stay separate from Private Investigation.
- Site Security Audit must not sound like authority, police, or regulatory
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
- Special-service CTAs should point toward preliminary consultation and should
  warn visitors not to submit sensitive personal data through the standard
  contact form.

## Mystery Shopping / szolgáltatásaudit wording

The `mystery-shopping-helyszini-audit` page is a service-quality and customer-journey audit page. It is not the future magánnyomozás page and not the future helyszíni biztonsági audit page.

Use:

- próbavásárlás;
- szolgáltatásaudit;
- brand audit;
- situation shopping;
- ügyfélút audit;
- próbautazás;
- szolgáltatásminőség-mérés;
- előre egyeztetett megfelelési szempontok;
- strukturált riport;
- vezetői összefoglaló;
- fejlesztési javaslat;
- jogszerű, célhoz kötött vizsgálati keretek.

Avoid:

- magánnyomozás positioning;
- covert surveillance;
- spying language;
- nyomozás;
- megfigyelés;
- beépülés;
- lebuktatás;
- bizonyítékgyűjtés;
- titkos ellenőrzés;
- client-specific case details without approval.

Rules:

- audit scope, method, and evaluation criteria must be agreed in advance;
- transport/taxi-type audits may be one use case, not the whole page;
- no client names, including ÉKM, may appear without explicit approval;
- no operator names, routes, cities, scores, case results, or report excerpts may appear without approval;
- legal/compliance checks should be phrased as "előre egyeztetett megfelelési szempontok szerint";
- findings should be operational observations and improvement recommendations, not proof-gathering or punishment language.

If a later Shadow Audit or similar sub-brand is created, it must keep the same compliance-safe language and must not sound like spying, private investigation, or employee surveillance.

## Compliance and sustainability wording

The compliance/document layer should support large-enterprise procurement,
tenders, supplier due diligence, SEO/GEO, and AI-search summaries.

EcoVadis is preparation only until verified otherwise.

Use:

- EcoVadis felkészülés;
- fenntarthatósági és megfelelőségi dokumentáció;
- nagyvállalati beszállítói elvárások támogatása;
- külső fenntarthatósági értékelésekre való felkészülés.

Avoid unless later verified:

- EcoVadis tanúsított;
- EcoVadis minősített;
- EcoVadis auditált;
- EcoVadis medal or badge claims.

Public document copy should clearly separate:

- public website documents;
- public but approval-required documents;
- internal / audit-only / tender-only evidence.

Never suggest publishing confidential, personal, client-specific,
contract-specific, or internal audit evidence publicly.

## Trust Center and proof-library wording

Future Trust Center / Megfelelőségi központ copy must use the proof catalog and
verified-claims files as source of truth:

- `docs/trust_center/proof_catalog.md`
- `docs/trust_center/trust_center_ia.md`
- `docs/trust_center/public_mvp_scope.md`
- `docs/trust_center/proof_guard_recommendations.md`
- `docs/trust_center/public_mvp_inclusion_matrix.md`
- `docs/trust_center/public_mvp_content_spec.md`
- `docs/trust_center/open_decisions.md`
- `docs/trust_center/proof_language_rules.md`
- `docs/verified_claims.md`

Keep Trust Center copy procurement-supportive and factual. It should describe
approved evidence, status, issuer, scope and review dates; it should not turn
legal facts into broad marketing claims.

Allowed direction:

- ISO certificates with scope-safe wording;
- D&B AA as Dun & Bradstreet creditworthiness wording, not OPTEN;
- legal/licence summaries in legal/proof context;
- responsible-disclosure and security.txt links;
- approved reference summaries with the recorded restrictions.

Avoid:

- raw signed consent PDFs;
- raw insurance policy PDFs;
- DPA, SCC, LIA or processor contract publication;
- private-investigation licence as service-marketing proof;
- unapproved ESG/EcoVadis claims;
- testimonials, case studies or performance claims without a catalog entry;
- `hasCredential`/structured-data proof expansion without proof-owner review.

## Current post-launch content/governance backlog

P1/P2 content and governance items:

- EN news route/content policy is resolved in source for the launch article:
  `/en/hirek` and `/en/hirek/megujult-az-avenir-weboldala-es-arculata`
  are public/indexable after deploy. The article body is DB-backed; the two
  remaining legacy service-name phrases (`manned guarding`, `reception and
  concierge services`) are covered by a guarded dry-run-default terminology
  script and should be applied only with explicit DB-write approval.
- DE/ZH/KO legal/service/news route policy: DE service/legal/news routes may
  exist only as noindex review-mode surfaces until final approval; ZH/KO
  service/legal/news detail routes remain closed.
- German Phase 0 is documented in `docs/de_phase0_audit.md`; German glossary
  seed is in `docs/translations/german_glossary.md`.
- German homepage copy needs native B2B review before indexability. A
  2026-06-06 framework polish landed the operative value pillars, native German
  consent copy, the `Dienstleistungen` nav terminology and an FM-aligned hero
  eyebrow; native review still covers the hero/subhead, service descriptions and
  proof-sensitive claims. See `docs/de_phase0_audit.md`.
- German legal pages are staged under `docs/translations/de/legal/` and render
  only as noindex review-mode pages until explicit legal/SEO approval. The DE
  Impressum parity/layout polish is completed in source: it now follows the
  HU/EN factual structure and labelled-row layout for company data, DPO,
  licences, supervisory authorities, professional liability insurance and
  hosting details.
- German news now follows the same review-mode pattern for the launch article:
  `/de/hirek` and
  `/de/hirek/megujult-az-avenir-weboldala-es-arculata` render 200/noindex
  after deploy, stay outside sitemap/hreflang, and still need native/business
  review before any DE SEO launch.
- German service tile translations are staged under
  `docs/translations/de/source/` and typed into
  `lib/services/de-service-details.ts` for review-mode rendering. They are not
  imported to DB, do not enter sitemap/hreflang, and remain noindex until
  native/business and legal/proof review pass. Use
  `docs/translations/de/service_tiles_de_full_validation.md` before any future
  German SEO release pass.
- HU/EN privacy policy version sync and DPO/legal review.
- D&B AA versus OPTEN/A+ governance: public wording now uses D&B AA High
  Creditworthy 2026 as the Dun & Bradstreet proof item. Do not call it OPTEN
  A+ unless separate OPTEN proof is provided and reviewed.
- Trust Center IA/proof-catalog foundation and HU/EN public MVP runtime are
  implemented in source. D&B certificate PDF publication, liability-insurance
  summary publication, DE Trust Center, 24/7 / 30+ / 200+ proof cards and
  procurement-pack scope still need owner/proof/legal decisions recorded in
  `docs/trust_center/open_decisions.md`.
- AI-search grounding files (`llms.txt`, `llms-full.txt`) must reflect the
  current locale/route status (updated 2026-06-06): HU and EN are indexed
  production languages with live service, legal and news layers; DE
  service/legal/news pages are noindex review-mode only (not in
  sitemap/hreflang); ZH/KO are homepage-only/partial and have no news routes.
  Do not state the service-detail layer is "Hungarian only" once EN is live,
  and do not surface the private investigation licence as an AI-search proof
  claim.
- Visible non-HU UI fallback cleanup on 2026-06-06: EN/ZH/KO service-card
  detail links use `Details` instead of `Részletek`; ZH pillars use the
  current operational triad; ZH/KO D&B labels are localized; KO career cards
  use conservative source/UI fallbacks for English DB-backed labels without
  changing the database.
- Private investigation is removed from the public contact dropdown
  (2026-06-11): the option returns only after a dedicated special-intake
  flow with sensitive-data safeguards is approved (backlog PL-015/PL-059).
  The backend keeps accepting the legacy `magannyomozas` key; Impresszum/ÁSZF
  legal-fact mentions are unchanged.
- Form copy is non-SLA (2026-06-11): the contact and embedded quote forms use
  a "what happens next" helper without response-time promises, and the
  previous "2 munkanapon belül / within 2 business days" success wording was
  removed. Do not reintroduce fixed response times, guaranteed quotes or
  SLA-like commitments in form/CTA copy without owner/legal approval.
- The homepage "Referenciák" section may show only explicitly approved public
  references. Current approved source reference: AutoWallis Pest, with the
  supplied logo and service chips for Objektumőrzés / Recepciós és
  portaszolgálat only. The card may link to the approved website URL, but
  service chips remain informational tags. Do not add testimonial, case-study,
  "trusted by", performance/result, manufacturer partnership or incident-free
  wording. Broader logo wall / sector-icon decisions remain in backlog PL-029.
- Meta/social polish after production indexing settles.
- Analytics consent copy should remain privacy-first: no dark patterns, no
  analytics before consent, reject keeps GA4 blocked, and no personal form
  content in analytics events.
