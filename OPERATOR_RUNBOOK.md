# Operator Runbook

Operational source of truth for Avenir website database targets, migrations, Vercel environments, and launch checks.

## DB Target Policy

Use a static staging database for local development and Vercel Preview. Use main only for production or an explicit release-gated production migration.

| Context | DATABASE_URL | DATABASE_URL_UNPOOLED | Notes |
| --- | --- | --- | --- |
| Local app runtime | staging pooled | staging direct | `lib/db/index.ts` reads `DATABASE_URL`. |
| Local drizzle-kit | staging pooled | staging direct | `drizzle.config.ts` prefers `DATABASE_URL_UNPOOLED`. |
| Vercel Preview | staging pooled | staging direct | Preview deploys must not point at main. |
| Vercel Production | main pooled | main direct | Only after release approval. |

Current audited Neon endpoints on 2026-05-04:

| Branch | Endpoint |
| --- | --- |
| main | `ep-young-meadow-aln5ux5m` |
| staging | `ep-twilight-sound-al2b7jsb` |

Local forbidden state:

```txt
DATABASE_URL=staging
DATABASE_URL_UNPOOLED=main
```

That state makes the app read staging while `drizzle-kit` migrates main.

## Verify Current Target

Run this in Neon SQL Editor before any manual SQL operation:

```sql
SELECT
  current_setting('neon.endpoint_id', true) AS endpoint_id,
  current_setting('neon.branch_id', true) AS branch_id;
```

Expected endpoint for staging work: `ep-twilight-sound-al2b7jsb`.

Expected endpoint for production work: `ep-young-meadow-aln5ux5m`.

## Migration Workflow

1. Generate locally: `npm run db:generate`.
2. Inspect the generated SQL before applying it.
3. Apply to staging first.
4. Verify staging schema and `drizzle.__drizzle_migrations`.
5. Redeploy/smoke Vercel Preview.
6. Apply to main only during the release gate.
7. Verify main schema and `drizzle.__drizzle_migrations`.

Do not run `npm run db:migrate` until `.env.local` has both database URLs pointed at the intended target.

## Migration Health Checks

```sql
SELECT id, hash, created_at
FROM drizzle.__drizzle_migrations
ORDER BY id;

SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

Expected after Iter 6A cleanup:

- migration count: 10
- app tables: `certifications`, `client_references`, `messages`, `news`, `partners`, `positions`, `services`
- services rows: 8

## Drift Recovery Recipes

### Journal Says Applied, Object Missing

Example from 2026-05-04: main journal had the partners migration, but the `partners` table had been manually dropped.

Fix direction:

1. Recreate the missing object from the reviewed migration SQL.
2. Do not delete the journal row if the object should exist.
3. Verify schema and row counts.

### Object Exists, Journal Missing

Example from 2026-05-04: `certifications.is_published` existed, but the `0009` journal row was missing.

Fix direction:

1. Verify the object exactly matches the local migration.
2. Insert the missing journal row using the local migration hash.
3. Reset the migration sequence with `setval`.

### Staging Diverged From Main

If staging contains only test data and no production-only edits, prefer resetting/recreating staging from the repaired main branch. This removes hidden schema drift and stale journal state.

## Seed Scripts

`npm run db:seed-services` is idempotent for the canonical 8 services, keyed by slug.

Before running it, explicitly set `DATABASE_URL` to the intended branch. The seed script uses app runtime DB access and does not read `DATABASE_URL_UNPOOLED`.

```powershell
$oldDatabaseUrl = $env:DATABASE_URL
$env:DATABASE_URL = "<TARGET_DATABASE_URL>"
npm run db:seed-services
$env:DATABASE_URL = $oldDatabaseUrl
```

Verify:

```sql
SELECT COUNT(*) FROM services;
```

Expected canonical count: 8.

## Vercel Preview Policy

Preview deploys use the static staging branch.

Set in Vercel Project Settings -> Environment Variables -> Preview:

```txt
DATABASE_URL=<staging pooled>
DATABASE_URL_UNPOOLED=<staging direct>
```

After changing env vars, redeploy the latest `feature/admin-mvp` Preview deployment. Environment changes do not reliably affect an already-built deployment.

## One-Off Scripts

Scripts named `update-*-prod.ts` mutate whichever database `.env.local` points at. Treat them as production tools even in local development.

Before running any one-off script:

1. Verify `.env.local`.
2. Verify Neon endpoint identity.
3. Confirm the script is still needed.
4. Record the output in the launch notes.

## Launch Checklist

- Main database has 8 canonical services.
- Main database has all app tables.
- Main and staging migration journals are aligned with local `drizzle/meta/_journal.json`.
- Vercel Preview points at staging.
- Vercel Production points at main.
- Admin routes are blocked from indexing via metadata and robots.
- Sitemap is generated.
- Resend production sender and recipient are verified.
- M365 SPF/DKIM/DMARC are verified.
- Legal pages are reviewed before public launch.

## Secret Rotation Note

If a database password or token is pasted into chat, logs, or screenshots, rotate it before launch and update:

- `.env.local`
- Vercel Preview env vars
- Vercel Production env vars
