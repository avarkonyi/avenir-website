# Szövegaudit – ellenőrzési és javítási terv

> **For agentic workers:** Use superpowers:subagent-driven-development. Preserve the supplied audit; evaluate findings against current source before editing. Do not deploy production or write databases.

**Goal:** Reconcile the 506 findings with the current branch, fix verified translation/code defects and prepare explicitly marked legal/business review items.

**Architecture:** Reuse the existing six-locale dictionaries and service drafts. HU is the reference; preserve noindex gates. Do not treat reviewer suggestions as business facts or legal approval. The separate dependency PR stays separate.

**Tech Stack:** Next.js, TypeScript, existing node:test runner, static translation objects.

## 1. Reconcile the audit

- [x] Confirm CSV totals: 51 P1, 151 P2, 304 P3; audited commit c6824d6 differs from current 239c539.
- [x] Record finding groups as already addressed, source-confirmed, CMS-only, editorial/native-review, or decision-dependent in `docs/audits/2026-10-17/text-audit-reconciliation.md`. All 506 rows triaged; not all independently validated.
- [x] Verify T2/T9/T11 against HU and current source before applying fixes.

## 2. Correct source-grounded copy

Files: `lib/services/{de,fr,ko,zh}-service-details.ts`, `lib/i18n/{hu,de,fr,zh}.ts`, `lib/legal-content.ts`.

- [x] Remove the unapproved GDPR addition and DE-only FAQ copies from FR/KO/ZH security-technology drafts where no corresponding HU text exists. Retain the separate DE legal review gate until assessed.
- [x] Translate the Mystery Shopping non-surveillance/non-disciplinary constraint faithfully in DE/FR/KO.
- [x] Correct DE/ZH acknowledgement wording without introducing consent. Fix verified Hungarian inflection mistakes, including replacement order for `feltételekre` → `nyilatkozatokra` before the generic replacement.
- [x] Apply French nonbreaking typography only inside French user-visible prose; preserve URLs, code syntax and object keys.
- [x] Use existing source/route tests, typecheck and copy guard. Add behavior regression tests only for the legal replacement logic, not tests mirroring every copy string.

## 3. Legal and business dependencies

- [ ] Resolve remote-monitoring 24/7 scope and FM subcontractor claims from the owner answer before modifying those assertions.
- [x] Registry: owner confirms a new decision valid through 2029, exact number/day unavailable. Record this attestation without inventing a date or calling the registry status expired.
- [x] Prepare corrected cookie text against actual analytics code; DPO review remains a release gate.
- [ ] Verify EN v1.1 and DE legal discrepancies against HU, then prepare draft changes separately from legal approval. Do not present legal draft text as approved.

## 4. Verification and delivery

- [x] Spec review then quality review of the implemented slice; resolve confirmed regressions.
- [x] Run tests, lint, TypeScript, copy guard and authorized staging-read-only build.
- [ ] Update draft PR/Preview, verify changed text and noindex, and document outstanding decisions by finding IDs.
- [ ] No production DB writes, production deployment, merge, analytics submission or form submission.
