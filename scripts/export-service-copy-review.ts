import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

type Locale = "hu" | "en";

type CliOptions = {
  base: string;
  outDir: string;
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
const FETCH_TIMEOUT_MS = 30_000;

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

const LEGACY_SERVICE_SLUGS = new Set([
  "security",
  "cleaning",
  "building",
  "reception",
  "green",
  "technical",
  "mystery",
  "hardfm",
]);

function usage(): string {
  return [
    "Usage:",
    "  npx tsx scripts/export-service-copy-review.ts --base <preview-url>",
    "",
    "Options:",
    "  --base <url>      Required preview or site base URL.",
    "  --out-dir <path>  Output directory. Default: docs/review",
  ].join("\n");
}

function parseArgs(argv: string[]): CliOptions {
  let base = "";
  let outDir = DEFAULT_OUT_DIR;

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
  };
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

function servicePaths(locale: Locale): string[] {
  return SERVICE_SLUGS.map((slug) => `/${locale}/szolgaltatasok/${slug}`);
}

function serviceUrls(base: string, locale: Locale): string[] {
  return servicePaths(locale).map((servicePath) => buildUrl(base, servicePath));
}

function validateServiceUrlSet(urls: string[], locale: Locale): void {
  if (urls.length !== 8) {
    throw new Error(`${locale.toUpperCase()} URL count must be 8, got ${urls.length}.`);
  }

  const seen = new Set<string>();
  for (const url of urls) {
    const parsed = new URL(url);
    const parts = parsed.pathname.split("/").filter(Boolean);
    const slug = parts[2] ?? "";

    if (seen.has(parsed.pathname)) {
      throw new Error(`Duplicate ${locale.toUpperCase()} URL: ${parsed.pathname}`);
    }
    seen.add(parsed.pathname);

    if (parts.length !== 3 || parts[0] !== locale || parts[1] !== "szolgaltatasok") {
      throw new Error(`Non-service ${locale.toUpperCase()} URL rejected: ${parsed.pathname}`);
    }
    if (!SERVICE_SLUGS.includes(slug as (typeof SERVICE_SLUGS)[number])) {
      throw new Error(`Unknown service slug rejected: ${parsed.pathname}`);
    }
    if (LEGACY_SERVICE_SLUGS.has(slug)) {
      throw new Error(`Legacy service slug rejected: ${parsed.pathname}`);
    }
  }
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
        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "user-agent": "avenir-service-copy-review/1.0",
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

async function exportPage(url: string): Promise<PageExport> {
  try {
    const response = await fetchText(url);
    const isHtml = /<html[\s>]/i.test(response.text);

    return {
      url,
      finalUrl: response.finalUrl,
      status: response.status,
      redirected: response.redirected || response.finalUrl !== url,
      title: isHtml ? extractTitle(response.text) : "",
      metaDescription: isHtml ? extractMetaDescription(response.text) : "",
      renderedText: isHtml ? extractVisibleText(response.text) : "",
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
  const root =
    firstElementContent(html, "main") ?? firstElementContent(html, "body") ?? html;
  let work = root;

  work = work.replace(/<!--[\s\S]*?-->/g, " ");
  work = removeElement(work, "script");
  work = removeElement(work, "style");
  work = removeElement(work, "noscript");
  work = removeElement(work, "svg");
  work = removeElement(work, "template");
  work = removeElement(work, "canvas");
  work = removeHiddenElementLikeBlocks(work);

  work = work.replace(/<(br|hr)\b[^>]*>/gi, "\n");
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
  const pattern = new RegExp(
    `<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}>`,
    "i",
  );
  return html.match(pattern)?.[1] ?? null;
}

function removeElement(html: string, tagName: string): string {
  const pattern = new RegExp(
    `<${tagName}\\b[^>]*>[\\s\\S]*?<\\/${tagName}>`,
    "gi",
  );
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

  return raw.replace(
    /&(#x?[0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]+);/g,
    (entity, code: string) => {
      if (code.startsWith("#x") || code.startsWith("#X")) {
        const value = Number.parseInt(code.slice(2), 16);
        return Number.isFinite(value) ? String.fromCodePoint(value) : entity;
      }
      if (code.startsWith("#")) {
        const value = Number.parseInt(code.slice(1), 10);
        return Number.isFinite(value) ? String.fromCodePoint(value) : entity;
      }
      return named[code] ?? entity;
    },
  );
}

function renderMarkdown(locale: Locale, base: string, pages: PageExport[]): string {
  const failed = pages.filter((page) => page.status !== 200 || page.error);
  const lines: string[] = [];

  lines.push(`# Avenir service copy export - ${locale.toUpperCase()}`);
  lines.push("");
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push(`Base URL: ${base}`);
  lines.push(`URL count: ${pages.length}`);
  lines.push("");
  lines.push("## Coverage");
  lines.push("");
  for (const page of pages) {
    lines.push(`- ${page.url}`);
  }
  lines.push("");
  lines.push("## Failed URLs");
  lines.push("");
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
    "- FAQ answers may require visual review if accordion content is not rendered in HTML.",
  );

  for (const page of pages) {
    lines.push("");
    lines.push("---");
    lines.push("");
    lines.push(`## Page: ${page.title || "(untitled)"}`);
    lines.push(`URL: ${page.url}`);
    lines.push(
      `Status: ${page.status ?? "fetch failed"}${page.redirected ? ` (redirected to ${page.finalUrl})` : ""}`,
    );
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

function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

async function exportLocale(
  base: string,
  outDir: string,
  locale: Locale,
): Promise<{ failedCount: number; characterCount: number; outputPath: string }> {
  const urls = serviceUrls(base, locale);
  validateServiceUrlSet(urls, locale);

  const pages: PageExport[] = [];
  for (const url of urls) {
    pages.push(await exportPage(url));
  }

  const markdown = renderMarkdown(locale, base, pages);
  const outputPath = path.join(outDir, `service-copy-${locale}.md`);
  await writeFile(outputPath, markdown, "utf8");

  return {
    failedCount: pages.filter((page) => page.status !== 200 || page.error).length,
    characterCount: markdown.length,
    outputPath,
  };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const huUrls = serviceUrls(options.base, "hu");
  const enUrls = serviceUrls(options.base, "en");

  validateServiceUrlSet(huUrls, "hu");
  validateServiceUrlSet(enUrls, "en");

  await mkdir(options.outDir, { recursive: true });

  const hu = await exportLocale(options.base, options.outDir, "hu");
  const en = await exportLocale(options.base, options.outDir, "en");

  console.log(`HU URL count: ${huUrls.length}`);
  console.log(`EN URL count: ${enUrls.length}`);
  console.log(`HU failed URLs: ${hu.failedCount}`);
  console.log(`EN failed URLs: ${en.failedCount}`);
  console.log(`Failed URLs total: ${hu.failedCount + en.failedCount}`);
  console.log(`HU output: ${hu.outputPath}`);
  console.log(`EN output: ${en.outputPath}`);
  console.log(`HU characters: ${hu.characterCount}`);
  console.log(`EN characters: ${en.characterCount}`);
}

main().catch((error: unknown) => {
  console.error(`export-service-copy-review failed: ${errorMessage(error)}`);
  process.exit(1);
});
