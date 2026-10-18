# CODE — findings
Coverage: Release diff `git diff 75b2cd7..9b767ef -- . ':!docs'` (106 files). I read every routing, SEO, analytics, DB, admin, email, QA and test-runner file in full. I checked the large translation/legal content files (`lib/services/{fr,ko,zh}-service-details.ts`, `lib/i18n/*.ts`, `lib/legal-content.ts`, `lib/de-legal-content.ts`, `lib/current-privacy-content.ts`) for structure and locale gating only; their wording belongs to the copy/legal areas. Outside the diff I read the security surface in full: `proxy.ts`, `next.config.ts`, `auth.ts`, `lib/admin/*`, every admin `_actions.ts` (auth check per exported action), both `app/api/admin/upload-*` routes, `app/api/contact/route.ts`, `lib/contact-schema.ts`, `lib/rate-limit.ts`, `lib/resend.ts`, `lib/email-templates/*`, `components/JsonLd.tsx`, `lib/db/*`, `.github/workflows/ci.yml`, `tests/run-unit-tests.ts`, `scripts/qa-preview-smoke.mjs`, `scripts/qa-analytics.mjs`, `scripts/qa-copy-guard.mjs`, and the new `scripts/audit-*.mjs` / `verify-public-seo-audit.mjs`. I checked how drizzle-orm 0.45.2 and @neondatabase/serverless 1.1.0 wrap errors, in node_modules. Crawl inputs used: `crawl/index.json`, `crawl/pages/*.json`, `sitemap.xml`, `checks/qa-preview.txt`, `checks/qa-analytics.txt`. I made 12 light GETs to production: 404 headers and HTML for `/hu/<unknown>`, `/fr/<unknown>`, `/<unknown>`, `/hu/szolgaltatasok/<unknown>`, the `/fr` HTML tag, the KO OG image and `/codeaudit/opengraph-image`.
NOT covered: I did not run `next build` (it needs a DB). I had no access to Vercel or Neon runtime logs, so the log-content findings come from reading the code. I did not test Resend's handling of control characters in a subject, and I did not test whether Next exposes an action ID for `loadSiteSettings`.

## Findings

### CODE-001 — A failed contact-form DB insert writes the visitor's personal data to server logs, while the log line says it does not
- Severity: P1
- Category: security / data-protection (logging)
- Where: `app/api/contact/route.ts:143-151`; `lib/db/redact.ts:48-65`; `lib/admin/safe-action-error.ts:8-10` (used by `app/admin/(dashboard)/messages/_actions.ts:263-273`); upstream `node_modules/drizzle-orm/errors.js:10-19`, `node_modules/drizzle-orm/pg-core/session.js:41`
- Evidence: route.ts:144-150 logs `` `Cause: ${sanitizeDbErrorMessage(err)}.` `` followed by `"Personal form fields were not logged."`. drizzle-orm 0.45.2 wraps every failed query in `DrizzleQueryError`, whose message is `` `Failed query: ${query}\nparams: ${params}` `` (errors.js:12-13). `sanitizeDbErrorMessage` only redacts `postgres://…` and `password=` (redact.ts:62-64). The insert at route.ts:134-142 binds `name, company, email, phone, service, message, locale` as params, so on failure all of them reach `console.error` and Vercel logs/drains. The same applies to `sendReply.dbUpdateAfterSend`: its params are `replySubject` and `replyBody` (messages/_actions.ts:257-268).
- Problem: This is confirmed by the code path; it fires on any insert or update failure (Neon outage, constraint error). The visitor's name, e-mail, phone and free-text message would then be copied into log storage. That storage is outside the documented processing and retention, and the code's own log line says it does not happen. The unit test `tests/db-error-diagnostic.test.ts` uses synthetic errors and does not cover `DrizzleQueryError`.
- Fix: Never log `DrizzleQueryError.message`. In `sanitizeDbErrorMessage`, drop everything from `"\nparams:"` onward and log only the query verb/table, e.g. `message.replace(/\nparams:[\s\S]*$/, "\nparams: [redacted]")`. Better still, have the contact route and `safeActionError` log only `databaseErrorDiagnostic(err)` plus the error class name. Add a unit test that builds a real `new DrizzleQueryError(sql, ["Name","a@b.hu","+36…","msg"], cause)` and asserts that none of the values appear.
- Status: NEW
- Confidence: high (code path); not verified against real logs

### CODE-002 — Releases still fail closed on any transient DB error during build, and this has happened again since June
- Severity: P2
- Category: build/deploy resilience
- Where: `lib/db/queries/services.ts:482-503`; `app/[locale]/szolgaltatasok/[slug]/page.tsx:46-51,62,148`; `app/[locale]/layout.tsx:48-53,152-184`; `app/[locale]/page.tsx:32-36,73-76`; `app/sitemap.ts:8-15`; `lib/db/queries/news.ts:288-295`; `lib/db/index.ts:16`; `.github/workflows/ci.yml:40-43`
- Evidence: `throw new Error(\`[service-paths] ${surface}: service path generation requires a reachable database.\`)` (services.ts:499-501) is unchanged. The fail-closed design is still in place. It is also not the only blocker. The root `[locale]` layout runs two unguarded DB queries (certifications, services) for every one of the ~100 prerendered pages (layout.tsx:152-184, `revalidate = 3600` plus `generateStaticParams` for 6 locales). The homepage, Footer, News and the sitemap (`getAllIndexablePublishedNewsPathsForSitemap` throws by design) also query at build. No retry exists anywhere: `neon(process.env.DATABASE_URL)` uses default fetch, with no backoff. `docs/audits/2026-10-17/repair-verification.md:41` records a second occurrence: the first Preview build of `a2a9aad` "a DE adatvédelmi oldal generálásakor Neon `fetch failed` hibával leállt". `/de/adatvedelem` has no service query, so the failure came through the layout.
- Problem: A single failed Neon HTTP round-trip, out of several hundred during `next build` (~100 pages × 2-5 queries), aborts the whole release. Vercel keeps the previous production deployment live, so this is a release-blocking risk (for example an urgent legal-text fix cannot ship), not an outage. CI never runs the build, so this path is only exercised on Vercel.
- Fix (keeps the "no incomplete service layer" guarantee, because nothing ever returns `[]` on error):
  1. Add a bounded retry for connection-class failures only: `fetch failed`/`TypeError`, ECONNRESET, ETIMEDOUT, EAI_AGAIN, `UND_ERR_*`, HTTP 502/503/504, Postgres 53300/57P01. Use 3 attempts with roughly 0.5s/1.5s/4s backoff plus jitter. Never retry SQL errors. Apply it to SELECT helpers (`getAllPublishedServicePaths`, layout/homepage reads) or set `neonConfig.fetchFunction` with retries limited to `process.env.NEXT_PHASE === "phase-production-build"`, so the contact INSERT is never replayed.
  2. Add a `"prebuild"` gate (`scripts/db-warmup.mjs`) that runs `SELECT 1` with retries for up to about 60s. This wakes a suspended Neon compute before Next starts parallel workers, and the gate fails fast with a redacted, classified error.
  3. Cut the build fan-out: wrap the per-locale layout, homepage and footer reads in `unstable_cache`/`"use cache"` tagged `public-content`, and add `revalidateTag("public-content")` to `revalidatePublicContent()`.
  4. After retries are exhausted, still throw (unchanged guarantee). Document "retry the build once" in the staging runbook before escalating.
  Do not copy the news pattern of returning `[]` on error: it would not unblock the build (layout and sitemap still need the DB) and it would hide failures.
- Status: NEW (June production failure and October Preview recurrence are documented; the mitigation is not implemented)
- Confidence: high

### CODE-003 — `qa:preview` encodes the old locale policy: 16 false FAILs on production and no FR/ZH/KO review checks
- Severity: P2
- Category: QA tooling drift
- Where: `scripts/qa-preview-smoke.mjs:14-16,43-50,55-57,70,91-127,138-148,150-166,180-199,509-537`; `checks/qa-preview.txt`
- Evidence: `const UNREADY_SERVICE_LOCALES = ["zh", "ko"];` expects 404. Production returns 200, giving "Result: FAIL (16 issues)", for example `- /zh/szolgaltatasok/objektumorzes status: expected 404, got 200`. There is no `fr` anywhere in the matrix: legacy slugs (`["hu", "en", "de", "zh", "ko"]`, line 70), legal, news, trust, recruitment and disclosure 404 lists all omit it. `EXPECTED_200` checks `/hu`, `/en`, `/ko` but not `/de`, `/zh`, `/fr`. The noindex checks cover DE only (`checkDeReviewServiceNoindex`). Nothing asserts that review pages emit zero hreflang, or that HU/EN pages list only `hu/en/x-default`. `SITEMAP_FORBIDDEN` uses a whole-locale prefix only for `"/ko"`, so a `/fr/...`, `/zh` or `/de` homepage entry in the sitemap would pass.
- Problem: The documented release gate is now red by default on a correct production deployment. Real regressions in FR/ZH/KO gating (for example a review page losing `noindex`) would go unnoticed. The new `scripts/verify-public-seo-audit.mjs` already encodes the correct policy, so the repo has two contradictory sources of truth. (SEO-006 reports the symptom.)
- Fix: Replace `UNREADY_SERVICE_LOCALES` with `REVIEW_SERVICE_LOCALES = ["de","zh","ko","fr"]`: expect 200 plus `noindex` plus `hreflang` count 0 for each homepage and its 8 services. Add `fr` to every 404 matrix (legal, news, trust, recruitment, disclosure, legacy slugs). Add `"/de"`, `"/zh"`, `"/fr"` (prefix) to `SITEMAP_FORBIDDEN`. Assert that HU/EN alternates are exactly `hu`, `en`, `x-default`. Derive the locale lists from `lib/locales.ts` and `lib/services/publication.ts` instead of literals.
- Status: NEW (symptom also in SEO-006)
- Confidence: high

### CODE-004 — WebSite JSON-LD `inLanguage` still lists all locales, now including `fr`, on indexable pages
- Severity: P2
- Category: schema / SEO-indexing
- Where: `lib/homepage-schema.ts:112`; `lib/seo-data.ts:105`
- Evidence: `inLanguage: [...SEO_LOCALES],` with `export const SEO_LOCALES = LOCALES;`. Live `/hu` emits `["hu","en","de","zh","ko","fr"]`.
- Problem: Indexed HU/EN pages advertise the noindex review languages as site languages, which contradicts the hreflang and sitemap policy. The June recommendation was not applied, and the release widened the list by adding `fr`.
- Fix: `inLanguage: ["hu", "en"]`, or import `INDEXABLE_SERVICE_LOCALES` from `lib/services/publication.ts`.
- Status: KNOWN (June P2-01, not fixed; duplicates SEO-005 / AIGEO-003)
- Confidence: high

### CODE-005 — Admin mutations still have no audit trail
- Severity: P2
- Category: security / admin accountability
- Where: `app/admin/(dashboard)/*/_actions.ts` (for example `services/_actions.ts:433-528`, `news/_actions.ts:141-253`); `lib/admin/safe-action-error.ts`
- Evidence: Successful create, update, delete, publish and reply actions do not log or store who changed what. Only failures are logged (`console.error(\`[admin-action] ${action} failed: …\`)`).
- Problem: There is no record of which admin published, unpublished or edited public service, legal-adjacent or certification content, or sent a customer reply. That matters for a regulated security supplier and for incident review.
- Fix: As June F-007 proposed, add a small `admin_audit_log` table (adminEmail, action, entity, entityId, ts, minimal diff without personal data) written after each successful mutation. Run the migration on staging first.
- Status: KNOWN (June F-007, rated P1 there; still open)
- Confidence: high

### CODE-006 — The new DB diagnostic cannot classify Neon HTTP connection failures, the failure class actually observed
- Severity: P3
- Category: observability / correctness
- Where: `lib/db/error-diagnostic.ts:21-33`; `tests/db-error-diagnostic.test.ts:11-14`
- Evidence: The walker follows only `.cause`. The Neon HTTP driver throws `new NeonDbError("Error connecting to database: " + err)` and stores the fetch error as `M.sourceError = ee`, not `cause` (`node_modules/@neondatabase/serverless/index.mjs`, the `sourceError=ee` site). Drizzle then wraps that in `DrizzleQueryError` with `.cause = NeonDbError`. The undici code (`ENOTFOUND`, `UND_ERR_CONNECT_TIMEOUT`, …) therefore sits under `.sourceError.cause` and is never reached, and `UND_ERR_*` codes are not in the allowlist anyway. The test uses a synthetic `{ cause: { code: "ENOTFOUND" } }`.
- Problem: For exactly the October `fetch failed` failure (CODE-002), the build log would say `unclassified database failure`, which defeats the purpose of the helper.
- Fix: In the loop, also follow `sourceError` (`current = cause ?? sourceError`). Add `UND_ERR_CONNECT_TIMEOUT`, `UND_ERR_SOCKET`, `UND_ERR_HEADERS_TIMEOUT` and a fixed label for `TypeError: fetch failed`. Test with a real `NeonDbError`/`DrizzleQueryError` shape.
- Status: NEW
- Confidence: high

### CODE-007 — Other QA gaps against the new locale policy
- Severity: P3
- Category: QA coverage
- Where: `scripts/qa-analytics.mjs:81`; `tests/analytics-consent.spec.ts:52-57`; `scripts/qa-copy-guard.mjs:18-210`; `tests/run-unit-tests.ts:1-32`; `lib/upload-file-signatures.test.ts`; `package.json:43-46`
- Evidence:
  - `["playwright", "test", "tests/analytics-consent.spec.ts", …]`: the new `tests/analytics-withdrawal.spec.ts` (167 lines) is not in any npm script or CI. It was run once by hand, per text-audit-closure-verification.md:56.
  - The consent spec only visits `/hu`, `/en` and their objektumorzes pages; it never checks the DE/ZH/KO/FR banner.
  - Copy-guard patterns are HU/EN only (`/\b(within\s+24\s+hours|24\s+hours|24\s+órán…)\b/i`, `guaranteed arrival time`, `legal advice`), while about 1,170 lines of FR/KO/ZH review copy were added. "24 Stunden", "sous 24 heures", "24시간", "24小时", "garanti", "보장" and "保证" are never checked.
  - `lib/upload-file-signatures.test.ts` (the upload magic-byte tests) is not imported by `tests/run-unit-tests.ts`, so `npm run test` and CI never run it.
  - The new `scripts/audit-public-seo.mjs` / `verify-public-seo-audit.mjs` are not wired into `package.json`.
- Problem: Consent withdrawal, review-locale copy guardrails and upload validation can regress without CI noticing.
- Fix: Add `tests/analytics-withdrawal.spec.ts` to `qa:analytics` and at least `/fr` and `/zh` to the consent spec loop. Add DE/FR/KO/ZH equivalents to the response-time, guarantee and SLA checks. Import `../lib/upload-file-signatures.test.ts` in the runner. Add a `qa:seo` script for the verify script.
- Status: NEW
- Confidence: high

### CODE-008 — Unauthenticated requests can drive DB load and unbounded cache or render work through the new catch-all, random service slugs and the OG route
- Severity: P3
- Category: security (resource amplification) / cost
- Where: `app/[locale]/[...unmatched]/page.tsx:5-7`; `app/[locale]/layout.tsx:152-184`; `app/[locale]/szolgaltatasok/[slug]/page.tsx:44-51,148-149`; `app/[locale]/opengraph-image.tsx:10-24`
- Evidence (live GETs, 2026-10-18):
  - `/hu/codeaudit-nonexistent-20261018` returns `404`, `Cache-Control: private, no-cache, no-store…`, `X-Matched-Path: /[locale]/[...unmatched]`, and `X-Vercel-Cache: MISS` on every repeat. Each render runs the layout's certification and service queries.
  - `/hu/szolgaltatasok/codeaudit-nonexistent-20261018` gives `MISS` and then `HIT`, so every unique slug runs a DB query and creates a cached ISR 404 entry.
  - `/codeaudit/opengraph-image` returns `200 image/png`, `X-Matched-Path: /[locale]/opengraph-image`, `MISS`. The OG route never validates `locale`.
- Problem: Before this release, unmatched `/hu/...` paths fell through to the global 404, which has no DB access. Now any `/<locale>/<random>` request costs Neon round-trips, with no caching and no rate limit. Arbitrary first segments trigger Satori renders. Each is cheap on its own, but a crawler or scanner storm becomes DB and compute load, and during a Neon outage these 404s become 500s (CODE-009).
- Fix: Serve the layout's schema data from a cross-request cache (`unstable_cache`/`"use cache"` tagged `public-content`, see CODE-002), so 404 renders do not hit Neon. In `opengraph-image.tsx` add `if (!LOCALES.includes(locale)) notFound()`, or `generateStaticParams` over `LOCALES` plus `export const dynamicParams = false`. Optionally add a Vercel Firewall rate rule for 404 bursts.
- Status: NEW (catch-all added in f6465bb)
- Confidence: medium (no runtime logs; the DB calls are inferred from the layout code and the dynamic cache header)

### CODE-009 — No `app/global-error.tsx`: layout DB failures show Next's generic English error page with HTTP 500
- Severity: P3
- Category: error handling / UX
- Where: `app/[locale]/layout.tsx:152-184`; `app/[locale]/error.tsx` (cannot catch errors thrown by its own segment's layout); `app/` (no `global-error.tsx`)
- Evidence: The layout awaits `db.select(...).from(certifications)` and `getActiveTopLevelServices(locale)` with no try/catch, and `ls app` shows no `global-error.tsx`.
- Problem: During a Neon outage, any render not served from cache shows Next's default "Application error", unbranded and not localized, with a 500 status. This includes every `[...unmatched]` 404, first hits of new ISR paths and on-demand revalidations. The release's localized `error.tsx` work is bypassed in exactly the outage scenario.
- Fix: Add `app/global-error.tsx` with its own `<html><body>` and bilingual copy. At runtime only (not during build, see CODE-002), catch the layout's JSON-LD queries and render without the certification and service schema, because that schema is non-essential for the page.
- Status: NEW
- Confidence: high (Next.js error-boundary semantics; not reproduced live)

### CODE-010 — 404 responses inherit layout metadata (robots `index, follow`, homepage canonical and hreflang) and have no `<html lang>`
- Severity: P3
- Category: SEO hygiene / accessibility
- Where: `app/[locale]/layout.tsx:55-109`; `app/[locale]/not-found.tsx:1-23` (client component, so it exports no metadata); `app/[locale]/szolgaltatasok/[slug]/page.tsx:62-65,73-77`
- Evidence: live `/hu/codeaudit-nonexistent-20261018` returns `<meta name="robots" content="index, follow, max-video-preview:-1, …"/>`, `<meta name="robots" content="noindex"/>`, `<link rel="canonical" href="https://www.afm.hu/hu"/>`, three `hrefLang` alternates and `<html data-dpl-id="…" id="__next_error__">`, with no `lang`. `/hu/szolgaltatasok/<unknown>` is the same. The service page's `return { robots: { index: false, follow: false } }` branches are never applied, because `notFound()` discards page metadata.
- Problem: The robots signals conflict. Google applies the stricter one and the status is 404, so the indexing impact is negligible. The 404 page also has no document language, which affects screen readers before hydration (WCAG 3.1.1). (SEO-014 reports the robots and canonical symptom.)
- Fix: Move `robots`/`alternates` out of the layout's `generateMetadata` into `app/[locale]/page.tsx`. Turn `not-found.tsx` into a server wrapper that exports `metadata = { robots: { index: false, follow: true } }` and renders the client body. Delete the dead noindex branches.
- Status: NEW (symptom also in SEO-014)
- Confidence: high (observed)

### CODE-011 — The language switcher order differs between service pages and the rest of the site
- Severity: P3
- Category: UX consistency
- Where: `components/Nav.tsx:72-83,281,393`; `lib/services/review-services.ts:33-35`; `app/[locale]/szolgaltatasok/[slug]/page.tsx:260`
- Evidence: Crawl body text shows `HU EN DE ZH KO FR` on `/hu` but `HU EN DE FR KO ZH` on every service page. `serviceLocales` keeps the concatenation order DE, FR, KO, ZH.
- Problem: Language buttons jump position between pages.
- Fix: `const availableLocales = LOCALES.filter((l) => allowed.includes(l));` in Nav.
- Status: NEW
- Confidence: high

### CODE-012 — The admin inbox cannot filter KO/FR enquiries and shows raw codes for them
- Severity: P3
- Category: admin correctness
- Where: `app/admin/(dashboard)/messages/page.tsx:37`; `app/admin/(dashboard)/messages/_components/MessagesFilters.tsx:31-37`; `app/admin/(dashboard)/messages/[id]/page.tsx:19-24`
- Evidence: `const locale = ["hu", "en", "de", "zh"].includes(sp.locale ?? "")`, and `LOCALE_DISPLAY` lacks `ko`/`fr` (it falls back to `{ flag: "🏳️", label: row.locale }`).
- Problem: The release enables FR (and KO) contact submissions (`locale: z.enum(LOCALES)`), but operators cannot filter those leads, and the detail view shows the bare code.
- Fix: Import `LOCALES` and `LANGUAGE_NAMES` from `lib/locales`/`lib/locale-accessibility` in all three files.
- Status: NEW
- Confidence: high

### CODE-013 — The notification e-mail subject uses raw visitor input that can contain control characters
- Severity: P3
- Category: security (email)
- Where: `lib/email-templates/notification.ts:41`; `lib/contact-schema.ts:52-53`; `lib/resend.ts:60-67`
- Evidence: `` const subject = `Új ajánlatkérés — ${payload.name}${company ? ` (${company})` : ""}`; ``. The schema only `.trim()`s, so embedded `\r\n` or `\t` survive.
- Problem: Resend's JSON API should prevent classic header injection, but a control-character subject can make the send fail. The lead is still stored, but no notification arrives (fail-soft, logged only as `api-error`). It also allows misleading internal subjects. Resend's behaviour was not verified.
- Fix: In the schema, `name`/`company`: `.transform(s => s.replace(/[\p{Cc}\p{Cf}]/gu, " "))`, or reject control characters with a field error.
- Status: NEW
- Confidence: medium

### CODE-014 — Auth-layering hygiene: an unauthenticated export in a `"use server"` file, and a misleading proxy comment
- Severity: P3
- Category: security (defense in depth)
- Where: `app/admin/(dashboard)/settings/_actions.ts:60-87`; `app/api/admin/upload-image/route.ts:7-10`; `proxy.ts:127`
- Evidence: `export async function loadSiteSettings()` has no `requireAdmin()`, while every other exported action calls it. The upload route comment says "middleware (proxy.ts) gates /api/admin/* by session", but the matcher is `"/((?!_next|api|.*\\..*).*)"`, which excludes `/api`.
- Problem: The settings data is public company information, and Next normally exposes action IDs only when client code references them, so practical exposure is low. Still, it breaks the "every server action re-checks auth" rule. The wrong comment could also lead a future route author to skip `requireAdmin()`, since the proxy does not protect `/api/admin/*`.
- Fix: Add `await requireAdmin()` to `loadSiteSettings`, or move it to a non-action module. Correct the comment to say that API routes are not proxy-gated and must call `requireAdmin()`.
- Status: NEW
- Confidence: high (code); low (exploitability)

### CODE-015 — CSP still allows inline scripts
- Severity: P3
- Category: security hardening
- Where: `next.config.ts:6-13,61-63`
- Evidence: `"script-src 'self' 'unsafe-inline'"` with the comment "Nonce-based mitigation deferred to a later commit."
- Problem: React escaping and `safeJsonLdStringify` (`components/JsonLd.tsx:18-27`) currently prevent XSS, but the CSP adds no protection if an injection sink appears later.
- Fix: Switch to nonce-based CSP in the proxy, or use hashes for the static JSON-LD. At minimum, add `report-to` to observe violations.
- Status: NEW (pre-existing deliberate deferral)
- Confidence: high

### CODE-016 — Service reorder is still non-atomic and bumps every service's `updatedAt`, which feeds sitemap `lastmod`
- Severity: P3
- Category: admin / DB correctness
- Where: `app/admin/(dashboard)/services/_actions.ts:789-797`; `lib/public-sitemap.ts:134-136`
- Evidence: `for (let i = 0; i < orderedIds.length; i++) { await db.update(services).set({ sortOrder: i, updatedAt: now })…`
- Problem: A partial failure leaves a mixed order. Every reorder also changes `lastModified` for all 16 HU/EN service URLs in the sitemap without any content change.
- Fix: Use `neonSql.transaction([...])` as partners, positions and certifications already do, and do not touch `updatedAt` on a pure reorder.
- Status: KNOWN (June P2-10; the lastmod side effect is new information)
- Confidence: high

### CODE-017 — Duplicate `@playwright/test` devDependency
- Severity: P3
- Category: code hygiene
- Where: `package.json:66-67`
- Evidence: `"@playwright/test": "^1.60.0",` followed by `"@playwright/test": "^1.57.0",`
- Problem: The last key wins, so the intended `^1.60.0` is silently ignored.
- Fix: Delete line 67.
- Status: KNOWN (June P3-07, not fixed)
- Confidence: high

### CODE-018 — The approved process copy is a runtime string-match shim; the production DB still holds the withdrawn "1–3 munkanapon belül" promise
- Severity: P3
- Category: tech debt / claim safety
- Where: `lib/services/approved-process-copy.ts:4-26`; `lib/db/queries/services.ts:363`
- Evidence: `previous: "A helyszíni bejárás és az alapvető kockázati áttekintés jellemzően 1–3 munkanapon belül megszervezhető."` is replaced only when the body matches it byte for byte. The live page currently shows the approved text.
- Problem: The admin form still shows and re-saves the withdrawn promise. Any small CMS edit to that step (a space or a dash) silently brings the promise back to the public page.
- Fix: Run the existing `db:sync-pilot-service-content` flow (staging, then approval, then production) to write the approved sentence into the DB, then delete the shim.
- Status: KNOWN (HUA-004, `JAVITVA_FORRAS`, fixed in source and not yet in the DB)
- Confidence: high

### CODE-019 — The server-side contact allowlist still accepts the private-investigation key
- Severity: P3
- Category: compliance guardrail (Special Services)
- Where: `lib/contact-schema.ts:31,41-45`; `lib/contact-service-labels.ts:18`; `components/Contact.tsx:736-741`
- Evidence: `const SPECIAL_CONTACT_SERVICES = new Set(["magannyomozas"]);`. The comment says "The backend keeps accepting the legacy "magannyomozas" key so older or in-flight submits do not break."
- Problem: The UI no longer offers it (analytics spec #14 passes), but a crafted POST still creates a "Magánnyomozás" lead through the standard form, which has no sensitive-data warning. AGENTS.md says no contact options for Special Services. The "in-flight submits" justification expired with the earlier release.
- Fix: Remove `magannyomozas` from the accepted set: it would normalize to `undefined`, so the lead is still stored without a service tag. Keep the label map only for displaying historic rows in the admin.
- Status: KNOWN (deliberate per PL-015/PL-059 comment; recommend closing)
- Confidence: high

## Verified OK
- Locale routing: `lib/locales.ts` is the single source and is used by proxy, i18n, contact schema, Nav regexes, reply e-mail, not-found/error copy, OG locale map, Career, Certifications and layout cert columns. `fr` is fully wired. Uppercase locales get a 308 to lowercase, and `/<locale>/admin` gets a 308 to `/admin`. Invalid locales 404 via the layout `notFound()` before any DB call. `[...unmatched]` does not shadow concrete routes.
- Review-mode gating, live and in code: all de/zh/ko/fr homepages and their 8 service pages return 200 with `noindex, follow` and 0 hreflang. DE legal and news are noindex. FR/ZH/KO legal, news, trust and recruitment routes `notFound()`. The sitemap has 32 URLs, all HU/EN with `hu/en/x-default` alternates only (`lib/public-sitemap.ts:63-65` filters through `isIndexableServiceLocale`; unit-tested in `tests/seo-publication.test.ts`). Service metadata emits `languages` only for indexable locales (`page.tsx:93-115`). `getRenderableServicePaths` ties review pages to an active HU/EN CMS row.
- Revalidation: `revalidatePath("/[locale]", "layout")` correctly refreshes every localized page after service, certification, partner and position edits, plus `/sitemap.xml` for services. News invalidates hu/en/de index and detail paths for both the old and new slug (`news/_actions.ts:241`).
- Analytics: GA4 loads only after explicit acceptance. Withdrawal sets `ga-disable-<ID>` synchronously, sends a consent update, and clears `_ga`/`_ga_<ID>` on all host and path variants (`lib/analytics/runtime.ts:67-102`). A storage failure fails closed. Cross-tab `storage` sync works. Event params are allowlisted, and `page_location`/`page_referrer` are stripped of query and hash. Production qa:analytics: 16/16 pass. Hardening option: also default `ad_storage`/`ad_user_data`/`ad_personalization` to denied and set `allow_google_signals:false`; CSP already blocks DoubleClick.
- Admin authZ: every exported action in every `_actions.ts` calls `requireAdmin()` (except CODE-014). The dashboard layout re-checks. The proxy redirects unauthenticated `/admin/*`. Entra sign-in is restricted by an allowlist in both `auth.ts:43-54` and `lib/admin/require-admin.ts:17-45`. The login redirect is fixed (`redirectTo: "/admin"`). Both upload routes check `requireAdmin()`, a folder allowlist, a MIME allowlist, size, magic bytes and a UUID filename.
- Contact API: production origin allowlist, 32 KB guard, Zod validation with `locale: z.enum(LOCALES)` and a canonical service allowlist, a silent honeypot, and a Redis rate limit that fails closed in production. The client IP comes from Vercel-controlled headers. HTML e-mail fields are escaped, and `replyTo` is a Zod-validated e-mail.
- XSS and secrets: the only `dangerouslySetInnerHTML` is JSON-LD with `<`, `>`, `&`, U+2028/2029 escaping. The only client env var is `NEXT_PUBLIC_GA4_ID`. No client component imports `@/lib/db` or `@/auth`. Only `.env*.example` placeholders are committed. The error boundary shows only `error.digest`. Public API errors are opaque codes. Security headers are present (HSTS, XFO DENY, nosniff, COOP/CORP, a strict CSP host list).
- AOS separation: no AOS, guard-log, checkpoint, shift or CRM code, tables or admin sections. Schema tables are news, positions, messages, client_references, certifications, services, partners and site_settings. There are no migrations in this release.
- Build fail-closed guarantee: still intact. No code path returns an empty service-path list on DB error (`services.ts:485-502`).
- The KO OG image renders Hangul correctly (fetched `/ko/opengraph-image`).
