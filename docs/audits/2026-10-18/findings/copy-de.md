# COPY-DE — findings

Coverage: I read all of `S\crawl\text_de.md`, 1,992 lines covering 14 pages: `/de`, `/de/adatvedelem`, `/de/aszf`, `/de/impresszum`, `/de/hirek`, the news article, and the 8 service pages. This includes the shared header and footer, every TITLE / META / H1, and the `[UI extras — de]` block (consent banner, placeholders, labels, options, aria-labels, alts, 404). That is about 1,560 text segments (sentences, list items and labels). I also read all 73 DE FAQ answers (about 150 sentences), which the crawl does not show because the accordions are closed. I took them from the FAQPage JSON-LD in `S\crawl\pages\de__*.json` and compared them pair by pair with the HU JSON-LD answers.
I compared every DE page against the HU page with the same path in `text_hu.md`. Legal numbers, dates, addresses, licence, insurance and registry data were checked field by field against HU.
Source scan: `lib/i18n/de.ts` (all 345 lines), `lib/de-legal-content.ts`, `lib/services/de-service-details.ts` (structure, relatedServices, legal-review keys), `lib/services/de-service-shared-copy.ts`, `lib/email-templates/reply.ts` (DE greeting and signature; `notification.ts` is HU-only and internal), `lib/analytics/consent-copy.ts`, `lib/locale-ui-helpers.ts`, `lib/locale-accessibility.ts`, `lib/schema-locale-copy.ts`, `lib/seo-data.ts`, `lib/references.ts`, `lib/not-found-copy.ts`, `lib/runtime-error-copy.ts`, and `app/[locale]/impresszum|hirek` metadata.
I cross-checked all 56 DE… rows **and** the 38 EDU… rows (EN+DE UI) in `text-audit-open-items.csv`. Many homepage findings are recorded there under EDU ids, not DE ids.
Not covered:
- Form error and success states. I reviewed them from source only, not by submitting (the brief forbids POST).
- The recruitment privacy page. DE links to the EN page.
- The external EDPB `_de.pdf` link was not fetched.

## Findings

### COPY-DE-001 — DE-only GDPR clause and two DE-only legal FAQs on Sicherheitstechnik are still live
- Severity: P1
- Category: claim/proof, legal-consistency
- Where: https://www.afm.hu/de/szolgaltatasok/biztonsagtechnika — longDesc ¶3; FAQ [9], [10] (also in FAQPage JSON-LD: DE 11 Q/A vs HU 9)
- Evidence: "… auf den Betrieb des Standorts und den Datenschutzrahmen des Kunden abgestimmt — im Einklang mit den Grundsätzen der DSGVO und dem in Ungarn anwendbaren Rechtsrahmen." / "Wer führt die Interessenabwägung für eine Videoüberwachung durch?" / "Wie lange dürfen Kameraaufnahmen gespeichert werden?" / "… des Kunden als Verantwortlichem."
- Problem: HU has neither the clause nor the two FAQs. The clause reads like a DSGVO-compliance assurance (AGENTS.md forbids promising GDPR compliance). It also adds legal content through translation, which the owner's decision of 2026-10-18 rules out. The faq[9] grammar is wrong (the appositive must be accusative: "als Verantwortlichen").
- Fix: Delete "— im Einklang mit den Grundsätzen der DSGVO und dem in Ungarn anwendbaren Rechtsrahmen", ending the sentence with "… und den Datenschutzrahmen des Kunden abgestimmt." Remove FAQ [9] and [10] from the visible page and the JSON-LD until a HU source and legal sign-off exist.
- Status: KNOWN (DES-003, DES-004)
- Confidence: high

### COPY-DE-002 — Remote monitoring is upgraded to a "24/7-Leitstelle" with "aufgeschaltete" sites
- Severity: P1
- Category: claim/proof
- Where: /de/szolgaltatasok/tavfelugyelet-vonuloszolgalat — valueProposition, longDesc ¶1, includedItems[0], trustItems[0], faq[0]; /de homepage card + `ItemList` JSON-LD on all 14 DE pages
- Evidence: "Avenir bearbeitet mit einer 24/7-Leitstelle die Alarm-, Einbruch- und Kamerameldungen der aufgeschalteten Standorte; jede Meldung durchläuft einen geprüften Eskalationsprozess …"; "Avenir stellt für die aufgeschalteten Standorte einen 24/7-Meldungsempfang sicher"; homepage card: "Bearbeitung von Alarm- und Kamerasignalen mit Leitstellenunterstützung, bei Bedarf mit Reaktion vor Ort, nach abgestimmten Protokollen."
- Problem: HU says "24/7 diszpécseri háttérrel kezeli … csatlakoztatott helyszínek". To German buyers, "Leitstelle" together with "Aufschaltung" signals a certified alarm-receiving centre (NSL), which goes beyond the approved claim "24/7 diszpécseri háttér". "Geprüft" adds an audit connotation.
- Fix: "Avenir bearbeitet die Alarm-, Einbruch- und Kamerameldungen der angebundenen Standorte mit 24/7-Dispositionsunterstützung; jede Meldung durchläuft einen kontrollierten Eskalationsprozess, und die Maßnahmen werden im Ereignisprotokoll festgehalten." Use "angebunden" and "gemäß der vereinbarten Konfiguration der Fernüberwachung" throughout. Use the related-card wording for the homepage card (see COPY-DE-003).
- Status: KNOWN (DES-002, DES-006, DES-029, EDU-002)
- Confidence: high

### COPY-DE-003 — Homepage service cards and the ItemList JSON-LD carry old copy that is not a translation of HU
- Severity: P1
- Category: claim/proof, mistranslation
- Where: https://www.afm.hu/de "Unsere Dienstleistungen" cards; `ItemList` JSON-LD on every /de page
- Evidence:
  - "Personen- und Sachschutz mit geschulten Sicherheitskräften …"
  - "Planung, Installation und Wartung von Videoüberwachungs-, Zutrittskontroll- und Alarmanlagen …"
  - "… mit unabhängiger Bewertung und strukturiertem Reporting."
  - "… Paketannahme und Mieterkommunikation …"
  - "Organisation von Reinigungs-, Grünpflege- und Hausmeisterleistungen …"
  - "… kleineren Reparaturarbeiten …"
  - JSON-LD names "Personeller Objektschutz", "Veranstaltungsschutz"
- Problem: These cards add services or claims that HU does not make: personal protection, installation and maintenance, "independent" assessment, tenant communication, caretaker services, own repairs. They also drop HU elements such as the service log, escalation, verification and written reporting. `lib/i18n/de.ts` services[0], [2] and [6] already hold HU-faithful text, yet production still renders the old wording. The DB `homepageServiceOverlay` takes precedence, so the fix must go through the staging DB first.
- Fix: Write the HU-faithful texts to staging, then to production after approval. Examples: "Objektschutz vor Ort mit Zutrittskontrolle, Kontrollgängen, Vorfallbearbeitung, Dienstbuch und abgestimmter Eskalationsordnung." / "Sicherheitstechnik für Kamerasysteme, Zutrittskontrolle und Alarmprozesse, eingebettet in ein standortgerechtes Sicherheitsmodell, mit technischer Planung, die Datenschutzaspekte einbezieht." / "Mystery Shopping und Serviceaudit in realen Kunden- und Betriebssituationen, mit strukturierter Beobachtung, Berichtswesen und Verbesserungsempfehlungen." The JSON-LD names should use the canonical labels.
- Status: KNOWN (EDU-003, EDU-004, EDU-007, EDU-017)
- Confidence: high

### COPY-DE-004 — D&B stat label does not match the approved wording
- Severity: P2
- Category: claim/proof
- Where: /de stats tile 3 (`de.ts stats[2].l`)
- Evidence: "AA / Hohe Bonitätsbewertung (D&B)"
- Problem: `verified_claims.md` approves "D&B High Creditworthy 2026" for DE. The DE label is a paraphrase and drops the year the rating is tied to.
- Fix: "D&B High Creditworthy 2026"
- Status: KNOWN (EDU-009)
- Confidence: high

### COPY-DE-005 — "Werktag" widens the approved next-business-day promise and contradicts "Arbeitstagen"
- Severity: P2
- Category: claim/proof, terminology
- Where:
  - /de contact helper
  - service quote modal (`DE_REVIEW_SERVICE_QUOTE_COPY.nextStepHelper`)
  - /de/szolgaltatasok/objektumorzes and /portaszolgalat processSteps[0]
  - /de/aszf §3
  - versus /de/aszf §10
- Evidence: "… spätestens jedoch am nächsten Werktag melden wir uns bei Ihnen." / §3 "nimmt spätestens am nächsten Werktag … Kontakt … auf" vs §10 "innerhalb von 8 Arbeitstagen"
- Problem: HU says "munkanap", which is a business day. "Werktag" includes Saturday, so a Friday enquiry would carry a Saturday promise. The same DE document also uses both terms. The main-clause order in the helper is clumsy.
- Fix: "Innerhalb der Geschäftszeiten antworten wir in der Regel noch am selben Tag, spätestens jedoch am nächsten Arbeitstag." Apply everywhere, and update the APPROVED test strings in `tests/response-time-governance.test.ts`, with owner sign-off.
- Status: KNOWN (DES-005, DES-044, EDU-010)
- Confidence: high

### COPY-DE-006 — "Über Avenir" value-pillar texts are not translations of HU
- Severity: P2
- Category: mistranslation
- Where: /de "Über Avenir" pillars (`de.ts values[0..2].d`)
- Evidence: "Klare Abläufe, nachvollziehbare Dokumentation und regelmäßige Abstimmung unterstützen die steuerbare Standortbetreuung." / "Bei Abweichungen, Vorfällen oder Änderungsbedarf zählen klare Eskalationswege und verantwortliche Ansprechpartner."
- Problem: HU (and EN) promise documented processes, regular reports, clear responsibility points, and "dokumentálunk, visszajelzünk, segítünk megelőzni". The DE text carries different content.
- Fix: [0] "Dokumentierte Abläufe, regelmäßige Berichte und klare Verantwortlichkeiten – damit Sie jederzeit wissen, was am Standort geschieht." [1] "Geschultes Personal, standortspezifische Protokolle und kontrollierte Leistungserbringung in Industrie-, Logistik- und Handelsumgebungen." [2] "Bei Vorfällen sind wir nicht nur präsent: Wir dokumentieren, melden zurück und helfen, wiederkehrende Probleme zu vermeiden."
- Status: KNOWN (EDU-008)
- Confidence: high

### COPY-DE-007 — Career block: du/Sie mix, calques, job ads without (m/w/d), "Budapest, Land"
- Severity: P2
- Category: grammar/register, legal-consistency
- Where: /de "Karriere"
- Evidence: "WERDE TEIL UNSERES TEAMS" (next to "Bitte lesen Sie …"); "Wir bieten einen stabilen Hintergrund, legale Beschäftigung …"; "Sicherheitsmitarbeiter", "Reinigungs-Teamleiter", "Empfangsleiter"; "Budapest, Land"
- Problem: This is the only du-form on the DE site. "Legale Beschäftigung" implies that employment elsewhere is illegal. German job ads conventionally use gender-neutral titles (AGG). "Land" does not render the HU "országosan" (nationwide).
- Fix: "Werden Sie Teil unseres Teams" · "Wir bieten einen sicheren Arbeitsplatz, eine ordnungsgemäß angemeldete Beschäftigung, fundierte Einarbeitung und Entwicklungsmöglichkeiten." · "Sicherheitsmitarbeiter (m/w/d)", "Teamleitung Reinigung (m/w/d)", "Facility-Management-Ingenieur (m/w/d)", "Empfangsleitung (m/w/d)" · "Budapest / landesweit"
- Status: KNOWN (EDU-018, EDU-019)
- Confidence: high

### COPY-DE-008 — Wrong DSGVO term "Vertreter" for the managing director; name order and DPO gender inconsistent
- Severity: P2
- Category: legal-consistency, terminology
- Where: /de/adatvedelem §2, §3; /de/impresszum §2
- Evidence:
  - privacy §2: "2. Vertreter des Verantwortlichen" / "Vertreter: Attila Kovács, Geschäftsführer"
  - privacy §3: "3. Datenschutzbeauftragter (Data Protection Officer, DPO)" / "einen Datenschutzbeauftragten benannt" vs "Datenschutzbeauftragte: Fanni Csegény"
  - Impressum §2: "Kovács Attila, Geschäftsführer"
- Problem: In the DSGVO, "Vertreter" means the EU representative under Art. 27, which is a different role. The DPO's gender switches within §3. The name order differs between the two pages.
- Fix: "2. Gesetzlicher Vertreter des Verantwortlichen" / "Vertretungsberechtigt: Attila Kovács, Geschäftsführer"; "3. Datenschutzbeauftragte (Data Protection Officer, DPO)" / "eine Datenschutzbeauftragte benannt"; use "Attila Kovács" on both pages.
- Status: KNOWN (DEB-022, DEB-030, DEB-031)
- Confidence: high

### COPY-DE-009 — Impressum "Letzte Aktualisierung" date differs from HU
- Severity: P2
- Category: legal-consistency
- Where: /de/impresszum header
- Evidence: "Letzte Aktualisierung: 5. Juni 2026" (HU: "Utolsó frissítés: 2026. április 28.")
- Problem: The DE page shows a date that the authoritative HU text does not support.
- Fix: "Letzte Aktualisierung: 28. April 2026", or "Letzte Aktualisierung der ungarischen Fassung: 28. April 2026".
- Status: KNOWN (DEB-024)
- Confidence: high

### COPY-DE-010 — National security register review deadline has passed but is still shown as current
- Severity: P2
- Category: legal-consistency
- Where: /de/aszf §5 d); /de/impresszum §6 d) (same in HU)
- Evidence: "Überprüfung verpflichtend bis 30.06.2026" / "Überprüfung verpflichtend bis — 30.06.2026"
- Problem: The date is before today (2026-10-18). The owner reports a new decision valid until 2029, but its number and date are missing.
- Fix: Update HU first, then DE, with the new reference number, date and validity.
- Status: KNOWN (DEB-018)
- Confidence: high

### COPY-DE-011 — Related-service cards show neither the HU card text nor the HU-faithful DE text that already exists
- Severity: P2
- Category: mistranslation, correctness (render source)
- Where: all 8 /de/szolgaltatasok/* "Verwandte Leistungen" cards. Renderer: `app/[locale]/szolgaltatasok/[slug]/page.tsx:163-167` (`getReviewServiceDetail(locale, relatedSlug)` → `.shortDesc`). Unused data: `lib/services/de-service-details.ts:1101-1321` (`DE_REVIEW_RELATED_SERVICES_BY_SOURCE_SLUG`); `getDeReviewRelatedServicesForServiceSlug` has no caller.
- Evidence: rendered Soft FM card: "Soft-FM-Leistungen mit Reinigungskoordination, Grünpflege, Hygieneprozessen, operativer Unterstützung und Berichtswesen." HU card: "Soft FM takarítási, kertészeti, higiéniai, hulladékkezelési támogatási és szolgáltatókezelési feladatokra, egyeztetett scope-pal, minőségellenőrzéssel és írásos riportálással." The unused DE copy reads: "Soft FM für Reinigung, Grünpflege, Hygiene, Unterstützung bei der Abfallentsorgung und Dienstleistersteuerung, mit vereinbartem Leistungsumfang, Qualitätskontrolle und schriftlichem Berichtswesen."
- Problem: The rendered DE card text translates HU *seoDescription*, not the HU card shortDesc. Waste handling, provider management, agreed scope and written reporting drop out (same pattern for Fernüberwachung, Sicherheitstechnik and Empfang). As a result, each service has three different DE descriptions: the homepage overlay, the related card, and the unused HU-faithful copy. EDU-007's proposed fix assumes the related cards already show the HU-faithful text, but they do not.
- Fix: Render related cards from `DE_REVIEW_RELATED_SERVICES_BY_SOURCE_SLUG` (or copy those strings into `detail.shortDesc`). Use the same strings for the homepage overlay, so each service has a single DE short description.
- Status: NEW
- Confidence: high

### COPY-DE-012 — Quote modal: no privacy line, and its microcopy differs from the main form
- Severity: P2
- Category: legal-consistency, grammar
- Where: service-page "Angebot anfordern" modal (`lib/services/de-service-shared-copy.ts`); main-form errors in `de.ts form.errors`
- Evidence: no Datenschutz reference in the modal; "Wird gesendet..."; "Name" vs "Vollständiger Name"; "… oder rufen Sie uns an." (no number); "Bitte geben Sie Ihren vollständigen Namen ein" (no final period) vs "Bitte geben Sie Ihren Namen an." (with period)
- Problem: The modal collects name, e-mail, phone and message without any reference to the privacy notice, unlike the main form. Ellipsis, labels and punctuation are also inconsistent.
- Fix: Under the button: "Informationen zur Verarbeitung Ihrer Daten finden Sie in unserer [Datenschutzerklärung]." · "Wird gesendet…" · "Vollständiger Name" · "… oder rufen Sie uns an: +36 70 316 8218." · end every error message with a period.
- Status: KNOWN (EDU-020, EDU-038, DES-043)
- Confidence: high

### COPY-DE-013 — DE-only language clause, and a footer claiming "maschinell übersetzt" on hand-edited legal pages
- Severity: P3
- Category: legal-consistency
- Where: /de/adatvedelem intro; footer on all 14 DE pages
- Evidence: "Maßgebliche Sprache: Die maßgebliche Fassung dieser Erklärung ist der ungarische Text …" / "Diese Seite wurde maschinell aus dem Ungarischen übersetzt. Rechtlich verbindlich ist ausschließlich die ungarische Fassung."
- Problem: The HU privacy notice has no language clause, so this is a DE-only legal insertion. The "maschinell" claim is probably untrue for the reviewed legal and service texts.
- Fix: Footer: "Diese Seite ist eine Übersetzung aus dem Ungarischen. Rechtlich verbindlich ist ausschließlich die ungarische Fassung." Get legal approval for the clause, or add it to HU as well.
- Status: KNOWN (DEB-029, EDU-045)
- Confidence: medium

### COPY-DE-014 — Literal calques in legal text; one further occurrence of "ohne unangemessene Verzögerung"
- Severity: P3
- Category: terminology (DSGVO)
- Where: /de/adatvedelem §7, §9, §11, §12; **also /de/aszf §4** (not listed in DEB-036)
- Evidence: "Anbieter mit US-Hintergrund"; "glaubhaft nachweisen"; "ohne unangemessene Verzögerung, spätestens jedoch innerhalb eines Monats"; "gewöhnlichen Aufenthaltsort"; ÁSZF §4: "erforderlichenfalls werden sie ohne unangemessene Verzögerung gelöscht, anonymisiert …"
- Problem: Art. 12(3) of the German DSGVO says "unverzüglich". HU "tartózkodási hely" means Aufenthaltsort, not "gewöhnlicher". "US-Hintergrund" is a literal calque.
- Fix: "Anbieter mit Sitz oder Muttergesellschaft in den USA"; "nachweisen"; "unverzüglich, spätestens jedoch …" (also in ÁSZF §4: "… unverzüglich gelöscht, anonymisiert …"); "Wohnsitz oder Aufenthaltsort".
- Status: KNOWN (DEB-036; ÁSZF §4 is an extra occurrence)
- Confidence: high

### COPY-DE-015 — Small fidelity gaps in the privacy notice
- Severity: P3
- Category: mistranslation (legal)
- Where: /de/adatvedelem 4.2, §5, 6.4
- Evidence: "… wegen eines Sicherheitsvorfalls oder zur Geltendmachung von Rechtsansprüchen"; "… die Anfrage ohne diese Daten erneut zu übermitteln"; "… soweit nach den für Google Analytics geltenden Vertrags- und Nutzungsbedingungen einschlägig."
- Problem: HU "jogi igény" also covers defending against claims. HU asks the person to *clarify* the request ("pontosítását"), not to resend it. The "soweit … einschlägig" wording adds uncertainty that HU does not have.
- Fix: "… oder wegen Rechtsansprüchen (Geltendmachung oder Abwehr)"; "… die Anfrage ohne diese Daten zu präzisieren"; "… gemäß den für Google Analytics geltenden Vertrags- und Nutzungsbedingungen."
- Status: KNOWN (DEB-037)
- Confidence: high

### COPY-DE-016 — English fragments in German legal text
- Severity: P3
- Category: terminology
- Where: /de/adatvedelem 6.1, 6.2, version history
- Evidence: "Ort der Verarbeitung: EU Frankfurt (Sending Region)"; "EU Edge Regions (konfiguriert)"; "keine Änderung des Analytics-Runtime-Verhaltens"
- Problem: Untranslated English. "Runtime" is not listed in DEB-035.
- Fix: "Frankfurt am Main, EU (Versandregion)"; "Edge-Regionen in der EU (konfiguriert)"; "keine Änderung des technischen Verhaltens der Analyse".
- Status: KNOWN (DEB-035; "Runtime" is a new occurrence)
- Confidence: high

### COPY-DE-017 — Quotation marks, number ranges and address/phone formats
- Severity: P3
- Category: typography
- Where: /de/adatvedelem §9, §1, §12; /de/aszf §7; /de/impresszum §1, §3, §4, §7, §8; footer (all pages)
- Evidence: "Recht auf Löschung („Recht auf Vergessenwerden")" (ASCII closing quote; the ÁSZF quotes are now correct); "Falk Miksa utca 9-11"; "Könyves Kálmán krt. 48-52"; privacy "Királyok útja 291, Gebäude B, Tür 15" vs Impressum and footer "Királyok útja 291. B. ép. 15. ajtó"; "+36 1 391 1400" vs "+36 (1) 391-1400"; "Pf. 9" vs "Pf.: 9"
- Problem: A German closing quote is missing. Ranges use a hyphen instead of an en dash. The Hungarian abbreviations mean nothing to German readers, and formats differ between the DE pages.
- Fix: „Recht auf Vergessenwerden“; "9–11", "48–52"; use "Királyok útja 291, Gebäude B, Tür 15, 1039 Budapest, Ungarn", "+36 1 391 1400" and "Pf. 9" everywhere, including the footer.
- Status: KNOWN (DEB-032, DEB-033 partly fixed, DEB-034, EDU-042)
- Confidence: high

### COPY-DE-018 — Impressum: missing "lit. g", redundant "BM", Hungarian-style dots, HU copyright line missing
- Severity: P3
- Category: legal-consistency
- Where: /de/impresszum §5, §7 a), §10
- Evidence: "Die Angaben erfolgen gemäß § 4 des ungarischen Gesetzes Nr. CVIII von 2001 …"; "Verordnung des Innenministeriums Nr. 22/2006 (IV. 25.) BM"; "Regierungsverordnung Nr. 329/2007. (XII.13.) § 12 Abs. 3 lit. c"; §10 "Ihre Verwendung über den persönlichen, nicht kommerziellen Gebrauch hinaus bedarf der vorherigen schriftlichen Zustimmung des Dienstleisters."
- Problem: HU §5 cites "Ekertv. 4. § g". HU §10 is "© 2026 … Minden jog fenntartva … (1999. évi LXXVI. tv.)". DE §10 drops that line and adds a usage clause that the HU Impressum does not contain. ÁSZF §11 already has "§ 4 lit. g", so only the Impressum is left to fix.
- Fix: "gemäß § 4 lit. g Ekertv."; "Nr. 22/2006 (IV. 25.)"; "Nr. 329/2007 (XII. 13.)"; §10: "© 2026 Avenir Facility Management Kft. Alle Rechte vorbehalten. Der gesamte Inhalt der Website ist urheberrechtlich geschützt (ungarisches Gesetz Nr. LXXVI von 1999)."
- Status: KNOWN (DEB-039)
- Confidence: high

### COPY-DE-019 — "Personen- und Vermögensschutz" vs "Personen- und Sachschutz"
- Severity: P3
- Category: terminology (legal-sensitive)
- Where: /de/szolgaltatasok/objektumorzes longDesc ¶3, trust[5], faq[6]; tavfelugyelet faq[4]; /de/aszf §5 a), §11; /de/impresszum §5, §6 a); /de homepage card
- Evidence: "nach dem anwendbaren ungarischen Regulierungsrahmen für Personen- und Vermögensschutz" (8×) vs homepage "Personen- und Sachschutz"
- Problem: In German, "Vermögensschutz" mostly suggests financial asset protection. The same concept also appears under a second term.
- Fix: Service pages: "nach dem anwendbaren ungarischen Rechtsrahmen für Sicherheits- und Bewachungsdienstleistungen". Keep a single legal term on the legal pages after legal review.
- Status: KNOWN (DES-013)
- Confidence: medium

### COPY-DE-020 — Known service-page calques and term issues, all still live (confirmed 2026-10-18)
- Severity: P3
- Category: grammar, terminology
- Where: 8 DE service pages
- Evidence (one per id):
  - "Testfahrt" without context (DES-007)
  - "mit kontrollierter Zutrittskontrolle" (DES-012)
  - "Dienstbuch" (DES-014)
  - "Objektschutz vor Ort" / "Serviceaudit" label decision (DES-015)
  - "Reaktionsprozess vor Ort sicherstellen kann" (DES-016)
  - "Zutritts- und Austrittskontrolle", "wie Ein- und Austritt protokolliert werden" (DES-017)
  - "Lieferverkehr" for HU teherforgalom, also objektumorzes faq[1] and faq[3] (DES-018)
  - "stets aktuelle Informationen" (DES-020)
  - "Einzelhandels- und Einkaufszentrumsumgebungen", "erhöht risikobehaftete Standorte" (DES-021)
  - "der erste Betriebspunkt", "sicherheitsseitig konsequent funktioniert" (DES-022)
  - "die angemessene Information Bestandteil", "Berücksichtigung der Besucherdaten-Aspekte" (DES-023)
  - "Pforten-/Pförtner-" (DES-024)
  - "Speicherlogik" vs "zeitlich begrenzte Aufbewahrung" (DES-025)
  - "Was bedeutet Sicherheitstechnik in der Leistung von Avenir?" (DES-026)
  - "an die … Managementsysteme anschließen", "Meldungsbearbeitungs- und Eskalationsordnung" (DES-027)
  - "reale Ereignisse" (DES-028)
  - "geprüften Eskalationsprozess", "rückverfolgbar" (DES-029)
  - "Geschäftsvorgang", "Vor-Ort-Bedienprozessen", "disziplinarischer Beweis", "Service-Customer-Journeys" (DES-032)
  - "besonders geschützten Bereichen" (DES-033)
  - "Geschäftsevents", "Events" (DES-034)
  - "Veranstaltungsleitung" (DES-036)
  - "Während der Mobilisierung", "PPM-Terminplan" (DES-037)
  - "verdeckte Rückübertragung", and the elliptical "… funktionieren oder gemeinsam mit … am selben Standort." (DES-038)
  - "To-dos", "statt offenem Betrieb", "Serviceniveau am Tag" (DES-039)
  - "koordinierte Erbringung" (DES-040)
- Problem: Each phrase is still live, wording as in the row it is listed with.
- Fix: As proposed in each row.
- Status: KNOWN (DES-007, DES-012, DES-014–018, DES-020–029, DES-032–034, DES-036–040)
- Confidence: high

### COPY-DE-021 — English em dash used as the German Gedankenstrich
- Severity: P3
- Category: typography
- Where: about 60 occurrences: service valueProps, metas, homepage "Über Avenir", privacy/ÁSZF/Impressum, legal-page titles "Datenschutzerklärung — Avenir …"
- Evidence: "Alarmprozesse — abgestimmt mit Objektschutz und Pförtnerdienst."; "… landesweit im Einsatz — in Unternehmens-, …"
- Problem: German typography uses a spaced en dash (–). The Hard/Soft FM names already use "–", so the site mixes both.
- Fix: Replace " — " with " – " throughout, including the title separators.
- Status: KNOWN (DES-041)
- Confidence: high

### COPY-DE-022 — Section titles and navigation labels
- Severity: P3
- Category: terminology
- Where: service pages; nav; news pages
- Evidence: "Vertrauenselemente"; "Verwandte Leistungen" (services) vs "Verwandte Dienstleistungen" (news); nav "NEWS" vs "Aktuelles" vs "Aktuelles und Fachbeiträge"; breadcrumb "Startseite › News"
- Problem: Calqued section title, and the same concept appears under three names.
- Fix: "Darauf können Sie sich verlassen"; use "Weitere passende Leistungen" in both places; nav and breadcrumb "Aktuelles".
- Status: KNOWN (DES-042, EDU-036, EDU-037)
- Confidence: high

### COPY-DE-023 — Compound hyphenation and aria-label capitalisation
- Severity: P3
- Category: grammar/spelling
- Where: /de certificates block + aria-labels; /de/hirek meta and intro; logo aria-label
- Evidence: "ISO 9001 Qualitätsmanagementsystem-Zertifikat"; "im Rahmen des IAF MLA-Abkommens"; "Avenir Neuigkeiten, Fachbeiträge …"; aria "Avenir Startseite"; aria "ISO 9001 — ISO 9001 Qualitätsmanagementsystem-Zertifikat, Ausgestellt von …, Gültig bis …"
- Problem: Missing Durchkopplung in compounds with a proper name or abbreviation. "ISO 9001" is duplicated in the aria-label, and "Ausgestellt"/"Gültig" are capitalised mid-sentence.
- Fix: "Zertifikat für das Qualitätsmanagementsystem nach ISO 9001"; "IAF-MLA-Abkommens"; "Avenir-Neuigkeiten"; "Avenir-Startseite"; aria "Zertifikat für das Qualitätsmanagementsystem nach ISO 9001, ausgestellt von …, gültig bis …".
- Status: KNOWN (EDU-031, EDU-032)
- Confidence: high

### COPY-DE-024 — Homepage terminology and parity details
- Severity: P3
- Category: terminology, mistranslation
- Where: /de hero, meta, about, news teaser, references, certificates intro
- Evidence: "OBJEKTSCHUTZ · SICHERHEITSTECHNIK · FACILITY MANAGEMENT" (HU "… · AUDIT"); META "… Vor-Ort-Audits und FM-Unterstützung in Ungarn"; title "… — Objektschutz und FM"; "Avenir bündelt Ihren Sicherheitsbetrieb aus einer Hand"; "Streifendienste, Ereignismanagement"; "Unternehmensupdates, Branchennotizen und ausgewählte Mitteilungen"; "Freigegebene Kundenreferenzen."; "Unsere Abläufe … werden … überprüft."
- Problem:
  - The glossary marks "Vor-Ort-Audit" as do-not-use.
  - "Objektschutz" is used both as a generic term and as a service name.
  - "Streifendienste" and "Ereignismanagement" do not match "Kontrollgänge" and "Vorfallbearbeitung" on the service pages.
  - The news teaser drops HU "új referenciák".
  - The references intro reads like internal workflow text.
  - The certificates intro shifts the scope from management systems to processes.
- Fix: META "Sicherheitsdienstleistungen, Sicherheitstechnik, Serviceaudits und FM-Unterstützung in Ungarn. …"; tagline "Sicherheit und FM"; "Avenir organisiert Ihre Sicherheitsabläufe aus einer Hand: …"; "Kontrollgänge, Vorfallbearbeitung"; "Unternehmensnachrichten, Branchenthemen, neue Referenzen und Mitteilungen."; "Mit Zustimmung der Kunden veröffentlichte Referenzen."; "Unsere Managementsysteme für Qualität und Informationssicherheit werden von unabhängigen Zertifizierungsstellen auditiert."
- Status: KNOWN (EDU-016, EDU-017, EDU-029, EDU-033, EDU-034, EDU-035, EDU-040)
- Confidence: high

### COPY-DE-025 — ISO 9001 scope quoted in English with ASCII quotes on the German page and in JSON-LD
- Severity: P3
- Category: mistranslation, claim/proof presentation
- Where: /de certificates card; `EducationalOccupationalCredential.description` JSON-LD on all 14 DE pages (DB `descriptionDe`)
- Evidence: 'Der im Zertifikat angegebene Geltungsbereich lautet "Comprehensive security services".' (HU: 'hatókör megnevezése: "Teljes körű biztonsági szolgáltatás"')
- Problem: The over-claims recorded in EDU-021 and DEB-026 are gone from production: no "Kameradaten", "umfasst umfassende" or "ISO/IEC 27001:2022" in any DE page JSON. What remains is an English scope in German copy, with ASCII quotes. FR and KO translate the scope (`lib/certification-translations.ts`: « Services de sécurité complets »).
- Fix: 'Der im Zertifikat angegebene Geltungsbereich lautet „Teljes körű biztonsági szolgáltatás“ (umfassende Sicherheitsdienstleistungen).' Apply on staging, then production.
- Status: KNOWN (EDU-021 residual)
- Confidence: high

### COPY-DE-026 — Unrendered legacy DE legal strings in `de.ts` contain errors
- Severity: P3
- Category: correctness (regression risk)
- Where: `lib/i18n/de.ts:208-343` (`legal.privacy`, `legal.terms`, `legal.impressum`); `lib/de-legal-content.ts:160` loads "datenschutzerklaerung-de-v1.2.md" for v1.3 content
- Evidence: "auf die Kontakt- und Angebotsanfrage-Flow"; "Bei US-incorporated Anbietern"; "Garantien: GDPR Art. 45"; "keine Analyse-, Marketing-, Retargeting- oder Profiling-Cookies"; "substantielle Antwort innerhalb 8 Werktagen"; "Hauptstadtgericht Budapest"; "Personen- und Eigentumsschutz"; "Lizenznummer"
- Problem: The markdown overrides these strings today, but they contradict the rendered text (GA4 consent, 8 Arbeitstage, court name) and contain grammar errors. "Flow" is used with feminine "die" instead of masculine.
- Fix: Delete the legacy legal block from `de.ts`, or sync it to the markdown. Rename the file to `datenschutzerklaerung-de-v1.3.md`.
- Status: KNOWN (DEB-041)
- Confidence: high

### COPY-DE-027 — Legal-page meta descriptions are machine-cut; Impressum meta is raw table text
- Severity: P3
- Category: SEO (noindex page; visible in social previews)
- Where: /de/impresszum, /de/adatvedelem, /de/aszf `<meta name="description">` and og:description; code `app/[locale]/impresszum/page.tsx:41-42` (`sections[0].body.slice(0, 160)`), same at `:268` for the JSON-LD pageDescription
- Evidence: Impressum: "Offizieller Firmenname: Avenir Facility Management Szolgáltató Korlátolt Felelősségű Társaság\nKurzbezeichnung laut Handelsregister: Avenir Facility Kft.\nMarketi"; privacy: "… personenbezogenen Daten verarbeitet, insbesonder"; ÁSZF: "… sowie zu den auf der Website veröffentlichten "
- Problem: Each description is cut mid-word, and the Impressum one also contains line breaks. HU has a written Impressum description.
- Fix: Use dedicated DE strings. Impressum: "Impressum der Avenir Facility Management Kft.: Unternehmensdaten, Vertretung, Genehmigungen, Aufsichtsbehörden und Hosting." Privacy: "Wie die Avenir Facility Management Kft. personenbezogene Daten aus dem Kontakt- und Angebotsprozess auf www.afm.hu verarbeitet." ÁSZF: "Rechtliche Hinweise zur Nutzung von www.afm.hu und zum Kontakt- und Angebotsanfrageprozess."
- Status: NEW
- Confidence: high

### COPY-DE-028 — Capitalisation error in a hyphenated compound adjective
- Severity: P3
- Category: spelling
- Where: /de/szolgaltatasok/mystery-shopping-helyszini-audit processSteps[0].body
- Evidence: "Wir legen fest, welche geschäftliche, servicequalitäts- oder compliance-bezogene Frage das Audit beantworten soll …"
- Problem: In a hyphenated compound, the noun part keeps its capital letter ("Compliance-bezogene"). Combined with the elided first adjective, the cleaner form is written solid.
- Fix: "… welche geschäftliche, servicequalitäts- oder compliancebezogene Frage …" (or "… Frage zu Geschäft, Servicequalität oder Compliance …").
- Status: NEW
- Confidence: high

### COPY-DE-029 — Mistranslation in the reception FAQ: "Durchgangsbereiche"
- Severity: P3
- Category: mistranslation
- Where: /de/szolgaltatasok/portaszolgalat FAQ [2] answer (FAQPage JSON-LD)
- Evidence: "Der Pförtnerdienst konzentriert sich vor allem auf die Eingangs-, Empfangs- und Durchgangsbereiche …" (HU: "a bejárati, recepciós és napi forgalomkezelési pontokra")
- Problem: HU means the points where daily visitor and delivery traffic is handled, not "passage areas". The meaning shifts toward a location description.
- Fix: "Der Pförtnerdienst konzentriert sich vor allem auf Eingang, Empfang und die Abwicklung des täglichen Personen- und Lieferverkehrs, während …"
- Status: NEW
- Confidence: high

### COPY-DE-030 — Event-security wording: noun pile-up, "Kontaktpunkt" for a person, impersonal "man"
- Severity: P3
- Category: grammar/style
- Where: /de/szolgaltatasok/rendezvenybiztositas processSteps[2].title, trustItems[4], FAQ [5] and [6] answers
- Evidence: "Festlegung der Sicherheitspersonal- und Eskalationsordnung"; "Ein benannter verantwortlicher Kontaktpunkt" / "einen benannten Sicherheitskontaktpunkt"; "Den Detaillierungsgrad des Berichts sollte man zu Beginn der Zusammenarbeit festlegen."; "eine ungewöhnliche Standortanordnung"
- Problem: "Sicherheitspersonalordnung" is not a German term. Every other DE page uses "Ansprechpartner" for a person. The impersonal "man" breaks the formal register. "Standortanordnung" is a calque of "helyszíni elrendezés".
- Fix: "Festlegung von Personaleinsatz und Eskalationsordnung"; "Ein benannter verantwortlicher Ansprechpartner" / "… einen benannten Ansprechpartner für die Sicherheit …"; "Der Detaillierungsgrad des Berichts sollte zu Beginn der Zusammenarbeit festgelegt werden."; "ein ungewöhnliches Veranstaltungslayout".
- Status: NEW
- Confidence: high

### COPY-DE-031 — Clumsy compound "Abfallentsorgungs-Unterstützung"
- Severity: P3
- Category: style
- Where: /de/szolgaltatasok/soft-fm useCases[1]; FAQ [0] answer
- Evidence: "… an denen sich Reinigung, Hygieneprozesse und Abfallentsorgungs-Unterstützung am Schichtbetrieb ausrichten müssen"; "Hygiene- und Abfallentsorgungs-Unterstützung"
- Problem: The hyphenated compound is permissible but reads like a calque. Other places on the same page use "Unterstützung bei der Abfallentsorgung".
- Fix: "… an denen sich Reinigung, Hygieneprozesse und die Unterstützung bei der Abfallentsorgung am Schichtbetrieb ausrichten müssen"; "Unterstützung bei Hygiene und Abfallentsorgung".
- Status: NEW
- Confidence: high

### COPY-DE-032 — Wrong verb, and small modality and strength shifts vs HU
- Severity: P3
- Category: grammar, mistranslation (minor strengthening)
- Where: /de/szolgaltatasok/biztonsagtechnika longDesc ¶2, trustItems[1]; /de/szolgaltatasok/hard-fm FAQ [6] answer
- Evidence: "… prüfen wir, wo sich Zutrittspunkte, schwach kontrollierte Zonen, wiederkehrende Ereignisse, kritische Bereiche und Prozesse befinden, in denen …"; "Die Leistung wird im Einklang mit der sicherheitstechnischen Genehmigung … gestaltet." (HU "alakítható ki"); "… und einen festen Berichtsrhythmus." (HU "riportálási ritmust")
- Problem: Events and processes cannot "sich befinden". DE drops the HU "can" in the licence sentence. "Fest" is not in HU.
- Fix: "… prüfen wir, wo es Zutrittspunkte, schwach kontrollierte Zonen, kritische Bereiche, wiederkehrende Ereignisse und Prozesse gibt, bei denen …"; "Die Leistung kann im Einklang mit der sicherheitstechnischen Genehmigung und den vertraglichen Anforderungen des Standorts gestaltet werden."; "… und einen Berichtsrhythmus."
- Status: NEW
- Confidence: medium

### COPY-DE-033 — Impressum §5 sentence structure
- Severity: P3
- Category: grammar
- Where: /de/impresszum §5
- Evidence: "Die Tätigkeiten Personen- und Vermögensschutz sowie Privatermittlung sind in Ungarn reglementierte Berufe."
- Problem: The nouns are listed without a genitive, which is ungrammatical in German.
- Fix: "Die Tätigkeiten des Personen- und Vermögensschutzes sowie der Privatermittlung sind in Ungarn reglementierte Berufe." (keep the term chosen under COPY-DE-019)
- Status: NEW
- Confidence: high

### COPY-DE-034 — No consistent approach to gender-inclusive language
- Severity: P3
- Category: style/consistency
- Where: site-wide
- Evidence: homepage "Geschulte Mitarbeitende", "Wir suchen Mitarbeitende"; service pages "Mitarbeitern", "Werden Mitarbeiter im Bericht namentlich genannt?", "eigene Mitarbeiter" (8×); legal "Die Nutzerin oder der Nutzer" (2×); "schult den Tester"; "Ansprechpartner"; job titles in the masculine only
- Problem: Three conventions are mixed: participle forms, generic masculine, and paired forms. For a B2B site this is a style decision, but it should apply throughout.
- Fix: Choose one convention and record it in `german_glossary.md`. For example, use neutral forms where they read naturally ("Mitarbeitende", "Beschäftigte", "Testperson", "Nutzende") and keep "Ansprechpartner" as an established term. Job titles: see COPY-DE-007.
- Status: NEW
- Confidence: medium

### COPY-DE-035 — "Reporting" vs "Berichtswesen"; news-article calque and small addition
- Severity: P3
- Category: terminology, mistranslation (minor)
- Where: /de hero, about, homepage cards vs service pages; /de/hirek/megujult-az-avenir-weboldala-es-arculata lead + ¶4
- Evidence: "Vor-Ort-Kontrollen und Reporting", "Ereignismanagement und Reporting" vs "Berichtswesen" on all service pages; "… als verlässlicher und aktueller Informationspunkt für Kunden und Partner."; lead "… präsentieren wir unsere Dienstleistungen transparenter und zugänglicher." (HU only "átláthatóbb tartalommal és korszerűbb weboldallal")
- Problem: Two terms are used for the same concept. "Informationspunkt" is a calque of "információs pont". "Zugänglicher" has no HU source.
- Fix: Use "Berichtswesen" on the homepage too, or "Reporting" everywhere. Article: "… als verlässliche und aktuelle Informationsquelle für Kunden und Partner."; lead "… präsentieren wir unsere Dienstleistungen übersichtlicher."
- Status: NEW (the article's service list is KNOWN under EDU-017)
- Confidence: medium

### COPY-DE-036 — Privacy notice and legal pages use different labels than the form and each other
- Severity: P3
- Category: legal-consistency, terminology
- Where: /de/adatvedelem 4.1 vs contact form; /de/aszf §7 vs /de/impresszum §8
- Evidence: privacy "Verarbeitete Daten: vollständiger Name, Firmenname, E-Mail-Adresse, Telefonnummer, Interessengebiet …" vs form labels "Unternehmen", "Gewünschte Dienstleistung"; ÁSZF "obligatorische Haftpflichtversicherung" vs Impressum "Berufshaftpflichtversicherung" (HU uses "kötelező felelősségbiztosítás" on both)
- Problem: HU uses identical wording in the notice and the form label ("érdeklődési terület"). In DE, a user cannot match the listed data field to the form field.
- Fix: Privacy: "… Unternehmen, E-Mail-Adresse, Telefonnummer, gewünschte Dienstleistung (Interessengebiet) …". Use "Pflicht-Berufshaftpflichtversicherung" on both pages.
- Status: NEW
- Confidence: high

### COPY-DE-037 — Privacy §8 (cookies) is restructured relative to the authoritative HU text
- Severity: P3
- Category: legal-consistency (translation parity)
- Where: /de/adatvedelem §8 (`docs/translations/de/legal/datenschutzerklaerung-de-v1.2.md:136-144`; test-locked at `tests/de-legal-release.test.ts:50`)
- Evidence: "Google Analytics wird nicht vor einer aktiven Einwilligung geladen. Solange keine Einwilligung erteilt wurde, werden keine Google-Analytics-Skripte geladen …"; "Technisch erforderliche Funktionen, die für den Betrieb, die Sicherheit und die Missbrauchsverhinderung der Website notwendig sind, bleiben hiervon unberührt und dienen nicht werblichem Tracking."
- Problem: HU says that measurement does not start before consent, and that GA is not loaded if the user rejects. HU limits the last statement to the contact form's technical solutions and has no "bleiben hiervon unberührt". The DE wording comes from the DEB-020 fix and may well match the real GA4 behaviour. Even so, it is a DE-only legal formulation, and per the owner's 2026-10-18 decision HU is authoritative.
- Fix: Have legal confirm that the DE §8 is acceptable. Otherwise align it to HU: "Die Analysemessung beginnt nicht vor Erteilung der Einwilligung. Lehnt die Nutzerin oder der Nutzer die Analyse vor Erteilung der Einwilligung ab, wird Google Analytics nicht geladen. … Die für den Betrieb und die Sicherheit des Kontaktformulars erforderlichen technischen Lösungen dienen nicht dem werblichen Tracking." If the DE wording is the more accurate one, update HU first.
- Status: NEW (related to DEB-020, closed as JAVITVA_FORRAS)
- Confidence: medium

### COPY-DE-038 — 404 title and news title separators
- Severity: P3
- Category: SEO/UX polish
- Where: DE 404 page; /de/hirek and article `<title>`
- Evidence: 404 TITLE "Avenir Facility Management Kft. — Objektschutz und FM" (the homepage title); "Aktuelles und Fachbeiträge - Avenir Facility Management Kft."; "Avenir mit erneuerter Website und Markenauftritt - Avenir Facility Management Kft." (82 chars)
- Problem: The 404 page reuses the homepage title. The news pages use " - " where the other pages use " — "/" – ". The article title exceeds about 60 characters.
- Fix: "Seite nicht gefunden – Avenir Facility Management Kft."; "Aktuelles und Fachbeiträge – Avenir Facility Management Kft."; "Neue Website und Markenauftritt – Avenir".
- Status: NEW
- Confidence: high

### COPY-DE-039 — Consent banner phrase "an die Analyse übermitteln"
- Severity: P3
- Category: style
- Where: consent banner, all DE pages (`lib/analytics/consent-copy.ts:44`)
- Evidence: "Namen, E-Mail-Adressen, Telefonnummern, Nachrichten oder andere Formularinhalte übermitteln wir nicht an die Analyse."
- Problem: "An die Analyse" is colloquial, since data goes to a tool or provider, not to "the analysis". The wording is owner-approved (commit f9fde6b), so change it only on an owner decision.
- Fix: "… geben wir nicht an Google Analytics weiter."
- Status: NEW
- Confidence: low

## Verified OK
- No du-form outside the careers heading (COPY-DE-007). Sie-form is consistent in the form, modal, FAQs, legal pages and the e-mail reply template ("Guten Tag {Name}," / "Mit freundlichen Grüßen" without a comma, which is correct).
- No guarantee or SLA language. The FAQs explicitly decline a guaranteed repair time, arrival time, conflict-free event and cleaning quality, matching HU. There are no response times beyond next-business-day contact (apart from the Werktag wording, COPY-DE-005).
- Private investigation appears only as a legal or regulatory fact (privacy scope, ÁSZF §4/§5 c, Impressum §5/§6 c). The Mystery Shopping FAQ states "Es handelt sich nicht um Privatermittlung …". There is no Special Services option in the DE form (exactly 8 service options) and no CTA for one.
- No EcoVadis mention and no "DSGVO-konform" anywhere in DE. The only GDPR-assurance-like phrase is COPY-DE-001.
- All legal facts match HU: registry and tax numbers, VAT ID, founding date, phones, DPO, NAIH data, all licence numbers, validity dates and issuers, AH/37595-14/2024-2, the police and AH addresses, the insurer (full name, Cg., policy number), the Vercel address, the GDPR article references, Ptk. § 6:22 / 5 years, Sztv. / 8 years, 12 months / 30 days, 72 hours, 8 Arbeitstage, and the privacy version dates.
- These earlier problems are no longer in any DE page JSON on production: "ISO/IEC 27001:2022", "MARTON Szakértő Iroda", "Eigentumsschutz", "umfasst umfassende", and the "Kameradaten … Finanzdaten" over-claim. That covers DEB-025, DEB-026 and DEB-042, and the over-claim part of EDU-021.
- Fixed in /de/aszf: German quotation marks („Dienstleister“, „Rechtliche Hinweise“, „Resend“); "§ 5/A Abs. 1 lit. b SzVMt."; the full insurer name; "MSZ EN ISO 9001:2015, MSZ ISO/IEC 27001:2023"; third-party addresses; "§ 4 lit. g Ekertv." (DEB-038 and parts of DEB-033/DEB-039).
- The "Ablehnen" and "Cookie-Einstellungen" labels in the privacy notice match the consent banner and the footer button.
- Every DE service FAQ question has a corresponding answer, and the FAQ count matches HU except on Sicherheitstechnik (COPY-DE-001).
- Service names are consistent across nav, footer, cards, form options, H1, aria-labels and `DE_SERVICE_LIST_LABELS`. Only the JSON-LD ItemList and the news article differ (COPY-DE-003).
- Title lengths are 33–55 characters on all 13 non-article pages. All 14 DE pages are `noindex, follow` with a self-canonical and empty hreflang. `lang="de"` is set.
- Numbers and dates use German formats ("19. März 2026", "31.07.2018", "6. MAI 2026"). There are no stray Hungarian words in running text, only intentional official names given in parentheses.
