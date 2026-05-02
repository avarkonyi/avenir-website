"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db, neonSql, positions } from "@/lib/db";

// Server actions for the Positions CRUD module. Auth check happens
// inside each function — middleware gates /admin/* but actions are
// also reachable via direct POST to the action URL, so a defense-
// in-depth check is mandatory.
//
// Result-object shape matches the rest of the admin (News, Services).
// All 12 locale fields + applyEmail are validated server-side; the
// schema's NOT NULL constraints are the floor, but we surface a
// friendly Hungarian error before the DB ever sees the request.

export type PositionPayload = {
  titleHu: string;
  titleEn: string;
  titleDe: string;
  titleZh: string;
  locationHu: string;
  locationEn: string;
  locationDe: string;
  locationZh: string;
  typeHu: string;
  typeEn: string;
  typeDe: string;
  typeZh: string;
  applyEmail: string;
  sortOrder: number;
  active: boolean;
};

export type CreatePositionResult =
  | { ok: true; id: number }
  | { ok: false; error: string };

export type UpdatePositionResult =
  | { ok: true }
  | { ok: false; error: string };

async function requireAdmin(): Promise<string> {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }
  return session.user.email;
}

// Same minimal regex used by the public contact form's zod schema;
// good enough for "is this plausibly an address" without rejecting
// uncommon-but-valid TLDs.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(payload: PositionPayload): string | null {
  const required: Array<[keyof PositionPayload, string]> = [
    ["titleHu", "A magyar pozíció név kötelező."],
    ["titleEn", "Az angol pozíció név kötelező."],
    ["titleDe", "A német pozíció név kötelező."],
    ["titleZh", "A kínai pozíció név kötelező."],
    ["locationHu", "A magyar helyszín kötelező."],
    ["locationEn", "Az angol helyszín kötelező."],
    ["locationDe", "A német helyszín kötelező."],
    ["locationZh", "A kínai helyszín kötelező."],
    ["typeHu", "A magyar típus kötelező."],
    ["typeEn", "Az angol típus kötelező."],
    ["typeDe", "A német típus kötelező."],
    ["typeZh", "A kínai típus kötelező."],
  ];
  for (const [key, message] of required) {
    if (!String(payload[key] ?? "").trim()) return message;
  }
  if (!EMAIL_RE.test(payload.applyEmail.trim())) {
    return "Érvénytelen jelentkezési email cím.";
  }
  if (!Number.isInteger(payload.sortOrder) || payload.sortOrder < 0) {
    return "A sorrend nem-negatív egész szám kell legyen.";
  }
  return null;
}

function normalize(payload: PositionPayload) {
  return {
    titleHu: payload.titleHu.trim(),
    titleEn: payload.titleEn.trim(),
    titleDe: payload.titleDe.trim(),
    titleZh: payload.titleZh.trim(),
    locationHu: payload.locationHu.trim(),
    locationEn: payload.locationEn.trim(),
    locationDe: payload.locationDe.trim(),
    locationZh: payload.locationZh.trim(),
    typeHu: payload.typeHu.trim(),
    typeEn: payload.typeEn.trim(),
    typeDe: payload.typeDe.trim(),
    typeZh: payload.typeZh.trim(),
    applyEmail: payload.applyEmail.trim(),
    sortOrder: Math.trunc(payload.sortOrder),
    active: payload.active,
  };
}

export async function createPosition(
  payload: PositionPayload,
): Promise<CreatePositionResult> {
  await requireAdmin();
  const error = validate(payload);
  if (error) return { ok: false, error };

  try {
    const [created] = await db
      .insert(positions)
      .values(normalize(payload))
      .returning({ id: positions.id });
    revalidatePath("/admin/positions");
    return { ok: true, id: created.id };
  } catch (err) {
    console.error("createPosition error:", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "A pozíció mentése sikertelen.",
    };
  }
}

// updatePosition uses .returning({ id }) so a race with concurrent
// delete (or a forged direct call against a vanished row) surfaces
// as a friendly "Pozíció nem található" instead of a silent no-op.
export async function updatePosition(
  id: number,
  payload: PositionPayload,
): Promise<UpdatePositionResult> {
  await requireAdmin();
  const error = validate(payload);
  if (error) return { ok: false, error };

  try {
    const [updated] = await db
      .update(positions)
      .set({
        ...normalize(payload),
        updatedAt: new Date(),
      })
      .where(eq(positions.id, id))
      .returning({ id: positions.id });
    if (!updated) {
      return { ok: false, error: "Pozíció nem található." };
    }
    revalidatePath("/admin/positions");
    revalidatePath(`/admin/positions/${id}/edit`);
    return { ok: true };
  } catch (err) {
    console.error("updatePosition error:", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "A pozíció mentése sikertelen.",
    };
  }
}

// ── inline status toggle (Iter 4 C3) ──────────────────────────────────

// Mirrors Services' togglePublishStatus pattern: server-truth UI (no
// optimistic flip), .returning({id}) defense-in-depth check for race
// with concurrent delete, friendly Hungarian error on missing row.
//
// No cascade rule (positions has no parent/child hierarchy — flat
// schema). active=false hides the row from the public Career
// section's WHERE active=true query but leaves the row in the DB
// for later re-activation.
export async function togglePositionActive(
  id: number,
  nextActive: boolean,
): Promise<{ ok: true } | { ok: false; error: string }> {
  await requireAdmin();

  try {
    const [updated] = await db
      .update(positions)
      .set({ active: nextActive, updatedAt: new Date() })
      .where(eq(positions.id, id))
      .returning({ id: positions.id });
    if (!updated) {
      return { ok: false, error: "Pozíció nem található." };
    }
    revalidatePath("/admin/positions");
    return { ok: true };
  } catch (err) {
    console.error("togglePositionActive error:", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "A művelet sikertelen.",
    };
  }
}

// ── permanent hard delete (Iter 4 C3) ─────────────────────────────────

// Permanent hard delete — no archive/recovery, the row is gone.
// Distinct from active=false (soft-hide). Positions has no children
// in the schema, so no cascade logic is needed; a single DELETE is
// sufficient. .returning({id}) defense-in-depth surfaces a friendly
// error if the row vanished between the modal-open and the
// confirm-click (concurrent delete race).
export async function deletePosition(
  id: number,
): Promise<{ ok: true } | { ok: false; error: string }> {
  await requireAdmin();

  try {
    const [deleted] = await db
      .delete(positions)
      .where(eq(positions.id, id))
      .returning({ id: positions.id });
    if (!deleted) {
      return { ok: false, error: "Pozíció nem található." };
    }
    revalidatePath("/admin/positions");
    return { ok: true };
  } catch (err) {
    console.error("deletePosition error:", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Törlés sikertelen.",
    };
  }
}

// ── reorder active positions (Iter 4 C3) ──────────────────────────────

// ATOMIC reorder via Neon's HTTP non-interactive transaction. All
// UPDATEs run as a single batched HTTP request that Postgres commits
// or rolls back as a unit — partial failure can't leave a half-
// renumbered set.
//
// (Note: reorderTopLevelServices in services/_actions.ts uses
// sequential awaits — non-atomic. That predates the Iter 3E
// discovery that neonSql.transaction([...]) works on neon-http.
// Flagged for Phase 1.5 backlog cleanup; not refactored here.)
//
// Validates the input set against the live active rows BEFORE any
// write: shape, dedup, set-equality. Stale input from a tab opened
// before someone else inactivated/deleted a row gets a friendly
// "frissítsd az oldalt" error rather than a silent no-op or
// partial reorder.
//
// The `AND active = true` guard inside each UPDATE is defense-in-
// depth against TOCTOU: if a row is inactivated between the
// set-equality check and the transaction commit, that row's UPDATE
// silently no-ops on 0 rows. Acceptable trade-off vs SELECT FOR
// UPDATE locking.
export async function reorderPositions(
  orderedIds: number[],
): Promise<{ ok: true } | { ok: false; error: string }> {
  await requireAdmin();

  if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
    return { ok: false, error: "Üres sorrend." };
  }
  if (!orderedIds.every((id) => Number.isInteger(id) && id > 0)) {
    return { ok: false, error: "Érvénytelen ID a sorrendben." };
  }
  const inputIds = new Set(orderedIds);
  if (inputIds.size !== orderedIds.length) {
    return { ok: false, error: "Duplikált ID a sorrendben." };
  }

  const activeRows = await db
    .select({ id: positions.id })
    .from(positions)
    .where(eq(positions.active, true));
  const activeIds = new Set(activeRows.map((r) => r.id));

  if (
    activeIds.size !== inputIds.size ||
    ![...inputIds].every((id) => activeIds.has(id))
  ) {
    return {
      ok: false,
      error:
        "A sorrend nem egyezik az aktív pozíciók listájával. Frissítsd az oldalt.",
    };
  }

  try {
    await neonSql.transaction(
      orderedIds.map(
        (id, index) =>
          neonSql`UPDATE positions SET sort_order = ${index}, updated_at = NOW() WHERE id = ${id} AND active = true`,
      ),
    );
    revalidatePath("/admin/positions");
    return { ok: true };
  } catch (err) {
    console.error("reorderPositions error:", err);
    return {
      ok: false,
      error:
        err instanceof Error ? err.message : "A sorrend mentése sikertelen.",
    };
  }
}
