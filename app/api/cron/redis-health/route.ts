import { getRedisConfig } from "@/lib/redis-config";

export const dynamic = "force-dynamic";

const REDIS_TIMEOUT_MS = 2_000;

function reply(status: number): Response {
  return Response.json({ ok: status === 200 }, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}

function unavailable(category: "configuration" | "http" | "response" | "timeout" | "request"): Response {
  console.error(`[redis-health] failure=${category}`);
  return reply(503);
}

export async function GET(request: Request): Promise<Response> {
  if (process.env.VERCEL_ENV !== "production") return reply(404);

  const secret = process.env.CRON_SECRET;
  if (!secret?.trim() || request.headers.get("Authorization") !== `Bearer ${secret}`) {
    return reply(401);
  }

  const config = getRedisConfig();
  if (!config) return unavailable("configuration");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REDIS_TIMEOUT_MS);
  try {
    const response = await fetch(config.url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.token}`,
        "Content-Type": "application/json",
      },
      // Reserved read-only key: never reuse contact rate-limit counters.
      body: JSON.stringify(["GET", "afm:availability:v1"]),
      cache: "no-store",
      redirect: "error",
      signal: controller.signal,
    });
    if (!response.ok) return unavailable("http");

    const payload: unknown = await response.json();
    if (
      !payload || typeof payload !== "object" || Array.isArray(payload) ||
      "error" in payload || !("result" in payload) ||
      (payload.result !== null && typeof payload.result !== "string")
    ) {
      return unavailable("response");
    }
    return reply(200);
  } catch {
    return unavailable(controller.signal.aborted ? "timeout" : "request");
  } finally {
    // Keep the deadline active through response.json(), not just the headers.
    clearTimeout(timeout);
  }
}
