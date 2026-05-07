#!/usr/bin/env node

import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";

const args = process.argv.slice(2);

function readArg(name, fallback) {
  const index = args.indexOf(name);
  if (index === -1) return fallback;
  return args[index + 1] ?? fallback;
}

function hasArg(name) {
  return args.includes(name);
}

const target = readArg("--target", "staging");
const envFile = readArg("--env-file", ".env.local");
const runtimeOnly = hasArg("--runtime-only");
const allowProduction = hasArg("--allow-production");

config({ path: envFile, quiet: true });

const expectedEndpoints = {
  staging: process.env.EXPECTED_STAGING_NEON_ENDPOINT ?? "ep-twilight-sound-al2b7jsb",
  production: process.env.EXPECTED_PRODUCTION_NEON_ENDPOINT ?? "ep-young-meadow-aln5ux5m",
};

if (!["staging", "production"].includes(target)) {
  console.error(`Unknown DB target "${target}". Use "staging" or "production".`);
  process.exit(1);
}

if (target === "production" && !allowProduction) {
  console.error("Production DB target requires --allow-production.");
  process.exit(1);
}

const expectedEndpoint = expectedEndpoints[target];
if (!expectedEndpoint) {
  console.error(`Expected endpoint for ${target} is not configured.`);
  process.exit(1);
}

const varsToCheck = runtimeOnly
  ? ["DATABASE_URL"]
  : ["DATABASE_URL", "DATABASE_URL_UNPOOLED"];

function endpointFromUrl(url) {
  try {
    const host = new URL(url).hostname;
    const match = host.match(/^(ep-[a-z0-9-]+?)(?:-pooler)?\./i);
    return match?.[1] ?? null;
  } catch {
    return null;
  }
}

function redactUrl(url) {
  try {
    const parsed = new URL(url);
    return `${parsed.protocol}//***:***@${parsed.hostname}${parsed.pathname}`;
  } catch {
    return "(invalid URL)";
  }
}

async function inspectConnection(name, url) {
  const sql = neon(url);
  const rows = await sql`
    SELECT
      current_setting('neon.endpoint_id', true) AS endpoint_id,
      current_setting('neon.branch_id', true) AS branch_id,
      current_database() AS database_name
  `;

  const row = rows[0] ?? {};
  const endpointId = row.endpoint_id || endpointFromUrl(url);

  return {
    name,
    endpointId,
    branchId: row.branch_id || "(unknown)",
    databaseName: row.database_name || "(unknown)",
    redactedUrl: redactUrl(url),
  };
}

const inspections = [];

for (const name of varsToCheck) {
  const value = process.env[name];
  if (!value) {
    console.error(`${name} env var is not set.`);
    process.exit(1);
  }

  try {
    inspections.push(await inspectConnection(name, value));
  } catch (error) {
    console.error(`${name} connection check failed.`);
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

let failed = false;

console.log(`DB target preflight: ${target}`);
console.log(`Env file: ${envFile}`);
console.log(`Expected Neon endpoint: ${expectedEndpoint}`);

for (const item of inspections) {
  console.log(
    `${item.name}: endpoint=${item.endpointId ?? "(unknown)"} branch=${item.branchId} db=${item.databaseName} url=${item.redactedUrl}`,
  );

  if (item.endpointId !== expectedEndpoint) {
    failed = true;
    console.error(
      `${item.name} points at ${item.endpointId ?? "(unknown)"}, expected ${expectedEndpoint}.`,
    );
  }
}

if (failed) {
  console.error("DB target preflight failed. Fix .env.local or Vercel env vars before continuing.");
  process.exit(1);
}

if (target === "production") {
  console.log("Production DB target explicitly allowed for this command.");
}

console.log("DB target preflight OK.");
