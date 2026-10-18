# Mobile performance — 2026-10-18

Baseline production commit: `9f8103beafc9dc5294187f60b542a0fdd40dd2e3`.

## Measurement method

Lighthouse 13.1.0, headless Chrome, default mobile simulation (412 × 823,
DPR 1.75, simulated 4× CPU slowdown / 1,638.4 Kbps throughput / 150 ms RTT),
fresh browser profile for each navigation, three runs per route. No form
submissions or consent changes. These are lab measurements, not real-user
Core Web Vitals or proof of SEO/AI ranking changes.

Production and localhost have different transport, caching and deployment
behavior; their absolute scores must not be compared as before/after results.

## Current production baseline

Medians of three runs:

| Route | Performance | LCP | TBT | CLS |
| --- | ---: | ---: | ---: | ---: |
| `/hu` | 94 | 2.656 s | 51.5 ms | 0.0146 |
| `/hu/szolgaltatasok/objektumorzes` | 96 | 2.654 s | 37 ms | 0 |
| `/hu/szolgaltatasok/portaszolgalat` | 97 | 2.522 s | 25.5 ms | 0 |

The homepage had one CLS outlier of 0.1043, attributed by Lighthouse to a
Barlow font swap moving the hero statistics section. This is a separate
intermittent issue; the present change is not a demonstrated fix for it.

## Cause and minimal change

All nine Hungarian runs downloaded the Geist Latin Extended font, but the
browser discovered it through the stylesheet. Service-page LCP was body text.
Adding `latin-ext` to the existing Geist `subsets` moves the same font into
the initial preload group. The font, weights, glyphs, fallback metrics,
`font-display`, layout, content, consent behavior and SEO metadata stay intact.

The rendered-HTML check failed before the patch (zero preload links for the
used Latin Extended font) and passed afterward (exactly one on all three
routes). Current Next documentation describes `subsets` as the list to preload:
https://nextjs.org/docs/app/api-reference/components/font#subsets

## Matched localhost experiment

Both variants used the same production-style build process, verified staging
read-only data, local port and Lighthouse settings. Medians of three runs:

| Route | FCP before → after | LCP before → after | Score before → after |
| --- | ---: | ---: | ---: |
| Home | 1.061 → 0.909 s | 3.640 → 3.636 s | 86 → 90 |
| Guarding | 1.061 → 0.908 s | 3.401 → 3.475 s | 92 → 91 |
| Reception | 1.061 → 0.909 s | 3.485 → 3.390 s | 91 → 92 |

FCP improved by about 152 ms on all three routes. There is no uniform LCP
improvement: guarding increased 74 ms, reception decreased 96 ms and homepage
was effectively unchanged. Home CLS median changed 0.1212 → 0, but the
underlying Barlow swap issue remains open; do not attribute its closure to
this preload. Home TBT changed 24 → 73.6 ms, still below the good 200 ms
threshold; this small sample does not establish a CPU improvement.

The shared layout also preloads the 16,540-byte subset on other languages,
which may not need it. Preview HU/EN verification must assess this tradeoff.

## Checks completed before Preview

- Two production-style builds completed, 100 generated pages each.
- TypeScript, lint, 167 unit tests and 33 copy guards passed.
- Exact single-font preload assertion passed for all three HU routes.
- No database writes, CMS edits, contact submissions or production deployment.

Raw reports, scripts and logs are retained outside Git under
`audit-artifacts/mobile-performance-2026-10-18/` in the parent workspace.

## Preview verification

Source commit `ec11beeefac559702b291fa234fd94a8815f71c5`, PR #9:
https://github.com/avarkonyi/avenir-website/pull/9

Vercel `dpl_9BR9ZVsLmkzaieWfope4NpGPErJu` was verified Ready / Preview with
that exact source commit. URL:
https://avenir-website-pw93yku77-andrasvarkonyi-7800s-projects.vercel.app

GitHub CI run 39144281017 passed. All three HU pages preload the target font
exactly once; the network report confirms a single request, marked as a
preload, for the same 16,540-byte resource. Mobile before/after screenshots
show the same final text wrapping and layout.

Preview three-run medians (diagnostic results, not a matched causal comparison
against the production host):

| Route | Performance | FCP | LCP | TBT | CLS |
| --- | ---: | ---: | ---: | ---: | ---: |
| Home | 94 | 1.155 s | 2.812 s | 174 ms | 0 |
| Guarding | 97 | 0.962 s | 2.512 s | 57 ms | 0 |
| Reception | 97 | 1.014 s | 2.515 s | 46 ms | 0 |

An independent reviewer found no source correctness defect and confirmed the
earlier font discovery. Reviewer cautions: Lighthouse CPU benchmark values
varied, the scores are simulated, and neither a general LCP improvement nor
a Barlow CLS fix has been established.

The EN homepage diagnostic medians were 95 (production) and 96 (Preview),
with LCP 2.647 / 2.604 s, TBT 54 / 46 ms and CLS 0 in both. The subset was
not requested on the production EN homepage but was requested once on
Preview. Total transferred bytes increased approximately 17.5 KB (374,188 →
391,683); 16,540 resource bytes are the newly preloaded font. These are
different deployments, not a controlled speed comparison. The small transfer
tradeoff is retained for earlier Hungarian text rendering, the owner's
primary market; a broad claim that every locale became faster is unwarranted.

HU/EN desktop inspection and language switching passed. Final mobile
screenshots show no new wrapping or layout defect. Full Preview smoke:
569/569 PASS. Preview remains noindexed. The only outstanding release gate is
owner production approval.

## Follow-up

Investigate the intermittent Barlow font-swap layout shift separately, with
repeatable before/after evidence. The present patch does not close all mobile
performance work and does not guarantee a good real-user LCP/INP percentile.
