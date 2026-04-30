// One-shot UPDATE script for the positions table.
//
// Bridges the gap for already-seeded databases: after migration
// 0003_localize_positions adds the _en/_de/_zh columns with empty-string
// defaults, this script populates the 3 new locales for the 4 known
// seed-time positions. Existing _hu values are preserved as-is.
//
// Run order:
//   1. Apply migration:    npm run db:migrate    (or via Neon SQL editor)
//   2. Populate locales:   npm run db:update-positions
//   3. Verify:             SELECT title_hu, title_en FROM positions;
//
// Match strategy: WHERE title_hu = '<original HU title>' for each row.
// If the HU title was changed by an admin, the corresponding UPDATE
// becomes a no-op — re-run after re-aligning HU title, or run the
// UPDATEs manually in the Neon SQL editor.
//
// Source-of-truth for translations: scripts/seed.ts — keep this file in
// sync when seed translations change.

import "./load-env";
import { eq } from "drizzle-orm";
import { db, positions } from "../lib/db";

type LocalizedRow = {
  matchTitleHu: string;
  titleEn: string;
  titleDe: string;
  titleZh: string;
  locationEn: string;
  locationDe: string;
  locationZh: string;
  typeEn: string;
  typeDe: string;
  typeZh: string;
};

const ROWS: LocalizedRow[] = [
  {
    matchTitleHu: "Biztonsági őr",
    titleEn: "Security Guard",
    titleDe: "Sicherheitsmitarbeiter",
    titleZh: "保安员",
    locationEn: "Budapest, regional",
    locationDe: "Budapest, Land",
    locationZh: "布达佩斯及周边",
    typeEn: "Full-time",
    typeDe: "Vollzeit",
    typeZh: "全职",
  },
  {
    matchTitleHu: "Takarítási csoportvezető",
    titleEn: "Cleaning Team Leader",
    titleDe: "Reinigungs-Teamleiter",
    titleZh: "清洁主管",
    locationEn: "Budapest",
    locationDe: "Budapest",
    locationZh: "布达佩斯",
    typeEn: "Full-time",
    typeDe: "Vollzeit",
    typeZh: "全职",
  },
  {
    matchTitleHu: "Épületüzemeltetési mérnök",
    titleEn: "Facility Management Engineer",
    titleDe: "Facility-Management-Ingenieur",
    titleZh: "设施管理工程师",
    locationEn: "Budapest",
    locationDe: "Budapest",
    locationZh: "布达佩斯",
    typeEn: "Full-time",
    typeDe: "Vollzeit",
    typeZh: "全职",
  },
  {
    matchTitleHu: "Recepcióvezető",
    titleEn: "Reception Manager",
    titleDe: "Empfangsleiter",
    titleZh: "接待主管",
    locationEn: "Budapest",
    locationDe: "Budapest",
    locationZh: "布达佩斯",
    typeEn: "Full-time",
    typeDe: "Vollzeit",
    typeZh: "全职",
  },
];

async function main() {
  console.log("--- Updating positions with _en/_de/_zh translations ---");

  let totalUpdated = 0;
  let totalSkipped = 0;

  for (const r of ROWS) {
    const result = await db
      .update(positions)
      .set({
        titleEn: r.titleEn,
        titleDe: r.titleDe,
        titleZh: r.titleZh,
        locationEn: r.locationEn,
        locationDe: r.locationDe,
        locationZh: r.locationZh,
        typeEn: r.typeEn,
        typeDe: r.typeDe,
        typeZh: r.typeZh,
        updatedAt: new Date(),
      })
      .where(eq(positions.titleHu, r.matchTitleHu))
      .returning({ id: positions.id });

    if (result.length === 0) {
      console.warn(
        `  SKIP — no row matched title_hu = "${r.matchTitleHu}"`,
      );
      totalSkipped++;
    } else {
      console.log(`  ✓ updated id=${result[0].id} (${r.matchTitleHu})`);
      totalUpdated++;
    }
  }

  // Verification SELECT
  console.log("\n--- Verification ---");
  const all = await db
    .select({
      id: positions.id,
      titleHu: positions.titleHu,
      titleEn: positions.titleEn,
      titleDe: positions.titleDe,
      titleZh: positions.titleZh,
    })
    .from(positions);
  console.table(all);

  console.log(
    `\nDone — updated ${totalUpdated} row(s), skipped ${totalSkipped} row(s).`,
  );

  if (totalSkipped > 0) {
    console.error(
      `\nWARNING: ${totalSkipped} expected rows were not matched. Inspect the table and either re-align HU titles or run UPDATEs manually.`,
    );
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
