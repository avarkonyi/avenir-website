// Content completeness does not itself grant a language publication approval.
// Keep sitemap and metadata on the same explicit release policy.
export const INDEXABLE_SERVICE_LOCALES = ["hu", "en"] as const;

export function isIndexableServiceLocale(locale: string): boolean {
  return (INDEXABLE_SERVICE_LOCALES as readonly string[]).includes(locale);
}

export function indexableServiceLocales<T extends string>(locales: readonly T[]): T[] {
  return locales.filter(isIndexableServiceLocale);
}
