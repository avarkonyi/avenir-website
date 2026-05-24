export function getSafePublicImageSrc(
  imageUrl: string | null | undefined,
): string | null {
  const src = imageUrl?.trim();
  if (!src) return null;

  if (src.startsWith("/") && !src.startsWith("//")) {
    return src;
  }

  try {
    const url = new URL(src);
    if (
      url.protocol === "https:" &&
      url.hostname.endsWith(".public.blob.vercel-storage.com")
    ) {
      return url.toString();
    }
  } catch {
    return null;
  }

  return null;
}

export function getSafeAbsolutePublicImageUrl(
  imageUrl: string | null | undefined,
  baseUrl: string,
): string | null {
  const safeSrc = getSafePublicImageSrc(imageUrl);
  return safeSrc ? new URL(safeSrc, baseUrl).toString() : null;
}
