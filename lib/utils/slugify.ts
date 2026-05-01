// Pure slugifier for the admin News form. Hungarian diacritics are mapped
// single-character (ő → o, NOT oe) so the output stays close to the
// readable Hungarian original. Output is then normalized to ASCII-safe
// kebab-case and clamped to the DB column length.
//
// Pure: safe to import in client components for the live "type the title,
// see the slug update" feedback. The DB-backed uniqueness check lives in
// the server action (app/admin/news/_actions.ts) so this file stays
// dependency-free.

const HU_DIACRITICS: Record<string, string> = {
  "á": "a", "é": "e", "í": "i", "ó": "o", "ú": "u",
  "ö": "o", "ő": "o", "ü": "u", "ű": "u",
  "Á": "A", "É": "E", "Í": "I", "Ó": "O", "Ú": "U",
  "Ö": "O", "Ő": "O", "Ü": "U", "Ű": "U",
};

// Matches the DB column: news.slug = varchar(120). Suffix dedup
// (`-2`, `-3`, …) MUST fit within the same limit, which the server-side
// uniqueSlug helper handles by shrinking the base before appending.
export const SLUG_MAX_LENGTH = 120;

// Fallback when the input is all special chars (emoji, punctuation, etc.)
// and would otherwise produce an empty slug.
export const FALLBACK_SLUG = "hir";

export function slugify(text: string): string {
  const result = text
    .split("")
    .map((c) => HU_DIACRITICS[c] ?? c)
    .join("")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, SLUG_MAX_LENGTH);

  return result || FALLBACK_SLUG;
}
