# Recruitment Privacy Notice — Review Package (PL-091)

Status: **Final v3 text proposal prepared / DPO+legal written sign-off
pending.**
Prepared: 2026-06-11. Updated: 2026-06-12 (v3 finals received, decisions
Q1–Q10 incorporated).

This package prepares the applicant/recruitment privacy notice for DPO and
legal sign-off. Nothing in this package is published; no route, runtime
copy or privacy-policy body was changed. Publication requires explicit
written approval (gate 5).

Current text proposal (authoritative working files):

- `docs/legal/recruitment-privacy-notice-hu-final-v3.md` (HU — authoritative)
- `docs/legal/recruitment-privacy-notice-en-final-v3.md` (EN mirror)

Superseded drafts (kept for version history):

- `docs/legal/recruitment-privacy-notice-hu-draft.md`
- `docs/legal/recruitment-privacy-notice-en-draft.md`

## 1. Current career data-flow inventory (as of 2026-06-11)

| Question | Finding |
| --- | --- |
| Where does the career section appear? | Homepage `#career` section on all five locales (`/hu`, `/en`, `/de`, `/zh`, `/ko`); rendered by `components/Career.tsx`. There is no separate `/karrier` route (PL-067 is a future decision). |
| What is the application path? | Each DB-backed position card renders a `mailto:` link. Clicking "Jelentkezés / Apply" opens the applicant's own email client with a prefilled subject (`<applyBtn label> - <position title>`). |
| Is there a mailto? | Yes — `mailto:${positions.applyEmail}` per position. |
| Which email address receives applications? | The `positions.applyEmail` DB column, default and currently `info@afm.hu` (admin-editable per position via `/admin/positions`). |
| Does the site request a CV / file / extra data? | No. The website has no upload feature, no application form, and requests no applicant data fields. Whatever the applicant attaches or writes in their own email is provided voluntarily. |
| Is there a separate application form? | No. The only website form is the contact/quote form, which is not an application channel — but an applicant could in practice use it; see open question Q7. |
| Is there privacy information next to the career section? | No. The career section currently has no privacy link or notice. The contact form has its own layered privacy notice, but it covers contact/quote processing. |
| Does the current Privacy Policy (v1.2) cover applications? | No. v1.2 explicitly scopes itself to website contact/quote processing and post-quote contractual administration, and states that employee data processing is governed by separate notices available at info@afm.hu. Applicant/recruitment processing is a documented gap (PL-091, PL-074). |

Implication for the notice scope: the website itself does not process
application data; processing happens in the company mailbox after the
applicant sends an email. The drafts are scoped accordingly (email-based
applications to the published application addresses).

## 2. Proposed career-section microcopy (NOT implemented — proposal only)

A short line with a link, rendered near the career cards / apply buttons,
to be added only after the notice is approved and published:

- HU: `Jelentkezés előtt kérjük, olvassa el a pályázói adatkezelési tájékoztatót.`
- EN: `Before applying, please read the recruitment privacy notice.`
- DE (the career section is visible on `/de`, noindex review mode):
  `Bitte lesen Sie vor Ihrer Bewerbung die Datenschutzhinweise für Bewerbungen.`
- ZH/KO: the career section is visible on these partial/noindex locales,
  but no reviewed translation exists for the microcopy or the notice.
  Backlog item: add conservative ZH/KO microcopy translations together with
  the locale's broader review (PL-076 for KO); do not publish untranslated
  or machine-only legal-adjacent copy. Until then, ZH/KO may either omit
  the line or use the EN fallback — decision belongs to the publication
  approval.

Implementation note (for the later runtime task): the link should point to
the published notice location chosen in Section 3 (Option A anchor or
Option B route), use the locale's legal fallback behavior consistently with
`getFooterLegalLinks`/`getContactPrivacyHref` patterns, and must not change
the apply flow itself.

## 3. Publication options (decision required)

### Option A — New "Toborzási adatkezelés / Recruitment" section inside the existing Privacy Policy

The notice becomes a numbered section of the existing
`/hu/adatvedelem` + `/en/adatvedelem` policy (new privacy version, e.g. 1.3).

- Pros: single legal surface; existing route, hreflang, sitemap and footer
  links unchanged; version history mechanism already exists; one DPO
  review cycle.
- Cons: requires editing the approved v1.2 public body (full DPO/legal
  re-approval of the policy); makes an already long document longer; the
  policy's current scope statement ("contact and quote process") must be
  rewritten; career microcopy would deep-link into a long page.

### Option B — Separate legal route

New standalone pages, e.g. `/hu/toborzasi-adatkezeles` and
`/en/recruitment-privacy`.

- Pros: clean scope (the v1.2 policy body stays untouched except its
  "separate notices" cross-reference); short, applicant-focused document;
  direct link target from the career section; easier future iteration.
- Cons: new route + metadata + sitemap/hreflang/footer decisions; one more
  legal page to maintain in HU/EN (and later DE); slug naming must be
  finalized (EN slug under the Hungarian-segment URL model is a deviation —
  needs the same canonical-slug discussion as PL-068); DE/ZH/KO exposure
  policy must be defined (likely DE noindex review-mode parity, ZH/KO
  closed).

**Decision (2026-06-12): Option B was chosen.** Planned routes per the v3
finals: `/hu/palyazoi-adatkezeles` and `/en/recruitment-privacy` (the
earlier `/hu/toborzasi-adatkezeles` working name was replaced by
`palyazoi-adatkezeles` to match the published document title). Route
implementation remains a separate post-approval pass: metadata, noindex/
sitemap/hreflang policy, footer/career linking and DE/ZH/KO exposure must
follow the existing legal-route patterns and get their own QA.

## 4. DPO/legal questions — status after the v3 finals (2026-06-12)

Resolved (incorporated into the v3 texts):

- Q1 — Retention: **resolved.** Unsuccessful applications and related
  correspondence are deleted when the selection process closes; talent-pool
  retention only with the applicant's express consent, for 1 year from the
  consent, renewable, withdrawable at any time.
- Q2 — Legal bases: **resolved.** Article 6(1)(b) for pre-employment steps,
  6(1)(f) for selection administration, 6(1)(a) solely for the post-close
  talent-pool retention. The LIA document itself is an annex to the
  written sign-off (see gates).
- Q3 — Processor alignment: **resolved.** Microsoft 365 (Microsoft Ireland
  Operations Limited) named as the email/office processor, with DPF
  adequacy plus SCC and supplementary measures as the third-country
  safeguard.
- Q4 — Publication method: **resolved — Option B**, routes
  `/hu/palyazoi-adatkezeles` and `/en/recruitment-privacy`.
- Q5 — Unsolicited applications: **resolved.** The scope explicitly covers
  applications sent voluntarily, independently of an advertised position.
- Q6 — Statutory checks: **resolved as written.** The "separate information
  in that selection process" approach stands (for example certificate of
  good conduct); no position-specific annex in the notice itself.

Still open:

- Q7 — Contact-form applications: applicants may still submit applications
  through the general contact form even though it is not an application
  channel. Decide whether any routing/wording is needed (not blocking
  publication; flagged for completeness).
- Q8 — DE/ZH/KO language versions: timing and review path for non-HU/EN
  versions, consistent with the locale rollout policy (DE review-mode
  first; ZH/KO closed until reviewed translations exist).

## 5. Remaining approval gates before publication (mirrors PL-091)

1. **Written DPO + legal sign-off of the HU/EN v3 texts (gate 5).**
   Annexes required by the v3 publication condition:
   - the legitimate-interest assessment (LIA) for the 6(1)(f) processing;
   - HR's confirmation that no third-party data collection (reference
     checks) takes place during selection.
2. Post-approval implementation pass — **implemented in source on main
   (2026-06-12); production deploy gated on the written sign-off above**:
   - Option B routes `/hu/palyazoi-adatkezeles` (HU-only 200) and
     `/en/recruitment-privacy` (EN-only 200); every other locale/slug
     combination 404s; canonical + HU/EN hreflang pair + sitemap entries;
     content sourced from the v3 finals in
     `lib/recruitment-privacy-content.ts` (same do-not-edit rule as
     `lib/current-privacy-content.ts`);
   - career-section microcopy link (Section 2): HU/EN link their own
     notice, DE shows the approved German sentence linking the EN page,
     ZH/KO omit the line;
   - Nav: navy legal-page treatment + locale switcher maps the slug pair
     and offers HU/EN only on these pages;
   - llms.txt / llms-full.txt list the two URLs as public legal pages;
   - the publication date in `lib/recruitment-privacy-content.ts` must be
     confirmed/updated at sign-off before merge;
   - still open for a later pass: consent-capture wording for the
     talent-pool retention in the application flow (how applicants give
     the Section 8 consent in practice — email wording, no new website
     form); optional footer legal-link addition was intentionally left
     out of scope.

## 6. Explicitly out of scope for this package

- No route was created or modified; no runtime code or i18n string changed.
- The published Privacy Policy body (`lib/current-privacy-content.ts`) was
  not modified.
- No new form, file upload or CV upload feature is proposed.
- No new applicant data field is requested anywhere.
- The drafts must not be treated as approved legal text.
