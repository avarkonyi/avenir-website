# German Glossary

Last updated: 2026-06-05

Status: draft terminology seed for German localization. All entries require
German native/business review before indexing or treating German pages as
production-ready.

## Principles

- Use precise B2B operational German, not literal translations.
- Keep Avenir as the brand name.
- Keep canonical service slugs unchanged unless a separate URL architecture
  project approves German-native slugs and redirects.
- Do not add proof claims, client names, partner claims, testimonials or case
  studies through translation.
- Proof/legal-sensitive terminology must be reviewed before German pages become
  indexable.
- German legal pages must not be machine-translated and published as final.

## Service Labels

| Canonical EN | Draft German option | Status | Review notes |
| --- | --- | --- | --- |
| On-site Security Guarding | Objekt- und Werkschutz / Sicherheitsdienst vor Ort | Draft | Choose one canonical public label. `Objekt- und Werkschutz` is concise and procurement-friendly; `Sicherheitsdienst vor Ort` is broader and clearer for non-specialists. |
| Reception and Gatehouse Services | Empfangs- und Pförtnerdienst | Draft | Good operational direction for visitor handling, access control and gatehouse context. |
| Mystery Shopping and Service Audit | Mystery Shopping und Service Audit | Draft | Avoid `Vor-Ort-Audit` as a broad label if it sounds like authority inspection, surveillance or private investigation. |
| Event Security | Veranstaltungssicherheit | Draft | Prefer over `Veranstaltungsschutz` if native review confirms it reads more natural in B2B context. |
| Security Technology | Sicherheitstechnik | Draft | Clear and established term. Use body copy for CCTV, access control and alarms. |
| Remote Monitoring and Response Service | Fernüberwachung und Interventionsdienst | Draft | Check whether `Interventionsdienst` is appropriate for Avenir's response/service model and does not imply guaranteed arrival time. |
| Hard FM | Hard FM / technisches Facility Management | Draft | Use `Hard FM` where the buyer audience knows the category; add German descriptor where clarity is needed. |
| Soft FM | Soft FM / infrastrukturelles Facility Management | Draft | Use `Soft FM` where the buyer audience knows the category; add German descriptor where clarity is needed. |

The full German service tile package is staged in
`docs/translations/de/source/service_tiles_de_full.csv`. It preserves
`de_status` per row and remains source-only until native/business and legal
review gates pass.

## Shared Operational Terms

| HU / EN concept | Draft German | Status | Notes |
| --- | --- | --- | --- |
| szolgálati napló / service log | Dienstprotokoll / Einsatzprotokoll | Draft | Choose based on service context. |
| eszkaláció / escalation | Eskalation / Eskalationsweg | Draft | `Eskalationsweg` is useful for process wording. |
| riportálás / reporting | Reporting / Berichtswesen | Draft | `Berichtswesen` may fit formal process copy; `Reporting` may fit B2B shorthand. |
| beléptetés / access control | Zutrittskontrolle | Draft | Do not use as a legal/security guarantee. |
| járőrözés / patrol | Streifendienst / Kontrollgang | Draft | Choose by service context. |
| incidenskezelés / incident handling | Vorfallbearbeitung | Draft | Avoid implying legal fault finding. |
| helyszíni modell / site model | Standortmodell | Draft | Useful for Soft FM and security technology. |
| scope | Leistungsumfang / Scope | Draft | `Leistungsumfang` is clearer; `Scope` may be accepted in procurement context. |
| minőségi szempontok / quality criteria | Qualitätskriterien | Draft | Use where objective criteria are agreed. |
| felelős kapcsolattartó / responsible contact point | verantwortlicher Ansprechpartner | Draft | Already used on DE homepage. |

## Proof-sensitive Terms

| Concept | Draft German wording | Status | Guardrail |
| --- | --- | --- | --- |
| ISO 9001 / ISO 27001 | ISO 9001 und ISO 27001 zertifizierte Managementsysteme | Draft | Use scope-conditional wording where processes fall within certified scope. |
| Hungarian security activity licence | ungarische Genehmigung für Sicherheits-/Bewachungstätigkeiten | Draft | Do not expose exact licence numbers in generic service body/trust copy. |
| 24/7 dispatcher background | 24/7 Dispatcher-Hintergrund / Leitstellenhintergrund | Draft | Do not imply guaranteed arrival or response time. |
| 30+ active sites | 30+ aktive Standorte | Draft | Approved fact, but keep as company background. |
| 200+ professionals/staff | 200+ geschulte Mitarbeiter / Fachkräfte | Draft | Approved fact, but avoid universal availability promises. |
| D&B AA High Creditworthy 2026 | D&B High Creditworthy 2026 | Draft | Do not call it OPTEN A+. |

## Legal and Privacy Terms

| Concept | Draft German | Status | Notes |
| --- | --- | --- | --- |
| Privacy Policy / Adatkezelési tájékoztató | Datenschutzerklärung | Draft | Needs legal review before German route publication. |
| Terms of Use / ÁSZF | Nutzungsbedingungen | Draft | Needs legal review. |
| Impresszum | Impressum | Draft | Needs legal review. |
| analytics consent | Einwilligung in Analytik / Analyse-Cookies | Draft | Consent wording must match actual GA4 behavior. |
| personal data | personenbezogene Daten | Draft | Legal review required. |
| sensitive personal data warning | Hinweis zu sensiblen Daten | Draft | Keep concise and accurate. |

## Do-not-use Without Review

- `Objektbewachung` as a default label if it sounds too narrow or unnatural in
  the buyer context.
- `Vor-Ort-Audit` as the canonical Mystery Shopping label without review.
- `Garantie`, `garantierte Reaktionszeit`, `garantierte Ankunftszeit`.
- `DSGVO-konform garantiert`, `NAIH-genehmigt`, `rechtliche Beratung`.
- `Ermittlung`, `Überwachung`, `verdeckte Kontrolle` for Mystery Shopping.
- `OPTEN A+` unless separate OPTEN-specific proof exists and is approved.
