# i18n Visible Text Fixes - 2026-06-06

This note reconciles the small visible-text issues found after the EN/DE news
and partial-locale rollout. It is not a service-copy rewrite, legal rewrite,
route-policy change, sitemap/hreflang change, DB write approval, or deploy
approval.

## Fixed In Source

| Area | Before | After | Status |
| --- | --- | --- | --- |
| EN service-card detail label | `Részletek` | `Details` | Fixed in `getServiceCardDetailLabel`; HU remains `Részletek`, DE remains `Details`. |
| ZH homepage pillars | `可靠性`, `专业性`, `灵活性` | `透明管控`, `专业现场支持`, `响应与责任` | Fixed in `lib/i18n/zh.ts`. |
| ZH creditworthiness stat | `D&B High Creditworthy 2026` | `D&B 高信用评级` | Fixed in `lib/i18n/zh.ts`; still proof-safe D&B wording. |
| KO creditworthiness stat | `D&B High Creditworthy 2026` | `D&B 높은 신용도 평가` | Fixed in `lib/i18n/ko.ts`; still proof-safe D&B wording. |
| KO career labels | English DB-backed labels such as `Security Guard`, `Full-time`, `Budapest, regional` | Source/UI fallback labels such as `보안요원`, `풀타임`, `부다페스트 및 지역 현장` | Fixed in `components/Career.tsx` without DB writes. |

KO remains a noindex, translation-review-required homepage draft. ZH remains a
partial/noindex localization surface. No route, sitemap, hreflang or indexing
policy changed in this pass.

## EN News Article Terminology

The EN launch article is DB-backed. Read-only inspection found that the live DB
content can still contain:

- `manned guarding`
- `reception and concierge services`

The canonical EN service labels are:

- `On-site Security Guarding`
- `Reception and Gatehouse Services`

No DB write was performed in this pass. A guarded, dry-run-default script was
added for later approval:

```bash
npx tsx scripts/update-launch-news-en-service-labels.ts --dry-run
npx tsx scripts/update-launch-news-en-service-labels.ts --apply
```

Production use still requires the explicit production target and allow flag:

```bash
npx tsx scripts/update-launch-news-en-service-labels.ts --target production --allow-production --dry-run
npx tsx scripts/update-launch-news-en-service-labels.ts --target production --allow-production --apply
```

The script targets only the launch article slug and writes only `news.bodyEn`.

## DE Privacy Date Decision

DE Privacy Policy v1.2 currently uses `5. Juni 2026`, while HU/EN v1.2 uses
`1 June 2026` / `2026. június 1.`. This was left unchanged.

`docs/legal/de-legal-release-review.md` explicitly documents that all German
legal publication placeholders were replaced with `5. Juni 2026`; therefore
the current reading is that the DE date is the German review-mode publication
date, not an accidental fallback typo.

## Remaining Decision-Gated Items

- Apply the guarded EN news terminology update to staging/production only after
  owner approval.
- Keep DE legal indexability, sitemap and hreflang decisions gated until
  legal/native review approves them.
- Continue native review for KO and ZH before any indexability change.
