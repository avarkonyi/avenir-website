import { NEWS_PUBLIC_LOCALES, newsDetailHref, newsIndexPath } from "./news-routing";

type RevalidatePath = (path: string, type?: "layout" | "page") => void;

/** Refresh shared schema and every localized page, including footer/related links. */
export function revalidatePublicContent(
  revalidatePath: RevalidatePath,
  { sitemap = false }: { sitemap?: boolean } = {},
): void {
  revalidatePath("/[locale]", "layout");
  if (sitemap) revalidatePath("/sitemap.xml");
}

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
