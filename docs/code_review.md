# Code Review Checklist

Use this before completing any substantial task.

## Functionality

- Does the change match the roadmap item?
- Does the feature work in the intended public/admin flow?
- Are expected 404 states preserved?
- Are incomplete services hidden from sitemap and route generation?
- Are edge cases handled?

## Build and type safety

Run:

- npm run build
- npm run lint
- npx tsc --noEmit

Record failures if any command cannot be run.

## SEO and indexing

- Only real public URLs are indexable.
- Draft/admin/API/legacy URLs do not leak into sitemap.
- Canonical URLs are correct.
- Hreflang alternates are correct.
- Root redirect remains / -> /hu.
- Legacy spam/cPanel URLs still return 410 Gone where intended.
- Sitemap contains only ready pages.

## Service pages

- One clear H1.
- Useful SEO title and description.
- Breadcrumb present.
- Service schema present where appropriate.
- FAQPage schema only if visible FAQ renders.
- Related services point only to public or intentionally planned services.
- Contact CTA uses canonical slug.

## Accessibility

- Semantic HTML.
- Buttons are used for actions.
- Links are used for navigation.
- Keyboard focus is preserved.
- Images have useful alt text when meaningful.
- Heading order is logical.

## Responsive UI

- Mobile layout works.
- Tablet layout works.
- Desktop layout works.
- Long Hungarian text does not break the layout.
- CTA remains visible and usable.

## Copy quality

- Copy is specific.
- Claims are verifiable.
- No invented logos, references, case studies, or certifications.
- B2B visitor understands the value within a few seconds.

## Final summary

When done, summarize:

1. Files changed
2. What changed
3. Checks run
4. SEO/indexing impact
5. Risks
6. Manual QA steps