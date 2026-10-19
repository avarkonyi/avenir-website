# Translation tail fixes — implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Prepare the remaining eight CMS translation corrections and their supporting source fixes for owner review, preserving the approved Hungarian copy, design and indexing policy.

**Architecture:** Keep the existing source dictionaries and CMS model. French/Korean career overlays accept both the old English location key and the corrected one, with one nationwide meaning. Existing seed/updater literals are aligned to prevent reintroducing the confirmed errors. A separate immutable before/after proposal covers eight text fields across four records; no DB write is authorized by this preparation step.

**Tech Stack:** Next.js / TypeScript, existing node:test runner, Drizzle/Postgres CMS, Neon read-only snapshots, Vercel Preview.

## Task 1: Career location compatibility

**Files:** `lib/i18n/fr.ts`, `lib/i18n/ko.ts`, `tests/homepage-localization.test.ts`, `tests/de-homepage-framework-polish.test.ts`.

- [x] Add a regression test using the real `localizeCareerField` path. Both `Budapest, regional` and `Budapest / nationwide` must produce the same HU-faithful nationwide French/Korean label; Budapest-only and unknown behavior remain intact.
- [x] Run the targeted test and observe the missing-new-key failure.
- [x] Add the new key and correct the old key's rendering without removing compatibility. FR: `Budapest / dans toute la Hongrie`; KO: `부다페스트 / 헝가리 전역`. Do not change other homepage copy or layout.
- [x] Re-run focused tests. Update any existing literal assertion that encoded the old, narrower location meaning.

## Task 2: Prevent seed/updater regression

**Files:** `scripts/seed.ts`, `scripts/update-positions-prod.ts`, `scripts/update-certifications-prod.ts`.

- [x] Replace the first job's EN/DE/ZH locations with `Budapest / nationwide`, `Budapest / landesweit`, `布达佩斯 / 匈牙利全国` in both existing definitions.
- [x] Replace only the English ISO9001 scope fragment inside DE/ZH descriptions with the already-existing localized scope labels `Umfassende Sicherheitsdienstleistungen` and `全面安保服务`.
- [x] Preserve HU, official identifiers, certification facts, guards, script write scope and all unrelated literals. Do not execute a seed/updater.
- [x] Inspect the diff and run existing copy/lint/type checks; no test that merely mirrors literal edits is required.

## Task 3: CMS proposal and verification

**Files:** create `docs/audits/2026-10-19/translation-tail/{README.md,cms-proposal.json,cms-proposal.md}`; raw evidence and local utilities remain outside the repo in `../audit-artifacts/translation-tail-2026-10-19/`.

- [x] Fresh staging read-only transaction with endpoint/branch verification. Read only public fields needed from positions.id=1, certifications.iso-9001, the launch news record and the Mystery Shopping service.
- [x] Rebase the previous six-field proposal onto the fresh values. Add only news.body_de service-name alignment and services.seo_description_en `process follow-through` → `process adherence`. Use the HU fields and canonical names as authority.
- [x] Record that staging EN news needs alignment while production was already correct in the previous verified snapshot; fresh production read/apply belongs to a future separately approved release.
- [x] Verify every before value against staging; hash the exact proposed change array and produce complete before/after values plus a concise owner-readable summary. Include no application action in this step.
- [x] Independent semantic review of all eight fields and source compatibility. Check a fresh dry-run against staging before approval.

## Task 4: Preview and handoff

- [x] Run full unit tests, copy guard, lint, TypeScript and build after explicit staging target verification.
- [x] Independently review the final diff; ensure no HU/design/indexing change.
- [x] Commit, push the feature branch and create/attach a draft PR. Inspect Ready Preview and smoke; test both career-key variants locally because CMS still contains the old key.
- [x] Show the concrete before/after list and checked Preview. Request approval only for the new eight-field staging batch. Production merge/data update remains separately gated after staging QA.

Execution choice: use parallel agents for the two independent source scopes; root owns the fresh CMS evidence, proposal, integration and release gates. Existing clean checkout reused on `codex/translation-tail-oct19` from `d61b55be`; baseline unit tests 212/212 PASS.
