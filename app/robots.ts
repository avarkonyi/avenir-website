import type { MetadataRoute } from "next";
import { SEO_DATA } from "@/lib/seo-data";

export default function robots(): MetadataRoute.Robots {
  // AI search bots are explicitly Allow-listed for B2B AI-search visibility.
  // Flip any of these to disallow: "/" if AI training opt-out becomes desired.
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "CCBot", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "anthropic-ai", allow: "/" },
    ],
    sitemap: `${SEO_DATA.url}/sitemap.xml`,
  };
}
