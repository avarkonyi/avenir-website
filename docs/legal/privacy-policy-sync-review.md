# Privacy Policy HU/EN Sync Review

Date: 2026-06-01

This document records the controlled HU/EN Privacy Policy synchronization for
the public `adatvedelem` routes. It is a legal-review support note, not a final
DPO or legal approval.

## Source Drafts

- HU source draft: `C:\Users\andra\Downloads\adatkezelesi-tajekoztato-hu-v1.2.md`
- EN source draft: `C:\Users\andra\Downloads\privacy-policy-en-v1.1.md`

## Publication Date and Version

- HU public version: `1.2 verzió - hatály pontosítása és analitikai tájékoztatás`
- EN public version: `Version 1.2 - scope clarification and analytics notice`
- HU effective date shown publicly: `2026. június 1.`
- EN effective date shown publicly: `1 June 2026`

The placeholder publication date from the drafts was replaced with the above
date pair.

## Scope and Parity Summary

The public HU and EN Privacy Policy content is aligned around the same 15
sections:

- controller identity and contact details
- controller representative
- DPO contact details
- website contact and quote-request processing
- exclusion of special, criminal and third-party data
- processors
- international data transfers
- cookies and analytics
- data-subject rights
- automated decision-making and profiling
- rights procedure
- remedies
- data breach handling
- data security measures
- modification of the policy

The EN version includes an authoritative-language note that the Hungarian text
published at `/hu/adatvedelem` prevails in case of discrepancy.

## Analytics and Cookie Wording

Section 8 was aligned with the current implementation:

- direct Google Analytics 4 is used only after analytics consent;
- GA4 does not load before consent;
- rejection keeps GA4 blocked;
- Google Tag Manager is not used;
- LinkedIn Insight Tag is not used;
- analytics events do not include name, email address, phone number, company
  name, message text or free-text form content;
- technical contact-form security measures are not advertising tracking.

Account-side GA4 Enhanced Measurement remains a separate review item. It should
be checked before treating the public privacy notice as final.

## Processor and Transfer Wording

Processor wording was normalized around the current public stack:

| Processor | Role | Transfer safeguard wording |
| --- | --- | --- |
| Resend / Plus Five Five, Inc. | Transactional email delivery | Standard Contractual Clauses, GDPR Article 46(2)(d) |
| Vercel Inc. | Hosting, edge/CDN and server-side logging | EU-U.S. Data Privacy Framework / adequacy decision, GDPR Article 45, based on the DPF-list wording in the draft |
| Neon, LLC | PostgreSQL database service | Standard Contractual Clauses, GDPR Article 46(2)(d) |

Background evidence to retain for legal review:

- Resend DPA / SCC terms
- Vercel DPA and Data Privacy Framework status
- Neon DPA / SCC terms
- legitimate-interest assessment for GDPR Article 6(1)(f) B2B contact handling

## EDPB Link Note

The English DPF FAQ link was updated to the current EDPB English PDF located at:

`https://www.edpb.europa.eu/system/files/2026-01/edpb_dpf_faq-for-individuals_v2_en.pdf`

The EDPB search result identified this as version 2.0 dated 16 January 2026; the
older 2024 English PDF is marked superseded. The Hungarian DPF FAQ link remains
the draft-provided Hungarian PDF URL.

## Separate Notices Still Needed

The public website privacy notice is scoped to the website contact and
quote-request flow. Separate notices remain needed or must remain separately
maintained for:

- CCTV monitoring at client sites;
- private investigation activity;
- HR / employee data processing;
- client-project processing;
- any special-service intake that may collect sensitive information.

## Guardrails

- Do not add FISA Section 702 or CLOUD Act wording unless legal review requests
  it.
- Do not add ISO certificate number `988960032` to the public privacy policy.
- Do not add Google Tag Manager or LinkedIn Insight Tag wording unless those
  tools are actually introduced and reviewed.
- Do not claim this implementation is final DPO/legal approval.

## ASZF Date Quick Check

No ASZF content was changed in this privacy-policy pass.

Observed state:

- the current HU ASZF override in `lib/legal-content.ts` presents the legal
  notice as effective from 2026. május 6. / version 1.1;
- the older base HU translation source still contains `Hatályba lépés:
  2026.04.28.` in the fallback body/version history.

This should be treated as a source-cleanup/legal-confirmation item, not as a
change made in this task.
