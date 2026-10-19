# Redis availability check

The contact form depends on the existing `upstash-kv-orange-blanket` Redis
database for its production rate limit. On 2026-10-19 it was reactivated after
inactivity archival; its activation dialog described a 60-day inactivity
period. The current database Settings screen has no switch to disable this.
This is an account-specific observation, not a universal provider guarantee.

## What runs

Vercel calls `/api/cron/redis-health` daily at 06:00 UTC (07:00 winter / 08:00
summer in Budapest). The handler requires both `VERCEL_ENV=production` and the
exact `Bearer CRON_SECRET` header. It reads the reserved key
`afm:availability:v1` once using the same REST configuration as the limiter.
The key is never created or changed. A null result is a valid successful read.
The route returns only status, never the key's value, credentials or Redis URL.

Responses are uncached and noindexed. Preview/local calls return 404 without
accessing Redis. Incorrect/missing authorization returns 401; unavailable or
misconfigured Redis returns 503, with a fixed sanitized log category. The
two-second timeout also covers reading the response body. Contact counters,
CMS data, email delivery, design and public search metadata are unchanged.

The read creates ordinary command activity, but Upstash does not explicitly
guarantee that a missing-key GET resets its archival timer. Its public
[FAQ](https://upstash.com/docs/redis/help/faq) describes inactivity archival;
continue to watch the existing provider notices. This is preventive activity
and a connectivity check, not an uptime guarantee. REST POST and null GET
results follow the [Upstash REST API](https://upstash.com/docs/redis/features/restapi).

## Release checklist

1. Complete the AGENTS.md feature-branch, tests, Ready Preview and QA gates,
   then obtain owner release approval. Do not merge yet; the automatic
   production deployment must receive the new secret on its first build.
2. Confirm the Vercel project is `avenir-website` and its existing integration
   points to `upstash-kv-orange-blanket`. Do not export any current secret.
3. Add a freshly generated, at least 32-byte random `CRON_SECRET` as a
   **Production-only Secret** after approval and before merge. Do not reuse a credential,
   echo it, commit it, or set it for Preview. If one already exists, stop and
   identify its current consumers before replacing it.
4. Merge the approved commit, then verify its production deployment is Ready.
   No database migration is involved. The daily job is configured in `vercel.json`;
   Vercel supplies the bearer header from CRON_SECRET. In the project,
   **Settings → Cron Jobs → Run** performs a manual verification without
   revealing the secret. Check that this invocation returned 200, not a
   redirect, and that Upstash shows a read command at that time.
5. Check the first scheduled invocation too. Record timestamp, commit,
   deployment and HTTP result, without secret/request-header dumps.

The [Vercel cron guide](https://vercel.com/docs/cron-jobs/manage-cron-jobs)
documents authentication, execution logs and schedule limits. A job may be
late or missed and failed requests are not automatically retried. The daily
frequency also fits Hobby's limit. The deployed check runs independently of
the operator's computer.

## Cost, failures and rollback

This adds about 30–31 Redis reads and function invocations per month, plus
manual tests, under the existing usage-based plan. It does not add a plan or
subscription. [Current Redis pricing](https://upstash.com/pricing/redis) applies;
the check is not represented as cost-free.

There is no new email alert service. Use Cron Jobs / function logs to inspect
executions. For 401, verify the Production secret is set and the deployment
includes it. For 503, inspect the fixed log category and the existing Upstash
resource's state. For missing executions, check the deployed cron schedule
and whether jobs are disabled. Do not fix failures by weakening authorization
or adding an in-memory production fallback.

A successful read does not test EVAL/INCR permissions, CMS writes or email
delivery. The last separately approved end-to-end form test is recorded in the
2026-10-19 operational audit; do not generate test leads for this check.

To pause, use Vercel's Disable Cron Jobs control (project-wide; first check
whether more jobs have since been added). To remove only this job, remove its
entry from vercel.json and redeploy an approved change. Reverting this PR also
removes the endpoint; the form's existing rate limiter remains in place.
