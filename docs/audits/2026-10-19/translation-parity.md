# FR / KO / ZH translation parity — 2026-10-19

Source repair on `codex/translation-parity-oct19`, based on main `1a41e18`. This report covers ten string fields in three locale files, plus the implementation plan and this audit note.

| File | Fields | Confirmed themes |
| --- | ---: | --- |
| `lib/services/fr-service-details.ts` | 5 | Four FAQ recommendations now match HU `érdemes rögzíteni`; reception description preserves possibility and the general meaning of entry documentation. |
| `lib/i18n/ko.ts` | 2 | Hero service list and responsible-contact wording follow HU; certification introduction follows the accepted HU source instead of displaying an internal wording guideline. |
| `lib/i18n/zh.ts` | 3 | Value pillars restore documented processes, reports, responsibility, site-specific protocols, and incident documentation/feedback/prevention. |

These are five translation themes. Other `doit`/`doivent` requirements were not changed. Independent semantic review identified an overly narrow initial rendering of entry documentation; the final text is `documentation associée aux accès`. The other eight original fields passed that review. A subsequent review added the remote-response FAQ recommendation correction; its first sentence retains `doit` to preserve HU `kell`.

All five affected French service passages were compared with the actual live Hungarian references. The added remote-response FAQ also says `érdemes pontosan rögzíteni` in production; its earlier `kell meghatározni` obligation remains intact in French. The first four captured excerpts are in workspace `audit-artifacts/design-smoke-2026-10-19/translation-hu-live-reference.json`; the fifth was read directly from the live remote-monitoring FAQ on the same date. The accepted Hungarian legal text and ISO status were not reopened or modified. PR #8 corrections were retained.

## Validation

The following checks were rerun against the extended ten-field source patch. Equivalent local Node CLIs were used because the global npm shim points to a missing npm CLI.

- Lint and TypeScript checks passed.
- Unit tests: 167 passed, 0 failed.
- Copy guard: 33 checks passed across 227 files.
- Read-only staging-target preflight passed: endpoint `ep-twilight-sound-al2b7jsb`, branch `br-round-fog-al4isa1i`. Credentials are redacted in its log. The build ran only after a successful preflight.
- Production build command completed successfully against the final source; this is local build validation, not a production deployment.
- `git diff --check` passed. Extended source diff against main: three files, ten insertions and ten deletions.

Final validation logs are stored in workspace `audit-artifacts/design-smoke-2026-10-19/translation-final-{lint,types,unit,copy,staging-target,build}.log`. The initial sandbox attempts encountered a runtime/environment restriction for tests and a network restriction for the preflight; approved retries passed.

## Limits and remaining release checks

No component, CSS, image, font, route, indexing, dependency, or database change was made. The PR #10 design implementation is preserved; localized text wrapping still requires the planned Preview check at 320 and 1440 px.

PR/CI, translated Preview smoke and visual inspection, and production release approval remain pending. This source and semantic review does not imply native-speaker approval or close the wider text audit. No production release is claimed.
