# Monitoring copy alignment implementation plan

> **For agentic workers:** Use superpowers:subagent-driven-development to implement the separate source-copy and guarded CMS-update tasks, then review the complete diff.

**Goal:** Reflect the owner's accepted own 24/7 monitoring centre and guaranteed event logging consistently in all six remote-monitoring locales.

**Architecture:** Preserve the current CMS ownership of HU/EN and source ownership of DE/FR/KO/ZH. Change four text positions per locale: value proposition, the false-alarm sentence in long description and FAQ 3, and the recording sentence in FAQ 8. Keep analysis/review optional. Add a narrowly guarded, dry-run-first updater for the six HU/EN database columns; preserve all other fields and FAQ entries.

**Tech Stack:** Next.js, TypeScript, Drizzle, Neon HTTP, existing tsx unit runner.

## Accepted scope

The owner confirmed on 2026-10-19: Avenir's own centre receives and handles signals 24/7; every signal, verification step and escalation decision is recorded. Existing trust paragraphs already say this. Soft/Hard FM own staff, subcontractors and client-provider coordination remain accepted and unchanged. No new arrival guarantee, live-video surveillance, certification, response-fleet claim, route, indexing, design, form or analytics change.

## Task 1 — source alignment

Files: `scripts/seed-pilot-tavfelugyelet-vonuloszolgalat.ts`, `docs/translations/public_site_translation_matrix_en.csv`, and `lib/services/{de,fr,ko,zh}-service-details.ts`.

- [ ] Update only the remote-monitoring service in these files. HU lead begins: `Az Avenir saját felügyeleti központja 24/7 fogadja és kezeli a csatlakoztatott helyszínekről érkező riasztási, behatolásjelzési és kamerajelzéseket`. EN lead begins: `Avenir’s own monitoring centre receives and handles intrusion, alarm and CCTV signals from connected sites 24/7`. Preserve each lead's existing continuation.
- [ ] HU long description: `A téves jelzések naplózhatók és elemezhetők` → `A téves jelzéseket naplózzuk, és azok elemezhetők`; FAQ 3 uses `visszanézhetők` with the same guaranteed-recording wording; FAQ 8: `A jelzések időbélyegzett eseménynaplóban rögzíthetők:` → `A jelzéseket időbélyegzett eseménynaplóban rögzítjük:`.
- [ ] EN long description: `False alarms are logged and analysed` → `False alarms are logged and can be analysed`; FAQ 3: `False alarms are logged and reviewed` → `False alarms are logged and can be reviewed`; FAQ 8: `Signals can be recorded in a timestamped operations log:` → `Signals are recorded in a timestamped operations log:`. Align the HU cells of the same translation matrix rows.
- [ ] Translate exactly these semantic changes in DE/FR/KO/ZH. Preserve the rest of every field, all FAQ questions and the existing unconditional logging trust statement. Review all changed strings against HU.

## Task 2 — guarded CMS change

Files: `scripts/monitoring-copy-patch.ts`, `scripts/update-monitoring-copy.ts`, `tests/monitoring-copy-patch.test.ts`, `tests/run-unit-tests.ts`.

- [ ] Write and run meaningful pure-planner tests before implementation: reject wrong slug, absent/ambiguous old text, preserve untouched FAQ entries and other fields, allow already-updated content without another write. No database access in unit tests.
- [ ] Implement a typed planner restricted to service `tavfelugyelet-vonuloszolgalat` and the six columns `valuePropositionHu/En`, `longDescHu/En`, `faqHu/En`. Each replacement must occur exactly once or be provably already applied; refuse unexpected content. FAQ changes match both question and index. Retain every non-target FAQ element.
- [ ] Implement the CLI using the existing target guard, staging default, dry-run default, explicit `--apply`, and explicit production target/allow flag. Print the full eight text-fragment before/after pairs. Apply all changed columns in one UPDATE with a compare-and-set condition against the selected values, id and slug; reject zero affected rows. Do not update timestamps, readiness or other service data. Sanitize errors to avoid secret-bearing driver output.
- [ ] Read staging only after endpoint/branch verification. Save the exact dry-run proposal outside the repo. Obtain explicit approval for these new staging writes because the prior staging permission was read-only except separately named earlier changes. Apply only after approval, rerun dry-run to prove idempotence, compare all other fields unchanged.

## Task 3 — review, Preview and release handoff

- [ ] Independently review semantics, then updater safety and complete diff.
- [ ] Run lint, TypeScript, the unit suite, copy guard, staging preflight and build. Do not add tests that merely assert the literal translations.
- [ ] Create the PR from `codex/monitoring-copy-oct19`, attach it, verify its exact-head CI and Vercel Preview. Test six remote-monitoring pages, changed visible copy/FAQ and JSON-LD parity, desktop/mobile layout, and unchanged indexability. Run the normal Preview smoke.
- [ ] Record accepted audit decisions, staging execution evidence and limits in `docs/audits/2026-10-19/monitoring-copy.md` and the workspace status list. Keep existing historical audits intact.
- [ ] Present the checked Preview and exact production CMS change for final release approval under AGENTS.md/runbook. Do not merge or write production CMS data before that approval.
