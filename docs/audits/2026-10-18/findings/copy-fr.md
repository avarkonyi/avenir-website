# COPY-FR — findings

Coverage:
- Live corpus `S\crawl\text_fr.md` read in full (1 380 lines): shared header/nav, shared footer, homepage, all 8 FR service pages (`/fr/szolgaltatasok/{objektumorzes, portaszolgalat, biztonsagtechnika, tavfelugyelet-vonuloszolgalat, mystery-shopping-helyszini-audit, rendezvenybiztositas, hard-fm, soft-fm}`), every TITLE / META DESCRIPTION / H1, and the "[UI extras — fr]" block (consent banner, placeholders, labels, options, aria-labels, title/alt attributes, localized 404). That is about 680 unique visible text segments.
- The collapsed FAQ answers do not appear in the text corpus. I read all 71 FR FAQ answers (143 sentences) from the FAQPage JSON-LD in `S\crawl\pages\fr__*.json` and in `lib/services/fr-service-details.ts`. I also read every French JSON-LD string: Organization, LocalBusiness, ItemList, Service, BreadcrumbList and Credential.
- Meaning was compared sentence by sentence with the same-path HU pages in `S\crawl\text_hu.md`. The HU FAQ answers came from the HU FAQPage JSON-LD.
- Source scan (repo read-only):
  - `lib/i18n/fr.ts` in full, including strings that are not rendered on /fr (refs, news, success, errors, specialDataWarning);
  - `lib/services/fr-service-details.ts` in full, including the shared serviceDetail copy and the serviceQuote modal copy;
  - the FR entries in `lib/certification-translations.ts`, `lib/analytics/consent-copy.ts`, `lib/schema-locale-copy.ts`, `lib/seo-data.ts`, `lib/not-found-copy.ts`, `lib/runtime-error-copy.ts`, `lib/locale-accessibility.ts`, `lib/locale-ui-helpers.ts` and `lib/email-templates/reply.ts`.
- Links: every link on the 9 FR pages was checked against `S\crawl\index.json`. Light GETs:
  - both certificate PDFs return 200 application/pdf;
  - `/fr/adatvedelem`, `/fr/aszf`, `/fr/impresszum`, `/fr/hirek`, `/fr/recruitment-privacy`, `/fr/megfelelosegi-kozpont`, `/fr/szolgaltatasok/security` and `/fr/szolgaltatasok/helyszini-biztonsagi-audit` all return 404.
- Cross-checked against `docs/audits/2026-10-17/text-audit-open-items.csv` (FR*/FKZ*) and `text-audit-status.csv` (closed FR items, for regressions), `docs/verified_claims.md`, owner confirmations 2026-10-18, and AGENTS.md.
- Not covered:
  - the ServiceQuote modal's success, error and validation states, and the main form's validation and error states, were not rendered live (reviewed from source only);
  - the mobile menu was not rendered;
  - outgoing reply e-mails were reviewed from source only;
  - no form was submitted.

Counts (distinct issues): P0 0 · P1 1 (KNOWN) · P2 10 (1 NEW, 9 KNOWN) · P3 47 (20 NEW, 27 KNOWN incl. 1 residual).

## Findings

### COPY-FR-001 — "Centre de supervision" claim still on the Télésurveillance lead
- Severity: P1
- Category: claim/proof
- Where: https://www.afm.hu/fr/szolgaltatasok/tavfelugyelet-vonuloszolgalat — lead/valueProposition; `lib/services/fr-service-details.ts:217`
- Evidence: "Le centre de supervision d’Avenir traite 24 h/24 et 7 j/7 les alarmes, signaux d’intrusion et signaux des caméras des sites raccordés."
- Problem: HU says "Az Avenir 24/7 diszpécseri háttérrel kezeli…". The approved claim is "24/7 diszpécseri háttér", not an own monitoring centre. This is the last remaining occurrence: the homepage stat now correctly reads "Permanence de dispatching" and the guarding/gatehouse trust cards are fixed.
- Fix: « Avec l’appui d’une permanence de dispatching 24 h/24 et 7 j/7, Avenir traite les alarmes, les signaux d’intrusion et les signaux des caméras des sites raccordés. »
- Status: KNOWN (FRS-001, FKZ-001 — remaining part)
- Confidence: high

### COPY-FR-002 — "prestations sanitaires" reads as healthcare services
- Severity: P2
- Category: mistranslation
- Where: https://www.afm.hu/fr/szolgaltatasok/soft-fm — Prestations incluses [3]; `lib/services/fr-service-details.ts:297`
- Evidence: "Coordination des consommables d’hygiène et des prestations sanitaires" (HU: "Higiéniai fogyóanyagok és mosdóhigiéniai szolgáltatások koordinációja")
- Problem: In French, « prestations sanitaires » usually means health or medical services (the « secteur sanitaire »), not washroom hygiene. A buyer could read it as Avenir coordinating healthcare.
- Fix: « Coordination des consommables d’hygiène et de l’hygiène des sanitaires »
- Status: NEW
- Confidence: medium-high

### COPY-FR-003 — Known P2 items confirmed still live (one line each)
- Severity: P2
- Category: mistranslation / claim drift / terminology
- Where / Evidence / Status:
  - Gatehouse longDesc: "il assure l’accueil et l’enregistrement des visiteurs" (HU "támogathatja"); the "nem egyszerű jelenlét a bejáratnál" framing is lost. KNOWN (FRS-005)
  - Gatehouse longDesc: "documents à établir"; "La limitation des finalités, des durées de conservation et l’information appropriée font partie du traitement des données…". KNOWN (FRS-006)
  - Gatehouse trust title: "Prise en compte des données des visiteurs". KNOWN (FRS-007)
  - Security technology trust: "Cadre d’autorisation des activités techniques" / "La prestation est définie conformément à l’autorisation…". KNOWN (FRS-008)
  - "Service d’intervention propre" (Télésurveillance), "personnel propre" (Soft FM ×2), "la coordination propre d’Avenir" (Hard FM FAQ). KNOWN (FRS-009)
  - "Soft FM — services aux installations" (H1, title, card, footer, dropdown, schema). KNOWN (FRS-010)
  - « accueil » used alone for the gatehouse service: "soutenir le gardiennage, l’accueil ou la télésurveillance", "Lien avec l’accueil, le gardiennage et le Soft FM", "Lien avec l’accueil et les accès", FAQ "…au gardiennage, à l’accueil et aux alertes". KNOWN (FRS-011)
  - Modal success = `fr.form.success`: "…Vos données sont traitées conformément à notre politique de confidentialité." No link and no « (en anglais) »; the HU modal has no privacy sentence. The main form has the same string; HU parity exists there, but it is the only privacy reference on /fr without « (en anglais) ». KNOWN (FRS-013)
  - Homepage Hard FM card: "coordination des sous-traitants spécialisés". KNOWN (FKZ-005)
- Fix: as in the CSV rows. For FRS-013 also use « …conformément à notre politique de confidentialité (en anglais). » on the main form.
- Confidence: high

### COPY-FR-004 — FM / "épületüzemeltetés" rendered four different ways; "gestion des installations" is a calque
- Severity: P3
- Category: terminology
- Where: homepage TITLE + 404 TITLE (`lib/seo-data.ts:125`); aboutText (`fr.ts:24`); hero alt (`fr.ts:16`); schema knowsAbout (`lib/schema-locale-copy.ts:40`)
- Evidence: "Avenir Facility Management Kft. — Sécurité et gestion des installations"; "plusieurs décennies d’expérience dans la gestion des installations et les services de sécurité"; "accompagnement en facility management"; "exploitation des bâtiments et sécurité en Hongrie"; "Gestion intégrée des installations"
- Problem: « gestion des installations » sounds like plant or equipment management to a French FM buyer. The same concept appears as facility management, exploitation des bâtiments and gestion des installations.
- Fix: TITLE « Avenir Facility Management — Sécurité et facility management » (60 characters). aboutText « …dans l’exploitation des bâtiments et la sécurité privée ». knowsAbout « Facility management intégré ».
- Status: NEW
- Confidence: medium

### COPY-FR-005 — Security/FM vocabulary is understandable but not the idiomatic French B2B term
- Severity: P3
- Category: terminology
- Where: all service pages; `lib/services/fr-service-details.ts` (passim)
- Evidence / Fix:
  - "journal de service" (szolgálati napló, 14× in the FR source) → « main courante » (standard French term for the guard log; « main courante électronique » if digital)
  - "vérification des alarmes", "protocole de vérification" (Télésurveillance) → « levée de doute », « protocole de levée de doute »
  - FAQ "Un délai d’arrivée est-il garanti ?" (:244) → « Un délai d’intervention est-il garanti ? »
  - "contrôles obligatoires" (Hard FM, :259, :262) → « contrôles réglementaires » / « vérifications périodiques réglementaires »
  - "contrôle des accès" in the body vs "contrôles d’accès" (:181, :204) vs "Systèmes de contrôle d’accès" (schema) → use « contrôle d’accès » throughout
  - Mystery "forme le testeur" (HU "értékelő") → « forme l’évaluateur »
- Problem: Native buyers will read these as translated text. Using the sector's standard terms raises credibility.
- Status: NEW (FRS-027 covers only spécialistes/CVC)
- Confidence: medium

### COPY-FR-006 — Privacy-notice naming inconsistent; "notice de confidentialité" is a calque
- Severity: P3
- Category: terminology / consistency
- Where: homepage career section (`lib/locale-ui-helpers.ts:112`); footer (`fr.ts:68`); contact form (`fr.ts:63`)
- Evidence: "veuillez lire notre notice de confidentialité pour les candidats (en anglais)" vs "politique de confidentialité (en anglais)" vs "Confidentialité (en anglais)"
- Problem: Three names are used for privacy documents, and « notice de confidentialité » is not idiomatic.
- Fix: « Avant de postuler, veuillez lire notre politique de confidentialité relative aux candidatures (en anglais). » Footer: « Politique de confidentialité (en anglais) ».
- Status: NEW
- Confidence: medium

### COPY-FR-007 — ISO card/JSON-LD descriptions: missing article, ambiguous "Celui-ci", issuer name dropped, word order
- Severity: P3
- Category: grammar / legal-consistency
- Where: homepage Certifications cards + Credential JSON-LD; `lib/certification-translations.ts:8`, `:13`
- Evidence: "ISO 9001 est la norme internationale…"; "MSZ ISO/IEC 27001:2023 est la norme relative aux systèmes de management…"; "…a été audité par l’organisme émetteur indiqué sur le certificat dans le périmètre défini par le certificat. Celui-ci bénéficie d’une reconnaissance internationale…"; "Le système de management de la sécurité de l’information certifié d’Avenir"
- Problem:
  - A standard name needs an article in French.
  - « Celui-ci » can be read as the management system rather than the certificate; HU/EN say "A tanúsítvány" / "The certificate".
  - HU and EN name the issuer (MartonCert / MCert), while FR repeats « certificat » three times.
  - The ISO 27001 sentence drops HU "nemzetközi".
  - « certifié d’Avenir » is awkward.
- Fix:
  - « L’ISO 9001 est la norme internationale relative aux systèmes de management de la qualité. Le périmètre indiqué sur le certificat est « Services de sécurité complets ». Le système de management certifié a été audité par MartonCert Rendszertanúsító Kft. dans le périmètre défini par le certificat. Ce certificat bénéficie d’une reconnaissance internationale dans le cadre de l’accord IAF MLA. »
  - « La norme MSZ ISO/IEC 27001:2023, mentionnée sur le certificat, est la norme internationale relative aux systèmes de management de la sécurité de l’information (SMSI). Le système de management de la sécurité de l’information d’Avenir, certifié, a été audité par MCert Rendszertanúsító Kft. dans le périmètre défini par le certificat. Ce certificat bénéficie d’une reconnaissance internationale dans le cadre de l’accord IAF MLA. »
- Status: NEW (the guillemet spacing in the same string is KNOWN FKZ-017; see COPY-FR-030)
- Confidence: high

### COPY-FR-008 — Homepage "À propos": omission and repetition; "nationwide" and "always" lost
- Severity: P3
- Category: translation drift
- Where: https://www.afm.hu/fr — À propos, values[0]; `fr.ts:24`, `:26`
- Evidence:
  - "Selon les besoins, nous complétons la sécurité par des technologies de sécurité, des visites mystères et un accompagnement en facility management. Nos clients disposent ainsi d’un interlocuteur responsable pour coordonner ces prestations." (HU: "…egy felelős partnerrel dolgozhatnak, nem több különálló szolgáltatóval.")
  - "…plus de 30 sites actifs en Hongrie" (HU "országszerte")
  - "…pour comprendre ce qui se passe sur site." (HU "hogy mindig lássa")
- Problem: The single-partner contrast, which is the core value proposition, is lost; « sécurité … sécurité » repeats; "nationwide" and "always" are dropped.
- Fix:
  - « Selon les besoins, nous complétons ce socle de sécurité par des technologies de sécurité, des visites mystères et un accompagnement en facility management. Nos clients travaillent ainsi avec un seul partenaire responsable plutôt qu’avec plusieurs prestataires distincts. »
  - « …sur plus de 30 sites actifs dans toute la Hongrie… »
  - « …pour que vous sachiez à tout moment ce qui se passe sur site. »
- Status: NEW
- Confidence: high

### COPY-FR-009 — Value pillar "Réactivité et responsabilité" implies speed and drops the HU contrast
- Severity: P3
- Category: translation drift / claim nuance
- Where: https://www.afm.hu/fr — values[2]; `fr.ts:28`
- Evidence: "Réactivité et responsabilité — Lors d’un incident, Avenir assure une présence, documente les faits, rend compte et contribue à réduire les problèmes opérationnels récurrents." (HU "Reagálás és felelősség — Incidens esetén nemcsak jelen vagyunk: dokumentálunk, visszajelzünk, és segítünk megelőzni…")
- Problem: « Réactivité » connotes response speed, which is close to the response-time flavour AGENTS.md avoids. "megelőzni" (prevent) became "réduire".
- Fix: « Réaction et responsabilité — En cas d’incident, nous ne nous contentons pas d’être présents : nous documentons, nous rendons compte et nous aidons à prévenir les problèmes récurrents. »
- Status: NEW
- Confidence: medium

### COPY-FR-010 — Career copy drifts from HU; job title reuses the GTB ambiguity
- Severity: P3
- Category: translation drift / terminology
- Where: https://www.afm.hu/fr — Recrutement; `fr.ts:46`, `:49`
- Evidence: "Nous recherchons des collègues qui respectent leurs engagements et comprennent l’importance d’une présence fiable et d’un travail responsable." (HU "felelősen állnak a műszakhoz, értik a pontos jelenlét és a megbízható munkavégzés jelentőségét"); "une intégration professionnelle" (HU "szakmai betanítás"); "Ingénieur en gestion technique des bâtiments"
- Problem: The adjectives are shuffled (pontos → fiable, megbízható → responsable) and "shift" is lost. « intégration » means onboarding, not training. « gestion technique des bâtiments » (GTB) is also the French term for a BMS system.
- Fix: « Nous recherchons des collègues qui prennent leur poste avec sérieux et comprennent l’importance de la ponctualité et d’un travail fiable. » ; « une formation à la prise de poste » ; « Ingénieur exploitation et maintenance des bâtiments »
- Status: NEW (job-title part relates to KNOWN FKZ-020)
- Confidence: medium

### COPY-FR-011 — Hard FM: "et" instead of "ou"; plumbing term inconsistent; elliptical "si inclus"
- Severity: P3
- Category: translation drift / consistency / grammar
- Where: https://www.afm.hu/fr/szolgaltatasok/hard-fm — longDesc §3, valueProposition, Prestations incluses [4]; `fr-service-details.ts:258`, `:259`, `:262`
- Evidence:
  - "Le Hard FM peut être autonome ou associé au poste de garde, au gardiennage et au Soft FM d’Avenir sur le même site." (HU "…portaszolgálatával, élőerős őrzésével vagy Soft FM szolgáltatásával")
  - "installations sanitaires" (valueProposition, longDesc) vs "plomberie" (included, trust) for HU "vízvezeték"
  - "…des contrôles obligatoires, si inclus dans le périmètre"
- Problem: The FR implies all three services must be combined. The HU contrast "nem széttagolt szolgáltatói visszajelzéseket" is dropped. Two terms are used for plumbing. « si inclus » is clipped administrative style (the Soft FM page correctly uses « s’ils sont inclus »).
- Fix: « …associé à l’accueil et au poste de garde, au gardiennage ou au Soft FM d’Avenir sur le même site. Dans un fonctionnement intégré, … pour donner au client une vue technique cohérente plutôt que des retours fragmentés de plusieurs prestataires. » ; use « plomberie » consistently ; « …des contrôles réglementaires, s’ils sont inclus dans le périmètre »
- Status: NEW
- Confidence: high

### COPY-FR-012 — Event security: "prochaines organisations" ambiguous; "zártkörű" rendered two ways
- Severity: P3
- Category: grammar / consistency
- Where: https://www.afm.hu/fr/szolgaltatasok/rendezvenybiztositas — trust "Bilan et améliorations" (`fr-service-details.ts:160`); homepage card (`fr.ts:33`)
- Evidence: "…points d’amélioration pour les prochaines organisations." ; card "événements d’entreprise, sur invitation ou ouverts au public" vs page "événements d’entreprise, privés ou publics"
- Problem: « organisations » reads as "organisations/companies" (HU "a jövőbeli rendezvénytervezéshez"). The card and the page use different terms for the same event type.
- Fix: « …pour l’organisation des prochains événements. » ; card « Sécurité des événements d’entreprise, privés ou ouverts au public : … »
- Status: NEW
- Confidence: high

### COPY-FR-013 — Soft FM FAQ: elliptical "coordination opérationnelle et prestataires"
- Severity: P3
- Category: grammar
- Where: https://www.afm.hu/fr/szolgaltatasok/soft-fm — FAQ "Qu’est-ce que le Soft FM ?"; `fr-service-details.ts:317`
- Evidence: "Chez Avenir, cela couvre nettoyage, espaces verts, hygiène, soutien à la gestion des déchets, coordination opérationnelle et prestataires dans le périmètre convenu." (HU "…operatív koordinációt és szolgáltatókezelést")
- Problem: « et prestataires » has no head noun (it reads as "coordination and providers"), and the articles are missing.
- Fix: « Chez Avenir, cela couvre le nettoyage, les espaces verts, l’hygiène, le soutien à la gestion des déchets, la coordination opérationnelle et la gestion des prestataires dans le périmètre convenu. »
- Status: NEW
- Confidence: high

### COPY-FR-014 — Data-protection disclaimer narrowed to a vague "examen du client"
- Severity: P3
- Category: legal-consistency
- Where: https://www.afm.hu/fr/szolgaltatasok/biztonsagtechnika — longDesc §3; `fr-service-details.ts:179`
- Evidence: "Ce travail soutient l’examen du client ; le choix de la base légale et les décisions finales restent de sa responsabilité et de celle de ses conseillers." (HU "Ez támogatja az ügyfél adatvédelmi felülvizsgálatát; a jogalap és a végső adatvédelmi döntések az ügyfél és tanácsadói körében maradnak.")
- Problem: The HU qualifier "adatvédelmi" (data-protection review / data-protection decisions) is lost, so the sentence no longer says what is being reviewed. HU legal substance must be reproduced faithfully (owner confirmation 2026-10-18). The sentence makes no compliance promise, so this is a fidelity issue only.
- Fix: « Ce travail appuie l’examen de protection des données mené par le client ; le choix de la base légale et les décisions finales en matière de protection des données restent de la responsabilité du client et de ses conseillers. »
- Status: NEW
- Confidence: high

### COPY-FR-015 — Gatehouse trust card body points back to its heading ("cet appui")
- Severity: P3
- Category: grammar / style
- Where: https://www.afm.hu/fr/szolgaltatasok/portaszolgalat — trust "Appui du dispatching 24 h/24 et 7 j/7"; `fr-service-details.ts:84`
- Evidence: "Le poste de garde peut bénéficier de cet appui ; les procédures de notification…"
- Problem: The body depends on the heading for its antecedent, which fails for screen readers and in schema extraction. The guarding page restates the phrase in full.
- Fix: « L’accueil et le poste de garde peuvent bénéficier de l’appui du dispatching disponible 24 h/24 et 7 j/7 ; les procédures de notification et de remontée des alertes sont définies au début de la collaboration. »
- Status: NEW
- Confidence: high

### COPY-FR-016 — Telegraphic article ellipsis in running prose (pattern across pages)
- Severity: P3
- Category: grammar / style
- Where: all service pages (examples)
- Evidence:
  - "La visite du site permet d’examiner les accès, zones peu contrôlées, événements récurrents, espaces critiques et processus…" (biztonsagtechnika)
  - "Signalements, actions, changements de statut, clôtures et tâches ouvertes sont traçables…" (hard-fm)
  - "Surfaces, fréquences, points de contrôle, exigences de qualité et rythme des rapports sont précisés avant le démarrage." (soft-fm)
  - "Incidents, écarts et besoins de remontée d’alerte sont enregistrés…" (rendezvenybiztositas)
  - "Objectif, scénario, critères et format du rapport sont convenus avant le test…" (mystery)
- Problem: Dropping articles is fine in list items and headings. In body sentences it reads like a spec sheet or a translation.
- Fix: Restore articles in prose, e.g. « …d’examiner les accès, les zones peu contrôlées, les événements récurrents, les espaces critiques et les processus… » ; « Les signalements, les actions, les changements de statut, les clôtures et les tâches ouvertes sont traçables… ». Keep list items as they are.
- Status: NEW
- Confidence: medium

### COPY-FR-017 — Hungarian country name in FR Service JSON-LD
- Severity: P3
- Category: schema / language leak
- Where: all 8 FR service pages, Service `areaServed.name`; `app/[locale]/szolgaltatasok/[slug]/page.tsx:229`
- Evidence: `"areaServed": {"@type": "Country", "name": "Magyarország"}` (the FR homepage LocalBusiness correctly uses "Hongrie" via `schema-locale-copy`)
- Problem: The name is hard-coded in Hungarian for every locale. The same string appears on the indexed EN pages and on the DE/KO/ZH pages.
- Fix: `areaServed: { "@type": "Country", name: getSchemaLocaleCopy(locale).country }`, or use the ISO code "HU" as `lib/homepage-schema.ts:68` does.
- Status: NEW
- Confidence: high

### COPY-FR-018 — Schema `knowsAbout` labels don't match the visible service names
- Severity: P3
- Category: terminology / schema
- Where: FR homepage LocalBusiness `knowsAbout`; `lib/schema-locale-copy.ts:40`
- Evidence: "Audit client mystère", "Services de poste de garde", "Télésurveillance des systèmes d’alarme", "Gestion intégrée des installations" vs H1s "Visites mystères et audit de service", "Accueil et services de poste de garde", "Télésurveillance et intervention"
- Problem: The visible copy and the structured data use different names for the same services.
- Fix: « Visites mystères et audit de service », « Accueil et poste de garde », « Télésurveillance et intervention », « Facility management intégré » (align once FRS-019/FRS-010 are settled).
- Status: NEW
- Confidence: medium

### COPY-FR-019 — D&B stat label is a FR re-phrasing without approved FR wording
- Severity: P3
- Category: claim/proof governance
- Where: https://www.afm.hu/fr — stat tile; `fr.ts:20`
- Evidence: "AA / Solvabilité élevée selon D&B, 2026"
- Problem: `verified_claims.md` lists approved wording only for HU ("D&B magas hitelképességi minősítés") and EN/DE/ZH ("D&B High Creditworthy 2026"). The meaning is faithful and attributed, with no solvency guarantee, but there is no approved FR form. This is the same governance gap as DE EDU-009.
- Fix: Record an approved FR wording in `verified_claims.md` (e.g. « Haute solvabilité D&B 2026 »), or use the approved « D&B High Creditworthy 2026 » label.
- Status: NEW (analogous to EDU-009)
- Confidence: medium

### COPY-FR-020 — Title / meta-description length
- Severity: P3
- Category: SEO polish (noindex surface)
- Where: `/fr` TITLE (71 characters); `/fr/szolgaltatasok/biztonsagtechnika` TITLE (63); `/fr/szolgaltatasok/mystery-shopping-helyszini-audit` META (168). All other FR titles are 32–55 characters and the other metas 125–158.
- Evidence: "Avenir Facility Management Kft. — Sécurité et gestion des installations"; "Visites mystères, audits de marque, trajets tests et audits de service pour examiner l’expérience client, le respect des processus et les points de conformité convenus."
- Problem: These will likely be truncated in a SERP once FR is indexed. The HU homepage title is 53 characters.
- Fix: « Avenir Facility Management — Sécurité et facility management » (60) ; « Technologies de sécurité pour sites professionnels | Avenir » (59) ; « Visites mystères, audits de marque, trajets tests et audits de service : expérience client, respect des processus et points de conformité convenus. » (147)
- Status: NEW
- Confidence: high

### COPY-FR-021 — Footer "Conditions d’utilisation" lands on a page titled "Legal Statements"
- Severity: P3
- Category: legal-consistency / UX
- Where: FR footer → `/en/aszf` (200, TITLE "Legal Statements"); `fr.ts:68` (also latent `specialDataWarningLink`, `fr.ts:62`)
- Evidence: "Conditions d’utilisation (en anglais)"
- Problem: The label is functionally right, since the HU "Jogi nyilatkozatok" governs use of the website. But the reader lands on a page with a different title, and the other two footer links match their targets.
- Fix: « Conditions d’utilisation – Legal Statements (en anglais) », or keep the label and accept the mismatch.
- Status: NEW
- Confidence: low

### COPY-FR-022 — Latent (not rendered on /fr) reference copy carries an unverified sector claim
- Severity: P3
- Category: claim/proof (latent)
- Where: `fr.ts:41–43` (`refTitle`, `refSub`, `refText`, `refs`)
- Evidence: "Établissements publics"; "Avenir intervient dans des environnements professionnels et institutionnels…"
- Problem: If the references block is ever enabled for FR, this asserts public-sector clients. HU equivalent "Közintézmények" is flagged as unverified in HUA-039. FKZ-034 covers only the `references.section` keys.
- Fix: Remove « Établissements publics » and « institutionnels », or align with the approved reference registry before enabling.
- Status: NEW (analogous to HUA-039)
- Confidence: medium

### COPY-FR-023 — UI micro-copy polish (consent button, error register, footer company labels/address)
- Severity: P3
- Category: grammar / style
- Where: consent banner (`lib/analytics/consent-copy.ts:15`); `fr.form.errors.server` (`fr.ts:64`, also the modal error); footer (`fr.ts:69`)
- Evidence: "ACCEPTER L’ANALYSE"; "Une erreur est survenue lors de l’envoi. Réessayez plus tard ou appelez-nous au +36 70 316 8218."; "Numéro d’immatriculation: 01-09-328046"; "Siège social: 1039 Budapest, Királyok útja 291. B. ép. 15. ajtó"
- Problem:
  - « Accepter l’analyse » is literal; the owner-approved banner sentence itself is correct and should stay unchanged.
  - The error message switches from the « Veuillez » register used in the other errors to a bare imperative.
  - « Numéro d’immatriculation » alone is ambiguous (it also means a vehicle registration number).
  - The Hungarian address abbreviations are opaque to French readers.
- Fix: « Accepter les cookies d’analyse » ; « Veuillez réessayer plus tard ou nous appeler au +36 70 316 8218. » ; « Numéro d’immatriculation au registre des sociétés » ; optionally « …B. ép. 15. ajtó (bâtiment B, porte 15) », keeping the official form first.
- Status: NEW (the "Numéro fiscal" label is KNOWN FKZ-027; the missing NBSP before ":" is KNOWN FKZ-018)
- Confidence: medium

### COPY-FR-024 — Localized 404 now works, but `<title>` is the homepage title
- Severity: P3
- Category: correctness / UX
- Where: https://www.afm.hu/fr/nem-letezo-oldal-audit-404 (HTTP 404, lang=fr)
- Evidence: TITLE "Avenir Facility Management Kft. — Sécurité et gestion des installations"; body "Page introuvable / Le contenu recherché n’est pas disponible."
- Problem: The browser tab and history show the homepage title on an error page. The body side of FKZ-013 is now fixed for FR (lang=fr, localized copy and links).
- Fix: Set the title to « Page introuvable | Avenir » from `getNotFoundCopy(locale).title`.
- Status: KNOWN (FKZ-013 — body part resolved for FR; title residual)
- Confidence: high

### COPY-FR-025 — Known P3 items confirmed still live (one line each)
- Severity: P3
- Category: grammar / terminology / translation drift / typography
- Where / Evidence / Status:
  - Typography: the punctuation NBSPs are now fixed, but "24 h/24 et 7 j/7" still uses U+0020 (18× in `fr-service-details.ts`, 2× in `schema-locale-copy.ts`), so it can break across lines. KNOWN (FRS-014, remaining)
  - "Ces éléments doivent être définis avant le démarrage"; "doivent donc être précisées"; "doit être fixé"; "rédigées et validées avec l’interlocuteur". KNOWN (FRS-015)
  - "Application des règles d’entrée et de sortie"; "application des règles d’accès"; "avec application des règles de remise". KNOWN (FRS-016)
  - "à consigner ou à transmettre"; "aux notifications et aux rapports"; "…à l’accueil et aux alertes". KNOWN (FRS-017)
  - "visite / analyse / état des lieux / inventaire / visite préparatoire" for felmérés. KNOWN (FRS-018)
  - H1 "Accueil et services de poste de garde" vs TITLE "Accueil et poste de garde pour les entreprises". KNOWN (FRS-019)
  - Lost HU contrasts ("ne csak jelenlétet…", "nem egyszerű ellenőrzés"). KNOWN (FRS-020)
  - "Définition des accès, des rondes et des alertes". KNOWN (FRS-021)
  - "Protocole de vérification des alarmes documenté pour chaque événement"; "Protocole de vérification documenté". KNOWN (FRS-022)
  - Télésurveillance FAQ "Avenir dispose-t-elle des autorisations nécessaires ?" (generic). KNOWN (FRS-023)
  - "Exploitations à plusieurs locataires ou sites avec chaîne d’alerte documentée". KNOWN (FRS-024)
  - "Périmètre défini avant l’intervention"; "Avenir définit avant l’intervention…". KNOWN (FRS-025)
  - "…ou les mesures futures."; "L’audit peut couvrir la marque…". KNOWN (FRS-026)
  - "coordination des spécialistes"; "recours aux spécialistes"; no « CVC ». KNOWN (FRS-027)
  - "…statuts et échéances de rapport."; "Exploitants d’un site recherchant…". KNOWN (FRS-028)
  - "contacts organisateur"; "contact prestataires"; "Conservation, journalisation des accès et minimisation sont définies par site"; "tentative d’accès non autorisée"; "Un trajet test … peut examiner"; "apportent un soutien technique utilisable au quotidien à la présence humaine". KNOWN (FRS-029)
  - "Avenir vise un fonctionnement ordonné, courtois…"; meta "Des protocoles propres aux sites professionnels." (verbless). KNOWN (FRS-030)
  - "Nettoyage courant des surfaces selon les fréquences convenues"; "périmètre documentaire convenu"; "constats exploitables". KNOWN (FRS-031)
  - Shared headings "Sites concernés" / "Démarrer la collaboration" / "Éléments de confiance" / "Prestations incluses". KNOWN (FRS-032)
- Fix: as in the CSV rows.
- Confidence: high

### COPY-FR-026 — Known P3 items confirmed still live (KNOWN FKZ rows)
- Severity: P3
- Category: typography / terminology / translation drift
- Where / Evidence / Status:
  - « Services de sécurité complets » still has U+0020 after « and before » (ISO 9001 card + JSON-LD). The hero ":" and footer ";" are now NBSP. KNOWN (FKZ-017, remaining)
  - Hard-coded separators: "Changer de langue: Magyar" (×6 aria-labels), "Numéro d’immatriculation: …", "Numéro fiscal: …", "Siège social: …", "…, Délivré par …, Valable jusqu’au …" (capitalized mid-sentence, no NBSP). KNOWN (FKZ-018)
  - Hero tag "SÉCURITÉ · TECHNOLOGIES DE SÉCURITÉ · AUDITS". KNOWN (FKZ-019)
  - "Hard FM — gestion technique des bâtiments" (GTB/BMS ambiguity); "Accueil et services de poste de garde". KNOWN (FKZ-020)
  - values[1] "…commerciaux et de bureaux" (HU has no offices). KNOWN (FKZ-021)
  - Footer "Numéro fiscal". KNOWN (FKZ-027)
  - Latent `specialDataWarning` "Ces sujets nécessitent un engagement distinct…". KNOWN (FKZ-034)
- Fix: as in the CSV rows.
- Confidence: high

## Verified OK
- Locale policy:
  - all 9 FR URLs return 200 with `robots: noindex, follow`, a self canonical and no hreflang;
  - no /fr URL is in `sitemap.xml`;
  - FR legal, news, trust and recruitment-privacy routes, legacy slug `/fr/szolgaltatasok/security` and Special Service slug `helyszini-biztonsagi-audit` all return 404;
  - nav hides Références/Actualités, and the homepage hides the references (AutoWallis) block.
- Footer/legal signalling:
  - every legal link is labelled « (en anglais) » (privacy, terms, mentions légales, candidate notice, form layered notice) and resolves 200 (`/en/adatvedelem`, `/en/aszf`, `/en/impresszum`, `/en/recruitment-privacy`);
  - the footer disclaimer states that the translations are under review and that legal links lead to English texts;
  - both certificate PDFs return 200.
- No Hungarian or English leaks into the visible FR body text. The only leak is the JSON-LD `areaServed` (COPY-FR-017). The `...en` spread in `fr.ts` overrides every rendered key, and the inherited EN `legal` copy is unreachable.
- Compliance guardrails hold:
  - no RGPD-compliance promise (FRS-002 fix verified, no « RGPD » in FR source);
  - legal basis and final decisions are left with the client and its advisers (Security Technology, Télésurveillance FAQ);
  - private investigation appears only as a contrast in the Mystery FAQ (« Il ne s’agit ni d’une enquête privée… »), with no contact option and only the 8 services in the dropdown;
  - no EcoVadis mention;
  - no guarantees: explicit non-guarantees on event conflict, cleaning quality, repair delay and arrival time;
  - armed guarding is conditional on contract, legal conditions and risk profile;
  - ISO wording is limited to "lorsque les processus concernés relèvent du périmètre certifié".
- Approved claims match: 30+ sites, 200+ staff, AA/D&B 2026, 24/7 « Permanence de dispatching » (homepage stat and guarding/gatehouse trust cards fixed), ISO 9001 843579099 / MartonCert 19 mars 2026–18 mars 2029, ISO/IEC 27001:2023 988960032 / MCert 27 avril 2026–26 avril 2029, address/phone/e-mail/registration/tax numbers identical to HU.
- Contact follow-up wording matches the approved claim: « au plus tard le jour ouvré suivant », with quote timing dependent on scope and complexity. The HUA-004 site-visit sentence is mirrored exactly.
- Consent banner text carries the owner-approved HU content (no names, e-mails, phones, messages or other form content sent to analytics).
- Regressions: closed FRS-002, FRS-003, FRS-004, FRS-012, FRS-033, FKZ-029, FKZ-030 and FKZ-032 remain fixed.
- Vouvoiement is consistent; date format « 19 mars 2026 » and phone format are correct; accents on capitals are preserved; « ? ; : » now use NBSP/NNBSP in the rendered prose; the 8 service names are consistent across card, footer, dropdown, aria-label, breadcrumb and H1 (FKZ-012 is clean for FR).
