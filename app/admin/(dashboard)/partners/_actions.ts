"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db, neonSql, partners } from "@/lib/db";
import { safeActionError } from "@/lib/admin/safe-action-error";
import { slugify } from "@/lib/slugify";

// Server actions for the Partners CRUD module. Auth check happens
// inside each function — middleware gates /admin/* but server
// actions are also reachable via direct POST to the action URL, so
// a defense-in-depth check is mandatory.
//
// Result-object shape matches the rest of the admin (News, Services,
// Positions): actions never call redirect(); the client shows a
// toast and routes via router.push/refresh.
//
// Slug semantics (Iter 5 decision): auto-derived from `name` on
// CREATE only with a `-2`/`-3`/… collision-suffix. NOT editable
// post-create, NOT auto-updated when name changes. Slug is an
// internal stable identifier in this iteration; if Phase 5 needs
// editable public URLs, it will introduce either an `publicSlug`
// column or a dedicated migration with the right validation
// surface.
//
// Publish guard (application-layer, per spec): rejects
// `isPublished = true` when `logoUrl` is null OR `name.trim()` is
// empty. Future public renderer must still defensively filter
// `is_active AND is_published AND logo_url IS NOT NULL` — never
// trust upstream constraints to be the only barrier.
//
// Homepage logo strip guard: showInLogoStrip is independent from
// publishing. It can only be enabled when logo usage approval metadata
// is present, and the public query still filters active + published +
// approved rows defensively.
//
// websiteUrl validation: empty/null is accepted and stored as null;
// non-empty values must parse via `new URL(value)` AND
// `protocol === "https:"`. HTTPS is required only when a website
// URL is provided.

export type PartnerPayload = {
  name: string;
  websiteUrl: string;
  logoUrl: string | null;
  sortOrder: number;
  isActive: boolean;
  isPublished: boolean;
  showInLogoStrip: boolean;
  logoUsageApprovedAt: string;
  logoUsageApprovedBy: string;
  logoUsageScope: string;
};

export type CreatePartnerResult =
  | { ok: true; id: number }
  | { ok: false; error: string };

export type UpdatePartnerResult =
  | { ok: true }
  | { ok: false; error: string };

async function requireAdmin(): Promise<string> {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }
  return session.user.email;
}

const PUBLIC_HOME_PATHS = ["/hu", "/en", "/de", "/zh"] as const;

function revalidatePartnerSurfaces(id?: number) {
  revalidatePath("/admin/partners");
  if (typeof id === "number") {
    revalidatePath(`/admin/partners/${id}/edit`);
  }
  for (const path of PUBLIC_HOME_PATHS) {
    revalidatePath(path);
  }
}

// Auto-derive a unique slug from `name`, suffixing with `-2`,
// `-3`, … on collision. Mirrors news.uniqueSlug but without the
// soft-delete predicate (partners has no deletedAt) and without a
// length cap (partners.slug is unbounded text).
async function uniqueSlugFromName(name: string): Promise<string> {
  const base = slugify(name);
  if (!base) {
    throw new Error(
      "A névből nem generálható érvényes slug. Használj betűket vagy számokat.",
    );
  }

  const first = await db
    .select({ id: partners.id })
    .from(partners)
    .where(eq(partners.slug, base))
    .limit(1);
  if (first.length === 0) return base;

  let counter = 2;
  while (true) {
    const candidate = `${base}-${counter}`;
    const existing = await db
      .select({ id: partners.id })
      .from(partners)
      .where(eq(partners.slug, candidate))
      .limit(1);
    if (existing.length === 0) return candidate;
    counter += 1;
  }
}

// Returns the canonicalized website URL string (always with the
// trailing slash dropped if present is preserved as user wrote it),
// or null when the input is empty. Throws a friendly Hungarian
// error when the value is non-empty but unparseable or non-HTTPS.
function resolveWebsiteUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (trimmed.length === 0) return null;
  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    throw new Error(
      `Érvénytelen weboldal cím: "${trimmed}". Add meg a teljes URL-t (https://…).`,
    );
  }
  if (parsed.protocol !== "https:") {
    throw new Error(
      "A weboldal címnek HTTPS protokollt kell használnia (https://…).",
    );
  }
  return trimmed;
}

function resolveLogoUsageApprovedAt(raw: string): Date | null {
  const trimmed = raw.trim();
  if (trimmed.length === 0) return null;

  const normalized = /^\d{4}-\d{2}-\d{2}$/.test(trimmed)
    ? `${trimmed}T00:00:00.000Z`
    : trimmed;
  const parsed = new Date(normalized);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error("Érvénytelen logóhasználati jóváhagyási dátum.");
  }
  return parsed;
}

// Application-layer publish guard. Both name (after trim) AND
// logoUrl must be present for a partner to be published. Used by
// CREATE, UPDATE, and the publish-toggle action.
function validatePublishGuard(
  name: string,
  logoUrl: string | null,
  isPublished: boolean,
): string | null {
  if (!isPublished) return null;
  if (name.trim().length === 0 || logoUrl === null || logoUrl.length === 0) {
    return "Publikáláshoz logo és név kötelező.";
  }
  return null;
}

function validateLogoStripGuard({
  showInLogoStrip,
  logoUrl,
  logoUsageApprovedAt,
  logoUsageApprovedBy,
  logoUsageScope,
}: {
  showInLogoStrip: boolean;
  logoUrl: string | null;
  logoUsageApprovedAt: Date | null;
  logoUsageApprovedBy: string | null;
  logoUsageScope: string | null;
}): string | null {
  if (!showInLogoStrip) return null;
  if (logoUrl === null || logoUrl.length === 0) {
    return "A főoldali logósávhoz feltöltött logó szükséges.";
  }
  if (!logoUsageApprovedAt) {
    return "A főoldali logósávhoz rögzített logóhasználati jóváhagyási dátum szükséges.";
  }
  if (!logoUsageApprovedBy || logoUsageApprovedBy.trim().length === 0) {
    return "A főoldali logósávhoz jóváhagyó vagy proof owner megadása szükséges.";
  }
  if (!logoUsageScope || logoUsageScope.trim().length === 0) {
    return "A főoldali logósávhoz használati scope vagy megjegyzés szükséges.";
  }
  return null;
}

// ── CRUD ────────────────────────────────────────────────────────────────

export async function createPartner(
  payload: PartnerPayload,
): Promise<CreatePartnerResult> {
  await requireAdmin();

  const name = payload.name.trim();
  if (name.length === 0) {
    return { ok: false, error: "A név kötelező." };
  }
  if (!Number.isInteger(payload.sortOrder) || payload.sortOrder < 0) {
    return { ok: false, error: "A sorrend nem-negatív egész szám kell legyen." };
  }

  const logoUrl =
    payload.logoUrl && payload.logoUrl.length > 0 ? payload.logoUrl : null;

  const guardError = validatePublishGuard(name, logoUrl, payload.isPublished);
  if (guardError) return { ok: false, error: guardError };

  let websiteUrl: string | null;
  let logoUsageApprovedAt: Date | null;
  try {
    websiteUrl = resolveWebsiteUrl(payload.websiteUrl);
    logoUsageApprovedAt = resolveLogoUsageApprovedAt(
      payload.logoUsageApprovedAt,
    );
  } catch {
    return {
      ok: false,
      error: "Érvénytelen partner mezők.",
    };
  }

  const logoUsageApprovedBy =
    payload.logoUsageApprovedBy.trim().length > 0
      ? payload.logoUsageApprovedBy.trim()
      : null;
  const logoUsageScope =
    payload.logoUsageScope.trim().length > 0
      ? payload.logoUsageScope.trim()
      : null;
  const logoStripGuardError = validateLogoStripGuard({
    showInLogoStrip: payload.showInLogoStrip,
    logoUrl,
    logoUsageApprovedAt,
    logoUsageApprovedBy,
    logoUsageScope,
  });
  if (logoStripGuardError) return { ok: false, error: logoStripGuardError };

  try {
    const slug = await uniqueSlugFromName(name);
    const [created] = await db
      .insert(partners)
      .values({
        slug,
        name,
        logoUrl,
        websiteUrl,
        sortOrder: Math.trunc(payload.sortOrder),
        isActive: payload.isActive,
        isPublished: payload.isPublished,
        showInLogoStrip: payload.showInLogoStrip,
        logoUsageApprovedAt,
        logoUsageApprovedBy,
        logoUsageScope,
      })
      .returning({ id: partners.id });
    revalidatePartnerSurfaces(created.id);
    return { ok: true, id: created.id };
  } catch (err) {
    return {
      ok: false,
      error: safeActionError("createPartner", err, "A partner mentése sikertelen."),
    };
  }
}

// updatePartner does NOT touch slug — slug is set on create and
// stays stable for the lifetime of the row (per Iter 5 decision).
// Renaming the partner does not regenerate the slug.
export async function updatePartner(
  id: number,
  payload: PartnerPayload,
): Promise<UpdatePartnerResult> {
  await requireAdmin();

  const name = payload.name.trim();
  if (name.length === 0) {
    return { ok: false, error: "A név kötelező." };
  }
  if (!Number.isInteger(payload.sortOrder) || payload.sortOrder < 0) {
    return { ok: false, error: "A sorrend nem-negatív egész szám kell legyen." };
  }

  const logoUrl =
    payload.logoUrl && payload.logoUrl.length > 0 ? payload.logoUrl : null;

  const guardError = validatePublishGuard(name, logoUrl, payload.isPublished);
  if (guardError) return { ok: false, error: guardError };

  let websiteUrl: string | null;
  let logoUsageApprovedAt: Date | null;
  try {
    websiteUrl = resolveWebsiteUrl(payload.websiteUrl);
    logoUsageApprovedAt = resolveLogoUsageApprovedAt(
      payload.logoUsageApprovedAt,
    );
  } catch {
    return {
      ok: false,
      error: "Érvénytelen partner mezők.",
    };
  }

  const logoUsageApprovedBy =
    payload.logoUsageApprovedBy.trim().length > 0
      ? payload.logoUsageApprovedBy.trim()
      : null;
  const logoUsageScope =
    payload.logoUsageScope.trim().length > 0
      ? payload.logoUsageScope.trim()
      : null;
  const logoStripGuardError = validateLogoStripGuard({
    showInLogoStrip: payload.showInLogoStrip,
    logoUrl,
    logoUsageApprovedAt,
    logoUsageApprovedBy,
    logoUsageScope,
  });
  if (logoStripGuardError) return { ok: false, error: logoStripGuardError };

  try {
    const [updated] = await db
      .update(partners)
      .set({
        name,
        logoUrl,
        websiteUrl,
        sortOrder: Math.trunc(payload.sortOrder),
        isActive: payload.isActive,
        isPublished: payload.isPublished,
        showInLogoStrip: payload.showInLogoStrip,
        logoUsageApprovedAt,
        logoUsageApprovedBy,
        logoUsageScope,
        updatedAt: new Date(),
      })
      .where(eq(partners.id, id))
      .returning({ id: partners.id });
    if (!updated) {
      return { ok: false, error: "Partner nem található." };
    }
    revalidatePartnerSurfaces(id);
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: safeActionError("updatePartner", err, "A partner mentése sikertelen."),
    };
  }
}

// ── inline status toggles ─────────────────────────────────────────────

// Toggle is_active. No cascade rule (partners is flat). active=false
// hides the row from any future public-facing render; row stays in
// DB for re-activation.
export async function togglePartnerActive(
  id: number,
  nextActive: boolean,
): Promise<{ ok: true } | { ok: false; error: string }> {
  await requireAdmin();

  try {
    const [updated] = await db
      .update(partners)
      .set({ isActive: nextActive, updatedAt: new Date() })
      .where(eq(partners.id, id))
      .returning({ id: partners.id });
    if (!updated) {
      return { ok: false, error: "Partner nem található." };
    }
    revalidatePartnerSurfaces(id);
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: safeActionError("togglePartnerActive", err, "A művelet sikertelen."),
    };
  }
}

// Toggle is_published. Re-applies the publish guard server-side so
// an inline pill click can't bypass it: requires name + logoUrl
// when flipping ON.
export async function togglePartnerPublished(
  id: number,
  nextPublished: boolean,
): Promise<{ ok: true } | { ok: false; error: string }> {
  await requireAdmin();

  if (nextPublished) {
    const [row] = await db
      .select({
        name: partners.name,
        logoUrl: partners.logoUrl,
        showInLogoStrip: partners.showInLogoStrip,
        logoUsageApprovedAt: partners.logoUsageApprovedAt,
        logoUsageApprovedBy: partners.logoUsageApprovedBy,
        logoUsageScope: partners.logoUsageScope,
      })
      .from(partners)
      .where(eq(partners.id, id))
      .limit(1);
    if (!row) {
      return { ok: false, error: "Partner nem található." };
    }
    const guardError = validatePublishGuard(row.name, row.logoUrl, true);
    if (guardError) return { ok: false, error: guardError };
    const logoStripGuardError = validateLogoStripGuard({
      showInLogoStrip: row.showInLogoStrip,
      logoUrl: row.logoUrl,
      logoUsageApprovedAt: row.logoUsageApprovedAt,
      logoUsageApprovedBy: row.logoUsageApprovedBy,
      logoUsageScope: row.logoUsageScope,
    });
    if (logoStripGuardError) return { ok: false, error: logoStripGuardError };
  }

  try {
    const [updated] = await db
      .update(partners)
      .set({ isPublished: nextPublished, updatedAt: new Date() })
      .where(eq(partners.id, id))
      .returning({ id: partners.id });
    if (!updated) {
      return { ok: false, error: "Partner nem található." };
    }
    revalidatePartnerSurfaces(id);
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: safeActionError(
        "togglePartnerPublished",
        err,
        nextPublished
          ? "Publikálás sikertelen."
          : "A publikálás visszavonása sikertelen.",
      ),
    };
  }
}

// ── permanent hard delete ─────────────────────────────────────────────

// Permanent hard delete. Distinct from isActive=false (soft-hide).
// Partners has no children in the schema, so a single DELETE is
// sufficient. .returning({id}) defense-in-depth surfaces a friendly
// error if the row vanished between modal-open and confirm-click.
//
// Blob orphaning: the partner's logoUrl (Vercel Blob asset) is NOT
// deleted by this action — same convention as News/Services delete.
// Blob cleanup is a Phase 4 polish item (would need to extract the
// blob path from the URL and call @vercel/blob's delete API in a
// best-effort try/catch).
export async function deletePartner(
  id: number,
): Promise<{ ok: true } | { ok: false; error: string }> {
  await requireAdmin();

  try {
    const [deleted] = await db
      .delete(partners)
      .where(eq(partners.id, id))
      .returning({ id: partners.id });
    if (!deleted) {
      return { ok: false, error: "Partner nem található." };
    }
    revalidatePartnerSurfaces(id);
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: safeActionError("deletePartner", err, "Törlés sikertelen."),
    };
  }
}

// ── reorder active partners ──────────────────────────────────────────

// ATOMIC reorder via Neon's HTTP non-interactive transaction (same
// pattern as reorderPositions). All UPDATEs run as a single batched
// HTTP request that Postgres commits or rolls back as a unit —
// partial failure can't leave a half-renumbered set.
//
// Validates the input set against the live active rows BEFORE any
// write: shape, dedup, set-equality. Stale input from a tab opened
// before someone else inactivated/deleted a row gets a friendly
// "frissítsd az oldalt" error rather than a silent no-op.
//
// The `AND is_active = true` guard inside each UPDATE is defense-
// in-depth against TOCTOU: if a row is inactivated between the
// set-equality check and the transaction commit, that row's UPDATE
// silently no-ops on 0 rows.
export async function reorderPartners(
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
    .select({ id: partners.id })
    .from(partners)
    .where(eq(partners.isActive, true));
  const activeIds = new Set(activeRows.map((r) => r.id));

  if (
    activeIds.size !== inputIds.size ||
    ![...inputIds].every((id) => activeIds.has(id))
  ) {
    return {
      ok: false,
      error:
        "A sorrend nem egyezik az aktív partnerek listájával. Frissítsd az oldalt.",
    };
  }

  try {
    await neonSql.transaction(
      orderedIds.map(
        (id, index) =>
          neonSql`UPDATE partners SET sort_order = ${index}, updated_at = NOW() WHERE id = ${id} AND is_active = true`,
      ),
    );
    revalidatePartnerSurfaces();
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: safeActionError(
        "reorderPartners",
        err,
        "A sorrend mentése sikertelen.",
      ),
    };
  }
}

