# German Service Tile Translation Package Validation

Last updated: 2026-06-05

Status: source/staging validation report. This document does not publish German
service detail routes, does not write the database, and does not approve
`legal_review_required` rows for public release.

## Input Files

Validated source directory:

`docs/translations/de/source/`

Required files present:

| File | Size |
| --- | ---: |
| `service_tiles_de_batch1.csv` | 103,611 bytes |
| `service_tiles_de_batch2.csv` | 105,107 bytes |
| `service_tiles_de_full.csv` | 208,680 bytes |
| `service-tiles-de-batch1.md` | 46,951 bytes |
| `service-tiles-de-batch2.md` | 48,663 bytes |

Primary source of truth for this pass:

`docs/translations/de/source/service_tiles_de_full.csv`

Batch CSV and Markdown files are retained as reference/validation inputs.

## CSV Structure

Required columns were present:

- `key`
- `section`
- `hu_text`
- `de_text`
- `de_status`

Total rows: 681.

## Tile Counts

| Tile / service | Expected | Actual | Result |
| --- | ---: | ---: | --- |
| `objektumorzes` | 87 | 87 | Pass |
| `portaszolgalat` | 81 | 81 | Pass |
| `mystery-shopping-helyszini-audit` | 83 | 83 | Pass |
| `rendezvenybiztositas` | 85 | 85 | Pass |
| `biztonsagtechnika` | 90 | 90 | Pass |
| `tavfelugyelet-vonuloszolgalat` | 88 | 88 | Pass |
| `hard-fm` | 76 | 76 | Pass |
| `soft-fm` | 89 | 89 | Pass |
| `SHARED` | 2 | 2 | Pass |

## Status Counts

| `de_status` | Expected | Actual | Result |
| --- | ---: | ---: | --- |
| `translated_draft` | 657 | 657 | Pass |
| `legal_review_required` | 24 | 24 | Pass |

## Batch Consistency

Batch files matched the full CSV.

| Check | Result |
| --- | --- |
| `batch1 + batch2` row count | 681 |
| Rows missing from combined batches | 0 |
| Extra rows in combined batches | 0 |
| Duplicate `key + section` pairs in full CSV | 0 |

Batch composition:

| Batch | Services |
| --- | --- |
| `service_tiles_de_batch1.csv` | `objektumorzes` 87, `portaszolgalat` 81, `mystery-shopping-helyszini-audit` 83, `rendezvenybiztositas` 85, `SHARED` 2 |
| `service_tiles_de_batch2.csv` | `biztonsagtechnika` 90, `tavfelugyelet-vonuloszolgalat` 88, `hard-fm` 76, `soft-fm` 89 |

## SHARED JSON Validation

Both SHARED rows contain valid JSON in `de_text`.

| Key | Section | Result |
| --- | --- | --- |
| `SHARED:hu.serviceDetail` | `shared.serviceDetail` | Valid JSON |
| `SHARED:SERVICE_QUOTE_COPY.hu` | `shared.serviceQuote` | Valid JSON |

## DE-only FAQ Rows

The CSV contains four DE-only FAQ rows for `biztonsagtechnika`, covering FAQ 9
and FAQ 10. These are accepted as German-specific staged rows and must not be
forced onto HU/EN source rows. All four are `legal_review_required`.

| Key | Section | Status |
| --- | --- | --- |
| `biztonsagtechnika:DE_ONLY.faq.9.q` | `faq.9.q` | `legal_review_required` |
| `biztonsagtechnika:DE_ONLY.faq.9.a` | `faq.9.a` | `legal_review_required` |
| `biztonsagtechnika:DE_ONLY.faq.10.q` | `faq.10.q` | `legal_review_required` |
| `biztonsagtechnika:DE_ONLY.faq.10.a` | `faq.10.a` | `legal_review_required` |

## Legal-review-required Rows

These rows are staged in the source package, but they are not public-approved.
They require legal/proof/compliance review before any DE service route release.

| Service | Key | Section | German preview |
| --- | --- | --- | --- |
| `objektumorzes` | `objektumorzes:PILOT_HU.longDesc.body.2` | `body.3` | Die Präsenz des Sicherheitspersonals richtet sich nach dem Risikoprofil des Standorts und dem vertraglichen Bedarf... |
| `objektumorzes` | `objektumorzes:PILOT_HU.processSteps.4.body` | `processSteps.4.body` | Die unbewaffnete oder bewaffnete Präsenz des Sicherheitspersonals organisieren wir auf Grundlage des vertraglichen Bedarfs... |
| `objektumorzes` | `objektumorzes:PILOT_HU.trustItems.5.body` | `trustItems.5.body` | Avenir erbringt die Leistung nach dem anwendbaren ungarischen Regulierungsrahmen für Personen- und Vermögensschutz... |
| `objektumorzes` | `objektumorzes:PILOT_HU.faq.5.a` | `faq.5.a` | Abhängig vom Risikoprofil des Standorts, dem vertraglichen Bedarf und der Erfüllung der rechtlichen Voraussetzungen... |
| `objektumorzes` | `objektumorzes:PILOT_HU.faq.6.a` | `faq.6.a` | Ja. Der Objektschutz vor Ort erfolgt nach dem anwendbaren ungarischen Regulierungsrahmen für Personen- und Vermögensschutz... |
| `portaszolgalat` | `portaszolgalat:PILOT_HU.longDesc.body.1` | `body.2` | Auf Grundlage einer Begehung vor Ort legt Avenir das Pförtner- und Empfangsprotokoll fest... |
| `portaszolgalat` | `portaszolgalat:PILOT_HU.trustItems.4.body` | `trustItems.4.body` | Bei der Verarbeitung von Besucher- und Zutrittsdaten sind die Zweckbindung, die Information der Betroffenen und die zeitlich begrenzte Aufbewahrung... |
| `portaszolgalat` | `portaszolgalat:PILOT_HU.faq.6.a` | `faq.6.a` | Bei der Verarbeitung von Besucherdaten sind die Zweckbindung, die zeitlich begrenzte Aufbewahrung, die Information der Besucher... |
| `mystery-shopping-helyszini-audit` | `mystery-shopping-helyszini-audit:PILOT_HU.trustItems.4.body` | `trustItems.4.body` | Die Berichterstattung beschränkt sich auf den vereinbarten Prüfumfang und den festgelegten Überprüfungsprozess des Auftraggebers... |
| `mystery-shopping-helyszini-audit` | `mystery-shopping-helyszini-audit:PILOT_HU.faq.1.a` | `faq.1.a` | Der Prüfumfang wird vor der Durchführung festgelegt. Avenir definiert vorab das Ziel, das Szenario, die Prüfkriterien... |
| `mystery-shopping-helyszini-audit` | `mystery-shopping-helyszini-audit:PILOT_HU.faq.4.a` | `faq.4.a` | Der Bericht ist standardmäßig prozess- und servicequalitätsorientiert. Eine namentliche oder personenbezogene Darstellung kann nur innerhalb vorab... |
| `mystery-shopping-helyszini-audit` | `mystery-shopping-helyszini-audit:PILOT_HU.faq.7.a` | `faq.7.a` | Mystery Shopping und Serviceaudit messen Servicequalität, Prozesstreue, Customer Journey und vereinbarte Compliance-Punkte auf Grundlage eines... |
| `biztonsagtechnika` | `biztonsagtechnika:PILOT_HU.longDesc.body.2` | `body.3` | Avenir bezieht bei der sicherheitstechnischen Bestandsaufnahme und Planung auch die Datenschutzaspekte ein... |
| `biztonsagtechnika` | `biztonsagtechnika:PILOT_HU.trustItems.1.body` | `trustItems.1.body` | Die Leistung wird im Einklang mit der sicherheitstechnischen Genehmigung und den vertraglichen Anforderungen des Standorts gestaltet. |
| `biztonsagtechnika` | `biztonsagtechnika:PILOT_HU.trustItems.4.body` | `trustItems.4.body` | Die Abdeckung der Kamerabilder, der Erfassungsbereich, die Zugriffsberechtigungen, die Information der Betroffenen... |
| `biztonsagtechnika` | `biztonsagtechnika:PILOT_HU.faq.7.a` | `faq.7.a` | Ja. Bei der Planung eines Kamerasystems sind die Zweckbindung, die Information der Betroffenen, die Dokumentation des berechtigten Interesses... |
| `biztonsagtechnika` | `biztonsagtechnika:PILOT_HU.faq.8.a` | `faq.8.a` | Die Speicherdauer wird vom Zweck der Aufzeichnung, vom Risikoprofil des Standorts, vom Bedarf der Vorfallbearbeitung... |
| `biztonsagtechnika` | `biztonsagtechnika:DE_ONLY.faq.9.q` | `faq.9.q` | Wer führt die Interessenabwägung für eine Videoüberwachung durch? |
| `biztonsagtechnika` | `biztonsagtechnika:DE_ONLY.faq.9.a` | `faq.9.a` | Die Interessenabwägung — etwa zur Stützung eines berechtigten Interesses nach der DSGVO — ist Teil des Datenschutzrahmens... |
| `biztonsagtechnika` | `biztonsagtechnika:DE_ONLY.faq.10.q` | `faq.10.q` | Wie lange dürfen Kameraaufnahmen gespeichert werden? |
| `biztonsagtechnika` | `biztonsagtechnika:DE_ONLY.faq.10.a` | `faq.10.a` | Eine einheitliche, für alle Standorte gültige Speicherdauer gibt es nicht. Maßgeblich sind der dokumentierte Zweck... |
| `tavfelugyelet-vonuloszolgalat` | `tavfelugyelet-vonuloszolgalat:PILOT_HU.longDesc.body.1` | `body.2` | Umfasst die Leistung die Meldungsbearbeitung der Fernüberwachung, ist der Verifikationsschritt Teil des Betriebsverfahrens... |
| `tavfelugyelet-vonuloszolgalat` | `tavfelugyelet-vonuloszolgalat:PILOT_HU.faq.4.a` | `faq.4.a` | Ja. Fernüberwachung und Interventionsdienst erfolgen nach dem anwendbaren ungarischen Regulierungsrahmen für Personen- und Vermögensschutz... |
| `tavfelugyelet-vonuloszolgalat` | `tavfelugyelet-vonuloszolgalat:PILOT_HU.faq.10.a` | `faq.10.a` | Die in der Fernüberwachung genutzten Meldungen, Kamerabilder und Zutrittsereignisse dürfen ausschließlich zum vereinbarten Fernüberwachungszweck... |

## Staging Decision

The current translation matrix architecture contains generic `de` columns, but
it does not preserve a dedicated per-row `de_status` field for this DE service
tile package. Updating the global matrix directly in this pass would risk
collapsing German review status into a shared row status and mixing this staged
package with the HU/EN production translation matrix.

Decision for this pass:

- keep `service_tiles_de_full.csv` as the source-of-truth DE service tile
  staging file;
- preserve `de_text` and `de_status` exactly in the source package;
- keep `legal_review_required` rows gated;
- do not import to DB;
- do not open DE service detail routes;
- do not add DE service sitemap or hreflang entries.

## Route Gate

German service detail routes remain closed until a later explicit release pass.
Expected public policy remains:

- `/de/szolgaltatasok/objektumorzes` -> 404
- `/de/szolgaltatasok/portaszolgalat` -> 404
- `/de/szolgaltatasok/biztonsagtechnika` -> 404
- `/de/szolgaltatasok/tavfelugyelet-vonuloszolgalat` -> 404
- `/de/szolgaltatasok/mystery-shopping-helyszini-audit` -> 404
- `/de/szolgaltatasok/rendezvenybiztositas` -> 404
- `/de/szolgaltatasok/hard-fm` -> 404
- `/de/szolgaltatasok/soft-fm` -> 404

## Next Gates

- DE homepage/framework input pass.
- DE legal input pass.
- Native German business review.
- Legal/proof review of `legal_review_required` rows.
- Service-detail route release approval.
- Sitemap/hreflang/indexing approval.
