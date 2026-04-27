// One-shot image converter for public/uploads/background.png → .webp.
// Kept as a reusable ad-hoc tool for future hero / asset optimization
// passes. Run with:
//
//   node scripts/convert-bg-webp.mjs
//
// Quality 80 is the photo-content sweet spot for WebP (visually
// transparent vs source PNG, ~6× compression typical). Adjust if
// downstream visual review needs higher fidelity.
//
// `sharp` is bundled with Next.js as the next/image runtime
// dependency, so no extra `npm install` is needed in this project.

import sharp from "sharp";

const SRC = "public/uploads/background.png";
const OUT = "public/uploads/background.webp";
const QUALITY = 80;

const info = await sharp(SRC).webp({ quality: QUALITY }).toFile(OUT);

console.log(
  `${SRC} → ${OUT} (${info.width}×${info.height}, ` +
    `${(info.size / 1024).toFixed(1)} KB, quality ${QUALITY})`,
);
