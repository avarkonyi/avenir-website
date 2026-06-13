# Trust Center Runtime Implementation Plan

Status: MVP source implementation completed for HU/EN; deploy verification
pending.
Last updated: 2026-06-13

This file now records the implemented HU/EN Trust Center MVP structure and the
remaining release gates. Production deploy still requires separate approval.

## Implemented Routes

- HU: `app/[locale]/megfelelosegi-kozpont/page.tsx`
- EN: `app/[locale]/trust-center/page.tsx`

Do not add DE/ZH/KO Trust Center routes in the MVP.

## Implemented Data Source

The MVP uses static typed source data.

Implemented file:

- `lib/trust-center-content.ts`
- `lib/trust-center-routes.ts`

Implemented approach:

- approved MVP entries are copied from the content spec;
- Markdown docs are not parsed at runtime;
- the database is not used for the MVP;
- public document links are explicit and limited to approved public routes/PDFs.

Future automation can generate typed content from a stricter catalog format, but
the first MVP should avoid introducing a new generator unless there is a clear
maintenance need.

## Implemented Component

- `components/TrustCenterPage.tsx`
  - page composition, locale-specific copy, section order.

The MVP intentionally uses one small page component instead of a component
family. Pending proof decisions stay in docs, not in public UI.

## Metadata

HU and EN are implemented as indexable source routes.

Implemented HU:

- title: `Megfelelőségi központ | Avenir Facility Management Kft.`
- canonical: `https://www.afm.hu/hu/megfelelosegi-kozpont`

Implemented EN:

- title: `Trust Center | Avenir Facility Management Kft.`
- canonical: `https://www.afm.hu/en/trust-center`

DE:

- not in MVP;
- if added later, use noindex/review until native/legal/proof approval.

## Sitemap and Hreflang

Implemented:

- HU and EN Trust Center URLs are added to sitemap.
- HU/EN metadata alternates use x-default = HU.
- DE/ZH/KO remain outside sitemap/hreflang.

## JSON-LD and AI-Search

MVP launches without proof-derived credential JSON-LD.

If structured data is added later:

- use only approved public entries;
- do not add licence/D&B `hasCredential` without proof-owner approval;
- do not express AutoWallis Pest as `customer`, `review`, `memberOf`,
  `brand`, `sameAs`, `award` or endorsement.

`llms.txt` and `llms-full.txt` are updated in source for the HU/EN Trust Center
routes and the approved-public-summary limitation.

## QA Requirements

Before deployment:

- `npx tsc --noEmit`
- `npm run lint`
- `npm run test`
- `npm run qa:copy`
- `npm run build`
- `npm run qa:preview -- <preview-url>`
- `git diff --check`

After preview deploy:

- HU route returns 200 only if approved.
- EN route returns 200 only if approved.
- DE/ZH/KO Trust Center routes remain 404 unless explicitly implemented later.
- Sitemap includes HU/EN only after approval.
- Hreflang includes HU/EN only after approval.
- No noindex appears on approved HU/EN Trust Center routes.
- No DPA/SCC/LIA, signed consent PDF, raw insurance policy or unapproved D&B
  PDF is linked.

## Copy Guard Requirements

Add or extend guards before launch if the implementation introduces new public
proof copy:

- no `OPTEN` or `A+ Bonit` in Trust Center unless a separate OPTEN proof is
  approved;
- no raw DPA/SCC/LIA links;
- no signed consent PDF links;
- no raw insurance policy links;
- no `guaranteed`, `risk-free`, `zero supplier risk`, GDPR guarantee or
  SLA-like wording;
- no private-investigation licence in marketing/proof cards;
- no testimonial/case-study/performance wording for AutoWallis Pest.

## Deployment Checklist

1. Resolve P1 items in `docs/trust_center/open_decisions.md`.
2. Proof owner signs off the MVP inclusion matrix.
3. Legal/DPO signs off data-protection, security and licence wording.
4. Owner signs off AutoWallis Pest Trust Center inclusion or homepage-only
   decision.
5. Developer implements HU/EN routes from `public_mvp_content_spec.md`.
6. QA verifies no forbidden documents or claims are linked.
7. Preview is reviewed.
8. Sitemap/hreflang changes are added only after route approval.
9. Production deploy is approved separately.
