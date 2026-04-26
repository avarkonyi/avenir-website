import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getTranslation } from "@/lib/i18n";
import { SEO_DATA } from "@/lib/seo-data";

export const alt = "Avenir Facility Management";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = getTranslation(locale);
  const fontData = await readFile(
    join(process.cwd(), "assets/fonts/BarlowCondensed-Bold.ttf"),
  );
  return new ImageResponse(
    (
      <div
        style={{
          background: SEO_DATA.themeColor,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px 100px",
          color: "#fff",
          fontFamily: "Barlow Condensed",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 36,
          }}
        >
          <div
            style={{
              width: 6,
              height: 64,
              background: SEO_DATA.brandRed,
            }}
          />
          <div
            style={{
              fontSize: 30,
              color: SEO_DATA.brandRed,
              letterSpacing: 4,
              fontWeight: 700,
            }}
          >
            AVENIR FACILITY MANAGEMENT
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0 18px",
            fontSize: 92,
            fontWeight: 700,
            lineHeight: 1.05,
            maxWidth: 980,
          }}
        >
          <span>{t.hero.h1a}</span>
          <span style={{ color: SEO_DATA.brandRed }}>{t.hero.h1b}</span>
        </div>
        <div
          style={{
            fontSize: 28,
            color: "rgba(255,255,255,0.78)",
            marginTop: 36,
            maxWidth: 980,
            lineHeight: 1.45,
          }}
        >
          {t.hero.sub.length > 180 ? `${t.hero.sub.slice(0, 177)}…` : t.hero.sub}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Barlow Condensed",
          data: fontData,
          weight: 700,
          style: "normal",
        },
      ],
    },
  );
}
