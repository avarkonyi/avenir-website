# Remaining translation parity — Implementation Plan

> **For agentic workers:** Use subagent-driven implementation with independent review. Steps use checkboxes to record completion.

**Goal:** Correct five confirmed FR/KO/ZH translation themes against the accepted Hungarian source while preserving the approved PR #10 design.

**Architecture:** Only string values in three existing locale data files change. No CMS write, new service, legal claim, route/indexing change, component/CSS/image/font change, or dependency change is included.

**Tech Stack:** Next.js, TypeScript locale dictionaries and service-detail data; existing lint/type/unit/copy checks and Vercel Preview.

## 1. Scope and exact replacements

- [x] Start branch `codex/translation-parity-oct19` at main `1a41e18` in the existing clean `afm-security-updates` checkout.
- [x] Confirm current source, HU source counterparts, and old audit status. PR #8 corrections already exist; do not repeat them.
- [x] `lib/services/fr-service-details.ts`: only the four recommendation sentences at guarding FAQ (line 53), event final-report FAQ (168), technology monitoring FAQ (205), and remote-response FAQ (244) use recommendation wording to match HU `érdemes rögzíteni`. The added sentence is `Il est donc recommandé de préciser les règles d’arrivée et de réaction dès le début de la collaboration.` Its preceding `doit` remains because HU says `kell`. Do not weaken genuine requirements elsewhere.
- [x] Same FR file, reception `longDesc` (69): replace `il assure` with `il peut prendre en charge`, and `documents à établir` with `documentation associée aux accès` to match HU possibility and entry documentation.
- [x] `lib/i18n/ko.ts`, `hero.sub`: `Avenir는 현장 보안, 출입 관리, 보안 기술, 현장 점검과 보고를 하나의 운영 체계로 통합합니다. 하나의 계약과 한 명의 책임 담당자를 통해 서비스를 제공합니다.`
- [x] Same KO file, `certifications.intro`: `당사의 품질경영 및 정보보안 경영시스템은 독립 인증기관의 심사를 받습니다. 당사의 인증은 문서화되고 추적 가능하며 지속적으로 개선되는 운영의 기반이 됩니다.`
- [x] `lib/i18n/zh.ts`, the three `values[].d` fields: `以书面化流程、定期报告和明确的责任节点，让您随时了解现场情况。` / `训练有素的人员、按现场定制的操作规程，以及在工业、物流和商业环境中受检查的作业。` / `发生事件时，我们不仅在场，还会记录、反馈，并协助预防问题再次发生。`

## 2. Verification and review

- [ ] Complete live HU verification of all five affected FR service passages. Four were confirmed in workspace `audit-artifacts/design-smoke-2026-10-19/translation-hu-live-reference.json`; the added remote-response passage awaits live verification. Independent source review corrected the earlier finding to `documentation associée aux accès`. Native-speaker signoff is not implied; translated Preview inspection remains pending below.
- [x] Repeat existing lint, TypeScript, unit and copy checks for the ten-field patch: all passed, including 167 tests and 33 copy checks. Local Node CLIs were used because the global npm shim points to a missing npm CLI. No tests duplicating the strings were added.
- [x] Run staging-target preflight and repeat the Next production build against the ten-field patch: passed. Preflight confirmed staging endpoint `ep-twilight-sound-al2b7jsb`, branch `br-round-fog-al4isa1i`; credentials remain redacted. Logs: workspace `audit-artifacts/design-smoke-2026-10-19/translation-final-*.log`.
- [x] Review `git diff --check` and the exact diff. Ten string fields in three locale files changed; no design files changed.
- [ ] Create focused PR, wait for CI and Preview, then run GET-only Preview smoke and inspect changed FR/KO/ZH passages at 320 and 1440 px.
- [ ] Present the concrete Preview for the repository's production release approval; do not merge under the previous PR #9/#10 approvals.

## 3. Separate work

- Contact: one clearly marked real test after the missing sender address is resolved; independently verify admin receipt and delivery. A successful UI alone does not prove email delivery.
- HU business decisions: discuss 24/7 scope first, then Soft FM and Hard FM separately. Do not invent decisions or modify CMS before the required scope is authorized.
