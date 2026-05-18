import { execFileSync } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

type Locale = "hu" | "en";

type CliOptions = {
  base: string;
  outDir: string;
  locales: Locale[];
  includeSitemap: boolean;
};

type PageExport = {
  url: string;
  finalUrl: string;
  status: number | null;
  redirected: boolean;
  title: string;
  metaDescription: string;
  renderedText: string;
  error?: string;
};

const DEFAULT_OUT_DIR = "docs/review";
const DEFAULT_LOCALES: Locale[] = ["hu", "en"];

const SERVICE_SLUGS = [
  "objektumorzes",
  "portaszolgalat",
  "biztonsagtechnika",
  "tavfelugyelet-vonuloszolgalat",
  "mystery-shopping-helyszini-audit",
  "rendezvenybiztositas",
  "hard-fm",
  "soft-fm",
] as const;

const SERVICE_SLUG_SET = new Set<string>(SERVICE_SLUGS);
const FETCH_TIMEOUT_MS = 30_000;

function usage(): string {
  return [
    "Usage:",
    "  npx tsx scripts/export-public-copy-review.ts --base <preview-or-site-url>",
    "",
    "Options:",
    "  --base <url>          Required preview or site base URL.",
    "  --out-dir <path>      Output directory. Default: docs/review",
    "  --locales <list>      Comma-separated locales. Default: hu,en",
    "  --include-sitemap     Include public URLs discovered from sitemap.xml. Default: on",
    "  --no-sitemap          Skip sitemap discovery and export manual homepage/service URLs only.",
  ].join("\n");
}

function parseArgs(argv: string[]): CliOptions {
  let base = "";
  let outDir = DEFAULT_OUT_DIR;
  let locales = DEFAULT_LOCALES;
  let includeSitemap = true;

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      console.log(usage());
      process.exit(0);
    }
    if (arg === "--base") {
      base = argv[++i] ?? "";
      continue;
    }
    if (arg === "--out-dir") {
      outDir = argv[++i] ?? "";
      continue;
    }
    if (arg === "--locales") {
      const raw = argv[++i] ?? "";
      locales = parseLocales(raw);
      continue;
    }
    if (arg === "--include-sitemap") {
      includeSitemap = true;
      continue;
    }
    if (arg === "--no-sitemap") {
      includeSitemap = false;
      continue;
    }
    throw new Error(`Unknown argument: ${arg}\n\n${usage()}`);
  }

  if (!base) {
    throw new Error(`Missing required --base argument.\n\n${usage()}`);
  }
  if (!outDir) {
    throw new Error("Missing value for --out-dir.");
  }

  return {
    base: normaliseBase(base),
    outDir,
    locales,
    includeSitemap,
  };
}

function parseLocales(raw: string): Locale[] {
  const values = raw
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  if (values.length === 0) {
    throw new Error("--locales must include at least one locale.");
  }

  const invalid = values.filter((value) => value !== "hu" && value !== "en");
  if (invalid.length > 0) {
    throw new Error(
      `Unsupported locale(s): ${invalid.join(", ")}. This review export supports hu,en only.`,
    );
  }

  return Array.from(new Set(values)) as Locale[];
}

function normaliseBase(raw: string): string {
  const parsed = new URL(raw);
  parsed.pathname = parsed.pathname.replace(/\/+$/, "");
  parsed.search = "";
  parsed.hash = "";
  return parsed.toString().replace(/\/+$/, "");
}

function buildUrl(base: string, pathname: string): string {
  return new URL(pathname, `${base}/`).toString();
}

function localePath(locale: Locale, suffix = ""): string {
  return `/${locale}${suffix}`;
}

function manualLocaleUrls(base: string, locale: Locale): string[] {
  return [
    buildUrl(base, localePath(locale)),
    ...SERVICE_SLUGS.map((slug) =>
      buildUrl(base, localePath(locale, `/szolgaltatasok/${slug}`)),
    ),
  ];
}

async function fetchText(url: string): Promise<{
  status: number;
  finalUrl: string;
  redirected: boolean;
  text: string;
}> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "user-agent": "avenir-public-copy-review/1.0",
        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    return {
      status: response.status,
      finalUrl: response.url || url,
      redirected: response.redirected,
      text: await response.text(),
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function discoverSitemapUrls(
  base: string,
  locales: Locale[],
): Promise<{ urls: string[]; note?: string }> {
  const sitemapUrl = buildUrl(base, "/sitemap.xml");
  try {
    const response = await fetchText(sitemapUrl);
    if (response.status !== 200) {
      return {
        urls: [],
        note: `Sitemap returned ${response.status}: ${sitemapUrl}`,
      };
    }

    const locs = [...response.text.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)]
      .map((match) => decodeEntities(match[1]?.trim() ?? ""))
      .filter(Boolean);

    return {
      urls: locs
        .map((loc) => mapSitemapLocToBase(base, loc))
        .filter((url): url is string => Boolean(url))
        .filter((url) => shouldIncludePublicUrl(url, locales)),
    };
  } catch (error) {
    return {
      urls: [],
      note: `Sitemap fetch failed: ${sitemapUrl} (${errorMessage(error)})`,
    };
  }
}

function mapSitemapLocToBase(base: string, loc: string): string | null {
  try {
    const locUrl = new URL(loc);
    return buildUrl(base, `${locUrl.pathname}${locUrl.search}`);
  } catch {
    try {
      return buildUrl(base, loc.startsWith("/") ? loc : `/${loc}`);
    } catch {
      return null;
    }
  }
}

function shouldIncludePublicUrl(url: string, locales: Locale[]): boolean {
  const parsed = new URL(url);
  const pathname = normalisePathname(parsed.pathname);
  const parts = pathname.split("/").filter(Boolean);
  const locale = parts[0];

  if (!locale || !locales.includes(locale as Locale)) return false;
  if (pathname.startsWith(`/${locale}/admin`)) return false;
  if (pathname.startsWith(`/${locale}/api`)) return false;
  if (pathname.includes("/_next/")) return false;
  if (isInternalOrAssetPath(pathname)) return false;

  if (parts[1] === "szolgaltatasok") {
    return parts.length === 3 && SERVICE_SLUG_SET.has(parts[2] ?? "");
  }

  return true;
}

function normalisePathname(pathname: string): string {
  if (pathname === "/") return pathname;
  return pathname.replace(/\/+$/, "");
}

function isInternalOrAssetPath(pathname: string): boolean {
  if (
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname === "/favicon.ico"
  ) {
    return true;
  }

  return /\.(?:avif|css|gif|ico|jpeg|jpg|js|json|map|mp4|pdf|png|svg|txt|webm|webp|woff2?|xml|zip)$/i.test(
    pathname,
  );
}

function uniqueSortedUrls(
  manual: string[],
  discovered: string[],
  locale: Locale,
): string[] {
  const seen = new Set<string>();
  const ordered: string[] = [];

  for (const url of manual) {
    const normalised = normaliseUrlForSet(url);
    if (!seen.has(normalised)) {
      seen.add(normalised);
      ordered.push(url);
    }
  }

  const extra = discovered
    .filter((url) => new URL(url).pathname.startsWith(`/${locale}`))
    .sort((a, b) => new URL(a).pathname.localeCompare(new URL(b).pathname));

  for (const url of extra) {
    const normalised = normaliseUrlForSet(url);
    if (!seen.has(normalised)) {
      seen.add(normalised);
      ordered.push(url);
    }
  }

  return ordered;
}

function normaliseUrlForSet(url: string): string {
  const parsed = new URL(url);
  parsed.hash = "";
  parsed.search = "";
  parsed.pathname = normalisePathname(parsed.pathname);
  return parsed.toString();
}

async function exportPage(url: string): Promise<PageExport> {
  try {
    const response = await fetchText(url);
    const isHtml = /<html[\s>]/i.test(response.text);
    const title = isHtml ? extractTitle(response.text) : "";
    const metaDescription = isHtml ? extractMetaDescription(response.text) : "";
    const renderedText = isHtml ? extractVisibleText(response.text) : "";

    return {
      url,
      finalUrl: response.finalUrl,
      status: response.status,
      redirected: response.redirected || response.finalUrl !== url,
      title,
      metaDescription,
      renderedText,
      error: response.status === 200 ? undefined : `HTTP ${response.status}`,
    };
  } catch (error) {
    return {
      url,
      finalUrl: url,
      status: null,
      redirected: false,
      title: "",
      metaDescription: "",
      renderedText: "",
      error: errorMessage(error),
    };
  }
}

function extractTitle(html: string): string {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return cleanupInlineText(match?.[1] ?? "");
}

function extractMetaDescription(html: string): string {
  const metaTags = html.match(/<meta\b[^>]*>/gi) ?? [];

  for (const tag of metaTags) {
    const attributes = parseAttributes(tag);
    const name = attributes.get("name")?.toLowerCase();
    if (name === "description") {
      return cleanupInlineText(attributes.get("content") ?? "");
    }
  }

  for (const tag of metaTags) {
    const attributes = parseAttributes(tag);
    const property = attributes.get("property")?.toLowerCase();
    if (property === "og:description") {
      return cleanupInlineText(attributes.get("content") ?? "");
    }
  }

  return "";
}

function parseAttributes(tag: string): Map<string, string> {
  const attributes = new Map<string, string>();
  const pattern =
    /([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/g;
  for (const match of tag.matchAll(pattern)) {
    attributes.set(
      match[1]?.toLowerCase() ?? "",
      decodeEntities(match[2] ?? match[3] ?? match[4] ?? ""),
    );
  }
  return attributes;
}

function extractVisibleText(html: string): string {
  const body = firstElementContent(html, "main") ?? firstElementContent(html, "body") ?? html;
  let work = body;

  work = work.replace(/<!--[\s\S]*?-->/g, " ");
  work = removeElement(work, "script");
  work = removeElement(work, "style");
  work = removeElement(work, "noscript");
  work = removeElement(work, "svg");
  work = removeElement(work, "template");
  work = removeElement(work, "canvas");
  work = removeHiddenElementLikeBlocks(work);

  work = work.replace(
    /<(br|hr)\b[^>]*>/gi,
    "\n",
  );
  work = work.replace(
    /<\/?(?:article|aside|blockquote|button|caption|dd|div|dl|dt|figcaption|figure|footer|form|h[1-6]|header|li|main|nav|ol|p|section|summary|table|tbody|td|tfoot|th|thead|tr|ul)\b[^>]*>/gi,
    "\n",
  );
  work = work.replace(/<[^>]+>/g, " ");
  work = decodeEntities(work);

  return work
    .split(/\n+/)
    .map((line) => line.replace(/[ \t\f\v]+/g, " ").trim())
    .filter(Boolean)
    .join("\n");
}

function firstElementContent(html: string, tagName: string): string | null {
  const pattern = new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "i");
  return html.match(pattern)?.[1] ?? null;
}

function removeElement(html: string, tagName: string): string {
  const pattern = new RegExp(`<${tagName}\\b[^>]*>[\\s\\S]*?<\\/${tagName}>`, "gi");
  return html.replace(pattern, " ");
}

function removeHiddenElementLikeBlocks(html: string): string {
  return html.replace(
    /<([a-z0-9-]+)\b(?=[^>]*(?:hidden\b|aria-hidden\s*=\s*["']?true|display\s*:\s*none|visibility\s*:\s*hidden))[^>]*>[\s\S]*?<\/\1>/gi,
    " ",
  );
}

function cleanupInlineText(raw: string): string {
  return decodeEntities(raw.replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function decodeEntities(raw: string): string {
  const named: Record<string, string> = {
    amp: "&",
    apos: "'",
    copy: "(c)",
    gt: ">",
    hellip: "...",
    laquo: "<<",
    ldquo: "\"",
    lsquo: "'",
    lt: "<",
    nbsp: " ",
    ndash: "-",
    mdash: "-",
    quot: "\"",
    raquo: ">>",
    rdquo: "\"",
    reg: "(r)",
    rsquo: "'",
  };

  return raw.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]+);/g, (entity, code: string) => {
    if (code.startsWith("#x") || code.startsWith("#X")) {
      const value = Number.parseInt(code.slice(2), 16);
      return Number.isFinite(value) ? String.fromCodePoint(value) : entity;
    }
    if (code.startsWith("#")) {
      const value = Number.parseInt(code.slice(1), 10);
      return Number.isFinite(value) ? String.fromCodePoint(value) : entity;
    }
    return named[code] ?? entity;
  });
}

function renderMarkdown(
  locale: Locale,
  base: string,
  urls: string[],
  pages: PageExport[],
  sitemapNote?: string,
): string {
  const failed = pages.filter((page) => page.status !== 200 || page.error);
  const lines: string[] = [];

  lines.push(`# Avenir public copy export - ${locale.toUpperCase()}`);
  lines.push("");
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push(`Base URL: ${base}`);
  lines.push(`Commit if available: ${readCommit()}`);
  lines.push(`Locale: ${locale}`);
  lines.push(`URL count: ${urls.length}`);
  lines.push("");
  lines.push("## Coverage");
  lines.push("");
  for (const url of urls) {
    lines.push(`- ${url}`);
  }
  lines.push("");
  lines.push("## Skipped / failed URLs");
  lines.push("");
  if (sitemapNote) {
    lines.push(`- Sitemap note: ${sitemapNote}`);
  }
  if (failed.length === 0) {
    lines.push("- None");
  } else {
    for (const page of failed) {
      const status = page.status === null ? "fetch failed" : `status ${page.status}`;
      lines.push(`- ${page.url} (${status}${page.error ? `: ${page.error}` : ""})`);
    }
  }
  lines.push("");
  lines.push("## Quality notes");
  lines.push("");
  lines.push(
    "- FAQ answers are exported when they are present in the server-rendered HTML. If an accordion renders answers only after client interaction, use visual review for those answers.",
  );
  lines.push(
    "- Header/footer or repeated navigation text may appear where it is part of the rendered HTML; it is kept for review completeness.",
  );

  for (const page of pages) {
    lines.push("");
    lines.push("---");
    lines.push("");
    lines.push(`## Page: ${page.title || "(untitled)"}`);
    lines.push(`URL: ${page.url}`);
    lines.push(`Status: ${page.status ?? "fetch failed"}${page.redirected ? ` (redirected to ${page.finalUrl})` : ""}`);
    lines.push(`Meta description: ${page.metaDescription || "(none)"}`);
    if (page.error) {
      lines.push(`Fetch note: ${page.error}`);
    }
    lines.push("");
    lines.push("### Rendered text");
    lines.push("");
    lines.push(page.renderedText || "(no rendered text extracted)");
  }

  lines.push("");
  return lines.join("\n");
}

function readCommit(): string {
  try {
    return execFileSync("git", ["rev-parse", "--short", "HEAD"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return "unknown";
  }
}

function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const discovered = options.includeSitemap
    ? await discoverSitemapUrls(options.base, options.locales)
    : { urls: [] };

  await mkdir(options.outDir, { recursive: true });

  let totalFailed = 0;

  for (const locale of options.locales) {
    const urls = uniqueSortedUrls(
      manualLocaleUrls(options.base, locale),
      discovered.urls,
      locale,
    );
    const pages: PageExport[] = [];

    for (const url of urls) {
      pages.push(await exportPage(url));
    }

    const markdown = renderMarkdown(
      locale,
      options.base,
      urls,
      pages,
      discovered.note,
    );
    const outputPath = path.join(options.outDir, `public-copy-${locale}.md`);
    await writeFile(outputPath, markdown, "utf8");

    const failedCount = pages.filter((page) => page.status !== 200 || page.error).length;
    totalFailed += failedCount;
    console.log(
      `${locale.toUpperCase()} URLs exported: ${pages.length - failedCount}`,
    );
    console.log(`${locale.toUpperCase()} failed URLs: ${failedCount}`);
    console.log(`${locale.toUpperCase()} output: ${outputPath}`);
    console.log(`${locale.toUpperCase()} characters: ${markdown.length}`);
  }

  console.log(`Failed URLs total: ${totalFailed}`);
}

main().catch((error: unknown) => {
  console.error(`export-public-copy-review failed: ${errorMessage(error)}`);
  process.exit(1);
});
