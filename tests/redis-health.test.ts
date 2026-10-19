import assert from "node:assert/strict";
import test, { type TestContext } from "node:test";
import { GET } from "../app/api/cron/redis-health/route";
import { getRedisConfig } from "../lib/redis-config";
import { checkRateLimit } from "../lib/rate-limit";

const dummyEnv = {
  NODE_ENV: "production",
  VERCEL_ENV: "production",
  CRON_SECRET: "dummy-cron-secret",
  UPSTASH_REDIS_REST_URL: "https://dummy-redis.invalid",
  UPSTASH_REDIS_REST_TOKEN: "dummy-redis-token",
} as const;

function isolate(t: TestContext, env: NodeJS.ProcessEnv = dummyEnv) {
  const originalEnv = process.env;
  process.env = { ...env };
  t.after(() => { process.env = originalEnv; });
  const fetchMock = t.mock.method(globalThis, "fetch", async () => Response.json({ result: null }));
  const logs: unknown[][] = [];
  t.mock.method(console, "error", (...args: unknown[]) => { logs.push(args); });
  t.mock.method(console, "warn", () => {});
  return { fetchMock, logs };
}

function request(authorization: string | null = "Bearer dummy-cron-secret") {
  return new Request("https://website.invalid/api/cron/redis-health?key=caller-key", {
    headers: authorization === null ? {} : { Authorization: authorization },
  });
}

async function assertReply(response: Response, status: number) {
  assert.equal(response.status, status);
  assert.equal(response.headers.get("Cache-Control"), "no-store");
  assert.equal(response.headers.get("X-Robots-Tag"), "noindex, nofollow");
  assert.deepEqual(await response.json(), { ok: status === 200 });
}

for (const deployment of ["preview", "development", undefined]) {
  test(`Redis health is inaccessible in ${deployment ?? "unset"} VERCEL_ENV`, async (t) => {
    const { fetchMock } = isolate(t, { ...dummyEnv, VERCEL_ENV: deployment });
    await assertReply(await GET(request()), 404);
    assert.equal(fetchMock.mock.callCount(), 0);
  });
}

for (const authorization of [null, "Bearer wrong-secret", "bearer dummy-cron-secret", "Bearer dummy-cron-secret extra"]) {
  test(`Redis health rejects authorization ${JSON.stringify(authorization)}`, async (t) => {
    const { fetchMock } = isolate(t);
    await assertReply(await GET(request(authorization)), 401);
    assert.equal(fetchMock.mock.callCount(), 0);
  });
}

for (const secret of [undefined, "", "   "]) {
  test(`Redis health refuses an unconfigured cron secret ${JSON.stringify(secret)}`, async (t) => {
    const { fetchMock } = isolate(t, { ...dummyEnv, CRON_SECRET: secret });
    await assertReply(await GET(request()), 401);
    assert.equal(fetchMock.mock.callCount(), 0);
  });
}

test("Redis health refuses missing Redis configuration without a request", async (t) => {
  const { fetchMock } = isolate(t, {
    NODE_ENV: "production", VERCEL_ENV: "production", CRON_SECRET: dummyEnv.CRON_SECRET,
  });
  await assertReply(await GET(request()), 503);
  assert.equal(fetchMock.mock.callCount(), 0);
});

for (const result of [null, "private-returned-key-value"]) {
  test(`Redis health treats a ${result === null ? "missing" : "string-valued"} key as healthy without exposing it`, async (t) => {
    const { fetchMock, logs } = isolate(t);
    fetchMock.mock.mockImplementation(async () => Response.json({ result }));
    await assertReply(await GET(request()), 200);
    assert.equal(fetchMock.mock.callCount(), 1);
    const [url, options] = fetchMock.mock.calls[0].arguments as unknown as [string, RequestInit];
    assert.equal(url, dummyEnv.UPSTASH_REDIS_REST_URL);
    assert.equal(options.method, "POST");
    assert.deepEqual(JSON.parse(String(options.body)), ["GET", "afm:availability:v1"]);
    assert.equal(new Headers(options.headers).get("Authorization"), `Bearer ${dummyEnv.UPSTASH_REDIS_REST_TOKEN}`);
    assert.equal(new Headers(options.headers).get("Content-Type"), "application/json");
    assert.equal(options.cache, "no-store");
    assert.equal(options.redirect, "error");
    assert.ok(options.signal instanceof AbortSignal);
    assert.deepEqual(logs, []);
  });
}

const privateDetail = `${dummyEnv.UPSTASH_REDIS_REST_URL} ${dummyEnv.UPSTASH_REDIS_REST_TOKEN} ${dummyEnv.CRON_SECRET} private-key-value`;
const invalidResponses: Array<[string, () => Response]> = [
  ["HTTP error", () => new Response(privateDetail, { status: 503 })],
  ["redirect response", () => new Response(null, { status: 302, headers: { Location: "https://elsewhere.invalid" } })],
  ["Redis error", () => Response.json({ error: privateDetail })],
  ["error accompanying result", () => Response.json({ result: null, error: privateDetail })],
  ["absent result", () => Response.json({})],
  ["numeric result", () => Response.json({ result: 1 })],
  ["boolean result", () => Response.json({ result: false })],
  ["object result", () => Response.json({ result: { privateDetail } })],
  ["array result", () => Response.json({ result: [] })],
  ["null envelope", () => Response.json(null)],
  ["array envelope", () => Response.json([null])],
  ["invalid JSON", () => new Response(privateDetail)],
];

for (const [label, makeResponse] of invalidResponses) {
  test(`Redis health fails safely on ${label}`, async (t) => {
    const { fetchMock, logs } = isolate(t);
    fetchMock.mock.mockImplementation(async () => makeResponse());
    await assertReply(await GET(request()), 503);
    assert.equal(fetchMock.mock.callCount(), 1, "no retry");
    assert.equal(logs.length, 1);
    assert.match(JSON.stringify(logs), /^\[\["\[redis-health\] failure=(configuration|http|response|timeout|request)"\]\]$/);
  });
}

test("Redis health never logs an exception's name, message or cause", async (t) => {
  const { fetchMock, logs } = isolate(t);
  fetchMock.mock.mockImplementation(async () => {
    throw Object.assign(new Error(privateDetail, { cause: privateDetail }), { name: privateDetail });
  });
  await assertReply(await GET(request()), 503);
  assert.equal(fetchMock.mock.callCount(), 1);
  assert.deepEqual(logs, [["[redis-health] failure=request"]]);
});

for (const phase of ["fetch", "body"] as const) {
  test(`Redis health aborts a stalled ${phase} after two seconds`, { timeout: 6_000 }, async (t) => {
    const { fetchMock, logs } = isolate(t);
    let signal: AbortSignal | undefined;
    fetchMock.mock.mockImplementation((async (_url: unknown, options: RequestInit) => {
      signal = options.signal as AbortSignal;
      if (phase === "fetch") {
        return new Promise<Response>((_resolve, reject) => {
          signal!.addEventListener("abort", () => reject(new DOMException(privateDetail, "AbortError")), { once: true });
        });
      }
      return new Response(new ReadableStream({
        start(controller) {
          signal!.addEventListener("abort", () => controller.error(new DOMException(privateDetail, "AbortError")), { once: true });
        },
      }));
    }) as typeof fetch);
    const start = performance.now();
    await assertReply(await GET(request()), 503);
    assert.ok(performance.now() - start >= 1_900, "must allow the specified two-second window");
    assert.equal(signal?.aborted, true);
    assert.equal(fetchMock.mock.callCount(), 1);
    assert.deepEqual(logs, [["[redis-health] failure=timeout"]]);
  });
}

test("shared Redis configuration preserves trimmed Upstash priority and independent KV fallback", (t) => {
  isolate(t, {
    NODE_ENV: "test",
    UPSTASH_REDIS_REST_URL: " https://upstash.invalid ",
    UPSTASH_REDIS_REST_TOKEN: " upstash-token ",
    KV_REST_API_URL: " https://kv.invalid ",
    KV_REST_API_TOKEN: " kv-token ",
  });
  assert.deepEqual(getRedisConfig(), { url: "https://upstash.invalid", token: "upstash-token" });
  process.env.UPSTASH_REDIS_REST_TOKEN = " ";
  assert.deepEqual(getRedisConfig(), { url: "https://upstash.invalid", token: "kv-token" });
  process.env.UPSTASH_REDIS_REST_URL = "";
  assert.deepEqual(getRedisConfig(), { url: "https://kv.invalid", token: "kv-token" });
  delete process.env.KV_REST_API_TOKEN;
  assert.equal(getRedisConfig(), null);
  process.env.KV_REST_API_TOKEN = "kv-token";
  delete process.env.KV_REST_API_URL;
  assert.equal(getRedisConfig(), null);
});

test("production contact limiter still fails closed with missing Redis configuration", async (t) => {
  const { fetchMock } = isolate(t, { NODE_ENV: "production", VERCEL_ENV: "production" });
  assert.deepEqual(await checkRateLimit("192.0.2.1"), {
    allowed: false, retryAfter: 60, backend: "redis", reason: "unavailable",
  });
  assert.equal(fetchMock.mock.callCount(), 0);
});

test("production contact limiter still fails closed when Redis is unavailable", async (t) => {
  const { fetchMock } = isolate(t);
  fetchMock.mock.mockImplementation(async () => { throw new Error("dummy unavailable"); });
  assert.deepEqual(await checkRateLimit("192.0.2.2"), {
    allowed: false, retryAfter: 60, backend: "redis", reason: "unavailable",
  });
  assert.equal(fetchMock.mock.callCount(), 1);
});

test("contact limiter uses the shared KV fallback and retains the Redis limit decision", async (t) => {
  const { fetchMock } = isolate(t, {
    NODE_ENV: "production", VERCEL_ENV: "production",
    KV_REST_API_URL: " https://kv.invalid ", KV_REST_API_TOKEN: " kv-token ",
  });
  fetchMock.mock.mockImplementation(async () => Response.json({ result: [6, 30_000] }));
  assert.deepEqual(await checkRateLimit("192.0.2.3"), {
    allowed: false, retryAfter: 30, backend: "redis", reason: "limited",
  });
  const [url, options] = fetchMock.mock.calls[0].arguments as unknown as [string, RequestInit];
  assert.equal(url, "https://kv.invalid");
  assert.equal(new Headers(options.headers).get("Authorization"), "Bearer kv-token");
});
