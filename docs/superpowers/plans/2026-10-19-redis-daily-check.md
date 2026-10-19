# Daily Redis Check Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Add a production-only daily Redis read to reduce inactivity risk and expose check failures without altering the contact form or its rate limit.

**Architecture:** A Next.js route authenticates Vercel Cron before making a fixed read-only Redis REST call. A shared config helper preserves the existing rate limiter's environment selection. Vercel schedules the production route daily.

**Tech Stack:** Next.js route handler, native fetch/AbortController, node:test, TypeScript, Vercel Cron; no new dependencies.

---

### Task 1: Define and test the request boundary

Files: `tests/redis-health.test.ts`, `tests/run-unit-tests.ts`,
`app/api/cron/redis-health/route.ts`, `lib/redis-config.ts`, `lib/rate-limit.ts`.

- [x] Add behavioral tests first. Use dummy secrets and a fetch stub returning
  `Response.json({ result: null })`; restore process.env and fetch after each
  test. Do not load .env or make network calls.
- [x] Verify a failing test before implementing each behavior. Assert Preview,
  development and unset VERCEL_ENV return 404; production requests with missing
  or wrong CRON_SECRET/auth return 401; all have zero fetch calls.
- [x] Extract the existing `getRedisConfig` implementation verbatim to
  `lib/redis-config.ts`; import it in rate-limit.ts. Preserve Upstash-first,
  KV-fallback and whitespace behavior. Cover config and production rate-limit
  missing/unavailable behavior so the extract cannot weaken the contact form.
- [x] Implement the guarded handler. The only Redis body is:

```ts
JSON.stringify(["GET", "afm:availability:v1"])
```

- [x] Test HTTP/Redis errors, absent result, invalid result type, invalid JSON,
  fetch rejection and body timeout. No response or log may include URL/token,
  upstream error text, or a returned key value. Null and string both mean a
  healthy response; response content is only `{ ok: true }`.
- [x] Require request no-store, redirect:error, and a two-second abort signal.
  Cover no-store/noindex response headers. Confirm the full targeted test file
  passes, then include it in the full unit runner.

### Task 2: Configure and document the schedule

Files: `vercel.json`, `.env.example`, `docs/redis-availability.md`.

- [x] Preserve fra1 and add:

```json
"crons": [{ "path": "/api/cron/redis-health", "schedule": "0 6 * * *" }]
```

- [x] Document CRON_SECRET as a new Production-only sensitive variable, with
  at least 32 random bytes, and add only an empty placeholder to .env.example.
- [x] Document deployment, manual Vercel Run check, diagnostics, current-plan
  usage, provider policy uncertainty and rollback. No credential export and no
  production env change before the concrete release is approved.

### Task 3: Review and Preview verification

- [x] Run `npm run test`, `npm run lint`, `npx tsc --noEmit`, `npm run qa:copy`
  and `npm run build` against the previously verified staging configuration.
- [x] Have a separate reviewer inspect the finished diff for auth bypass,
  Preview access to Redis, secret leakage, timeout and limiter regressions.
- [ ] Commit and push feature branch; create/attach a PR with precise scope,
  test evidence and production-only validation limitations.
- [ ] Wait for Preview Ready and CI; verify cron 404, public smoke, and admin
  authentication redirect without a form submission. Record results.
- [ ] Present the tested PR for the AGENTS.md release approval, including the
  generated-secret setup and daily job. After approval deploy, Run once from
  Vercel, confirm 200 and an Upstash read, then update the shared open-items list.
