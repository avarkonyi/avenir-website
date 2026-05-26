#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { config as loadDotenv } from "dotenv";

loadDotenv({ path: ".env.local", quiet: true });
loadDotenv({ quiet: true });

const PRODUCTION_HOSTS = new Set(["www.afm.hu", "afm.hu"]);

function printUsage() {
  console.error(`
Usage:
  npm run qa:analytics
  npm run qa:analytics -- <base-url>
  npm run qa:analytics -- https://www.afm.hu --allow-production

Environment:
  ANALYTICS_QA_BASE_URL              Base URL when no CLI URL is provided.
  ANALYTICS_QA_ALLOW_PRODUCTION=1    Allow production target.
  NEXT_PUBLIC_GA4_ID                 Expected GA4 Measurement ID.
`);
}

function parseArgs(argv) {
  const args = argv.slice(2);
  let baseUrlArg = process.env.ANALYTICS_QA_BASE_URL || "http://localhost:3000";
  let allowProduction = process.env.ANALYTICS_QA_ALLOW_PRODUCTION === "1";
  let hasCliBaseUrl = false;
  const playwrightArgs = [];

  for (const arg of args) {
    if (arg === "--allow-production") {
      allowProduction = true;
      continue;
    }

    if (!arg.startsWith("--") && !hasCliBaseUrl) {
      baseUrlArg = arg;
      hasCliBaseUrl = true;
      continue;
    }

    playwrightArgs.push(arg);
  }

  let baseUrl;
  try {
    baseUrl = new URL(baseUrlArg);
  } catch {
    printUsage();
    console.error(`Invalid base URL: ${baseUrlArg}`);
    process.exit(1);
  }

  if (!["http:", "https:"].includes(baseUrl.protocol)) {
    printUsage();
    console.error("Base URL must use http or https.");
    process.exit(1);
  }

  baseUrl.pathname = baseUrl.pathname.replace(/\/+$/, "");
  baseUrl.search = "";
  baseUrl.hash = "";

  const host = baseUrl.hostname.toLowerCase();
  if (PRODUCTION_HOSTS.has(host) && !allowProduction) {
    console.error(
      "Refusing to run analytics QA against production. Pass --allow-production only for an approved production test.",
    );
    process.exit(1);
  }

  return { baseUrl, allowProduction, playwrightArgs };
}

const { baseUrl, allowProduction, playwrightArgs } = parseArgs(process.argv);

const result = spawnSync(
  "npx",
  ["playwright", "test", "tests/analytics-consent.spec.ts", ...playwrightArgs],
  {
    stdio: "inherit",
    shell: process.platform === "win32",
    env: {
      ...process.env,
      ANALYTICS_QA_BASE_URL: baseUrl.toString(),
      ANALYTICS_QA_ALLOW_PRODUCTION: allowProduction ? "1" : "",
    },
  },
);

process.exit(result.status ?? 1);
