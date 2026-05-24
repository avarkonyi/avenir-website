# AOS Separation Decision

**Status:** accepted  
**Date:** 2026-05-15  
**Applies to:** `avenir-website` and the separate `avenir-aos` application track

## Decision Summary

Avenir Operating System (AOS) is developed as a separate internal operations application, not as a module inside the public website admin.

AOS uses a separate:

- repository: avenir-aos
- Vercel project
- Neon database
- production domain: aos.afm.hu
- staging or preview environment
- release process
- database migration process

The existing Avenir website remains the public lead-generation and CMS platform.

## Website Scope

The `avenir-website` repository remains responsible for:

- public lead-generation website at `www.afm.hu`;
- locale homepages;
- Hungarian service detail pages;
- public article/news layer;
- Partner Logo Strip and proof-gated public trust signals;
- contact form and lead intake;
- website CMS/admin for website content;
- sitemap, robots, metadata, schema, `llms.txt`, and `llms-full.txt`;
- website release, migration, seed, and QA workflows.

The website `/admin` remains a CMS/admin surface for website content. It is not
the AOS internal operations app.

## AOS Scope

The `avenir-aos` repository is responsible for internal operations application
work, including future modules such as:

- internal operational dashboards;
- field/site workflows;
- AOS Guard Log / Elektronikus ornaplo;
- AI Report Assistant;
- QR/NFC field checks if implemented;
- report workflows;
- document workflows;
- proposal or operational automation;
- future client/internal portals if separately approved.

These modules must be designed, migrated, deployed, and released in the AOS
application track, not inside `avenir-website`.

## Current AOS Status

AOS development has started separately in:

`C:\Users\andra\Documents\avenir weblap\avenir-aos`

This does not make AOS part of the website production release. AOS features are
not current public website products unless separately implemented, reviewed, and
approved in the AOS track.

## Release Separation

Website release and AOS release are separate.

Website production release must not:

- deploy AOS;
- run AOS migrations;
- seed AOS data;
- assume AOS production readiness;
- depend on AOS being live;
- treat AOS QA as covered by website QA.

AOS production release must use its own repository, Vercel project, Neon
database, migration process, release checklist, and approval flow.

Production domain target: `aos.afm.hu`.

Staging domain target: `aos-staging.afm.hu` or Vercel Preview.

If website and AOS work happen in parallel, treat them as two separate releases.

## Integration Rule

No website code should call, depend on, or embed AOS functionality unless an
explicit integration design is approved.

Future integrations may be possible, but they require a separate architecture
decision covering:

- boundary and ownership;
- authentication;
- data flow;
- privacy and access control;
- environment separation;
- failure behavior;
- release coordination.

Until then, keep website and AOS operationally independent.

## Public Communication Rule

Do not describe AOS, AOS Guard Log, AI Report Assistant, client portal, QR/NFC
field checks, report automation, proposal automation, or other AOS modules as
current public Avenir website offerings unless they are implemented and
separately approved.

Future/internal AOS concepts may be documented internally, but public website
copy, schema, `llms.txt`, `llms-full.txt`, sitemap, and service copy must not
present them as live public products.

## Production Warning

Production deploy of `avenir-website` does not approve, deploy, migrate, seed,
or validate AOS.

Production deploy of AOS requires separate approval from Andras, separate DB
target verification, separate migration planning, separate QA, and separate
release notes in the `avenir-aos` track.
