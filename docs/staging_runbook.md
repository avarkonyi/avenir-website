# Staging Runbook — Avenir Website

Last updated: 2026-05-08

## Purpose

This document defines how development, staging, preview, database migrations, QA, and production deployment should work for the Avenir website.

The goal is simple:

Do not experiment directly on production.

All meaningful development should go through a controlled preview / staging workflow before it reaches the live site.

## Project

Website:

https://www.afm.hu

Repository:

C:\Users\andra\avenir-website

Main production route:

/hu

Locales:

- /hu
- /en
- /de
- /zh

Current important branch:

staging-service-pages

Current pilot service page:

/hu/szolgaltatasok/objektumorzes

Canonical service slug:

objektumorzes

Legacy service slug:

security

## Core rule

Production is protected.

Do not assume that a change is production-ready unless András explicitly approves it.

Never run production database migrations before the same migration has been tested on staging.

Never merge service-detail work directly to main without QA.

## Environments

### Local development

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