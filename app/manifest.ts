import type { MetadataRoute } from "next";
import { SEO_DATA } from "@/lib/seo-data";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SEO_DATA.legalNameShort,
    short_name: SEO_DATA.shortName,
    description:
      "Komplex épületüzemeltetés és vagyonvédelem Magyarországon. 200+ szakembergárda, 30+ aktív helyszín, 24/7 diszpécseri készenlét.",
    start_url: "/",
    display: "standalone",
    background_color: SEO_DATA.backgroundColor,
    theme_color: SEO_DATA.themeColor,
    icons: [
      { src: "/icon", sizes: "32x32", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
