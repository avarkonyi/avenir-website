# Daily Redis availability check

## Purpose and scope

The contact form's existing Upstash database was archived for inactivity.
The owner approved reactivation and asked to prevent recurrence. The existing
Vercel-managed database is `upstash-kv-orange-blanket`. Its settings offer no
inactivity toggle. Keep the current plan and the contact limiter's fail-closed
production behavior. Do not submit forms, send mail, change CMS data or design.

## Decision

Use a Vercel production Cron Job daily at `0 6 * * *` (UTC). An authenticated
GET of `/api/cron/redis-health` executes exactly one Redis command:
`["GET", "afm:availability:v1"]`. This reserved key is never written. A missing
key (`result: null`) is a successful read. Unlike PING, this is an ordinary
data command, but Upstash does not explicitly document whether it resets the
archival timer. Treat it as recurring real activity and an availability check,
not a guarantee against provider outages or archival policy changes.

Alternatives considered: a provider setting (not available in this resource's
Settings), PING (operational command; inactivity semantics unclear), a local
scheduled task (depends on the owner's computer). A server-hosted daily GET
requires no plan change and does not touch the rate limiter counters.

## Request and security contract

- Production only: require `VERCEL_ENV === "production"`; Preview/local return
  404 without outbound requests, even with otherwise valid credentials.
- Require nonempty `CRON_SECRET` and an exact `Authorization: Bearer ...` match.
  Missing/incorrect authorization returns 401 without outbound requests.
- Use the same Upstash/KV REST URL/token selection as the contact limiter;
  extract the existing selection without changing its fallback order.
- POST the fixed Redis GET command, no caller-controlled keys, with no-store,
  redirect rejection, and a two-second AbortController timeout covering the
  response body too. Do not retry or use an in-memory success fallback.
- A valid result is null or a string. Never return its value. HTTP errors,
  command errors, malformed responses, timeout and missing configuration
  return a generic 503. Log only a fixed safe failure category.
- Responses are no-store and X-Robots-Tag: noindex, nofollow. No public link,
  sitemap or analytics changes. Success returns only `{ "ok": true }`.
- Generate CRON_SECRET at release and keep it Production-only, sensitive,
  never printed/committed. No existing secret needs exporting.

## Verification and release

Test the actual handler with isolated environment values and mocked fetch;
prove zero outbound calls on auth/environment/config failures, fixed GET,
null/string success, response validation, timeout and credential-safe errors.
Retain checks for the shared config and contact limiter behavior after extract.
Run lint, typecheck, unit suite, copy guard and staging-backed build. Preview
must return 404 on the cron endpoint and pass public/admin read-only smoke.
Obtain independent code review. Follow AGENTS.md's Preview -> QA -> approval
-> merge -> production process. Production-only execution cannot be proved by
Preview; after approval verify target, add secret, deploy, Run the job in Vercel
and inspect the status/logs and Upstash read-command count. Never weaken the
Preview guard to exercise production Redis. No new contact submission.

## Operating limits

One extra read/day is about 30-31 reads/month, plus manual verification.
The existing usage-based tariff still applies; no new subscription is added.
Cron success is not proof of email delivery or the whole contact write path.
This change creates Vercel execution logs, not an external alert service.
Failures and missed schedules require operator attention. Keep the provider's
existing inactivity notices enabled. Rollback: disable this Cron Job or revert
the PR; the contact limiter remains unchanged.
