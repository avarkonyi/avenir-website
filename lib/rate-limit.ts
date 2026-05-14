import { createHash } from "crypto";

// Contact form rate limiter.
//
// Production must use durable Upstash/Vercel-KV-compatible Redis via REST:
//   UPSTASH_REDIS_REST_URL
//   UPSTASH_REDIS_REST_TOKEN
//
// Local development and Vercel Preview may fall back to the in-memory limiter
// so form QA is not blocked by missing local secrets. Production fails closed
// if Redis is missing or unavailable, because a per-instance limiter is too
// weak for Vercel serverless production traffic.

const ipMap = new Map<string, number[]>();
let warnedMissingRedisFallback = false;
let warnedRedisFailureFallback = false;

const DEFAULT_MAX_REQUESTS = 5;
const DEFAULT_WINDOW_MS = 60_000;
const REDIS_TIMEOUT_MS = 2_000;

type RateLimitResult =
  | { allowed: true; backend: "redis" | "memory" }
  | {
      allowed: false;
      retryAfter: number;
      backend: "redis" | "memory";
      reason: "limited" | "unavailable";
    };

type RedisConfig = {
  url: string;
  token: string;
};

const RATE_LIMIT_SCRIPT = `
local current = redis.call("INCR", KEYS[1])
if current == 1 then
  redis.call("PEXPIRE", KEYS[1], ARGV[1])
end
local ttl = redis.call("PTTL", KEYS[1])
return { current, ttl }
`;

export function getClientIp(req: Request): string {
  // In production this route is expected to run behind Vercel/proxy
  // infrastructure that controls forwarded IP headers. Prefer Vercel's
  // forwarded header when present, then the standard forwarded chain.
  const vercelForwarded = req.headers.get("x-vercel-forwarded-for");
  if (vercelForwarded) {
    return firstForwardedIp(vercelForwarded);
  }

  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return firstForwardedIp(forwarded);
  }

  return req.headers.get("x-real-ip")?.trim() || "unknown";
}

export async function checkRateLimit(
  ip: string,
  max = DEFAULT_MAX_REQUESTS,
  windowMs = DEFAULT_WINDOW_MS,
): Promise<RateLimitResult> {
  const config = getRedisConfig();

  if (!config) {
    if (isStrictProductionRuntime()) {
      console.error(
        "[contact-rate-limit] Redis credentials are missing in production; blocking contact submission.",
      );
      return {
        allowed: false,
        retryAfter: Math.ceil(windowMs / 1000),
        backend: "redis",
        reason: "unavailable",
      };
    }

    warnMissingRedisFallback();
    return checkMemoryRateLimit(ip, max, windowMs);
  }

  try {
    return await checkRedisRateLimit(config, ip, max, windowMs);
  } catch (error) {
    if (isStrictProductionRuntime()) {
      console.error(
        `[contact-rate-limit] Redis limiter unavailable in production; blocking contact submission. cause=${safeErrorName(error)}`,
      );
      return {
        allowed: false,
        retryAfter: Math.ceil(windowMs / 1000),
        backend: "redis",
        reason: "unavailable",
      };
    }

    warnRedisFailureFallback(error);
    return checkMemoryRateLimit(ip, max, windowMs);
  }
}

function firstForwardedIp(value: string): string {
  return value.split(",")[0]?.trim() || "unknown";
}

function getRedisConfig(): RedisConfig | null {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();

  if (!url || !token) {
    return null;
  }

  return { url, token };
}

function isStrictProductionRuntime(): boolean {
  if (process.env.NODE_ENV !== "production") {
    return false;
  }

  return (
    process.env.VERCEL_ENV !== "preview" &&
    process.env.VERCEL_ENV !== "development"
  );
}

function checkMemoryRateLimit(
  ip: string,
  max: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();
  const key = hashIp(ip);
  const stamps = (ipMap.get(key) ?? []).filter((t) => now - t < windowMs);
  if (stamps.length >= max) {
    const retryAfter = Math.ceil((stamps[0] + windowMs - now) / 1000);
    return {
      allowed: false,
      retryAfter,
      backend: "memory",
      reason: "limited",
    };
  }

  stamps.push(now);
  ipMap.set(key, stamps);
  return { allowed: true, backend: "memory" };
}

async function checkRedisRateLimit(
  config: RedisConfig,
  ip: string,
  max: number,
  windowMs: number,
): Promise<RateLimitResult> {
  const key = `contact:rate-limit:v1:${hashIp(ip)}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REDIS_TIMEOUT_MS);

  try {
    const response = await fetch(config.url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        "EVAL",
        RATE_LIMIT_SCRIPT,
        1,
        key,
        String(windowMs),
      ]),
      cache: "no-store",
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`redis-http-${response.status}`);
    }

    const json = (await response.json()) as {
      result?: unknown;
      error?: unknown;
    };

    if (json.error) {
      throw new Error("redis-command-error");
    }

    if (!Array.isArray(json.result) || json.result.length < 2) {
      throw new Error("redis-unexpected-result");
    }

    const current = Number(json.result[0]);
    const ttlMs = Math.max(Number(json.result[1]), 0);

    if (!Number.isFinite(current) || !Number.isFinite(ttlMs)) {
      throw new Error("redis-invalid-result");
    }

    if (current > max) {
      return {
        allowed: false,
        retryAfter: Math.max(1, Math.ceil(ttlMs / 1000)),
        backend: "redis",
        reason: "limited",
      };
    }

    return { allowed: true, backend: "redis" };
  } finally {
    clearTimeout(timeout);
  }
}

function hashIp(ip: string): string {
  return createHash("sha256").update(ip).digest("hex").slice(0, 32);
}

function warnMissingRedisFallback() {
  if (warnedMissingRedisFallback) {
    return;
  }
  warnedMissingRedisFallback = true;
  console.warn(
    "[contact-rate-limit] UPSTASH_REDIS_REST_URL/TOKEN not configured; using in-memory limiter outside production.",
  );
}

function warnRedisFailureFallback(error: unknown) {
  if (warnedRedisFailureFallback) {
    return;
  }
  warnedRedisFailureFallback = true;
  console.warn(
    `[contact-rate-limit] Redis limiter unavailable outside production; using in-memory fallback. cause=${safeErrorName(error)}`,
  );
}

function safeErrorName(error: unknown): string {
  if (error instanceof Error) {
    return error.name || "Error";
  }
  return typeof error;
}
