# PR #15 — staging validation

Date: 2026-10-19. **Staging complete; production release pending approval.**

The owner explicitly approved: “Igen, a nyolc mező mehet stagingben”. Approval covers only the eight non-HU fields in [cms-proposal.json](cms-proposal.json), not production or a broad seed/update operation.

## Applied scope

| Record | Fields |
| --- | --- |
| positions #1 | location_en, location_de, location_zh |
| certifications #1 / iso-9001 | description_de, description_zh |
| news #3 / megujult-az-avenir-weboldala-es-arculata | body_en, body_de |
| services #3 / mystery-shopping-helyszini-audit | seo_description_en |

Proposal SHA-256 over `JSON.stringify(parsedArray)`: `944fb91711485680bf69f2ed374570a6c785760cfc1838fcf0cfba4c9a45dfe1`.

## Database execution

- Explicit target: project `calm-glade-02466781`, branch `br-round-fog-al4isa1i`, endpoint `ep-twilight-sound-al2b7jsb`, database `neondb`.
- Fresh read-only snapshot and full backup of four records. Eight before-values matched the approved proposal. No enabled user triggers or non-view rules were present.
- Generated fixed-scope SQL was independently reviewed: no blocker, nine local guard tests passed. All four UPDATE statements passed read-only EXPLAIN without ANALYZE.
- A single DO statement inside one transaction applied four disjoint updates. It checks the server target, complete before-row equality, one affected row for every update, and four complete expected-after-row postconditions. Any uncaught mismatch aborts the transaction.
- SQL SHA-256: `e0517fadf6c7713614c6075f85cf8e8c208fec0eecc25f2ffac414ae99f3ba36`.
- Fresh independent read-only transaction after commit: **4/4 complete rows equal expected-after**, with **exactly 8 fields changed**. Hungarian fields, timestamps and every other column remain unchanged.
- No seed/updater, migration, production query, form submission or email was executed.

Raw backups, SQL, tests and transaction responses are outside the repository in `../audit-artifacts/translation-tail-2026-10-19/`. The SQL is pinned to staging and is not a production script.

## Fresh Preview verification

The existing reviewed commit `e6dc9ed4794b8258b1cd0ada08e8a2972911d073` was rebuilt explicitly for Preview after the staging update.

- Deployment `dpl_5H5e4m3qtwUvvp5Qb4ELbKAW5a5w`: **READY / Preview**, correct branch `codex/translation-tail-oct19`.
- [Checked Preview](https://avenir-website-3i0tieuvx-andrasvarkonyi-7800s-projects.vercel.app/en#career).
- GET-only full smoke: **569/569 PASS**.
- Independent rendered-HTML check: **8/8 CMS fields + 2/2 FR/KO overlays PASS**, eight routes HTTP 200. It matches actual career spans, accessible certification descriptions, four complete ordered article paragraphs and the real EN meta description; serialized scripts are excluded.
- Post-update browser spot-check: EN career section at 1440 px and ZH at 390 px, correct labels, no horizontal overflow. The prior FR/KO desktop/mobile visual checks also passed; the post-update HTML check proves their new CMS key works.
- Viewport override reset; no design, HU copy, routing or indexing rule change.
- Existing code validation remains 214/214 unit, 33/33 copy checks, lint/type/build and CI successful. Only audit documentation changes follow the tested source.

## Production gate

Production has not been read or written for this package, and PR #15 has not been merged. A separate owner approval must cover the PR merge and targeted production data update.

After approval: verify the production target, compare all eight candidate fields with approved before/after values, back up complete affected records, skip values already equal to after (the EN news body was already correct in prior evidence), and stop on any other drift. Apply only remaining approved differences with atomic/full-row preservation checks. Verify production rendering and smoke after deployment. Do not execute the broad seed/updater scripts.

Registry-document details, IAF schema attribution, HU EDPB version, mail data flow and optional style observations remain separate backlog items.

