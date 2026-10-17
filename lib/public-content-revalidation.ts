import { NEWS_PUBLIC_LOCALES, newsDetailHref, newsIndexPath } from "./news-routing";

export function publicNewsRevalidationPaths(
  slugs: readonly (string | null | undefined)[] = [],
): string[] {
  const paths = new Set<string>(["/sitemap.xml"]);
  for (const locale of NEWS_PUBLIC_LOCALES) {
    paths.add(`/${locale}`);
    paths.add(newsIndexPath(locale));
    for (const slug of slugs) {
      if (slug?.trim()) paths.add(newsDetailHref(locale, slug.trim()));
    }
  }
  return [...paths];
}
