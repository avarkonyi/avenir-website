type ReadyServiceDetailPath = {
  readonly locale: string;
  readonly slug: string;
};

export function getReadyServiceDetailHref({
  locale,
  slug,
  readyServiceDetailPaths,
}: {
  locale: string;
  slug: string;
  readyServiceDetailPaths: readonly ReadyServiceDetailPath[];
}): string | null {
  const isReady = readyServiceDetailPaths.some(
    (path) => path.locale === locale && path.slug === slug,
  );

  if (!isReady) return null;

  return `/${locale}/szolgaltatasok/${slug}`;
}
