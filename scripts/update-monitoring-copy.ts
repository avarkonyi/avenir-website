// Narrow CMS updater. Run verify-db-target.mjs for the intended environment first.
// Defaults to staging and dry-run. Production also needs --allow-production.
// Usage: node node_modules/tsx/dist/cli.mjs scripts/update-monitoring-copy.ts --dry-run
// Add --apply only after reviewing the proposal and receiving write approval.
import "./load-env";
import { and, eq, sql } from "drizzle-orm";
import { ensureDbTarget, readDbTargetArgs } from "./ensure-staging-db";
import {
  MONITORING_SERVICE_ID,
  MONITORING_SERVICE_SLUG,
  MonitoringCopyPatchError,
  planMonitoringCopyPatch,
} from "./monitoring-copy-patch";

const SCRIPT_NAME = "update-monitoring-copy";
class MonitoringCopyUpdateError extends Error {}

function readOptions() {
  const args = process.argv.slice(2);
  const seen = new Set<string>();
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (!["--dry-run", "--apply", "--target", "--allow-production"].includes(arg) || seen.has(arg)) {
      throw new MonitoringCopyUpdateError("Unknown or duplicate argument. Use --dry-run or --apply, and optionally --target staging|production --allow-production.");
    }
    seen.add(arg);
    if (arg === "--target") {
      const target = args[index + 1];
      if (target !== "staging" && target !== "production") {
        throw new MonitoringCopyUpdateError("Expected --target staging or --target production.");
      }
      index += 1;
    }
  }
  if (seen.has("--dry-run") && seen.has("--apply")) {
    throw new MonitoringCopyUpdateError("Use only one of --dry-run or --apply.");
  }
  const { target, allowProduction } = readDbTargetArgs();
  if (target === "staging" && allowProduction) {
    throw new MonitoringCopyUpdateError("--allow-production requires --target production.");
  }
  return { target, allowProduction, isDryRun: !seen.has("--apply") };
}

async function main(): Promise<void> {
  const options = readOptions();
  ensureDbTarget({ scriptName: SCRIPT_NAME, ...options });
  // Keep client initialization inside the sanitized failure boundary and after
  // the target guard; importing the pure planner never connects to the DB.
  const { db, services } = await import("../lib/db");
  const rows = await db.select({
    id: services.id,
    slug: services.slug,
    valuePropositionHu: services.valuePropositionHu,
    valuePropositionEn: services.valuePropositionEn,
    longDescHu: services.longDescHu,
    longDescEn: services.longDescEn,
    faqHu: services.faqHu,
    faqEn: services.faqEn,
  }).from(services).where(and(
    eq(services.id, MONITORING_SERVICE_ID),
    eq(services.slug, MONITORING_SERVICE_SLUG),
  ));
  if (rows.length !== 1) {
    throw new MonitoringCopyUpdateError("Expected exactly one canonical monitoring service row.");
  }
  const plan = planMonitoringCopyPatch(rows[0]);
  console.log(`Monitoring copy ${options.isDryRun ? "dry-run" : "apply"}: target=${options.target}, id=${MONITORING_SERVICE_ID}, slug=${MONITORING_SERVICE_SLUG}.`);
  console.log(`Plan: ${plan.status}; ${Object.keys(plan.values).length} changed columns.`);
  for (const fragment of plan.fragments) {
    console.log(`\n${fragment.path}: ${fragment.state}`);
    console.log(`  Approved before fragment: ${fragment.before}`);
    console.log(`  Approved after fragment:  ${fragment.after}`);
  }
  if (plan.status === "already-applied") {
    console.log("\nAll eight fragments already match. No database write performed.");
    return;
  }
  if (options.isDryRun) {
    console.log("\nDry run only. No database write performed.");
    return;
  }

  const before = plan.before;
  // One atomic UPDATE. Compare full selected columns so intervening CMS edits,
  // including unrelated FAQ answers, cannot be silently overwritten.
  const updated = await db.update(services).set(plan.values).where(and(
    eq(services.id, before.id),
    eq(services.slug, before.slug),
    eq(services.valuePropositionHu, before.valuePropositionHu),
    eq(services.valuePropositionEn, before.valuePropositionEn),
    eq(services.longDescHu, before.longDescHu),
    eq(services.longDescEn, before.longDescEn),
    sql`${services.faqHu} = ${JSON.stringify(before.faqHu)}::jsonb`,
    sql`${services.faqEn} = ${JSON.stringify(before.faqEn)}::jsonb`,
  )).returning({ id: services.id });
  if (updated.length !== 1 || updated[0].id !== MONITORING_SERVICE_ID) {
    throw new MonitoringCopyUpdateError("Compare-and-set did not update the expected row. Content may have changed; review a fresh dry-run before retrying.");
  }
  console.log("\nUpdated one monitoring service row, six content columns. Re-run dry-run and verify public cache refresh separately.");
}

main().catch((error: unknown) => {
  // Driver errors can contain SQL parameters, connection URLs or credentials.
  // Only our fixed validation messages may be printed; never serialize errors.
  const message = error instanceof MonitoringCopyPatchError || error instanceof MonitoringCopyUpdateError
    ? error.message
    : "Operation failed. Database or environment details were withheld. Verify the target and inspect a fresh dry-run before any retry.";
  console.error(`${SCRIPT_NAME}: ${message}`);
  process.exitCode = 1;
});
