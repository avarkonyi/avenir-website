// Guarded HU pilot service-detail content sync.
//
// Usage:
//   npx tsx scripts/sync-pilot-service-content.ts --dry-run
//   npx tsx scripts/sync-pilot-service-content.ts --apply
//   npx tsx scripts/sync-pilot-service-content.ts --target production --allow-production --dry-run
//   npx tsx scripts/sync-pilot-service-content.ts --target production --allow-production --apply
//
// Safety:
//   - staging by default; production requires --target production --allow-production;
//   - the runtime DB target guard runs before SELECT/UPDATE;
//   - reads approved HU content from the existing seed-pilot service files
//     without importing or executing those seed scripts;
//   - writes only HU service-detail fields for the eight canonical services;
//   - does not change display names, short descriptions, slugs, readiness,
//     relatedServiceSlugs, EN/DE/ZH fields, timestamps, or proof state.

import "./load-env";
import { readFileSync } from "node:fs";
import { Script } from "node:vm";
import { eq, inArray } from "drizzle-orm";
import { ensureDbTarget, readDbTargetArgs } from "./ensure-staging-db";
import { db, services } from "../lib/db";

const SCRIPT_NAME = "sync-pilot-service-content";
const EXACT_LICENSE_NUMBER = "01030-822/4926-7/2023";

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

const SEED_FILES: Record<CanonicalServiceSlug, string> = {
  objektumorzes: "scripts/seed-pilot-objektumorzes.ts",
  portaszolgalat: "scripts/seed-pilot-portaszolgalat.ts",
  biztonsagtechnika: "scripts/seed-pilot-biztonsagtechnika.ts",
  "tavfelugyelet-vonuloszolgalat":
    "scripts/seed-pilot-tavfelugyelet-vonuloszolgalat.ts",
  "mystery-shopping-helyszini-audit":
    "scripts/seed-pilot-mystery-shopping-helyszini-audit.ts",
  rendezvenybiztositas: "scripts/seed-pilot-rendezvenybiztositas.ts",
  "hard-fm": "scripts/seed-pilot-hard-fm.ts",
  "soft-fm": "scripts/seed-pilot-soft-fm.ts",
};

type ObjectItem = { title: string; body: string };
type FaqItem = { q: string; a: string };

type PilotHu = {
  seoTitle: string;
  seoDescription: string;
  valueProposition: string;
  longDesc: string;
  useCases: string[];
  includedItems: string[];
  processSteps: ObjectItem[];
  trustItems: ObjectItem[];
  faq: FaqItem[];
};

type HuField =
  | "seoTitleHu"
  | "seoDescriptionHu"
  | "valuePropositionHu"
  | "longDescHu"
  | "useCasesHu"
  | "includedItemsHu"
  | "processStepsHu"
  | "trustItemsHu"
  | "faqHu";

type HuUpdateValues = Pick<typeof services.$inferInsert, HuField>;

type ServiceRow = Pick<typeof services.$inferSelect, "id" | "slug" | HuField>;

type FieldChange = {
  field: HuField;
  before: unknown;
  after: unknown;
  changed: boolean;
};

type PlannedUpdate = {
  row: ServiceRow;
  slug: CanonicalServiceSlug;
  fields: FieldChange[];
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
      "  tsx scripts/sync-pilot-service-content.ts --dry-run",
      "  tsx scripts/sync-pilot-service-content.ts --apply",
      "  tsx scripts/sync-pilot-service-content.ts --target production --allow-production --dry-run",
      "  tsx scripts/sync-pilot-service-content.ts --target production --allow-production --apply",
      "",
      "If neither --dry-run nor --apply is supplied, the script defaults to dry-run.",
    ].join("\n"),
  );
  process.exit(1);
}

function isCanonicalSlug(value: string): value is CanonicalServiceSlug {
  return (CANONICAL_SERVICE_SLUGS as readonly string[]).includes(value);
}

function formatList(values: readonly string[]): string {
  return values.length > 0 ? values.join(", ") : "(none)";
}

function summarise(value: unknown): string {
  if (value === null || value === undefined) return "(null)";
  if (typeof value === "string") {
    const oneLine = value.replace(/\s+/g, " ").trim();
    if (oneLine.length <= 120) return JSON.stringify(oneLine);
    return `${JSON.stringify(oneLine.slice(0, 117))}... [${value.length} chars]`;
  }
  if (Array.isArray(value)) {
    return `[${value.length} item${value.length === 1 ? "" : "s"}]`;
  }
  return JSON.stringify(value);
}

function findObjectEnd(source: string, openBraceIndex: number): number {
  let depth = 0;
  let quote: string | null = null;
  let escaped = false;
  let lineComment = false;
  let blockComment = false;

  for (let index = openBraceIndex; index < source.length; index += 1) {
    const char = source[index];
    const next = source[index + 1];

    if (lineComment) {
      if (char === "\n") lineComment = false;
      continue;
    }

    if (blockComment) {
      if (char === "*" && next === "/") {
        blockComment = false;
        index += 1;
      }
      continue;
    }

    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === quote) {
        quote = null;
      }
      continue;
    }

    if (char === "/" && next === "/") {
      lineComment = true;
      index += 1;
      continue;
    }

    if (char === "/" && next === "*") {
      blockComment = true;
      index += 1;
      continue;
    }

    if (char === '"' || char === "'" || char === "`") {
      quote = char;
      continue;
    }

    if (char === "{") depth += 1;
    if (char === "}") {
      depth -= 1;
      if (depth === 0) return index;
    }
  }

  usageAndExit("could not find the end of a PILOT_HU object in a seed file");
}

function extractPilotHu(seedFile: string): PilotHu {
  const source = readFileSync(seedFile, "utf8");
  const marker = "const PILOT_HU =";
  const markerIndex = source.indexOf(marker);
  if (markerIndex === -1) {
    usageAndExit(`${seedFile}: missing ${marker}`);
  }

  const objectStart = source.indexOf("{", markerIndex);
  if (objectStart === -1) {
    usageAndExit(`${seedFile}: missing PILOT_HU object literal`);
  }

  const objectEnd = findObjectEnd(source, objectStart);
  const expression = source.slice(objectStart, objectEnd + 1);

  try {
    return new Script(`(${expression})`, { filename: seedFile }).runInNewContext(
      Object.create(null),
    ) as PilotHu;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    usageAndExit(`${seedFile}: failed to evaluate PILOT_HU safely: ${message}`);
  }
}

function assertString(value: unknown, label: string): asserts value is string {
  if (typeof value !== "string" || value.trim().length === 0) {
    usageAndExit(`${label}: expected a non-empty string`);
  }
}

function assertStringArray(value: unknown, label: string): asserts value is string[] {
  if (
    !Array.isArray(value) ||
    value.length === 0 ||
    !value.every((item) => typeof item === "string" && item.trim().length > 0)
  ) {
    usageAndExit(`${label}: expected a non-empty string array`);
  }
}

function assertObjectItems(value: unknown, label: string): asserts value is ObjectItem[] {
  if (
    !Array.isArray(value) ||
    value.length === 0 ||
    !value.every(
      (item) =>
        item &&
        typeof item === "object" &&
        typeof (item as ObjectItem).title === "string" &&
        (item as ObjectItem).title.trim().length > 0 &&
        typeof (item as ObjectItem).body === "string" &&
        (item as ObjectItem).body.trim().length > 0,
    )
  ) {
    usageAndExit(`${label}: expected a non-empty { title, body } array`);
  }
}

function assertFaqItems(value: unknown, label: string): asserts value is FaqItem[] {
  if (
    !Array.isArray(value) ||
    value.length === 0 ||
    !value.every(
      (item) =>
        item &&
        typeof item === "object" &&
        typeof (item as FaqItem).q === "string" &&
        (item as FaqItem).q.trim().length > 0 &&
        typeof (item as FaqItem).a === "string" &&
        (item as FaqItem).a.trim().length > 0,
    )
  ) {
    usageAndExit(`${label}: expected a non-empty { q, a } array`);
  }
}

function flattenStrings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap((item) => flattenStrings(item));
  if (value && typeof value === "object") {
    return Object.values(value).flatMap((item) => flattenStrings(item));
  }
  return [];
}

function validatePilotHu(slug: CanonicalServiceSlug, value: PilotHu): void {
  assertString(value.seoTitle, `${slug}.seoTitle`);
  assertString(value.seoDescription, `${slug}.seoDescription`);
  assertString(value.valueProposition, `${slug}.valueProposition`);
  assertString(value.longDesc, `${slug}.longDesc`);
  assertStringArray(value.useCases, `${slug}.useCases`);
  assertStringArray(value.includedItems, `${slug}.includedItems`);
  assertObjectItems(value.processSteps, `${slug}.processSteps`);
  assertObjectItems(value.trustItems, `${slug}.trustItems`);
  assertFaqItems(value.faq, `${slug}.faq`);

  const disallowedText = [
    value.longDesc,
    ...value.trustItems.flatMap((item) => [item.title, item.body]),
  ].join("\n");
  if (disallowedText.includes(EXACT_LICENSE_NUMBER)) {
    usageAndExit(`${slug}: exact licence number is not allowed in body or trust cards`);
  }

  const allText = flattenStrings(value).join("\n");
  if (allText.includes(EXACT_LICENSE_NUMBER)) {
    usageAndExit(`${slug}: exact licence number is not allowed in HU service detail sync`);
  }
}

function validateTargets(): void {
  const keys = Object.keys(SEED_FILES);
  const unknown = keys.filter((slug) => !isCanonicalSlug(slug));
  if (unknown.length > 0) {
    usageAndExit(`unsupported target slug(s): ${formatList(unknown)}`);
  }

  const legacyTargets = keys.filter((slug) => LEGACY_SERVICE_SLUGS.has(slug));
  if (legacyTargets.length > 0) {
    usageAndExit(`legacy target slug(s) are not allowed: ${formatList(legacyTargets)}`);
  }

  const missing = CANONICAL_SERVICE_SLUGS.filter((slug) => !(slug in SEED_FILES));
  if (missing.length > 0) {
    usageAndExit(`missing canonical service target(s): ${formatList(missing)}`);
  }
}

function loadPilotContent(): Record<CanonicalServiceSlug, HuUpdateValues> {
  validateTargets();

  const entries = CANONICAL_SERVICE_SLUGS.map((slug) => {
    const pilot = extractPilotHu(SEED_FILES[slug]);
    validatePilotHu(slug, pilot);
    const values: HuUpdateValues = {
      seoTitleHu: pilot.seoTitle,
      seoDescriptionHu: pilot.seoDescription,
      valuePropositionHu: pilot.valueProposition,
      longDescHu: pilot.longDesc,
      useCasesHu: pilot.useCases,
      includedItemsHu: pilot.includedItems,
      processStepsHu: pilot.processSteps,
      trustItemsHu: pilot.trustItems,
      faqHu: pilot.faq,
    };
    return [slug, values] as const;
  });

  return Object.fromEntries(entries) as Record<CanonicalServiceSlug, HuUpdateValues>;
}

function sameValue(left: unknown, right: unknown): boolean {
  return JSON.stringify(left ?? null) === JSON.stringify(right ?? null);
}

function indexRowsBySlug(rows: ServiceRow[]): Map<CanonicalServiceSlug, ServiceRow> {
  const bySlug = new Map<CanonicalServiceSlug, ServiceRow>();

  for (const row of rows) {
    if (!isCanonicalSlug(row.slug)) {
      usageAndExit(`database returned unsupported service slug: ${row.slug}`);
    }

    if (LEGACY_SERVICE_SLUGS.has(row.slug)) {
      usageAndExit(`database returned legacy service slug: ${row.slug}`);
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

function planUpdates(
  rowsBySlug: Map<CanonicalServiceSlug, ServiceRow>,
  content: Record<CanonicalServiceSlug, HuUpdateValues>,
): PlannedUpdate[] {
  const fields: readonly HuField[] = [
    "seoTitleHu",
    "seoDescriptionHu",
    "valuePropositionHu",
    "longDescHu",
    "useCasesHu",
    "includedItemsHu",
    "processStepsHu",
    "trustItemsHu",
    "faqHu",
  ];

  return CANONICAL_SERVICE_SLUGS.map((slug) => {
    const row = rowsBySlug.get(slug);
    if (!row) usageAndExit(`missing canonical service row: ${slug}`);

    return {
      row,
      slug,
      fields: fields.map((field) => ({
        field,
        before: row[field],
        after: content[slug][field],
        changed: !sameValue(row[field], content[slug][field]),
      })),
    };
  });
}

function afterValue<T>(fields: readonly FieldChange[], fieldName: HuField): T {
  const field = fields.find((item) => item.field === fieldName);
  if (!field) usageAndExit(`internal error: missing planned field ${fieldName}`);
  return field.after as T;
}

function arrayCounts(fields: readonly FieldChange[]): string {
  return [
    `useCases=${afterValue<unknown[]>(fields, "useCasesHu").length}`,
    `includedItems=${afterValue<unknown[]>(fields, "includedItemsHu").length}`,
    `processSteps=${afterValue<unknown[]>(fields, "processStepsHu").length}`,
    `trustItems=${afterValue<unknown[]>(fields, "trustItemsHu").length}`,
    `faq=${afterValue<unknown[]>(fields, "faqHu").length}`,
  ].join(", ");
}

function printPlan(plannedUpdates: readonly PlannedUpdate[]): void {
  for (const update of plannedUpdates) {
    const changed = update.fields.filter((field) => field.changed);
    const skipped = update.fields.filter((field) => !field.changed);

    console.log(`\n${update.slug}`);
    console.log(`  changed fields: ${changed.length > 0 ? changed.map((field) => field.field).join(", ") : "(none)"}`);
    console.log(`  skipped equal fields: ${skipped.length > 0 ? skipped.map((field) => field.field).join(", ") : "(none)"}`);
    console.log(`  array counts: ${arrayCounts(update.fields)}`);

    for (const field of changed) {
      console.log(`  ${field.field}:`);
      console.log(`    before: ${summarise(field.before)}`);
      console.log(`    after:  ${summarise(field.after)}`);
    }
  }
}

function updatePayloadFor(
  fields: readonly FieldChange[],
  includeUnchanged = false,
): Partial<HuUpdateValues> {
  const payload: Partial<HuUpdateValues> = {};
  for (const field of fields) {
    if (includeUnchanged || field.changed) {
      payload[field.field] = field.after as never;
    }
  }
  return payload;
}

async function main(): Promise<void> {
  const explicitDryRun = hasArg("--dry-run");
  const isApply = hasArg("--apply");

  if (explicitDryRun && isApply) {
    usageAndExit("use only one of --dry-run or --apply");
  }

  const isDryRun = !isApply;
  const { target, allowProduction } = readDbTargetArgs();
  const content = loadPilotContent();

  ensureDbTarget({ scriptName: SCRIPT_NAME, isDryRun, target, allowProduction });

  const rows = await db
    .select({
      id: services.id,
      slug: services.slug,
      seoTitleHu: services.seoTitleHu,
      seoDescriptionHu: services.seoDescriptionHu,
      valuePropositionHu: services.valuePropositionHu,
      longDescHu: services.longDescHu,
      useCasesHu: services.useCasesHu,
      includedItemsHu: services.includedItemsHu,
      processStepsHu: services.processStepsHu,
      trustItemsHu: services.trustItemsHu,
      faqHu: services.faqHu,
    })
    .from(services)
    .where(inArray(services.slug, [...CANONICAL_SERVICE_SLUGS]));

  const rowsBySlug = indexRowsBySlug(rows);
  const plannedUpdates = planUpdates(rowsBySlug, content);
  const changedRows = plannedUpdates.filter((update) =>
    update.fields.some((field) => field.changed),
  );
  const changedFields = plannedUpdates.reduce(
    (count, update) => count + update.fields.filter((field) => field.changed).length,
    0,
  );

  console.log(
    `HU pilot service content ${isDryRun ? "dry run" : "apply"} for ` +
      `${plannedUpdates.length} canonical services on ${target}.`,
  );
  console.log(`Planned changes: ${changedRows.length} row(s), ${changedFields} field(s).`);
  console.log(
    "Allowed write fields: seoTitleHu, seoDescriptionHu, valuePropositionHu, " +
      "longDescHu, useCasesHu, includedItemsHu, processStepsHu, trustItemsHu, faqHu.",
  );
  console.log(
    "Fields not touched: slug, name*, shortDesc*, relatedServiceSlugs, " +
      "isPublished, isActive, sortOrder, icon, imageUrl, EN/DE/ZH fields, " +
      "readiness flags, updatedAt, proof_pending rows.",
  );

  printPlan(plannedUpdates);

  if (isDryRun) {
    console.log("\nDry run only. No database rows were updated.");
    return;
  }

  let updatedRows = 0;
  let updatedFields = 0;

  for (const update of plannedUpdates) {
    const payload = updatePayloadFor(update.fields);
    const fields = Object.keys(payload) as HuField[];

    if (fields.length === 0) {
      console.log(`Skipped ${update.slug}; HU pilot content already matches.`);
      continue;
    }

    await db.update(services).set(payload).where(eq(services.id, update.row.id));

    updatedRows += 1;
    updatedFields += fields.length;
    console.log(`Updated ${update.slug}: ${fields.join(", ")}`);
  }

  console.log(
    `\nApply complete. Updated ${updatedRows} service row(s), ` +
      `${updatedFields} HU detail field(s). No other service fields were written.`,
  );
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`${SCRIPT_NAME}: failed: ${message}`);
  process.exit(1);
});
