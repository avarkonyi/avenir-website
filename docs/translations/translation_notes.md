# Public Site Translation Notes

Generated for the Avenir multilingual launch inventory in `docs/translations/public_site_translation_matrix.csv`.

This is a source inventory and review aid. HU and EN service detail pages are
production-live. German service detail translations and German legal pages now
have controlled review-mode runtime sources; after deployment, the eight DE
service routes and three DE legal routes are expected to return 200 with
`noindex, follow`, while staying outside sitemap and hreflang. ZH remains a
partial-localization surface. KO has a homepage-only draft scaffold and is
translation-review-required. German must still follow the staged DE-0..DE-6
rollout documented in `docs/de_phase0_audit.md`; review-mode routes do not
imply legal/proof/SEO approval.

## Scope

The matrix inventories public-facing text from:

- static public i18n strings in `lib/i18n/*.ts`;
- current HU legal source overrides in `lib/legal-content.ts`;
- the eight HU service-detail pilot seed files;
- seeded public news/article content in `scripts/seed.ts`;
- SEO/GEO/schema source text in `lib/seo-data.ts`;
- AI-search grounding files `public/llms.txt` and `public/llms-full.txt`.

## Translation Principles

- Use a serious, operational B2B tone.
- Prefer business localization over literal translation when literal wording is awkward or risky.
- Keep Avenir as the brand name.
- Keep slugs unchanged for the first multilingual rollout unless routing changes later.
- Do not add guarantees, legal conclusions, response-time promises, client names, partner names, testimonials, metrics, or certifications that are not explicitly verified.
- Do not translate legal pages automatically. Legal/privacy pages require professional legal review in every language.
- Do not translate `llms.txt` or `llms-full.txt` unless localized AI-search grounding files are explicitly planned.

## Service Naming Recommendations

| HU source name | Recommended EN | Notes |
| --- | --- | --- |
| Objektumőrzés | Manned Guarding / On-site Security Guarding | Choose one and keep it consistent across service pages, nav, contact, and metadata. |
| Portaszolgálat | Reception and Gatehouse Service | Use “Gatehouse” where access-control context matters. |
| Biztonságtechnika | Security Technology | CCTV, access control, and intrusion systems can be named in body text. |
| Távfelügyelet és vonulószolgálat | Remote Monitoring and Response Service | Avenir response service; do not add subcontractor wording. |
| Mystery Shopping és szolgáltatásaudit | Mystery Shopping and Service Audit | Keep separate from private investigation or surveillance. |
| Rendezvénybiztosítás | Event Security | Avoid implying police/authority role or conflict-free guarantee. |
| Hard FM | Hard FM / Technical Facility Management | Keep Hard FM distinct from Soft FM. |
| Soft FM | Soft FM / Soft Facility Management | Keep broader than cleaning-only. |

## Do-Not-Translate-Literally Terms

- `objektumőrzés`: do not translate as “object guarding”; use “manned guarding” or “on-site security guarding”.
- `portaszolgálat`: avoid “porter service” if it sounds residential; use “gatehouse” or “reception and gatehouse”.
- `vonulószolgálat`: avoid “marching service”; use “response service”.
- `biztonságtechnika`: avoid “security technics”; use “security technology”.
- `rendezvénybiztosítás`: use “event security”, not “event insurance”.
- `adatkezelés`: choose legal/privacy terminology carefully per locale.
- `Jogi nyilatkozatok`: localize according to legal counsel, not as a casual “terms” label if the page scope is broader.

## Proof-Sensitive Claims

Rows marked `proof_pending` or `compliance_sensitive` need source validation before translation or publication.

Watch especially for:

- D&B AA High Creditworthy 2026: approved for public use from the Dun & Bradstreet certificate dated 26 May 2026.
- OPTEN A+ / Bonitási minősítés: not approved from the D&B certificate; do not use unless separate OPTEN-specific proof exists.
- ISO 9001 / ISO 27001: keep certificate-scope framing; do not imply all processes or all data categories are certified unless proof supports it.
- License numbers and SzVMt. wording: preserve exact numbers and legal meaning.
- 24/7, 30+, 200+: translate only where the claim is approved in `docs/verified_claims.md`.
- Partner/client/reference wording: do not add names or “trusted by” framing without explicit approval and usage scope.

## Legal Review Notes

- Legal rows are marked `legal_review_required`.
- Legal/privacy pages should be translated by or reviewed with legal counsel.
- The Hungarian legal source includes dynamic overrides in `lib/legal-content.ts`; confirm rendered HU legal pages before sending final legal translation packages.
- HU and EN legal URLs are currently live and may be included in the sitemap.
  DE legal URLs render from reviewed source files only in `noindex, follow`
  review mode and must stay outside sitemap/hreflang until legal/SEO approval.
  Do not include ZH/KO legal URLs until localized legal text is reviewed and
  approved.

## Production Translation Status

- HU and EN homepages are live.
- Eight HU and eight EN service detail pages are live.
- HU and EN legal pages are live under Hungarian legal slugs:
  `/hu|/en/adatvedelem`, `/hu|/en/aszf`, `/hu|/en/impresszum`.
- DE/ZH are homepage/partial-localization surfaces only. KO is homepage-only
  draft and translation-review-required. These partial locales should remain
  noindexed/excluded from sitemap until full localization is approved.
- German source/runtime state on 2026-06-05:
  - `/de` returns 200 and is `noindex, follow`;
  - DE service detail routes are source-implemented as 200/noindex review
    routes after deploy;
  - DE legal routes return 200/noindex after deploy:
    `/de/adatvedelem`, `/de/aszf`, `/de/impresszum`;
  - DE legal source files live under `docs/translations/de/legal/`;
  - DE news routes return 404 by design;
  - DE footer and contact legal links point to DE legal review-mode routes;
  - DE homepage service-card labels, the `Details` card link label,
    `Angebot anfordern`, `Leitstellenbereitschaft` and
    `Hohe Bonitätsbewertung (D&B)` are interim-polished in source;
  - DE is not in the sitemap and is not advertised as a service/legal/news
    hreflang target;
  - production may still show the previous DE service 404 state until the
    review-mode build is deployed.
- Initial German glossary: `docs/translations/german_glossary.md`.
- German service tile source package:
  - source files are staged under `docs/translations/de/source/`;
  - `service_tiles_de_full.csv` contains 681 rows across 8 services plus 2
    SHARED rows;
  - typed runtime source is `lib/services/de-service-details.ts`;
  - `de_status` is preserved in the staged source file;
  - 24 rows are `legal_review_required` and remain gated;
  - validation report:
    `docs/translations/de/service_tiles_de_full_validation.md`.
- Canonical service labels are:
  - HU: Élőerős objektumőrzés; Recepciós és portaszolgálat;
    Próbavásárlás és szolgáltatásaudit; Rendezvénybiztosítás;
    Biztonságtechnika; Távfelügyelet és vonulószolgálat; Hard FM; Soft FM.
  - EN: On-site Security Guarding; Reception and Gatehouse Services; Mystery
    Shopping and Service Audit; Event Security; Security Technology; Remote
    Monitoring and Response Service; Hard FM; Soft FM.
- Analytics consent copy remains privacy-first: no analytics before consent,
  reject keeps GA4 blocked, and no personal form content is sent to analytics.

## QA Checklist For Translated Pages

- Verify route policy before publication: DE/ZH/KO service detail pages must
  remain gated until localized required fields exist. Future new EN pages still
  need the same per-locale readiness and review discipline.
- Confirm canonical slugs and contact aliases are unchanged.
- Check metadata title/description length and local search intent.
- Validate JSON-LD after translation: Organization, Service, Article, BreadcrumbList, FAQPage.
- Confirm hreflang advertises only ready locale pages.
- Check sitemap contains only ready public URLs.
- Review all `proof_pending`, `legal_review_required`, `brand_sensitive`, and `compliance_sensitive` rows before publishing.
- Run visual QA for long German strings and Chinese typography.
- Test contact prefill and translated labels in all locales.

## Inventory Counts

- Total rows: 1,222
- AI-search grounding rows: 157
- Legal rows: 224
- Public news seed rows: 6
- SEO/GEO rows: 167
- Service detail pilot rows: 537
- Static i18n rows: 131

Status counts:

- `todo`: 549
- `existing_translation_review`: 122
- `legal_review_required`: 253
- `proof_pending`: 3
- `do_not_translate`: 295

Risk counts:

- `normal`: 880
- `legal_review_required`: 287
- `compliance_sensitive`: 36
- `proof_pending`: 19

## Known Gaps

- This is a source-code inventory only. DB-authored live article, partner, certification, or career content may need a separate DB export before full multilingual launch.
- Current HU legal page rendering uses overrides and transformations; legal counsel should review rendered pages, not only CSV rows.
- The matrix does not machine-translate missing DE/ZH/KO service detail fields.
- Existing DE/ZH/KO static i18n text is marked for review, not accepted as final
  launch-ready localization.
