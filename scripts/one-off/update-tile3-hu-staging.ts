// One-off guarded staging updater for Tile 3 HU runtime content.
//
// Usage:
//   npx tsx scripts/one-off/update-tile3-hu-staging.ts --dry-run
//   npx tsx scripts/one-off/update-tile3-hu-staging.ts --apply
//
// Safety:
//   - staging DB only; runtime DB target guard runs before SELECT/UPDATE;
//   - never prints the full DATABASE_URL;
//   - targets exactly one service row by canonical slug;
//   - writes only services.nameHu, services.trustItemsHu and services.faqHu;
//   - skips already-updated values and aborts on duplicate/ambiguous matches.

import "../load-env";
import { eq } from "drizzle-orm";
import { ensureStagingDbTarget } from "../ensure-staging-db";
import { db, services } from "../../lib/db";

const SCRIPT_NAME = "one-off/update-tile3-hu-staging";
const TARGET_SLUG = "mystery-shopping-helyszini-audit";

const OLD_NAME_HU = "Mystery Shopping és helyszíni audit";
const NEW_NAME_HU = "Próbavásárlás és szolgáltatásaudit";

const TRUST_2_OLD_PHRASE = "megfigyelési vagy fegyelmi keretezés nélkül";
const TRUST_2_NEW_PHRASE = "felügyeleti vagy fegyelmi keretezés nélkül";

const TRUST_5_OLD_CANDIDATES = [
  "Személyes adatot érintő riportálás nem standard elem",
  "Személyes adatot érintő riportálás",
  "nem standard elem",
  "riportálás",
] as const;
const TRUST_5_FINAL_SENTENCE =
  "Az egyes munkatársakra vonatkozó adatok szerepeltetése nem alapértelmezett jelentési elem; ilyen tartalom csak előzetesen egyeztetett adatvédelmi keretek között jelenhet meg.";

const FAQ_Q2_OLD_CANDIDATES = [
  "Hogyan kerül meghatározásra és keretek között tartásra az audit scope-ja?",
  "meghatározásra",
  "keretek között tartásra",
  "audit scope",
] as const;
const FAQ_Q2_FINAL =
  "Hogyan határozzuk meg az audit scope-ját, és hogyan tartjuk a vizsgálatot az egyeztetett keretek között?";

type TrustItem = {
  title: string;
  body: string;
};

type FaqItem = {
  q: string;
  a: string;
};

type ServiceRow = {
  id: number;
  slug: string;
  nameHu: string;
  trustItemsHu: TrustItem[];
  faqHu: FaqItem[];
};

type ChangeStatus = "apply" | "skip" | "abort";

type PlannedChange = {
  key: "nameHu" | "trustItemsHu" | "faqHu";
  label: string;
  status: ChangeStatus;
  before?: string;
  after?: string;
  reason?: string;
  trustItemsHu?: TrustItem[];
  faqHu?: FaqItem[];
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
      "  npx tsx scripts/one-off/update-tile3-hu-staging.ts --dry-run",
      "  npx tsx scripts/one-off/update-tile3-hu-staging.ts --apply",
    ].join("\n"),
  );
  process.exit(1);
}

function nowIso(): string {
  return new Date().toISOString();
}

function summarise(value: string | undefined): string {
  if (!value) return "(none)";
  return value.length > 220 ? `${value.slice(0, 217)}...` : value;
}

function cloneTrustItems(value: TrustItem[]): TrustItem[] {
  return value.map((item) => ({ title: item.title, body: item.body }));
}

function cloneFaq(value: FaqItem[]): FaqItem[] {
  return value.map((item) => ({ q: item.q, a: item.a }));
}

function isTrustItem(value: unknown): value is TrustItem {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as { title?: unknown }).title === "string" &&
    typeof (value as { body?: unknown }).body === "string"
  );
}

function isFaqItem(value: unknown): value is FaqItem {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as { q?: unknown }).q === "string" &&
    typeof (value as { a?: unknown }).a === "string"
  );
}

function normalizeJsonArrays(row: {
  trustItemsHu: unknown;
  faqHu: unknown;
}): { trustItemsHu: TrustItem[]; faqHu: FaqItem[] } {
  if (!Array.isArray(row.trustItemsHu) || !row.trustItemsHu.every(isTrustItem)) {
    usageAndExit("target row trustItemsHu is not the expected { title, body }[] shape");
  }

  if (!Array.isArray(row.faqHu) || !row.faqHu.every(isFaqItem)) {
    usageAndExit("target row faqHu is not the expected { q, a }[] shape");
  }

  return {
    trustItemsHu: row.trustItemsHu,
    faqHu: row.faqHu,
  };
}

function planNameHu(row: ServiceRow): PlannedChange {
  if (row.nameHu === NEW_NAME_HU) {
    return {
      key: "nameHu",
      label: "Pass B nameHu runtime label",
      status: "skip",
      before: row.nameHu,
      after: NEW_NAME_HU,
      reason: "already updated",
    };
  }

  if (row.nameHu !== OLD_NAME_HU) {
    return {
      key: "nameHu",
      label: "Pass B nameHu runtime label",
      status: "skip",
      before: row.nameHu,
      after: NEW_NAME_HU,
      reason: "mismatch - current value is neither expected old nor final label",
    };
  }

  return {
    key: "nameHu",
    label: "Pass B nameHu runtime label",
    status: "apply",
    before: OLD_NAME_HU,
    after: NEW_NAME_HU,
  };
}

function findTrustBodyMatches(
  trustItemsHu: TrustItem[],
  predicate: (body: string) => boolean,
): number[] {
  return trustItemsHu
    .map((item, index) => (predicate(item.body) ? index : -1))
    .filter((index) => index >= 0);
}

function planTrust2(row: ServiceRow): PlannedChange {
  const finalMatches = findTrustBodyMatches(row.trustItemsHu, (body) =>
    body.includes(TRUST_2_NEW_PHRASE),
  );
  const oldMatches = findTrustBodyMatches(row.trustItemsHu, (body) =>
    body.includes(TRUST_2_OLD_PHRASE),
  );

  if (oldMatches.length > 1) {
    return {
      key: "trustItemsHu",
      label: "Pass A trust item #2 wording",
      status: "abort",
      reason: `multiple old-phrase matches at indexes ${oldMatches.join(", ")}`,
    };
  }

  if (oldMatches.length === 0) {
    return {
      key: "trustItemsHu",
      label: "Pass A trust item #2 wording",
      status: "skip",
      reason:
        finalMatches.length > 0
          ? "already updated"
          : "no expected old phrase found",
    };
  }

  const next = cloneTrustItems(row.trustItemsHu);
  const index = oldMatches[0];
  const before = next[index].body;
  next[index].body = before.replace(TRUST_2_OLD_PHRASE, TRUST_2_NEW_PHRASE);

  return {
    key: "trustItemsHu",
    label: `Pass A trust item #2 wording at index ${index}`,
    status: "apply",
    before,
    after: next[index].body,
    trustItemsHu: next,
  };
}

function planTrust5(row: ServiceRow): PlannedChange {
  const finalMatches = findTrustBodyMatches(row.trustItemsHu, (body) =>
    body.includes(TRUST_5_FINAL_SENTENCE),
  );

  if (finalMatches.length > 1) {
    return {
      key: "trustItemsHu",
      label: "Pass A trust item #5 wording",
      status: "abort",
      reason: `multiple final-text matches at indexes ${finalMatches.join(", ")}`,
    };
  }

  if (finalMatches.length === 1) {
    return {
      key: "trustItemsHu",
      label: "Pass A trust item #5 wording",
      status: "skip",
      reason: "already updated",
    };
  }

  const candidateMatches = findTrustBodyMatches(row.trustItemsHu, (body) =>
    TRUST_5_OLD_CANDIDATES.some((candidate) => body.includes(candidate)),
  );

  if (candidateMatches.length > 1) {
    return {
      key: "trustItemsHu",
      label: "Pass A trust item #5 wording",
      status: "abort",
      reason: `multiple candidate matches at indexes ${candidateMatches.join(", ")}`,
    };
  }

  if (candidateMatches.length === 0) {
    return {
      key: "trustItemsHu",
      label: "Pass A trust item #5 wording",
      status: "skip",
      reason:
        finalMatches.length > 0
          ? "already updated"
          : "no old/candidate phrase found",
    };
  }

  const next = cloneTrustItems(row.trustItemsHu);
  const index = candidateMatches[0];
  const before = next[index].body;
  const prefix =
    "A riportálás az egyeztetett scope-ra és a kijelölt megrendelői áttekintési folyamatra korlátozódik.";

  next[index].body = before.includes(prefix)
    ? `${prefix} ${TRUST_5_FINAL_SENTENCE}`
    : TRUST_5_FINAL_SENTENCE;

  return {
    key: "trustItemsHu",
    label: `Pass A trust item #5 wording at index ${index}`,
    status: "apply",
    before,
    after: next[index].body,
    trustItemsHu: next,
  };
}

function findFaqQuestionMatches(
  faqHu: FaqItem[],
  predicate: (question: string) => boolean,
): number[] {
  return faqHu
    .map((item, index) => (predicate(item.q) ? index : -1))
    .filter((index) => index >= 0);
}

function planFaqQ2(row: ServiceRow): PlannedChange {
  const finalMatches = findFaqQuestionMatches(row.faqHu, (question) =>
    question === FAQ_Q2_FINAL,
  );

  if (finalMatches.length > 1) {
    return {
      key: "faqHu",
      label: "Pass A FAQ Q2 question wording",
      status: "abort",
      reason: `multiple final-question matches at indexes ${finalMatches.join(", ")}`,
    };
  }

  if (finalMatches.length === 1) {
    return {
      key: "faqHu",
      label: "Pass A FAQ Q2 question wording",
      status: "skip",
      reason: "already updated",
    };
  }

  const candidateMatches = findFaqQuestionMatches(row.faqHu, (question) =>
    FAQ_Q2_OLD_CANDIDATES.some((candidate) => question.includes(candidate)),
  );

  if (candidateMatches.length > 1) {
    return {
      key: "faqHu",
      label: "Pass A FAQ Q2 question wording",
      status: "abort",
      reason: `multiple candidate matches at indexes ${candidateMatches.join(", ")}`,
    };
  }

  if (candidateMatches.length === 0) {
    return {
      key: "faqHu",
      label: "Pass A FAQ Q2 question wording",
      status: "skip",
      reason:
        finalMatches.length > 0 ? "already updated" : "no candidate question found",
    };
  }

  const next = cloneFaq(row.faqHu);
  const index = candidateMatches[0];
  const before = next[index].q;
  next[index].q = FAQ_Q2_FINAL;

  return {
    key: "faqHu",
    label: `Pass A FAQ Q2 question wording at index ${index}`,
    status: "apply",
    before,
    after: FAQ_Q2_FINAL,
    faqHu: next,
  };
}

function mergeTrustItemPlans(row: ServiceRow, plans: PlannedChange[]): TrustItem[] {
  let next = cloneTrustItems(row.trustItemsHu);

  for (const plan of plans) {
    if (plan.status === "apply" && plan.trustItemsHu) {
      next = plan.trustItemsHu;
    }
  }

  return next;
}

function printPlan(plans: PlannedChange[]): void {
  console.log("");
  console.log("Planned changes:");

  for (const plan of plans) {
    console.log(`\n${plan.label}`);
    console.log(`  status: ${plan.status}`);
    if (plan.reason) console.log(`  reason: ${plan.reason}`);
    if (plan.before !== undefined) console.log(`  before: ${summarise(plan.before)}`);
    if (plan.after !== undefined) console.log(`  after:  ${summarise(plan.after)}`);
  }
}

async function main(): Promise<void> {
  const isDryRun = hasArg("--dry-run");
  const isApply = hasArg("--apply");

  if (isDryRun && isApply) usageAndExit("use only one of --dry-run or --apply");

  const mode = isApply ? "apply" : "dry-run";
  ensureStagingDbTarget({ scriptName: SCRIPT_NAME, isDryRun: !isApply });

  const rows = await db
    .select({
      id: services.id,
      slug: services.slug,
      nameHu: services.nameHu,
      trustItemsHu: services.trustItemsHu,
      faqHu: services.faqHu,
    })
    .from(services)
    .where(eq(services.slug, TARGET_SLUG));

  if (rows.length === 0) {
    usageAndExit(`target service row is missing for slug=${TARGET_SLUG}`);
  }

  if (rows.length > 1) {
    usageAndExit(`duplicate service rows found for slug=${TARGET_SLUG}`);
  }

  const [rawRow] = rows;
  const normalized = normalizeJsonArrays(rawRow);
  const row: ServiceRow = {
    ...rawRow,
    trustItemsHu: normalized.trustItemsHu,
    faqHu: normalized.faqHu,
  };

  console.log("");
  console.log("Tile 3 HU staging updater");
  console.log(`  mode: ${mode}`);
  console.log(`  timestamp: ${nowIso()}`);
  console.log(`  service id: ${row.id}`);
  console.log(`  service slug: ${row.slug}`);
  console.log(`  current nameHu: ${row.nameHu}`);
  console.log(`  trustItemsHu count: ${row.trustItemsHu.length}`);
  console.log(`  faqHu count: ${row.faqHu.length}`);

  const namePlan = planNameHu(row);
  const trust2Plan = planTrust2(row);
  const rowAfterTrust2: ServiceRow =
    trust2Plan.status === "apply" && trust2Plan.trustItemsHu
      ? { ...row, trustItemsHu: trust2Plan.trustItemsHu }
      : row;
  const trust5Plan = planTrust5(rowAfterTrust2);
  const faqPlan = planFaqQ2(row);
  const plans = [namePlan, trust2Plan, trust5Plan, faqPlan];

  printPlan(plans);

  const aborts = plans.filter((plan) => plan.status === "abort");
  if (aborts.length > 0) {
    console.error("");
    console.error("Abort-level mismatch found. No database rows were updated.");
    for (const abort of aborts) {
      console.error(`  - ${abort.label}: ${abort.reason ?? "abort"}`);
    }
    process.exit(1);
  }

  const applicable = plans.filter((plan) => plan.status === "apply");
  const skipped = plans.filter((plan) => plan.status === "skip");

  console.log("");
  console.log("Summary:");
  console.log("  rows attempted: 1");
  console.log(`  changes applicable: ${applicable.length}`);
  console.log(`  changes skipped: ${skipped.length}`);

  if (!isApply) {
    console.log("  writes: 0 (dry-run)");
    return;
  }

  if (applicable.length === 0) {
    console.log("  writes: 0 (nothing to update)");
    return;
  }

  const updateValues: {
    nameHu?: string;
    trustItemsHu?: TrustItem[];
    faqHu?: FaqItem[];
  } = {};

  if (namePlan.status === "apply") updateValues.nameHu = NEW_NAME_HU;

  const trustPlans = [trust2Plan, trust5Plan];
  if (trustPlans.some((plan) => plan.status === "apply")) {
    updateValues.trustItemsHu = mergeTrustItemPlans(row, trustPlans);
  }

  if (faqPlan.status === "apply" && faqPlan.faqHu) {
    updateValues.faqHu = faqPlan.faqHu;
  }

  const changedFields = Object.keys(updateValues);
  if (changedFields.length === 0) {
    console.log("  writes: 0 (no allowed changed fields)");
    return;
  }

  await db.update(services).set(updateValues).where(eq(services.id, row.id));

  console.log(`  fields changed: ${changedFields.join(", ")}`);
  console.log("  rows updated: 1");
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`${SCRIPT_NAME}: failed: ${message}`);
  process.exit(1);
});
