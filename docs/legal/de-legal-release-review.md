# German Legal Pages Review Release

Last updated: 2026-06-06

This note documents the controlled German legal-page release state. It is a
review-mode publication note, not a final SEO launch approval.

## Source Files

The German legal pages render from these versioned markdown sources:

- `docs/translations/de/legal/datenschutzerklaerung-de-v1.2.md`
- `docs/translations/de/legal/rechtliche-hinweise-de-v1.1.md`
- `docs/translations/de/legal/impressum-de.md`

All `[Datum der Veröffentlichung]` placeholders were replaced with
`5. Juni 2026`.

## Live Routes After Deploy

After the build containing this change is deployed, these routes are expected
to return 200:

- `/de/adatvedelem`
- `/de/aszf`
- `/de/impresszum`

They are intentionally review-mode legal routes:

- `noindex, follow`;
- excluded from `sitemap.xml`;
- excluded from legal hreflang alternates;
- not submitted by the default IndexNow URL list.

HU/EN legal route behavior is unchanged.

## Content-Safety Adjustments

The DE Privacy Policy §8 now describes the actual consent-gated analytics
implementation:

- Google Analytics 4 (GA4) is loaded only after active consent;
- no Google Analytics scripts or events are sent after rejection/no consent;
- no Google Tag Manager is used;
- no LinkedIn Insight Tag is used;
- no other marketing tracking pixels are used.

The DE Legal Notices no longer include a two-working-day response promise in
the website contact-form section. It now uses softer contact-response wording.

All non-Hungarian-language clauses were generalized so they refer to all
non-Hungarian versions, while preserving the Hungarian text as authoritative.

The DE Impressum parity/layout polish is complete in source:

- `docs/translations/de/legal/impressum-de.md` now follows the HU/EN factual
  structure for company data, representative, DPO, general contact,
  regulated-profession wording, authority licences, supervisory authorities,
  professional liability insurance, hosting and copyright;
- the publication date remains `5. Juni 2026`;
- the DE Impressum page renders labelled rows and sub-sections instead of a
  short plain markdown block;
- DE Impressum internal links point to `/de/adatvedelem` and `/de/aszf`;
- no sitemap, hreflang or indexing approval is implied by this polish pass.

## Processor / Transfer Wording

The DE Privacy Policy keeps the existing processor and transfer wording:

- Resend / Plus Five Five, Inc. with SCC safeguards;
- Vercel Inc. with EU-US Data Privacy Framework / Article 45 framing;
- Neon, LLC with SCC safeguards.

No FISA Section 702 or CLOUD Act wording was added in this pass.

## Navigation And Linking

DE footer legal links now point to the DE legal routes:

- `/de/adatvedelem`
- `/de/aszf`
- `/de/impresszum`

DE contact privacy notices now point to `/de/adatvedelem`.

The legal-page language switcher allows HU/EN/DE. Service-detail pages remain
HU/EN only in the language switcher. News routes allow HU/EN and DE review
mode where implemented; DE news remains outside sitemap/hreflang while
noindex.

## Remaining Gates

Before any German legal SEO launch:

- confirm native/legal review signoff;
- decide whether DE legal pages become indexable;
- update sitemap/hreflang intentionally;
- confirm no DE legal route is submitted to indexing tools while noindex.
