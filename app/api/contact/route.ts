// Contact form POST endpoint.
//
// Order of operations:
//   1. Parse JSON body (400 on malformed)
//   2. Zod-validate (400 with per-field error map)
//   3. Honeypot check — non-empty `_website` returns silent 200 (bot
//      gets a successful response, no DB insert, no email)
//   4. IP rate limit — 5/min/IP in production (skipped in dev). 429 on
//      breach with Retry-After header.
//   5. DB insert (primary storage; 500 if it fails — we cannot lose
//      the message)
//   6. Resend notification (fail-soft; warning log if skipped/fails,
//      user still gets 200)

import { NextResponse } from "next/server";
import { ContactPayloadSchema } from "@/lib/contact-schema";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { sendContactNotification } from "@/lib/resend";
import { buildNotificationEmail } from "@/lib/email-templates";
import { db, messages } from "@/lib/db";

export async function POST(request: Request) {
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
