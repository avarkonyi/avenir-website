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

## Remaining checks

Preview deployment, HU/EN measurements and visual verification, route smoke,
final independent review and owner release approval.
