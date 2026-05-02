"use server";

import { and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db, services } from "@/lib/db";
import { slugify } from "@/lib/utils/slugify";
import { ICON_NAMES } from "@/components/Icon";

// Server actions for the Services CRUD module. Auth check happens
// inside each function — middleware gates /admin/* but server actions
// are also reachable via direct POST to the action URL, so a
// defense-in-depth check is mandatory.
//
// Result-object shape (matching the rest of the admin UI: News,
// Messages reply, etc.) — actions never call redirect(); the client
// shows a toast and routes via router.push/refresh.

async function requireAdmin(): Promise<string> {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }
  return session.user.email;
}

// ── shared payload + helpers ────────────────────────────────────────────

export type ServicePayload = {
  parentId: number | null;
  slug: string;
  icon: string;
  imageUrl: string | null;

  nameHu: string;
  nameEn: string;
  nameDe: string;
  nameZh: string;

  shortDescHu: string;
  shortDescEn: string;
  shortDescDe: string;
  shortDescZh: string;

  longDescHu: string;
  longDescEn: string;
  longDescDe: string;
  longDescZh: string;

  // Raw multi-line strings; the action splits + normalizes.
  highlightsHuRaw: string;
  highlightsEnRaw: string;
  highlightsDeRaw: string;
  highlightsZhRaw: string;

  sortOrder: number;
  isFeatured: boolean;
  isPublished: boolean;
  isActive: boolean;
};

export type CreateServiceResult =
  | { ok: true; id: number; redirect: string; message: string }
  | { ok: false; error: string };

export type UpdateServiceResult =
  | { ok: true; redirect: string; message: string }
  | { ok: false; error: string };

const ICON_NAME_SET = new Set<string>(ICON_NAMES);

function normLocale(value: string | null | undefined): string | null {
  if (value === null || value === undefined) return null;
  const trimmed = value.trim();
  return trimmed.length === 0 ? null : trimmed;
}

// Split raw textarea content into a clean string[]. Throws when
// caller-facing limits are violated (max 6 entries, max 160 chars
// per entry); the calling action's try/catch surfaces the message.
function normalizeHighlights(raw: string | null | undefined): string[] {
  if (!raw) return [];
  const lines = raw
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
  if (lines.length > 6) {
    throw new Error("Maximum 6 kiemelés engedélyezett (kategóriánként).");
  }
  for (const line of lines) {
    if (line.length > 160) {
      throw new Error(
        `Egy kiemelés maximum 160 karakter (talált: ${line.length}).`,
      );
    }
  }
  return lines;
}

// Slug pipeline: canonicalize first, validate after.
//   - If user input is empty → slugify nameHu.
//   - Otherwise → slugify the user's input (so "Hard FM" → "hard-fm"
//     auto-canonicalizes instead of erroring).
// Throws when canonicalized result is empty (e.g., "!!!" → "").
function resolveSlug(rawSlug: string, nameHu: string): string {
  const fromInput = rawSlug.trim();
  const seed = fromInput.length > 0 ? fromInput : nameHu;
  const canonical = slugify(seed);
  if (!canonical || canonical === "hir") {
    // FALLBACK_SLUG triggers when the seed had no usable chars.
    // For services, "hir" is news-domain — reject and ask for a real name.
    throw new Error(
      "A slug üres vagy kizárólag különleges karaktereket tartalmaz. Add meg a magyar nevet vagy egy egyedi slug-ot.",
    );
  }
  return canonical;
}

// Validate the icon key. Empty is allowed (no icon); otherwise must
// be a known key from ICON_NAMES. Returns the canonicalized value
// (empty → null for the DB).
function resolveIcon(raw: string): string | null {
  const trimmed = raw.trim();
  if (trimmed.length === 0) return null;
  if (!ICON_NAME_SET.has(trimmed)) {
    throw new Error(
      `Érvénytelen ikon kulcs: "${trimmed}". Válassz a listából.`,
    );
  }
  return trimmed;
}

// 2-level hierarchy guard. parentId IS NULL means top-level; only
// top-level services may be a chosen parent. Throws when the picked
// parent is itself a child.
async function assertParentIsTopLevel(parentId: number): Promise<void> {
  const [parent] = await db
    .select({ id: services.id, parentId: services.parentId })
    .from(services)
    .where(eq(services.id, parentId))
    .limit(1);
  if (!parent) {
    throw new Error("A kiválasztott szülő szolgáltatás nem létezik.");
  }
  if (parent.parentId !== null) {
    throw new Error(
      "A kiválasztott szolgáltatás már al-szolgáltatás. Csak főszolgáltatás alá hozhatsz létre al-szolgáltatást.",
    );
  }
}

function isUniqueViolation(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  return (
    /services_slug_unique|duplicate key|unique constraint/i.test(err.message)
  );
}

// ── existing toggle (kept unchanged from Commit 2) ──────────────────────

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

// ── CRUD ────────────────────────────────────────────────────────────────

export async function createService(
  payload: ServicePayload,
): Promise<CreateServiceResult> {
  await requireAdmin();

  const nameHu = payload.nameHu.trim();
  if (nameHu.length === 0) {
    return { ok: false, error: "A magyar név kötelező." };
  }

  try {
    if (payload.parentId !== null) {
      await assertParentIsTopLevel(payload.parentId);
    }

    const slug = resolveSlug(payload.slug, nameHu);
    const icon = resolveIcon(payload.icon);
    const imageUrl = normLocale(payload.imageUrl);

    const highlightsHu = normalizeHighlights(payload.highlightsHuRaw);
    const highlightsEn = normalizeHighlights(payload.highlightsEnRaw);
    const highlightsDe = normalizeHighlights(payload.highlightsDeRaw);
    const highlightsZh = normalizeHighlights(payload.highlightsZhRaw);

    const sortOrder = Number.isFinite(payload.sortOrder)
      ? Math.max(0, Math.trunc(payload.sortOrder))
      : 0;

    const [inserted] = await db
      .insert(services)
      .values({
        parentId: payload.parentId,
        slug,
        icon,
        imageUrl,

        nameHu,
        nameEn: normLocale(payload.nameEn),
        nameDe: normLocale(payload.nameDe),
        nameZh: normLocale(payload.nameZh),

        shortDescHu: normLocale(payload.shortDescHu),
        shortDescEn: normLocale(payload.shortDescEn),
        shortDescDe: normLocale(payload.shortDescDe),
        shortDescZh: normLocale(payload.shortDescZh),

        longDescHu: normLocale(payload.longDescHu),
        longDescEn: normLocale(payload.longDescEn),
        longDescDe: normLocale(payload.longDescDe),
        longDescZh: normLocale(payload.longDescZh),

        highlightsHu,
        highlightsEn,
        highlightsDe,
        highlightsZh,

        sortOrder,
        isFeatured: payload.isFeatured,
        isPublished: payload.isPublished,
        isActive: payload.isActive,
      })
      .returning({ id: services.id });

    revalidatePath("/admin/services");

    return {
      ok: true,
      id: inserted.id,
      redirect: "/admin/services",
      message: "Szolgáltatás létrehozva.",
    };
  } catch (err) {
    if (isUniqueViolation(err)) {
      return {
        ok: false,
        error: `Ez a slug már foglalt: "${payload.slug.trim() || nameHu}". Válassz egyedit.`,
      };
    }
    console.error("createService error:", err);
    return {
      ok: false,
      error:
        err instanceof Error
          ? err.message
          : "A szolgáltatás létrehozása sikertelen.",
    };
  }
}

export async function updateService(
  id: number,
  payload: ServicePayload,
): Promise<UpdateServiceResult> {
  await requireAdmin();

  const nameHu = payload.nameHu.trim();
  if (nameHu.length === 0) {
    return { ok: false, error: "A magyar név kötelező." };
  }

  try {
    const [existing] = await db
      .select()
      .from(services)
      .where(eq(services.id, id))
      .limit(1);
    if (!existing) {
      return { ok: false, error: "A szolgáltatás nem található." };
    }

    // Self-loop guard (defense in depth — the UI excludes self from
    // the parent dropdown options, but server defends anyway).
    if (payload.parentId === id) {
      return {
        ok: false,
        error: "Egy szolgáltatás nem lehet önmaga szülője.",
      };
    }

    // If this service has children, it cannot be demoted to a child.
    if (payload.parentId !== null) {
      const [{ value: childCount }] = await db
        .select({ value: sql<number>`count(*)::int` })
        .from(services)
        .where(eq(services.parentId, id));
      if (childCount > 0) {
        return {
          ok: false,
          error:
            "Ennek a szolgáltatásnak vannak al-szolgáltatásai. Először töröld vagy önállósítsd őket, mielőtt al-szolgáltatássá alakítod.",
        };
      }

      await assertParentIsTopLevel(payload.parentId);
    }

    const slug = resolveSlug(payload.slug, nameHu);
    const icon = resolveIcon(payload.icon);
    const imageUrl = normLocale(payload.imageUrl);

    const highlightsHu = normalizeHighlights(payload.highlightsHuRaw);
    const highlightsEn = normalizeHighlights(payload.highlightsEnRaw);
    const highlightsDe = normalizeHighlights(payload.highlightsDeRaw);
    const highlightsZh = normalizeHighlights(payload.highlightsZhRaw);

    const sortOrder = Number.isFinite(payload.sortOrder)
      ? Math.max(0, Math.trunc(payload.sortOrder))
      : 0;

    await db
      .update(services)
      .set({
        parentId: payload.parentId,
        slug,
        icon,
        imageUrl,

        nameHu,
        nameEn: normLocale(payload.nameEn),
        nameDe: normLocale(payload.nameDe),
        nameZh: normLocale(payload.nameZh),

        shortDescHu: normLocale(payload.shortDescHu),
        shortDescEn: normLocale(payload.shortDescEn),
        shortDescDe: normLocale(payload.shortDescDe),
        shortDescZh: normLocale(payload.shortDescZh),

        longDescHu: normLocale(payload.longDescHu),
        longDescEn: normLocale(payload.longDescEn),
        longDescDe: normLocale(payload.longDescDe),
        longDescZh: normLocale(payload.longDescZh),

        highlightsHu,
        highlightsEn,
        highlightsDe,
        highlightsZh,

        sortOrder,
        isFeatured: payload.isFeatured,
        isPublished: payload.isPublished,
        isActive: payload.isActive,

        updatedAt: new Date(),
      })
      .where(eq(services.id, id));

    revalidatePath("/admin/services");
    revalidatePath(`/admin/services/${id}/edit`);

    return {
      ok: true,
      redirect: "/admin/services",
      message: "Szolgáltatás frissítve.",
    };
  } catch (err) {
    if (isUniqueViolation(err)) {
      return {
        ok: false,
        error: `Ez a slug már foglalt: "${payload.slug.trim() || nameHu}". Válassz egyedit.`,
      };
    }
    console.error("updateService error:", err);
    return {
      ok: false,
      error:
        err instanceof Error
          ? err.message
          : "A szolgáltatás frissítése sikertelen.",
    };
  }
}
