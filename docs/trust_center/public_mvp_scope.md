# Trust Center Public MVP Scope

Status: planning foundation only, no public route launch.
Last updated: 2026-06-13

This file defines the smallest safe public Trust Center scope for the Avenir
website. It is intentionally narrower than the full proof catalog. It should
help procurement users without publishing internal evidence, client-specific
documents or broad marketing claims.

## MVP Goal

Create a concise HU/EN Trust Center layer that answers the most common
procurement questions:

- who the company is;
- which management-system certifications are public;
- which regulated activity summaries can be referenced;
- which privacy, security and disclosure pages exist;
- which reference/logo use is approved;
- how a buyer can request additional procurement proof.

The MVP is not a document dump, not a legal advice page and not a replacement
for controlled tender due-diligence sharing.

## Proposed MVP Routes

- HU: `/hu/megfelelosegi-kozpont`
- EN: `/en/trust-center`

No route is launched by this documentation pass.

DE, ZH and KO Trust Center routes are out of MVP. If German is added later, it
must follow the current DE review/noindex localization policy until native,
legal and proof review is complete.

## MVP Sections

| Section | MVP content | Catalog entries | Status |
| --- | --- | --- | --- |
| Overview | Short explanation of available proof and request path. | selected approved entries | Ready for planning |
| Company information | Company identity summary and Impresszum links. | `company_identity` | Public wording approved |
| Certifications | ISO 9001 and ISO 27001 cards with public PDF links and validity. | `iso_9001`, `iso_27001` | Public documents approved |
| Regulated activities | Short guarding and security-technology licence summaries, linked to legal pages. | `guarding_licence_summary`, `security_technology_licence_summary` | Public summary allowed |
| Insurance | Professional liability insurance summary only if owner/legal confirms public wording. | `liability_insurance` | Pending review |
| Data protection | Privacy, DPO and recruitment privacy links. | `dpo_contact`, `privacy_policy_hu_en_de_status`, `recruitment_privacy_notice` | HU/EN public; DE review status noted only internally |
| Security reporting | Responsible disclosure and security.txt links. | `responsible_disclosure`, `security_txt` | Public HU/EN |
| Approved reference | AutoWallis Pest reference summary, with restrictions. | `autowallis_pest_reference` | Approved for stated surfaces |
| Document request | Controlled path for additional procurement proof. | no raw evidence | Requires owner/process decision |

## Public Documents Allowed in MVP

| Document or surface | Public in MVP | Conditions |
| --- | --- | --- |
| ISO 9001 PDF | Yes | Use existing public certificate path and scope-safe wording. |
| ISO 27001 PDF | Yes | Use existing public certificate path and no cybersecurity/GDPR guarantee. |
| Impresszum company data | Yes | Link to HU/EN pages; do not duplicate stale registry values. |
| HU/EN Privacy Policy | Yes | Link to existing public routes. |
| HU/EN Recruitment Privacy Notice | Yes | Link to existing public routes. |
| HU/EN Responsible Disclosure | Yes | Link to existing public routes. |
| `/.well-known/security.txt` | Yes | Keep annual expiry review. |
| AutoWallis Pest public reference card | Yes | Summary only; no consent PDF, testimonial or case-study claim. |
| D&B AA wording | Yes, as summary wording | Certificate PDF publication needs separate proof-owner decision. |

## Not Public in MVP

Do not publish or link these from the MVP unless a later approval explicitly
changes their status:

- signed AutoWallis Pest consent or logo-approval documents;
- raw professional liability insurance policy;
- DPA, SCC, LIA, processor contract or transfer-safeguard evidence;
- private investigation licence as marketing proof;
- national security registry documents;
- unapproved ESG, sustainability, EcoVadis or supplier-due-diligence documents;
- tender-only internal packs;
- client-specific, contract-specific or operational audit evidence;
- screenshots of private systems or admin tools.

## Claim Rules

- Use the exact allowed wording from `docs/trust_center/proof_catalog.md` and
  `docs/verified_claims.md`.
- Do not turn legal facts into service-marketing promises.
- Do not use licence numbers in service body or trust-card copy.
- Do not state that ISO certificates guarantee a specific process outcome.
- Do not call the D&B AA certificate OPTEN or OPTEN A+.
- Do not imply guaranteed solvency, zero supplier risk, SLA response or
  guaranteed compliance.
- Do not add partner/client names unless they have an approved catalog entry.

## Sitemap, Hreflang and Indexing

No sitemap, hreflang or noindex behavior changes are made by this foundation
pass.

For the future MVP:

- HU and EN Trust Center routes can be indexable after content/proof review.
- DE/ZH/KO Trust Center routes must not be added until the localization model is
  approved.
- Hreflang must include only existing, reviewed routes.
- `llms.txt` and `llms-full.txt` should include Trust Center references only
  after public routes are live.

## Launch Gates

Before a public Trust Center launch:

1. Proof owner reviews every visible entry against the catalog.
2. Legal/DPO reviews data-protection, disclosure, licence and insurance
   wording.
3. Owner decides whether D&B certificate PDF is internal-only or public.
4. Owner decides whether professional liability insurance summary is public.
5. AutoWallis Pest card restrictions are re-confirmed.
6. No raw signed consent, DPA/SCC/LIA or insurance documents are public.
7. JSON-LD/AI-search additions are limited to approved entries.
8. QA verifies that no unapproved proof, OPTEN wording, SLA guarantee or client
   claim appears.

