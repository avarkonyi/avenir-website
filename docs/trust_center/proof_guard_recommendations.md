# Proof Guard Recommendations

Status: governance recommendations, not runtime implementation.
Last updated: 2026-06-13

This file records recommended safeguards for future Trust Center, public
document library, procurement-pack and structured-data work.

## Source-of-Truth Rule

Use two layers:

- `docs/verified_claims.md` controls public wording and claim eligibility.
- `docs/trust_center/proof_catalog.md` controls proof assets, surfaces,
  status, owners, expiry/review dates and publication limits.

If a claim or document is missing from both files, it is not approved for new
public use.

## Required Metadata for Every Proof Item

Each proof entry should have:

- stable id;
- category;
- title;
- owner/reviewer;
- status;
- allowed public surfaces;
- public-document flag;
- public URL if any;
- internal proof location;
- issuer/source;
- issue date if relevant;
- expiry or review date;
- allowed wording per language;
- restricted wording;
- notes and implementation references.

## Recommended Status Gates

| Status | Public copy | Public document | Structured data / llms | Notes |
| --- | --- | --- | --- | --- |
| `approved_public` | Allowed with exact wording | Allowed only if `public_document: true` | Allowed if surface is listed | Still needs expiry/review tracking. |
| `approved_internal` | No broad public copy | No | No | May support internal due diligence only. |
| `pending_review` | No new public expansion | No | No | Existing legally required surfaces can remain if separately approved. |
| `draft` | No | No | No | Planning only. |
| `expired` | No | No | No | Remove or renew before publication. |
| `not_public` | Legal-only or internal-only | No | No | Do not use as marketing proof. |

## Copy Guardrails

Block or review these patterns before publishing:

- OPTEN / A+ wording unless separate OPTEN proof exists;
- guaranteed solvency, zero supplier risk, risk-free operation;
- GDPR guarantee, NAIH approval guarantee or legal advice wording;
- SLA-like response, arrival, repair or resolution guarantees;
- police/public-authority role wording;
- private-investigation proof in service marketing;
- hidden monitoring, employee-surveillance or disciplinary evidence framing;
- client names, testimonials, case studies or performance claims without a
  catalog entry;
- exact licence numbers inside service body/trust-card copy;
- unapproved ESG, EcoVadis, sustainability rating or certification claims.

## Document Publication Guardrails

Before publishing a document:

1. Confirm the document is not internal-only, signed consent, contract evidence,
   DPA/SCC/LIA, raw insurance policy or client-specific material.
2. Confirm the publication surface is listed in the catalog.
3. Confirm expiry/review date is still valid.
4. Confirm file name and URL do not expose sensitive internal metadata.
5. Confirm no personal data or third-party confidential data appears.
6. Confirm legal/DPO/proof owner approval where required.

## Structured Data and AI-Search Guardrails

Do not add `hasCredential`, `sameAs`, `memberOf`, `award`, `knowsAbout`,
`review`, `aggregateRating` or similar schema fields from proof items unless:

- the item is `approved_public`;
- the surface includes `structured_data`;
- wording is source-backed and scope-safe;
- the route is indexable and production-ready;
- the field does not imply endorsement, partnership, guaranteed compliance or a
  client relationship.

For `llms.txt` and `llms-full.txt`:

- include only routes and proof claims that are production-public;
- do not describe noindex/review locales as final citation sources;
- do not include internal proof file names or private licence details;
- do not infer unavailable DE/ZH/KO routes.

## Suggested Automated Guards

Future implementation candidates:

- copy guard for banned proof phrases: `OPTEN`, `A+ Bonit`, `guaranteed
  solvency`, `risk-free`, `GDPR compliant guaranteed`, exact unapproved licence
  numbers in service sections;
- llms guard comparing route locale status with published llms route claims;
- structured-data guard that checks proof-derived schema fields against the
  catalog;
- sitemap/hreflang guard preventing noindex/review URLs from being advertised;
- document-publication checklist in PR template or release checklist.

These guards should be narrow and deterministic to avoid false positives.

## Owner Decisions Still Needed

- Whether the D&B AA certificate PDF may be publicly downloadable.
- Whether the professional liability insurance summary is public and whether
  any insurance document may be shared publicly or only by request.
- Whether licence scans/summaries can be included in a procurement pack.
- Whether a public Trust Center should include AutoWallis Pest or keep
  references on the homepage only.
- Whether future DE Trust Center content is noindex review-only or held until
  full native/legal approval.
- Whether PGP/encryption, acknowledgements or other responsible-disclosure
  extensions are needed later.

