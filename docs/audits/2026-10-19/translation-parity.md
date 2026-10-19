# FR / KO / ZH translation parity — 2026-10-19

Source repair on `codex/translation-parity-oct19`, based on main `1a41e18`. This report covers nine string fields in three locale files, plus the implementation plan and this audit note.

| File | Fields | Confirmed themes |
| --- | ---: | --- |
| `lib/services/fr-service-details.ts` | 4 | Three FAQ recommendations now match HU `érdemes rögzíteni`; reception description preserves possibility and the general meaning of entry documentation. |
| `lib/i18n/ko.ts` | 2 | Hero service list and responsible-contact wording follow HU; certification introduction follows the accepted HU source instead of displaying an internal wording guideline. |
| `lib/i18n/zh.ts` | 3 | Value pillars restore documented processes, reports, responsibility, site-specific protocols, and incident documentation/feedback/prevention. |

These are five translation themes. Other `doit`/`doivent` requirements were not changed. Independent semantic review identified an overly narrow initial rendering of entry documentation; the final text is `documentation associée aux accès`. The other eight fields passed that review.

The four affected French service passages were also compared with the actual live Hungarian references. The captured excerpts are in workspace `audit-artifacts/design-smoke-2026-10-19/translation-hu-live-reference.json`. The accepted Hungarian legal text and ISO status were not reopened or modified. PR #8 corrections were retained.

## Validation

- Lint and TypeScript checks passed.
- Unit tests: 167 passed, 0 failed.
- Copy guard: 33 checks passed across 227 files.
- Production build command completed successfully against the final source; this is local build validation, not a production deployment.
- `git diff --check` passed. Source diff: three files, nine insertions and nine deletions.

Validation logs are stored in workspace `audit-artifacts/design-smoke-2026-10-19/translation-{lint,types,unit,copy,build}.log`.

## Limits and remaining release checks

No component, CSS, image, font, route, indexing, dependency, or database change was made. The PR #10 design implementation is preserved; localized text wrapping still requires the planned Preview check at 320 and 1440 px.

PR/CI, translated Preview smoke and visual inspection, and production release approval remain pending. This source and semantic review does not imply native-speaker approval or close the wider text audit. No production release is claimed.
