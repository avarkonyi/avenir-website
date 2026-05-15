// Transliterates a string into an ASCII URL slug.
//
// Rules:
// - Hungarian accented characters become their unaccented equivalents
// - All other non-alphanumeric characters become hyphens
// - Result is lowercase, with no leading/trailing hyphens
//
// Examples:
//   slugify("Megújult weboldal")
//     → "megujult-weboldal"
//   slugify("Ipari és logisztikai parkok")
//     → "ipari-es-logisztikai-parkok"
//   slugify("teszt-partner-hir")
//     → "teszt-partner-hir"  (idempotent on already-slug input)

const HU_MAP: Record<string, string> = {
  á: "a", é: "e", í: "i", ó: "o", ö: "o", ő: "o",
  ú: "u", ü: "u", ű: "u",
  Á: "a", É: "e", Í: "i", Ó: "o", Ö: "o", Ő: "o",
  Ú: "u", Ü: "u", Ű: "u",
};

export function slugify(input: string): string {
  return input
    .split("")
    .map((c) => HU_MAP[c] ?? c)
    .join("")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
