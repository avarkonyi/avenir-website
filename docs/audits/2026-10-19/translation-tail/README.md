# Translation tail — 2026-10-19

Status: source and eight-field proposal prepared; no database writes or production release in this package.

- [Owner-readable complete before/after proposal](cms-proposal.md)
- [Immutable eight-field proposal](cms-proposal.json)
- [Implementation plan](../../../superpowers/plans/2026-10-19-translation-tail.md)

Scope: eight non-HU CMS fields across four records, FR/KO career location compatibility, and source literals that would otherwise reintroduce the same errors. Approved Hungarian copy, design, proof facts and locale/indexing policy are preserved. Previous PR #14 evidence is historical and unchanged.

Proposal SHA-256 over `JSON.stringify(parsedArray)`: `944fb91711485680bf69f2ed374570a6c785760cfc1838fcf0cfba4c9a45dfe1`.

Fresh staging public-content snapshot verified `br-round-fog-al4isa1i`, `ep-twilight-sound-al2b7jsb`, `neondb`, read-only transaction. Raw evidence is outside the repository under `../audit-artifacts/translation-tail-2026-10-19/`. Production DB was not read or written for this new package. EN news already matched the desired text in previous production evidence; verify and skip an already-correct field in any future approved production release.

## Verification

- Full unit suite: **214/214 PASS**. The two new career location regressions failed first with the missing new key, then passed for both new and legacy keys, Budapest-only and unknown-value behavior.
- Copy guard: **33/33 PASS** over 231 files.
- ESLint and TypeScript: exit 0.
- Staging target preflight: endpoint and branch verified; local build: exit 0, 100 static pages generated.
- Fresh staging read-only proposal check: **8/8 before values match**, 0 already applied; four intended records only.
- Source scope: seven files; dictionaries/tests plus existing seed/updater text literals. No seed/updater was executed. No HU fields, layout, routing, indexing or DB guard changes.

Independent review and Ready Preview/smoke evidence will be added before staging approval is requested. Staging writes and production release are separate authorization gates. The new CMS values are only a proposal until staging approval; Preview initially shows the old CMS values with the corrected FR/KO compatibility layer.
