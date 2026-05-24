# Public Site Translation Notes

Generated for the Avenir multilingual launch inventory in `docs/translations/public_site_translation_matrix.csv`.

This is a source inventory and review aid. It does not publish EN/DE/ZH service detail pages, does not change routing, and does not imply legal or proof approval.

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

- OPTEN A+ / Bonitási minősítés: proof-pending; do not approve or expand it in translation.
- ISO 9001 / ISO 27001: keep certificate-scope framing; do not imply all processes or all data categories are certified unless proof supports it.
- License numbers and SzVMt. wording: preserve exact numbers and legal meaning.
- 24/7, 30+, 200+: translate only where the claim is approved in `docs/verified_claims.md`.
- Partner/client/reference wording: do not add names or “trusted by” framing without explicit approval and usage scope.

## Legal Review Notes

- Legal rows are marked `legal_review_required`.
- Legal/privacy pages should be translated by or reviewed with legal counsel.
- The Hungarian legal source includes dynamic overrides in `lib/legal-content.ts`; confirm rendered HU legal pages before sending final legal translation packages.
- Do not include non-HU legal URLs in the sitemap until localized legal text is reviewed and approved.

## QA Checklist For Translated Pages

- Verify route policy before publication: EN/DE/ZH service detail pages must remain gated until localized required fields exist.
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
- The matrix does not machine-translate missing EN/DE/ZH service detail fields.
- Existing EN/DE/ZH static i18n text is marked for review, not accepted as final launch-ready localization.
