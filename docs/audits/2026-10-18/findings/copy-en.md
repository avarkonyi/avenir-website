# COPY-EN — findings

Coverage: All 17 crawled EN pages read in full from `S\crawl\text_en.md`: home, privacy, Legal Statements (`/en/aszf`), news index, news article, Legal Notice, recruitment privacy, responsible disclosure, 8 service pages and the Trust Center. I also read the shared header and footer, every TITLE / META DESCRIPTION / H1, and the "[UI extras — en]" block (consent banner, placeholders, labels, options, aria-labels, alts, 404). That is about 1,750 text segments. The 71 EN FAQ answers (about 180 sentences) are collapsed in the crawl text, so I read them from the FAQPage JSON-LD in `S\crawl\pages\en__*.json`. Every page was compared line by line with its HU counterpart in `text_hu.md`, using the path mapping in the brief.

I also read:
- the EN JSON-LD string values on all 17 pages (247 distinct strings);
- `lib/i18n/en.ts` (452 lines, including the strings that never render);
- `lib/email-templates/reply.ts` (EN) and `notification.ts` (internal, HU only);
- the EN copy in `components/ServiceQuoteCta.tsx`, `lib/runtime-error-copy.ts`, `lib/not-found-copy.ts`, `lib/locale-accessibility.ts` and `lib/analytics/consent-copy.ts`;
- a quick terminology scan of `S\crawl\llms.txt` and `llms-full.txt`.

Every finding was cross-checked against the 134 ENB/ENS/EDU rows in `text-audit-open-items.csv`, plus related HU rows where EN mirrors a HU issue.

Not covered:
- the live rendering of the service-quote modal states (success and error) and actual email sends;
- CMS/DB strings that do not appear on any crawled page;
- admin.

## Findings

### COPY-EN-001 — Legal-page meta descriptions and WebPage JSON-LD are cut off mid-word at 160 characters
- Severity: P2
- Category: SEO-indexing / copy quality
- Where: https://www.afm.hu/en/adatvedelem, /en/aszf, /en/recruitment-privacy — `<meta name="description">`, `og:description` and WebPage JSON-LD `description`. Source: `app/[locale]/adatvedelem/page.tsx:32,64`, `app/[locale]/aszf/page.tsx:33,65`, `lib/recruitment-privacy-routes.ts:57`, `components/RecruitmentPrivacyPage.tsx:33` (all `intro.slice(0, 160)`).
- Evidence: "…processes the personal data provided through the www.afm.hu website, in particular during the c" / "…and the legal statements published on the websit" / "Its purpose is to give applicants concise, tr"
- Problem: Three indexable EN pages show truncated, broken words in search snippets, social shares and structured data. The HU pages have the same defect ("különösen ", "vo", "a jelen").
- Fix: Write dedicated descriptions of 150 characters or less instead of slicing the intro:
  - Privacy: "How Avenir Facility Management Kft. processes personal data from website contact and quote requests: legal bases, retention, processors and your rights."
  - Legal Statements: "Legal statements for www.afm.hu: website use, the B2B contact and quote-request process, licences, liability, complaints and governing law."
  - Recruitment: "How Avenir Facility Management Kft. processes job applicants' personal data: purposes, legal bases, retention, access and applicant rights."
- Status: NEW
- Confidence: high

### COPY-EN-002 — Legal Notice meta description: double full stop and a third address format
- Severity: P2
- Category: SEO / typography / consistency
- Where: https://www.afm.hu/en/impresszum — meta and og description. Source: `app/[locale]/impresszum/page.tsx:44` (`${SEO_DATA.legalNameShort}. Registered office: …`, where `legalNameShort` already ends in "Kft.").
- Evidence: "Avenir Facility Management Kft.. Registered office: Királyok útja 291, Building B, Door 15, 1039 Budapest. Company registration number: 01-09-328046."
- Problem: The snippet shows "Kft..". It also adds a third spelling of the address ("Building B, Door 15", capitalised) next to "building B, door 15" and "291. B. ép. 15. ajtó" on the same page. This defect came in with the fix for ENB-022 (marked JAVITVA_FORRAS).
- Fix: "Avenir Facility Management Kft. Registered office: Királyok útja 291, building B, door 15, 1039 Budapest, Hungary. Company registration number: 01-09-328046." (do not append "." after `legalNameShort`).
- Status: NEW (introduced by the ENB-022 fix)
- Confidence: high

### COPY-EN-003 — Legal Statements §4 adds "written" to the Hungarian legal condition
- Severity: P2
- Category: legal-consistency / mistranslation
- Where: https://www.afm.hu/en/aszf §4 (`legal.terms.sections[3].body`)
- Evidence: EN "Processing of such data is undertaken only under a separate written agreement, with prior data-protection notice and an appropriate legal basis." / HU "Az ilyen adatok kezelésére kizárólag külön szerződés, előzetes adatvédelmi tájékoztatás és megfelelő jogalap mellett kerülhet sor."
- Problem: The HU text requires a "separate contract", not a written one. The EN adds a form requirement that the lawyer-approved authoritative text does not contain. The owner decision of 2026-10-18 forbids legal additions through translation.
- Fix: "Such data may be processed only under a separate agreement, with prior data-protection information and an appropriate legal basis."
- Status: NEW
- Confidence: high

### COPY-EN-004 — Homepage stat "24/7 Dispatcher availability" is stronger than the approved wording, and the 24/7 term has three EN variants
- Severity: P2
- Category: claim/proof / terminology
- Where:
  - https://www.afm.hu/en stat tile (`en.ts` `stats[3].l`);
  - JSON-LD `knowsAbout` "24/7 dispatcher support" (`lib/schema-locale-copy.ts:16`);
  - service pages "24/7 dispatch support";
  - llms.txt "24/7 dispatcher background".
- Evidence: "24/7 / Dispatcher availability" vs `verified_claims.md` "24/7 diszpécseri háttér" / preferred "24/7 diszpécseri háttérrel támogatható".
- Problem: "Availability" implies standing, guaranteed availability (it mirrors the HU "készenlét", already flagged as a strengthening). The service pages correctly say "can be supported by 24/7 dispatch support". A procurement reader sees three different 24/7 claims.
- Fix: The stat label becomes "24/7 dispatch support". `knowsAbout` becomes "24/7 dispatch support". The llms wording becomes "24/7 dispatch support may back agreed service processes".
- Status: NEW for EN (EN counterpart of HUA-006; FR/KO equivalents are FKZ-001/FKZ-002)
- Confidence: medium

### COPY-EN-005 — "service instructions" is a calque of "szolgálati utasítás"
- Severity: P3
- Category: terminology (security-industry English)
- Where:
  - /en/szolgaltatasok/objektumorzes: body ¶1 ("Avenir prepares service instructions"), process step 4 ("Recording of service instructions and reporting process"), trust item "Documented site onboarding" ("Service instructions are recorded before deployment");
  - /en/szolgaltatasok/portaszolgalat: process step 4 ("Recording of service instructions and reporting framework").
- Evidence: "Following an on-site assessment, Avenir prepares service instructions: it defines the entry and exit points…"
- Problem: UK guarding buyers expect "assignment instructions" (AIs); US readers expect "post orders". "Service instructions" reads as a literal translation and weakens the professional tone. "Service log" is understandable, but "occurrence log" is the more usual UK term.
- Fix: "assignment instructions" throughout (for example "Avenir prepares site assignment instructions: …", "Recording of assignment instructions and reporting process"). Optionally use "occurrence log" for "szolgálati napló".
- Status: NEW
- Confidence: medium

### COPY-EN-006 — Hungarian "Magyarország" in EN Service JSON-LD
- Severity: P3
- Category: schema / Hungarian leak
- Where: All 8 EN service pages, Service JSON-LD `areaServed.name`. Source: `app/[locale]/szolgaltatasok/[slug]/page.tsx:229` (hard-coded).
- Evidence: `"areaServed": { "@type": "Country", "name": "Magyarország" }` (the Organization schema on the same pages says "Hungary")
- Problem: Hungarian text in English structured data, inconsistent with the Organization `areaServed`.
- Fix: Use the localised `country` value from `lib/schema-locale-copy.ts` ("Hungary" for EN).
- Status: NEW
- Confidence: high

### COPY-EN-007 — JSON-LD `knowsAbout` uses non-canonical service names
- Severity: P3
- Category: terminology / schema
- Where: Every EN page, Organization/LocalBusiness `knowsAbout` (`lib/schema-locale-copy.ts:16`)
- Evidence: "Alarm system monitoring", "Gatehouse services", "Mystery Shopping audit", "Integrated facility management"
- Problem: These differ from the canonical AGENTS.md names used in the nav, H1s and ItemList ("Remote Monitoring and Response Service", "Reception and Gatehouse Services", "Mystery Shopping and Service Audit"). This dilutes entity signals for AI search.
- Fix: `["On-site security guarding", "Reception and gatehouse services", "Security technology", "Remote monitoring and response", "Mystery shopping and service audit", "Event security", "24/7 dispatch support", "Hard FM and Soft FM"]`
- Status: NEW for EN (HU counterpart is HUA-021)
- Confidence: high

### COPY-EN-008 — Tense mismatch in the data-transfer safeguard sentences
- Severity: P3
- Category: grammar
- Where: /en/adatvedelem §6.2; /en/recruitment-privacy §9
- Evidence: "at the time this Policy was prepared, Vercel Inc. appears on the EU-U.S. Data Privacy Framework list" / "at the time of preparing this notice, Microsoft Corporation (USA) is listed under the EU–U.S. Data Privacy Framework"
- Problem: A past-time frame is combined with present tense. This reads as an error in a legal text.
- Fix: "at the time this Policy was prepared, Vercel Inc. was listed on the EU–U.S. Data Privacy Framework list; …" / "at the time this notice was prepared, Microsoft Corporation (USA) was listed under the EU–U.S. Data Privacy Framework; …"
- Status: NEW
- Confidence: high

### COPY-EN-009 — Privacy Policy parity gaps not covered by ENB-039
- Severity: P3
- Category: legal-consistency / calque
- Where: /en/adatvedelem §4.1 (retention where a contract is concluded) and §4.3 (purpose)
- Evidence:
  - EN "Where a contract is concluded: the data necessary for the preparation, performance or enforcement of the contract may be processed…" / HU "Szerződéskötés esetén: az ajánlatkérésből és üzleti levelezésből a szerződés előkészítéséhez … szükséges adatok…";
  - EN "keeping in contact, performance certification, and administration…" / HU "kapcsolattartás, teljesítésigazolás…".
- Problem:
  - §4.1 drops the source of the data ("from the quote request and business correspondence").
  - "performance certification" is not idiomatic English for "teljesítésigazolás".
- Fix:
  - "Where a contract is concluded: the data from the quote request and business correspondence that are necessary for the preparation, performance or enforcement of the contract may be processed…"
  - "…maintaining contact, certification of completed performance, and administration related to invoicing and the enforcement of claims."
- Status: NEW (ENB-039 covers the other calques in the same sections)
- Confidence: high

### COPY-EN-010 — "The Controller's Representative" carries a specific GDPR meaning
- Severity: P3
- Category: legal terminology
- Where: /en/adatvedelem §2 ("2. The Controller's Representative" / "Representative: Attila Kovács, Managing Director"); /en/impresszum "2. Representative"
- Evidence: "Representative: Attila Kovács, Managing Director"
- Problem: In English GDPR usage, "representative" (Art. 4(17)/Art. 27) means the EU representative of a non-EU controller. Here it means the managing director as the company's legal representative. This is a translation clarification, not a change to the HU substance.
- Fix: "2. Legal Representative of the Controller" / "Legal representative: Attila Kovács, Managing Director"
- Status: NEW (EN analogue of DEB-022)
- Confidence: medium

### COPY-EN-011 — Legal Notice: wrong "Issued by" label for supervisory bodies, "Position" label with a name, Hungarian "Pf." in EN
- Severity: P3
- Category: legal-consistency / Hungarian leak / formatting
- Where: /en/impresszum §2, §7 a)–c)
- Evidence:
  - "a) Supervision of Security Activities / Issued by / 3rd District Police Station…";
  - "c) Data Protection Supervision / Issued by / National Authority for Data Protection and Freedom of Information (NAIH)";
  - "Position / Attila Kovács, Managing Director";
  - "Postal address / 1391 Budapest, 62. Pf. 217" and "1363 Budapest, Pf.: 9" (the Privacy Policy writes "P.O. Box 9, 1363 Budapest");
  - "+36 (1) 391-1400" vs "+36 1 391 1400".
- Problem:
  - A supervisory authority does not "issue" anything here; the licence label is being reused.
  - The value under "Position" is a name plus a position.
  - The Hungarian postal abbreviation "Pf." is unclear to EN readers and does not match the Privacy Policy.
  - Phone formats differ between pages.
- Fix:
  - Use the label "Authority" in §7.
  - Use "Name and position".
  - Postal addresses: "P.O. Box 217, 1391 Budapest 62, Hungary" and "P.O. Box 9, 1363 Budapest, Hungary".
  - Use one phone format: "+36 1 391 1400".
- Status: KNOWN for the HU source (HUB-017, HUB-042, HUB-043); the EN instances and "Pf." are NEW
- Confidence: high

### COPY-EN-012 — News article calque "information point"
- Severity: P3
- Category: idiom
- Where: /en/hirek/megujult-az-avenir-weboldala-es-arculata, last paragraph
- Evidence: "Our goal is for the website to serve not only as a company introduction, but also as a reliable and up-to-date information point for clients and partners."
- Problem: "Information point" is a literal rendering of "információs pont" and sounds like a kiosk.
- Fix: "…but also as a reliable, up-to-date source of information for clients and partners."
- Status: NEW
- Confidence: high

### COPY-EN-013 — Weak or overlong EN titles and meta descriptions (indexable pages)
- Severity: P3
- Category: SEO
- Where and evidence:
  - Article TITLE (84 characters): "Avenir Launches Renewed Website and Brand Identity - Avenir Facility Management Kft." It will be truncated in search results.
  - /en/szolgaltatasok/rendezvenybiztositas TITLE (23 characters): "Event Security | Avenir". It has no qualifier, unlike its siblings.
  - Homepage TITLE: "Avenir Facility Management Kft. — Security and FM". It leads with "Kft.", uses the abbreviation "FM" and contains no "security guarding / facility management / Hungary" keyword.
  - Remote monitoring META: "Handling of alarm signals, escalation, event recording and response-service process aligned with security technology and guarding." It lacks the keyword "remote monitoring" and the article "a".
  - Reception META: "Gatehouse service with access control…". The word "reception" is missing.
- Problem: These titles and descriptions lose keyword relevance and click-through for an international procurement search.
- Fix:
  - Article: "Avenir Launches Renewed Website and Brand Identity | Avenir" (59 characters).
  - Event Security: "Event Security for Corporate and Public Events | Avenir".
  - Homepage: "Security Guarding and Facility Management in Hungary | Avenir".
  - Remote monitoring META: "Remote monitoring of alarm and CCTV signals with verification, escalation, event logging and a response-service process aligned with guarding."
  - Reception META: "Reception and gatehouse services with visitor handling, access control, key management and a logged daily process for offices and corporate sites."
- Status: NEW (the title-format inconsistency itself is ENS-019 and EDU-023)
- Confidence: medium

### COPY-EN-014 — 404 page reuses the homepage title and carries `index, follow`
- Severity: P3
- Category: SEO / UX
- Where: EN 404 (lang=en), HTTP 404, per the "[UI extras — en]" block. HU shows the same pattern.
- Evidence: "TITLE: Avenir Facility Management Kft. — Security and FM", "robots=index, follow, max-video-preview:-1…"
- Problem: The browser tab and bookmarks show the homepage title on an error page. The robots meta does not match the "noindex" that HUA-040 records as verified in the build. HTTP 404 still prevents indexing.
- Fix: Set the title to "Page not found — Avenir Facility Management Kft." and `robots: noindex` in `app/not-found.tsx` metadata.
- Status: NEW (possible regression of the HUA-040 verification)
- Confidence: medium

### COPY-EN-015 — Hidden en.ts strings contradict live copy (fallback risk)
- Severity: P3
- Category: correctness (latent) / claim
- Where: `lib/i18n/en.ts:208-287` (`legal.privacy` v1.0, used only as the fallback in `lib/legal-content.ts:25`); `en.ts:108-116` (`refTitle`, `refSub`, `refText`, `refs`).
- Evidence:
  - "In its current operation, the https://www.afm.hu website does not use any analytics, marketing, retargeting or profiling cookies.";
  - "Right to withdraw consent (Art. 7(3)): as the Controller does not rely on consent … this right does not apply here.";
  - "Partners" / "Selected collaborations" / "Public Institutions".
- Problem:
  - If `CURRENT_PRIVACY_CONTENT.en` is ever missing, EN would publish a privacy policy that contradicts live GA4 v1.3.
  - The latent references block makes partner and sector claims ("Public Institutions") that are not in `verified_claims.md`.
- Fix: Replace the en.ts `legal.privacy` fallback with the v1.3 content, or remove it. Delete the unused `ref*` keys, or align them with "References" / "Approved client references" and drop "Public Institutions".
- Status: NEW (HU counterpart of the ref* part is HUA-039)
- Confidence: high

### COPY-EN-016 — llms.txt / llms-full.txt: "background" calques and internal release notes in a public file
- Severity: P3
- Category: idiom / GEO
- Where: https://www.afm.hu/llms.txt and /llms-full.txt (lines 41, 70, 75, 124)
- Evidence: "24/7 dispatcher background may support agreed service processes." / "200+ staff background" / "This source summary does not confirm that these changes have been deployed to production." / "Review support does not confirm deployment."
- Problem:
  - "Background" renders the Hungarian "háttér"; in English it means history or experience.
  - The deployment caveats are internal QA notes; on the live production file they confuse AI readers.
- Fix:
  - "24/7 dispatch support may back agreed service processes."
  - "a team of 200+ staff".
  - Remove the deployment-confirmation sentences.
- Status: KNOWN in part (HUA-006 lists the llms-full "dispatcher background"); the rest is NEW. Likely overlaps with the SEO/GEO area.
- Confidence: high

### COPY-EN-017 — Generic phrasing where HU is concrete
- Severity: P3
- Category: copy rules (vague filler)
- Where:
  - Homepage services eyebrow;
  - /en/szolgaltatasok/objektumorzes lead.
- Evidence: "INTEGRATED SOLUTIONS FROM A SINGLE SOURCE" (HU "KOMPLEX MŰKÖDÉS EGY KÉZBŐL"); "We provide tailored on-site security guarding for premises…" (HU "Helyszínre szabott objektumőrzéssel…")
- Problem: "Integrated solutions" and a bare "tailored" are the generic filler AGENTS.md asks to avoid. The EN also drops the concrete "site-".
- Fix: "ONE COORDINATED OPERATION, ONE CONTRACT"; "We provide site-specific on-site security guarding for business premises, office buildings, logistics and industrial sites…"
- Status: NEW (HU counterpart of the eyebrow is HUA-037)
- Confidence: medium

### COPY-EN-018 — Redundant "Best fit" item on the Mystery Shopping page
- Severity: P3
- Category: style
- Where: /en/szolgaltatasok/mystery-shopping-helyszini-audit, "Best fit" list
- Evidence: "Test journey in taxi, passenger-transport or transportation services"
- Problem: "Passenger-transport" and "transportation" overlap, and the hyphen is unnecessary.
- Fix: "Test journeys in taxi, passenger transport and other transport services"
- Status: NEW
- Confidence: high

### COPY-EN-019 — Contact-form microcopy
- Severity: P3
- Category: idiom / tone
- Where: Homepage contact form (`en.ts` `form.message`, `form.nextStepHelper`; the same text is in `ServiceQuoteCta.tsx:81`)
- Evidence: "Message / Requirements"; "…and in any case we'll be in touch by the next business day."
- Problem: The slash label is a calque of "Üzenet / Igény leírása". The contraction is the only informal register in otherwise formal B2B copy.
- Fix: "Your message or requirements"; "…and in any case we will be in touch by the next business day."
- Status: NEW (HU counterparts are HUA-033 and HUA-019)
- Confidence: medium

### COPY-EN-020 — ISO 9001 card presents a translated scope as a verbatim quote, and ISO 27001 naming varies
- Severity: P3
- Category: claim/proof precision
- Where:
  - Homepage certification cards, aria-labels and JSON-LD `description`/`alternateName`;
  - /en/trust-center.
- Evidence: 'The certificate scope is listed as "Comprehensive security services".' (HU certificate scope: "Teljes körű biztonsági szolgáltatás", singular). Card titles "ISO 27001 Information Security Management System Certification" vs the Trust Center "MSZ ISO/IEC 27001:2023" / "ISO/IEC 27001 certificate".
- Problem:
  - The certificate wording is Hungarian, so the quote marks imply verbatim certificate text that does not exist in English, and the number (plural) changes.
  - The standard is called "ISO 27001" on the homepage and "ISO/IEC 27001" on the Trust Center.
- Fix:
  - 'The scope stated on the certificate is "Teljes körű biztonsági szolgáltatás" (comprehensive security service).'
  - Use "ISO/IEC 27001" in card titles and aria-labels.
- Status: NEW (HU quote-style counterpart is HUA-025)
- Confidence: medium

### COPY-EN-021 — Further modality strengthening ("may/can" → fact)
- Severity: P2
- Category: mistranslation / claim
- Where:
  - /en/szolgaltatasok/hard-fm, trust item "Priority-based reactive fault handling";
  - /en/szolgaltatasok/portaszolgalat FAQ "Can supplier and courier traffic be handled?".
- Evidence: EN "Reactive jobs are classified by agreed priority categories at mobilisation…" / HU "…prioritási kategóriák szerint kezelhetők…"; EN "Avenir defines what information must be recorded, who must be notified…" / HU "Meghatározható, milyen adatokat kell rögzíteni…"
- Problem: These are the same pattern as the known rows (an HU possibility rendered as an EN commitment) but are not listed there.
- Fix: "Reactive jobs can be classified by priority categories agreed at mobilisation, so…"; "We can define what information must be recorded, who must be notified and how entries and exits are logged."
- Status: NEW instances of the KNOWN pattern ENS-006 / ENS-007 / ENS-008 / ENS-060
- Confidence: high

---

### Known items confirmed still live on production (grouped)

### COPY-EN-K01 — Remote Monitoring 24/7 claims stronger than approved
- Severity: P1
- Category: claim/proof
- Where: /en/szolgaltatasok/tavfelugyelet-vonuloszolgalat — lead; trust item 1; included item 1; best-fit item 3
- Evidence: "Avenir operates 24/7 monitoring of intrusion, alarm and CCTV signals from connected sites, with every alarm checked before escalation and every action logged." / "Avenir operates 24/7 signal reception for connected sites…"
- Problem: Continuous 24/7 monitoring-centre operation is claimed, whereas the approved wording is "24/7 diszpécseri háttér". This still needs a business decision.
- Fix: As proposed in ENS-001 / ENS-004, for example "Avenir handles intrusion, alarm and CCTV signals from connected sites with 24/7 dispatch support; each alarm goes through an agreed verification step before escalation and actions are recorded in the event log."
- Status: KNOWN (ENS-001, ENS-004)
- Confidence: high

### COPY-EN-K02 — Visitor-data handling stated as fact
- Severity: P1
- Category: claim (data protection)
- Where: /en/szolgaltatasok/portaszolgalat trust item 5 and body ¶2
- Evidence: "Visitor-data handling / Visitor and access data are handled with purpose limitation, time-limited retention and appropriate information provision."
- Problem: The HU says these considerations "must be taken into account". The EN turns that into an implemented data-protection practice.
- Fix: As proposed in ENS-002 / ENS-013, for example "Visitor-data considerations / Purpose limitation, information to data subjects and time-limited retention must be taken into account when handling visitor and access data."
- Status: KNOWN (ENS-002, ENS-013)
- Confidence: high

### COPY-EN-K03 — Soft FM invents a "first month" time frame
- Severity: P1
- Category: claim
- Where: /en/szolgaltatasok/soft-fm process step 5
- Evidence: "During the first month, Avenir tracks early issues…" (HU "Az első működési időszakban")
- Problem: An unverified one-month commitment is introduced where the HU names no period.
- Fix: "During the initial operating period, Avenir tracks early issues…"
- Status: KNOWN (ENS-003)
- Confidence: high

### COPY-EN-K04 — Expired national-security registry review date shown as current
- Severity: P1
- Category: legal-consistency / factual
- Where: /en/aszf §5 d); /en/impresszum §6 d)
- Evidence: "review required by 30 June 2026" / "Validity / review by: 2026-06-30"
- Problem: The date has passed. The owner states that a new decision is valid to 2029, but its exact number and date have not been supplied.
- Fix: Update with the new decision's data in HU first, then mirror it in EN.
- Status: KNOWN (ENB-008; DEB-018)
- Confidence: high

### COPY-EN-K05 — Legal Statements §8 third-party list omits GA4
- Severity: P2
- Category: legal-consistency
- Where: /en/aszf §8
- Evidence: The list contains only "Hosting: Vercel Inc. / Email delivery: Plus Five Five, Inc. ("Resend") / Database: Neon, LLC…", while Privacy §6.4 lists Google Analytics 4. The recruitment notice names Microsoft 365, which the Privacy Policy omits.
- Problem: The third-party lists in the legal pages do not match each other.
- Fix: Resolve in HU first, per ENB-010 / ENB-011.
- Status: KNOWN (ENB-010, ENB-011)
- Confidence: high

### COPY-EN-K06 — Company-data labels and address formats vary across EN pages
- Severity: P2
- Category: terminology / consistency
- Where: Privacy §1, Legal Notice §1/§4, Trust Center, footer
- Evidence:
  - Labels: "Registered seat:" (Trust Center) vs "Registered office:"; "Tax number" vs "Tax ID"; "Company court" vs "Registry court".
  - Addresses: "1039 Budapest, Királyok útja 291. B. ép. 15. ajtó" (footer, Legal Notice) vs "Királyok útja 291, building B, door 15, 1039 Budapest, Hungary" vs "1039 Budapest, Királyok útja 291, building B, door 15, Hungary" (Trust Center).
- Problem: The same company data appears under different labels and in different address formats from page to page.
- Fix: Use one label set and one EN address format everywhere, per ENB-017 / ENB-036.
- Status: KNOWN (ENB-017, ENB-036, ENS-066, EDU-042)
- Confidence: high

### COPY-EN-K07 — Trust Center internal jargon and empty phrasing
- Severity: P2
- Category: copy quality
- Where: /en/trust-center
- Evidence: "Additional proof requests" (HU "További dokumentumok kérése"); "Licensed security activity in legal and compliance context."; "AutoWallis Pest may appear as an approved public client reference."
- Problem: Internal proof jargon, sentence fragments without a verb, and a hedging "may appear" on the page where the reference actually appears.
- Fix: "Additional documents on request"; complete sentences (for example "Avenir holds a personal and property security licence; licence details are listed in the Legal Notice."); "AutoWallis Pest is an approved public client reference."
- Status: KNOWN (ENB-019, partially fixed — "Internal legal/proof entity" is now "Legal entity"; ENB-020; ENB-049)
- Confidence: high

### COPY-EN-K08 — Legal Statements §10 "B2B-natured"
- Severity: P2
- Category: grammar
- Where: /en/aszf §10
- Evidence: "B2B-natured comments and complaints regarding the Provider may be submitted…"
- Problem: "B2B-natured" is not an English word formation.
- Fix: "Business (B2B) comments and complaints concerning the Provider may be sent to … The Provider will give a substantive response within 8 business days."
- Status: KNOWN (ENB-021)
- Confidence: high

### COPY-EN-K09 — Mystery Shopping: FAQ question and answer mismatch, rewritten lead, truncated question
- Severity: P2
- Category: mistranslation
- Where: /en/szolgaltatasok/mystery-shopping-helyszini-audit
- Evidence: Q "What does the final report contain?" / A "Yes. Avenir delivers a structured report…"; the lead "A Mystery Shopping and Service Audit shows how agreed service standards…"; "What is the difference from private investigation?"
- Problem: The answer starts "Yes" to an open question, the lead drops HU content, and one FAQ question is truncated.
- Fix: As proposed in ENS-009 / ENS-010 / ENS-053.
- Status: KNOWN (ENS-009, ENS-010, ENS-053)
- Confidence: high

### COPY-EN-K10 — Possibility turned into commitment (listed rows)
- Severity: P2
- Category: claim
- Where: Remote monitoring body and FAQ 4 and 11; Reception FAQ 8; Hard FM trust items 4–5
- Evidence: "False alarms are logged and analysed"; "…are handled only for the agreed monitoring purpose…"; "The service is structured around written service logs…"; "…are recorded and summarised in a monthly operations report"
- Problem: Each HU "can / may" statement is rendered as a fixed EN commitment.
- Fix: Per ENS-006 / ENS-007 / ENS-008 / ENS-060. COPY-EN-021 lists further instances.
- Status: KNOWN (ENS-006, ENS-007, ENS-008, ENS-060)
- Confidence: high

### COPY-EN-K11 — Soft FM omissions and additions
- Severity: P2
- Category: translation drift
- Where: /en/szolgaltatasok/soft-fm — body, included items, best-fit list, meta
- Evidence: "Cleaning task frequencies for offices, common areas, washrooms and kitchenettes"; "…not only after-hours cleaning"; "regular written reporting against agreed quality criteria" (the KPIs are dropped)
- Problem: The EN adds details the HU does not have and drops others, including the KPIs.
- Fix: Per ENS-011 / ENS-012 / ENS-062 / ENS-063 / ENS-064.
- Status: KNOWN (ENS-011, ENS-012, ENS-062, ENS-063, ENS-064)
- Confidence: high

### COPY-EN-K12 — Service-page section headings are calques or marketing jargon
- Severity: P2
- Category: idiom
- Where: All 8 EN service pages
- Evidence: "WHY CLIENTS CHOOSE US / Trust signals"; "PROCESS / How cooperation starts"
- Problem: "Trust signals" is internal marketing/CRO jargon, "Why clients choose us" adds a social-proof claim, and "How cooperation starts" is a literal translation.
- Fix: "Why you can rely on us / Assurance points"; "How we get started".
- Status: KNOWN (ENS-005, ENS-015, ENS-016, EDU-027)
- Confidence: high

### COPY-EN-K13 — Career copy
- Severity: P2
- Category: mistranslation / calque
- Where: Homepage Career section; header nav
- Evidence: "Budapest, regional" (HU "Budapest / országosan"); "We offer stable backing, legal employment, professional onboarding…"; "CAREER"
- Problem: "Regional" mistranslates "nationwide", "stable backing" and "legal employment" are calques, and the nav label is not idiomatic.
- Fix: "Budapest / nationwide"; "We offer a stable employer, formal registered employment, structured onboarding and development opportunities."; "CAREERS".
- Status: KNOWN (EDU-019, EDU-028, ENS-018)
- Confidence: high

### COPY-EN-K14 — Homepage UI copy (listed rows)
- Severity: P3
- Category: idiom / consistency
- Where and evidence:
  - "Approved client references." (intro and aria-label) — EDU-016;
  - "Get a Quote" / "Request a quote" / "Send Request" — EDU-023;
  - "…commercial and office environments", "Avenir does not only provide presence on site: we document…" — EDU-025;
  - "On-site guarding for access, patrol…" — EDU-026;
  - "Company updates, industry notes and selected announcements…" (HU also names "new references") — EDU-029;
  - "Active locations" vs "30+ active sites" — EDU-030;
  - "ISO 9001 — ISO 9001 Quality Management System Certification, Issued by…" — EDU-031;
  - "IAF MLA member: true" in JSON-LD — EDU-041 / HUB-030.
- Problem: Calques, inconsistent CTAs and labels, and the imprecise "IAF MLA member" property.
- Fix: As proposed in the listed rows.
- Status: KNOWN (EDU-016, 023, 025, 026, 029, 030, 031, 041)
- Confidence: high

### COPY-EN-K15 — Mixed British and American conventions
- Severity: P3
- Category: spelling / variety
- Where: Site-wide
- Evidence:
  - The site is predominantly British ("organisation", "authorisation", "licence", "programme", "centres", "defence", "minimisation", "organiser").
  - American outliers: "modernized" (homepage news card, /en/hirek, the article and its meta); "recognized" (both ISO cards and JSON-LD); "responsibly organized" (article ¶3).
  - US date format on the homepage: "March 19, 2026", "April 27, 2026", "MAY 6, 2026", and "Valid until March 18, 2029" in aria-labels. The news index and legal pages use "6 MAY 2026" / "13 June 2026", so the same article date appears in two formats.
  - "Trust Center" sits next to "business centres".
  - `og:locale` is `en_US` on /en while the reply emails use en-GB.
- Problem: Two spelling and date conventions are mixed on the same site, sometimes on the same page.
- Fix: Standardise on British English: "modernised", "recognised", "organised", "19 March 2026", `og:locale` `en_GB`. Decide whether "Trust Center" stays as a fixed product name or becomes "Trust Centre".
- Status: KNOWN (EDU-024, ENB-043); the dual article-date format and `og:locale` evidence is new
- Confidence: high

### COPY-EN-K16 — Legal-page citation and terminology style (all still live)
- Severity: P3
- Category: legal terminology / style
- Where: /en/adatvedelem, /en/aszf, /en/impresszum, /en/recruitment-privacy, /en/responsible-disclosure
- Evidence:
  - Infotv. cited in five forms — ENB-016;
  - decree citation — ENB-030;
  - "special-category data, criminal-offence data" vs "criminal-conviction data" — ENB-032;
  - title case and "|" separator — ENB-033;
  - hyphen vs em dash ("Version 1.3 - …" / "Version 1.1 — …") — ENB-034;
  - ISO dates "valid until 2028-01-31" — ENB-035;
  - "Commission Decision (EU) 2021/914" vs "Commission Implementing Decision" — ENB-037;
  - "Section 6:22" vs "§ 8:1(1)(3)", SzVMt. never expanded — ENB-038;
  - "modify or correct a personal datum", "(blocking)", "providers with a U.S. background", "keeping in contact" — ENB-039;
  - "authority licence" vs "official certificate", "registration no.", "3rd District Police Station" — ENB-040;
  - "Out-of-scope testing", "harm-minimising" — ENB-042;
  - "Parity with Hungarian version 1.2;" — ENB-044;
  - US "Registered office" for US firms — ENB-046;
  - court venue reads as exclusive — ENB-048;
  - "MABISZ asset-protection principles" — ENB-013;
  - EDPB link version — ENB-015;
  - two effective dates — ENB-031.
- Problem: Inconsistent legal citation forms and terminology, plus residual calques.
- Fix: As proposed in each listed row.
- Status: KNOWN (rows as listed)
- Confidence: high

### COPY-EN-K17 — Service-page terminology inconsistencies (all still live)
- Severity: P3
- Category: terminology / style
- Where: EN service pages
- Evidence:
  - ENS-019 (title format);
  - ENS-020 / ENS-021 (capitalisation of service names, "Brand Audit" / "brand audit");
  - ENS-022 ("points-of-contact", "contact point");
  - ENS-023 ("operations log" vs "event log");
  - ENS-025 ("reporting rhythm" / "cadence");
  - ENS-026 ("stand-alone" / "standalone");
  - ENS-027 ("check points");
  - ENS-028 – ENS-030 ("licensing framework", "Security activity licence", "where required");
  - ENS-031 – ENS-047 (calques on Guarding, Reception, Security Technology and Remote Monitoring);
  - ENS-048 – ENS-052 (Mystery Shopping);
  - ENS-054 / ENS-055 (Event Security: "No guaranteed conflict-free outcome can be promised.");
  - ENS-056 – ENS-059 (Hard FM: "building fabric", "Reception", imperative step titles, "supplier");
  - ENS-061 / ENS-065 (Soft FM: "reported through a regular reporting cadence", "Is a guaranteed cleaning quality offered?").
- Problem: Inconsistent service-page terminology, capitalisation and residual calques.
- Fix: As proposed in each listed row.
- Status: KNOWN (rows as listed)
- Confidence: high

## Verified OK
- Canonical EN service names (AGENTS.md) are used consistently in the nav, footer, H1s, homepage cards, related-service cards, form `<option>`s, aria-labels and the JSON-LD ItemList. The `knowsAbout` exception is COPY-EN-007.
- No EcoVadis claim anywhere.
- No GDPR-compliance promise. Data-protection disclaimers are present and faithful: "legal basis and final data-protection decisions remain with the client and its advisers" (Security Technology; Remote Monitoring FAQ 11).
- Private investigation appears only as legal or regulatory fact: privacy scope, Legal Statements §4/§5, Legal Notice §5/§6 and the Trust Center. It is not a form option. The Mystery Shopping FAQ explicitly separates it from private investigation, surveillance, evidence collection and disciplinary action.
- Response-time wording matches the approved next-business-day pattern on the homepage helper, Legal Statements §3 and service process step 1.
  - The old "within 2 business days" (ENB-006) is gone from live.
  - "within 1–3 working days" (ENS-024) is gone; the owner-approved HUA-004 sentence is rendered: "We agree the timing of the on-site visit and basic risk overview together during the initial consultation."
  - The "usually reply the same day" sentence mirrors HU (HUA-019).
- Guarantee disclaimers are faithful to HU: repair time (Hard FM), conflict-free event, cleaning quality, arrival time. The Trust Center states that certificates and licences are not outcome or response-time guarantees.
- Numbers, dates and identifiers match HU on every page: 30+ / 200+ / AA / 24/7; licence numbers 01030-822/4926-7/2023, 4927-3/2018 and 4925-3/2018; AH/37595-14/2024-2; guard ID VS0000850 and PI ID MA2001317; insurer Cg. 01-10-041356 and policy 341633910; certificate numbers 843579099 and 988960032 and their validity dates; privacy retention periods (12 months / 30 days / 5 / 8 years / 72 h); version dates; DPO and NAIH contacts.
- The D&B label matches the approved "D&B High Creditworthy 2026".
- ISO standard and issuer wording follows `verified_claims.md` (MSZ EN ISO 9001:2015 / MartonCert; MSZ ISO/IEC 27001:2023 / MCert). There is no ":2022".
- The consent banner EN matches the owner-approved HUA-001 content, including "or other form content". Privacy §8 and §9 correctly reference the footer "Cookie settings" button and "Reject".
- Earlier leaks are fixed on live:
  - the Hungarian openingHours text "24/7 diszpécseri készenlét" (ENB-027) is absent from EN JSON-LD;
  - "Switch to HU" aria-labels (ENB-045) are now "Change language: Magyar";
  - the "részletei" aria-labels (EDU-014) are gone.
- Every EN page has exactly one H1, `lang=en`, and hu/en/x-default hreflang pairs. Legal pages carry the "authoritative language: Hungarian prevails" clause.
- The EN reply email template (`lib/email-templates/reply.ts`) is neutral and correct (en-GB date format). The fixed signature without a position mirrors HUA-043.
