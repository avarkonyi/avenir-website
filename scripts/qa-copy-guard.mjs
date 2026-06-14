#!/usr/bin/env node

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = process.cwd();
const EXACT_LICENSE_NUMBER = "01030-822/4926-7/2023";

const SOURCE_ROOTS = ["app", "components", "lib", "public", "scripts"];
const TEXT_EXTENSIONS = new Set([".ts", ".tsx", ".mjs", ".js", ".txt"]);

const SERVICE_MARKETING_FILE = /^scripts\/seed-pilot-[^/]+\.ts$/;
const PUBLIC_SOURCE_FILE = /^(app|components|lib|public)\//;
const TRUST_CENTER_PUBLIC_SOURCE =
  /^(app\/\[locale\]\/(?:megfelelosegi-kozpont|trust-center)|components\/TrustCenterPage\.tsx|lib\/trust-center-content\.ts)/;

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
    name: "AutoWallis promotional endorsement overclaim",
    pattern: /AutoWallis\s+recommends\s+Avenir/i,
    appliesTo: isPublicSource,
  },
  {
    name: "BMW official-partner overclaim",
    pattern: /official\s+(?:partner|partnership)\s+of\s+BMW|official\s+BMW\s+(?:partner|partnership)/i,
    appliesTo: isPublicSource,
  },
  {
    name: "incident-free reference overclaim",
    pattern: /incident-free/i,
    appliesTo: isPublicSource,
    allowLine: isProtectiveGuaranteeLine,
  },
  {
    name: "best-in-class reference overclaim",
    pattern: /best-in-class/i,
    appliesTo: isPublicSource,
  },
  {
    name: "pending D&B proof surfaced in Trust Center",
    pattern: /\b(D&B High Creditworthy 2026|D&B magas hitelképességi minősítés)\b/i,
    appliesTo: isTrustCenterPublicSource,
  },
  {
    name: "pending liability insurance proof surfaced in Trust Center",
    pattern: /\b(Professional liability insurance|Szakmai felelősségbiztosítás)\b/i,
    appliesTo: isTrustCenterPublicSource,
  },
  {
    name: "stale ISO 27001 standard version in public proof source",
    pattern: /ISO\/IEC 27001:2022|ISO 27001:2022/i,
    appliesTo: isPublicProofSource,
  },
  {
    name: "stale generic ISO certification issuer in public proof source",
    pattern: /MARTON Szakértő Iroda/i,
    appliesTo: isPublicProofSource,
  },
  {
    name: "internal transfer evidence surfaced in Trust Center",
    pattern: /\b(DPA|SCC|LIA)\b/i,
    appliesTo: isTrustCenterPublicSource,
  },
  {
    name: "signed consent PDF surfaced in Trust Center",
    pattern: /\b(signed consent|aláírt referencia-hozzájárulás|consent PDF)\b/i,
    appliesTo: isTrustCenterPublicSource,
  },
  {
    name: "Trust Center reference testimonial/case-study wording",
    pattern: /\b(testimonial|case study|official BMW partner|incident-free)\b/i,
    appliesTo: isTrustCenterPublicSource,
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
    name: "legacy fixed response-time wording",
    pattern:
      /\b(2\s*munkanap(?:on(?: belül)?)?|két\s+munkanap|2\s*business\s+days|2\s*working\s+days|2-working-day|2\s*Werktag(?:e|en)?|2\s*Arbeitstag(?:e|en)?|2\s*个工作日|2\s*영업일)\b/i,
    appliesTo: isPublicSource,
    allowLine: isProtectiveResponseTimeLine,
  },
  {
    name: "24-hour response-time wording",
    pattern: /\b(within\s+24\s+hours|24\s+hours|24\s+órán(?:\s+belül)?)\b/i,
    appliesTo: isPublicSource,
    allowLine: isProtectiveResponseTimeLine,
  },
  {
    name: "guaranteed quote/response wording",
    pattern:
      /\b(guaranteed\s+(?:quote|response)|garantált\s+(?:ajánlat|válasz)|garantierte\s+(?:Antwort|Angebot))\b/i,
    appliesTo: isPublicSource,
    allowLine: isProtectiveResponseTimeLine,
  },
  {
    name: "next-business-day quote/service-start overclaim",
    pattern:
      /\b(quote\s+by\s+the\s+next\s+business\s+day|service\s+start\s+by\s+the\s+next\s+business\s+day)\b/i,
    appliesTo: isPublicSource,
    allowLine: isProtectiveResponseTimeLine,
  },
  {
    name: "public response-time SLA wording",
    pattern: /\bSLA\b/i,
    appliesTo: isPublicSource,
    allowLine: isProtectiveResponseTimeLine,
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
  // AI-search drift guards (narrow, scoped to public/llms*.txt only).
  {
    name: "stale AI-file claim: Hungarian-only service-detail layer",
    pattern: /service[- ]detail layer is Hungarian only/i,
    appliesTo: isLlmsFile,
  },
  {
    name: "private investigation licence surfaced as AI-search proof claim",
    pattern: /private investigation licence/i,
    appliesTo: isLlmsFile,
    allowLine: isPrivateInvestigationLegalOnlyLine,
  },
  {
    name: "private investigation marketing CTA or service promotion",
    pattern: /Request private investigation|Magánnyomozás ajánlatkérés|Private investigation services available/i,
    appliesTo: isPublicSource,
  },
];

function isPublicSource(file) {
  return PUBLIC_SOURCE_FILE.test(file) || SERVICE_MARKETING_FILE.test(file);
}

function isPublicProofSource(file) {
  return isPublicSource(file) && file !== "scripts/qa-copy-guard.mjs";
}

function isServiceMarketingSource(file) {
  return SERVICE_MARKETING_FILE.test(file);
}

function isLlmsFile(file) {
  return file.startsWith("public/llms");
}

function isTrustCenterPublicSource(file) {
  return TRUST_CENTER_PUBLIC_SOURCE.test(file);
}

function isProtectiveGuaranteeLine(line) {
  return /(\?|not|no universal|does not|without|nem jelent|nincs|függ|depends|provided\?)/i.test(
    line,
  );
}

function isProtectiveResponseTimeLine(line, file) {
  return (
    file === "scripts/qa-copy-guard.mjs" ||
    /\b(no|not|without|unless|do not|avoid|removed|blocks?|forbidden|protective|guard|non-SLA|SLA-like|nem|ne|nincs|nem\s+ígér|tilos|eltávolítva)\b/i.test(
      line,
    )
  );
}

function isProtectiveOptenLine(line) {
  return /\b(not|no|without|unless|do not|unapproved|separate|separately|nem|ne|külön|nem azonos)\b/i.test(
    line,
  );
}

function isPrivateInvestigationLegalOnlyLine(line) {
  return /legal\/regulatory information only|not (?:a )?(?:promoted public service|service route|contact-dropdown option|sales claim|marketing claim)|legal\/proof context only/i.test(
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
  return findCopyGuardFindings(file, text);
}

export function findCopyGuardFindings(file, text) {
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

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
