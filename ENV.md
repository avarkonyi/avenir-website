# Environment variables

This project reads runtime configuration from `.env.local` (git-ignored)
in dev, and from Vercel project env settings in production.

## Quick start

1. Copy `.env.example` to `.env.local`
2. Fill in `DATABASE_URL` and `DATABASE_URL_UNPOOLED` from your Neon console
3. Keep `EXPECTED_STAGING_NEON_ENDPOINT` and `EXPECTED_PRODUCTION_NEON_ENDPOINT`
   set to the endpoint IDs documented in `OPERATOR_RUNBOOK.md`
4. (Optional) Fill in Resend variables if you want email notifications:
   - `RESEND_API_KEY` — from https://resend.com/api-keys
   - `RESEND_FROM_EMAIL` — defaults to `onboarding@resend.dev` (sandbox)
   - `RESEND_NOTIFY_TO` — your inbox address (e.g. `info@afm.hu`)

## Database target guard

All default database-mutating npm scripts are staging-only:

```powershell
npm run db:migrate
npm run db:push
npm run db:seed-services
```

Each command first checks the connected Neon endpoint through
`scripts/verify-db-target.mjs`. If `.env.local` points at the production
endpoint, the command stops before running Drizzle or seed code.

Production changes require explicit `:prod` commands, for example:

```powershell
npm run db:migrate:prod
```

Use production commands only during a release gate after staging and
preview have already passed.

## Resend setup (production)

Before deploying with real email delivery, configure domain authentication:

1. Add domain `notify.afm.hu` in Resend dashboard → Domains
2. Resend will provide DNS records (SPF + DKIM + DMARC) — add them to
   the Servergarden DNS Zone Editor for the `notify.afm.hu` subdomain.
   **Do NOT modify the root domain MX/SPF** (the M365 inbox at
   `info@afm.hu` must stay intact).
3. Wait for verification (5–15 minutes typically)
4. In Vercel project settings → Environment Variables:
   - `RESEND_API_KEY` = (production key from Resend)
   - `RESEND_FROM_EMAIL` = `notify@notify.afm.hu`
   - `RESEND_NOTIFY_TO` = `info@afm.hu`
5. Redeploy

## Contact API origin allowlist (`ALLOWED_ORIGINS`)

The `/api/contact` endpoint enforces a same-site Origin header check in
production to block cross-origin browser-initiated spam (not classic
CSRF — there are no credentials on this endpoint, but the spam vector
is real).

- **Dev (`NODE_ENV !== "production"`):** check is skipped; local
  testing tools (curl, Postman, browser dev) all pass.
- **Vercel preview (`VERCEL_ENV === "preview"`):** check is skipped so
  preview deploys at `*.vercel.app` work without per-PR config.
- **Production:** request must have an `Origin` header matching one
  of `ALLOWED_ORIGINS` (comma-separated env var). If the var is unset,
  the default allowlist is `https://www.afm.hu, https://afm.hu`.

Override the var to add additional production domains:

```
ALLOWED_ORIGINS=https://www.afm.hu,https://afm.hu,https://landing.afm.hu
```

A failed origin check returns HTTP 403 `{ "error": "forbidden-origin" }`
before any body parsing, rate limiting, or DB insert happens.

## Fail-soft semantics

If `RESEND_API_KEY` or `RESEND_NOTIFY_TO` is missing or empty, the
contact form API still inserts the message into the `messages` DB table
and returns 200 OK to the user. The email send is skipped with a server
log warning (`[resend] skipped:`). The user sees the success state in
the form regardless.

This means:
- Local dev works without Resend setup
- Production degrades gracefully if Resend is temporarily down
- The DB is the source of truth; admin will see all messages in the
  `/admin/messages` inbox once that UI is wired

## Runtime env evaluation

`lib/resend.ts` reads `process.env.RESEND_*` inside the send function,
not at module load. This means an `.env.local` edit takes effect on the
next API call **without restarting the dev server** (handy when adding
the API key for the first time).
