import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { SEO_DATA } from "@/lib/seo-data";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default async function Icon() {
  const fontData = await readFile(
    join(process.cwd(), "assets/fonts/BarlowCondensed-Bold.ttf"),
  );
  return new ImageResponse(
    (
      <div
        style={{
          background: SEO_DATA.brandRed,
          color: "#fff",
          fontSize: 26,
          fontWeight: 700,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Barlow Condensed",
        }}
      >
        A
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
