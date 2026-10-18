# COPY-HU — findings

Coverage: I read all of `S\crawl\text_hu.md`, 17 HU pages: homepage, 8 service pages, adatvedelem, aszf, impresszum, palyazoi-adatkezeles, felelos-hibabejelentes, megfelelosegi-kozpont, hirek, and the one news article. That covers the shared header and footer, every TITLE / META DESCRIPTION / H1, and the whole "[UI extras — hu]" block (consent banner, form labels, placeholders, options, aria-labels, alts and the HU 404 page). That is about 1,580 non-empty text lines, or about 1,900 sentences and fragments including repeated cards (about 1,200 unique). I also read all 71 HU FAQ answers. They are collapsed in the visible text, so I took them from the FAQPage JSON-LD in `S\crawl\pages\hu*.json`. I also read every distinct HU string in the JSON-LD of all 17 pages.

Source files scanned for HU strings that the crawl does not show: `lib/i18n/hu.ts` (all 464 lines, including the dormant `legal.privacy` fallback), `lib/email-templates/reply.ts` and `notification.ts`, `lib/not-found-copy.ts`, `lib/runtime-error-copy.ts`, `components/ServiceQuoteCta.tsx` (the service-page quote modal, which is not open in the crawl), `components/Contact.tsx`, `lib/contact-service-labels.ts`, `lib/analytics/consent-copy.ts`, `lib/locale-accessibility.ts`, `lib/references.ts`, `lib/schema-locale-copy.ts` and the HU parts of `lib/seo-data.ts`. I also ran a diff of the HU strings in `lib/trust-center-content.ts`, `lib/recruitment-privacy-content.ts`, `lib/current-privacy-content.ts`, `lib/responsible-disclosure-content.ts`, `app/[locale]/impresszum/page.tsx` and `app/[locale]/szolgaltatasok/[slug]/page.tsx` against the crawl. Every HU string in those files is rendered live except template literals.

Cross-referenced: all 64 open HU rows in `text-audit-open-items.csv`, all closed HU rows in `text-audit-status.csv` (regression check), the EDU rows that also cover HU, `verified_claims.md`, `copy_strategy.md`, `proof_catalog.md`, the owner confirmations of 2026-10-18, and June F-001…F-008.

Not covered:
- Admin UI strings (`app/admin`). They are not public.
- The DE/EN translations. These belong to other areas.
- Legal pages: I reviewed these only for objective errors and consistency, as instructed. They are lawyer-reviewed and authoritative.
- The content of the service-page quote modal comes from `sharedCopy?.serviceQuote` (DB) or the `SERVICE_QUOTE_COPY` fallback. I reviewed the fallback only.

## Findings

### COPY-HU-001 — The national-security registry review date has already passed but is shown as current
- Severity: P1
- Category: legal-consistency / factual staleness
- Where: https://www.afm.hu/hu/impresszum §6 d); https://www.afm.hu/hu/aszf §5 d)
- Evidence: "felülvizsgálat: 2026-06-30" (Impresszum); "felülvizsgálat 2026.06.30-ig kötelező" (Jogi nyilatkozatok)
- Problem: On 2026-10-18 both legal pages still show a mandatory review deadline that passed 3.5 months ago. A procurement buyer would read this as an overdue or lapsed registration. The owner note of 2026-10-18 says a new resolution valid until 2029 exists, but its identifier has not yet been supplied.
- Fix: Replace the old entry with the new AH resolution number and validity on both pages, e.g. „Iktatószám: [új AH-szám]; érvényes: 2029. [hó] [nap]-ig”. Until then, remove the review line rather than show an expired date.
- Status: KNOWN (HUA-002, HUB-002)
- Confidence: high

### COPY-HU-002 — Unsupported experience claim on the homepage
- Severity: P1
- Category: claim/proof
- Where: https://www.afm.hu/hu "Az Avenirről" ¶1 (`lib/i18n/hu.ts:31` `aboutText`)
- Evidence: "Az Avenir 2018-ban alakult, de vezetői csapata és szakemberei több évtizedes tapasztalattal rendelkeznek az épületüzemeltetés és a vagyonvédelem területén."
- Problem: "több évtizedes tapasztalat" is a quantified credential claim. It is not in `docs/verified_claims.md` and has no proof entry in `proof_catalog.md`. The translation audits (e.g. FKZ-023) treated it as source text, so it was never checked against proof.
- Fix: Get owner confirmation and record it in `verified_claims.md`. Otherwise soften it to: „Az Avenir 2018-ban alakult; vezetői és kulcsmunkatársai hosszú szakmai múlttal rendelkeznek az épületüzemeltetés és a vagyonvédelem területén.”
- Status: NEW
- Confidence: medium (the claim may well be true; the problem is that nothing proves it)

### COPY-HU-003 — Távfelügyelet promises unconditional 24/7 handling and "minden jelzés"
- Severity: P1 (CSV: P2)
- Category: claim/proof
- Where: https://www.afm.hu/hu/szolgaltatasok/tavfelugyelet-vonuloszolgalat — intro, trust card 1, trust card 2, FAQ[3].a
- Evidence: "Az Avenir 24/7 diszpécseri háttérrel kezeli a csatlakoztatott helyszínekről érkező riasztási, behatolásjelzési és kamerajelzéseket; minden jelzés ellenőrzött eszkalációs folyamatba kerül"; "Az Avenir 24/7 jelzésfogadást biztosít a csatlakoztatott helyszínekhez"; "Minden jelzés, ellenőrzési lépés és eszkalációs döntés eseménynaplóban rögzül"; "Minden lépés eseménynaplóban rögzül."
- Problem: The approved pattern is „24/7 diszpécseri háttérrel támogatható”. This page states it as an absolute. It also contradicts its own FAQ[8].a, which says "rögzíthetők".
- Fix: As in the HUA-005 proposal: „Az egyeztetett távfelügyeleti beállítás szerint a csatlakoztatott helyszínek jelzéseinek fogadása 24/7 diszpécseri háttérrel támogatható; a jelzések, ellenőrzési lépések és döntések eseménynaplóban rögzíthetők.”
- Status: KNOWN (HUA-005)
- Confidence: high

### COPY-HU-004 — "Igen" to holding licences for remote monitoring and response, with no proof
- Severity: P1 (CSV: P2)
- Category: claim/proof (regulated activity)
- Where: https://www.afm.hu/hu/szolgaltatasok/tavfelugyelet-vonuloszolgalat FAQ[4] (also in FAQPage JSON-LD)
- Evidence: Q "Rendelkezik az Avenir a távfelügyelethez és vonulószolgálathoz szükséges engedélyekkel?" A "Igen. A távfelügyelet és a vonulószolgálat az alkalmazandó magyar személy- és vagyonvédelmi szabályozási keret szerint történik."
- Problem: `verified_claims.md` lists only the guarding licence, the security-technology licence and the PI licence. Nothing confirms that these cover remote monitoring or response. The plural "engedélyekkel" plus "Igen" is a regulatory fact claim.
- Fix: Keep it only after owner/legal confirmation. Otherwise: „A szolgáltatást az alkalmazandó magyar személy- és vagyonvédelmi szabályozás szerint nyújtjuk; az engedélyadatok az Impresszumban érhetők el.”
- Status: KNOWN (HUA-016)
- Confidence: high

### COPY-HU-005 — Same-day response wording goes beyond the approved response-time claim
- Severity: P1 (CSV: P3)
- Category: claim/proof (response time)
- Where: https://www.afm.hu/hu contact form helper; service-page quote modal on all 8 HU service pages (`components/ServiceQuoteCta.tsx:58-59`); dormant `SEO_FAQS_HU[4].a`
- Evidence: "Munkaidőben többnyire még aznap visszajelzünk, de legkésőbb a következő munkanapon felvesszük Önnel a kapcsolatot. Az ajánlat elkészítésének ideje az igény összetettségétől függ."
- Problem: `verified_claims.md` approves only next-business-day contact follow-up. "többnyire még aznap" is an extra response-time statement with no recorded approval, and "munkaidő" is not defined anywhere. The form says "elkészítésének", while the service pages say "előkészítésének". This row is still marked as not yet live, but the new text is live now.
- Fix: Record the owner approval in `verified_claims.md`, or shorten to: „Legkésőbb a következő munkanapon felvesszük Önnel a kapcsolatot. Az ajánlat előkészítésének ideje az igény összetettségétől függ.”
- Status: KNOWN (HUA-019)
- Confidence: medium

### COPY-HU-006 — The service-page quote modal collects personal data with no privacy notice
- Severity: P1
- Category: legal-consistency / data protection information at collection
- Where: all 8 HU service pages, "AJÁNLATKÉRÉS" modal (`components/ServiceQuoteCta.tsx:360-470`). The fallback copy has no notice field and the markup renders none.
- Evidence: the modal asks for "Név", "E-mail", "Telefon", "Cég (opcionális)" and "Üzenet" and shows only "* Kötelező mező" and the next-step helper. The homepage form, by contrast, shows "A küldéssel tudomásul veszi az Adatkezelési tájékoztatót."
- Problem: A second collection point on indexed pages has no layered GDPR Art. 13 notice and no link to the Adatkezelési tájékoztató. This is inconsistent with the homepage form and the privacy notice §4.1.
- Fix: Add under the modal buttons: „A küldéssel tudomásul veszi az [Adatkezelési tájékoztatót](/hu/adatvedelem).” Also consider the special-data warning.
- Status: KNOWN (EDU-020, which explicitly covers HU)
- Confidence: high (source-verified; the modal is not open in the crawl)

### COPY-HU-007 — Wrong case government in the Objektumőrzés FAQ
- Severity: P2
- Category: grammar
- Where: https://www.afm.hu/hu/szolgaltatasok/objektumorzes FAQ[4].a (also FAQPage JSON-LD); seed `scripts/seed-pilot-objektumorzes.ts:179`
- Evidence: "Igen, ahol erre lehetőség van, az élőerős őrzés összehangolható meglévő kamerarendszerhez, beléptető rendszerhez, riasztási folyamathoz vagy távfelügyeleti működéshez."
- Problem: „összehangolható” takes -val/-vel, not -hoz/-hez/-höz. The sentence is ungrammatical, and the article is also missing.
- Fix: „Igen, ahol erre lehetőség van, az élőerős őrzés összehangolható a meglévő kamerarendszerrel, beléptetőrendszerrel, riasztási folyamattal vagy távfelügyeleti működéssel.” Or keep the cases and change the verb: „…az élőerős őrzés kapcsolható a meglévő kamerarendszerhez, …”
- Status: NEW
- Confidence: high

### COPY-HU-008 — Company name used without the definite article
- Severity: P2
- Category: grammar
- Where / Evidence:
  - objektumorzes longDesc ¶1: "Avenir a helyszíni felmérés alapján szolgálati utasítást készít" (listed in HUA-007)
  - portaszolgalat valueProposition: "Avenir célja, hogy ez a pont rendezett…" (listed in HUA-007)
  - biztonsagtechnika FAQ[6].a: "Avenir szemléletében" (listed in HUA-007)
  - mystery FAQ[3].a: "Igen. Avenir strukturált riportot készít" (listed in HUA-007)
  - hard-fm FAQ[3].q: "Avenir saját maga végez minden műszaki munkát?" (listed in HUA-007)
  - megfelelosegi-kozpont: "Avenir Facility Management Kft. Magyarországon bejegyzett vállalkozás." (listed in HUB-038)
  - felelos-hibabejelentes: "Avenir jelenleg nem működtet nyilvános hibavadászati vagy jutalmazási programot." (listed in HUB-038)
  - **NOT in any row:** biztonsagtechnika longDesc ¶2: "Avenir a biztonságtechnikai működést nem elszigetelt eszközbeszerzésként kezeli." The seed `scripts/seed-pilot-biztonsagtechnika.ts:63` has „Az Avenir…”, so this is production DB drift.
  - **NOT in any row:** portaszolgalat longDesc ¶2: "Avenir a helyszíni felmérés alapján rögzíti a portaszolgálati és recepciós protokollt"
  - **NOT in any row:** JSON-LD ItemList `name` on all 17 HU pages: "Avenir szolgáltatások" (`lib/schema-locale-copy.ts:7`)
- Problem: Hungarian puts the definite article before the company name, and every other page uses „az Avenir”. The two longDesc paragraphs come from the DB and differ from the seed, so the CMS rows have to be fixed, not only the source.
- Fix: „Az Avenir a biztonságtechnikai működést…”, „Az Avenir a helyszíni felmérés alapján rögzíti…”, ItemList: „Az Avenir szolgáltatásai”, plus the HUA-007/HUB-038 fixes.
- Status: KNOWN (HUA-007, HUB-038) + 3 NEW instances
- Confidence: high

### COPY-HU-009 — "megfigyelés" on the Mystery Shopping page (wording the copy rules say to avoid)
- Severity: P2
- Category: compliance wording / terminology
- Where: https://www.afm.hu/hu/szolgaltatasok/mystery-shopping-helyszini-audit and the repeated service card
- Evidence (HUA-013 rows): "Semleges ügyfélút-megfigyelés"; "strukturált megfigyeléssel, riportálással" (card text on the homepage, in the related-services blocks of 4 service pages, and in the Service JSON-LD on all 17 HU pages); "riportot készít a megfigyelésekről"; "megfigyelésekkel"; FAQ[0].a "megfigyelésből".
  **Occurrences NOT listed in HUA-013:** trust card 1: "hogy a megfigyelések a meghatározott szolgáltatásminőségi scope keretein belül maradjanak" (seed `seed-pilot-mystery-shopping-helyszini-audit.ts:149`); FAQ[1].a "a megengedett megfigyelési pontokat" (:198); FAQ[3].a "a megfigyelt folyamatról" (:216).
- Problem: `copy_strategy.md` lists „megfigyelés” under Avoid for this page because it suggests surveillance or private investigation. A fix based only on the HUA-013 list would leave three occurrences live.
- Fix: „értékelés/észrevétel”: „Semleges ügyfélút-értékelés”; „strukturált értékeléssel”; „hogy az értékelés a meghatározott … keretein belül maradjon”; „az előre rögzített értékelési pontokat”; „az értékelt folyamatról”.
- Status: KNOWN (HUA-013) + 3 NEW occurrences
- Confidence: high

### COPY-HU-010 — The AutoWallis reference card uses descriptive wording outside the approved text
- Severity: P2
- Category: claim/proof (partner/reference)
- Where: https://www.afm.hu/hu "Referenciák" card (`lib/references.ts:32`)
- Evidence: "AutoWallis Pest — Budapesti prémium autókereskedelmi és szervizhálózat."
- Problem: `verified_claims.md` approves only the logo, brand name and service chips. The `allowed_wording_hu` in `proof_catalog.md` is „AutoWallis Pest - jóváhagyott ügyfélmegjelenés. Kapcsolódó szolgáltatások: …”. A marketing description of the client ("prémium … hálózat") is not approved wording for a proof-controlled reference.
- Fix: Remove the line, or replace it with the approved text („Jóváhagyott ügyfélmegjelenés.”). If the descriptor is wanted, record its approval in the proof catalog.
- Status: NEW
- Confidence: medium

### COPY-HU-011 — "Szakképzett munkatárs" / "szakembergárda" goes beyond the approved headcount claim
- Severity: P2
- Category: claim/proof (qualifier)
- Where: https://www.afm.hu/hu stat tile and About ¶1
- Evidence: "200+ Szakképzett munkatárs"; "Ma 200+ fős szakembergárdával, 30+ aktív helyszínen dolgozunk országszerte"
- Problem: The approved form is „200+ munkatársi háttér”. "Szakképzett" and "szakember" add an unverified qualification claim.
- Fix: „200+ munkatárs”; „Ma több mint 200 munkatárssal, 30+ aktív helyszínen dolgozunk országszerte”.
- Status: KNOWN (HUA-020)
- Confidence: high

### COPY-HU-012 — "Diszpécseri készenlét" stat tile
- Severity: P2
- Category: claim wording / terminology
- Where: https://www.afm.hu/hu stats (`lib/i18n/hu.ts:26`)
- Evidence: "24/7 Diszpécseri készenlét"
- Problem: "készenlét" suggests permanent availability. The approved form is „24/7 diszpécseri háttér”. The JSON-LD `knowsAbout` is already fixed ("24/7 diszpécseri háttér"), but the tile is not.
- Fix: „Diszpécseri háttér”.
- Status: KNOWN (HUA-006, partially fixed)
- Confidence: high

### COPY-HU-013 — "nem csak … hanem" should be one word
- Severity: P2
- Category: spelling
- Where: https://www.afm.hu/hu/szolgaltatasok/biztonsagtechnika longDesc ¶4
- Evidence: "olyan megoldás, amely nem csak rögzít, hanem segíti az észlelést"
- Problem: In the „nemcsak …, hanem” construction the word is written together. The homepage instance is already fixed („nemcsak jelen vagyunk”).
- Fix: „amely nemcsak rögzít, hanem segíti…”
- Status: KNOWN (HUA-011, partially fixed)
- Confidence: high

### COPY-HU-014 — Informal "you" (tegezés) in the Karrier section of a formal-"you" (magázó) site
- Severity: P2
- Category: register
- Where: https://www.afm.hu/hu Karrier eyebrow
- Evidence: "CSATLAKOZZ A CSAPATHOZ" next to "Jelentkezés előtt kérjük, olvassa el a pályázói adatkezelési tájékoztatót."
- Problem: The section mixes informal and formal "you".
- Fix: „Csatlakozzon csapatunkhoz”.
- Status: KNOWN (HUA-012)
- Confidence: high

### COPY-HU-015 — Legal-page meta descriptions are cut off mid-word at 160 characters
- Severity: P2
- Category: SEO copy
- Where: META DESCRIPTION, plus the matching WebPage JSON-LD `description`, of /hu/adatvedelem, /hu/aszf and /hu/palyazoi-adatkezeles
- Evidence: "…megadott személyes adatokat, különösen " (adatvedelem); "…a weboldalon közzétett jogi nyilatkozatokra vo" (aszf); "…Célja, hogy a jelen" (palyazoi). The last one is the word „jelentkezők” cut off, so it reads as "a jelen".
- Problem: These are hard truncations of the first paragraph, not written descriptions. They show as broken sentences in search results and in the JSON-LD.
- Fix: Write dedicated descriptions of 140 characters or fewer, e.g. adatvedelem: „Hogyan kezeli az Avenir a www.afm.hu kapcsolatfelvételi és ajánlatkérési űrlapján megadott személyes adatokat – jogalap, megőrzés, jogok.”; aszf: „A www.afm.hu használatára, a kapcsolatfelvételre és az ajánlatkérésre vonatkozó jogi nyilatkozatok és hatósági adatok.”; palyazoi: „Hogyan kezeli az Avenir az álláspályázatok során megadott személyes adatokat, és milyen jogai vannak a jelentkezőknek.”
- Status: NEW
- Confidence: high

### COPY-HU-016 — The Jogi nyilatkozatok list of third-party services leaves out GA4
- Severity: P2
- Category: legal-consistency
- Where: https://www.afm.hu/hu/aszf §8 vs https://www.afm.hu/hu/adatvedelem §6.4 and §8
- Evidence: "• Hosting: Vercel Inc. … • E-mail-továbbítás: … • Adatbázis: Neon, LLC …" (no Google Analytics). The privacy notice, by contrast, says "6.4. Google Analytics 4 (GA4) - Google Ireland Limited / Google LLC".
- Problem: The two legal documents disagree on which third-party services the website uses.
- Fix: Add „• Webanalitika (kizárólag hozzájárulás esetén): Google Ireland Limited / Google LLC – Google Analytics 4”.
- Status: KNOWN (HUB-005)
- Confidence: high

### COPY-HU-017 — Privacy notice scope, processors and retention are incomplete
- Severity: P2
- Category: legal-consistency
- Where: https://www.afm.hu/hu/adatvedelem intro ¶2, §6; vs https://www.afm.hu/hu/palyazoi-adatkezeles §9
- Evidence: "E tájékoztató hatálya a www.afm.hu weboldal kapcsolatfelvételi és ajánlatkérési folyamatára … terjed ki." (GA4 and cookies are not in the scope; there is no GA4 retention period). The applicant notice names "Microsoft 365 — Microsoft Ireland Operations Limited" as the mailbox processor, but the general notice lists no mailbox processor, although contact-form mails also go to info@afm.hu.
- Problem: These are internal inconsistencies between two HU legal notices. They are flagged for legal decision, not as style edits.
- Fix: As proposed in HUB-006 and HUB-007, if confirmed.
- Status: KNOWN (HUB-006, HUB-007)
- Confidence: medium

### COPY-HU-018 — Legal name of the reference client shown publicly; confirm approval
- Severity: P2
- Category: claim/proof
- Where: https://www.afm.hu/hu/megfelelosegi-kozpont "Jóváhagyott ügyfélmegjelenés"
- Evidence: "Jogi személy: Wallis Motor Pest Kft."
- Problem: The label was improved, so "Belső jogi/proof entitás" is gone. However, `proof_catalog.md` `allowed_wording_hu` still does not include the legal entity name.
- Fix: Record the approval, or remove the line.
- Status: KNOWN (HUB-025, partially fixed)
- Confidence: medium

### COPY-HU-019 — An empty phrase repeated three times on the Megfelelőségi központ
- Severity: P2
- Category: clarity
- Where: https://www.afm.hu/hu/megfelelosegi-kozpont "Engedélyezett vagyonvédelmi működés"
- Evidence: "Engedélyezett vagyonvédelmi tevékenység jogi és megfelelőségi kontextusban."; "Biztonságtechnikai tervező-szerelő jogosultság jogi és megfelelőségi kontextusban."; "Magánnyomozói tevékenység jogi és megfelelőségi kontextusban."
- Problem: This is a calque of the spec wording ("in legal/proof context") and gives a procurement reader no information.
- Fix: „Engedélyhez kötött személy- és vagyonvédelmi tevékenység. Az engedély adatai az Impresszumban találhatók.” Use the same pattern for the other two.
- Status: KNOWN (HUB-026)
- Confidence: high

### COPY-HU-020 — Service names that do not match the canonical names
- Severity: P2
- Category: terminology
- Where / Evidence: homepage About ¶3 "mystery shoppinggal"; mystery FAQ[0].q "Mit tartalmaz a Mystery Shopping és szolgáltatásaudit?"; JSON-LD `knowsAbout` "Technikai vagyonvédelem", "Mystery Shopping audit", "Élőerős őrzés-védelem" (all 17 pages); the news article lists 6 of the 8 services ("…a távfelügyeleti és vonulószolgálati támogatást, valamint a kapcsolódó Soft FM és Hard FM szolgáltatásokat."); `/hu/szolgaltatasok/objektumorzes` meta description opens "Objektumőrzés beléptetéssel…". Capitalization is also inconsistent: "Mystery Shopping" on the service page vs "mystery shopping" on the homepage.
- Problem: This drifts from the AGENTS.md canonical names: Próbavásárlás és szolgáltatásaudit, Biztonságtechnika, Élőerős objektumőrzés. "Riasztórendszer-felügyelet" is already fixed.
- Fix: „próbavásárlással”; „Mit tartalmaz a próbavásárlás és szolgáltatásaudit?”; knowsAbout: canonical names; in the article, all 8 services or „többek között”.
- Status: KNOWN (HUA-021, partially fixed)
- Confidence: high

### COPY-HU-021 — Hungarian compound and hyphenation errors in the internal notification e-mail
- Severity: P3
- Category: spelling / style (internal e-mail to staff, not customer-facing)
- Where: `lib/email-templates/notification.ts:39,43,51-55,61-63,97-107`
- Evidence: "Szolgáltatás kulcs", "Űrlap variáns", "Forrás oldal"; "Az adatok eltárolásra kerültek az adminisztrátori felületen."; "Az ajánlatkérés mentésre került"; subject "Új ajánlatkérés — …"; "afm.hu honlap kapcsolati űrlapján"
- Problem: Separately written compounds (they should be „szolgáltatáskulcs”, „űrlapváltozat”, „forrásoldal”), bureaucratic "-ásra kerül" constructions, an English-style em dash, and a term that differs from the site's „kapcsolatfelvételi űrlap”.
- Fix: „Szolgáltatáskulcs”, „Űrlapváltozat”, „Forrásoldal”; „Az adatokat az adminisztrátori felület is tárolja.”; „Új ajánlatkérés – …”; „az afm.hu kapcsolatfelvételi űrlapján keresztül”.
- Status: NEW
- Confidence: high

### COPY-HU-022 — Service-page quote modal microcopy differs from the main form
- Severity: P3
- Category: consistency (UI microcopy)
- Where: `components/ServiceQuoteCta.tsx:39-59` vs `lib/i18n/hu.ts:126-160`
- Evidence: modal "Név", "Cég (opcionális)", "Üzenet", "Küldés folyamatban...", "Kérjük, adja meg a nevét.", "…vagy hívjon minket." vs main form "Teljes név", "Cégnév", "Üzenet / Igény leírása", "Küldés folyamatban…", "Adja meg a teljes nevét", "…vagy hívjon minket: +36 70 316 8218"
- Problem: The same fields and messages have different labels: three dots vs the ellipsis character, a different validation style, and the phone number missing from the modal error.
- Fix: Align the modal to the main form: „Teljes név”, „Cégnév”, „Küldés folyamatban…”, „Kérjük, adja meg a teljes nevét.”, „…vagy hívjon minket: +36 70 316 8218.”
- Status: NEW (HU counterpart of EDU-038, which covers only EN/DE)
- Confidence: high

### COPY-HU-023 — 404 page reuses the homepage title
- Severity: P3
- Category: SEO copy
- Where: HU 404 page ("[UI extras — hu]" 404 block)
- Evidence: "TITLE: Avenir Facility Management Kft. — Vagyonvédelem és FM" on a page whose H1 is "Az oldal nem található"
- Problem: The browser tab and any shared link show the homepage title for an error page. The meta robots tag is also "index, follow". The 404 status prevents indexing, so this is cosmetic.
- Fix: „Az oldal nem található – Avenir Facility Management Kft.” Use robots „noindex”.
- Status: NEW
- Confidence: high

### COPY-HU-024 — Title tags that are too short or too long
- Severity: P3
- Category: SEO copy
- Where / Evidence:
  - /hu/szolgaltatasok/rendezvenybiztositas "Rendezvénybiztosítás | Avenir" (29 characters, no qualifier; all other service titles have one)
  - news article "Megújult az Avenir weboldala és arculata - Avenir Facility Management Kft." (74 characters, will be truncated)
  - /hu/palyazoi-adatkezeles (67 characters)
- Fix: „Rendezvénybiztosítás céges és nyilvános eseményekre | Avenir”; „Megújult az Avenir weboldala és arculata – Avenir”.
- Status: NEW (the separators are covered separately by HUA-024)
- Confidence: high

### COPY-HU-025 — Objektumőrzés meta description repeats itself
- Severity: P3
- Category: SEO copy
- Where: /hu/szolgaltatasok/objektumorzes META DESCRIPTION (seed `seed-pilot-objektumorzes.ts:55`)
- Evidence: "Objektumőrzés beléptetéssel, járőrözéssel, incidenskezeléssel és riportálással. Helyszínre szabott protokollok vállalati helyszínekre."
- Problem: The word "helyszín" appears twice in one short sentence. The description also starts with a non-canonical name and does not use the page keyword "élőerős".
- Fix: „Élőerős objektumőrzés beléptetéssel, járőrözéssel, incidenskezeléssel és riportálással, helyszínre szabott szolgálati utasítással vállalatoknak.”
- Status: NEW
- Confidence: high

### COPY-HU-026 — Rendezvénybiztosítás: ambiguous and inconsistent terms
- Severity: P3
- Category: terminology / clarity
- Where: /hu/szolgaltatasok/rendezvenybiztositas trust cards 1 and 5, FAQ[3].q (seed `seed-pilot-rendezvenybiztositas.ts:170,208`)
- Evidence: "Rendezvényre szabott biztosítási terv"; "A szervező kijelölt rendezvénybiztonsági kapcsolattartási pontot kap"; "Van garantált konfliktusmentes rendezvény?"
- Problem: On its own, "biztosítási terv" reads as an insurance plan. "rendezvénybiztonsági" and "rendezvénybiztosítási" are mixed on the same page. The FAQ question is unidiomatic: a guarantee is given for an outcome, not a "rendezvény".
- Fix: „Rendezvényre szabott biztonsági terv”; „rendezvénybiztosítási kapcsolattartót”; „Garantálható, hogy a rendezvény konfliktusmentes lesz?”
- Status: NEW
- Confidence: high

### COPY-HU-027 — Hard FM: unclear wording
- Severity: P3
- Category: clarity
- Where: /hu/szolgaltatasok/hard-fm longDesc ¶2, FAQ[6].a (seed `seed-pilot-hard-fm.ts:68,214`)
- Evidence: "azok kezelése az egyeztetett működési modell részeként történik, nem rejtett átadásként az ügyfél felé."; "…több, egymástól leváló szolgáltatón keresztül működnek. A dedikált folyamat átláthatóbb hibautat…ad"
- Problem: "rejtett átadás az ügyfél felé" is unclear (it means "not a hidden subcontracting hand-off"). "leváló" and "hibaút" are not idiomatic.
- Fix: „…nem pedig az ügyfél számára nem látható alvállalkozói átadásként.”; „…több, egymástól független szolgáltatón keresztül működnek. A külön folyamat átláthatóbb hibakezelési utat…”
- Status: NEW
- Confidence: medium

### COPY-HU-028 — Soft FM: calques and a misused "scope"
- Severity: P3
- Category: clarity / anglicism
- Where: /hu/szolgaltatasok/soft-fm use case 5, trust card 6, FAQ[0].a, FAQ[4].a, FAQ[6].a (seed `seed-pilot-soft-fm.ts:79,194,244`)
- Evidence: "Működések, ahol a Soft FM, Hard FM, portaszolgálat és őrzés egy operatív felületen kapcsolódhat össze"; "beszámol az elvégzett scope-ról"; "lefedi az elvégzett scope-ot"; "nem műszaki facility szolgáltatások"; FAQ[4] answer "Az általános takarítási minőségre vonatkozó garancia nem helyettesítheti a meghatározott scope-ot." (does not answer the yes/no question); "„ahogy szükséges” jellegű működés"
- Problem: A scope cannot be "elvégzett" (completed); tasks can. "Működések" as a plural noun is unidiomatic. "facility szolgáltatások" is a half-translated term. The FAQ answer is evasive.
- Fix: „Helyszínek, ahol a Soft FM, a Hard FM, a portaszolgálat és az őrzés egy operatív felületen kapcsolódik össze”; „beszámol az elvégzett feladatokról”; „nem műszaki létesítményüzemeltetési szolgáltatások”; FAQ[4]: „Általános minőségi garanciát nem adunk; a minőséget az egyeztetett feladatok, ellenőrzési szempontok, riportálás és korrekciós intézkedések teszik mérhetővé.”; „eseti, igény szerinti működés”.
- Status: NEW
- Confidence: medium

### COPY-HU-029 — Távfelügyelet: calque "reagálási kiváltó pontok"
- Severity: P3
- Category: anglicism
- Where: /hu/szolgaltatasok/tavfelugyelet-vonuloszolgalat trust card 3 (seed `seed-pilot-tavfelugyelet-vonuloszolgalat.ts:153`)
- Evidence: "Az értesítési sorrend, a kijelölt kapcsolattartók és a reagálási kiváltó pontok előre egyeztetve és helyszínenként dokumentálva vannak."
- Problem: This is a word-for-word rendering of "response triggers" and is opaque in Hungarian.
- Fix: „…és azok az események, amelyek reagálást indítanak, előre egyeztetettek és helyszínenként dokumentáltak.”
- Status: NEW
- Confidence: high

### COPY-HU-030 — Biztonságtechnika: illogical subject and awkward phrase
- Severity: P3
- Category: clarity
- Where: /hu/szolgaltatasok/biztonsagtechnika FAQ[1].a (seed `seed-pilot-biztonsagtechnika.ts:200`), trust card 6
- Evidence: "…ha az őrök, a porta, a kapcsolattartók és az eszkalációs rend is tudja, mikor milyen jelzésre mi a teendő."; "A felmérés eredménye riportálható megállapításokban … foglalható össze."
- Problem: An "eszkalációs rend" cannot "know" anything. "riportálható megállapítás" is unidiomatic.
- Fix: „…ha az őrök, a porta és a kapcsolattartók tudják, és az eszkalációs rend rögzíti, mikor milyen jelzésre mi a teendő.”; „A felmérés eredménye megállapításokban, prioritásokban, integrációs pontokban és megvalósítási javaslatban foglalható össze.”
- Status: NEW
- Confidence: high

### COPY-HU-031 — Mystery Shopping: compounds with "brand"
- Severity: P3
- Category: spelling (compounding)
- Where: /hu/szolgaltatasok/mystery-shopping-helyszini-audit longDesc ¶2, process steps 2 and 6, trust card 2 (seed `seed-pilot-mystery-shopping-helyszini-audit.ts:66,111,140`)
- Evidence: "brand standardokat" (×2), "brand standard pontosításról", "brand elvárások"
- Problem: Noun-noun compounds are written as one word in Hungarian. The page itself writes "brand-, tájékoztatási" with a hyphen.
- Fix: „márkastandardokat” / „márkaelvárások” / „márkastandard-pontosításról”. Or, keeping the loanword: „brandstandardokat”, „brandelvárások”.
- Status: NEW (the related capitalization issue is KNOWN HUA-022)
- Confidence: medium

### COPY-HU-032 — Felelős hibabejelentés: intro and "Cél" repeat the same sentence
- Severity: P3
- Category: duplication
- Where: https://www.afm.hu/hu/felelos-hibabejelentes (`lib/responsible-disclosure-content.ts:36`)
- Evidence: "Ezen az oldalon keresztül a www.afm.hu weboldallal kapcsolatos technikai biztonsági hibák felelős bejelentéséhez adunk útmutatást." followed immediately by "Ez az oldal a www.afm.hu weboldallal kapcsolatos technikai biztonsági hibák felelős bejelentésére szolgál."
- Fix: Keep the intro. Make "Cél" say only: „A cél az, hogy a bejelentések kezelhető, kárminimalizáló és ellenőrizhető formában érkezzenek meg.”
- Status: NEW
- Confidence: high

### COPY-HU-033 — Consent control has two different names
- Severity: P3
- Category: consistency
- Where: footer button vs consent dialog title (`lib/analytics/consent-copy.ts:28-29`); the privacy notice §8 and "Hozzájárulás visszavonása" quote the footer label
- Evidence: footer "Süti beállítások"; dialog "Analitikai beállítások"; privacy text "a weboldal láblécében található „Süti beállítások” gombbal"
- Problem: A user who follows the instructions in the privacy notice lands on a dialog with a different name. The compound spelling is a separate, KNOWN issue (HUB-040: „Sütibeállítások”).
- Fix: Use one label everywhere: „Sütibeállítások” for the button and the dialog title, or „Analitikai beállítások” for both. Change the privacy notice at the same time.
- Status: NEW (spelling KNOWN HUB-040 / HUA-029)
- Confidence: high

### COPY-HU-034 — Impresszum section title: unbalanced parenthesis
- Severity: P3
- Category: legal page, objective typo
- Where: https://www.afm.hu/hu/impresszum §5 title (`lib/i18n/hu.ts:389`)
- Evidence: "5. Szabályozott szakma (Ekertv. 4. § g)"
- Problem: The opening parenthesis is never closed, because "g)" is the point marker. HUB-019 was closed on the legal reference only, not on this typo.
- Fix: „5. Szabályozott szakma (Ekertv. 4. § g) pont)”
- Status: NEW
- Confidence: medium

### COPY-HU-035 — Karrier copy: odd phrasing
- Severity: P3
- Category: clarity / register
- Where: https://www.afm.hu/hu Karrier (`lib/i18n/hu.ts:117`)
- Evidence: "akik felelősen állnak a műszakhoz"; "Biztonsági, takarítási, műszaki és irányítói pozíciókba"; "legális foglalkoztatást" (the last is KNOWN HUA-033)
- Problem: "felelősen áll a műszakhoz" is not idiomatic. "irányítói pozíció" is unusual; the normal term is "vezetői".
- Fix: „akik felelősséggel végzik a munkájukat”; „vagyonvédelmi, takarítási, műszaki és vezetői pozíciókba”; „bejelentett, jogszerű foglalkoztatást”.
- Status: NEW (except the KNOWN part)
- Confidence: high

### COPY-HU-036 — Dormant HU privacy fallback contradicts the live notice
- Severity: P3
- Category: correctness (latent)
- Where: `lib/i18n/hu.ts:208-289` (`legal.privacy`). It is reachable only through `lib/legal-content.ts:25` if `CURRENT_PRIVACY_CONTENT.hu` were missing.
- Evidence: "A https://www.afm.hu weboldal jelenlegi működésében az Adatkezelő nem alkalmaz analitikai, marketing-, retargeting- vagy profilalkotási célú sütiket."; "Verzió-history: 1.0 verzió"; "kapcsolatfelvételi flow-jában"
- Problem: It is not rendered today. If it is ever used, it would publish an outdated version 1.0 notice that denies the GA4 use the live version 1.3 describes.
- Fix: Replace it with a reference to `CURRENT_PRIVACY_CONTENT.hu`, or delete the body.
- Status: NEW
- Confidence: high

### COPY-HU-037 — Service-card descriptions repeat the title and are reused verbatim everywhere
- Severity: P3
- Category: duplication / style
- Where: homepage cards, related-services blocks on every service page, Service JSON-LD on all 17 pages
- Evidence: heading "Recepciós és portaszolgálat" followed by "Recepciós és portaszolgálat látogatók, beszállítók, munkatársak, kulcsok, csomagok, naplózás és egyeztetett eszkaláció kezelésére." The same pattern appears on all 8 cards.
- Problem: Each description restates the heading as its first words and has no verb. It is fine as schema text, but repetitive on screen. It may be intentional for AI search.
- Fix: Optional. For the on-screen card, drop the leading name: „Látogatók, beszállítók, munkatársak, kulcsok és csomagok kezelése naplózással és egyeztetett eszkalációval.”
- Status: NEW
- Confidence: low

### KNOWN P3 items confirmed still live (one line each; fix as in the open-items row)
- COPY-HU-038 — Title separators mixed ("—", "|", "-"), e.g. "Hírek és tudásanyag - Avenir Facility Management Kft.", "Megfelelőségi központ | …". Status: KNOWN (HUA-024, HUB-050). P3.
- COPY-HU-039 — English em dash instead of the Hungarian spaced en dash: "országszerte — vállalati", alt "Avenir Facility Management — épületüzemeltetés…", reply-mail "Eredeti üzenet — …". Status: KNOWN (HUA-023). P3.
- COPY-HU-040 — ISO cards: straight quotes "\"Teljes körű biztonsági szolgáltatás\"", aria-label "ISO 9001 — ISO 9001 … Kiállító MartonCert …, Érvényes 2029. március 18." (should be „érvényes: …-ig”), "került auditálásra … által". Status: KNOWN (HUA-025). P3.
- COPY-HU-041 — JSON-LD `additionalProperty` "IAF MLA-tag: true" and the same accreditation "NAH · NAH-4-0047/2023" for two different bodies. Status: KNOWN (HUA-026, HUB-030). P3.
- COPY-HU-042 — ISO-format and unspaced dates in HU text: "Alapítás: 2018-07-31", "érvényes 2028-01-31", "érvényes 2028.01.31-ig", "Hatály: 2026-03-19 - 2029-03-18", "Hatályba lépés: 2026.04.28.", "(XII.13.)". Status: KNOWN (HUA-027, HUB-034, HUB-035). P3.
- COPY-HU-043 — Hyphen used for dashes and ranges: "1.3 verzió - Google Analytics…", "GDPR 12-22. cikkei", "Falk Miksa utca 9-11.", "krt. 48-52.", "EU-USA" vs "EU–USA". Status: KNOWN (HUA-028, HUB-032). P3.
- COPY-HU-044 — Mismatched quotes: "(„Resend\")", "A „Jelentkezés\" gomb". Status: KNOWN (HUB-033). P3.
- COPY-HU-045 — Compounding: "protokoll-javaslat", "protokoll-módosításokról", "Süti beállítások", "rutin feladatok", "Több helyszínes" (vs "Egyhelyszínes"), "beléptető rendszer" vs "kamerarendszer". Status: KNOWN (HUA-029, HUB-040). P3.
- COPY-HU-046 — Anglicisms / opaque terms: "mobilizáció", "PPM-ütemezés", "HVAC" unexplained, "Dedikált", "keretezés", "Rendezvény scope és helyszíni igények egyeztetése", "Verifikált riasztási protokoll", "front-of-house", "látható nappali szolgáltatási színvonalat". Status: KNOWN (HUA-030, HUA-008). P3.
- COPY-HU-047 — Bureaucratic "-ásra kerül": "kerülnek ellenőrzésre", "rögzítésre kerül", "kerül meghatározásra", "dokumentálásra kerül", "kerülnek egyeztetésre". Status: KNOWN (HUA-031). P3.
- COPY-HU-048 — Mixed FAQ voice: "Hogyan kezeljük…?", "Hogyan határozzuk meg…?" vs "Kapunk…?". Status: KNOWN (HUA-032). P3.
- COPY-HU-049 — Labels: "Kinek jó", "Bizalmi elemek", footer "Jogi", title "Megnyitás Google Maps-en", "Üzenet / Igény leírása" (capital I), "Jóváhagyott ügyfélmegjelenések." (also used as an aria-label ending in a period). Status: KNOWN (HUA-033). P3.
- COPY-HU-050 — "riportolás" (hero, About) vs "riportálás" (everywhere else). Status: KNOWN (HUA-034). P3.
- COPY-HU-051 — Career card "Biztonsági őr" vs the regulated term "vagyonőr". Locations are now shown on all 4 cards, so that part is fixed. Status: KNOWN (HUA-035, partially fixed). P3.
- COPY-HU-052 — News naming: nav "Hírek", homepage "Híreink", H1 "Hírek és tudásanyag"; meta "Avenir hírek, szakmai cikkek…" with one article. The homepage "Céges hírek, szakmai aktualitások, új referenciák és bejelentések." overpromises the same way. Status: KNOWN (HUA-036). P3.
- COPY-HU-053 — "Komplex működés egy kézből" (a forbidden-style generic phrase); "hogy mindig lássa, mi történik a helyszínen" (an absolute). Status: KNOWN (HUA-037). P3.
- COPY-HU-054 — HU 404 is now localized, but it still links to the noindex review locales "/ZH /KO /FR". Status: KNOWN (HUA-040, partially fixed). P3.
- COPY-HU-055 — Reply e-mail signature is fixed to one person's name: "Üdvözlettel,\nVárkonyi András\nAvenir Facility Management Kft." (`lib/email-templates/reply.ts:65`). Status: KNOWN (HUA-043). P3.
- COPY-HU-056 — Delivery model wording: "saját munkatársak, jóváhagyott alvállalkozók vagy meglévő ügyféloldali szolgáltatók"; "Saját vonulószolgálati folyamat". Needs a business decision. Status: KNOWN (HUA-018). P3.
- COPY-HU-057 — English fragments and jargon in HU legal text: "EU Frankfurt (sending region)", "EU edge regions (configured)", "Neon (a Databricks, Inc. affiliate)", "flow-ja", "runtime működés". Status: KNOWN (HUB-013). P3.
- COPY-HU-058 — Impresszum §7 uses the "Kiállító" label for supervisory authorities, including the NAIH. Status: KNOWN (HUB-017). P3.
- COPY-HU-059 — The same documents carry different type labels: "Engedélyszám" (all), "hatósági bizonyítvány", "iktatószám", "jogosultság", and ÁSZF §4 calls the PI document "hatósági engedély" while §5 c) calls it "hatósági bizonyítvány". Status: KNOWN (HUB-018). P3.
- COPY-HU-060 — "Utolsó frissítés: 2026. április 28." on the Impresszum, which likely postdates its content, and the label differs from "Hatályos:". Status: KNOWN (HUB-036). P3.
- COPY-HU-061 — The list of data not to submit differs between pages ("üzleti titok" appears only in some; "büntetőjogi vagy bűnügyi" is redundant). Status: KNOWN (HUB-041). P3.
- COPY-HU-062 — Impresszum "Beosztás: Kovács Attila, ügyvezető" (the label does not match the value). Status: KNOWN (HUB-042). P3.
- COPY-HU-063 — Format inconsistencies: "+36 1 391 1400" vs "+36 (1) 391-1400"; "EU VAT azonosító"; "GDPR 6. cikk (1) a)". Status: KNOWN (HUB-043). P3.
- COPY-HU-064 — "Az MSZ ISO/IEC 27001:2023 … nemzetközi szabványa" (MSZ is the national edition). Status: KNOWN (HUB-046). P3.
- COPY-HU-065 — Trust Center labels: "Biztonságtechnikai tervező-szerelő jogosultság" vs Impresszum "Vagyonvédelmi rendszert tervező-szerelő"; chip "Objektumőrzés". Status: KNOWN (HUB-047). P3.
- COPY-HU-066 — Trust Center: "…nem nyilvános Megfelelőségi központ dokumentumok."; "AutoWallis Pest jóváhagyott ügyfélmegjelenésként szerepelhet." Status: KNOWN (HUB-048). P3.
- COPY-HU-067 — Felelős hibabejelentés: "reprodukciós lépéseket", "social engineering, phishing, spam, DoS / DDoS". Status: KNOWN (HUB-049). P3.
- COPY-HU-068 — Privacy notice §7: conditional GA4 transfer wording ("lehet releváns", "értékelendők"). The SCC term itself is now fixed. Status: KNOWN (HUB-004, partially fixed). P3.

## Verified OK
- No forbidden vague phrases are live ("modern megoldások", "innovatív", "profi csapat", "egyedi igényekre szabva", "magas minőség"). "Teljes körű" appears only inside the quoted ISO certificate scope, which is accepted.
- There is no EcoVadis wording, no GDPR-compliance promise and no legal-advice framing. Biztonságtechnika, Portaszolgálat and Távfelügyelet say that legal basis and final data-protection decisions stay with the client and its advisers, and the Biztonságtechnika FAQ says "Ez nem jogi tanácsadás".
- Private investigation appears only as legal/regulatory fact (ÁSZF §4–5, Impresszum §5–6, Trust Center licence list) and in the Mystery FAQ that separates the two ("Nem magánnyomozás, nem korlátlan megfigyelés…"). There is no PI contact option: `Contact.tsx` deliberately omits it, and the live select shows only the 8 services. There is no public Special Services copy.
- Armed guarding wording matches the approved pattern ("fegyver nélküli vagy fegyveres … a szerződéses igény, a jogi feltételek és a helyszín kockázati profilja alapján").
- The "Van garantált…?" FAQs (Hard FM, Rendezvény, Soft FM, Távfelügyelet) make no guarantee.
- Approved claims are rendered exactly: "30+ Aktív helyszín", "AA / D&B magas hitelképességi minősítés", ISO 9001 843579099 MartonCert (2026-03-19 – 2029-03-18), ISO/IEC 27001 988960032 MCert (2026-04-27 – 2029-04-26), and "24/7 diszpécseri háttérrel támogatható" on Objektumőrzés and Portaszolgálat.
- Resolved and verified live since the open-items snapshot:
  - HUB-001: ÁSZF now says "legkésőbb a következő munkanapon", so June F-001 has not regressed.
  - F-002: service step 1 has no fixed turnaround.
  - HUA-004: the approved site-visit sentence is live.
  - HUA-041 / HUB-051: aria-labels are Hungarian ("Avenir főoldal", "Nyelvváltás: Magyar", "Menü megnyitása vagy bezárása").
  - HUB-031: openingHours JSON-LD has been removed.
  - HUA-001: consent sentence is verbatim.
  - HUA-009: "Az Avenirről".
  - HUA-010 / HUB-015: "e-mail-cím" is used throughout.
  - HUB-008: "Adatkezelési tájékoztató" is used everywhere.
  - HUB-009, HUB-011, HUB-012, HUB-014, HUB-016, HUB-023, HUB-024, HUB-039: fixed.
  - "Riasztórendszer-felügyelet" is now spelled correctly.
- Legal cross-references and numbering are consistent:
  - Privacy §1–15, Pályázói §1–12, ÁSZF §1–14, Impresszum §1–10.
  - Pályázói → privacy "9. és 11. pontja" is correct.
  - ÁSZF "lásd 1. szakasz" and "12. szakasz" are correct.
  - Licence numbers, the Allianz policy number, the DPO data, the representative's phone, the company registration number, tax ID and address are identical across ÁSZF, Impresszum, privacy and Trust Center.
- The consent banner and the privacy notice §8 agree: the "Elutasítom" choice withdraws consent, and no GTM, LinkedIn Insight or other marketing pixels are used.
- Form validation and error messages in `hu.ts` (e.g. "Adja meg az e-mail-címét", "Túl sok küldési próbálkozás…") and the runtime error and 404 copy are correct Hungarian. The customer reply template's "Tisztelt …!" and "Válaszához egyszerűen válaszoljon erre az e-mailre." are correct.
