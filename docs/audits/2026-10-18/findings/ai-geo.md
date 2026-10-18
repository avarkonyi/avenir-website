# AIGEO (AI-search / GEO / structured data) — findings

Coverage:
- JSON-LD: all 76 crawled pages (`S\crawl\pages\*.json`), 636 JSON-LD nodes, 428 FAQPage questions; grouped by `@id` and diffed across the 6 locales. Every Service / BreadcrumbList / FAQPage / WebPage / Article node was checked against canonical, H1, meta description and visible text. Re-parsed the raw live HTML of `/hu/szolgaltatasok/objektumorzes` (9 JSON-LD scripts, all valid) to confirm FAQ answers are in the server-rendered `<details>` DOM.
- `llms.txt` (128 lines) and `llms-full.txt` (241 lines), read line by line. Both are byte-identical to `public/llms*.txt` at `9b767ef`. Every listed URL was cross-checked against `index.json` / `sitemap-urls.json`.
- `robots.txt` (46 lines) and `app/robots.ts`; `.well-known/security.txt` (7 fields).
- Entity data compared across schema, footer, `/hu|en/impresszum`, `/hu/megfelelosegi-kozpont`, `/en/trust-center`, llms files and security.txt (`text_hu.md`, `text_en.md`, plus the DE/FR/KO/ZH footers).
- Source read: `lib/homepage-schema.ts`, `lib/seo-data.ts`, `lib/schema-locale-copy.ts`, `app/[locale]/layout.tsx`, `app/[locale]/szolgaltatasok/[slug]/page.tsx`, `components/JsonLd.tsx`, `lib/public-sitemap.ts`, `lib/locale-ui-helpers.ts`, the certification records in `scripts/seed.ts`, and the previous production schema (`git show 8f9bba4:app/[locale]/layout.tsx`).
- Governance read: `verified_claims.md`, `proof_catalog.md`, `proof_language_rules.md`, `owner-confirmations-2026-10-18.md`, the June audit, and `text-audit-open-items.csv` (searched for schema/llms/claim keywords).
- Light GETs, status and headers only. 16 negative routes:
  - FR legal, news, trust and disclosure routes;
  - KO news and ZH impressum;
  - DE recruitment, trust and disclosure routes;
  - the HU/EN legacy `security` slug.
- Light GETs, assets and hosts: logo, OG image, the 2 ISO PDFs, the headers of the llms, robots, sitemap and security.txt files, and the root/apex/http redirects.
- NOT covered:
  - external validity of `recognizedBy` URLs and the NAH register (no external fetches);
  - the LinkedIn profile content;
  - Google Rich Results Test / Schema.org validator runs (offline review only);
  - the PDF contents of the ISO certificates.

## Findings

### AIGEO-001 — Expired national-security registry review date published on indexed legal pages (and AI-crawlable)
- Severity: P1
- Category: claim/proof, legal-consistency, entity freshness
- Where: https://www.afm.hu/hu/impresszum §6 d); https://www.afm.hu/hu/aszf §5 d); EN/DE equivalents; source `lib/seo-data.ts:241-250` (`SEO_LICENSES[3]`)
- Evidence: HU impresszum: "AH/37595-14/2024-2 … Érvényesség felülvizsgálat: 2026-06-30". HU ÁSZF: "felülvizsgálat 2026.06.30-ig kötelező". EN: "review required by 30 June 2026".
- Problem: As of 2026-10-18 the date is 3.5 months in the past, so answer engines will cite a lapsed status. The owner states that a new decision valid until 2029 exists, but its identifier is still missing (`owner-confirmations-2026-10-18.md` l.21).
- Fix: once the owner supplies the new decision number and date, update `SEO_LICENSES[3]` (number, `validUntil`) so the impresszum, ÁSZF and all locales render it. Until then, do not add it to the llms files or schema.
- Status: KNOWN (HUA-002, HUB-002, DEB-018)
- Confidence: high

### AIGEO-002 — llms files say the review surfaces may not be deployed, while they are live in production
- Severity: P2
- Category: SEO-indexing / GEO correctness (stale statement)
- Where: https://www.afm.hu/llms.txt (`public/llms.txt:22-23`, `:128`); https://www.afm.hu/llms-full.txt (`public/llms-full.txt:39-40`, `:122-123`)
- Evidence: "This source summary does not confirm that these changes have been deployed to production." / "Review support does not confirm deployment." / "and source support does not confirm production deployment."
- Problem: The files are served by production `9b767ef`, where all DE/FR/KO/ZH homepages and 8 service pages per locale return 200 + noindex (`index.json`). An answer engine reads "not confirmed deployed" as uncertainty about the site's own state. The wording is release-note language, not a grounding fact.
- Fix: replace each occurrence with: "These German, French, Korean and Chinese review pages are live as noindex pages, excluded from the sitemap and hreflang, and are not citable sources until translation review and release approval are complete." Delete "Review support does not confirm deployment."
- Status: NEW
- Confidence: high

### AIGEO-003 — WebSite `inLanguage` advertises the noindex review locales as site languages
- Severity: P2
- Category: schema / locale policy
- Where: every page (76/76), `@id https://www.afm.hu/#website`; source `lib/homepage-schema.ts:112` (`inLanguage: [...SEO_LOCALES]`)
- Evidence: `"inLanguage": ["hu","en","de","zh","ko","fr"]`
- Problem: The site entity declares 6 available languages, while policy and the llms files say only HU/EN are indexed production languages. This contradicts llms.txt ("Indexed production languages: Hungarian (hu) and English (en)"). FR and KO were added in this release.
- Fix: `inLanguage: ["hu", "en"]` (use the indexable-locale helper from `lib/services/publication`, not `SEO_LOCALES`).
- Status: KNOWN (June audit P2-01, still unresolved and widened from 5 to 6 locales)
- Confidence: high

### AIGEO-004 — `iso6523Code` uses ICD 0190 (Dutch OIN) for a Hungarian company registration number
- Severity: P2
- Category: schema / entity identifier correctness
- Where: Organization node on all 76 pages; source `lib/seo-data.ts:40`, `lib/homepage-schema.ts:60`
- Evidence: `"iso6523Code": "0190:01-09-328046"`
- Problem: In the ISO 6523 ICD list (as used by Peppol), 0190 is the Dutch Originator's Identification Number (OIN), not a Hungarian registry. The schema therefore asserts a false identifier scheme. Entity resolvers that parse ICD prefixes can mis-key the company.
- Fix:
  - Remove `iso6523Code`.
  - Express the registry number as `"identifier": {"@type":"PropertyValue","propertyID":"HU cégjegyzékszám","value":"01-09-328046"}`.
  - Optional, only after the owner approves public use: `"duns": "401251621"` with `"iso6523Code": "0060:401251621"`. 0060 is the DUNS ICD; the D-U-N-S number is recorded in `verified_claims.md` l.87 but is not approved as a public claim.
- Status: NEW
- Confidence: medium-high (ICD-list knowledge; not fetched externally)

### AIGEO-005 — Service `areaServed` is hard-coded in Hungarian on EN and all review-locale service pages
- Severity: P2
- Category: schema / untranslated value / in-page inconsistency
- Where: all 48 service pages, e.g. https://www.afm.hu/en/szolgaltatasok/objektumorzes `#service`; source `app/[locale]/szolgaltatasok/[slug]/page.tsx:229`
- Evidence: EN page: `"areaServed": {"@type":"Country","name":"Magyarország"}`. The LocalBusiness node on the same page has `"areaServed":{"@type":"Country","name":"Hungary"}`.
- Problem: Indexed EN pages carry a Hungarian country name, so the same page says "Magyarország" and "Hungary" for the same fact. The DE/FR/KO/ZH pages show the same issue.
- Fix: `areaServed: { "@type": "Country", name: getSchemaLocaleCopy(locale as SeoLocale).country, identifier: "HU" }`. This gives "Hungary" on EN and "Magyarország" on HU, with a stable ISO code.
- Status: NEW
- Confidence: high

### AIGEO-006 — Trust Center (main proof page) is orphaned; responsible-disclosure pages are only reachable from it
- Severity: P2
- Category: SEO-indexing / GEO internal linking
- Where: https://www.afm.hu/hu/megfelelosegi-kozpont, https://www.afm.hu/en/trust-center; footer source `lib/locale-ui-helpers.ts:180-184`
- Evidence: Link map over all 76 crawled pages:
  - `/hu/megfelelosegi-kozpont` is linked only from `hu__megfelelosegi-kozpont` and `en__trust-center`, i.e. from itself and its language twin.
  - `/hu/felelos-hibabejelentes` and `/en/responsible-disclosure` are linked only from the Trust Center and the disclosure pages themselves.
  - The footer "JOGI" list contains only "Adatkezelési tájékoztató / Jogi nyilatkozatok / Impresszum / Süti beállítások".
- Problem: The page that holds the citable ISO numbers, the regulated-activity summary and DPO/security contacts has no internal link from the homepage, service pages or footer. AI crawlers and search engines can find it only through the sitemap and llms files, which weakens both discovery and authority.
- Fix: add a footer legal link in `getFooterLegalLinks`: HU "Megfelelőségi központ" → `/hu/megfelelosegi-kozpont`, EN "Trust Center" → `/en/trust-center`; the DE/FR/KO/ZH fallbacks point to `/en/trust-center`. Optionally link it from the homepage certificates section ("Tanúsítványok részletei a Megfelelőségi központban").
- Status: KNOWN (June audit P2-08, unresolved)
- Confidence: high

### AIGEO-007 — Indexed homepages give no quotable "who / what / where" sentence; country and full company name are absent from the main text
- Severity: P2
- Category: GEO / AI-citation readiness
- Where: https://www.afm.hu/hu and https://www.afm.hu/en, hero and "Az Avenirről / About Avenir"
- Evidence:
  - The H1 is the slogan only: "Kevesebb kockázat. Több kontroll." / "Less risk. More control."
  - The about text reads "Az Avenir 2018-ban alakult, … 30+ aktív helyszínen dolgozunk országszerte" and EN "we work nationwide".
  - Counts in `<main>` text: "Magyarország" 0, "Avenir Facility Management" 0 (HU); "Hungary" 0 (EN). "Budapest" appears only in addresses.
- Problem: An answer engine asked "Hungarian security guarding company" or "who is Avenir Facility Management" finds no single sentence on the indexed page that names the legal brand, the country, the B2B category and the service set together. It must assemble the answer from meta, schema and footer, and those sources are cited less reliably.
- Fix: add one sentence to the hero intro or the about paragraph.
  - HU: "Az Avenir Facility Management Kft. budapesti székhelyű B2B vagyonvédelmi és létesítményüzemeltetési szolgáltató, amely Magyarország egész területén végez élőerős objektumőrzést, recepciós és portaszolgálatot, biztonságtechnikai, távfelügyeleti és rendezvénybiztosítási feladatokat, próbavásárlást és szolgáltatásauditot, valamint Hard FM és Soft FM szolgáltatást."
  - EN: "Avenir Facility Management Kft. is a Budapest-based B2B security and facility management provider serving business sites across Hungary with on-site security guarding, reception and gatehouse services, security technology, remote monitoring and response, event security, mystery shopping and service audits, Hard FM and Soft FM."
  - All elements are already approved (llms "Main service area: Hungary", seat Budapest, the 8 services).
- Status: NEW
- Confidence: high

### AIGEO-008 — llms-full "Structured data notes" describe types the site no longer emits
- Severity: P3
- Category: GEO correctness
- Where: `public/llms-full.txt:220-222`
- Evidence: "The public site may expose JSON-LD for Organization, ProfessionalService, SecurityService, WebSite, certification credentials, Service pages, BreadcrumbList, and FAQPage". Live types: Organization, LocalBusiness, ItemList, WebSite, EducationalOccupationalCredential, BreadcrumbList, Service, FAQPage, WebPage, Article. `ProfessionalService` / `SecurityService` were removed in this release (they were in `8f9bba4` layout l.214).
- Problem: The grounding file's description of the structured data contradicts the live markup.
- Fix: "The public site exposes JSON-LD for Organization, LocalBusiness, WebSite, ISO certification credentials, a service ItemList, Service, BreadcrumbList, WebPage (legal and Trust Center pages), Article (news) and FAQPage (only where a visible FAQ is rendered)."
- Status: NEW
- Confidence: high

### AIGEO-009 — llms says private investigation appears "only" in the Legal Notice and Trust Center; it also appears in the Legal Statements and in a Mystery Shopping FAQ
- Severity: P3
- Category: GEO correctness / claim scope
- Where: `public/llms.txt:69-72`, `public/llms-full.txt:99-102`; live https://www.afm.hu/hu/aszf §4 and §5 c), https://www.afm.hu/en/aszf; `/hu|en/szolgaltatasok/mystery-shopping-helyszini-audit` FAQ (also in FAQPage schema)
- Evidence: llms: "Private investigation activity is legal/regulatory information only in the Legal Notice and Trust Center regulated-activity summary." HU ÁSZF: "4. Magánnyomozói tevékenység és különleges adatok kezelésének kizárása az űrlapon … A Szolgáltató magánnyomozói tevékenységet kizárólag a vonatkozó hatósági engedély (01030-822/4925-3/2018) birtokában … végez." FAQ: "Mi a különbség a Mystery Shopping és a magánnyomozás között?"
- Problem: The usage itself is compliant: it is lawyer-reviewed legal text, and the FAQ separates mystery shopping from private investigation. The llms scope statement, however, is factually incomplete.
- Fix: "Private investigation activity appears only as legal/regulatory information (Legal Notice, Legal Statements and the Trust Center regulated-activity summary) and in one Mystery Shopping FAQ that states the service is not private investigation. It is not a promoted public service, …" (keep the rest).
- Status: NEW
- Confidence: high

### AIGEO-010 — llms files omit the EN service names/URLs and the public DPO/security contacts; links are not in llms.txt Markdown form
- Severity: P3
- Category: GEO coverage
- Where: `public/llms.txt:75-87`, `public/llms-full.txt:118-188`, company-facts blocks
- Evidence: "The English URL uses the same slug under https://www.afm.hu/en/szolgaltatasok/." Only the 8 HU URLs are listed, and llms-full headings are HU only (e.g. "### Élőerős objektumőrzés"). The files do not list `dpo@afm.hu`, `security@afm.hu`, https://www.afm.hu/hu/felelos-hibabejelentes, https://www.afm.hu/en/responsible-disclosure or https://www.afm.hu/.well-known/security.txt, all of which are approved public items (`proof_catalog.md` dpo_contact, responsible_disclosure, security_txt). Lines use "- HU homepage: https://…" instead of the llmstxt.org form "- [Title](url): note".
- Problem: English answers cannot cite the English canonical pages directly, and privacy/security contact questions have no grounding.
- Fix:
  - Per service, add an EN line, e.g. "EN: On-site Security Guarding — https://www.afm.hu/en/szolgaltatasok/objektumorzes".
  - Add "Data protection officer contact: dpo@afm.hu", "Security reports: security@afm.hu (see https://www.afm.hu/.well-known/security.txt)" and the two disclosure URLs.
  - Convert list items to `- [HU homepage](https://www.afm.hu/hu)`.
- Status: NEW
- Confidence: high

### AIGEO-011 — llms files use governance meta-language instead of quotable facts; one 24/7 line lacks its qualifier
- Severity: P3
- Category: GEO quality / claim wording
- Where: `public/llms.txt:53-54`; `public/llms-full.txt:69`, `:77`, `:78-82`
- Evidence: "30+ active sites and 200+ staff background are approved claims when used carefully." / "Dun & Bradstreet AA High Creditworthy 2026 is approved as a creditworthiness claim." / llms-full "- 24/7 diszpécseri háttér / dispatcher background." / "- next-business-day contact follow-up wording for contact and quote requests…" / "Licence numbers, insurance details and registry identifiers belong in the legal pages … not as AI-search marketing claims", while the same file lists the registration, tax and VAT numbers as "Verified company facts".
- Problem: Answer engines can quote internal approval jargon verbatim ("approved claims when used carefully"). The registry-identifier sentence contradicts the file's own fact list. Without the qualifier, the 24/7 line reads as broader than llms.txt.
- Fix:
  - "- Avenir works across 30+ active sites with a 200+ staff background."
  - "- Creditworthiness: D&B AA High Creditworthy 2026."
  - "- 24/7 dispatcher background may support agreed service processes."
  - "- Contact and quote requests: Avenir gets in touch by the next business day; quote preparation time depends on scope and complexity."
  - Narrow l.78 to "Licence numbers other than the guarding licence and insurance details belong in the legal pages".
- Status: KNOWN partly (HUA-006 for the 24/7 line); the rest NEW
- Confidence: high

### AIGEO-012 — LocalBusiness node duplicates the company and points to it as its own `parentOrganization`
- Severity: P3
- Category: schema / entity graph
- Where: all pages; `lib/homepage-schema.ts:75-92`
- Evidence: `"@type":"LocalBusiness","@id":"https://www.afm.hu/#localbusiness","parentOrganization":{"@id":"https://www.afm.hu/#organization"},"name":"Avenir Facility Management Kft."` with the same address, phone and credentials as the Organization.
- Problem: The graph models one legal entity as a parent and a separate "local business" child at the registered seat. That is semantically wrong (no branch exists), splits `knowsAbout` and `areaServed` away from the main entity, and gives knowledge graphs two competing nodes.
- Fix: merge into one node with `"@type": ["Organization", "LocalBusiness"]` and `@id .../#organization`, moving `knowsAbout`, `areaServed`, `telephone` and `email` there. Alternatively drop LocalBusiness entirely, since the seat is not a customer-facing site. Do not re-add 24/7 `openingHoursSpecification`.
- Status: NEW
- Confidence: medium

### AIGEO-013 — Service ItemList has no URLs, is emitted on every page, and on DE/ZH carries the old over-scoped card copy
- Severity: P3
- Category: schema
- Where: `ItemList` on all 76 pages; `lib/homepage-schema.ts:93-104`, `app/[locale]/layout.tsx:183-189`
- Evidence: Items are `{"@type":"Service","position":1,"name":"Élőerős objektumőrzés","description":"…","provider":{…}}` with no `url`. Old copy: DE "Planung, Installation und Wartung von Videoüberwachungs-, Zutrittskontroll- und Alarmanlagen…", "Personen- und Sachschutz…"; ZH "视频监控、门禁和报警系统的设计、安装与维护…".
- Problem: The ItemList never links the 8 services to their canonical pages, which is the main GEO value of the list. It also repeats on legal pages and articles. On DE/ZH, schema propagates the installation/maintenance and personal-protection claims that are already flagged on the visible cards.
- Fix:
  - Add `url: ${SEO_DATA.url}/${locale}/szolgaltatasok/${slug}` for indexable locales, plus `@id` = the service page `#service`.
  - Emit the ItemList only on the homepage.
  - DE/ZH copy: apply the KNOWN fixes.
- Status: KNOWN partly (EDU-003, EDU-004, EDU-007, FKZ-004, EDU-017 for DE/ZH copy and names); URL and placement NEW
- Confidence: high

### AIGEO-014 — ISO certificates modelled as EducationalOccupationalCredential with the certification body in `recognizedBy`; issuer metadata not distinguishable
- Severity: P3
- Category: schema / claim-proof
- Where: `#credential-iso-9001`, `#credential-iso-27001` on all pages; `lib/homepage-schema.ts:116-163`; `scripts/seed.ts:336-338, 409-412`
- Evidence:
  - MCert node: `"recognizedBy":{"@type":"Organization","name":"MCert Rendszertanúsító Kft.","url":"https://www.rendszertanusitas.hu"}`. The MartonCert node has the identical URL.
  - Both nodes have `"Akkreditáció","value":"NAH · NAH-4-0047/2023"` and `"IAF MLA-tag","value":"true"`.
  - FR/KO descriptions drop the issuer: "a été audité par l’organisme émetteur indiqué sur le certificat".
- Problem:
  - `EducationalOccupationalCredential` is meant for personal and educational credentials.
  - `recognizedBy` means the recognising or accrediting body (here NAH), not the issuer.
  - Two differently named issuers share one URL and accreditation number, which is unverified (see HUB-030).
  - The "IAF MLA member" property is attributed to the certificate.
- Fix:
  - Use schema.org `Certification` (`issuedBy` = certification body, `certificationIdentification` = 843579099 / 988960032, `validFrom`, `expires`, `url` = PDF), referenced through `Organization.hasCertification`.
  - Keep the accreditation number only after per-body NAH verification.
  - Drop the boolean "IAF MLA member" property, or rephrase it as accreditation-body context.
  - Name the issuer in the FR/KO descriptions as in HU/EN.
- Status: KNOWN partly (HUB-030, HUA-026, EDU-041, FKZ-015); the type/property semantics and shared issuer URL are NEW
- Confidence: medium

### AIGEO-015 — The same `@id` carries locale-specific free-text values; ContactPoint languages are names, not codes; no DPO/security ContactPoint
- Severity: P3
- Category: schema / entity consistency
- Where: `#organization` and `#localbusiness` across locales; `lib/schema-locale-copy.ts`
- Evidence: HU `"contactType":"ügyfélszolgálat","availableLanguage":["magyar","angol"]`; EN `"customer service",["Hungarian","English"]`; KO `"고객 서비스",["헝가리어","영어"]`. The description also differs per locale under the same `@id`.
- Problem: Consumers that merge nodes by `@id` across pages get 6 conflicting values for one entity. The public DPO and security contacts are not machine-readable in the entity.
- Fix:
  - `availableLanguage: ["hu","en"]` (BCP 47) and a stable `contactType: "customer service"` on all locales.
  - Add `{"@type":"ContactPoint","contactType":"data protection officer","email":"dpo@afm.hu"}` and `{"@type":"ContactPoint","contactType":"security","email":"security@afm.hu","url":"https://www.afm.hu/en/responsible-disclosure"}`. Both contacts are approved public items.
- Status: NEW
- Confidence: medium

### AIGEO-016 — `knowsAbout` overstates the FM scope and drifts from approved 24/7 wording
- Severity: P3
- Category: claim/proof (schema)
- Where: `lib/schema-locale-copy.ts` knowsAbout (LocalBusiness on all pages)
- Evidence: HU "Integrált létesítményüzemeltetés", "Technikai vagyonvédelem", "Mystery Shopping audit"; EN "Integrated facility management", "24/7 dispatcher support"; FR "Permanence de dispatching 24 h/24 et 7 j/7". llms-full describes "selected facility management services"; `verified_claims.md` approves "24/7 diszpécseri háttér".
- Problem: "Integrated facility management" is an industry term for full outsourced FM, broader than the Hard FM / Soft FM "kapcsolódó FM-támogatás" stated on the page. "Support" and "permanence" are stronger than the approved "background".
- Fix: knowsAbout = the 8 canonical service names. HU: "Élőerős objektumőrzés", "Recepciós és portaszolgálat", "Biztonságtechnika", "Távfelügyelet és vonulószolgálat", "Próbavásárlás és szolgáltatásaudit", "Rendezvénybiztosítás", "Hard FM", "Soft FM". Add "24/7 diszpécseri háttér" / "24/7 dispatcher background" / FR "Appui de dispatching 24 h/24 et 7 j/7".
- Status: KNOWN partly (HUA-006, HUA-021); the IFM overstatement is NEW
- Confidence: medium

### AIGEO-017 — Breadcrumb level 2 points to a fragment URL
- Severity: P3
- Category: schema
- Where: all 48 service-page BreadcrumbLists; `app/[locale]/szolgaltatasok/[slug]/page.tsx:199-204`
- Evidence: `{"position":2,"name":"Szolgáltatások","item":"https://www.afm.hu/hu#services"}`
- Problem: Search engines drop the `#services` fragment, so the item resolves to the homepage, which duplicates position 1 ("Főoldal" → https://www.afm.hu/hu).
- Fix: until a real services index URL exists, emit a 2-level schema breadcrumb (Főoldal → service). The visible breadcrumb can keep its anchor link.
- Status: NEW
- Confidence: medium

### AIGEO-018 — Responsible-disclosure pages are indexable with hreflang but excluded from the sitemap and llms URL lists
- Severity: P3
- Category: SEO-indexing consistency
- Where: https://www.afm.hu/hu/felelos-hibabejelentes, https://www.afm.hu/en/responsible-disclosure; `lib/public-sitemap.ts` (no disclosure entries)
- Evidence: Robots "index, follow, max-video-preview:-1…", with hreflang hu/en/x-default; `sitemap: false` for both in `index.json`.
- Problem: The pages are public, approved and referenced as the `Policy` URL in security.txt, yet they sit outside the sitemap and llms files while being indexable. The signals are inconsistent.
- Fix: add both URLs to `buildPublicSitemap` (yearly, priority 0.2, with hu/en alternates) and to the llms files (see AIGEO-010). Alternatively, make a deliberate noindex decision.
- Status: NEW
- Confidence: high

### AIGEO-019 — Apex domain redirects with 307 (temporary) instead of a permanent redirect
- Severity: P3
- Category: SEO / entity host consolidation
- Where: https://afm.hu/
- Evidence: `curl -D -`: "HTTP/1.1 307 Temporary Redirect / Location: https://www.afm.hu/". By contrast, `http://www.afm.hu/` → 308 and `https://www.afm.hu/` → 308 `/hu`.
- Problem: A temporary redirect on the bare domain is a weaker canonical-host signal for crawlers and link consolidation.
- Fix: in Vercel → Domains, set `afm.hu` to redirect to `www.afm.hu` with 308 (permanent).
- Status: NEW
- Confidence: high

### AIGEO-020 — EN Legal Notice meta description has a double period; the EN WebPage description uses the Hungarian address format
- Severity: P3
- Category: metadata / grammar
- Where: https://www.afm.hu/en/impresszum; `app/[locale]/impresszum/page.tsx:44`
- Evidence: META: "Avenir Facility Management Kft.. Registered office: Királyok útja 291, Building B, Door 15, 1039 Budapest." The WebPage schema description reads "… — Királyok útja 291. B. ép. 15. ajtó, 1039 Budapest."
- Problem: The snippet text that AI engines and SERPs show contains a typo, and the address format is inconsistent within the same page.
- Fix: change `${SEO_DATA.legalNameShort}. Registered office:` to `${SEO_DATA.legalNameShort} — Registered office:`. Use "Királyok útja 291, building B, door 15, 1039 Budapest, Hungary" (the `proof_catalog` EN wording) in the EN WebPage description.
- Status: NEW
- Confidence: high

### AIGEO-021 — Unused `SEO_FAQS_HU` constant holds unapproved claims, ready to be wired into FAQPage
- Severity: P3
- Category: claim/proof (latent)
- Where: `lib/seo-data.ts:80-103` (no references in `app/`, `components/`, `lib/`)
- Evidence: "200+ szakképzett munkatársat foglalkoztat — biztonsági őröket, takarítókat, épületüzemeltetési mérnököket és recepciósokat"; "Az Avenir ügyfélkörébe irodaházak, bevásárlóközpontok, ipari és logisztikai parkok, valamint közintézmények tartoznak."; "Munkaidőben többnyire még aznap visszajelzünk".
- Problem: The comment labels it "FAQs used in FAQPage JSON-LD". Reactivating it would publish an unverified client-type claim ("közintézmények") and wording outside `verified_claims.md`.
- Fix: delete the constant, or rewrite it from approved claims only before any reuse.
- Status: KNOWN partly (HUA-019, HUA-020 cite `SEO_FAQS_HU`); the "közintézmények" client claim is NEW
- Confidence: high

### AIGEO-022 — robots.txt has no explicit decision for training-only AI crawlers
- Severity: P3
- Category: robots / AI policy
- Where: https://www.afm.hu/robots.txt; `app/robots.ts:17-26`
- Evidence: Explicit groups exist only for OAI-SearchBot, ChatGPT-User, GPTBot, Claude-SearchBot, Claude-User, ClaudeBot, PerplexityBot and Perplexity-User. Google-Extended, Applebot-Extended, CCBot, Bytespider, meta-externalagent and others fall under `User-Agent: * / Allow: /`.
- Problem: Functionally all of these are allowed, which is consistent with the SEO/AI-first principle, so this is not a defect. The policy for pure training scrapers (CCBot, Bytespider) is implicit, not decided.
- Fix: owner decision. Either keep `*` (no change) and record the decision in `docs/`, or add explicit groups (allow Google-Extended and Applebot-Extended; allow or disallow CCBot and Bytespider), each with the same `/admin` and `/api` disallows.
- Status: KNOWN (June audit P2-02, downgraded: no functional gap)
- Confidence: high

### AIGEO-023 — security.txt lists only the EN policy, although `Preferred-Languages: hu, en`
- Severity: P3
- Category: security.txt completeness
- Where: https://www.afm.hu/.well-known/security.txt
- Evidence: "Preferred-Languages: hu, en" / "Policy: https://www.afm.hu/en/responsible-disclosure" / "Expires: 2027-06-10T00:00:00.000Z"
- Problem: The HU policy page exists, but security.txt does not reference it. Expires is valid (under one year ahead, matching `proof_catalog`).
- Fix: add a second line, "Policy: https://www.afm.hu/hu/felelos-hibabejelentes". Keep the annual Expires refresh before 2027-06-10 (PL-090).
- Status: NEW
- Confidence: medium (RFC 9116 permits repeated fields)

### AIGEO-024 — Thin citable knowledge surface: one news item, no homepage FAQ, no FAQ corpus in llms-full
- Severity: P3
- Category: GEO / AI-citation readiness (content gap)
- Where: https://www.afm.hu/hu/hirek ("Hírek és tudásanyag"), homepage, `public/llms-full.txt`
- Evidence: `/hu/hirek` lists one article, "Megújult az Avenir weboldala és arculata". The homepage has no FAQ block, and "Rólunk" is only an anchor. The 428 service FAQ answers exist only in schema and on the service pages; llms-full has no FAQ section.
- Problem: Procurement-style questions (e.g. "how does a security guarding contract start in Hungary", "what is the difference between remote monitoring and response service") are answered only deep inside service-page accordions. There are no standalone knowledge articles or llms FAQ excerpts for answer engines to cite.
- Fix:
  - Add a short "Gyakori kérdések" section to llms-full: 2-3 approved Q&A per service, taken verbatim from the HU/EN FAQs.
  - Proceed with the HU tudástár articles (AGENTS priority 4).
  - Optionally add a 4-5 question HU/EN homepage FAQ built from approved claims only, with FAQPage schema.
- Status: KNOWN (June audit P3-03; roadmap item)
- Confidence: high

## Verified OK
- JSON-LD on all 76 pages parses: 636 nodes, 0 parse errors. `components/JsonLd.tsx` escapes `<`, `>`, `&`, U+2028 and U+2029, so CMS text cannot break out of the script tag.
- llms.txt and llms-full.txt are identical to the repo, served `text/plain; charset=utf-8`, and dated "Last updated: 2026-10-17". Every listed URL returns the stated status and indexability:
  - HU/EN homepages, Trust Centers, 8 HU services, 8 legal and 4 news URLs: 200, index, in sitemap;
  - DE/FR/KO/ZH homepages: 200 noindex;
  - DE news: 200 noindex;
  - FR legal/news/trust/recruitment/disclosure, KO news, ZH impresszum, DE recruitment/trust/disclosure: 404, as the llms files say ("do not infer");
  - legacy `/hu|en/szolgaltatasok/security`: 404.
- The llms locale policy matches the live state: HU/EN indexed; DE/FR/KO/ZH homepages plus 8 service pages each are 200 noindex, outside the sitemap and hreflang. (The QA smoke matrix expecting ZH/KO service 404 is stale relative to the brief's policy, not the llms files.)
- No stale response-time wording: June F-003 "2-working-day" is gone, and no "2 munkanap / 2 working days / 48 / 24 órán belül" appears on any locale page or llms file. No SLA or guarantee claim (guarantees appear only as negations). EcoVadis appears only as a "do not infer" exclusion.
- ISO facts match `verified_claims.md` and `proof_catalog.md` everywhere (llms, schema, homepage cards, Trust Center): MSZ EN ISO 9001:2015 / 843579099 / MartonCert / 2026-03-19 → 2029-03-18, and MSZ ISO/IEC 27001:2023 / 988960032 / MCert / 2026-04-27 → 2029-04-26. Both PDFs return 200 `application/pdf`. No "ISO/IEC 27001:2022" or "MARTON Szakértő Iroda" appears live.
- Licences, D&B and numbers:
  - Guarding licence 01030-822/4926-7/2023 is identical in llms and the impresszum. No other licence numbers are in the llms files or schema, and no licence appears in `hasCredential`.
  - D&B wording follows the approved forms: HU "D&B magas hitelképességi minősítés", EN "D&B High Creditworthy 2026", llms "Dun & Bradstreet AA High Creditworthy 2026".
  - 30+ sites and 200+ staff are approved numbers ("Szakképzett" is KNOWN HUA-020).
- Private investigation never appears in schema, contact options or service routes. It appears only in legal pages, the Trust Center regulated-activity summary and the Mystery Shopping differentiation FAQ.
- Entity data is identical across schema, footer, impresszum, Trust Center and llms:
  - legal name, short name "Avenir Facility Kft." and seat "1039 Budapest, Királyok útja 291. B. ép. 15. ajtó";
  - registration 01-09-328046, tax 26395124-2-41, VAT HU26395124, founding 2018-07-31;
  - phone +36 70 316 8218, info@afm.hu, dpo@afm.hu (legal pages), security@afm.hu (disclosure pages, security.txt);
  - `sameAs` contains only the approved LinkedIn URL, which the footer also links.
- The previous production's 24/7 `openingHoursSpecification` ("24/7 diszpécseri készenlét") and the HU-page English `serviceType` are gone from live schema. ENB-027, HUB-031 and HUA-041 are resolved in production.
- Service schema on all 48 pages: `url` = canonical, `name` = H1, `description` = meta description (48/48), and `provider` resolves to `#organization` on the same page.
- BreadcrumbList on every page: the last item equals the canonical, and names are localized and match the visible breadcrumb.
- FAQPage only on service pages that render a FAQ. All schema questions are present in visible `<details>`, answers are in the server HTML, and no visible FAQ question is missing from the schema.
- Article on the news detail pages: headline = H1, description visible, `inLanguage` correct.
- No schema on HU/EN indexable pages references noindex or legacy URLs, apart from AIGEO-003 `inLanguage`.
- robots.txt is production-only allow (`app/robots.ts` returns `Disallow: /` off production). `/admin` and `/api` are disallowed in every group, the sitemap is referenced, and 8 AI search and user agents are explicitly allowed. Public assets (`/uploads/logo.svg`, `/hu/opengraph-image`, `/certifications/*.pdf`) are not blocked.
- security.txt returns 200 `text/plain` with Contact security@/dpo@/info@, Canonical, and a Policy URL that returns 200. `Expires 2027-06-10` is under one year ahead and matches `proof_catalog`. No PGP, Hiring or Acknowledgments fields (as restricted).
