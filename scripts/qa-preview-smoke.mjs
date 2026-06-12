#!/usr/bin/env node

const CANONICAL_SERVICE_SLUGS = [
  "objektumorzes",
  "portaszolgalat",
  "biztonsagtechnika",
  "tavfelugyelet-vonuloszolgalat",
  "mystery-shopping-helyszini-audit",
  "rendezvenybiztositas",
  "hard-fm",
  "soft-fm",
];

const READY_SERVICE_LOCALES = ["hu", "en", "de"];
const UNREADY_SERVICE_LOCALES = ["zh", "ko"];
const SITEMAP_SERVICE_LOCALES = ["hu", "en"];
const SERVICE_SEGMENT = "szolgaltatasok";

const READY_SERVICE_PATHS = READY_SERVICE_LOCALES.flatMap((locale) =>
  CANONICAL_SERVICE_SLUGS.map((slug) => `/${locale}/${SERVICE_SEGMENT}/${slug}`),
);

const SITEMAP_SERVICE_PATHS = SITEMAP_SERVICE_LOCALES.flatMap((locale) =>
  CANONICAL_SERVICE_SLUGS.map((slug) => `/${locale}/${SERVICE_SEGMENT}/${slug}`),
);

const DE_REVIEW_SERVICE_PATHS = CANONICAL_SERVICE_SLUGS.map(
  (slug) => `/de/${SERVICE_SEGMENT}/${slug}`,
);

const NEWS_SLUG = "megujult-az-avenir-weboldala-es-arculata";
const INDEXABLE_NEWS_PATHS = [
  "/hu/hirek",
  `/hu/hirek/${NEWS_SLUG}`,
  "/en/hirek",
  `/en/hirek/${NEWS_SLUG}`,
];
const DE_REVIEW_NEWS_PATHS = [
  "/de/hirek",
  `/de/hirek/${NEWS_SLUG}`,
];
const UNPUBLISHED_NEWS_PATHS = [
  "/zh/hirek",
  `/zh/hirek/${NEWS_SLUG}`,
  "/ko/hirek",
  `/ko/hirek/${NEWS_SLUG}`,
  "/en/hirek/nem-letezo-hir",
  "/de/hirek/nem-letezo-hir",
];

const HU_SERVICE_PATHS = CANONICAL_SERVICE_SLUGS.map(
  (slug) => `/hu/${SERVICE_SEGMENT}/${slug}`,
);

const UNREADY_SERVICE_PATHS = UNREADY_SERVICE_LOCALES.flatMap((locale) =>
  CANONICAL_SERVICE_SLUGS.map((slug) => `/${locale}/${SERVICE_SEGMENT}/${slug}`),
);

const LEGACY_SERVICE_SLUGS = [
  "security",
  "reception",
  "building",
  "technical",
  "mystery",
  "cleaning",
  "hardfm",
  "green",
];

const LEGACY_SERVICE_PATHS = ["hu", "en", "de", "zh", "ko"].flatMap((locale) =>
  LEGACY_SERVICE_SLUGS.map((slug) => `/${locale}/${SERVICE_SEGMENT}/${slug}`),
);

const PUBLISHABLE_LEGAL_PATHS = [
  "/hu/adatvedelem",
  "/hu/aszf",
  "/hu/impresszum",
  "/en/adatvedelem",
  "/en/aszf",
  "/en/impresszum",
];

// Recruitment privacy notice (PL-091 Option B): locale-specific slug pair.
// The HU slug exists only on /hu, the EN slug only on /en — every other
// locale/slug combination must 404.
const RECRUITMENT_PRIVACY_PATHS = [
  "/hu/palyazoi-adatkezeles",
  "/en/recruitment-privacy",
];

const RECRUITMENT_PRIVACY_404_PATHS = [
  "/en/palyazoi-adatkezeles",
  "/de/palyazoi-adatkezeles",
  "/zh/palyazoi-adatkezeles",
  "/ko/palyazoi-adatkezeles",
  "/hu/recruitment-privacy",
  "/de/recruitment-privacy",
  "/zh/recruitment-privacy",
  "/ko/recruitment-privacy",
];

const DE_REVIEW_LEGAL_PATHS = [
  "/de/adatvedelem",
  "/de/aszf",
  "/de/impresszum",
];

const UNPUBLISHED_LEGAL_PATHS = [
  "/en/privacy",
  "/en/privacy-policy",
  "/en/terms",
  "/en/legal-notice",
  "/en/imprint",
  "/zh/adatvedelem",
  "/zh/aszf",
  "/zh/impresszum",
  "/ko/adatvedelem",
  "/ko/aszf",
  "/ko/impresszum",
];

const EXPECTED_200 = [
  "/hu",
  "/en",
  "/ko",
  ...READY_SERVICE_PATHS,
  ...PUBLISHABLE_LEGAL_PATHS,
  ...RECRUITMENT_PRIVACY_PATHS,
  ...DE_REVIEW_LEGAL_PATHS,
  ...INDEXABLE_NEWS_PATHS,
  ...DE_REVIEW_NEWS_PATHS,
  "/sitemap.xml",
  "/robots.txt",
  "/llms.txt",
  "/llms-full.txt",
  "/.well-known/security.txt",
];

const EXPECTED_404 = [
  ...LEGACY_SERVICE_PATHS,
  ...UNREADY_SERVICE_PATHS,
  ...UNPUBLISHED_LEGAL_PATHS,
  ...UNPUBLISHED_NEWS_PATHS,
  ...RECRUITMENT_PRIVACY_404_PATHS,
];

const SITEMAP_FORBIDDEN = [
  ...LEGACY_SERVICE_PATHS,
  "/de/szolgaltatasok/",
  "/zh/szolgaltatasok/",
  "/ko",
  "/ko/szolgaltatasok/",
  ...UNPUBLISHED_LEGAL_PATHS,
  ...DE_REVIEW_LEGAL_PATHS,
  "/de/hirek",
  "/zh/hirek",
  "/ko/hirek",
  "/admin",
  "/api",
];

const LLMS_FORBIDDEN_URLS = [
  ...LEGACY_SERVICE_PATHS,
  ...UNPUBLISHED_LEGAL_PATHS,
  ...DE_REVIEW_LEGAL_PATHS,
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
    headers: response.headers,
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
      required: [
        ...SITEMAP_SERVICE_PATHS,
        ...PUBLISHABLE_LEGAL_PATHS,
        ...RECRUITMENT_PRIVACY_PATHS,
        ...INDEXABLE_NEWS_PATHS,
      ],
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
      required: HU_SERVICE_PATHS,
      forbidden: [...LLMS_FORBIDDEN_URLS, ...UNAPPROVED_PARTNER_NAME_EXAMPLES],
    }),
  );

  return failures;
}

async function checkSecurityTxt(baseUrl) {
  const path = "/.well-known/security.txt";
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

  if (!/^Contact:\s*mailto:/im.test(result.text)) {
    failures.push({
      ok: false,
      label: `${path} Contact line`,
      detail: "expected at least one 'Contact: mailto:' line",
    });
  }

  if (!/^Expires:\s*\d{4}-\d{2}-\d{2}T/im.test(result.text)) {
    failures.push({
      ok: false,
      label: `${path} Expires line`,
      detail: "expected an 'Expires:' line with an ISO timestamp",
    });
  }

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

async function checkPreviewNoindexHeader(baseUrl, allowProduction) {
  if (allowProduction) return [];

  const result = await fetchText(baseUrl, "/hu");
  const header = result.headers.get("x-robots-tag") ?? "";
  const hasNoindex = /\bnoindex\b/i.test(header);
  const hasNofollow = /\bnofollow\b/i.test(header);

  if (hasNoindex && hasNofollow) return [];

  return [
    {
      ok: false,
      label: "Preview X-Robots-Tag",
      detail: `expected noindex, nofollow on /hu; got ${JSON.stringify(header)}`,
    },
  ];
}

async function checkDeReviewServiceNoindex(baseUrl) {
  const failures = [];

  for (const path of DE_REVIEW_SERVICE_PATHS) {
    const result = await fetchText(baseUrl, path);
    if (result.status !== 200) {
      failures.push({
        ok: false,
        label: `${path} review noindex`,
        detail: `expected 200 before checking noindex, got ${result.status}`,
      });
      continue;
    }

    const header = result.headers.get("x-robots-tag") ?? "";
    const metaMatch = result.text.match(
      /<meta\s+name=["']robots["'][^>]*content=["']([^"']+)["'][^>]*>/i,
    );
    const robots = `${header} ${metaMatch?.[1] ?? ""}`;
    const hasNoindex = /\bnoindex\b/i.test(robots);
    const hasFollow = /\bfollow\b/i.test(robots);

    if (!hasNoindex || !hasFollow) {
      failures.push({
        ok: false,
        label: `${path} review noindex`,
        detail: `expected robots noindex, follow; got ${JSON.stringify(robots.trim())}`,
      });
    }
  }

  return failures;
}

async function checkNoindexFollow(baseUrl, paths, labelPrefix) {
  const failures = [];

  for (const path of paths) {
    const result = await fetchText(baseUrl, path);
    if (result.status !== 200) {
      failures.push({
        ok: false,
        label: `${path} ${labelPrefix}`,
        detail: `expected 200 before checking noindex, got ${result.status}`,
      });
      continue;
    }

    const header = result.headers.get("x-robots-tag") ?? "";
    const metaMatch = result.text.match(
      /<meta\s+name=["']robots["'][^>]*content=["']([^"']+)["'][^>]*>/i,
    );
    const robots = `${header} ${metaMatch?.[1] ?? ""}`;
    const hasNoindex = /\bnoindex\b/i.test(robots);
    const hasFollow = /\bfollow\b/i.test(robots);

    if (!hasNoindex || !hasFollow) {
      failures.push({
        ok: false,
        label: `${path} ${labelPrefix}`,
        detail: `expected robots noindex, follow; got ${JSON.stringify(robots.trim())}`,
      });
    }
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
  totalChecks +=
    1 +
    SITEMAP_SERVICE_PATHS.length +
    PUBLISHABLE_LEGAL_PATHS.length +
    RECRUITMENT_PRIVACY_PATHS.length +
    SITEMAP_FORBIDDEN.length;
  failures.push(...sitemapFailures);

  for (const path of ["/llms.txt", "/llms-full.txt"]) {
    const llmsFailures = await checkLlmsFile(baseUrl, path);
    totalChecks +=
      1 +
      HU_SERVICE_PATHS.length +
      LLMS_FORBIDDEN_URLS.length +
      UNAPPROVED_PARTNER_NAME_EXAMPLES.length;
    failures.push(...llmsFailures);
  }

  const securityTxtFailures = await checkSecurityTxt(baseUrl);
  totalChecks += 3;
  failures.push(...securityTxtFailures);

  const robotsFailures = await checkRobots(baseUrl, allowProduction);
  totalChecks += allowProduction ? 1 : 2;
  failures.push(...robotsFailures);

  const noindexFailures = await checkPreviewNoindexHeader(
    baseUrl,
    allowProduction,
  );
  totalChecks += allowProduction ? 0 : 1;
  failures.push(...noindexFailures);

  const deReviewNoindexFailures = await checkDeReviewServiceNoindex(baseUrl);
  totalChecks += DE_REVIEW_SERVICE_PATHS.length;
  failures.push(...deReviewNoindexFailures);

  const deReviewLegalNoindexFailures = await checkNoindexFollow(
    baseUrl,
    DE_REVIEW_LEGAL_PATHS,
    "review legal noindex",
  );
  totalChecks += DE_REVIEW_LEGAL_PATHS.length;
  failures.push(...deReviewLegalNoindexFailures);

  const deReviewNewsNoindexFailures = await checkNoindexFollow(
    baseUrl,
    DE_REVIEW_NEWS_PATHS,
    "review news noindex",
  );
  totalChecks += DE_REVIEW_NEWS_PATHS.length;
  failures.push(...deReviewNewsNoindexFailures);

  printResults({ baseUrl, failures, totalChecks });
  process.exit(failures.length === 0 ? 0 : 1);
}

main().catch((error) => {
  console.error(
    `Smoke test failed unexpectedly: ${error instanceof Error ? error.message : String(error)}`,
  );
  process.exit(1);
});
