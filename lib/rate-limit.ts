// In-handler IP rate limiter. Module-scoped Map persists for the
// lifetime of the server instance (per-instance only — no cross-instance
// sync). Adequate as a basic spam first-line; combine with the honeypot
// in the form for two cheap defenses. Upgrade to Upstash Redis if a
// real attack surfaces.

const ipMap = new Map<string, number[]>();

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return req.headers.get("x-real-ip") ?? "unknown";
}

type RateLimitResult =
  | { allowed: true }
  | { allowed: false; retryAfter: number };

export function checkRateLimit(
  ip: string,
  max = 5,
  windowMs = 60_000,
): RateLimitResult {
  // Skip in development so local form testing isn't blocked after a
  // few quick submits.
  if (process.env.NODE_ENV === "development") {
    return { allowed: true };
  }
  const now = Date.now();
  const stamps = (ipMap.get(ip) ?? []).filter((t) => now - t < windowMs);
  if (stamps.length >= max) {
    const retryAfter = Math.ceil((stamps[0] + windowMs - now) / 1000);
    return { allowed: false, retryAfter };
  }
  stamps.push(now);
  ipMap.set(ip, stamps);
  return { allowed: true };
}
