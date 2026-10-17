import type { PublishedServicePath } from "@/lib/db/queries/services";
import { isIndexableServiceLocale } from "./publication";
import { DE_REVIEW_SERVICE_PATHS, getDeReviewServiceDetailBySlug, getDeReviewServiceDetailSharedCopy } from "./de-service-details";
import { FR_REVIEW_SERVICE_PATHS, getFrReviewServiceDetailBySlug, getFrReviewServiceDetailSharedCopy } from "./fr-service-details";
import { KO_REVIEW_SERVICE_PATHS, getKoReviewServiceDetailBySlug, getKoReviewServiceDetailSharedCopy } from "./ko-service-details";
import { ZH_REVIEW_SERVICE_PATHS, getZhReviewServiceDetailBySlug, getZhReviewServiceDetailSharedCopy } from "./zh-service-details";

export function getReviewServiceDetail(locale: string, slug: string) {
  switch (locale) {
    case "de": return getDeReviewServiceDetailBySlug(slug);
    case "fr": return getFrReviewServiceDetailBySlug(slug);
    case "ko": return getKoReviewServiceDetailBySlug(slug);
    case "zh": return getZhReviewServiceDetailBySlug(slug);
    default: return null;
  }
}

export function getReviewServiceSharedCopy(locale: string) {
  switch (locale) {
    case "de": return getDeReviewServiceDetailSharedCopy();
    case "fr": return getFrReviewServiceDetailSharedCopy();
    case "ko": return getKoReviewServiceDetailSharedCopy();
    case "zh": return getZhReviewServiceDetailSharedCopy();
    default: return null;
  }
}

// Source translations remain noindex review pages. Removing/unpublishing a CMS
// service removes its translated routes and links too, including source copies.
export function getRenderableServicePaths(publishedPaths: readonly PublishedServicePath[]): PublishedServicePath[] {
  const released = publishedPaths.filter(p => isIndexableServiceLocale(p.locale));
  const activeSlugs = new Set(released.map(p => p.slug));
  const reviews = [...DE_REVIEW_SERVICE_PATHS, ...FR_REVIEW_SERVICE_PATHS, ...KO_REVIEW_SERVICE_PATHS, ...ZH_REVIEW_SERVICE_PATHS]
    .filter(p => activeSlugs.has(p.slug));
  return [...released, ...reviews];
}
