# Trust Center Runtime Implementation Plan

Status: future implementation plan, not executed.
Last updated: 2026-06-13

This plan describes how to implement the public HU/EN Trust Center MVP later.
It must not be treated as permission to launch the routes without the release
gates below.

## Proposed Routes

- HU: `app/[locale]/megfelelosegi-kozpont/page.tsx`
- EN: `app/[locale]/trust-center/page.tsx`

Alternative implementation:

- single locale-aware route helper that maps the HU slug and EN slug to one
  shared `TrustCenterPage` component.

Do not add DE/ZH/KO Trust Center routes in the MVP.

## Proposed Data Source

Use static typed source data for the MVP.

Recommended file:

- `lib/trust-center/content.ts`

Recommended approach:

- copy only approved MVP entries from the content spec;
- include stable ids matching `docs/trust_center/proof_catalog.md`;
- do not parse Markdown docs at runtime;
- do not use the database for MVP;
- keep public document links explicit and reviewed.

Future automation can generate typed content from a stricter catalog format, but
the first MVP should avoid introducing a new generator unless there is a clear
maintenance need.

## Proposed Components

- `components/trust-center/TrustCenterPage.tsx`
  - page composition, locale-specific copy, section order.
- `components/trust-center/TrustSection.tsx`
  - section wrapper with heading, intro and optional notes.
- `components/trust-center/ProofCard.tsx`
  - proof item card with title, status, validity, summary, optional link.
- `components/trust-center/DocumentLinkList.tsx`
  - list of approved public documents and notices.
- `components/trust-center/DecisionNotice.tsx`
  - optional internal/dev-only pattern if pending items are documented outside
    the public page; do not show unresolved decisions to public users unless
    product owner approves.

## Metadata

HU and EN should be indexable only after content/proof approval.

Proposed HU:

- title: `Megfelelőségi központ | Avenir`
- canonical: `https://www.afm.hu/hu/megfelelosegi-kozpont`

Proposed EN:

- title: `Trust Center | Avenir`
- canonical: `https://www.afm.hu/en/trust-center`

DE:

- not in MVP;
- if added later, use noindex/review until native/legal/proof approval.

## Sitemap and Hreflang

Only after owner/proof/legal approval:

- add HU and EN Trust Center URLs to sitemap;
- add reciprocal HU/EN hreflang and x-default according to the site pattern;
- keep DE/ZH/KO out of sitemap/hreflang until reviewed.

Do not add sitemap/hreflang entries in a docs-only or pre-approval pass.

## JSON-LD and AI-Search

MVP can launch without new proof-derived JSON-LD.

If structured data is added later:

- use only approved public entries;
- do not add licence/D&B `hasCredential` without proof-owner approval;
- do not express AutoWallis Pest as `customer`, `review`, `memberOf`,
  `brand`, `sameAs`, `award` or endorsement.

Update `llms.txt` and `llms-full.txt` only after Trust Center routes are public.

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

