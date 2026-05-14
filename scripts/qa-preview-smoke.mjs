#!/usr/bin/env node

const CANONICAL_SERVICE_PATHS = [
  "/hu/szolgaltatasok/objektumorzes",
  "/hu/szolgaltatasok/portaszolgalat",
  "/hu/szolgaltatasok/biztonsagtechnika",
  "/hu/szolgaltatasok/tavfelugyelet-vonuloszolgalat",
  "/hu/szolgaltatasok/mystery-shopping-helyszini-audit",
  "/hu/szolgaltatasok/rendezvenybiztositas",
  "/hu/szolgaltatasok/hard-fm",
  "/hu/szolgaltatasok/soft-fm",
];

const LEGACY_SERVICE_PATHS = [
  "/hu/szolgaltatasok/security",
  "/hu/szolgaltatasok/reception",
  "/hu/szolgaltatasok/building",
  "/hu/szolgaltatasok/technical",
  "/hu/szolgaltatasok/mystery",
  "/hu/szolgaltatasok/cleaning",
  "/hu/szolgaltatasok/hardfm",
  "/hu/szolgaltatasok/green",
];

const EXPECTED_200 = [
  "/hu",
  ...CANONICAL_SERVICE_PATHS,
  "/hu/hirek",
  "/sitemap.xml",
  "/robots.txt",
  "/llms.txt",
  "/llms-full.txt",
];

const EXPECTED_404 = [
  ...LEGACY_SERVICE_PATHS,
  "/en/szolgaltatasok/objektumorzes",
  "/de/szolgaltatasok/objektumorzes",
  "/zh/szolgaltatasok/objektumorzes",
  "/en/hirek",
  "/de/hirek",
  "/zh/hirek",
];

const SITEMAP_FORBIDDEN = [
  ...LEGACY_SERVICE_PATHS,
  "/en/szolgaltatasok/",
  "/de/szolgaltatasok/",
  "/zh/szolgaltatasok/",
  "/en/hirek",
  "/de/hirek",
  "/zh/hirek",
  "/admin",
  "/api",
];

const LLMS_FORBIDDEN_URLS = [
  ...LEGACY_SERVICE_PATHS,
  "/admin",
  "/api",
];

const UNAPPROVED_PARTNER_NAME_EXAMPLES = [
  "Prazi Hungaria",
  "LeasePlan",
  "Foxpost",
  "BMW Wallis",
];

const PRODUCTION_HOSTS = new Set(["www.afm.hu", "afm.hu"]);

function printUsage() {
  console.error(`
Usage:
  node scripts/qa-preview-smoke.mjs <base-url>
  npm run qa:preview -- <base-url>

Options:
  --allow-production   Allow running against https://www.afm.hu

Examples:
  node scripts/qa-preview-smoke.mjs https://avenir-website-git-staging-service-pages.vercel.app
  npm run qa:preview -- https://avenir-website-git-staging-service-pages.vercel.app
`);
}

function parseArgs(argv) {
  const args = argv.slice(2);
  const allowProduction = args.includes("--allow-production");
  const urlArg = args.find((arg) => !arg.startsWith("--"));

  if (!urlArg) {
    printUsage();
    process.exit(1);
  }

  let baseUrl;
  try {
    baseUrl = new URL(urlArg);
  } catch {
    console.error(`Invalid base URL: ${urlArg}`);
    process.exit(1);
  }

  if (!["http:", "https:"].includes(baseUrl.protocol)) {
    console.error("Base URL must use http or https.");
    process.exit(1);
  }

  baseUrl.pathname = baseUrl.pathname.replace(/\/+$/, "");
  baseUrl.search = "";
  baseUrl.hash = "";

  const host = baseUrl.hostname.toLowerCase();
  if (PRODUCTION_HOSTS.has(host) && !allowProduction) {
    console.error(
      "Refusing to run against production. Pass --allow-production only for an approved production smoke test.",
    );
    process.exit(1);
  }

  return { baseUrl, allowProduction };
}

function urlFor(baseUrl, path) {
  return new URL(path, baseUrl).toString();
}

async function fetchText(baseUrl, path) {
  const url = urlFor(baseUrl, path);
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "user-agent": "avenir-preview-smoke/1.0",
      accept: "text/html,application/xml,text/plain,*/*",
    },
  });
  const text = await response.text();
  return {
    path,
    url,
    finalUrl: response.url,
    status: response.status,
    ok: response.ok,
    text,
  };
}

async function checkStatus(baseUrl, path, expectedStatus) {
  try {
    const result = await fetchText(baseUrl, path);
    if (result.status !== expectedStatus) {
      return {
        ok: false,
        label: `${path} status`,
        detail: `expected ${expectedStatus}, got ${result.status} (${result.finalUrl})`,
      };
    }
    return { ok: true, label: `${path} status` };
  } catch (error) {
    return {
      ok: false,
      label: `${path} status`,
      detail: `request failed: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

function includesForbidden(text, needle) {
  if (!needle.startsWith("/")) {
    return text.includes(needle);
  }

  // Prefix checks intentionally catch whole URL spaces such as /admin/...
  // and /en/szolgaltatasok/..., while avoiding false positives where a legacy
  // slug is only the start of a canonical slug, for example:
  // /hu/szolgaltatasok/mystery-shopping-helyszini-audit.
  const pathBoundary = /[\s"'<>),?#/]/;
  const index = text.indexOf(needle);
  if (index === -1) return false;

  let cursor = index;
  while (cursor !== -1) {
    const nextChar = text[cursor + needle.length] ?? "";
    if (nextChar === "" || pathBoundary.test(nextChar)) return true;
    cursor = text.indexOf(needle, cursor + 1);
  }

  return false;
}

function checkContains({ text, path, required, forbidden }) {
  const failures = [];

  for (const needle of required) {
    if (!text.includes(needle)) {
      failures.push({
        ok: false,
        label: `${path} contains ${needle}`,
        detail: `missing expected content: ${needle}`,
      });
    }
  }

  for (const needle of forbidden) {
    if (includesForbidden(text, needle)) {
      failures.push({
        ok: false,
        label: `${path} excludes ${needle}`,
        detail: `found forbidden content: ${needle}`,
      });
    }
  }

  return failures;
}

async function checkSitemap(baseUrl) {
  const result = await fetchText(baseUrl, "/sitemap.xml");
  const failures = [];

  if (result.status !== 200) {
    failures.push({
      ok: false,
      label: "/sitemap.xml status",
      detail: `expected 200, got ${result.status}`,
    });
    return failures;
  }

  failures.push(
    ...checkContains({
      text: result.text,
      path: "/sitemap.xml",
      required: CANONICAL_SERVICE_PATHS,
      forbidden: SITEMAP_FORBIDDEN,
    }),
  );

  return failures;
}

async function checkLlmsFile(baseUrl, path) {
  const result = await fetchText(baseUrl, path);
  const failures = [];

  if (result.status !== 200) {
    failures.push({
      ok: false,
      label: `${path} status`,
      detail: `expected 200, got ${result.status}`,
    });
    return failures;
  }

  failures.push(
    ...checkContains({
      text: result.text,
      path,
      required: CANONICAL_SERVICE_PATHS,
      forbidden: [...LLMS_FORBIDDEN_URLS, ...UNAPPROVED_PARTNER_NAME_EXAMPLES],
    }),
  );

  return failures;
}

async function checkRobots(baseUrl, allowProduction) {
  const result = await fetchText(baseUrl, "/robots.txt");
  const failures = [];

  if (result.status !== 200) {
    failures.push({
      ok: false,
      label: "/robots.txt status",
      detail: `expected 200, got ${result.status}`,
    });
    return failures;
  }

  if (!allowProduction && !/^Disallow:\s*\/\s*$/im.test(result.text)) {
    failures.push({
      ok: false,
      label: "/robots.txt preview policy",
      detail: "expected Preview robots.txt to include Disallow: /",
    });
  }

  return failures;
}

function printResults({ baseUrl, failures, totalChecks }) {
  console.log(`Avenir Preview smoke test`);
  console.log(`Base URL: ${baseUrl.toString()}`);
  console.log(`Checks run: ${totalChecks}`);

  if (failures.length === 0) {
    console.log("Result: PASS");
    return;
  }

  console.log(`Result: FAIL (${failures.length} issue${failures.length === 1 ? "" : "s"})`);
  for (const failure of failures) {
    console.log(`- ${failure.label}: ${failure.detail}`);
  }
}

async function main() {
  const { baseUrl, allowProduction } = parseArgs(process.argv);
  const failures = [];
  let totalChecks = 0;

  const statusChecks = [
    ...EXPECTED_200.map((path) => ({ path, status: 200 })),
    ...EXPECTED_404.map((path) => ({ path, status: 404 })),
  ];

  const statusResults = await Promise.all(
    statusChecks.map(({ path, status }) => checkStatus(baseUrl, path, status)),
  );

  totalChecks += statusResults.length;
  failures.push(...statusResults.filter((result) => !result.ok));

  const sitemapFailures = await checkSitemap(baseUrl);
  totalChecks += 1 + CANONICAL_SERVICE_PATHS.length + SITEMAP_FORBIDDEN.length;
  failures.push(...sitemapFailures);

  for (const path of ["/llms.txt", "/llms-full.txt"]) {
    const llmsFailures = await checkLlmsFile(baseUrl, path);
    totalChecks +=
      1 +
      CANONICAL_SERVICE_PATHS.length +
      LLMS_FORBIDDEN_URLS.length +
      UNAPPROVED_PARTNER_NAME_EXAMPLES.length;
    failures.push(...llmsFailures);
  }

  const robotsFailures = await checkRobots(baseUrl, allowProduction);
  totalChecks += allowProduction ? 1 : 2;
  failures.push(...robotsFailures);

  printResults({ baseUrl, failures, totalChecks });
  process.exit(failures.length === 0 ? 0 : 1);
}

main().catch((error) => {
  console.error(
    `Smoke test failed unexpectedly: ${error instanceof Error ? error.message : String(error)}`,
  );
  process.exit(1);
});
