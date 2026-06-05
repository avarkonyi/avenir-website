import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Translation } from "@/lib/i18n";

type PrivacyContent = Translation["legal"]["privacy"];
type TermsContent = Translation["legal"]["terms"];

export type MarkdownLegalContent = {
  readonly title: string;
  readonly lastUpdated: string;
  readonly version?: string;
  readonly intro: string;
  readonly sections: readonly {
    readonly id: string;
    readonly title: string;
    readonly body: string;
  }[];
  readonly versionHistory?: string;
};

const SOURCE_ROOT = join(process.cwd(), "docs", "translations", "de", "legal");

const PRIVACY_SECTION_IDS = [
  "controller",
  "representative",
  "dpo",
  "contact-processing",
  "sensitive-data",
  "processors",
  "third-country",
  "cookies",
  "rights",
  "automated",
  "dsar",
  "remedies",
  "breach",
  "security",
  "modification",
] as const;

const TERMS_SECTION_IDS = [
  "general",
  "purpose",
  "private-investigation",
  "licenses",
  "liability-disclaimer",
  "liability-insurance",
  "third-party",
  "copyright",
  "complaints",
  "code-of-conduct",
  "law",
  "modification",
] as const;

const IMPRESSUM_SECTION_IDS = [
  "company",
  "representative",
  "dpo",
  "contact",
  "regulated-profession",
  "licenses",
  "regulatory",
  "liability",
  "hosting",
  "copyright",
] as const;

function readSource(fileName: string): string {
  return readFileSync(join(SOURCE_ROOT, fileName), "utf8")
    .replace(/^\uFEFF/, "")
    .replace(/\r\n/g, "\n")
    .replace(/^<!--[\s\S]*?-->\s*/, "")
    .trim();
}

function splitVersionHistory(source: string): {
  readonly body: string;
  readonly versionHistory?: string;
} {
  const marker = "\nVersionshistorie:\n";
  const index = source.indexOf(marker);
  if (index === -1) return { body: source };

  return {
    body: source.slice(0, index).trim(),
    versionHistory: source.slice(index + 1).trim(),
  };
}

function parseMarkdownLegalContent(
  fileName: string,
  sectionIds: readonly string[],
): MarkdownLegalContent {
  const { body, versionHistory } = splitVersionHistory(readSource(fileName));
  const titleMatch = body.match(/^#\s+(.+)$/m);
  if (!titleMatch) {
    throw new Error(`Missing legal page title in ${fileName}`);
  }

  const title = titleMatch[1].trim();
  const afterTitle = body.slice((titleMatch.index ?? 0) + titleMatch[0].length).trim();
  const firstSectionIndex = afterTitle.search(/^##\s+/m);
  if (firstSectionIndex === -1) {
    throw new Error(`Missing legal sections in ${fileName}`);
  }

  const preface = afterTitle.slice(0, firstSectionIndex).trim();
  const sectionSource = afterTitle.slice(firstSectionIndex).trim();
  const prefaceLines = preface.split("\n");
  const lastUpdated = prefaceLines.find((line) =>
    /^(Gültig ab|Letzte Aktualisierung):/.test(line.trim()),
  )?.trim();
  if (!lastUpdated) {
    throw new Error(`Missing legal effective date in ${fileName}`);
  }

  const version = prefaceLines.find((line) =>
    /^Version\s+\d/.test(line.trim()),
  )?.trim();
  const intro = prefaceLines
    .filter((line) => {
      const trimmed = line.trim();
      return (
        trimmed.length > 0 &&
        trimmed !== lastUpdated &&
        trimmed !== version
      );
    })
    .join("\n")
    .trim();

  const headingMatches = [...sectionSource.matchAll(/^##\s+(.+)$/gm)];
  const sections = headingMatches.map((match, index) => {
    const start = (match.index ?? 0) + match[0].length;
    const end =
      index + 1 < headingMatches.length
        ? headingMatches[index + 1].index ?? sectionSource.length
        : sectionSource.length;
    return {
      id: sectionIds[index] ?? `section-${index + 1}`,
      title: match[1].trim(),
      body: sectionSource.slice(start, end).trim(),
    };
  });

  return {
    title,
    lastUpdated,
    version,
    intro,
    sections,
    versionHistory,
  };
}

export function getDePrivacyContent(): PrivacyContent {
  const source = parseMarkdownLegalContent(
    "datenschutzerklaerung-de-v1.2.md",
    PRIVACY_SECTION_IDS,
  );

  return {
    title: source.title,
    lastUpdated: source.lastUpdated,
    version: source.version ?? "",
    intro: source.intro,
    sections: source.sections,
    versionHistory: source.versionHistory ?? "",
  };
}

export function getDeTermsContent(): TermsContent {
  const source = parseMarkdownLegalContent(
    "rechtliche-hinweise-de-v1.1.md",
    TERMS_SECTION_IDS,
  );

  return {
    title: source.title,
    lastUpdated: source.lastUpdated,
    version: source.version ?? "",
    intro: source.intro,
    sections: source.sections,
    versionHistory: source.versionHistory ?? "",
    dataProtection: {
      title: "Datenschutz",
      body: "",
      dpoLabel: "Datenschutzbeauftragte",
      dpoName: "Fanni Csegény",
      dpoEmail: "dpo@afm.hu",
      dpoPhone: "+36 70 622 6242",
      privacyLinkText: "Die vollständige Datenschutzerklärung ist hier verfügbar",
      privacyLinkHref: "/de/adatvedelem",
    },
  };
}

export function getDeImpressumContent(): MarkdownLegalContent {
  return parseMarkdownLegalContent("impressum-de.md", IMPRESSUM_SECTION_IDS);
}
