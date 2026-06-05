# DE Phase 0 Audit and Rollout Plan

Last updated: 2026-06-05

Production URL: https://www.afm.hu

## Executive Summary

German started as a partial homepage-level localization. Production serves
`/de` successfully, and the German homepage is intentionally noindexed and
excluded from the sitemap.

The current source now includes a controlled review-mode implementation for the
eight German service detail routes. After deployment, those service routes are
expected to return 200 with `noindex, follow`, while still remaining outside
sitemap and hreflang. This is not the German SEO launch and not legal/final
approval.

The current source prevents the main broken-flow risks:

- service detail language switching is limited to HU/EN;
- legal page language switching is limited to HU/EN;
- news page language switching is HU-only;
- DE footer legal links point to existing EN legal pages;
- DE service cards may link to the review-mode DE service detail pages after
  deploy;
- `/de` is noindex and not in the sitemap.

## Production Route Inventory

Checked/defined on 2026-06-05. Production may still show the previous 404
state until the review-mode source is deployed.

| Route | Production status | Classification | Notes |
| --- | ---: | --- | --- |
| `/de` | 200 | ready/live as partial homepage | `meta robots="noindex, follow"`; not sitemap-listed. |
| `/de/szolgaltatasok/objektumorzes` | 200 after deploy | review-mode service detail | `noindex, follow`; not in sitemap/hreflang. |
| `/de/szolgaltatasok/portaszolgalat` | 200 after deploy | review-mode service detail | `noindex, follow`; not in sitemap/hreflang. |
| `/de/szolgaltatasok/biztonsagtechnika` | 200 after deploy | review-mode service detail | Includes DE-only FAQ 9-10; legal-review rows remain gated. |
| `/de/szolgaltatasok/tavfelugyelet-vonuloszolgalat` | 200 after deploy | review-mode service detail | `noindex, follow`; not in sitemap/hreflang. |
| `/de/szolgaltatasok/mystery-shopping-helyszini-audit` | 200 after deploy | review-mode service detail | Requires careful German wording to avoid surveillance/private-investigation drift. |
| `/de/szolgaltatasok/rendezvenybiztositas` | 200 after deploy | review-mode service detail | `noindex, follow`; not in sitemap/hreflang. |
| `/de/szolgaltatasok/hard-fm` | 200 after deploy | review-mode service detail | `noindex, follow`; not in sitemap/hreflang. |
| `/de/szolgaltatasok/soft-fm` | 200 after deploy | review-mode service detail | `noindex, follow`; not in sitemap/hreflang. |
| `/de/adatvedelem` | 404 | intentionally closed | No German legal page until legal review. |
| `/de/aszf` | 404 | intentionally closed | No German legal page until legal review. |
| `/de/impresszum` | 404 | intentionally closed | No German legal page until legal review. |
| `/de/hirek` | 404 | intentionally closed | German news is not enabled. |
| `/de/hirek/[slug]` | 404 expected | intentionally closed | Source only builds HU news params. |

## Indexing, Sitemap and Hreflang

Current production state:

- `/de` has `meta name="robots" content="noindex, follow, ..."` in the HTML.
- `/de` has canonical `https://www.afm.hu/de`.
- `/de` homepage alternates advertise only:
  - `hu`: `https://www.afm.hu/hu`
  - `en`: `https://www.afm.hu/en`
  - `x-default`: `https://www.afm.hu/hu`
- `/sitemap.xml` contains no DE URLs.
- DE service, legal and news routes are not in the sitemap.
- Service and legal hreflang remain HU/EN-only. DE service detail pages are
  intentionally not added to hreflang while they are review/noindex pages.

Recommended safe default:

- Keep `/de` noindexed until German homepage copy is reviewed.
- Keep DE service/legal/news detail routes out of sitemap and hreflang until
  the relevant pages have review approval and indexing approval.
- Do not mark German pages indexable as a side effect of importing translations.

## Source Behavior

Relevant source files and behavior:

- `lib/i18n/index.ts` includes `de` as a supported locale.
- `app/[locale]/page.tsx` renders the locale homepage for supported locales.
- `app/[locale]/layout.tsx` treats HU/EN as indexable homepage locales; DE is
  noindex.
- `app/sitemap.ts` includes only HU/EN homepages and readiness-approved
  service/legal/article routes.
- `lib/db/queries/services.ts` requires locale-specific service detail fields
  before DB-backed service detail pages can render. DE does not become public
  through HU fallback.
- `lib/services/de-service-details.ts` provides the reviewed source package as
  typed static DE review-mode content, without DB writes.
- `app/[locale]/szolgaltatasok/[slug]/page.tsx` renders the eight canonical DE
  service slugs from the static review-mode source and returns `notFound()` for
  unknown slugs.
- `lib/legal-routes.ts` allows legal pages only for HU/EN.
- `app/[locale]/hirek/page.tsx` and `app/[locale]/hirek/[slug]/page.tsx` are
  HU-only.
- `components/Nav.tsx` exposes all locale homepages from homepage routes, but
  limits service/legal switcher choices to HU/EN and news choices to HU.
- `components/Footer.tsx` maps DE legal footer links to EN legal pages with
  English fallback labels.
- `scripts/qa-preview-smoke.mjs` expects DE service routes to return 200 with
  `noindex, follow`, while DE legal/news routes remain 404 and DE service URLs
  remain forbidden in the sitemap.

## Footer Legal Fallback

Current DE production behavior:

- `/de` footer legal links point to existing EN legal pages:
  - `/en/adatvedelem`
  - `/en/aszf`
  - `/en/impresszum`
- Labels are English fallback labels:
  - `Privacy Policy (English)`
  - `Terms of Use (English)`
  - `Legal Notice (English)`
- The footer does not link to `/de/adatvedelem`, `/de/aszf` or
  `/de/impresszum`.

This is safe for the current partial-locale model.

## Language Switcher

Current source behavior:

- Homepage routes: HU/EN/DE/ZH/KO are available in the switcher.
- Service detail routes: only HU/EN are available.
- Legal routes: only HU/EN are available.
- News routes: only HU is available.

This is the chosen review-mode behavior. HU/EN service detail pages do not
advertise DE in the language switcher. DE service detail pages remain reachable
directly and from DE service links, and their switcher offers HU/EN only.

## German Homepage Copy Audit

The current German homepage is usable as a partial discovery page, but should be
treated as draft/review-required before indexing.

Findings:

- Hero headline and subhead are directionally aligned with the security-first
  positioning: `Weniger Risiko. Mehr Kontrolle.`
- The three values/pillars are still generic:
  - `Zuverlässigkeit`
  - `Expertise`
  - `Flexibilität`
  They should be aligned later with the stronger HU/EN operational pillars:
  transparent control, professional presence, response/accountability.
- Service card labels are broadly understandable but need native B2B review.
  `Personeller Objektschutz`, `Empfangs- und Pförtnerdienst`,
  `Sicherheitstechnik`, `Fernüberwachung und Interventionsdienst`, `Hard FM`
  and `Soft FM` are acceptable draft directions.
- `Mystery Shopping und Vor-Ort-Audits` should be reviewed because the current
  canonical EN label is `Mystery Shopping and Service Audit`; the German label
  should avoid implying surveillance, private investigation or an authority
  audit.
- `Veranstaltungsschutz` is understandable, but `Veranstaltungssicherheit` may
  be more natural as the canonical reviewed label.
- The DE contact form includes partial German labels and an EN legal fallback
  for privacy/terms links. This is acceptable while DE legal pages are closed.
- Cookie/analytics consent uses the EN fallback for DE. This is acceptable for
  Phase 0, but DE-native consent copy should be part of DE homepage polish and
  legal review.
- Proof-sensitive claims visible on the homepage include 30+, 200+, D&B AA and
  24/7. These are real facts, but German wording should be reviewed for
  placement and scope-safety before indexing.
- LinkedIn footer icon links to the official company profile without tracking
  parameters or LinkedIn scripts.

## DE Rollout Plan

### DE-0 Current-state Audit and Route Safety

Goal: document the current German behavior and prevent accidental publication
of unfinished DE routes.

Deliverables:

- route inventory for `/de`, DE service, legal and news routes;
- indexing/sitemap/hreflang inventory;
- footer legal fallback audit;
- language switcher audit;
- German glossary seed.

Risk: low. This is documentation and audit only.

Owner / decision needed: product owner confirms that Germany-facing rollout
should start with the safe phased model.

Done criteria:

- current route state documented;
- DE glossary created;
- backlog contains explicit DE rollout tasks;
- QA still expects DE detail routes to stay unavailable.

### DE-1 German Homepage Polish

Goal: make `/de` suitable for professional review without opening detail pages.

Deliverables:

- DE-native hero, values/pillars, contact and consent copy review;
- reviewed service card labels and short descriptions;
- no new claims;
- no route/indexing change yet.

Risk: medium. German wording can alter claim scope if translated too freely.

Owner / decision needed: German native/business reviewer and proof-sensitive
copy reviewer.

Done criteria:

- homepage text is native-quality German;
- service labels match approved glossary;
- proof claims remain scope-safe;
- `/de` may still stay noindex until final approval.

### DE-2 German Legal Strategy

Goal: decide whether and how German legal pages should exist.

Deliverables:

- decision between EN fallback and reviewed DE legal pages;
- legal translation workflow;
- disclaimer/verbindliche Sprachfassung policy if non-HU legal text is used;
- footer and language switcher policy.

Risk: high. Legal pages must not be machine-translated and published as final.

Owner / decision needed: legal/DPO/owner.

Done criteria:

- legal route policy approved;
- no `/de/adatvedelem`, `/de/aszf` or `/de/impresszum` until reviewed;
- footer legal fallback remains safe.

### DE-3 German Service Detail Draft Translation

Goal: create German drafts for the eight service detail pages and make them
available in controlled review mode without SEO publication.

Deliverables:

- German translation package for all eight services;
- use cases, included items, process steps, trust items and FAQ translated in
  the same count/order as HU/EN;
- proof-sensitive rows marked for review;
- no DB import/apply until review is approved;
- review-mode runtime source may render the eight canonical DE service routes
  with `noindex, follow`, outside sitemap and hreflang.

Risk: medium/high. Service copy includes regulated activity, ISO, licence,
24/7, reporting and audit language.

Owner / decision needed: German business translator plus proof/compliance
reviewer.

Done criteria:

- every required service field has a reviewed German draft;
- no exact licence-number exposure in generic service body/trust copy;
- no SLA, legal/GDPR guarantee, public-authority or surveillance overclaim.

### DE-4 German Native and Legal Review

Goal: approve German service and legal-sensitive wording for public use.

Deliverables:

- native German review;
- legal/compliance review of regulated-service and privacy-sensitive wording;
- verified glossary decisions;
- final readiness signoff per page type.

Risk: high if skipped.

Owner / decision needed: German reviewer, legal/DPO and proof owner.

Done criteria:

- service copy approved;
- legal strategy approved;
- glossary status updated from draft where appropriate;
- allowed/restricted proof wording documented.

### DE-5 Sitemap, Hreflang and Indexing Enablement

Goal: publish German pages only when readiness and review criteria are met.

Deliverables:

- DB readiness fields populated for approved DE service pages;
- route smoke tests for DE pages that are intentionally opened;
- sitemap includes only approved DE URLs;
- hreflang includes only reciprocal existing DE URLs;
- `/de` noindex removed only after approval.

Risk: medium. SEO mistakes can expose incomplete pages or invalid alternates.

Owner / decision needed: owner/SEO/developer release approval.

Done criteria:

- approved DE pages return 200 and become indexable only after explicit
  sitemap/hreflang/noindex approval;
- review-mode service pages remain 200/noindex;
- non-approved legal/news pages remain 404/noindex;
- sitemap and hreflang match the approved route set;
- production smoke matrix is updated intentionally.

### DE-6 German Content Growth / News

Goal: add German article/news content only after homepage and service
foundation is stable.

Deliverables:

- German article policy;
- translation workflow from reviewed HU/EN article source;
- Article JSON-LD/hreflang/sitemap policy;
- no German news links until content exists.

Risk: medium. Unreviewed articles can reintroduce proof, legal or terminology
drift.

Owner / decision needed: editorial owner, German reviewer and legal/proof
review where needed.

Done criteria:

- German news route exists only with reviewed content;
- no broken DE news links;
- article schema and sitemap are route-ready.

## QA Expectations

Current `scripts/qa-preview-smoke.mjs` behavior is aligned with DE review mode:

- `/de` homepage may return 200.
- DE service detail routes are expected 200 with `noindex, follow`.
- DE legal routes are expected 404.
- `/de/hirek` is expected 404.
- DE URLs are forbidden in the sitemap while partial/noindex.

Run this smoke matrix against a preview deployment or production only after the
review-mode source has been deployed. Production will fail the new DE route
expectation while it still serves the previous build.

## Recommended Next Implementation Step

Next, deploy the DE review-mode service detail implementation to a preview and
run route/noindex QA there. Keep `/de` and `/de/szolgaltatasok/*` noindexed and
do not open DE legal/news detail routes. Full SEO publication remains gated
until native/business review, legal/proof review and explicit sitemap/hreflang
approval are complete.

## 2026-06-05 Service Tile Source Package Update

The German service tile translation package has been staged as source input and
is now wired into a controlled runtime review mode for German service routes.

Validated files:

- `docs/translations/de/source/service_tiles_de_batch1.csv`
- `docs/translations/de/source/service_tiles_de_batch2.csv`
- `docs/translations/de/source/service_tiles_de_full.csv`
- `docs/translations/de/source/service-tiles-de-batch1.md`
- `docs/translations/de/source/service-tiles-de-batch2.md`

Validation report:

- `docs/translations/de/service_tiles_de_full_validation.md`

Validated state:

- 681 total source rows.
- All 8 service tiles present.
- 2 SHARED JSON rows valid.
- 657 `translated_draft` rows.
- 24 `legal_review_required` rows.
- DE-only `biztonsagtechnika` FAQ 9-10 rows are staged and gated.

Runtime route policy after the review-mode implementation is deployed:

- DE service detail routes return 200 with `noindex, follow`.
- DE service URLs are not in sitemap.
- DE service URLs are not in hreflang.
- Legal/homepage/news German inputs remain separate future passes.
