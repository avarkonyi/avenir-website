import { connection } from "next/server";
import { and, isNull, sql } from "drizzle-orm";
import { db, messages } from "@/lib/db";
import { AdminSidebarClient } from "./AdminSidebarClient";

// Server-side wrapper. Fetches the unread message count and passes it
// to the client component so the "Üzenetek" link can show a red badge
// with the number. Static segments (everything else) live in the
// client component to keep the active-route highlight working without
// re-fetching on every navigation.
export async function AdminSidebar() {
  await connection();
  const [{ value }] = await db
    .select({ value: sql<number>`count(*)::int` })
    .from(messages)
    .where(and(isNull(messages.readAt), isNull(messages.deletedAt)));
  const unreadCount = value ?? 0;

  return <AdminSidebarClient unreadCount={unreadCount} />;
}
