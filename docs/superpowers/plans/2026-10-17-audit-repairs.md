# AFM auditjavítási terv

> **For agentic workers:** Use superpowers:subagent-driven-development for the independent implementation and review tasks. Follow the existing branch and preserve the Claude audit files.

**Goal:** Verify and repair the independent audit findings before a separately approved production release.

**Architecture:** Keep HU/EN indexability and the four review-language noindex gates. Use the shared public locale layout for CMS invalidation. Diagnose the failed production database query without bypassing publication checks or changing production data.

**Tech Stack:** Next.js App Router, TypeScript, Drizzle/Neon, node:test, Vercel.

## 1. Production build investigation

- [x] Read deployment `dpl_AHqE21syC44Ayr8dViveaTnfH29n` logs through Vercel UI; compilation and TypeScript passed, service-path SELECT failed during static page generation.
- [x] Confirm historical GitHub production status: `75b2cd7` failed; prior `8f9bba4` succeeded.
- [x] Inspect current production configuration after user login, without exposing connection strings. Keep the underlying SQL/connectivity cause unresolved until supported by evidence.
- [x] Document the evidence and remaining release gate. Do not claim that a successful staging build proves production connectivity.

## 2. Scoped source repairs

Files: `lib/i18n/{fr,ko}.ts`, `lib/services/{de,fr,ko}-service-details.ts`, legal page metadata, service page heading, CMS action files, public invalidation helper, relevant focused tests.

- [x] Replace unsupported dispatch-center claims with dispatch support in the affected general security/reception copy; retain actual remote-monitoring service meaning.
- [x] Make service/certificate/position/partner changes invalidate all localized public surfaces that consume them, including shared layout schema and related service links. Keep admin invalidation.
- [x] Remove HU/EN hreflang inheritance from DE review legal metadata; localize EN imprint metadata.
- [x] Make the long German service H1 wrap at mobile widths.
- [x] Add meaningful failing-then-passing behavior tests for invalidation and metadata. Do not add implementation-mirroring tests for simple wording/style edits.
- [x] Spec review, then quality review; resolve confirmed findings.

## 3. Dependency finding F4

- [x] Independent read-only check of current registry/advisories and affected code paths.
- [x] If verified, prepare minimal compatible updates on a separate security branch from main, preserving this PR checkout and audit work.
- [x] Verify dependency ranges, build/auth/image behavior and obtain independent patch review. If registry evidence contradicts the supplied report, correct the assessment rather than installing an unverified version.

## 4. Verification and handoff

- [x] Run `npm test`, `npm run lint`, `npx tsc --noEmit`, `npm run qa:copy`, `npm run build` with the authorized staging read-only configuration.
- [x] Check preview/local routes, mobile heading, metadata and noindex. Do not submit forms or mutate CMS records.
- [x] Record completed, unresolved and approval-dependent findings. Preserve raw audit evidence.
- [x] Production deploy, DB writes and legal/business approval remain separate gates; do not merge main in this task.
