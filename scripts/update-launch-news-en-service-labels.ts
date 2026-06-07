// Guarded updater for the EN launch article's service-label terminology.
//
// Usage:
//   tsx scripts/update-launch-news-en-service-labels.ts --dry-run
//   tsx scripts/update-launch-news-en-service-labels.ts --apply
//   tsx scripts/update-launch-news-en-service-labels.ts --target production --allow-production --dry-run
//   tsx scripts/update-launch-news-en-service-labels.ts --target production --allow-production --apply
//
// Safety:
//   - defaults to staging dry-run;
//   - production requires --target production --allow-production;
//   - the runtime DB target guard runs before SELECT/UPDATE;
//   - never prints the full DATABASE_URL;
//   - targets only the launch article slug;
//   - writes only news.bodyEn.

import "./load-env";
import { and, eq, isNull } from "drizzle-orm";
import { ensureDbTarget, readDbTargetArgs } from "./ensure-staging-db";
import { db, news } from "../lib/db";

const SCRIPT_NAME = "update-launch-news-en-service-labels";
const ARTICLE_SLUG = "megujult-az-avenir-weboldala-es-arculata";

const REPLACEMENTS = [
  {
    before: "manned guarding",
    after: "On-site Security Guarding",
  },
  {
    before: "reception and concierge services",
    after: "Reception and Gatehouse Services",
  },
] as const;

function hasArg(name: string): boolean {
  return process.argv.includes(name);
}

function usageAndExit(message?: string): never {
  if (message) console.error(`${SCRIPT_NAME}: ${message}`);
  console.error(
    [
      "",
      "Usage:",
      "  tsx scripts/update-launch-news-en-service-labels.ts --dry-run",
      "  tsx scripts/update-launch-news-en-service-labels.ts --apply",
      "  tsx scripts/update-launch-news-en-service-labels.ts --target production --allow-production --dry-run",
      "  tsx scripts/update-launch-news-en-service-labels.ts --target production --allow-production --apply",
      "",
      "If neither --dry-run nor --apply is supplied, the script defaults to dry-run.",
    ].join("\n"),
  );
  process.exit(1);
}

function applyTerminology(body: string): string {
  return REPLACEMENTS.reduce(
    (next, replacement) => next.replaceAll(replacement.before, replacement.after),
    body,
  );
}

function preview(value: string): string {
  const normalized = value.replace(/\s+/g, " ").trim();
  return normalized.length > 260 ? `${normalized.slice(0, 257)}...` : normalized;
}

async function main(): Promise<void> {
  const explicitDryRun = hasArg("--dry-run");
  const isApply = hasArg("--apply");

  if (explicitDryRun && isApply) {
    usageAndExit("use only one of --dry-run or --apply");
  }

  const isDryRun = !isApply;
  const { target, allowProduction } = readDbTargetArgs();

  ensureDbTarget({ scriptName: SCRIPT_NAME, isDryRun, target, allowProduction });

  const rows = await db
    .select({
      id: news.id,
      slug: news.slug,
      bodyEn: news.bodyEn,
      publishedEn: news.publishedEn,
    })
    .from(news)
    .where(and(eq(news.slug, ARTICLE_SLUG), isNull(news.deletedAt)));

  if (rows.length === 0) {
    usageAndExit(`missing launch article row for slug: ${ARTICLE_SLUG}`);
  }

  if (rows.length > 1) {
    usageAndExit(`duplicate non-deleted launch article rows for slug: ${ARTICLE_SLUG}`);
  }

  const [row] = rows;

  if (!row.bodyEn?.trim()) {
    usageAndExit("launch article bodyEn is blank; refusing to write placeholder content");
  }

  const nextBodyEn = applyTerminology(row.bodyEn);
  const changed = nextBodyEn !== row.bodyEn;

  console.log(
    `Launch news EN service-label terminology ${isDryRun ? "dry-run" : "apply"} on ${target}.`,
  );
  console.log(`Target slug: ${row.slug}`);
  console.log("Allowed write field: bodyEn.");
  console.log("Fields not touched: slug, title*, lead*, bodyHu/bodyDe/bodyZh, published*, dates, imageUrl.");
  console.log(`Published EN: ${row.publishedEn ? "yes" : "no"}`);

  for (const replacement of REPLACEMENTS) {
    const beforeCount = row.bodyEn.split(replacement.before).length - 1;
    const afterCount = nextBodyEn.split(replacement.after).length - 1;
    console.log(
      `${replacement.before} -> ${replacement.after}: ${beforeCount > 0 ? "change" : "skip"} ` +
        `(before occurrences=${beforeCount}, after occurrences=${afterCount})`,
    );
  }

  console.log(`Before preview: ${preview(row.bodyEn)}`);
  console.log(`After preview:  ${preview(nextBodyEn)}`);

  if (!changed) {
    console.log("No changes needed; bodyEn already uses the canonical labels.");
    return;
  }

  if (isDryRun) {
    console.log("Dry run only. No database rows were updated.");
    return;
  }

  await db.update(news).set({ bodyEn: nextBodyEn }).where(eq(news.id, row.id));

  console.log("Apply complete. Updated only news.bodyEn for the launch article.");
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`${SCRIPT_NAME}: failed: ${message}`);
  process.exit(1);
});
