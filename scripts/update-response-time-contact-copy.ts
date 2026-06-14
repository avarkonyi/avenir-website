// Guarded updater for the response-time contact-follow-up wording in service
// process steps.
//
// Usage:
//   npm run db:update-response-time-contact-copy -- --dry-run
//   npm run db:update-response-time-contact-copy -- --apply
//
// Safety:
//   - staging by default; production requires --target production --allow-production;
//   - the runtime DB target guard runs before SELECT/UPDATE;
//   - never prints the full DATABASE_URL;
//   - targets only objektumorzes and portaszolgalat;
//   - writes only services.processStepsHu and services.processStepsEn;
//   - updates only the first process-step body in each locale array;
//   - does not change slugs, names, display copy, related services, readiness
//     flags, timestamps, legal content, service positioning, or other detail fields.

import "./load-env";
import { eq, inArray } from "drizzle-orm";
import { ensureDbTarget, readDbTargetArgs } from "./ensure-staging-db";
import { db, services } from "../lib/db";

const SCRIPT_NAME = "update-response-time-contact-copy";
const EXACT_LICENSE_NUMBER = "01030-822/4926-7/2023";

const TARGET_SERVICE_SLUGS = ["objektumorzes", "portaszolgalat"] as const;
type TargetServiceSlug = (typeof TARGET_SERVICE_SLUGS)[number];

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

const APPROVED_PROCESS_BODY = {
  hu:
    "A megkeresést átnézzük, és legkésőbb a következő munkanapon jelentkezünk a megadott elérhetőségen. Az ajánlat előkészítésének ideje a helyszíntől és az igény összetettségétől függ.",
  en:
    "We go over your enquiry and get in touch by the next business day using the details you provided. The time needed to prepare a quote depends on the site and the complexity of the request.",
} as const;

type ProcessStep = {
  title: string;
  body: string;
};

type ServiceRow = {
  id: number;
  slug: string;
  processStepsHu: ProcessStep[];
  processStepsEn: ProcessStep[];
};

type ProcessField = "processStepsHu" | "processStepsEn";

type FieldChange = {
  field: ProcessField;
  before: string;
  after: string;
  changed: boolean;
  itemCount: number;
};

type PlannedUpdate = {
  row: ServiceRow;
  slug: TargetServiceSlug;
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
      "  tsx scripts/update-response-time-contact-copy.ts --dry-run",
      "  tsx scripts/update-response-time-contact-copy.ts --apply",
      "  tsx scripts/update-response-time-contact-copy.ts --target production --allow-production --dry-run",
      "  tsx scripts/update-response-time-contact-copy.ts --target production --allow-production --apply",
      "",
      "Run through npm so the external target guard also runs:",
      "  npm run db:update-response-time-contact-copy -- --dry-run",
      "  npm run db:update-response-time-contact-copy -- --apply",
      "  npm run db:update-response-time-contact-copy:prod -- --dry-run",
      "  npm run db:update-response-time-contact-copy:prod -- --apply",
      "",
      "If neither --dry-run nor --apply is supplied, the script defaults to dry-run.",
    ].join("\n"),
  );
  process.exit(1);
}

function isTargetSlug(value: string): value is TargetServiceSlug {
  return (TARGET_SERVICE_SLUGS as readonly string[]).includes(value);
}

function formatList(values: readonly string[]): string {
  return values.length > 0 ? values.join(", ") : "(none)";
}

function formatValue(value: string): string {
  return value.length > 260 ? `${value.slice(0, 257)}...` : value;
}

function validateApprovedCopy(): void {
  for (const [locale, value] of Object.entries(APPROVED_PROCESS_BODY)) {
    if (value.trim().length === 0) {
      usageAndExit(`approved ${locale} process body must not be blank`);
    }

    if (value.includes(EXACT_LICENSE_NUMBER)) {
      usageAndExit(`approved ${locale} process body must not contain the exact licence number`);
    }
  }
}

function validateProcessSteps(slug: string, field: ProcessField, value: unknown): ProcessStep[] {
  if (!Array.isArray(value)) {
    usageAndExit(`${slug}.${field}: expected an array`);
  }

  const steps = value as ProcessStep[];
  if (steps.length === 0) {
    usageAndExit(`${slug}.${field}: expected at least one process step`);
  }

  for (const [index, step] of steps.entries()) {
    if (!step || typeof step.title !== "string" || typeof step.body !== "string") {
      usageAndExit(`${slug}.${field}[${index}]: expected { title, body } strings`);
    }
  }

  return steps;
}

function indexRowsBySlug(rows: ServiceRow[]): Map<TargetServiceSlug, ServiceRow> {
  const bySlug = new Map<TargetServiceSlug, ServiceRow>();

  for (const row of rows) {
    if (!isTargetSlug(row.slug)) {
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

  const missing = TARGET_SERVICE_SLUGS.filter((slug) => !bySlug.has(slug));
  if (missing.length > 0) {
    usageAndExit(`missing target service row(s): ${formatList(missing)}`);
  }

  return bySlug;
}

function planField(
  row: ServiceRow,
  field: ProcessField,
  afterBody: string,
): FieldChange {
  const steps = validateProcessSteps(row.slug, field, row[field]);
  const before = steps[0]?.body ?? "";

  return {
    field,
    before,
    after: afterBody,
    changed: before !== afterBody,
    itemCount: steps.length,
  };
}

function planUpdates(rowsBySlug: Map<TargetServiceSlug, ServiceRow>): PlannedUpdate[] {
  return TARGET_SERVICE_SLUGS.map((slug) => {
    const row = rowsBySlug.get(slug);
    if (!row) usageAndExit(`missing target service row: ${slug}`);

    return {
      row,
      slug,
      fields: [
        planField(row, "processStepsHu", APPROVED_PROCESS_BODY.hu),
        planField(row, "processStepsEn", APPROVED_PROCESS_BODY.en),
      ],
    };
  });
}

function withUpdatedFirstBody(steps: readonly ProcessStep[], body: string): ProcessStep[] {
  return steps.map((step, index) =>
    index === 0 ? { ...step, body } : { ...step },
  );
}

function updatePayloadFor(update: PlannedUpdate): Partial<Record<ProcessField, ProcessStep[]>> {
  const payload: Partial<Record<ProcessField, ProcessStep[]>> = {};

  for (const field of update.fields) {
    if (!field.changed) continue;

    if (field.field === "processStepsHu") {
      payload.processStepsHu = withUpdatedFirstBody(
        update.row.processStepsHu,
        APPROVED_PROCESS_BODY.hu,
      );
    } else {
      payload.processStepsEn = withUpdatedFirstBody(
        update.row.processStepsEn,
        APPROVED_PROCESS_BODY.en,
      );
    }
  }

  return payload;
}

function printPlan(plannedUpdates: readonly PlannedUpdate[]): void {
  for (const update of plannedUpdates) {
    console.log(`\n${update.slug}`);

    for (const field of update.fields) {
      console.log(`  ${field.field}[0].body: ${field.changed ? "change" : "skip"}`);
      console.log(`    process step count: ${field.itemCount}`);
      console.log(`    before: ${formatValue(field.before)}`);
      console.log(`    after:  ${formatValue(field.after)}`);
    }
  }
}

async function main(): Promise<void> {
  const explicitDryRun = hasArg("--dry-run");
  const isApply = hasArg("--apply");

  if (explicitDryRun && isApply) {
    usageAndExit("use only one of --dry-run or --apply");
  }

  const isDryRun = !isApply;
  const { target, allowProduction } = readDbTargetArgs();

  validateApprovedCopy();
  ensureDbTarget({ scriptName: SCRIPT_NAME, isDryRun, target, allowProduction });

  const rows = await db
    .select({
      id: services.id,
      slug: services.slug,
      processStepsHu: services.processStepsHu,
      processStepsEn: services.processStepsEn,
    })
    .from(services)
    .where(inArray(services.slug, [...TARGET_SERVICE_SLUGS]));

  const rowsBySlug = indexRowsBySlug(rows);
  const plannedUpdates = planUpdates(rowsBySlug);
  const changedRows = plannedUpdates.filter((update) =>
    update.fields.some((field) => field.changed),
  );
  const changedFields = plannedUpdates.reduce(
    (count, update) => count + update.fields.filter((field) => field.changed).length,
    0,
  );

  console.log(
    `Response-time contact follow-up ${isDryRun ? "dry run" : "apply"} for ` +
      `${plannedUpdates.length} service(s) on ${target}.`,
  );
  console.log(`Planned changes: ${changedRows.length} row(s), ${changedFields} field(s).`);
  console.log("Allowed write fields: processStepsHu, processStepsEn.");
  console.log(
    "Fields not touched: slug, name*, shortDesc*, longDesc*, seo*, valueProposition*, " +
      "useCases*, includedItems*, trustItems*, faq*, relatedServiceSlugs, " +
      "isPublished, isActive, sortOrder, icon, imageUrl, updatedAt.",
  );

  printPlan(plannedUpdates);

  if (isDryRun) {
    console.log("\nDry run only. No database rows were updated.");
    return;
  }

  let updatedRows = 0;
  let updatedFields = 0;

  for (const update of plannedUpdates) {
    const payload = updatePayloadFor(update);
    const fields = Object.keys(payload) as ProcessField[];

    if (fields.length === 0) {
      console.log(`Skipped ${update.slug}; process copy already matches.`);
      continue;
    }

    await db.update(services).set(payload).where(eq(services.id, update.row.id));

    updatedRows += 1;
    updatedFields += fields.length;
    console.log(`Updated ${update.slug}: ${fields.join(", ")}`);
  }

  console.log(
    `\nApply complete. Updated ${updatedRows} service row(s), ` +
      `${updatedFields} process field(s). No other service fields were written.`,
  );
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`${SCRIPT_NAME}: failed: ${message}`);
  process.exit(1);
});
