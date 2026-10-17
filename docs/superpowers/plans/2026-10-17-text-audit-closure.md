# Szövegaudit lezárási kör

> Use superpowers:subagent-driven-development. Continue the existing isolated feature branch. One implementation worker at a time; specification review then quality review. No production deployment or database writes.

**Goal:** Close all independently verifiable source defects feasible without new business facts and deliver a complete 506-ID status ledger plus an actionable open-item list.

**Architecture:** Preserve HU as factual reference and six-locale review gates. Distinguish source repair, Preview verification, legal/native approval and production release. Existing CMS-first behavior is deliberate; database repairs need a concrete preview and separate authorization.

**Stack:** Next.js, TypeScript, node:test, static locale files and legal Markdown.

## 1. Legal translation parity and deterministic prose

- [x] Compare current HU and EN `getTermsContent` output; implement EN v1.1 scope/title/general/modification/data-protection/version history and UI references without adding facts.
- [x] Reconcile DE legal Markdown and positional section IDs with the 13 HU sections plus DPO section. Preserve noindex. Remove placeholder dates and unsupported scope expansions. Test rendered section IDs, DPO visibility and shared/direct getter agreement.
- [x] Apply verified spelling/SCC terminology/disclosure heading/internal editorial label fixes; retain proof boundaries. Fix clear French/German grammatical agreement.
- [x] Review specification then quality and resolve findings before next implementation worker.

## 2. Localized runtime failures and navigation

- [x] Inspect error/not-found routing. Reuse existing locale helpers; render error retry/home links and unknown localized paths in the requested locale without changing 404 HTTP semantics.
- [x] Localize article breadcrumb aria labels; update LLM files to accurately describe FR/KO/ZH review-only surfaces.
- [x] Test locale selection and actual unknown-route HTTP status/noindex with the built server. Review specification then quality.

## 3. Analytics withdrawal

- [x] Reproduce current accepted→rejected behavior with mocked browser/gtag; confirm the current consent effect only gates own events and leaves the loaded tag active.
- [x] Consult Google primary documentation. Implement immediate tag opt-out, consent-state updates and owned analytics-cookie cleanup for refusal/withdrawal; preserve no script load before acceptance and safe reacceptance.
- [x] Omit URL query/hash from explicitly sent analytics paths/locations. Test withdrawal, pending script load, repeat acceptance and sanitized parameters without live analytics events.
- [x] Align HU/EN/DE withdrawal wording with implemented behavior, flagged for DPO review. Review specification then quality.

## 4. Complete audit disposition and delivery

- [x] Reconcile all original 506 IDs into a separate CSV, keeping original findings intact. Each row includes status, reason, next action, owner and evidence. Never infer closed from severity alone.
- [x] Produce a concise Hungarian open-item Markdown list grouped by owner/business, legal/DPO, native review, CMS and release; link the complete CSV.
- [x] Run all unit tests, lint, TypeScript, copy guard, staging-target preflight and read-only build. Fix regressions.
- [ ] Push the tested commit to draft PR #2; verify CI/Preview and focused public GET smoke. No merge, production deployment, DB write or form submission.
