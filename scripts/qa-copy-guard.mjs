#!/usr/bin/env node

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const EXACT_LICENSE_NUMBER = "01030-822/4926-7/2023";

const SOURCE_ROOTS = ["app", "components", "lib", "public", "scripts"];
const TEXT_EXTENSIONS = new Set([".ts", ".tsx", ".mjs", ".js", ".txt"]);

const SERVICE_MARKETING_FILE = /^scripts\/seed-pilot-[^/]+\.ts$/;
const PUBLIC_SOURCE_FILE = /^(app|components|lib|public)\//;

const CHECKS = [
  {
    name: "stale Mystery Shopping label: EN on-site audits",
    pattern: /Mystery Shopping and On-site Audits/i,
    appliesTo: isPublicSource,
  },
  {
    name: "stale Mystery Shopping label: EN service audits plural",
    pattern: /Mystery Shopping and Service Audits/i,
    appliesTo: isPublicSource,
  },
  {
    name: "stale Mystery Shopping canonical HU label",
    pattern: /Mystery Shopping és helyszíni audit/i,
    appliesTo: isPublicSource,
  },
  {
    name: "stale Mystery service-description wording",
    pattern: /independent assessment/i,
    appliesTo: isPublicSource,
  },
  {
    name: "exact guarding licence number in service marketing copy",
    pattern: new RegExp(escapeRegExp(EXACT_LICENSE_NUMBER)),
    appliesTo: (file) => SERVICE_MARKETING_FILE.test(file),
  },
  {
    name: "EcoVadis as public claim",
    pattern: /\bEcoVadis\b/i,
    appliesTo: isPublicSource,
    allowLine: (line, file) =>
      /\b(no|not|without|unless|do not|unapproved|separately verified)\b/i.test(line) ||
      (file.startsWith("public/llms") && /\bclaims?\.?$/i.test(line.trim())),
  },
  {
    name: "OPTEN as public creditworthiness claim",
    pattern: /\bOPTEN\b/i,
    appliesTo: isPublicSource,
    allowLine: isProtectiveOptenLine,
  },
  {
    name: "A+ / Bonitási as public creditworthiness claim",
    pattern: /\b(A\+\s*(Bonit|creditworthiness|hitelképess|minősítés)|Bonit[áa]si)\b/i,
    appliesTo: isPublicSource,
    allowLine: isProtectiveOptenLine,
  },
  {
    name: "creditworthiness overclaim",
    pattern: /\b(risk-free|guaranteed solvency|guaranteed creditworthiness|kockázatmentes|garantált fizetőképesség|garantált hitelképesség)\b/i,
    appliesTo: isPublicSource,
    allowLine: isProtectiveGuaranteeLine,
  },
  {
    name: "positive guaranteed arrival-time wording",
    pattern: /guaranteed arrival time/i,
    appliesTo: isServiceMarketingSource,
    allowLine: isProtectiveGuaranteeLine,
  },
  {
    name: "positive guaranteed repair-time wording",
    pattern: /guaranteed repair time/i,
    appliesTo: isServiceMarketingSource,
    allowLine: isProtectiveGuaranteeLine,
  },
  {
    name: "positive GDPR compliance guarantee",
    pattern: /GDPR compliance guarantee/i,
    appliesTo: isServiceMarketingSource,
    allowLine: isProtectiveGuaranteeLine,
  },
  {
    name: "legal advice positioning",
    pattern: /legal advice/i,
    appliesTo: isServiceMarketingSource,
    allowLine: (line) => /\b(not|no)\s+legal advice\b/i.test(line),
  },
  {
    name: "rendőrségi / public-authority role in service marketing",
    pattern: /\b(police|public-authority|hatósági szerep|rendőrségi szerep)\b/i,
    appliesTo: isServiceMarketingSource,
  },
];

function isPublicSource(file) {
  return PUBLIC_SOURCE_FILE.test(file) || SERVICE_MARKETING_FILE.test(file);
}

function isServiceMarketingSource(file) {
  return SERVICE_MARKETING_FILE.test(file);
}

function isProtectiveGuaranteeLine(line) {
  return /(\?|not|no universal|does not|without|nem jelent|nincs|függ|depends|provided\?)/i.test(
    line,
  );
}

function isProtectiveOptenLine(line) {
  return /\b(not|no|without|unless|do not|unapproved|separate|separately|nem|ne|külön|nem azonos)\b/i.test(
    line,
  );
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function listFiles(dir) {
  const entries = await readdir(path.join(ROOT, dir), { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const relative = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".next") continue;
      files.push(...(await listFiles(relative)));
      continue;
    }

    if (!entry.isFile()) continue;
    if (!TEXT_EXTENSIONS.has(path.extname(entry.name))) continue;
    files.push(relative.replaceAll(path.sep, "/"));
  }

  return files;
}

function lineNumberAt(text, index) {
  return text.slice(0, index).split(/\n/).length;
}

async function scanFile(file) {
  const text = await readFile(path.join(ROOT, file), "utf8");
  const findings = [];

  for (const check of CHECKS) {
    if (!check.appliesTo(file)) continue;

    for (const match of text.matchAll(new RegExp(check.pattern, check.pattern.flags.includes("g") ? check.pattern.flags : `${check.pattern.flags}g`))) {
      const lineNumber = lineNumberAt(text, match.index ?? 0);
      const line = text.split(/\r?\n/)[lineNumber - 1] ?? "";
      if (check.allowLine?.(line, file)) continue;

      findings.push({
        file,
        line: lineNumber,
        check: check.name,
        snippet: line.trim().slice(0, 220),
      });
    }
  }

  return findings;
}

async function main() {
  const files = (await Promise.all(SOURCE_ROOTS.map(listFiles))).flat();
  const findings = (await Promise.all(files.map(scanFile))).flat();

  console.log("Avenir public copy guard");
  console.log(`Files scanned: ${files.length}`);
  console.log(`Checks run: ${CHECKS.length}`);

  if (findings.length === 0) {
    console.log("Result: PASS");
    return;
  }

  console.log(`Result: FAIL (${findings.length} finding${findings.length === 1 ? "" : "s"})`);
  for (const finding of findings) {
    console.log(
      `- ${finding.file}:${finding.line} ${finding.check}: ${finding.snippet}`,
    );
  }
  process.exitCode = 1;
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
