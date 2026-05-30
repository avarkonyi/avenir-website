// Guarded one-shot updater for the certifications table.
//
// Usage:
//   npm run db:update-certs          # staging dry-run
//   npm run db:update-certs:apply    # staging write
//   npm run db:update-certs:prod     # production dry-run, requires prod target guard
//
// Safety:
//   - defaults to dry-run;
//   - staging is the default target;
//   - production requires --target production --allow-production;
//   - the runtime DB target guard runs before SELECT/UPDATE;
//   - never prints the full DATABASE_URL;
//   - writes only the ISO 9001 / ISO 27001 certification rows and only the
//     listed certification fields.

import "./load-env";
import { eq, inArray } from "drizzle-orm";
import { ensureDbTarget, readDbTargetArgs } from "./ensure-staging-db";
import { db, certifications } from "../lib/db";

const SCRIPT_NAME = "update-certifications-prod";
const TARGET_SLUGS = ["iso-9001", "iso-27001"] as const;

type TargetSlug = (typeof TARGET_SLUGS)[number];
type CertificationUpdate = Partial<typeof certifications.$inferInsert>;

const CERTIFICATION_UPDATES: Record<TargetSlug, CertificationUpdate> = {
  "iso-9001": {
    standardCode: "ISO 9001:2015",
    issuer: "MARTON Szakértő Iroda Kft.",
    pdfUrl: "/certifications/iso-9001-marton-843579099.pdf",
    descriptionHu:
      "Az ISO 9001 a minőségirányítási rendszerek nemzetközi szabványa. " +
      "Az ISO 9001 tanúsítványon szereplő hatókör megnevezése: \"Teljes körű biztonsági szolgáltatás\". " +
      "A tanúsított irányítási rendszer a tanúsítványon meghatározott hatókör szerint " +
      "került auditálásra a NAH-akkreditált MARTON Szakértő Iroda által. " +
      "A tanúsítvány az IAF MLA megállapodás keretében nemzetközileg is elismert.",
    descriptionEn:
      "ISO 9001 is the international standard for quality management systems. " +
      "The certificate scope is listed as \"Comprehensive security services\". The certified management system " +
      "was audited within the certificate-defined scope by NAH-accredited MARTON Szakértő Iroda. " +
      "The certificate is internationally recognized under the IAF MLA agreement.",
    descriptionDe:
      "ISO 9001 ist der internationale Standard für Qualitätsmanagementsysteme. " +
      "Der im Zertifikat angegebene Geltungsbereich lautet \"Comprehensive security services\". Das " +
      "zertifizierte Managementsystem wurde innerhalb des im Zertifikat definierten Geltungsbereichs " +
      "durch die NAH-akkreditierte MARTON Szakértő Iroda auditiert. Das Zertifikat ist im Rahmen des IAF MLA-Abkommens international " +
      "anerkannt.",
    descriptionZh:
      "ISO 9001 是质量管理体系的国际标准。证书中列明的范围为 “Comprehensive security services”。" +
      "该认证管理体系已由 NAH 认可的 MARTON Szakértő Iroda 按证书定义的范围进行审核。" +
      "该证书在 IAF MLA 协议下获得国际认可。",
  },
  "iso-27001": {
    standardCode: "ISO/IEC 27001:2022",
    certificateNumber: "988960032",
    scopeHu: "Teljes körű biztonsági szolgáltatás",
    scopeEn: "Comprehensive security services",
    scopeDe: "Umfassende Sicherheitsdienstleistungen",
    scopeZh: "全面安保服务",
    issuer: "MARTON Szakértő Iroda Kft.",
    issuedDate: "2026-04-27",
    expiresDate: "2029-04-26",
    pdfUrl: "/certifications/iso-27001-marton-988960032.pdf",
    descriptionHu:
      "Az ISO/IEC 27001:2022 az információbiztonsági irányítási rendszerek " +
      "(ISMS) nemzetközi szabványa. Az Avenir tanúsított információbiztonsági " +
      "irányítási rendszere a tanúsítványon meghatározott hatókör szerint " +
      "került auditálásra a NAH-akkreditált MARTON Szakértő Iroda által. " +
      "A tanúsítvány az IAF MLA megállapodás keretében nemzetközileg is elismert.",
    descriptionEn:
      "ISO/IEC 27001:2022 is the international standard for information " +
      "security management systems (ISMS). Avenir's certified information security " +
      "management system was audited within the certificate-defined scope by NAH-accredited " +
      "MARTON Szakértő Iroda. The " +
      "certificate is internationally recognized under the IAF MLA agreement.",
    descriptionDe:
      "ISO/IEC 27001:2022 ist der internationale Standard für " +
      "Informationssicherheits-Managementsysteme (ISMS). Avenirs zertifiziertes " +
      "Informationssicherheits-Managementsystem wurde innerhalb des im Zertifikat definierten " +
      "Geltungsbereichs durch die NAH-akkreditierte MARTON Szakértő Iroda auditiert. " +
      "Das Zertifikat ist im Rahmen des IAF MLA-Abkommens " +
      "international anerkannt.",
    descriptionZh:
      "ISO/IEC 27001:2022 是信息安全管理体系（ISMS）的国际标准。Avenir 的认证" +
      "信息安全管理体系已由 NAH 认可的 MARTON Szakértő Iroda 按证书定义的范围进行审核。" +
      "该证书在 IAF MLA 协议下获得国际认可。",
  },
};

function hasArg(name: string): boolean {
  return process.argv.includes(name);
}

function usageAndExit(message: string): never {
  console.error(`${SCRIPT_NAME}: ${message}`);
  console.error(
    [
      "",
      "Usage:",
      "  tsx scripts/update-certifications-prod.ts --dry-run",
      "  tsx scripts/update-certifications-prod.ts --apply",
      "  tsx scripts/update-certifications-prod.ts --target production --allow-production --dry-run",
      "  tsx scripts/update-certifications-prod.ts --target production --allow-production --apply",
      "",
      "If neither --dry-run nor --apply is supplied, the script defaults to dry-run.",
    ].join("\n"),
  );
  process.exit(1);
}

function isTargetSlug(value: string): value is TargetSlug {
  return (TARGET_SLUGS as readonly string[]).includes(value);
}

function sameValue(left: unknown, right: unknown): boolean {
  return JSON.stringify(left ?? null) === JSON.stringify(right ?? null);
}

function summarize(value: unknown): string {
  if (value === null || value === undefined) return "(null)";
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string") {
    const oneLine = value.replace(/\s+/g, " ").trim();
    return oneLine.length > 160 ? `${oneLine.slice(0, 157)}...` : oneLine;
  }
  return JSON.stringify(value);
}

async function main(): Promise<void> {
  const explicitDryRun = hasArg("--dry-run");
  const isApply = hasArg("--apply");

  if (explicitDryRun && isApply) {
    usageAndExit("use only one of --dry-run or --apply");
  }

  const isDryRun = !isApply;
  const { target, allowProduction } = readDbTargetArgs();

  console.log(`--- ${SCRIPT_NAME} ${isDryRun ? "DRY-RUN" : "APPLY"} start ---`);
  ensureDbTarget({ scriptName: SCRIPT_NAME, isDryRun, target, allowProduction });

  const rows = await db
    .select()
    .from(certifications)
    .where(inArray(certifications.slug, [...TARGET_SLUGS]))
    .orderBy(certifications.slug, certifications.id);

  const rowsBySlug = new Map<TargetSlug, (typeof rows)[number]>();
  for (const row of rows) {
    if (!isTargetSlug(row.slug)) {
      usageAndExit(`unexpected certification slug returned: ${row.slug}`);
    }
    if (rowsBySlug.has(row.slug)) {
      usageAndExit(`duplicate certification row found for slug=${row.slug}`);
    }
    rowsBySlug.set(row.slug, row);
  }

  const missing = TARGET_SLUGS.filter((slug) => !rowsBySlug.has(slug));
  if (missing.length > 0) {
    usageAndExit(`missing certification row(s): ${missing.join(", ")}`);
  }

  let changedRows = 0;
  let changedFields = 0;

  for (const slug of TARGET_SLUGS) {
    const row = rowsBySlug.get(slug);
    if (!row) continue;
    const update = CERTIFICATION_UPDATES[slug];
    const changed = Object.entries(update).filter(([field, after]) => {
      const before = row[field as keyof typeof row];
      return !sameValue(before, after);
    });

    if (changed.length > 0) changedRows += 1;
    changedFields += changed.length;

    console.log(`\n${slug}`);
    console.log(`  changed fields: ${changed.length > 0 ? changed.map(([field]) => field).join(", ") : "(none)"}`);

    for (const [field, after] of Object.entries(update)) {
      const before = row[field as keyof typeof row];
      const changedMarker = sameValue(before, after) ? "=" : "~";
      console.log(`  ${changedMarker} ${field}`);
      console.log(`      from: ${summarize(before)}`);
      console.log(`      to:   ${summarize(after)}`);
    }

    if (isApply && changed.length > 0) {
      await db
        .update(certifications)
        .set({ ...update, updatedAt: new Date() })
        .where(eq(certifications.id, row.id));
      console.log("  applied: yes");
    } else if (isApply) {
      console.log("  applied: no changes");
    }
  }

  console.log(
    `\nPlanned changes: ${changedRows} row(s), ${changedFields} field(s).`,
  );

  if (isDryRun) {
    console.log("Dry run only. No database rows were updated.");
    return;
  }

  const verify = await db
    .select({
      slug: certifications.slug,
      issuer: certifications.issuer,
    })
    .from(certifications)
    .where(inArray(certifications.slug, [...TARGET_SLUGS]));

  if (verify.length !== TARGET_SLUGS.length) {
    usageAndExit(`post-update verification expected ${TARGET_SLUGS.length} rows, got ${verify.length}`);
  }

  for (const row of verify) {
    if (row.issuer !== "MARTON Szakértő Iroda Kft.") {
      usageAndExit(`${row.slug} issuer mismatch after apply`);
    }
  }

  console.log("Apply complete. Only targeted certification fields were written.");
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`${SCRIPT_NAME}: failed: ${message}`);
  process.exit(1);
});
