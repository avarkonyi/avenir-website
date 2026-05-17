// Guarded staging-only updater for curated service relatedServiceSlugs.
//
// Usage:
//   npm run db:update-service-related-slugs -- --dry-run
//   npm run db:update-service-related-slugs -- --apply
//
// Safety:
//   - staging DB only; the runtime DB target guard runs before SELECT/UPDATE;
//   - never prints the full DATABASE_URL;
//   - validates the approved related-service graph before DB I/O;
//   - writes only services.relatedServiceSlugs for the eight canonical services;
//   - does not change copy, slugs, names, readiness flags, timestamps, or metadata.

import "./load-env";
import { eq, inArray } from "drizzle-orm";
import { ensureStagingDbTarget } from "./ensure-staging-db";
import { db, services } from "../lib/db";

const SCRIPT_NAME = "update-service-related-slugs";

const CANONICAL_SERVICE_SLUGS = [
  "objektumorzes",
  "portaszolgalat",
  "biztonsagtechnika",
  "tavfelugyelet-vonuloszolgalat",
  "mystery-shopping-helyszini-audit",
  "rendezvenybiztositas",
  "hard-fm",
  "soft-fm",
] as const;

type CanonicalServiceSlug = (typeof CANONICAL_SERVICE_SLUGS)[number];

const LEGACY_SERVICE_SLUGS = new Set([
  "security",
  "reception",
  "building",
  "technical",
  "mystery",
  "cleaning",
  "hardfm",
  "green",
]);

const RELATED_SERVICE_SLUGS: Record<CanonicalServiceSlug, readonly CanonicalServiceSlug[]> = {
  objektumorzes: [
    "portaszolgalat",
    "biztonsagtechnika",
    "tavfelugyelet-vonuloszolgalat",
    "mystery-shopping-helyszini-audit",
    "rendezvenybiztositas",
  ],
  portaszolgalat: [
    "objektumorzes",
    "biztonsagtechnika",
    "mystery-shopping-helyszini-audit",
    "soft-fm",
  ],
  biztonsagtechnika: [
    "tavfelugyelet-vonuloszolgalat",
    "objektumorzes",
    "portaszolgalat",
    "hard-fm",
  ],
  "tavfelugyelet-vonuloszolgalat": [
    "biztonsagtechnika",
    "objektumorzes",
    "portaszolgalat",
    "hard-fm",
  ],
  "mystery-shopping-helyszini-audit": [
    "portaszolgalat",
    "soft-fm",
    "rendezvenybiztositas",
    "objektumorzes",
  ],
  rendezvenybiztositas: [
    "objektumorzes",
    "portaszolgalat",
    "mystery-shopping-helyszini-audit",
    "biztonsagtechnika",
  ],
  "hard-fm": [
    "soft-fm",
    "biztonsagtechnika",
    "tavfelugyelet-vonuloszolgalat",
    "objektumorzes",
  ],
  "soft-fm": [
    "hard-fm",
    "portaszolgalat",
    "mystery-shopping-helyszini-audit",
    "objektumorzes",
    "rendezvenybiztositas",
  ],
} as const;

type ServiceRow = {
  id: number;
  slug: string;
  relatedServiceSlugs: string[];
};

function hasArg(name: string): boolean {
  return process.argv.includes(name);
}

function usageAndExit(message?: string): never {
  if (message) console.error(`${SCRIPT_NAME}: ${message}`);
  console.error(
    [
      "",
      "Usage:",
      "  tsx scripts/update-service-related-slugs.ts --dry-run",
      "  tsx scripts/update-service-related-slugs.ts --apply",
      "",
      "Run through npm so the external staging guard also runs:",
      "  npm run db:update-service-related-slugs -- --dry-run",
      "  npm run db:update-service-related-slugs -- --apply",
    ].join("\n"),
  );
  process.exit(1);
}

function isCanonicalSlug(value: string): value is CanonicalServiceSlug {
  return (CANONICAL_SERVICE_SLUGS as readonly string[]).includes(value);
}

function formatList(slugs: readonly string[]): string {
  return slugs.length > 0 ? slugs.join(", ") : "(none)";
}

function sameList(left: readonly string[], right: readonly string[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function assertNoDuplicates(slug: string, values: readonly string[]): void {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const value of values) {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }

  if (duplicates.size > 0) {
    usageAndExit(`${slug}: duplicate related service slugs: ${formatList([...duplicates])}`);
  }
}

function validateRelatedMap(): void {
  const mapKeys = Object.keys(RELATED_SERVICE_SLUGS);
  const unknownKeys = mapKeys.filter((slug) => !isCanonicalSlug(slug));
  if (unknownKeys.length > 0) {
    usageAndExit(`unknown service slug(s) in approved map: ${formatList(unknownKeys)}`);
  }

  const missingKeys = CANONICAL_SERVICE_SLUGS.filter((slug) => !(slug in RELATED_SERVICE_SLUGS));
  if (missingKeys.length > 0) {
    usageAndExit(`approved map is missing service slug(s): ${formatList(missingKeys)}`);
  }

  for (const slug of CANONICAL_SERVICE_SLUGS) {
    const relatedSlugs = RELATED_SERVICE_SLUGS[slug];

    if (relatedSlugs.length < 4 || relatedSlugs.length > 5) {
      usageAndExit(
        `${slug}: expected 4-5 related services, received ${relatedSlugs.length}`,
      );
    }

    assertNoDuplicates(slug, relatedSlugs);

    for (const relatedSlug of relatedSlugs) {
      if (relatedSlug === slug) {
        usageAndExit(`${slug}: cannot include itself as a related service`);
      }

      if (LEGACY_SERVICE_SLUGS.has(relatedSlug)) {
        usageAndExit(`${slug}: legacy slug is not allowed: ${relatedSlug}`);
      }

      if (!isCanonicalSlug(relatedSlug)) {
        usageAndExit(`${slug}: unknown related service slug: ${relatedSlug}`);
      }
    }
  }
}

function indexRowsBySlug(rows: ServiceRow[]): Map<CanonicalServiceSlug, ServiceRow> {
  const bySlug = new Map<CanonicalServiceSlug, ServiceRow>();

  for (const row of rows) {
    if (!isCanonicalSlug(row.slug)) {
      usageAndExit(`database returned unknown service slug: ${row.slug}`);
    }

    if (bySlug.has(row.slug)) {
      usageAndExit(`duplicate service rows found for slug: ${row.slug}`);
    }

    bySlug.set(row.slug, row);
  }

  const missing = CANONICAL_SERVICE_SLUGS.filter((slug) => !bySlug.has(slug));
  if (missing.length > 0) {
    usageAndExit(`missing canonical service row(s): ${formatList(missing)}`);
  }

  return bySlug;
}

async function main(): Promise<void> {
  const isDryRun = hasArg("--dry-run");
  const isApply = hasArg("--apply");

  if (isDryRun === isApply) {
    usageAndExit("use exactly one of --dry-run or --apply");
  }

  validateRelatedMap();
  ensureStagingDbTarget({ scriptName: SCRIPT_NAME, isDryRun });

  const rows = await db
    .select({
      id: services.id,
      slug: services.slug,
      relatedServiceSlugs: services.relatedServiceSlugs,
    })
    .from(services)
    .where(inArray(services.slug, [...CANONICAL_SERVICE_SLUGS]));

  const rowsBySlug = indexRowsBySlug(rows);
  const plannedUpdates = CANONICAL_SERVICE_SLUGS.map((slug) => {
    const row = rowsBySlug.get(slug);
    if (!row) usageAndExit(`missing canonical service row: ${slug}`);

    const before = row.relatedServiceSlugs ?? [];
    const after = [...RELATED_SERVICE_SLUGS[slug]];

    return {
      row,
      slug,
      before,
      after,
      changed: !sameList(before, after),
    };
  });

  console.log(
    `Curated relatedServiceSlugs ${isDryRun ? "dry run" : "apply"} for ` +
      `${plannedUpdates.length} canonical services.`,
  );

  for (const update of plannedUpdates) {
    console.log(`\n${update.slug}`);
    console.log(`  before:  ${formatList(update.before)}`);
    console.log(`  after:   ${formatList(update.after)}`);
    console.log(`  changed: ${update.changed ? "yes" : "no"}`);
  }

  if (isDryRun) {
    console.log("\nDry run only. No database rows were updated.");
    return;
  }

  let updated = 0;

  for (const update of plannedUpdates) {
    if (!update.changed) continue;

    await db
      .update(services)
      .set({ relatedServiceSlugs: update.after })
      .where(eq(services.id, update.row.id));

    updated += 1;
    console.log(`Updated ${update.slug}`);
  }

  console.log(
    `\nApply complete. Updated ${updated} service row(s); ` +
      "only relatedServiceSlugs was written.",
  );
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`${SCRIPT_NAME}: failed: ${message}`);
  process.exit(1);
});
