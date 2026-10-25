# Consent-Gated Ahrefs Analytics Implementation Plan

**Goal:** Install the supplied public Ahrefs site key without bypassing analytics consent or changing GA4.

**Architecture:** A client-only loader inserts the official asynchronous script into the document head after opt-in. It sends sanitized-URL pageviews, uses the existing consent events, and suppresses Ahrefs' automatic link/form events so form values and contact link targets are not collected. CSP allows only `https://analytics.ahrefs.com` in script/connect sources. DB operations, environment-file changes and service-copy changes are excluded. The owner subsequently authorised push/deployment and activation after confirming the official SCC was signed and sent.

**Tech stack:** Next.js App Router, TypeScript, existing first-party consent state, node:test and Playwright.

## Implementation

- [x] Add regression coverage for the loader, public key, consent, path sanitization, route changes and withdrawal. Observe the missing-integration failure before implementing.
- [x] Add `lib/analytics/ahrefs.ts` and `components/analytics/AhrefsAnalytics.tsx`; wire the component into the locale layout. Keep GA4 unchanged.
- [x] Use `data-no-pageview-auto` and explicit `sendEvent("pageview")` with a sanitized `data-page-location`. Suspend automatic interactions without cancelling DOM events. Disable sends on withdrawal, storage failure, non-public routes, and query-bearing referrers.
- [x] Add the exact Ahrefs origin to script/connect CSP only. Add a real vendor-script browser smoke with collection intercepted, plus mocked consent regressions.
- [x] Document the provider, data categories, consent policy, verification limitation, and legal-review/release gates. Add a targeted v1.4 Ahrefs notice over the retained v1.3 legal baseline.
- [x] Run TypeScript, lint, unit tests, copy guard, build, targeted browser tests and diff checks. Report local verification separately from production installation.

## Verification Result

Initial validation passed TypeScript, lint, 234 unit tests, 33 copy checks,
production build (100 generated pages), 567 local route smoke checks and 24 local analytics browser tests.
A pre-release review then identified withdrawal across mixed/rollback builds;
the failures were reproduced before mirroring rejection and versioning expanded
acceptance in the legacy key. Legacy-only reacceptance cannot revive old Ahrefs
consent. The expanded unit suite contains 237 tests; final browser verification
includes these regressions. Final local validation passed TypeScript, lint,
237 unit tests, 33 copy checks, build, 567 route checks and 25 browser tests
(one inactive-only case skipped). Independent re-review found no important
remaining consent-transition regressions. The browser suite uses the real Ahrefs script for collection, SPA
navigation, automatic-interaction suppression and withdrawal checks; all
collection and contact requests remain intercepted until browser-context
closure. A microtask timing leak found by the real-script test was reproduced
and fixed by keeping automatic interactions suspended through the full native
event dispatch. A separate code review identified the teardown guard, which
was also fixed. These results describe the activated local build based on production main
`0e080c5`; the one inactive-only browser test was intentionally skipped. No DB writes were performed. The GA4 public ID
was set only in the QA build/test process environment because the local env
file has no GA4 ID; no env files were edited.

## Release Gates

The data key is a public installation identifier, not a secret. The official script currently checks its key and page-location attributes for each event; regression QA must exercise the real script so a vendor change cannot silently invalidate the suppression. Ahrefs collection requests are fulfilled locally in automated QA. No real contact submission is permitted. The owner authorised a minimal real production measurement check after release; this is separate from intercepted automated QA. Prior GA4-only acceptance must prompt again; prior rejection remains respected. Signed-document/receipt evidence stays private. Ahrefs' crawler does not accept consent, so automatic installation recheck may not see the gated script; do not bypass consent for its user agent.
