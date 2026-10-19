# Independent translation-tail review

Reviewed: 2026-10-19. Repository: `afm-security-updates`, branch `codex/translation-tail-oct19`.

**Conclusion: no blocking findings in the proposed eight-field translation package or its source compatibility changes.** This is a semantic, scope and render-path review of the local changes, not authorization to write the database or publish a release. Final suite/build and live Preview verification belong to the coordinating agent.

## Evidence and integrity

- Read `AGENTS.md`, `docs/code_review.md`, `docs/copy_strategy.md`, `docs/service_pages_playbook.md`, and relevant staging safeguards in `docs/staging_runbook.md`.
- Independently parsed `docs/audits/2026-10-19/translation-tail/cms-proposal.json` and external `staging-before.json` (captured `2026-10-19T14:04:25.698Z`). The snapshot identifies project `calm-glade-02466781`, branch `br-round-fog-al4isa1i`, endpoint `ep-twilight-sound-al2b7jsb`, database `neondb`, and `read_only=on`.
- All eight `before` values match their snapshot fields exactly. All supplied record slugs match. The package contains eight unique table/record/field targets across four records: EN 3, DE 3, ZH 2.
- SHA-256 over `JSON.stringify(parsedArray)` independently recalculates to `944fb91711485680bf69f2ed374570a6c785760cfc1838fcf0cfba4c9a45dfe1`.
- All 16 fenced before/after blocks in `cms-proposal.md` equal their JSON counterparts after normalizing document line endings.

| Target | Snapshot before match | Semantic result |
| --- | --- | --- |
| `positions.1.location_en` | Exact | `Budapest / nationwide` restores the HU `Budapest / országosan` meaning. |
| `positions.1.location_de` | Exact | `Budapest / landesweit` preserves the same nationwide meaning. |
| `positions.1.location_zh` | Exact | `布达佩斯 / 匈牙利全国` explicitly means Budapest / throughout Hungary; it removes the erroneous surrounding-area restriction. |
| `certifications.1.description_de` | Exact | Only `Comprehensive security services` changes to the snapshot's existing `scope_de`, `Umfassende Sicherheitsdienstleistungen`. |
| `certifications.1.description_zh` | Exact | Only the same English phrase changes to the snapshot's existing `scope_zh`, `全面安保服务`. |
| `news.3.body_en` | Exact | Only the four service labels change to established EN names: On-site Security Guarding, Reception and Gatehouse Services, Security Technology, Remote Monitoring and Response Service. |
| `news.3.body_de` | Exact | Only the first two service labels change to established DE names: Objektschutz vor Ort and Empfangs- und Pförtnerdienst. |
| `services.3.seo_description_en` | Exact | Only `process follow-through` becomes `process adherence`, matching examination of compliance with the prescribed process in this HU service context. |

The accepted certification facts, issuer, audit wording and IAF sentence are byte-for-byte unchanged. This review does not reopen those facts or provide a legal opinion. Both article bodies otherwise remain unchanged, including paragraph boundaries. The EN labels match `lib/i18n/en.ts:62`, `:74`, `:80`, `:92`; the DE labels match `lib/i18n/de.ts:62` and `:80`. No new service promise is introduced.

## Source and rendering compatibility

- `components/Career.tsx:13` selects `locationEn` for FR/KO and each corresponding local column for EN/DE/ZH. At lines 98–101 it calls the actual `localizeCareerField` helper with each language's maps; the resulting location renders at line 113. `lib/homepage-content.ts:39` uses exact keys for FR/KO. Both `Budapest, regional` and `Budapest / nationwide` map to the same nationwide-Hungary label in the changed FR/KO dictionaries. An isolated invocation of the actual helper and dictionaries passed for both keys in both locales; unknown labels still return null. This preserves rendering before and after any later approved CMS change.
- `components/Certifications.tsx:21` and `:26` select the DE/ZH description columns. `lib/homepage-content.ts:50` passes these locales' own text through, and `components/Certifications.tsx:282` renders the description in the screen-reader text with `itemProp="description"`. The corrected strings therefore reach the existing presentation path without a source overlay replacing them.
- `lib/db/queries/news.ts:20` and `:26` select EN/DE body columns; the detail query selects `cols.body` at line 137. `app/[locale]/hirek/[slug]/page.tsx:329` passes `article.body` to `RichText`. The replacements preserve the existing plain-text paragraph format. `lib/news-routing.ts:3–5` remains unchanged: HU/EN are indexable and DE stays review-only.
- `lib/db/queries/services.ts:275` selects the localized SEO description; `app/[locale]/szolgaltatasok/[slug]/page.tsx:88` uses it for page metadata. The proposed EN value is nonempty and changes neither route readiness nor locale publication policy.
- TypeScript AST evaluation of string literals and string concatenations confirmed exact equality between proposal after-values and all ten relevant source occurrences: `scripts/seed.ts:135–137,314,321`, `scripts/update-positions-prod.ts:46–48`, and `scripts/update-certifications-prod.ts:47,53`.

## Scope and limits

The inspected tracked diff changes only `lib/i18n/fr.ts`, `lib/i18n/ko.ts`, the three seed/updater files above, and the two localization test files. No HU literal, component layout, stylesheet, route, indexing rule, sitemap, schema definition or dependency is changed. The proposal targets only the eight listed non-HU fields. New audit/plan documents describe preparation and preserve separate staging-write and production-release approval gates.

The EN article's already-correct prior production state is treated as supplied historical context; no production read was made. `cms-proposal.md:15` clearly scopes this item to staging alignment and requires a fresh comparison and skip for an already-correct value in any later approved production operation.

No database writes, network/production reads, source edits, commits or deployments were performed during this independent review. No broad seed/updater was executed. This review does not claim that the proposed CMS values are already present on staging or that live Preview has been checked. The only artifact written by this review is this report, outside the repository.

The first attempted isolated helper invocation through `tsx/cjs` encountered a local `uv_os_get_passwd` environment error before loading the helper. The same actual helper/dictionaries were then loaded using the installed TypeScript transpiler in memory; all isolated checks passed without filesystem output or database imports. This is not a package blocker.
