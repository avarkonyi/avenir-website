"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db, positions } from "@/lib/db";

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
