# Approved AFM visual polish implementation plan

> Execute inline with the executing-plans workflow. The user approved Figma frame 70:2 in file 46GkVM7e4ni2NR3gEoWcrU.

**Goal:** Apply the approved contact-form typography/borders and ISO badge number hierarchy to the editable desktop/mobile designs and a reviewable website preview.

**Architecture:** Reuse the existing linked checkout and shared component styles. Keep existing copy, form behavior, certification data, PDF links and routes. This approval is for the design; production deployment remains a separate release step.

**Tech stack:** Next.js, React, CSS, Figma Plugin API, Vercel Preview.

## Steps

- [x] Update desktop and mobile Figma homepages from the accepted proposal: Geist 14/21 for fields, #CBD5E1 borders, larger Barlow Condensed ISO numbers. Keep the proposal comparison as the approval record.
- [x] In components/Contact.tsx, set inputStyle fontFamily to inherit, lineHeight to 21px, border to #CBD5E1, and vertical padding to 9.5px to retain 42px single-line fields. Keep the textarea at 94px minimum height with 12px vertical padding. Use the existing soft text color for placeholders.
- [x] In app/globals.css, set ISO text to Geist 15px/500, numbers to Barlow Condensed 50px/700, and category text to Geist 12.5px/400. Remove mobile size reductions; the SVG viewBox scales the badge. In components/Certifications.tsx align text baselines to y=55, y=116 and y=162 respectively, and remove forced category text stretching to match the approved natural-width labels.
- [x] Run npm run lint, npx tsc --noEmit, npm run build, and the existing unit tests. No new implementation-mirroring tests for this cosmetic change. All 212 tests passed; after the final SVG adjustment, the affected 13 tests, build, targeted lint and typecheck passed again.
- [x] Visually inspect HU homepage at 1440, 768, 390 and 320 pixels; verify field heights, font, focus and error display, ISO number/category bounds and PDF links. Check EN/DE/FR/KO/ZH at 390 pixels for overflow. No contact message submitted; unauthenticated admin redirects to login.
- [ ] Commit only the intended files, publish a feature-branch preview, verify the deployed result and provide its URL. Do not merge or deploy production in this task.
