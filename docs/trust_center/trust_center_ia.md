# Trust Center IA

Status: IA foundation only, no public route launch.
Last updated: 2026-06-13

The future Trust Center should support procurement, compliance review and
vendor onboarding without turning proof assets into broad marketing claims.
Every visible item must map back to `docs/trust_center/proof_catalog.md` and
`docs/verified_claims.md`.

## Proposed Routes

- HU: `/hu/megfelelosegi-kozpont`
- EN: `/en/trust-center`
- DE: later `/de/trust-center` only as noindex/review until native/legal review
- ZH/KO: not in MVP

No sitemap, hreflang, noindex or public route policy changes are made in this
foundation pass.

## IA Principles

- Show only approved public proof entries.
- Keep internal evidence internal unless publication is explicitly approved.
- Prefer short summaries with source/status metadata over dense legal text.
- Separate legal facts from marketing trust claims.
- Keep expiry and review dates visible to maintainers.
- Never publish signed consent PDFs, DPA/SCC/LIA files or raw insurance policy
  documents without approval.

## 1. Overview

Purpose:
Give buyers a concise explanation of what the Trust Center contains and how to
request additional procurement proof.

Displayable proof entries:
`company_identity`, `iso_9001`, `iso_27001`, `dnb_aa_creditworthiness`,
`dpo_contact`, `responsible_disclosure`, `security_txt`.

Must not display:
Raw internal evidence, signed reference consent, DPA/SCC/LIA documents,
unapproved partner names, testimonials, incident-free claims, SLA guarantees.

Review gate:
Product/proof owner confirms visible entries and status labels before route
launch.

MVP vs later:
MVP includes summary cards. Later may add document filters and procurement-pack
downloads.

## 2. Company Information

Purpose:
Provide company identity data needed for procurement and vendor onboarding.

Displayable proof entries:
`company_identity`, DPO contact link, legal page links.

Must not display:
Unverified registry data, ownership claims, turnover/headcount claims beyond
approved public facts.

Review gate:
Owner/proof owner confirms registry values before launch and after any company
data change.

MVP vs later:
MVP shows summary and links to Impresszum. Later may add a procurement data
sheet PDF.

## 3. Certifications

Purpose:
Show ISO management-system certificates in a scope-safe way.

Displayable proof entries:
`iso_9001`, `iso_27001`; public PDF links if the files remain approved.

Must not display:
Claims that every service process is ISO guaranteed, GDPR guaranteed or
universally covered by the certificate scope.

Review gate:
Proof owner confirms issuer, certificate number, PDF path, scope and validity
date against certificate source.

MVP vs later:
MVP shows cards and public PDF links. Later may add verification URL guidance
or filtered document library tags.

## 4. Licences and Regulated Activities

Purpose:
Explain regulated activity coverage without turning licence numbers into
decorative marketing proof.

Displayable proof entries:
`guarding_licence_summary`, `security_technology_licence_summary`, legal-page
links.

Must not display:
Private-investigation licence as marketing proof; police/public-authority role;
licence `hasCredential` structured-data expansion; exact licence numbers inside
service body/trust-card copy.

Review gate:
Legal/proof owner confirms which licence summaries may appear publicly and in
which format.

MVP vs later:
MVP links to Impresszum and includes a short regulated-activity summary. Later
may add a procurement-only licence pack after approval.

## 5. Insurance

Purpose:
Provide procurement-facing evidence that mandatory professional liability
insurance is maintained.

Displayable proof entries:
`liability_insurance`.

Must not display:
Raw policy PDF, claim acceptance promise, compensation guarantee, loss
prevention guarantee or service-outcome guarantee.

Review gate:
Legal/proof owner confirms policy number, insurer and whether public wording is
approved.

MVP vs later:
MVP may show summary only if wording is approved. Later may add a procurement
pack attachment if the policy document is approved for controlled sharing.

## 6. Data Protection and Security

Purpose:
Connect privacy, DPO, recruitment privacy and information-security evidence.

Displayable proof entries:
`dpo_contact`, `privacy_policy_hu_en_de_status`,
`recruitment_privacy_notice`, `responsible_disclosure`, `security_txt`,
ISO information-security card.

Must not display:
Raw DPA/SCC/LIA files, GDPR guarantee, NAIH approval guarantee, processor
contract details beyond public privacy-policy wording.

Review gate:
DPO/legal review before publishing new data-protection documents or expanding
processor evidence.

MVP vs later:
MVP links to privacy pages, recruitment privacy, responsible disclosure and
security.txt. Later may add a controlled due-diligence document request flow.

## 7. Responsible Disclosure

Purpose:
Provide a clear technical security reporting path.

Displayable proof entries:
`responsible_disclosure`, `security_txt`.

Must not display:
Bug bounty reward promise, response-time SLA, broad safe harbor, physical
testing permission, social engineering permission, DoS/DDoS permission, data
exfiltration permission.

Review gate:
Operations/IT owner confirms the intake owner and security@ monitoring.

MVP vs later:
MVP links to HU/EN responsible-disclosure pages. Later may add PGP key or
acknowledgement policy only after explicit approval.

## 8. Approved References

Purpose:
Show only approved public references with strict wording.

Displayable proof entries:
`autowallis_pest_reference`.

Must not display:
Signed consent PDF, testimonial, case study, performance/result claim, partner
relationship claim, "official BMW partner" claim, incident-free claim.

Review gate:
Proof owner confirms logo approval, URL and allowed service chips.

MVP vs later:
MVP can include the single approved reference summary. Later may add further
references only when each has proof-catalog entry and approval.

## 9. Documents and Downloads

Purpose:
Offer a controlled document library for procurement users.

Displayable proof entries:
Public ISO PDFs, public privacy/recruitment privacy links, responsible
disclosure, future approved procurement pack.

Must not display:
Signed Wallis consent PDF, DPA/SCC/LIA, raw insurance policy, unapproved ESG
documents, unapproved licence scans, private investigation proof.

Review gate:
Each downloadable document needs approved public-document status, owner,
review/expiry date and allowed surface.

MVP vs later:
MVP can list approved public PDFs and links only. Later can add filters by
category, expiry and language.

## 10. Procurement Contact / Request Additional Proof

Purpose:
Give buyers a safe path to request additional documents without publishing
internal evidence.

Displayable proof entries:
Contact instructions and a controlled request path, not raw documents.

Must not display:
Sensitive evidence files, third-party contracts, private client data, internal
audit documents.

Review gate:
Sales/proof owner defines who receives document requests and which documents
can be shared externally.

MVP vs later:
MVP may link to the existing contact section. Later may add a dedicated
procurement request form after privacy and process review.
