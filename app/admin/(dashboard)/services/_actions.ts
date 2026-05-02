"use server";

import { and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db, services } from "@/lib/db";

// Server actions for the Services CRUD module. Auth check happens
// inside each function — middleware gates /admin/* but server actions
// are also reachable via direct POST to the action URL, so a
// defense-in-depth check is mandatory.
//
// Commit 2 ships only the activate/deactivate toggle. Create/update/
// delete actions land in subsequent commits.

async function requireAdmin(): Promise<string> {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }
  return session.user.email;
}

// Toggle is_active on a single service row.
//
// Cascade rule (per Commit 1 spec): when DEACTIVATING a top-level
// parent (parentId IS NULL), if any of its children are still active
// the deactivation is REJECTED with a friendly Hungarian error. The
// admin must inactivate children first. We do not auto-cascade —
// that would silently hide more rows than the user asked for.
//
// Activation never triggers cascade checks: bringing a row back is
// always safe, and reactivating a parent doesn't force its children
// into any state.
//
// DB-side ON DELETE RESTRICT only protects against hard DELETEs;
// soft-delete cascade is purely an app-layer concern enforced here.
export async function toggleServiceActive(
  id: number,
  nextActive: boolean,
): Promise<{ ok: true } | { ok: false; error: string }> {
  await requireAdmin();

  const [service] = await db
    .select()
    .from(services)
    .where(eq(services.id, id))
    .limit(1);

  if (!service) {
    return { ok: false, error: "Szolgáltatás nem található." };
  }

  if (!nextActive && service.parentId === null) {
    // Verbose count pattern (matches existing News + Messages style;
    // Drizzle's $count helper is intentionally not used here for
    // codebase consistency).
    const [{ value: activeChildrenCount }] = await db
      .select({ value: sql<number>`count(*)::int` })
      .from(services)
      .where(and(eq(services.parentId, id), eq(services.isActive, true)));

    if (activeChildrenCount > 0) {
      return {
        ok: false,
        error: `Aktív al-szolgáltatások (${activeChildrenCount} db) miatt nem inaktiválható. Először inaktiváld őket.`,
      };
    }
  }

  try {
    await db
      .update(services)
      .set({ isActive: nextActive, updatedAt: new Date() })
      .where(eq(services.id, id));
    revalidatePath("/admin/services");
    return { ok: true };
  } catch (err) {
    console.error("toggleServiceActive error:", err);
    return {
      ok: false,
      error:
        err instanceof Error
          ? err.message
          : nextActive
            ? "Az aktiválás sikertelen."
            : "Az inaktiválás sikertelen.",
    };
  }
}
