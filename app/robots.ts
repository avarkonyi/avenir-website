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

  const publicDisallow = ["/admin", "/api"];
  const aiSearchAgents = [
    "OAI-SearchBot",
    "ChatGPT-User",
    "GPTBot",
    "Claude-SearchBot",
    "Claude-User",
    "ClaudeBot",
    "PerplexityBot",
    "Perplexity-User",
  ];

  // Public pages are crawlable; operational surfaces are not. Do not
  // disallow /_next because crawlers and preview renderers need CSS,
  // JS and image assets to render the page correctly.
  //
  // AI-search/retrieval bots are listed explicitly so answer engines
  // receive an unambiguous allow signal while admin/API surfaces stay out.
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: publicDisallow,
      },
      ...aiSearchAgents.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: publicDisallow,
      })),
    ],
    sitemap: `${SEO_DATA.url}/sitemap.xml`,
  };
}
