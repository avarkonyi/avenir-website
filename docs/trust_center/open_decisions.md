# Trust Center Open Decisions

Status: decision register for later implementation.
Last updated: 2026-06-13

No public Trust Center route should be implemented until the P1 decisions below
are resolved or explicitly deferred.

| ID | Priority | Area | Decision needed | Current source state | Recommended default | Owner |
| --- | --- | --- | --- | --- | --- | --- |
| TC-001 | P1 | D&B AA | Should the D&B AA certificate PDF be publicly downloadable, summary-only, or internal proof only? What is the review/expiry date? | Public wording is approved in `docs/verified_claims.md`; catalog status is `pending_review` because public proof-file publication is not decided. | Keep out of MVP card until proof owner approves Trust Center wording and document status. | Proof owner |
| TC-002 | P1 | D&B AA | Exact HU/EN Trust Center wording if included. | Allowed wording exists: HU "D&B magas hitelképességi minősítés"; EN "D&B High Creditworthy 2026"; short stat "AA". | Use only allowed wording; never OPTEN/A+. | Proof owner |
| TC-003 | P1 | Liability insurance | Is the professional liability insurance summary public in Trust Center? May the policy number appear? | Legal pages list insurer and policy number; catalog status is `pending_review`. | Exclude from MVP until legal/proof approval. | Legal / proof owner |
| TC-004 | P1 | Liability insurance | May the raw insurance policy PDF be public, controlled-share only, or internal-only? | No public insurance PDF is approved. | Internal-only / controlled procurement sharing unless approved. | Legal / owner |
| TC-005 | P1 | ISO issuer | Confirm exact issuer name and scope directly from both PDFs. | Source records `MARTON Szakértő Iroda Kft.` and public PDFs exist. | Verify issuer/scope before route launch; do not introduce MartonCert / MCert drift. | Proof owner |
| TC-006 | P1 | Licence summaries | Which licence groups can appear in Trust Center: guarding only, guarding + security technology, private investigation legal-only, or legal page link only? | Catalog allows guarding, security technology and private investigation as regulated-activity summaries; private investigation remains legal/regulatory information only. | Include guarding, security technology and private investigation only inside the regulated-activities section; link exact details to Impresszum / Legal Notice. No service CTA, dropdown option or marketing proof card. | Legal / proof owner |
| TC-007 | P1 | Licence numbers | Should exact licence numbers appear on the Trust Center page or only on Impresszum / Legal Notice? | Exact numbers are legal/proof facts but should not become decorative marketing proof. | Use summary wording in Trust Center; link to legal page for exact details. | Legal / proof owner |
| TC-008 | P2 | AutoWallis Pest | Should AutoWallis Pest appear in Trust Center MVP or remain homepage-only? | Catalog allows `trust_center`; signed consent remains internal. | Include only if owner confirms; otherwise keep homepage-only. | Proof owner / owner |
| TC-009 | P2 | AutoWallis Pest | Should the card link out from Trust Center, or just list the approved display name/services? | Homepage card links to approved website URL. | If included, keep link optional and no testimonial/case-study wording. | Proof owner |
| TC-010 | P1 | 24/7, 30+, 200+ | Should these approved business facts be modeled as separate proof-catalog entries? What is the proof source and owner? | Claims are approved in `docs/verified_claims.md`, but not separate catalog entries yet. | Later phase; do not add to first Trust Center MVP until cataloged. | Proof owner |
| TC-011 | P2 | DPA/SCC/LIA naming | Should `data_processor_evidence_internal` be renamed or aliased to `dpa_scc_lia_internal_evidence`? | Current catalog uses `data_processor_evidence_internal`; requested spec id is missing. | Keep internal-only either way; resolve naming before automation. | DPO / proof owner |
| TC-012 | P2 | DE Trust Center | Should German Trust Center be noindex review later or held until full approval? | DE pages follow noindex review model elsewhere. | Not in MVP; decide after DE legal/native review. | Owner / legal / German reviewer |
| TC-013 | P2 | Procurement request flow | Use existing contact channels or create a dedicated procurement-proof request flow? | Current MVP spec uses general contact channels. | Start with general contact; add dedicated flow only after privacy/process review. | Sales / DPO |
| TC-014 | P3 | Structured data | Should ISO certificates, licences or D&B be added as `hasCredential` later? | Current guidance defers credential schema beyond existing ISO handling; licence/D&B expansion is not approved. | Do not add in MVP; use proof catalog and route-readiness guard first. | SEO / proof owner |
