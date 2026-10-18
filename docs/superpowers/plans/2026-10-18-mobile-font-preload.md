# Mobile Hungarian font loading implementation plan

> **For agentic workers:** Use the execution and verification workflow task by task. Root owns the patch; an independent reviewer checks source and measurements.

**Goal:** Remove the observed stylesheet-discovery delay before fetching the Geist Latin Extended font used by Hungarian service-page body text.

**Architecture:** Keep Next's self-hosted fonts, font styles, glyph coverage, fallback metrics and page structure. Change only which existing Geist subset is preloaded, then compare the same three routes under identical Lighthouse mobile settings.

**Tech stack:** Next.js 16.3.8, next/font/google, Lighthouse 13.1.0, headless Chrome, Vercel Preview.

## 1. Establish evidence

- [x] Review repository instructions and current production SHA 9f8103b.
- [x] Measure /hu, /hu/szolgaltatasok/objektumorzes and /hu/szolgaltatasok/portaszolgalat three times each in production.
- [x] Confirm Geist Latin Extended is fetched after CSS discovery; identify service LCP as real body text.
- [ ] Measure the unchanged production build on localhost three times per route.
- [ ] Assert from rendered HTML and CSS that the used Geist Latin Extended file has no preload before the patch.

## 2. Apply the minimal experiment

File: app/[locale]/layout.tsx, Geist configuration only.

```tsx
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});
```

- [ ] Apply this change; leave Barlow, images, consent UI, copy and indexing unchanged.
- [ ] Build again with verified staging read-only DB access and assert the extended font is preloaded.
- [ ] Repeat the same localhost measurements. Keep the change only if evidence supports earlier font discovery without a material regression; don't equate local lab scores with real-user field performance.

## 3. Validate and prepare review

- [ ] Run lint, TypeScript, unit tests, copy guards and build.
- [ ] Obtain independent patch review; inspect the exact diff.
- [ ] Push feature branch and create PR; verify GitHub CI and Vercel Preview source commit.
- [ ] Run Preview smoke, font-preload assertions and mobile measurements; visually check HU/EN and the two service pages.
- [ ] Save a concise measurement report with caveats and Preview URL; ask for production approval only after the result is reviewable.

Evidence is saved outside source under ../audit-artifacts/mobile-performance-2026-10-18/. No contact submission, CMS mutation or database write is part of this task.
