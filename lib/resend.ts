// Resend wrapper with fail-soft semantics: if RESEND_API_KEY or
// RESEND_NOTIFY_TO is missing, the function returns a non-thrown
// "skipped" result. The caller (route.ts) treats that as a warning,
// not an error — the DB insert is the source-of-truth, the email is
// best-effort notification.
//
// Env vars are read at runtime (inside the function) so an .env.local
// edit takes effect on the next API call without a server restart.

import { Resend } from "resend";
import type { ContactPayload } from "./contact-schema";

type EmailContent = {
  subject: string;
  html: string;
  text: string;
};

type SendResult =
  | { sent: true; id: string | undefined }
  | {
      sent: false;
      reason:
        | "missing-config"
        | "production-sandbox-blocked"
        | "api-error"
        | "exception";
    };

export async function sendContactNotification(
  payload: ContactPayload,
  content: EmailContent,
): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
  const to = process.env.RESEND_NOTIFY_TO;

  // Production hard-block: refuse to send from Resend's sandbox domain
  // (@resend.dev) in production. Sandbox sends from production trigger
  // Resend rate-limits and spam-flags. Operator must configure a verified
  // domain (e.g., notify@notify.afm.hu) before going live — see ENV.md.
  if (
    process.env.VERCEL_ENV === "production" &&
    from.endsWith("@resend.dev")
  ) {
    console.error(
      "[resend] BLOCKED — production cannot use sandbox sender",
      from,
    );
    return { sent: false, reason: "production-sandbox-blocked" };
  }

  if (!apiKey || !to) {
    console.warn("[resend] skipped:", { hasKey: !!apiKey, hasTo: !!to });
    return { sent: false, reason: "missing-config" };
  }

  const client = new Resend(apiKey);
  try {
    const { data, error } = await client.emails.send({
      from,
      to,
      replyTo: payload.email,
      subject: content.subject,
      html: content.html,
      text: content.text,
    });
    if (error) {
      console.warn("[resend] api-error:", error);
      return { sent: false, reason: "api-error" };
    }
    return { sent: true, id: data?.id };
  } catch (err) {
    console.warn("[resend] exception:", err);
    return { sent: false, reason: "exception" };
  }
}
