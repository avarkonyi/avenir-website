"use server";

import { and, eq, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import { auth } from "@/auth";
import { db, messages } from "@/lib/db";
import { safeActionError } from "@/lib/admin/safe-action-error";
import { renderReplyEmail } from "@/lib/email-templates";

// Server actions for the Messages CRUD module. Auth check happens
// inside each function — even though middleware already gates /admin/*,
// these actions are also reachable via direct POST to the action URL,
// so a defense-in-depth check is mandatory.
//
// All actions revalidate the inbox list path. The detail-page revalidate
// is handled implicitly by Next's tag-less invalidation when the parent
// path is revalidated (state on /admin/messages/[id] re-renders when
// the data changes).

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }
  return session.user.email;
}

// Idempotent — only writes if currently unread. Called both by the
// auto-mount client component on the detail page (fire-and-forget) and
// by any future explicit "mark read" UI. The WHERE-IS-NULL guard means
// re-firing on an already-read row is a no-op at the DB level.
//
// Revalidates the layout segment so the sidebar badge counter (rendered
// in (dashboard)/layout.tsx via AdminSidebar) refreshes on the next
// navigation away from the detail page. The in-place page intentionally
// does NOT refresh — see MarkAsReadOnMount.tsx for the rationale.
export async function markAsRead(id: number): Promise<void> {
  await requireAdmin();
  await db
    .update(messages)
    .set({ readAt: new Date() })
    .where(and(eq(messages.id, id), isNull(messages.readAt)));
  revalidatePath("/admin/messages");
  revalidatePath("/admin", "layout");
}

export async function markAsUnread(id: number): Promise<void> {
  await requireAdmin();
  await db
    .update(messages)
    .set({ readAt: null })
    .where(eq(messages.id, id));
  revalidatePath("/admin/messages");
  revalidatePath(`/admin/messages/${id}`);
  revalidatePath("/admin");
}

// Archive. Sets archived_at = now(); the inbox query filters
// `archived_at IS NULL`. Recoverable via unarchiveMessage — the
// derived state then returns naturally to whatever read_at / replied_at
// presence indicates (no previous-status column needed). Hard delete is
// intentionally not exposed; if retention pressure mounts a DBA can
// `DELETE WHERE archived_at < now() - interval '90 days'`.
//
// Returns a result object instead of redirecting so the client modal
// can show a toast + router.refresh in place. Auth failure still
// throws (security boundary; not user-correctable).
export async function archiveMessage(
  id: number,
): Promise<{ ok: true } | { ok: false; error: string }> {
  await requireAdmin();
  try {
    await db
      .update(messages)
      .set({ archivedAt: new Date() })
      .where(eq(messages.id, id));
    revalidatePath("/admin/messages");
    revalidatePath(`/admin/messages/${id}`);
    revalidatePath("/admin", "layout");
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: safeActionError("archiveMessage", err, "Az archiválás sikertelen."),
    };
  }
}

// Unarchive. Clears archived_at. The derived status returns to
// whatever read_at / replied_at indicate, so an unarchived message
// that had been replied lands back in "Megválaszolva" automatically.
// Immediate UX (no confirm modal): unarchive is a recovery action,
// low-risk, the user is restoring a row they previously chose to hide.
export async function unarchiveMessage(
  id: number,
): Promise<{ ok: true } | { ok: false; error: string }> {
  await requireAdmin();
  try {
    await db
      .update(messages)
      .set({ archivedAt: null })
      .where(eq(messages.id, id));
    revalidatePath("/admin/messages");
    revalidatePath(`/admin/messages/${id}`);
    revalidatePath("/admin", "layout");
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: safeActionError(
        "unarchiveMessage",
        err,
        "A visszaállítás sikertelen.",
      ),
    };
  }
}

// Send a reply via Resend, then persist subject/body/timestamp to the
// message row. The two are intentionally NOT wrapped in a transaction:
// holding a DB connection while waiting on an external HTTP call to
// Resend would risk pool starvation, and Postgres can't help us if the
// HTTP call partially commits anyway.
//
// Anti-delivery gate (CRITICAL): Vercel Preview deploys run with
// NODE_ENV=production (Next.js production build), so NODE_ENV is NOT a
// safe discriminator. Use VERCEL_ENV — only `production` is the real
// production deploy where the customer's email should ever receive a
// send. Everywhere else (preview, vercel dev, plain `npm run dev`)
// REPLY_TEST_RECIPIENT is mandatory and is the only address we'll
// dispatch to. Missing REPLY_TEST_RECIPIENT in non-production is a
// hard error — we never fall back to the customer's email "just in
// case", since that would defeat the safety purpose.
//
// `from` is also guarded against the Resend sandbox sender
// (onboarding@resend.dev) — for replies we prefer to fail loudly over
// sending from a non-brand domain.
export async function sendReply(
  messageId: number,
  subject: string,
  body: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const replyTo = await requireAdmin();

  const trimmedSubject = subject.trim();
  const trimmedBody = body.trim();
  if (trimmedSubject.length === 0) {
    return { ok: false, error: "Hiányzó tárgy." };
  }
  if (trimmedBody.length === 0) {
    return { ok: false, error: "Hiányzó üzenet." };
  }
  if (trimmedBody.length > 10_000) {
    return { ok: false, error: "Az üzenet túl hosszú (max. 10 000 karakter)." };
  }

  const [msg] = await db
    .select()
    .from(messages)
    .where(eq(messages.id, messageId))
    .limit(1);
  if (!msg) {
    return { ok: false, error: "Az üzenet nem található." };
  }
  if (msg.archivedAt !== null) {
    return {
      ok: false,
      error: "Archivált üzenetre nem lehet közvetlenül válaszolni.",
    };
  }

  // RESEND_FROM_EMAIL guard — explicit, no non-null assertion. Sandbox
  // domain is rejected even when set; for reply mail we never want
  // onboarding@resend.dev to leak to a customer.
  const from = process.env.RESEND_FROM_EMAIL;
  if (!from) {
    return {
      ok: false,
      error: "Hiányzó RESEND_FROM_EMAIL környezeti változó.",
    };
  }
  if (from.endsWith("@resend.dev")) {
    return {
      ok: false,
      error:
        "RESEND_FROM_EMAIL nem mutathat a Resend sandbox domainre " +
        "(@resend.dev). Állíts be egy verifikált küldő címet.",
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return {
      ok: false,
      error: "Hiányzó RESEND_API_KEY környezeti változó.",
    };
  }

  // Anti-delivery gate.
  const isRealProduction = process.env.VERCEL_ENV === "production";
  const testRecipient = process.env.REPLY_TEST_RECIPIENT;
  let recipient: string;
  if (isRealProduction) {
    recipient = msg.email;
  } else {
    if (!testRecipient) {
      return {
        ok: false,
        error:
          "REPLY_TEST_RECIPIENT kötelező nem-éles környezetben " +
          "(állítsd be: .env.local lokálisan, vagy Vercel Preview env).",
      };
    }
    recipient = testRecipient;
  }

  const { html, text } = renderReplyEmail({
    recipientName: msg.name,
    locale: msg.locale,
    body: trimmedBody,
    originalMessage: msg.message,
    originalCreatedAt: msg.createdAt,
    subject: trimmedSubject,
  });

  // Send via Resend. Errors here surface to the caller as the original
  // message — ReplyForm shows the actual provider error in a toast so
  // operators can debug (rate limits, domain not verified, etc.).
  try {
    const client = new Resend(apiKey);
    const { error } = await client.emails.send({
      from,
      to: recipient,
      replyTo,
      subject: trimmedSubject,
      html,
      text,
    });
    if (error) {
      return {
        ok: false,
        error: safeActionError(
          "sendReply.resend",
          error,
          "Email küldés sikertelen.",
        ),
      };
    }
  } catch (err) {
    return {
      ok: false,
      error: safeActionError("sendReply.resend", err, "Email küldés sikertelen."),
    };
  }

  // DB write happens AFTER the email is confirmed sent. If this update
  // fails, the customer has the email but the admin tool shows the
  // message as still un-replied — surface a critical error so the
  // operator can manually reconcile (re-running won't double-send
  // because the operator can verify in Resend logs). No auto-retry.
  try {
    await db
      .update(messages)
      .set({
        repliedAt: new Date(),
        replySubject: trimmedSubject,
        replyBody: trimmedBody,
      })
      .where(eq(messages.id, messageId));
  } catch (err) {
    return {
      ok: false,
      error:
        safeActionError(
          `sendReply.dbUpdateAfterSend messageId=${messageId}`,
          err,
          "Az email elküldve, de a DB-frissítés sikertelen. ",
        ) +
        "Frissítsd manuálisan a Neon-ban (replied_at, reply_subject, reply_body).",
    };
  }

  revalidatePath("/admin/messages");
  revalidatePath(`/admin/messages/${messageId}`);
  revalidatePath("/admin", "layout");

  return { ok: true };
}
