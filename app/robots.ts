import type { MetadataRoute } from "next";
import { SEO_DATA } from "@/lib/seo-data";

export default function robots(): MetadataRoute.Robots {
  if (process.env.VERCEL_ENV !== "production") {
    return {
      rules: [
        {
          userAgent: "*",
          disallow: "/",
        },
      ],
    };
  }

  // Keep crawl policy simple for launch: public pages are crawlable,
  // operational surfaces are not. Do not disallow /_next; crawlers and
  // preview renderers need CSS/JS/assets to render the page correctly.
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api"],
      },
    ],
    sitemap: `${SEO_DATA.url}/sitemap.xml`,
  };
}
