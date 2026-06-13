# Trust Center Proof Language Rules

Status: copy governance rules for later Trust Center implementation.
Last updated: 2026-06-13

Use these rules together with:

- `docs/verified_claims.md`
- `docs/trust_center/proof_catalog.md`
- `docs/trust_center/public_mvp_inclusion_matrix.md`
- `docs/trust_center/public_mvp_content_spec.md`

## General Rule

Trust Center language should be factual, scoped and procurement-friendly.
It should never turn a certificate, licence, reference, legal notice or contact
channel into a guarantee.

## Allowed Phrasing Patterns

Use:

- "nyilvánosan megosztható cég-, megfelelőségi és biztonsági információk"
- "publicly shareable company, compliance and security information"
- "tanúsított irányítási rendszer"
- "certified management system"
- "részletes engedélyadatok az Impresszumban érhetők el"
- "detailed licence information is available in the Legal Notice"
- "külön megállapodás vagy beszerzési folyamat keretében"
- "as part of a separate agreement or procurement process"

## Restricted Phrasing Patterns

Avoid:

- "garantált megfelelés"
- "guaranteed compliance"
- "GDPR-compliant guaranteed"
- "NAIH-approved"
- "risk-free"
- "zero supplier risk"
- "guaranteed solvency"
- "minden folyamat ISO-garantált"
- "all processes are ISO guaranteed"
- "hivatalos BMW partner" unless separately approved
- "recommended by AutoWallis Pest"
- "case study", "testimonial" or "results" without explicit consent and proof

## D&B Wording Rules

Allowed:

- HU: "D&B magas hitelképességi minősítés"
- EN: "D&B High Creditworthy 2026"
- short stat: "AA"

Restricted:

- do not call it OPTEN;
- do not call it OPTEN A+;
- do not imply guaranteed solvency;
- do not imply zero supplier risk;
- do not publish the certificate PDF until proof owner approves.

## Licence Wording Rules

Allowed:

- HU: "Engedélyezett vagyonvédelmi működés"
- EN: "Licensed security operations"
- HU: "A pontos engedélyadatok az Impresszumban találhatók."
- EN: "Exact licence details are available in the Legal Notice."
- HU: "Magánnyomozói tevékenység" only inside regulated-activity legal/proof
  context.
- EN: "Private investigation activity" only inside regulated-activity
  legal/proof context.

Restricted:

- do not place exact licence numbers in service body copy or decorative trust
  cards;
- do not imply police/public-authority role;
- do not imply the licence guarantees service outcomes;
- do not use the private investigation licence as a public marketing proof,
  service CTA, service route or contact-dropdown option.

## Insurance Wording Rules

Allowed after legal/proof approval:

- HU: "Szakmai felelősségbiztosítás"
- EN: "Professional liability insurance"
- HU: "A biztosítással kapcsolatos jogi adatok az Impresszumban szerepelnek."
- EN: "Legal information related to the insurance is available in the Legal Notice."

Restricted:

- no loss-prevention guarantee;
- no compensation guarantee;
- no claim-acceptance promise;
- no raw insurance policy PDF unless approved.

## Reference Wording Rules

Allowed for AutoWallis Pest if Trust Center inclusion is confirmed:

- HU: "jóváhagyott ügyfélmegjelenés"
- EN: "approved public client reference"
- service chips:
  - HU: "Objektumőrzés"; "Recepciós és portaszolgálat"
  - EN: "On-site Security Guarding"; "Reception and Gatehouse Services"

Restricted:

- no testimonial;
- no case study;
- no performance or result claim;
- no official manufacturer partner claim;
- no incident-free claim;
- no signed consent PDF publication.

## Data Protection and Security Rules

Allowed:

- link to public privacy notices;
- link to recruitment privacy notice;
- link to responsible disclosure;
- link to `/.well-known/security.txt`;
- list DPO contact.

Restricted:

- no DPA/SCC/LIA publication;
- no processor contract publication;
- no GDPR guarantee;
- no NAIH guarantee;
- no public bug-bounty promise;
- no response-time SLA for security reports.

## Private Investigation Legal-Only Rule

The private investigation licence may appear only in legal/proof contexts such
as Impresszum / Legal Notice and the Trust Center regulated-activity summary.
It must not appear as:

- a Trust Center MVP proof card;
- a service marketing claim;
- an AI-search marketing/proof claim;
- a homepage trust statistic;
- a contact-dropdown option;
- a service route;
- a Special Services promise without separate legal/process approval.
