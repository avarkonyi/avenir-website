"use server";

import { and, eq, inArray, isNull, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db, neonSql, services } from "@/lib/db";
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

  // Service-detail-page fields (P5 Phase 1).
  seoTitleHu: string;
  seoTitleEn: string;
  seoTitleDe: string;
  seoTitleZh: string;

  seoDescriptionHu: string;
  seoDescriptionEn: string;
  seoDescriptionDe: string;
  seoDescriptionZh: string;

  valuePropositionHu: string;
  valuePropositionEn: string;
  valuePropositionDe: string;
  valuePropositionZh: string;

  // Line-separated raw strings for string[] fields.
  useCasesHuRaw: string;
  useCasesEnRaw: string;
  useCasesDeRaw: string;
  useCasesZhRaw: string;

  includedItemsHuRaw: string;
  includedItemsEnRaw: string;
  includedItemsDeRaw: string;
  includedItemsZhRaw: string;

  // Per-line "Title || Body" raw strings for compound items.
  processStepsHuRaw: string;
  processStepsEnRaw: string;
  processStepsDeRaw: string;
  processStepsZhRaw: string;

  trustItemsHuRaw: string;
  trustItemsEnRaw: string;
  trustItemsDeRaw: string;
  trustItemsZhRaw: string;

  // Per-line "Question || Answer" raw strings.
  faqHuRaw: string;
  faqEnRaw: string;
  faqDeRaw: string;
  faqZhRaw: string;

  // Comma-or-line separated slugs of related services. Locale-
  // independent.
  relatedServiceSlugsRaw: string;

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

// Generic line-array normalizer (no per-item count cap; the highlights
// helper above keeps its 6-item / 160-char limit because it backs the
// already-shipped homepage card pattern). Each line is trimmed; empty
// lines collapse out. Per-line length capped at 400 to avoid pathological
// admin paste-bombs filling the jsonb column unbounded.
function normalizeLines(raw: string | null | undefined): string[] {
  if (!raw) return [];
  const lines = raw
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
  for (const line of lines) {
    if (line.length > 400) {
      throw new Error(
        `Egy sor maximum 400 karakter (talált: ${line.length}).`,
      );
    }
  }
  return lines;
}

// Compound items: each non-empty line is "Title || Body". Lines without
// the "||" separator are treated as title-only (body = "").
function normalizeCompound(
  raw: string | null | undefined,
): { title: string; body: string }[] {
  if (!raw) return [];
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => {
      const sep = line.indexOf("||");
      if (sep === -1) return { title: line, body: "" };
      const title = line.slice(0, sep).trim();
      const body = line.slice(sep + 2).trim();
      return { title, body };
    })
    .filter((entry) => entry.title.length > 0);
}

// FAQ entries reuse the "Q || A" same separator, but the canonical
// shape has q/a keys (matches FAQPage schema.org property names).
function normalizeFaq(
  raw: string | null | undefined,
): { q: string; a: string }[] {
  return normalizeCompound(raw).map(({ title, body }) => ({
    q: title,
    a: body,
  }));
}

// Related-service slugs: comma- or newline-separated, slugified per
// entry so admin can paste display names. Empty entries drop. The
// detail page query (getPublishedServicesBySlugs) silently filters
// any slug that's missing or unpublished — we don't FK-validate here
// because the related target may be added later.
function normalizeRelatedSlugs(raw: string | null | undefined): string[] {
  if (!raw) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const piece of raw.split(/[\n,]/)) {
    const trimmed = piece.trim();
    if (trimmed.length === 0) continue;
    const slug = slugify(trimmed);
    if (!slug || slug === "hir" || seen.has(slug)) continue;
    seen.add(slug);
    out.push(slug);
  }
  return out;
}

// Bundles every detail-page column write into a single object spread
// into the values()/set() call. Keeps the CRUD bodies short and
// guarantees create/update parity (any new detail column added here
// flows to both paths automatically).
function normalizeDetailFields(payload: ServicePayload) {
  return {
    seoTitleHu: normLocale(payload.seoTitleHu),
    seoTitleEn: normLocale(payload.seoTitleEn),
    seoTitleDe: normLocale(payload.seoTitleDe),
    seoTitleZh: normLocale(payload.seoTitleZh),

    seoDescriptionHu: normLocale(payload.seoDescriptionHu),
    seoDescriptionEn: normLocale(payload.seoDescriptionEn),
    seoDescriptionDe: normLocale(payload.seoDescriptionDe),
    seoDescriptionZh: normLocale(payload.seoDescriptionZh),

    valuePropositionHu: normLocale(payload.valuePropositionHu),
    valuePropositionEn: normLocale(payload.valuePropositionEn),
    valuePropositionDe: normLocale(payload.valuePropositionDe),
    valuePropositionZh: normLocale(payload.valuePropositionZh),

    useCasesHu: normalizeLines(payload.useCasesHuRaw),
    useCasesEn: normalizeLines(payload.useCasesEnRaw),
    useCasesDe: normalizeLines(payload.useCasesDeRaw),
    useCasesZh: normalizeLines(payload.useCasesZhRaw),

    includedItemsHu: normalizeLines(payload.includedItemsHuRaw),
    includedItemsEn: normalizeLines(payload.includedItemsEnRaw),
    includedItemsDe: normalizeLines(payload.includedItemsDeRaw),
    includedItemsZh: normalizeLines(payload.includedItemsZhRaw),

    processStepsHu: normalizeCompound(payload.processStepsHuRaw),
    processStepsEn: normalizeCompound(payload.processStepsEnRaw),
    processStepsDe: normalizeCompound(payload.processStepsDeRaw),
    processStepsZh: normalizeCompound(payload.processStepsZhRaw),

    trustItemsHu: normalizeCompound(payload.trustItemsHuRaw),
    trustItemsEn: normalizeCompound(payload.trustItemsEnRaw),
    trustItemsDe: normalizeCompound(payload.trustItemsDeRaw),
    trustItemsZh: normalizeCompound(payload.trustItemsZhRaw),

    faqHu: normalizeFaq(payload.faqHuRaw),
    faqEn: normalizeFaq(payload.faqEnRaw),
    faqDe: normalizeFaq(payload.faqDeRaw),
    faqZh: normalizeFaq(payload.faqZhRaw),

    relatedServiceSlugs: normalizeRelatedSlugs(payload.relatedServiceSlugsRaw),
  };
}

// Publish gate (P5 Phase 1 spec): a service can only flip
// isPublished=true when slug, seoTitleHu, seoDescriptionHu,
// longDescHu, and valuePropositionHu are all present. Other locales
// fall back to HU at render time, so the gate is HU-only — same
// philosophy as the news / certifications publish-required surface.
function assertCanPublishDetail(
  payload: ServicePayload,
  slug: string,
): void {
  if (!payload.isPublished) return;
  const missing: string[] = [];
  if (slug.trim().length === 0) missing.push("slug");
  if (payload.seoTitleHu.trim().length === 0) missing.push("SEO cím (HU)");
  if (payload.seoDescriptionHu.trim().length === 0)
    missing.push("SEO leírás (HU)");
  if (payload.longDescHu.trim().length === 0)
    missing.push("Hosszú leírás (HU)");
  if (payload.valuePropositionHu.trim().length === 0)
    missing.push("Értékajánlat (HU)");
  if (missing.length > 0) {
    throw new Error(
      `A publikáláshoz a következő mezők szükségesek: ${missing.join(", ")}.`,
    );
  }
}

function assertExistingCanPublishDetail(
  service: typeof services.$inferSelect,
): void {
  if (!service.isPublished) return;
  const missing: string[] = [];
  if (service.slug.trim().length === 0) missing.push("slug");
  if (!service.seoTitleHu?.trim()) missing.push("SEO cím (HU)");
  if (!service.seoDescriptionHu?.trim()) missing.push("SEO leírás (HU)");
  if (!service.longDescHu?.trim()) missing.push("Hosszú leírás (HU)");
  if (!service.valuePropositionHu?.trim())
    missing.push("Értékajánlat (HU)");
  if (missing.length > 0) {
    throw new Error(
      `A publikáláshoz a következő mezők szükségesek: ${missing.join(", ")}.`,
    );
  }
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

    const detail = normalizeDetailFields(payload);
    assertCanPublishDetail(payload, slug);

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

        ...detail,

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

    const detail = normalizeDetailFields(payload);
    assertCanPublishDetail(payload, slug);

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

        ...detail,

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

// ── inline status toggle (Iter 3C C4) ──────────────────────────────────

// Asymmetric publish-hierarchy rule:
//   - Parent publish/unpublish     → always allowed
//   - Child unpublish              → always allowed
//   - Child publish                → REQUIRES parent active+published
//
// No cascade-on-parent-unpublish. Children retain their isPublished
// state in the DB; the public renderer is responsible for hiding a
// published child whose parent is draft/inactive. The admin badge
// always displays direct DB state — by design, so the operator can
// stage children before flipping the parent live.
export async function togglePublishStatus(
  id: number,
  nextPublished: boolean,
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

  if (nextPublished && service.parentId !== null) {
    const [parent] = await db
      .select()
      .from(services)
      .where(eq(services.id, service.parentId))
      .limit(1);
    if (!parent) {
      return { ok: false, error: "Szülő szolgáltatás nem található." };
    }
    if (!parent.isPublished || !parent.isActive) {
      return {
        ok: false,
        error:
          "Al-szolgáltatás csak aktív és publikált főszolgáltatás alatt publikálható.",
      };
    }
  }

  try {
    if (nextPublished) {
      assertExistingCanPublishDetail({
        ...service,
        isPublished: true,
      });
    }

    await db
      .update(services)
      .set({ isPublished: nextPublished, updatedAt: new Date() })
      .where(eq(services.id, id));
    revalidatePath("/admin/services");
    return { ok: true };
  } catch (err) {
    console.error("togglePublishStatus error:", err);
    return {
      ok: false,
      error:
        err instanceof Error
          ? err.message
          : nextPublished
            ? "Publikálás sikertelen."
            : "A publikálás visszavonása sikertelen.",
    };
  }
}

// ── reorder active top-level parents (Iter 3C C4) ──────────────────────

// Scope: ACTIVE top-level services only (parentId IS NULL AND
// isActive = true). Inactive top-level services keep their existing
// sort_order untouched — they're hidden from the default reorder
// view (showInactive=OFF), so the input array reflects only the
// active set.
//
// Validates the input ID set against the DB-truth ID set before any
// write. Mismatch (a row went inactive / was deleted between page
// render and drop, or the input is forged) → reject with a friendly
// "frissítsd az oldalt" error and no DB writes.
//
// Concurrency: last-write-wins. Two admins/tabs reordering at the
// same time will see the later save win without conflict detection.
// Acceptable for the admin MVP; verzioned/optimistic-concurrency
// control is a Phase 4 polish item.
//
// Atomicity: the per-row UPDATE statements run sequentially. The
// neon-http driver doesn't expose a true transaction wrapper across
// HTTP request boundaries, so a partial failure mid-loop would
// leave a partially-renumbered set. In practice the UPDATEs are
// fast and the failure window is tiny; on error the client calls
// router.refresh() which fetches the canonical (possibly partial)
// state from the DB.
export async function reorderTopLevelServices(
  orderedIds: number[],
): Promise<{ ok: true } | { ok: false; error: string }> {
  await requireAdmin();

  if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
    return { ok: false, error: "Üres sorrend." };
  }
  if (new Set(orderedIds).size !== orderedIds.length) {
    return { ok: false, error: "Duplikált ID a sorrendben." };
  }
  if (!orderedIds.every((id) => Number.isInteger(id) && id > 0)) {
    return { ok: false, error: "Érvénytelen ID a sorrendben." };
  }

  const dbActiveTopLevel = await db
    .select({ id: services.id })
    .from(services)
    .where(and(isNull(services.parentId), eq(services.isActive, true)));
  const dbIds = new Set(dbActiveTopLevel.map((s) => s.id));
  const inputIds = new Set(orderedIds);

  if (
    dbIds.size !== inputIds.size ||
    ![...dbIds].every((id) => inputIds.has(id))
  ) {
    return {
      ok: false,
      error:
        "A sorrend nem egyezik az aktív főszolgáltatások listájával. Frissítsd az oldalt.",
    };
  }

  try {
    const now = new Date();
    for (let i = 0; i < orderedIds.length; i++) {
      await db
        .update(services)
        .set({ sortOrder: i, updatedAt: now })
        .where(eq(services.id, orderedIds[i]));
    }
    revalidatePath("/admin/services");
    return { ok: true };
  } catch (err) {
    console.error("reorderTopLevelServices error:", err);
    return {
      ok: false,
      error:
        err instanceof Error ? err.message : "A sorrend mentése sikertelen.",
    };
  }
}

// ── permanent hard delete (Iter 3E) ────────────────────────────────────

// PERMANENT HARD DELETE — distinct from the existing isActive=false
// inactivation flow. Both coexist:
//   - toggleServiceActive(false) → soft, reversible, hides from public,
//     row remains in DB.
//   - deleteService           → permanent, irreversible, row gone.
//
// The DB FK `parent_id REFERENCES services(id) ON DELETE RESTRICT` is
// the safety net: any naive parent delete with surviving children is
// blocked at the Postgres level. The cascade case here uses an explicit
// transaction (children first, then parent) so the FK clears before the
// parent delete runs. We deliberately do NOT change the FK to ON DELETE
// CASCADE — that would lose the safety net entirely; this server action
// is the only safe entry point.
//
// Cascade is opt-in: callers must pass options.cascade=true after the
// UI has shown a warning with the exact child count. Server-side check
// rejects cascade=false when children exist (defense-in-depth against a
// manipulated client request).
//
// Grandchildren guard: the app design is 2-level, but the schema doesn't
// enforce it. If a child somehow has its own children (corrupted/manual
// data), the cascade is aborted with a friendly Hungarian error rather
// than attempting a partial delete the FK would block confusingly.
export async function deleteService(
  serviceId: number,
  options: { cascade: boolean },
): Promise<{ ok: true } | { ok: false; error: string }> {
  await requireAdmin();

  const [svc] = await db
    .select({ id: services.id })
    .from(services)
    .where(eq(services.id, serviceId))
    .limit(1);
  if (!svc) {
    return { ok: false, error: "A szolgáltatás nem található." };
  }

  const children = await db
    .select({ id: services.id })
    .from(services)
    .where(eq(services.parentId, serviceId));

  if (children.length > 0 && !options.cascade) {
    return {
      ok: false,
      error: `A szolgáltatásnak ${children.length} alszolgáltatása van. Csak cascade módban törölhető.`,
    };
  }

  if (children.length > 0) {
    const childIds = children.map((c) => c.id);
    const grandchildren = await db
      .select({ id: services.id })
      .from(services)
      .where(inArray(services.parentId, childIds));
    if (grandchildren.length > 0) {
      return {
        ok: false,
        error:
          "A szolgáltatás 2 szintnél mélyebb hierarchiát tartalmaz. Kérlek vedd fel velem a kapcsolatot — manuális vizsgálat szükséges.",
      };
    }
  }

  try {
    if (children.length > 0) {
      // drizzle-orm/neon-http does NOT support db.transaction(callback)
      // (the interactive pattern). Use Neon's HTTP non-interactive
      // transaction API instead — a list of pre-built query promises
      // executed atomically in one round-trip. Pass UNAWAITED tagged
      // template invocations; awaiting them individually before the
      // call would lose the atomic-batch semantics.
      await neonSql.transaction([
        neonSql`DELETE FROM services WHERE parent_id = ${serviceId}`,
        neonSql`DELETE FROM services WHERE id = ${serviceId}`,
      ]);
    } else {
      await db.delete(services).where(eq(services.id, serviceId));
    }
  } catch (err) {
    console.error("deleteService error:", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Törlés sikertelen.",
    };
  }

  revalidatePath("/admin/services");
  revalidatePath("/admin", "layout");

  return { ok: true };
}
