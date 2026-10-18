# Trust Center links — verification

Date: 2026-10-18. Audit item: A01.

## Approved scope

HU/EN footer links and contextual links below homepage certificates and the
trust sections of object guarding and reception/gatehouse services. Existing
Trust Center routes and content are reused. No main navigation, legal copy,
schema, indexing policy, dependencies, or database changes.

## Local verification

- Existing unit suite: 164/164 passed.
- Full lint and TypeScript checks: passed.
- Copy QA: 33 checks across 225 files passed.
- Production build: passed, 100 pages generated.
- Rendered HTML acceptance: 18/18 pages passed. Covers both public locales,
  both target services, an unrelated service, both Trust Center destinations,
  and DE/FR/KO/ZH home/service pages. Checks target status, link placement,
  exact locale copy, H1, canonical, robots, and unchanged review-locale gating.
- Desktop 1280 × 900 and mobile 390 × 844 inspected. Contextual links wrap
  within the page; visible keyboard focus and destination navigation checked.
- Independent scope and code-quality reviews: no actionable findings.
- Build reads used the verified staging database; no database writes or form
  submissions were performed.

## Release state

Implementation verified locally. Vercel Preview verification and production
approval are recorded in the pull request. This document does not declare the
change live or claim an improvement in search rankings or AI recommendations.
