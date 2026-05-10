# Staging Runbook — Avenir Website

Last updated: 2026-05-10

## Purpose

This document defines how development, staging, preview, database migrations, QA, and production deployment should work for the Avenir website.

The goal is simple:

Do not experiment directly on production.

All meaningful development should go through a controlled preview / staging workflow before it reaches the live site.

## Project

Website:

https://www.afm.hu

Repository:

`C:\Users\andra\avenir-website`

Main production route:

`/hu`

Locales:

- `/hu`
- `/en`
- `/de`
- `/zh`

Current important branch:

`staging-service-pages`

## Current HU Service Detail Layer

Status: current staging HU service detail layer.

The current ready HU service detail pages on staging are:

| Service | Canonical public URL | Legacy slug |
| --- | --- | --- |
| Élőerős objektumőrzés | `/hu/szolgaltatasok/objektumorzes` | `security` |
| Recepciós és portaszolgálat | `/hu/szolgaltatasok/portaszolgalat` | `reception` |
| Biztonságtechnika | `/hu/szolgaltatasok/biztonsagtechnika` | `building` |
| Távfelügyelet és vonulószolgálat | `/hu/szolgaltatasok/tavfelugyelet-vonuloszolgalat` | `technical` |
| Mystery Shopping és helyszíni audit | `/hu/szolgaltatasok/mystery-shopping-helyszini-audit` | `mystery` |
| Rendezvénybiztosítás | `/hu/szolgaltatasok/rendezvenybiztositas` | `cleaning` |
| Hard FM | `/hu/szolgaltatasok/hard-fm` | `hardfm` |
| Soft FM | `/hu/szolgaltatasok/soft-fm` | `green` |

Expected legacy detail URLs should return 404:

- `/hu/szolgaltatasok/security`
- `/hu/szolgaltatasok/reception`
- `/hu/szolgaltatasok/building`
- `/hu/szolgaltatasok/technical`
- `/hu/szolgaltatasok/mystery`
- `/hu/szolgaltatasok/cleaning`
- `/hu/szolgaltatasok/hardfm`
- `/hu/szolgaltatasok/green`

Expected EN/DE/ZH service detail URLs should remain 404 until their own localized required content exists.

## Core Rule

Production is protected.

Do not assume that a change is production-ready unless András explicitly approves it.

Never run production database migrations before the same migration has been tested on staging.

Never merge service-detail work directly to main without QA.

Production deploy remains out of scope unless a migration/content release plan is explicitly approved.

## Environments

### Local Development

Used for:

- coding;
- local build;
- local lint;
- TypeScript checks;
- initial manual testing.

Local commands:

```bash
npm run build
npm run lint
npx tsc --noEmit
```

### Vercel Preview

Used for:

- public route QA;
- sitemap and robots checks;
- metadata/canonical/hreflang checks;
- admin QA against staging DB;
- content review before merge.

The Vercel Preview `/sitemap.xml` must be checked after service seed/content updates.

Do not rely on local `.next` sitemap artifacts for final SEO QA. They may be stale or generated from a different DB snapshot. Live Preview is the source of truth for pre-merge indexing checks.

## Service Detail QA Checklist

Before merging service-detail work, verify on the Vercel Preview URL:

- the eight canonical HU service detail URLs return 200;
- the eight legacy detail URLs listed above return 404;
- EN/DE/ZH service detail URLs for the eight services return 404;
- `/sitemap.xml` includes exactly the eight ready HU service detail URLs;
- `/sitemap.xml` does not include legacy service detail URLs;
- `/sitemap.xml` does not include EN/DE/ZH service detail URLs;
- canonical URLs point to the ready HU URLs;
- hreflang advertises only ready locales;
- FAQPage JSON-LD exists only where the visible FAQ block renders;
- related service links do not render broken public links;
- admin edits do not publish incomplete locale pages.

## Contact Prefill QA

The contact form should accept canonical and legacy query values, but form submission should use canonical slugs.

Canonical examples:

- `/hu?service=objektumorzes#contact`
- `/hu?service=portaszolgalat#contact`
- `/hu?service=biztonsagtechnika#contact`
- `/hu?service=tavfelugyelet-vonuloszolgalat#contact`
- `/hu?service=mystery-shopping-helyszini-audit#contact`
- `/hu?service=rendezvenybiztositas#contact`
- `/hu?service=hard-fm#contact`
- `/hu?service=soft-fm#contact`

Legacy alias examples:

- `/hu?service=security#contact`
- `/hu?service=reception#contact`
- `/hu?service=building#contact`
- `/hu?service=technical#contact`
- `/hu?service=mystery#contact`
- `/hu?service=cleaning#contact`
- `/hu?service=hardfm#contact`
- `/hu?service=green#contact`

Unknown service query values should be ignored safely.
