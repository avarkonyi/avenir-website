// Guarded staging importer for reviewed service-detail translations.
//
// Usage examples:
//   npm run db:import-service-translations -- --locale en --file docs/translations/public_site_translation_matrix_en.csv --include-draft --include-legal-review --dry-run
//   npm run db:import-service-translations -- --locale en --file docs/translations/public_site_translation_matrix_en.csv --include-draft --include-legal-review --apply
//   npm run db:import-service-translations -- --clear-locale en --dry-run
//   npm run db:import-service-translations -- --clear-locale en --apply
//
// Safety:
//   - staging DB only; the runtime DB target guard runs before SELECT/UPDATE;
//   - never prints the full DATABASE_URL;
//   - imports service_detail_pilot rows only;
//   - writes only EN service-detail columns for the selected services;
//   - does not change slugs, publication flags, related services, names, HU/DE/ZH fields.

import "./load-env";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { eq, inArray } from "drizzle-orm";
import { ensureStagingDbTarget } from "./ensure-staging-db";
import { db, services } from "../lib/db";

const SCRIPT_NAME = "import-service-translations";

const KNOWN_SERVICE_SLUGS = [
  "objektumorzes",
  "portaszolgalat",
  "biztonsagtechnika",
  "tavfelugyelet-vonuloszolgalat",
  "mystery-shopping-helyszini-audit",
  "rendezvenybiztositas",
  "hard-fm",
  "soft-fm",
] as const;

type KnownServiceSlug = (typeof KNOWN_SERVICE_SLUGS)[number];
type CsvRow = Record<string, string>;
type ServiceUpdateValues = Partial<typeof services.$inferInsert>;
type ScalarFieldName = "seoTitle" | "seoDescription" | "valueProposition" | "longDesc";
type StringArrayFieldName = "highlights" | "useCases" | "includedItems";

type ServiceDraft = {
  readonly slug: KnownServiceSlug;
  scalars: Partial<Record<ScalarFieldName, string>>;
  arrays: Partial<Record<StringArrayFieldName, Map<number, string>>>;
  processSteps: Map<number, Partial<{ title: string; body: string }>>;
  trustItems: Map<number, Partial<{ title: string; body: string }>>;
  faq: Map<number, Partial<{ q: string; a: string }>>;
  legalReviewRows: number;
};

type ParseResult = {
  drafts: Map<KnownServiceSlug, ServiceDraft>;
  skippedByStatus: Map<string, number>;
  skippedEmptyEn: number;
  skippedNonServiceRows: number;
  skippedBlockedClaims: number;
  skippedUnmappedRows: number;
  warnings: string[];
};

const SCALAR_SOURCE_KEYS = new Map<string, ScalarFieldName>([
  ["PILOT_HU.seoTitle", "seoTitle"],
  ["PILOT_HU.seoDescription", "seoDescription"],
  ["PILOT_HU.valueProposition", "valueProposition"],
  ["PILOT_HU.longDesc", "longDesc"],
] as const);

const SCALAR_FIELDS = new Map<string, ScalarFieldName>([
  ["seoTitleHu", "seoTitle"],
  ["seoTitle", "seoTitle"],
  ["seoDescriptionHu", "seoDescription"],
  ["seoDescription", "seoDescription"],
  ["valuePropositionHu", "valueProposition"],
  ["valueProposition", "valueProposition"],
  ["longDescHu", "longDesc"],
  ["longDesc", "longDesc"],
] as const);

const ARRAY_FIELDS = new Map<string, StringArrayFieldName>([
  ["highlightsHu", "highlights"],
  ["highlights", "highlights"],
  ["useCasesHu", "useCases"],
  ["useCases", "useCases"],
  ["includedItemsHu", "includedItems"],
  ["includedItems", "includedItems"],
] as const);

const BLOCKED_CLAIM_PATTERNS = [
  /\bOPTEN\b/i,
  /\bBonit/i,
  /\bCredit rating\b/i,
  /\bEcoVadis\b/i,
  /\bA\+(?![A-Za-z0-9])/,
];

function readArg(name: string): string | null {
  const index = process.argv.indexOf(name);
  if (index === -1) return null;
  return process.argv[index + 1] ?? null;
}

function hasArg(name: string): boolean {
  return process.argv.includes(name);
}

function usageAndExit(message?: string): never {
  if (message) console.error(`${SCRIPT_NAME}: ${message}`);
  console.error(
    [
      "",
      "Usage:",
      "  tsx scripts/import-service-translations.ts --locale en --file docs/translations/public_site_translation_matrix_en.csv --include-draft --include-legal-review --dry-run",
      "  tsx scripts/import-service-translations.ts --locale en --file docs/translations/public_site_translation_matrix_en.csv --include-draft --include-legal-review --apply",
      "  tsx scripts/import-service-translations.ts --clear-locale en --dry-run",
      "  tsx scripts/import-service-translations.ts --clear-locale en --apply",
    ].join("\n"),
  );
  process.exit(1);
}

function redactedDbIdentity(): string {
  const raw = process.env.DATABASE_URL;
  if (!raw) return "<unknown - DATABASE_URL is not set>";
  try {
    const u = new URL(raw);
    const host = u.host || "<no-host>";
    const dbName = u.pathname.replace(/^\//, "") || "<no-db>";
    return `${host}/${dbName}`;
  } catch {
    return "<unparseable DATABASE_URL>";
  }
}

function parseCsv(text: string): CsvRow[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  const input = text.replace(/^\uFEFF/, "");
  for (let i = 0; i < input.length; i += 1) {
    const char = input[i];
    const next = input[i + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        field += '"';
        i += 1;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (char !== "\r") {
      field += char;
    }
  }

  if (inQuotes) usageAndExit("CSV parsing failed: unterminated quoted field.");
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  const [header, ...dataRows] = rows;
  if (!header || header.length === 0) usageAndExit("CSV file is empty.");

  return dataRows
    .filter((values) => values.some((value) => value.trim().length > 0))
    .map((values) =>
      Object.fromEntries(header.map((key, i) => [key, values[i] ?? ""])),
    );
}

function isKnownServiceSlug(slug: string): slug is KnownServiceSlug {
  return (KNOWN_SERVICE_SLUGS as readonly string[]).includes(slug);
}

function getOrCreateDraft(
  drafts: Map<KnownServiceSlug, ServiceDraft>,
  slug: KnownServiceSlug,
): ServiceDraft {
  const existing = drafts.get(slug);
  if (existing) return existing;

  const draft: ServiceDraft = {
    slug,
    scalars: {},
    arrays: {},
    processSteps: new Map(),
    trustItems: new Map(),
    faq: new Map(),
    legalReviewRows: 0,
  };
  drafts.set(slug, draft);
  return draft;
}

function increment(map: Map<string, number>, key: string): void {
  map.set(key, (map.get(key) ?? 0) + 1);
}

function hasBlockedClaim(row: CsvRow): boolean {
  const text = `${row.hu ?? ""}\n${row.en ?? ""}\n${row.notes ?? ""}`;
  return BLOCKED_CLAIM_PATTERNS.some((pattern) => pattern.test(text));
}

function statusAllowed(
  row: CsvRow,
  includeDraft: boolean,
  includeLegalReview: boolean,
): boolean {
  const status = row.status.trim();
  if (status === "existing_translation_review") return true;
  if (status === "translated_draft") return includeDraft;
  if (status === "legal_review_required") {
    return includeLegalReview && row.area.trim() === "service_detail_pilot";
  }
  return false;
}

function numericItemIndex(row: CsvRow, matchIndex?: string): number | null {
  const source = matchIndex ?? row.item_index;
  const parsed = Number.parseInt(source, 10);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : null;
}

function setArrayItem(
  draft: ServiceDraft,
  arrayName: "highlights" | "useCases" | "includedItems",
  index: number,
  value: string,
): void {
  const existing = draft.arrays[arrayName] ?? new Map<number, string>();
  existing.set(index, value);
  draft.arrays[arrayName] = existing;
}

function addRowToDraft(draft: ServiceDraft, row: CsvRow, result: ParseResult): void {
  const sourceKey = row.source_key.trim();
  const field = row.field.trim();
  const value = row.en.trim();

  const scalarFromSource = SCALAR_SOURCE_KEYS.get(sourceKey);
  const scalarName = scalarFromSource ?? SCALAR_FIELDS.get(field);
  if (scalarName) {
    draft.scalars[scalarName] = value;
    return;
  }

  const arraySourceMatch = sourceKey.match(
    /^PILOT_HU\.(highlights|useCases|includedItems)\.(\d+)$/,
  );
  const arrayName =
    (arraySourceMatch?.[1] as StringArrayFieldName | undefined) ??
    ARRAY_FIELDS.get(field);
  if (arrayName) {
    const index = numericItemIndex(row, arraySourceMatch?.[2]);
    if (index === null) {
      result.warnings.push(
        `${draft.slug}: skipped ${sourceKey || field} because item_index is missing.`,
      );
      result.skippedUnmappedRows += 1;
      return;
    }
    setArrayItem(draft, arrayName, index, value);
    return;
  }

  const processMatch = sourceKey.match(
    /^PILOT_HU\.(processSteps|trustItems)\.(\d+)\.(title|body|description)$/,
  );
  if (processMatch) {
    const [, collection, indexRaw, partRaw] = processMatch;
    const index = numericItemIndex(row, indexRaw);
    if (index === null) {
      result.warnings.push(`${draft.slug}: skipped ${sourceKey} because index is invalid.`);
      result.skippedUnmappedRows += 1;
      return;
    }
    const target =
      collection === "processSteps" ? draft.processSteps : draft.trustItems;
    const item = target.get(index) ?? {};
    const part = partRaw === "title" ? "title" : "body";
    item[part] = value;
    target.set(index, item);
    return;
  }

  const faqMatch = sourceKey.match(/^PILOT_HU\.faq\.(\d+)\.(q|a)$/);
  if (faqMatch || field === "question" || field === "answer") {
    const index = numericItemIndex(row, faqMatch?.[1]);
    if (index === null) {
      result.warnings.push(
        `${draft.slug}: skipped ${sourceKey || field} because item_index is missing.`,
      );
      result.skippedUnmappedRows += 1;
      return;
    }
    const item = draft.faq.get(index) ?? {};
    const part = faqMatch?.[2] ?? (field === "question" ? "q" : "a");
    if (part === "q") item.q = value;
    else item.a = value;
    draft.faq.set(index, item);
    return;
  }

  // Related service rows and other source-only rows are intentionally not imported.
  if (sourceKey.includes("relatedServiceSlugs") || field === "relatedServiceSlugs") {
    return;
  }

  result.warnings.push(
    `${draft.slug}: skipped unmapped service row source_key=${sourceKey || "(empty)"} field=${field || "(empty)"}.`,
  );
  result.skippedUnmappedRows += 1;
}

function parseMatrix(
  filePath: string,
  includeDraft: boolean,
  includeLegalReview: boolean,
): ParseResult {
  const text = readFileSync(filePath, "utf8");
  const rows = parseCsv(text);
  const result: ParseResult = {
    drafts: new Map(),
    skippedByStatus: new Map(),
    skippedEmptyEn: 0,
    skippedNonServiceRows: 0,
    skippedBlockedClaims: 0,
    skippedUnmappedRows: 0,
    warnings: [],
  };

  const unknownSlugs = new Set<string>();
  for (const row of rows) {
    if (row.area.trim() !== "service_detail_pilot") {
      result.skippedNonServiceRows += 1;
      continue;
    }

    const slug = row.service_slug.trim();
    if (!isKnownServiceSlug(slug)) {
      unknownSlugs.add(slug || "<empty>");
      continue;
    }

    if (hasBlockedClaim(row)) {
      result.skippedBlockedClaims += 1;
      continue;
    }

    if (row.en.trim().length === 0) {
      result.skippedEmptyEn += 1;
      continue;
    }

    if (!statusAllowed(row, includeDraft, includeLegalReview)) {
      increment(result.skippedByStatus, row.status.trim() || "<empty>");
      continue;
    }

    const draft = getOrCreateDraft(result.drafts, slug);
    if (row.status.trim() === "legal_review_required") draft.legalReviewRows += 1;
    addRowToDraft(draft, row, result);
  }

  if (unknownSlugs.size > 0) {
    usageAndExit(
      `unknown service_slug value(s) in service_detail_pilot rows: ${[
        ...unknownSlugs,
      ].join(", ")}`,
    );
  }

  return result;
}

function orderedArray<T>(items: Map<number, T>): T[] {
  return [...items.entries()]
    .sort(([a], [b]) => a - b)
    .map(([, value]) => value);
}

function completeObjectArray(
  slug: string,
  label: string,
  items: Map<number, Partial<{ title: string; body: string }>>,
): { title: string; body: string }[] {
  const complete: [number, { title: string; body: string }][] = [];
  for (const [index, item] of items) {
    const title = item.title?.trim() ?? "";
    const body = item.body?.trim() ?? "";
    if (!title || !body) {
      usageAndExit(
        `${slug}: incomplete ${label} item at index ${index}; title and body are both required for object arrays.`,
      );
    }
    complete.push([index, { title, body }]);
  }
  return complete.sort(([a], [b]) => a - b).map(([, value]) => value);
}

function completeFaqArray(
  slug: string,
  items: Map<number, Partial<{ q: string; a: string }>>,
): { q: string; a: string }[] {
  const complete: [number, { q: string; a: string }][] = [];
  for (const [index, item] of items) {
    const q = item.q?.trim() ?? "";
    const a = item.a?.trim() ?? "";
    if (!q || !a) {
      usageAndExit(
        `${slug}: incomplete faq item at index ${index}; question and answer are both required.`,
      );
    }
    complete.push([index, { q, a }]);
  }
  return complete.sort(([a], [b]) => a - b).map(([, value]) => value);
}

function buildUpdateValues(draft: ServiceDraft): ServiceUpdateValues {
  const required = ["seoTitle", "seoDescription", "valueProposition", "longDesc"] as const;
  const missing = required.filter((field) => !draft.scalars[field]?.trim());
  if (missing.length > 0) {
    usageAndExit(
      `${draft.slug}: missing required EN field(s): ${missing.join(", ")}. Refusing partial service-detail import.`,
    );
  }

  const values: ServiceUpdateValues = {
    seoTitleEn: draft.scalars.seoTitle,
    seoDescriptionEn: draft.scalars.seoDescription,
    valuePropositionEn: draft.scalars.valueProposition,
    longDescEn: draft.scalars.longDesc,
  };

  if (draft.arrays.highlights) values.highlightsEn = orderedArray(draft.arrays.highlights);
  if (draft.arrays.useCases) values.useCasesEn = orderedArray(draft.arrays.useCases);
  if (draft.arrays.includedItems) {
    values.includedItemsEn = orderedArray(draft.arrays.includedItems);
  }
  if (draft.processSteps.size > 0) {
    values.processStepsEn = completeObjectArray(
      draft.slug,
      "processSteps",
      draft.processSteps,
    );
  }
  if (draft.trustItems.size > 0) {
    values.trustItemsEn = completeObjectArray(
      draft.slug,
      "trustItems",
      draft.trustItems,
    );
  }
  if (draft.faq.size > 0) values.faqEn = completeFaqArray(draft.slug, draft.faq);

  return values;
}

function clearValues(): ServiceUpdateValues {
  return {
    seoTitleEn: null,
    seoDescriptionEn: null,
    valuePropositionEn: null,
    longDescEn: null,
    highlightsEn: [],
    useCasesEn: [],
    includedItemsEn: [],
    processStepsEn: [],
    trustItemsEn: [],
    faqEn: [],
  };
}

function summarizeValue(value: unknown): string {
  if (typeof value === "string") return value.trim().length > 0 ? "text" : "(empty)";
  if (value === null || value === undefined) return "(null)";
  if (Array.isArray(value)) return `${value.length} item${value.length === 1 ? "" : "s"}`;
  return "value";
}

function changedColumns(
  existing: typeof services.$inferSelect,
  values: ServiceUpdateValues,
): string[] {
  return Object.entries(values)
    .filter(([key, value]) => {
      const current = existing[key as keyof typeof existing];
      return JSON.stringify(current ?? null) !== JSON.stringify(value ?? null);
    })
    .map(([key]) => key);
}

function printSkippedSummary(result: ParseResult): void {
  console.log("");
  console.log("Skipped row summary:");
  console.log(`  non-service rows: ${result.skippedNonServiceRows}`);
  console.log(`  empty EN cells: ${result.skippedEmptyEn}`);
  console.log(`  blocked proof/client/rating rows: ${result.skippedBlockedClaims}`);
  console.log(`  unmapped service rows: ${result.skippedUnmappedRows}`);
  for (const [status, count] of [...result.skippedByStatus.entries()].sort()) {
    console.log(`  status ${status}: ${count}`);
  }
}

async function loadServiceRows(targetSlugs: readonly KnownServiceSlug[]) {
  const rows = await db
    .select()
    .from(services)
    .where(inArray(services.slug, [...targetSlugs]))
    .orderBy(services.slug, services.id);

  const bySlug = new Map<KnownServiceSlug, typeof services.$inferSelect>();
  const counts = new Map<string, number>();
  for (const row of rows) {
    counts.set(row.slug, (counts.get(row.slug) ?? 0) + 1);
    if (isKnownServiceSlug(row.slug) && !bySlug.has(row.slug)) {
      bySlug.set(row.slug, row);
    }
  }

  for (const slug of targetSlugs) {
    const count = counts.get(slug) ?? 0;
    if (count === 0) usageAndExit(`service row not found for slug "${slug}".`);
    if (count > 1) usageAndExit(`duplicate service rows found for slug "${slug}".`);
  }

  return bySlug;
}

async function runClearLocale(isApply: boolean): Promise<void> {
  const targetSlugs = [...KNOWN_SERVICE_SLUGS];
  const rows = await loadServiceRows(targetSlugs);
  const values = clearValues();

  console.log("");
  console.log(`Rollback mode: clear EN detail fields for ${targetSlugs.length} services.`);
  for (const slug of targetSlugs) {
    const row = rows.get(slug);
    if (!row) continue;
    const changed = changedColumns(row, values);
    console.log(
      `  ${slug}: ${changed.length > 0 ? changed.join(", ") : "no EN detail changes needed"}`,
    );
    if (isApply) {
      await db.update(services).set(values).where(eq(services.id, row.id));
    }
  }

  console.log(
    isApply
      ? "Rollback applied on staging: EN detail fields cleared."
      : "Rollback dry-run complete: no rows written.",
  );
}

async function runImport(filePath: string, isApply: boolean): Promise<void> {
  const includeDraft = hasArg("--include-draft");
  const includeLegalReview = hasArg("--include-legal-review");
  const parsed = parseMatrix(filePath, includeDraft, includeLegalReview);
  if (parsed.drafts.size === 0) {
    usageAndExit("no importable service_detail_pilot rows found for locale en.");
  }

  const targetSlugs = [...parsed.drafts.keys()].sort();
  const rows = await loadServiceRows(targetSlugs);
  const updates = new Map<KnownServiceSlug, ServiceUpdateValues>();

  for (const slug of targetSlugs) {
    const draft = parsed.drafts.get(slug);
    if (!draft) continue;
    updates.set(slug, buildUpdateValues(draft));
  }

  console.log("");
  console.log(`Import file: ${filePath}`);
  console.log(`Target locale: en`);
  console.log(`Services in import: ${targetSlugs.length}`);
  console.log(`Include translated_draft: ${includeDraft ? "yes" : "no"}`);
  console.log(`Include legal_review_required: ${includeLegalReview ? "yes" : "no"}`);
  printSkippedSummary(parsed);

  if (parsed.warnings.length > 0) {
    console.log("");
    console.log("Warnings:");
    for (const warning of parsed.warnings) console.log(`  - ${warning}`);
  }

  console.log("");
  console.log(isApply ? "Applying EN translation updates:" : "Dry-run planned EN translation updates:");
  for (const slug of targetSlugs) {
    const row = rows.get(slug);
    const values = updates.get(slug);
    const draft = parsed.drafts.get(slug);
    if (!row || !values || !draft) continue;

    const changed = changedColumns(row, values);
    const counts = {
      highlights: Array.isArray(values.highlightsEn) ? values.highlightsEn.length : null,
      useCases: Array.isArray(values.useCasesEn) ? values.useCasesEn.length : null,
      includedItems: Array.isArray(values.includedItemsEn)
        ? values.includedItemsEn.length
        : null,
      processSteps: Array.isArray(values.processStepsEn) ? values.processStepsEn.length : null,
      trustItems: Array.isArray(values.trustItemsEn) ? values.trustItemsEn.length : null,
      faq: Array.isArray(values.faqEn) ? values.faqEn.length : null,
    };

    console.log(`  ${slug} (id=${row.id})`);
    console.log(`    required: seoTitle, seoDescription, valueProposition, longDesc`);
    console.log(
      `    columns ${isApply ? "changed" : "that would change"}: ${
        changed.length > 0 ? changed.join(", ") : "(none)"
      }`,
    );
    console.log(
      `    arrays: ${Object.entries(counts)
        .filter(([, value]) => value !== null)
        .map(([key, value]) => `${key}=${value}`)
        .join(", ") || "(none present)"}`,
    );
    if (draft.legalReviewRows > 0) {
      console.log(
        `    legal-review rows included for staging review: ${draft.legalReviewRows}`,
      );
    }
    console.log(
      `    scalar summary: ${Object.entries(values)
        .filter(([, value]) => typeof value === "string")
        .map(([key, value]) => `${key}=${summarizeValue(value)}`)
        .join(", ")}`,
    );

    if (isApply && changed.length > 0) {
      await db.update(services).set(values).where(eq(services.id, row.id));
      console.log(`    applied: yes`);
    } else if (isApply) {
      console.log(`    applied: no changes`);
    }
  }

  console.log(isApply ? "Import applied on staging." : "Dry-run complete: no rows written.");
}

async function main() {
  const locale = readArg("--locale");
  const clearLocale = readArg("--clear-locale");
  const fileArg = readArg("--file");
  const isDryRun = hasArg("--dry-run");
  const isApply = hasArg("--apply");

  if (isDryRun === isApply) {
    usageAndExit("choose exactly one of --dry-run or --apply.");
  }
  if (locale && locale !== "en") usageAndExit("only --locale en is supported by this script.");
  if (clearLocale && clearLocale !== "en") {
    usageAndExit("only --clear-locale en is supported by this script.");
  }
  if (!clearLocale && locale !== "en") usageAndExit("--locale en is required for import mode.");
  if (clearLocale && locale && locale !== clearLocale) {
    usageAndExit("--locale and --clear-locale must match when both are provided.");
  }
  if (!clearLocale && !fileArg) usageAndExit("--file is required for import mode.");

  const filePath = fileArg ? resolve(fileArg) : null;

  console.log(`--- ${SCRIPT_NAME} ${isDryRun ? "DRY-RUN" : "APPLY"} start ---`);
  ensureStagingDbTarget({ scriptName: SCRIPT_NAME, isDryRun });
  console.log(`DB target (host/db): ${redactedDbIdentity()}`);

  if (clearLocale) await runClearLocale(isApply);
  else if (filePath) await runImport(filePath, isApply);

  console.log(`--- ${SCRIPT_NAME} done ---`);
}

main().catch((error) => {
  console.error(`${SCRIPT_NAME} FAILED:`, error instanceof Error ? error.message : error);
  process.exit(1);
});
