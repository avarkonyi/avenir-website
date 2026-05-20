// Guarded staging-only updater for service display labels and short descriptions.
//
// Usage:
//   npm run db:update-service-display-copy -- --dry-run
//   npm run db:update-service-display-copy -- --apply
//
// Safety:
//   - staging DB only; the runtime DB target guard runs before SELECT/UPDATE;
//   - never prints the full DATABASE_URL;
//   - targets exactly the eight canonical service rows;
//   - writes only services.nameHu, nameEn, shortDescHu and shortDescEn;
//   - does not change long detail copy, trust items, FAQ, process steps,
//     relatedServiceSlugs, slugs, readiness flags, timestamps, or metadata.

import "./load-env";
import { eq, inArray } from "drizzle-orm";
import { ensureStagingDbTarget } from "./ensure-staging-db";
import { db, services } from "../lib/db";

const SCRIPT_NAME = "update-service-display-copy";
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
type DisplayField = "nameHu" | "nameEn" | "shortDescHu" | "shortDescEn";

type DisplayCopy = Record<DisplayField, string>;

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

const DISPLAY_COPY: Record<CanonicalServiceSlug, DisplayCopy> = {
  objektumorzes: {
    nameHu: "Élőerős objektumőrzés",
    nameEn: "On-site Security Guarding",
    shortDescHu:
      "Élőerős objektumőrzés beléptetéssel, járőrözéssel, incidenskezeléssel, szolgálati naplóval és egyeztetett eszkalációs renddel.",
    shortDescEn:
      "On-site guarding for access, patrol, incident handling, service logging and agreed escalation at business sites.",
  },
  portaszolgalat: {
    nameHu: "Recepciós és portaszolgálat",
    nameEn: "Reception and Gatehouse Services",
    shortDescHu:
      "Recepciós és portaszolgálat látogatók, beszállítók, munkatársak, kulcsok, csomagok, naplózás és egyeztetett eszkaláció kezelésére.",
    shortDescEn:
      "Reception and gatehouse service for visitors, suppliers, employees, keys, packages, logging and agreed escalation.",
  },
  biztonsagtechnika: {
    nameHu: "Biztonságtechnika",
    nameEn: "Security Technology",
    shortDescHu:
      "Biztonságtechnika kamerarendszerhez, beléptetéshez és riasztási folyamatokhoz, helyszínre szabott biztonsági modellbe illesztve, adatvédelmi szempontokat beépítő technikai tervezéssel.",
    shortDescEn:
      "Security technology for CCTV, access control and alarm processes, integrated into a site-specific security model with data-protection-aware technical design.",
  },
  "tavfelugyelet-vonuloszolgalat": {
    nameHu: "Távfelügyelet és vonulószolgálat",
    nameEn: "Remote Monitoring and Response Service",
    shortDescHu:
      "Távfelügyelet és vonulószolgálat jelzésfogadással, riasztás-verifikációval, eszkalációval, eseménynaplózással és egyeztetett reagálási folyamattal.",
    shortDescEn:
      "Remote monitoring and response service with signal reception, alarm verification, escalation, event logging and response process under agreed conditions.",
  },
  "mystery-shopping-helyszini-audit": {
    nameHu: "Próbavásárlás és szolgáltatásaudit",
    nameEn: "Mystery Shopping and Service Audit",
    shortDescHu:
      "Próbavásárlás és szolgáltatásaudit valós ügyfél- és működési helyzetekben, strukturált megfigyeléssel, riportálással és fejlesztési javaslatokkal.",
    shortDescEn:
      "Mystery shopping, service-quality checks and service audits in real customer and operational situations, with structured observation, reporting and improvement recommendations.",
  },
  rendezvenybiztositas: {
    nameHu: "Rendezvénybiztosítás",
    nameEn: "Event Security",
    shortDescHu:
      "Rendezvénybiztosítás vállalati, zártkörű és nyilvános eseményekre, beléptetéssel, közönségáramlás-támogatással, zónakezeléssel, incidensrögzítéssel és szervezői eszkalációval.",
    shortDescEn:
      "Event security for corporate, invitation-only and public events, with access handling, audience-flow support, zone management, incident reporting and organiser-defined escalation.",
  },
  "hard-fm": {
    nameHu: "Hard FM",
    nameEn: "Hard FM",
    shortDescHu:
      "Hard FM tervezett megelőző karbantartással, reaktív hibakezeléssel, szakcéges koordinációval, dokumentált hibanaplóval és működési riportálással.",
    shortDescEn:
      "Hard FM for planned preventive maintenance, reactive fault handling, specialist subcontractor coordination, documented fault logs and operations reporting.",
  },
  "soft-fm": {
    nameHu: "Soft FM",
    nameEn: "Soft FM",
    shortDescHu:
      "Soft FM takarítási, kertészeti, higiéniai, hulladékkezelési támogatási és szolgáltatókezelési feladatokra, egyeztetett scope-pal, minőségellenőrzéssel és írásos riportálással.",
    shortDescEn:
      "Soft FM for cleaning, landscaping, hygiene, waste-handling support and provider management, delivered to an agreed scope with quality checks and written reporting.",
  },
};

type ServiceRow = {
  id: number;
  slug: string;
  nameHu: string;
  nameEn: string | null;
  shortDescHu: string | null;
  shortDescEn: string | null;
};

type FieldChange = {
  field: DisplayField;
  before: string | null;
  after: string;
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
      "  tsx scripts/update-service-display-copy.ts --dry-run",
      "  tsx scripts/update-service-display-copy.ts --apply",
      "",
      "Run through npm so the external staging guard also runs:",
      "  npm run db:update-service-display-copy -- --dry-run",
      "  npm run db:update-service-display-copy -- --apply",
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

function formatValue(value: string | null): string {
  if (value === null) return "(null)";
  return value.length > 220 ? `${value.slice(0, 217)}...` : value;
}

function validateDisplayCopy(): void {
  const mapKeys = Object.keys(DISPLAY_COPY);
  const unknownKeys = mapKeys.filter((slug) => !isCanonicalSlug(slug));
  if (unknownKeys.length > 0) {
    usageAndExit(`unsupported service slug(s) in display copy map: ${formatList(unknownKeys)}`);
  }

  const missingKeys = CANONICAL_SERVICE_SLUGS.filter((slug) => !(slug in DISPLAY_COPY));
  if (missingKeys.length > 0) {
    usageAndExit(`display copy map is missing service slug(s): ${formatList(missingKeys)}`);
  }

  for (const slug of CANONICAL_SERVICE_SLUGS) {
    if (LEGACY_SERVICE_SLUGS.has(slug)) {
      usageAndExit(`legacy slug is not allowed as a target: ${slug}`);
    }

    const copy = DISPLAY_COPY[slug];
    for (const [field, value] of Object.entries(copy) as [DisplayField, string][]) {
      if (value.trim().length === 0) {
        usageAndExit(`${slug}.${field}: final value must not be blank`);
      }

      if (value.includes(EXACT_LICENSE_NUMBER)) {
        usageAndExit(`${slug}.${field}: exact licence number is not allowed in display copy`);
      }
    }
  }
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

function planUpdates(rowsBySlug: Map<CanonicalServiceSlug, ServiceRow>): PlannedUpdate[] {
  return CANONICAL_SERVICE_SLUGS.map((slug) => {
    const row = rowsBySlug.get(slug);
    if (!row) usageAndExit(`missing canonical service row: ${slug}`);

    const finalCopy = DISPLAY_COPY[slug];
    const fields: FieldChange[] = ([
      "nameHu",
      "nameEn",
      "shortDescHu",
      "shortDescEn",
    ] as const).map((field) => {
      const before = row[field];
      const after = finalCopy[field];

      return {
        field,
        before,
        after,
        changed: before !== after,
      };
    });

    return { row, slug, fields };
  });
}

function printPlan(plannedUpdates: readonly PlannedUpdate[]): void {
  for (const update of plannedUpdates) {
    console.log(`\n${update.slug}`);

    for (const field of update.fields) {
      console.log(`  ${field}: ${field.changed ? "change" : "skip"}`);
      console.log(`    before: ${formatValue(field.before)}`);
      console.log(`    after:  ${formatValue(field.after)}`);
    }
  }
}

function updatePayloadFor(fields: readonly FieldChange[]): Partial<Record<DisplayField, string>> {
  const payload: Partial<Record<DisplayField, string>> = {};

  for (const field of fields) {
    if (field.changed) {
      payload[field.field] = field.after;
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

  validateDisplayCopy();
  ensureStagingDbTarget({ scriptName: SCRIPT_NAME, isDryRun });

  const rows = await db
    .select({
      id: services.id,
      slug: services.slug,
      nameHu: services.nameHu,
      nameEn: services.nameEn,
      shortDescHu: services.shortDescHu,
      shortDescEn: services.shortDescEn,
    })
    .from(services)
    .where(inArray(services.slug, [...CANONICAL_SERVICE_SLUGS]));

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
    `Service display copy ${isDryRun ? "dry run" : "apply"} for ` +
      `${plannedUpdates.length} canonical services.`,
  );
  console.log(
    `Planned changes: ${changedRows.length} row(s), ${changedFields} field(s).`,
  );
  console.log(
    "Allowed write fields: nameHu, nameEn, shortDescHu, shortDescEn.",
  );
  console.log(
    "Fields not touched: slug, longDesc*, seo*, valueProposition*, highlights*, " +
      "useCases*, includedItems*, processSteps*, trustItems*, faq*, " +
      "relatedServiceSlugs, isPublished, isActive, sortOrder, icon, imageUrl, updatedAt.",
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
    const fields = Object.keys(payload) as DisplayField[];

    if (fields.length === 0) {
      console.log(`Skipped ${update.slug}; display copy already matches.`);
      continue;
    }

    await db.update(services).set(payload).where(eq(services.id, update.row.id));

    updatedRows += 1;
    updatedFields += fields.length;
    console.log(`Updated ${update.slug}: ${fields.join(", ")}`);
  }

  console.log(
    `\nApply complete. Updated ${updatedRows} service row(s), ` +
      `${updatedFields} display field(s). No other service fields were written.`,
  );
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`${SCRIPT_NAME}: failed: ${message}`);
  process.exit(1);
});
