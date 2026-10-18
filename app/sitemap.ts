import type { MetadataRoute } from "next";
import { getAllPublishedServicePathsForBuild } from "@/lib/db/queries/services";
import { getAllIndexablePublishedNewsPathsForSitemap } from "@/lib/db/queries/news";
import { buildPublicSitemap } from "@/lib/public-sitemap";

// CMS mutations invalidate this route immediately; scheduled news also appears
// on the next hourly regeneration without requiring a new deployment.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, news] = await Promise.all([
    getAllPublishedServicePathsForBuild("sitemap.xml"),
    getAllIndexablePublishedNewsPathsForSitemap(),
  ]);
  return buildPublicSitemap(services, news);
}
