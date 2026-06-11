import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import {
  LAUNCH_NEWS_EN_SERVICE_LABEL_REPLACEMENTS,
  applyLaunchNewsEnServiceLabelTerminology,
} from "../scripts/launch-news-en-service-label-replacements";

// The updater script itself imports ./load-env and ../lib/db at module load,
// so its guard wiring is asserted on source text instead of by execution.
const SCRIPT_SOURCE = readFileSync(
  path.join(process.cwd(), "scripts", "update-launch-news-en-service-labels.ts"),
  "utf8",
);

test("launch news EN replacement list is exactly the four canonical service-name fixes", () => {
  assert.deepEqual(LAUNCH_NEWS_EN_SERVICE_LABEL_REPLACEMENTS, [
    {
      before: "manned guarding",
      after: "On-site Security Guarding",
    },
    {
      before: "reception and concierge services",
      after: "Reception and Gatehouse Services",
    },
    {
      before: "security technology solutions",
      after: "Security Technology",
    },
    {
      before: "remote monitoring and response services",
      after: "Remote Monitoring and Response Service",
    },
  ]);
});

test("launch news EN terminology transform rewrites the live service enumeration fully", () => {
  const body =
    "The new website presents our main service areas in a cleaner structure: " +
    "manned guarding, reception and concierge services, security technology " +
    "solutions, remote monitoring and response services, as well as related " +
    "Soft FM and Hard FM support.";

  const next = applyLaunchNewsEnServiceLabelTerminology(body);

  assert.equal(
    next,
    "The new website presents our main service areas in a cleaner structure: " +
      "On-site Security Guarding, Reception and Gatehouse Services, Security " +
      "Technology, Remote Monitoring and Response Service, as well as related " +
      "Soft FM and Hard FM support.",
  );
  // idempotent: re-running on canonical text changes nothing
  assert.equal(applyLaunchNewsEnServiceLabelTerminology(next), next);
});

test("launch news EN updater defaults to dry-run and writes only with --apply", () => {
  // dry-run is the default when --apply is absent
  assert.ok(SCRIPT_SOURCE.includes("const isDryRun = !isApply;"));
  // the dry-run branch returns before any db.update call
  assert.ok(
    SCRIPT_SOURCE.indexOf("Dry run only. No database rows were updated.") <
      SCRIPT_SOURCE.indexOf("db.update(news)"),
  );
  // production needs the explicit target + allow flags via the shared guard
  assert.ok(SCRIPT_SOURCE.includes("ensureDbTarget("));
  assert.ok(SCRIPT_SOURCE.includes("--target production --allow-production"));
});

test("launch news EN updater writes only news.bodyEn and never other locale bodies", () => {
  const setCalls = SCRIPT_SOURCE.match(/\.set\(\{[^}]*\}\)/g) ?? [];
  assert.equal(setCalls.length, 1);
  assert.equal(setCalls[0], ".set({ bodyEn: nextBodyEn })");
  // HU/DE/ZH locale bodies (and any future KO column) are not write targets
  assert.equal(/\.set\(\{[^}]*body(Hu|De|Zh|Ko)/.test(SCRIPT_SOURCE), false);
  // title/lead/slug/date/published fields are not write targets either
  assert.equal(
    /\.set\(\{[^}]*(title|lead|slug|date|published|imageUrl)/.test(
      SCRIPT_SOURCE,
    ),
    false,
  );
});
