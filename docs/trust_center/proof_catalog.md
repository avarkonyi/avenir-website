# Trust Center Proof Catalog

Status: foundation source, not a public Trust Center launch.
Last updated: 2026-06-13

This catalog is the maintenance source for future Trust Center and procurement
proof surfaces. It does not publish new proof documents and does not by itself
approve a claim for marketing use. Public wording must still follow
`docs/verified_claims.md` and the review gates below.

## Status Values

- `approved_public`: approved for stated public surfaces and wording.
- `approved_internal`: proof exists and may be used internally, but not
  published as a document or broad public claim.
- `pending_review`: proof or wording exists but needs owner/legal/proof review
  before public publication.
- `draft`: planning item, not approved.
- `expired`: proof has expired or review date passed.
- `not_public`: may be a legal/internal fact, but must not be used as public
  marketing proof.

## Surface Values

`homepage`, `trust_center`, `llms`, `structured_data`, `service_pages`,
`legal_pages`, `procurement_pack`

## Inventory Sources Reviewed

This foundation inventory was built from current repository sources only:

- `docs/verified_claims.md`
- `lib/seo-data.ts`
- `scripts/seed.ts` certification records
- `public/certifications/`
- `lib/references.ts`
- legal/privacy source files and responsible-disclosure/security.txt sources
- roadmap, backlog, handover and copy-strategy documentation

No DB write, proof-file publication, route launch or runtime change is implied
by this catalog.

## Future Inventory Items to Add Before Public Trust Center Launch

The following approved business facts exist in `docs/verified_claims.md`, but
are not yet modeled as separate Trust Center catalog entries in this foundation
pass. Add them before using them in a public Trust Center, procurement pack or
credential structured data:

- 24/7 dispatch / monitoring background;
- 30+ active sites;
- 200+ professionals / staff background;
- armed/unarmed guarding wording dependent on contractual need and risk
  profile;
- proposal/contact response-time wording, if it is ever reintroduced publicly.

## Entries

### company_identity

- id: `company_identity`
- category: company_identity
- title: Avenir Facility Management Kft. company identity
- status: `approved_public`
- public_surface_allowed: `legal_pages`, `trust_center`, `procurement_pack`,
  `structured_data`
- public_document: false
- public_url: `/hu/impresszum`, `/en/impresszum`, `/de/impresszum` (DE review)
- internal_proof_location: company registry extract / owner-controlled records
- owner: proof_owner
- review_frequency: on_change
- expiry_or_review_date: on company-data change
- allowed_wording_hu: "Avenir Facility Management Kft.; székhely: 1039
  Budapest, Királyok útja 291. B. ép. 15. ajtó; cégjegyzékszám:
  01-09-328046; adószám: 26395124-2-41; EU VAT: HU26395124."
- allowed_wording_en: "Avenir Facility Management Kft.; registered seat:
  1039 Budapest, Királyok útja 291, building B, door 15, Hungary; company
  registration number: 01-09-328046; tax number: 26395124-2-41; EU VAT:
  HU26395124."
- allowed_wording_de: "Avenir Facility Management Kft.; Sitz: 1039 Budapest,
  Királyok útja 291, Gebäude B, Tür 15; Handelsregisternummer: 01-09-328046;
  Steuernummer: 26395124-2-41; EU-USt-IdNr.: HU26395124."
- restricted_wording: do not invent additional registry, ownership, rating or
  authority claims.
- notes: Source values appear in `lib/seo-data.ts`,
  `lib/current-privacy-content.ts`, `lib/i18n/*`, and Impresszum pages.

### iso_9001

- id: `iso_9001`
- category: certifications
- title: ISO 9001:2015 Quality Management System Certification
- status: `approved_public`
- public_surface_allowed: `homepage`, `trust_center`, `llms`,
  `structured_data`, `legal_pages`, `procurement_pack`
- public_document: true
- public_url: `/certifications/iso-9001-marton-843579099.pdf`
- internal_proof_location: public certificate PDF plus certificate records
- owner: proof_owner
- review_frequency: on_expiry
- expiry_or_review_date: 2029-03-18
- allowed_wording_hu: "MSZ EN ISO 9001:2015 tanúsított irányítási rendszer,
  tanúsítvány száma: 843579099, kiállító: MartonCert Rendszertanúsító Kft.,
  hatály: 2026-03-19 - 2029-03-18, scope: Teljes körű biztonsági
  szolgáltatás."
- allowed_wording_en: "MSZ EN ISO 9001:2015 certified management system,
  certificate number 843579099, certification body MartonCert
  Rendszertanúsító Kft., valid 2026-03-19 to 2029-03-18, scope:
  Comprehensive security services."
- allowed_wording_de: "MSZ EN ISO 9001:2015 zertifiziertes Managementsystem,
  Zertifikat Nr. 843579099, Aussteller MartonCert Rendszertanúsító Kft.,
  gültig 19.03.2026 bis 18.03.2029."
- restricted_wording: do not state that every specific service process is ISO
  guaranteed; use scope-conditional wording.
- notes: Source of truth is the public PDF
  `/certifications/iso-9001-marton-843579099.pdf`. The old generic issuer
  wording `MARTON Szakértő Iroda Kft.` was corrected to the PDF name
  `MartonCert Rendszertanúsító Kft.`.

### iso_27001

- id: `iso_27001`
- category: certifications
- title: MSZ ISO/IEC 27001:2023 Information Security Management System Certification
- status: `approved_public`
- public_surface_allowed: `homepage`, `trust_center`, `llms`,
  `structured_data`, `legal_pages`, `procurement_pack`
- public_document: true
- public_url: `/certifications/iso-27001-marton-988960032.pdf`
- internal_proof_location: public certificate PDF plus certificate records
- owner: proof_owner
- review_frequency: on_expiry
- expiry_or_review_date: 2029-04-26
- allowed_wording_hu: "MSZ ISO/IEC 27001:2023 tanúsított
  információbiztonsági irányítási rendszer, tanúsítvány száma: 988960032,
  kiállító: MCert Rendszertanúsító Kft., hatály: 2026-04-27 - 2029-04-26."
- allowed_wording_en: "MSZ ISO/IEC 27001:2023 certified information security
  management system, certificate number 988960032, certification body MCert
  Rendszertanúsító Kft., valid 2026-04-27 to 2029-04-26."
- allowed_wording_de: "MSZ ISO/IEC 27001:2023 zertifiziertes
  Informationssicherheits-Managementsystem, Zertifikat Nr. 988960032,
  Aussteller MCert Rendszertanúsító Kft., gültig 27.04.2026 bis 26.04.2029."
- restricted_wording: no GDPR guarantee, no absolute cybersecurity guarantee,
  no universal process coverage claim.
- notes: Source of truth is the public PDF
  `/certifications/iso-27001-marton-988960032.pdf`. The old standard wording
  `ISO/IEC 27001:2022` and old generic issuer wording `MARTON Szakértő Iroda
  Kft.` were corrected to `MSZ ISO/IEC 27001:2023` and `MCert
  Rendszertanúsító Kft.`. Legal/privacy pages may reference this as a
  data-security support measure, not as a guarantee.

### dnb_aa_creditworthiness

- id: `dnb_aa_creditworthiness`
- category: creditworthiness
- title: Dun & Bradstreet AA High Creditworthy 2026
- status: `pending_review`
- public_surface_allowed: `homepage`, `llms`, `trust_center`,
  `procurement_pack`
- public_document: false
- public_url: null
- internal_proof_location: secure proof-controlled location; source file name
  recorded as `20260526 Avenir Facility Kft a.pdf`
- owner: proof_owner
- review_frequency: annual
- expiry_or_review_date: 2027-05-26 review target unless certificate states
  otherwise
- allowed_wording_hu: "D&B magas hitelképességi minősítés"; short stat "AA".
- allowed_wording_en: "D&B High Creditworthy 2026"; short stat "AA".
- allowed_wording_de: "Hohe Bonitätsbewertung (D&B)"; short stat "AA".
- restricted_wording: do not call this OPTEN or OPTEN A+; do not imply
  guaranteed solvency, risk-free operation, supplier-risk elimination or
  financial advice.
- notes: Verified claim is approved for public wording, but public proof-file
  publication remains pending review because the certificate is not stored in
  the repository.

### guarding_licence_summary

- id: `guarding_licence_summary`
- category: licences_regulated_activity
- title: Personal and property security guarding licence summary
- status: `approved_public`
- public_surface_allowed: `legal_pages`, `trust_center`, `procurement_pack`,
  `llms`
- public_document: false
- public_url: `/hu/impresszum`, `/en/impresszum`
- internal_proof_location: authority licence file in owner-controlled records
- owner: legal
- review_frequency: on_expiry
- expiry_or_review_date: 2028-01-31
- allowed_wording_hu: "Személy- és vagyonvédelmi tevékenység:
  01030-822/4926-7/2023, érvényes 2028-01-31-ig."
- allowed_wording_en: "Personal and Property Security activity: licence no.
  01030-822/4926-7/2023, valid until 31 January 2028."
- allowed_wording_de: "Bewachung: Lizenz Nr. 01030-822/4926-7/2023, gültig
  bis 31.01.2028."
- restricted_wording: do not place exact licence numbers in service body or
  service trust cards; do not imply police/public-authority role.
- notes: Primary regulated-activity licence is allowed in legal/proof and
  procurement contexts.

### security_technology_licence_summary

- id: `security_technology_licence_summary`
- category: licences_regulated_activity
- title: Security systems designer-installer certificate summary
- status: `approved_public`
- public_surface_allowed: `legal_pages`, `trust_center`, `procurement_pack`
- public_document: false
- public_url: `/hu/impresszum`, `/en/impresszum`
- internal_proof_location: authority certificate in owner-controlled records
- owner: legal
- review_frequency: on_change
- expiry_or_review_date: valid until revoked
- allowed_wording_hu: "Biztonságtechnikai tervező-szerelő igazolvány:
  01030-822/4927-3/2018, visszavonásig érvényes."
- allowed_wording_en: "Security Systems Designer-Installer official
  certificate: 01030-822/4927-3/2018, valid until revoked."
- allowed_wording_de: "Sicherheitstechnik-Planer-Installateur: offizieller
  Nachweis 01030-822/4927-3/2018, bis Widerruf gültig."
- restricted_wording: not a generic product-quality guarantee; do not use as a
  decorative service marketing proof.
- notes: Not surfaced as AI-search proof claim in llms files.

### private_investigation_licence_legal_only

- id: `private_investigation_licence_legal_only`
- category: licences_regulated_activity
- title: Private investigation licence legal-only fact
- status: `approved_public`
- public_surface_allowed: `legal_pages`, `trust_center`, `procurement_pack`
- public_document: false
- public_url: `/hu/impresszum`, `/en/impresszum`
- internal_proof_location: authority certificate in owner-controlled records
- owner: legal
- review_frequency: on_change
- expiry_or_review_date: valid until revoked
- allowed_wording_hu: "Magánnyomozói tevékenység - engedély részletei az
  Impresszumban."
- allowed_wording_en: "Private investigation activity - licence details are
  available in the Legal Notice."
- allowed_wording_de: "Privatdetektivtätigkeit - Genehmigungsdetails im
  Impressum."
- restricted_wording: no service marketing proof, no surveillance framing, no
  hidden monitoring framing, no employee-monitoring framing, no service CTA, no
  public contact-dropdown option and no AI-search marketing claim.
- notes: Legal source values appear in `SEO_LICENSES` as official certificate
  `01030-822/4925-3/2018`, valid until revoked, issuer `III. Kerületi
  Rendőrkapitányság, Igazgatásrendészeti Osztály` /
  `3rd District Police Station, Administrative Police Department`. Exact
  licence details remain on the Impresszum / Legal Notice and in legal/proof
  governance. This fact must not drive public Special Services copy before
  separate legal/process approval.

### liability_insurance

- id: `liability_insurance`
- category: insurance
- title: Mandatory professional liability insurance
- status: `pending_review`
- public_surface_allowed: `legal_pages`, `trust_center`, `procurement_pack`
- public_document: false
- public_url: `/hu/impresszum`, `/en/impresszum`
- internal_proof_location: insurance policy document in owner-controlled records
- owner: legal
- review_frequency: annual
- expiry_or_review_date: next policy renewal / owner confirmation required
- allowed_wording_hu: "Kötelező szakmai felelősségbiztosítás: Allianz
  Hungária Biztosító Zrt., kötvényszám: 341633910."
- allowed_wording_en: "Mandatory professional liability insurance: Allianz
  Hungária Biztosító Zrt., policy number 341633910."
- allowed_wording_de: "Pflicht-Berufshaftpflicht: Allianz Hungária Biztosító
  Zrt., Versicherungsschein 341633910."
- restricted_wording: no guarantee of loss prevention, claim acceptance,
  compensation or service outcome.
- notes: Summary is present in legal pages. Public raw policy PDF requires
  separate approval.

### dpo_contact

- id: `dpo_contact`
- category: data_protection_legal
- title: Data Protection Officer contact
- status: `approved_public`
- public_surface_allowed: `legal_pages`, `trust_center`, `procurement_pack`
- public_document: false
- public_url: `/hu/adatvedelem`, `/en/adatvedelem`, `/de/adatvedelem` (DE
  review)
- internal_proof_location: DPO appointment / NAIH notification records
- owner: DPO
- review_frequency: on_change
- expiry_or_review_date: on DPO data change
- allowed_wording_hu: "Adatvédelmi tisztviselő: Csegény Fanni,
  dpo@afm.hu."
- allowed_wording_en: "Data Protection Officer: Fanni Csegény,
  dpo@afm.hu."
- allowed_wording_de: "Datenschutzbeauftragte: Fanni Csegény,
  dpo@afm.hu."
- restricted_wording: no GDPR-compliance guarantee, no legal-advice claim.
- notes: Source in `SEO_DPO` and privacy/legal content.

### privacy_policy_hu_en_de_status

- id: `privacy_policy_hu_en_de_status`
- category: data_protection_legal
- title: Website Privacy Policy publication status
- status: `approved_public`
- public_surface_allowed: `legal_pages`, `trust_center`, `procurement_pack`
- public_document: false
- public_url: `/hu/adatvedelem`, `/en/adatvedelem`, `/de/adatvedelem` (DE
  review/noindex)
- internal_proof_location: `lib/current-privacy-content.ts`,
  `lib/de-legal-content.ts`, legal review files
- owner: DPO
- review_frequency: on_change
- expiry_or_review_date: on processing or provider change
- allowed_wording_hu: "A weboldal adatkezelési tájékoztatója a kapcsolat- és
  ajánlatkérési folyamatra vonatkozik."
- allowed_wording_en: "The website Privacy Policy covers website contact and
  quote-request processing."
- allowed_wording_de: "Die Datenschutzerklärung der Website gilt für Kontakt-
  und Angebotsanfrageprozesse; die deutsche Fassung bleibt bis zur finalen
  Freigabe im Review-/Noindex-Status."
- restricted_wording: no statement that the website notice covers all client,
  CCTV, employee or private-investigation processing.
- notes: HU/EN/DE source was updated to privacy version 1.3 on 2026-06-13 for
  Google Analytics processor and transfer wording. Related DPA/SCC/LIA evidence
  stays internal unless separately approved.

### google_analytics_processor_notice

- id: `google_analytics_processor_notice`
- category: data_protection_legal
- title: Google Analytics 4 processor notice
- status: `pending_review`
- public_surface_allowed: `legal_pages`, `trust_center`
- public_document: false
- public_url: `/hu/adatvedelem`, `/en/adatvedelem`, `/de/adatvedelem` (DE
  review/noindex)
- internal_proof_location: `lib/current-privacy-content.ts`,
  `docs/translations/de/legal/datenschutzerklaerung-de-v1.2.md`,
  `docs/legal/google-analytics-processor-review.md`
- owner: DPO
- review_frequency: on_change
- expiry_or_review_date: on GA4 account, provider-term or privacy-policy
  change
- allowed_wording_hu: "A Google Analytics 4 kizárólag hozzájárulás után tölt
  be; az Avenir nem küld nevet, e-mail-címet, telefonszámot, cégnév-adatot,
  üzenetszöveget vagy szabad szöveges űrlaptartalmat a Google Analyticsbe."
- allowed_wording_en: "Google Analytics 4 loads only after analytics consent;
  Avenir does not send names, email addresses, phone numbers, company names,
  message text or free-text form content to Google Analytics."
- allowed_wording_de: "Google Analytics 4 wird nur nach Einwilligung geladen;
  Avenir übermittelt keine Namen, E-Mail-Adressen, Telefonnummern,
  Unternehmensnamen, Nachrichtentexte oder frei eingegebenen Formularinhalte an
  Google Analytics."
- restricted_wording: do not state that DPF or SCC is the exclusive safeguard;
  do not publish Google DPA/SCC documents; do not imply final DPO/legal
  approval; do not imply Google Ads, remarketing, GTM, LinkedIn Insight Tag or
  other marketing pixels are implemented.
- notes: Internal evidence needed: Google Analytics DPA / Data Processing
  Terms accepted in the Google account; transfer safeguards reviewed; GA4 data
  retention documented; Google Signals, Ads personalization, Google Ads link
  and data sharing settings reviewed.

### recruitment_privacy_notice

- id: `recruitment_privacy_notice`
- category: data_protection_legal
- title: Applicant / recruitment privacy notice
- status: `approved_public`
- public_surface_allowed: `legal_pages`, `trust_center`, `procurement_pack`
- public_document: false
- public_url: `/hu/palyazoi-adatkezeles`, `/en/recruitment-privacy`
- internal_proof_location: `docs/legal/recruitment-privacy-*` review package
- owner: DPO
- review_frequency: on_change
- expiry_or_review_date: on recruitment process/provider change
- allowed_wording_hu: "Pályázói adatkezelési tájékoztató elérhető a
  karrierjelentkezésekhez."
- allowed_wording_en: "Recruitment privacy notice is available for job
  applications."
- allowed_wording_de: not in MVP; link to EN/HU only until DE review.
- restricted_wording: do not imply all HR processing is covered beyond the
  notice scope; do not publish LIA annexes unless approved.
- notes: LIA and legal sign-off annexes are internal evidence.

### responsible_disclosure

- id: `responsible_disclosure`
- category: security_responsible_disclosure
- title: Responsible disclosure policy
- status: `approved_public`
- public_surface_allowed: `trust_center`, `legal_pages`, `procurement_pack`
- public_document: false
- public_url: `/hu/felelos-hibabejelentes`, `/en/responsible-disclosure`
- internal_proof_location: source page content and security intake ownership
  records
- owner: operations
- review_frequency: annual
- expiry_or_review_date: 2027-06-10 aligned with security.txt refresh
- allowed_wording_hu: "Felelős hibabejelentés a www.afm.hu weboldal
  technikai biztonsági hibáihoz."
- allowed_wording_en: "Responsible disclosure for technical security issues
  related to the www.afm.hu website."
- allowed_wording_de: not in MVP.
- restricted_wording: no bug bounty promise, no response-time SLA, no broad
  legal safe harbor, no physical testing, no social engineering, no DoS/DDoS,
  no data exfiltration permission.
- notes: security@ alias confirmed by owner.

### security_txt

- id: `security_txt`
- category: security_responsible_disclosure
- title: Security.txt
- status: `approved_public`
- public_surface_allowed: `trust_center`, `legal_pages`, `procurement_pack`
- public_document: true
- public_url: `/.well-known/security.txt`
- internal_proof_location: `public/.well-known/security.txt`
- owner: operations
- review_frequency: annual
- expiry_or_review_date: 2027-06-10
- allowed_wording_hu: "security.txt elérhető security@afm.hu, dpo@afm.hu és
  info@afm.hu kapcsolattal."
- allowed_wording_en: "security.txt is available with security@afm.hu,
  dpo@afm.hu and info@afm.hu contacts."
- allowed_wording_de: not in MVP.
- restricted_wording: no PGP key, Hiring, Acknowledgments or reward references
  unless separately approved.
- notes: Policy points to `/en/responsible-disclosure`.

### autowallis_pest_reference

- id: `autowallis_pest_reference`
- category: references
- title: AutoWallis Pest approved public reference
- status: `approved_public`
- public_surface_allowed: `homepage`, `trust_center`, `procurement_pack`
- public_document: false
- public_url: `https://www.bmw-autowallis.hu`
- internal_proof_location: signed consent / logo approval in internal
  proof-controlled storage; do not publish
- owner: proof_owner
- review_frequency: annual / on_withdrawal
- expiry_or_review_date: 2027-06-13 review target
- allowed_wording_hu: "AutoWallis Pest - jóváhagyott ügyfélmegjelenés.
  Kapcsolódó szolgáltatások: Objektumőrzés; Recepciós és portaszolgálat."
- allowed_wording_en: "AutoWallis Pest - approved client reference. Related
  services: On-site Security Guarding; Reception and Gatehouse Services."
- allowed_wording_de: "AutoWallis Pest - freigegebene Kundenreferenz.
  Zugeordnete Dienstleistungen: Objektschutz vor Ort; Empfangs- und
  Pförtnerdienst."
- restricted_wording: no testimonial, no case study, no performance/result
  claim, no "AutoWallis recommends Avenir", no official BMW partner claim, no
  incident-free claim, no consent PDF publication.
- notes: Source data lives in `lib/references.ts`; card is visible only on
  HU/EN/DE homepage surfaces.

### data_processor_evidence_internal

- id: `data_processor_evidence_internal`
- category: data_protection_legal
- title: Processor DPA / SCC / LIA evidence
- status: `approved_internal`
- public_surface_allowed: none
- public_document: false
- public_url: null
- internal_proof_location: owner/DPO-controlled DPA, SCC, DPF and LIA evidence
  files
- owner: DPO
- review_frequency: annual / on_change
- expiry_or_review_date: next provider or privacy-policy review
- allowed_wording_hu: "Adatfeldolgozói és adattovábbítási háttérdokumentumok
  belső evidence anyagok."
- allowed_wording_en: "Processor and transfer-safeguard evidence documents are
  internal evidence materials."
- allowed_wording_de: not in MVP.
- restricted_wording: do not publish raw DPA, SCC, LIA or sub-processor
  evidence without separate legal approval.
- notes: Privacy pages describe processors and safeguards; underlying contracts
  remain internal.
