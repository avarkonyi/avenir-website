"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db, neonSql, certifications } from "@/lib/db";
import { safeActionError } from "@/lib/admin/safe-action-error";
import { slugify } from "@/lib/slugify";

// Server actions for the Certifications CRUD module. Auth check
// happens inside each function — middleware gates /admin/* but
// server actions are also reachable via direct POST to the action
// URL, so a defense-in-depth check is mandatory.
//
// Result-object shape matches the rest of the admin (News, Services,
// Positions, Partners): actions never call redirect(); the client
// shows a toast and routes via router.push/refresh.
//
// Slug semantics (consistent with Partners): auto-derived from
// `name` on CREATE only with a `-2`/`-3`/… collision-suffix. NOT
// editable post-create, NOT auto-updated when name changes. Slug
// is an internal stable identifier; the public renderer addresses
// rows by id, not slug.
//
// Publish guard (application-layer, per Iter 6A spec): rejects
// `isPublished = true` unless name + fullNameHu + descriptionHu +
// pdfUrl are all present. Future Iter 6B public renderer must still
// defensively filter `is_active AND is_published AND pdf_url IS NOT
// NULL` regardless.
//
// URL validation: issuerUrl and verifyUrl are nullable; non-empty
// values must parse via `new URL(value)` AND `protocol === "https:"`.
// Same pattern as partners.websiteUrl. NAH and IAF MLA registries
// (the typical verify-url targets) are HTTPS, so this is safe.

export type CertificationPayload = {
  name: string;
  standardCode: string;
  certificateNumber: string;

  fullNameHu: string;
  fullNameEn: string;
  fullNameDe: string;
  fullNameZh: string;

  descriptionHu: string;
  descriptionEn: string;
  descriptionDe: string;
  descriptionZh: string;

  scopeHu: string;
  scopeEn: string;
  scopeDe: string;
  scopeZh: string;

  issuer: string;
  issuerUrl: string;
  accreditationBody: string;
  accreditationNumber: string;
  iafMlaMember: boolean;
  verifyUrl: string;

  // ISO date strings (YYYY-MM-DD) from <input type="date">. Empty
  // string means "no date set"; the action normalizes to null.
  issuedDate: string;
  expiresDate: string;

  credentialCategory: string;

  logoUrl: string | null;
  pdfUrl: string | null;

  sortOrder: number;
  active: boolean;
  isPublished: boolean;
};

export type CreateCertificationResult =
  | { ok: true; id: number }
  | { ok: false; error: string };

export type UpdateCertificationResult =
  | { ok: true }
  | { ok: false; error: string };

async function requireAdmin(): Promise<string> {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }
  return session.user.email;
}

// Auto-derive a unique slug from `name`, suffixing `-2`/`-3`/… on
// collision. Mirrors partners.uniqueSlugFromName but clamps to
// certifications.slug = varchar(50) at suffix-fit time.
const SLUG_MAX = 50;

async function uniqueSlugFromName(name: string): Promise<string> {
  const base = slugify(name).slice(0, SLUG_MAX);
  if (!base) {
    throw new Error(
      "A névből nem generálható érvényes slug. Használj betűket vagy számokat.",
    );
  }

  const first = await db
    .select({ id: certifications.id })
    .from(certifications)
    .where(eq(certifications.slug, base))
    .limit(1);
  if (first.length === 0) return base;

  let counter = 2;
  while (true) {
    const suffix = `-${counter}`;
    const maxBase = SLUG_MAX - suffix.length;
    const candidate = `${base.slice(0, maxBase)}${suffix}`;

    const existing = await db
      .select({ id: certifications.id })
      .from(certifications)
      .where(eq(certifications.slug, candidate))
      .limit(1);
    if (existing.length === 0) return candidate;
    counter += 1;
  }
}

// Empty/whitespace-only strings collapse to null (for nullable
// columns). Trims trailing/leading whitespace.
function normNullable(value: string): string | null {
  const trimmed = value.trim();
  return trimmed.length === 0 ? null : trimmed;
}

// Date input: empty string → null, otherwise pass through (the
// browser <input type="date"> already constrains to YYYY-MM-DD;
// Drizzle date columns accept ISO date strings).
function normDate(value: string): string | null {
  const trimmed = value.trim();
  return trimmed.length === 0 ? null : trimmed;
}

// HTTPS-only URL validation. Empty → null. Non-empty must parse
// AND use https: protocol. Throws a friendly Hungarian error
// when the value is non-empty but unparseable or non-HTTPS.
function resolveHttpsUrl(raw: string, fieldLabel: string): string | null {
  const trimmed = raw.trim();
  if (trimmed.length === 0) return null;
  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    throw new Error(
      `Érvénytelen ${fieldLabel}: "${trimmed}". Add meg a teljes URL-t (https://…).`,
    );
  }
  if (parsed.protocol !== "https:") {
    throw new Error(
      `A ${fieldLabel} mezőnek HTTPS protokollt kell használnia (https://…).`,
    );
  }
  return trimmed;
}

// Application-layer publish guard: name + fullNameHu +
// descriptionHu + pdfUrl all required when isPublished=true.
function validatePublishGuard(
  name: string,
  fullNameHu: string,
  descriptionHu: string,
  pdfUrl: string | null,
  isPublished: boolean,
): string | null {
  if (!isPublished) return null;
  if (
    name.trim().length === 0 ||
    fullNameHu.trim().length === 0 ||
    descriptionHu.trim().length === 0 ||
    pdfUrl === null ||
    pdfUrl.length === 0
  ) {
    return "Publikáláshoz név, magyar teljes cím, magyar leírás és PDF kötelező.";
  }
  return null;
}

// Validates required NOT-NULL fields (name + 4 fullName locales +
// issuer). Returns the first error message, or null if OK.
function validateRequired(payload: CertificationPayload): string | null {
  const required: Array<[string, string]> = [
    [payload.name, "A rövid név (pl. ISO 9001) kötelező."],
    [payload.fullNameHu, "A magyar teljes cím kötelező."],
    [payload.fullNameEn, "Az angol teljes cím kötelező."],
    [payload.fullNameDe, "A német teljes cím kötelező."],
    [payload.fullNameZh, "A kínai teljes cím kötelező."],
    [payload.issuer, "A kiállító (issuer) kötelező."],
  ];
  for (const [value, message] of required) {
    if (value.trim().length === 0) return message;
  }
  if (!Number.isInteger(payload.sortOrder) || payload.sortOrder < 0) {
    return "A sorrend nem-negatív egész szám kell legyen.";
  }
  return null;
}

// ── CRUD ────────────────────────────────────────────────────────────────

export async function createCertification(
  payload: CertificationPayload,
): Promise<CreateCertificationResult> {
  await requireAdmin();

  const reqError = validateRequired(payload);
  if (reqError) return { ok: false, error: reqError };

  const guardError = validatePublishGuard(
    payload.name,
    payload.fullNameHu,
    payload.descriptionHu,
    payload.pdfUrl,
    payload.isPublished,
  );
  if (guardError) return { ok: false, error: guardError };

  let issuerUrl: string | null;
  let verifyUrl: string | null;
  try {
    issuerUrl = resolveHttpsUrl(payload.issuerUrl, "kiállító URL");
    verifyUrl = resolveHttpsUrl(payload.verifyUrl, "ellenőrző URL");
  } catch {
    return {
      ok: false,
      error: "Érvénytelen URL.",
    };
  }

  try {
    const slug = await uniqueSlugFromName(payload.name);
    const [created] = await db
      .insert(certifications)
      .values({
        slug,
        name: payload.name.trim(),
        standardCode: normNullable(payload.standardCode),
        certificateNumber: normNullable(payload.certificateNumber),

        fullNameHu: payload.fullNameHu.trim(),
        fullNameEn: payload.fullNameEn.trim(),
        fullNameDe: payload.fullNameDe.trim(),
        fullNameZh: payload.fullNameZh.trim(),

        descriptionHu: normNullable(payload.descriptionHu),
        descriptionEn: normNullable(payload.descriptionEn),
        descriptionDe: normNullable(payload.descriptionDe),
        descriptionZh: normNullable(payload.descriptionZh),

        scopeHu: normNullable(payload.scopeHu),
        scopeEn: normNullable(payload.scopeEn),
        scopeDe: normNullable(payload.scopeDe),
        scopeZh: normNullable(payload.scopeZh),

        issuer: payload.issuer.trim(),
        issuerUrl,
        accreditationBody: normNullable(payload.accreditationBody),
        accreditationNumber: normNullable(payload.accreditationNumber),
        iafMlaMember: payload.iafMlaMember,
        verifyUrl,

        issuedDate: normDate(payload.issuedDate),
        expiresDate: normDate(payload.expiresDate),

        credentialCategory: normNullable(payload.credentialCategory),

        logoUrl: payload.logoUrl,
        pdfUrl: payload.pdfUrl,

        sortOrder: Math.trunc(payload.sortOrder),
        active: payload.active,
        isPublished: payload.isPublished,
      })
      .returning({ id: certifications.id });
    revalidatePath("/admin/certifications");
    return { ok: true, id: created.id };
  } catch (err) {
    return {
      ok: false,
      error: safeActionError(
        "createCertification",
        err,
        "A tanúsítvány mentése sikertelen.",
      ),
    };
  }
}

// updateCertification does NOT touch slug — slug is set on create
// and stays stable for the lifetime of the row (consistent with
// Partners). Renaming the cert does not regenerate the slug.
export async function updateCertification(
  id: number,
  payload: CertificationPayload,
): Promise<UpdateCertificationResult> {
  await requireAdmin();

  const reqError = validateRequired(payload);
  if (reqError) return { ok: false, error: reqError };

  const guardError = validatePublishGuard(
    payload.name,
    payload.fullNameHu,
    payload.descriptionHu,
    payload.pdfUrl,
    payload.isPublished,
  );
  if (guardError) return { ok: false, error: guardError };

  let issuerUrl: string | null;
  let verifyUrl: string | null;
  try {
    issuerUrl = resolveHttpsUrl(payload.issuerUrl, "kiállító URL");
    verifyUrl = resolveHttpsUrl(payload.verifyUrl, "ellenőrző URL");
  } catch {
    return {
      ok: false,
      error: "Érvénytelen URL.",
    };
  }

  try {
    const [updated] = await db
      .update(certifications)
      .set({
        name: payload.name.trim(),
        standardCode: normNullable(payload.standardCode),
        certificateNumber: normNullable(payload.certificateNumber),

        fullNameHu: payload.fullNameHu.trim(),
        fullNameEn: payload.fullNameEn.trim(),
        fullNameDe: payload.fullNameDe.trim(),
        fullNameZh: payload.fullNameZh.trim(),

        descriptionHu: normNullable(payload.descriptionHu),
        descriptionEn: normNullable(payload.descriptionEn),
        descriptionDe: normNullable(payload.descriptionDe),
        descriptionZh: normNullable(payload.descriptionZh),

        scopeHu: normNullable(payload.scopeHu),
        scopeEn: normNullable(payload.scopeEn),
        scopeDe: normNullable(payload.scopeDe),
        scopeZh: normNullable(payload.scopeZh),

        issuer: payload.issuer.trim(),
        issuerUrl,
        accreditationBody: normNullable(payload.accreditationBody),
        accreditationNumber: normNullable(payload.accreditationNumber),
        iafMlaMember: payload.iafMlaMember,
        verifyUrl,

        issuedDate: normDate(payload.issuedDate),
        expiresDate: normDate(payload.expiresDate),

        credentialCategory: normNullable(payload.credentialCategory),

        logoUrl: payload.logoUrl,
        pdfUrl: payload.pdfUrl,

        sortOrder: Math.trunc(payload.sortOrder),
        active: payload.active,
        isPublished: payload.isPublished,

        updatedAt: new Date(),
      })
      .where(eq(certifications.id, id))
      .returning({ id: certifications.id });
    if (!updated) {
      return { ok: false, error: "Tanúsítvány nem található." };
    }
    revalidatePath("/admin/certifications");
    revalidatePath(`/admin/certifications/${id}/edit`);
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: safeActionError(
        "updateCertification",
        err,
        "A tanúsítvány mentése sikertelen.",
      ),
    };
  }
}

// ── inline status toggles ─────────────────────────────────────────────

export async function toggleCertificationActive(
  id: number,
  nextActive: boolean,
): Promise<{ ok: true } | { ok: false; error: string }> {
  await requireAdmin();

  try {
    const [updated] = await db
      .update(certifications)
      .set({ active: nextActive, updatedAt: new Date() })
      .where(eq(certifications.id, id))
      .returning({ id: certifications.id });
    if (!updated) {
      return { ok: false, error: "Tanúsítvány nem található." };
    }
    revalidatePath("/admin/certifications");
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: safeActionError(
        "toggleCertificationActive",
        err,
        "A művelet sikertelen.",
      ),
    };
  }
}

// Re-applies the publish guard server-side so an inline pill click
// can't bypass it: requires name + fullNameHu + descriptionHu +
// pdfUrl when flipping ON.
export async function toggleCertificationPublished(
  id: number,
  nextPublished: boolean,
): Promise<{ ok: true } | { ok: false; error: string }> {
  await requireAdmin();

  if (nextPublished) {
    const [row] = await db
      .select({
        name: certifications.name,
        fullNameHu: certifications.fullNameHu,
        descriptionHu: certifications.descriptionHu,
        pdfUrl: certifications.pdfUrl,
      })
      .from(certifications)
      .where(eq(certifications.id, id))
      .limit(1);
    if (!row) {
      return { ok: false, error: "Tanúsítvány nem található." };
    }
    const guardError = validatePublishGuard(
      row.name,
      row.fullNameHu,
      row.descriptionHu ?? "",
      row.pdfUrl,
      true,
    );
    if (guardError) return { ok: false, error: guardError };
  }

  try {
    const [updated] = await db
      .update(certifications)
      .set({ isPublished: nextPublished, updatedAt: new Date() })
      .where(eq(certifications.id, id))
      .returning({ id: certifications.id });
    if (!updated) {
      return { ok: false, error: "Tanúsítvány nem található." };
    }
    revalidatePath("/admin/certifications");
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: safeActionError(
        "toggleCertificationPublished",
        err,
        nextPublished
          ? "Publikálás sikertelen."
          : "A publikálás visszavonása sikertelen.",
      ),
    };
  }
}

// ── permanent hard delete ─────────────────────────────────────────────

// Permanent hard delete. Distinct from active=false (soft-hide).
// Certifications has no children in the schema. .returning({id})
// defense-in-depth surfaces a friendly error if the row vanished
// between modal-open and confirm-click.
//
// Blob orphaning: the cert's logoUrl + pdfUrl are NOT deleted by
// this action — same convention as News/Services/Partners delete.
// Blob cleanup is a Phase 4 polish item.
export async function deleteCertification(
  id: number,
): Promise<{ ok: true } | { ok: false; error: string }> {
  await requireAdmin();

  try {
    const [deleted] = await db
      .delete(certifications)
      .where(eq(certifications.id, id))
      .returning({ id: certifications.id });
    if (!deleted) {
      return { ok: false, error: "Tanúsítvány nem található." };
    }
    revalidatePath("/admin/certifications");
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: safeActionError("deleteCertification", err, "Törlés sikertelen."),
    };
  }
}

// ── reorder active certifications ────────────────────────────────────

// ATOMIC reorder via Neon's HTTP non-interactive transaction (same
// pattern as reorderPartners / reorderPositions). All UPDATEs run
// as a single batched HTTP request that Postgres commits or rolls
// back as a unit.
//
// Validates the input set against the live active rows BEFORE any
// write: shape, dedup, set-equality. The `AND active = true` guard
// inside each UPDATE is defense-in-depth against TOCTOU.
export async function reorderCertifications(
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
    .select({ id: certifications.id })
    .from(certifications)
    .where(eq(certifications.active, true));
  const activeIds = new Set(activeRows.map((r) => r.id));

  if (
    activeIds.size !== inputIds.size ||
    ![...inputIds].every((id) => activeIds.has(id))
  ) {
    return {
      ok: false,
      error:
        "A sorrend nem egyezik az aktív tanúsítványok listájával. Frissítsd az oldalt.",
    };
  }

  try {
    await neonSql.transaction(
      orderedIds.map(
        (id, index) =>
          neonSql`UPDATE certifications SET sort_order = ${index}, updated_at = NOW() WHERE id = ${id} AND active = true`,
      ),
    );
    revalidatePath("/admin/certifications");
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: safeActionError(
        "reorderCertifications",
        err,
        "A sorrend mentése sikertelen.",
      ),
    };
  }
}
