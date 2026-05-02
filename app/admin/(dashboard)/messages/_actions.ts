"use server";

import { and, eq, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db, messages } from "@/lib/db";

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
// `archived_at IS NULL`. Recoverable via clearing the timestamp — the
// derived state then returns naturally to whatever read_at / replied_at
// presence indicates (no previous-status column needed). Hard delete is
// intentionally not exposed; if retention pressure mounts a DBA can
// `DELETE WHERE archived_at < now() - interval '90 days'`.
export async function archiveMessage(id: number): Promise<void> {
  await requireAdmin();
  await db
    .update(messages)
    .set({ archivedAt: new Date() })
    .where(eq(messages.id, id));
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
  redirect("/admin/messages");
}
