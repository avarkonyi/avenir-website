// One-shot UPDATE script for the certifications table.
//
// Bridges the gap for already-seeded databases: the seed.ts script is
// idempotent (skips if rows exist), so when seed-time data needs a
// post-hoc correction, this script applies the change directly.
//
// Current scope:
//   - ISO 9001: rebrand issuer (MartonCert → MARTON Szakértő Iroda Kft.),
//     change standardCode to international format (ISO 9001:2015), update
//     pdfUrl to the renamed file, and align description text.
//   - ISO 27001: replace placeholder data with verified values from the
//     PDF + IAF CertSearch (cert 988960032, MARTON Szakértő Iroda Kft.,
//     ISO/IEC 27001:2022, scope, valid 2026-04-27 → 2029-04-26, descriptions).
//
// Run with:
//   npm run db:update-certs
//
// Verifies after the UPDATEs by SELECTing both rows and printing them
// to the console; exits with code 1 if either row is missing (slug
// not found = silent UPDATE no-op = needs investigation).
//
// Source-of-truth for the new values is scripts/seed.ts — keep this
// file's text in sync with the seed when descriptions change.

import "./load-env";
import { eq, inArray } from "drizzle-orm";
import { db, certifications } from "../lib/db";

async function main() {
  console.log("--- Updating certifications ---");

  // ─── ISO 9001 ───
  await db
    .update(certifications)
    .set({
      standardCode: "ISO 9001:2015",
      issuer: "MARTON Szakértő Iroda Kft.",
      pdfUrl: "/certifications/iso-9001-marton-843579099.pdf",
      descriptionHu:
        "Az ISO 9001 a minőségirányítási rendszerek nemzetközi szabványa. " +
        "Az ISO 9001 tanúsítványon szereplő hatókör megnevezése: \"Teljeskörű biztonsági szolgáltatás\". " +
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
      updatedAt: new Date(),
    })
    .where(eq(certifications.slug, "iso-9001"));
  console.log("✓ ISO 9001 update issued");

  // ─── ISO 27001 ───
  await db
    .update(certifications)
    .set({
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
      updatedAt: new Date(),
    })
    .where(eq(certifications.slug, "iso-27001"));
  console.log("✓ ISO 27001 update issued");

  // ─── Verify ───
  const verify = await db
    .select({
      slug: certifications.slug,
      name: certifications.name,
      standardCode: certifications.standardCode,
      certificateNumber: certifications.certificateNumber,
      issuer: certifications.issuer,
      issuedDate: certifications.issuedDate,
      expiresDate: certifications.expiresDate,
      pdfUrl: certifications.pdfUrl,
    })
    .from(certifications)
    .where(inArray(certifications.slug, ["iso-9001", "iso-27001"]));

  console.log("\n--- Verify (post-update SELECT) ---");
  console.table(verify);

  if (verify.length !== 2) {
    console.error(
      `\n[ERROR] Expected 2 rows (iso-9001 + iso-27001), got ${verify.length}. ` +
        "Slug mismatch or missing row — UPDATE was a silent no-op. Investigate.",
    );
    process.exit(1);
  }

  // Sanity check: each row must have the new MARTON issuer name
  for (const row of verify) {
    if (row.issuer !== "MARTON Szakértő Iroda Kft.") {
      console.error(
        `\n[ERROR] ${row.slug} issuer mismatch — got "${row.issuer}", expected "MARTON Szakértő Iroda Kft.". ` +
          "UPDATE may have been overridden or partially applied.",
      );
      process.exit(1);
    }
  }

  console.log("\n✓ Both rows verified. Update complete.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Update failed:", err);
    process.exit(1);
  });
