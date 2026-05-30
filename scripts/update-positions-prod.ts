// Guarded one-shot updater for position EN/DE/ZH localization fields.
//
// Usage:
//   npm run db:update-positions          # staging dry-run
//   npm run db:update-positions:apply    # staging write
//   npm run db:update-positions:prod     # production dry-run, requires prod target guard
//
// Safety:
//   - defaults to dry-run;
//   - staging is the default target;
//   - production requires --target production --allow-production;
//   - the runtime DB target guard runs before SELECT/UPDATE;
//   - never prints the full DATABASE_URL;
//   - matches only the four known seed-time HU position titles;
//   - writes only title/location/type EN/DE/ZH fields plus updatedAt.

import "./load-env";
import { eq } from "drizzle-orm";
import { ensureDbTarget, readDbTargetArgs } from "./ensure-staging-db";
import { db, positions } from "../lib/db";

const SCRIPT_NAME = "update-positions-prod";

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

type PositionUpdateField = Exclude<keyof LocalizedRow, "matchTitleHu">;
type PositionUpdate = Pick<LocalizedRow, PositionUpdateField>;

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

function hasArg(name: string): boolean {
  return process.argv.includes(name);
}

function usageAndExit(message: string): never {
  console.error(`${SCRIPT_NAME}: ${message}`);
  console.error(
    [
      "",
      "Usage:",
      "  tsx scripts/update-positions-prod.ts --dry-run",
      "  tsx scripts/update-positions-prod.ts --apply",
      "  tsx scripts/update-positions-prod.ts --target production --allow-production --dry-run",
      "  tsx scripts/update-positions-prod.ts --target production --allow-production --apply",
      "",
      "If neither --dry-run nor --apply is supplied, the script defaults to dry-run.",
    ].join("\n"),
  );
  process.exit(1);
}

function updatePayload(row: LocalizedRow): PositionUpdate {
  return {
    titleEn: row.titleEn,
    titleDe: row.titleDe,
    titleZh: row.titleZh,
    locationEn: row.locationEn,
    locationDe: row.locationDe,
    locationZh: row.locationZh,
    typeEn: row.typeEn,
    typeDe: row.typeDe,
    typeZh: row.typeZh,
  };
}

function sameValue(left: unknown, right: unknown): boolean {
  return JSON.stringify(left ?? null) === JSON.stringify(right ?? null);
}

async function main(): Promise<void> {
  const explicitDryRun = hasArg("--dry-run");
  const isApply = hasArg("--apply");

  if (explicitDryRun && isApply) {
    usageAndExit("use only one of --dry-run or --apply");
  }

  const isDryRun = !isApply;
  const { target, allowProduction } = readDbTargetArgs();

  console.log(`--- ${SCRIPT_NAME} ${isDryRun ? "DRY-RUN" : "APPLY"} start ---`);
  ensureDbTarget({ scriptName: SCRIPT_NAME, isDryRun, target, allowProduction });

  let matchedRows = 0;
  let missingRows = 0;
  let changedRows = 0;
  let changedFields = 0;

  for (const expected of ROWS) {
    const matches = await db
      .select()
      .from(positions)
      .where(eq(positions.titleHu, expected.matchTitleHu));

    if (matches.length === 0) {
      missingRows += 1;
      console.warn(`\n${expected.matchTitleHu}`);
      console.warn("  status: missing; no row matched titleHu");
      continue;
    }

    if (matches.length > 1) {
      usageAndExit(`duplicate positions found for titleHu="${expected.matchTitleHu}"`);
    }

    matchedRows += 1;
    const [current] = matches;
    const update = updatePayload(expected);
    const changed = Object.entries(update).filter(([field, after]) => {
      const before = current[field as keyof typeof current];
      return !sameValue(before, after);
    });

    if (changed.length > 0) changedRows += 1;
    changedFields += changed.length;

    console.log(`\n${expected.matchTitleHu} (id=${current.id})`);
    console.log(`  changed fields: ${changed.length > 0 ? changed.map(([field]) => field).join(", ") : "(none)"}`);

    for (const [field, after] of Object.entries(update)) {
      const before = current[field as keyof typeof current];
      const marker = sameValue(before, after) ? "=" : "~";
      console.log(`  ${marker} ${field}`);
      console.log(`      from: ${before ?? "(null)"}`);
      console.log(`      to:   ${after}`);
    }

    if (isApply && changed.length > 0) {
      await db
        .update(positions)
        .set({ ...update, updatedAt: new Date() })
        .where(eq(positions.id, current.id));
      console.log("  applied: yes");
    } else if (isApply) {
      console.log("  applied: no changes");
    }
  }

  console.log("");
  console.log(`Matched rows: ${matchedRows}`);
  console.log(`Missing rows: ${missingRows}`);
  console.log(`Planned changes: ${changedRows} row(s), ${changedFields} field(s).`);

  if (missingRows > 0) {
    usageAndExit(`${missingRows} expected position row(s) were not matched`);
  }

  if (isDryRun) {
    console.log("Dry run only. No database rows were updated.");
  } else {
    console.log("Apply complete. Only targeted position localization fields were written.");
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`${SCRIPT_NAME}: failed: ${message}`);
  process.exit(1);
});
