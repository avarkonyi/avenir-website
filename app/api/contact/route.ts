// Contact form POST endpoint.
//
// Order of operations:
//   1. Origin check — production rejects cross-origin POSTs; dev +
//      Vercel preview skip the check for local testing flexibility
//   2. Body-size guard — reject Content-Length > 32 KB before parsing
//      to defend against memory/CPU abuse via gigantic payloads
//   3. Parse JSON body (400 on malformed)
//   4. Zod-validate (400 with per-field error map)
//   5. Honeypot check — non-empty `_website` returns silent 200 (bot
//      gets a successful response, no DB insert, no email)
//   6. IP rate limit — 5/min/IP in production (skipped in dev). 429 on
//      breach with Retry-After header.
//   7. DB insert (primary storage; 500 if it fails — we cannot lose
//      the message)
//   8. Resend notification (fail-soft; warning log if skipped/fails,
//      user still gets 200)

import { NextResponse } from "next/server";
import { ContactPayloadSchema } from "@/lib/contact-schema";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { sendContactNotification } from "@/lib/resend";
import { buildNotificationEmail } from "@/lib/email-templates";
import { db, messages } from "@/lib/db";

const MAX_BODY_BYTES = 32 * 1024;

// Default same-site allowlist for production. Override via the
// ALLOWED_ORIGINS env var (comma-separated) to add Vercel preview
// domains or staging hostnames without code changes.
const DEFAULT_ALLOWED_ORIGINS = [
  "https://www.afm.hu",
  "https://afm.hu",
];

function getAllowedOrigins(): string[] {
  const fromEnv = process.env.ALLOWED_ORIGINS;
  if (!fromEnv) return DEFAULT_ALLOWED_ORIGINS;
  return fromEnv
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

function isOriginAllowed(request: Request): boolean {
  // Dev + Vercel preview: skip check so local testing + preview deploys
  // aren't blocked. Strict same-site enforcement only in production.
  if (process.env.NODE_ENV !== "production") return true;
  if (process.env.VERCEL_ENV === "preview") return true;
  const origin = request.headers.get("origin");
  if (!origin) return false;
  return getAllowedOrigins().includes(origin);
}

export async function POST(request: Request) {
  // Origin check — same-site enforcement in production. Cross-origin
  // browser-initiated POSTs are spam vectors even without classic
  // credentialed CSRF; block before any work happens.
  if (!isOriginAllowed(request)) {
    return NextResponse.json({ error: "forbidden-origin" }, { status: 403 });
  }

  // Body-size guard — reject oversized payloads before parsing to
  // defend against memory/CPU abuse via gigantic JSON. 32 KB is
  // generous (Zod max-field sum is ~4.5 KB).
  const contentLength = request.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > MAX_BODY_BYTES) {
    return NextResponse.json(
      { error: "payload-too-large" },
      { status: 413 },
    );
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid-json" }, { status: 400 });
  }

  const result = ContactPayloadSchema.safeParse(raw);
  if (!result.success) {
    const errors: Record<string, string> = {};
    // First issue per field wins. Zod returns issues in declaration order,
    // so chained validators like .min(1, "emailRequired").email("emailInvalid")
    // surface the more specific "required" code on empty input.
    for (const issue of result.error.issues) {
      const field = String(issue.path[0] ?? "_");
      if (!(field in errors)) errors[field] = issue.message;
    }
    return NextResponse.json(
      { error: "validation", errors },
      { status: 400 },
    );
  }

  const payload = result.data;

  if (payload._website.length > 0) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const ip = getClientIp(request);
  const rate = checkRateLimit(ip);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "throttled" },
      {
        status: 429,
        headers: { "Retry-After": String(rate.retryAfter) },
      },
    );
  }

  const createdAt = new Date();
  try {
    await db.insert(messages).values({
      name: payload.name,
      company: payload.company || null,
      email: payload.email,
      phone: payload.phone || null,
      service: payload.service || null,
      message: payload.message || null,
      locale: payload.locale,
    });
  } catch (err) {
    console.error("[contact] db-insert failed:", err);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }

  const content = buildNotificationEmail(payload, createdAt);
  const sendResult = await sendContactNotification(payload, content);
  if (!sendResult.sent) {
    console.warn("[contact] notification not sent:", sendResult.reason);
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
