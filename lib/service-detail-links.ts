export function getReadyHuServiceDetailHref(
  locale: string,
  slug: string,
  readyHuServiceDetailSlugs: readonly string[],
): string | null {
  if (locale !== "hu") return null;
  if (!readyHuServiceDetailSlugs.includes(slug)) return null;

  return `/hu/szolgaltatasok/${slug}`;
}
