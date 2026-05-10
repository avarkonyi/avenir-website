export const READY_HU_SERVICE_DETAIL_SLUGS = [
  "objektumorzes",
  "portaszolgalat",
  "biztonsagtechnika",
  "tavfelugyelet-vonuloszolgalat",
  "mystery-shopping-helyszini-audit",
  "rendezvenybiztositas",
  "hard-fm",
  "soft-fm",
] as const;

const READY_HU_SERVICE_DETAIL_SLUG_SET = new Set<string>(
  READY_HU_SERVICE_DETAIL_SLUGS,
);

export function getReadyHuServiceDetailHref(
  locale: string,
  slug: string,
): string | null {
  if (locale !== "hu") return null;
  if (!READY_HU_SERVICE_DETAIL_SLUG_SET.has(slug)) return null;

  return `/hu/szolgaltatasok/${slug}`;
}
