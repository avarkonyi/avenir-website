# Verified Claims — Avenir

Last updated: 2026-06-13

This file tracks business-approved claims that may be used in public website copy for Avenir. It is a copywriting guardrail, not a substitute for the underlying legal, certificate, contract, or operational proof documents.

Detailed proof-asset metadata, public-document status, allowed surfaces and
review/expiry tracking live in `docs/trust_center/proof_catalog.md`. This file
continues to control approved public wording and claim restrictions.

The planned Trust Center MVP uses `docs/trust_center/public_mvp_inclusion_matrix.md`
and `docs/trust_center/public_mvp_content_spec.md` to decide what can appear
publicly. Do not infer public Trust Center approval from this file alone.

## Approved Claims

The following claims may be used in public website copy when the wording follows the usage rules below:

- 24/7 diszpécseri háttér
- Fegyver nélküli vagy fegyveres vagyonőri jelenlét szerződéses igény és kockázati profil alapján
- Vagyonvédelmi engedély: 01030-822/4926-7/2023
- MSZ EN ISO 9001:2015, certificate 843579099, certification body MartonCert
  Rendszertanúsító Kft.
- MSZ ISO/IEC 27001:2023, certificate 988960032, certification body MCert
  Rendszertanúsító Kft.
- 30+ aktív helyszín
- 200+ munkatársi háttér
- D&B AA High Creditworthy 2026
- response_time_contact_follow_up: next-business-day contact follow-up for
  incoming website/contact-form quote requests, with quote-preparation timing
  dependent on the scope and complexity of the request
- Biztonságtechnikai engedély
- Magánnyomozói engedély

## AI-search surface scope for licences

Licence numbers, insurance details and registry identifiers are legal/proof
context. They belong on the Impressum and legal pages, not in the AI-search
grounding files (`llms.txt`, `llms-full.txt`) as marketing/proof claims.

- The guarding licence (01030-822/4926-7/2023) remains an approved AI-search
  claim — it is the primary regulated-activity authorization and is already
  listed in both llms files and the proof-safe set.
- The biztonságtechnikai (security technology) licence is a business-approved
  claim for legal/proof surfaces, but is not surfaced as an AI-search
  proof-safe claim.
- The magánnyomozói (private investigation) licence is a business-approved
  legal/proof fact. It may be mentioned in Trust Center / llms policy wording
  only as legal/regulatory information, not as a promoted service, public
  contact option, service route, sales claim or marketing claim. Private
  investigation stays discovery-only per AGENTS.md and must not be framed as
  AI marketing/proof.
- Licences are not added to JSON-LD `hasCredential` in the current scope.
  Verified credential schema (ISO certificates already present; licences/D&B
  later) is handled by a future Trust Center / proof catalog, not as decorative
  structured data.

## Approved Creditworthiness Claim

The following creditworthiness claim is approved for public use:

- Claim: D&B AA High Creditworthy 2026
- Status: Approved for public use
- Issuer: Dun & Bradstreet
- Certificate label: AA High Creditworthy 2026
- Company: Avenir Facility Ltd.
- Tax number: 26395124-2-41
- D-U-N-S: 401251621
- Certificate date: 26 May 2026
- Proof file: `20260526 Avenir Facility Kft a.pdf` was provided as the proof
  source during review. It is not currently stored in this repository; if
  repository proof archival is required, store or link it in a secure
  proof-controlled location without exposing sensitive internal files.
- Approved public wording:
  - HU: "D&B magas hitelképességi minősítés"
  - EN/DE/ZH: "D&B High Creditworthy 2026"
  - Short stat: "AA"
- Approved public surfaces:
  - homepage stat tile
  - `llms.txt` and `llms-full.txt` AI-search grounding files
  - future Trust Center / document library
  - future procurement / tender readiness page
- Not approved without separate review:
  - service body copy or service trust cards
  - client testimonial or case-study usage
  - partner/logo relationship claims
- Restricted wording:
  - do not call this OPTEN
  - do not call this OPTEN A+
  - do not imply guaranteed solvency, risk-free operation, financial advice, or
    zero supplier risk

This proof source supports a Dun & Bradstreet / D&B AA High Creditworthy 2026
claim. It is not OPTEN A+ proof unless a separate OPTEN-specific document
exists and is reviewed.

## Official Profile Links

The following public profile link is approved as an official entity/profile
link. It is not a proof claim, certification claim, partner claim, testimonial,
client reference, or case study.

- Official LinkedIn company profile: https://www.linkedin.com/company/avenir-facility-management

This profile link is also allowed in Organization / ProfessionalService
JSON-LD `sameAs`, `llms.txt`, `llms-full.txt`, and footer profile links. Do
not add LinkedIn Insight Tag, tracking pixels, LinkedIn scripts, or UTM
parameters from this approval.

## Usage Rules

- Do not invent new numbers.
- Do not invent partner names.
- Do not invent guarantees.
- Do not use armed guarding as a blanket claim.
- Phrase armed guarding as dependent on contractual need, legal conditions, and site risk profile.
- Do not overstate ISO scope.
- Do not claim that ISO 9001 or ISO 27001 covers a specific operational process unless the certification scope explicitly supports it.
- Use the PDF-verified issuer and standard wording: ISO 9001 = MSZ EN ISO
  9001:2015 / MartonCert Rendszertanúsító Kft.; ISO/IEC 27001 = MSZ ISO/IEC
  27001:2023 / MCert Rendszertanúsító Kft.
- Do not use the old generic issuer `MARTON Szakértő Iroda Kft.` for both ISO
  certificates.
- Do not use `ISO/IEC 27001:2022` in public certification/proof contexts.
- Prefer precise B2B wording over informal, generic, or marketing-heavy phrasing.

## Pending / Not Approved Claims

The following items are not approved for new public use until proof is reviewed
and explicitly accepted:

- OPTEN A+ / Bonitasi minosites.

Do not add OPTEN A+ as a verified claim, schema claim, AI-search claim, partner
claim, rating claim, or production-release approval item unless a separate
OPTEN-specific proof document is provided and reviewed. The Dun & Bradstreet
certificate above must not be described as OPTEN proof.

Governance status: the public creditworthiness wording is resolved to D&B AA
High Creditworthy 2026. Any remaining OPTEN/A+ discussion is historical or
policy-context only. The public website must use the D&B AA wording above unless
and until a separate OPTEN-specific proof document is approved.

## Preferred Wording Patterns

- Use: "24/7 diszpécseri háttérrel támogatható"
- Avoid: "minden helyszínen garantált 24/7 reakció"
- Use: "fegyver nélküli vagy fegyveres vagyonőri jelenlét a szerződéses igény és a helyszín kockázati profilja alapján"
- Avoid: "fegyveres őrzést biztosítunk minden objektumban"
- Use: "ISO 9001 és ISO 27001 tanúsított irányítási rendszerekhez illeszkedő dokumentált működés"
- Avoid: "minden szolgálati folyamat ISO-garantált"
- Use: "legkésőbb a következő munkanapon kapcsolatba lépünk / jelentkezünk a megadott elérhetőségen"
- Avoid: "2 munkanapon belüli visszajelzés", "24 órán belüli válasz", "minden ajánlat elkészül a következő munkanapon", or any response-time SLA, quote-delivery guarantee, service-start guarantee, or fixed quote-preparation deadline.

## Approved Partner Logo Usage Registry

Partner names and logos are proof-controlled assets. Do not add partner names, logos, testimonials, relationship claims, or case-study wording to public code, copy, schema, seeds, or documentation unless public use has been explicitly approved and recorded.

Approved public reference:

- Public display name: AutoWallis Pest
- Internal legal/proof entity: Wallis Motor Pest Kft.
- Logo asset path: `public/references/autowallis-pest.png`
- Website URL used by the public card: `https://www.bmw-autowallis.hu`
- Approval status: approved for public website reference-card use
- Approved public use:
  - company logo
  - brand/company name
  - approved service type chips
- Approved service types:
  - Objektumőrzés
  - Recepciós és portaszolgálat
- Mapped service slugs:
  - `objektumorzes`
  - `portaszolgalat`
- Allowed surfaces:
  - homepage references section as a clickable reference card
- Restrictions:
  - no testimonial
  - no case study
  - no performance/result claim
  - no "AutoWallis recommends Avenir" wording
  - no "official BMW partner" or manufacturer relationship claim beyond the supplied logo artwork
  - no service-outcome or incident-free claim
- Note: URL is used as the supplied/approved reference website. It does not create a separate BMW official-partner or manufacturer relationship claim.
- Note: logo is used as supplied/approved artwork. Do not publish the consent
  PDF or other approval documents publicly.

For each approved logo, record:

- public display name;
- logo asset path;
- approval status;
- approval date;
- approver or proof owner;
- allowed usage scope;
- allowed surfaces: homepage, service pages, tender materials, internal decks;
- optional URL/link permission;
- notes, limitations, expiry, or withdrawal conditions.

Homepage logo-strip publication rules:

- the partner row must be active;
- the partner row must be published;
- a logo asset must be present;
- `showInLogoStrip` must be explicitly enabled;
- logo usage approval date must be recorded;
- homepage usage must be within the recorded usage scope.

Do not use partner logos as Organization schema, `sameAs`, `memberOf`, `brand`, customer, credential, or endorsement claims unless the relationship and public claim have been separately verified.

## Review Rule

When new public website copy introduces a number, certificate, license, partner name, response time, SLA-like statement, guarantee, or regulated-service claim, check it against this file first. If it is not listed here, either remove it, soften it, or ask for business/legal confirmation before publishing.
