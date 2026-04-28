// Seed initial data for the 4 tables.
// Usage: npm run db:seed
//
// Idempotent: each table is checked for existing rows before insert.
// Re-running is always safe — populated tables are skipped with a log
// message, empty tables are seeded fresh.
//
// Top-level work is wrapped in `main()` because tsx compiles this file
// as CJS (no `"type": "module"` in package.json), and CJS doesn't allow
// top-level await.

import "./load-env";
import { count } from "drizzle-orm";
import { db, news, positions, clientReferences, certifications } from "../lib/db";

async function main() {
  console.log("--- seed start ---");

  // Pre-flight: count existing rows in each table to gate inserts.
  const [{ value: refsCount }] = await db
    .select({ value: count() })
    .from(clientReferences);
  const [{ value: positionsCount }] = await db
    .select({ value: count() })
    .from(positions);
  const [{ value: newsCount }] = await db
    .select({ value: count() })
    .from(news);
  const [{ value: certsCount }] = await db
    .select({ value: count() })
    .from(certifications);

  // ─── CLIENT REFERENCES — 4 industry categories ──────────────────────────
  if (Number(refsCount) > 0) {
    console.log(
      `client_references already populated (${refsCount} rows), skipping`,
    );
  } else {
    await db.insert(clientReferences).values([
      {
        slug: "irodahazak",
        labelHu: "Irodaházak",
        labelEn: "Office Buildings",
        labelDe: "Bürogebäude",
        labelZh: "办公楼",
        sortOrder: 1,
      },
      {
        slug: "bevasarlokozpontok",
        labelHu: "Bevásárlóközpontok",
        labelEn: "Shopping Centres",
        labelDe: "Einkaufszentren",
        labelZh: "购物中心",
        sortOrder: 2,
      },
      {
        slug: "ipari-es-logisztikai-parkok",
        labelHu: "Ipari és logisztikai parkok",
        labelEn: "Industrial and Logistics Parks",
        labelDe: "Industrie- und Logistikparks",
        labelZh: "工业和物流园区",
        sortOrder: 3,
      },
      {
        slug: "kozintezmenyek",
        labelHu: "Közintézmények",
        labelEn: "Public Institutions",
        labelDe: "Öffentliche Gebäude",
        labelZh: "公共机构",
        sortOrder: 4,
      },
    ]);
    console.log("seeded client_references (4 rows)");
  }

  // ─── POSITIONS — 4 placeholder positions (HU-only) ──────────────────────
  if (Number(positionsCount) > 0) {
    console.log(
      `positions already populated (${positionsCount} rows), skipping`,
    );
  } else {
    await db.insert(positions).values([
      {
        title: "Biztonsági őr",
        location: "Budapest / országosan",
        type: "Teljes munkaidő",
        sortOrder: 1,
      },
      {
        title: "Takarítási csoportvezető",
        location: "Budapest",
        type: "Teljes munkaidő",
        sortOrder: 2,
      },
      {
        title: "Épületüzemeltetési mérnök",
        location: "Budapest",
        type: "Teljes munkaidő",
        sortOrder: 3,
      },
      {
        title: "Recepcióvezető",
        location: "Budapest",
        type: "Teljes munkaidő",
        sortOrder: 4,
      },
    ]);
    console.log("seeded positions (4 rows)");
  }

  // ─── NEWS — 2 placeholder articles ──────────────────────────────────────
  //
  // HU = original content; EN/DE/ZH columns are populated with the HU copy
  // as placeholder (so the DB shape matches the schema), but only HU is
  // published initially. Admin flips publishedEn/De/Zh to true after each
  // translation is written.

  if (Number(newsCount) > 0) {
    console.log(`news already populated (${newsCount} rows), skipping`);
  } else {
    const article1 = {
      slug: "kifli-hu-partnerseg",
      title: "Új partnerséget kötöttünk a Kifli.hu-val",
      lead: "Az Avenir átvette a Kifli.hu logisztikai központjainak vagyonvédelmét.",
      body: "2026 januárjától az Avenir Facility Management Kft. felel a Kifli.hu országos logisztikai központjainak vagyonvédelméért és portaszolgálatáért. A megállapodás keretében 24/7 őrzés-védelmet, beléptetést és központi diszpécserszolgálatot biztosítunk országos lefedettséggel.",
      date: new Date("2026-01-15T00:00:00Z"),
    };

    const article2 = {
      slug: "bovulo-szolgaltatas-portfolio-2026",
      title: "Bővülő szolgáltatás-portfólió 2026-ban",
      lead: "Új technikai karbantartási és Hard FM csomagok minden ügyfelünk számára.",
      body: "Az idei évtől kibővítjük szolgáltatási palettánkat: minden meglévő ügyfelünk számára elérhetővé válnak a tervszerű HVAC-karbantartási csomagok, valamint a 24 órás riasztási készenléttel működő Hard FM szolgáltatás. Részletekért keresse kapcsolattartóját.",
      date: new Date("2026-03-01T00:00:00Z"),
    };

    await db.insert(news).values([
      {
        slug: article1.slug,
        titleHu: article1.title,
        titleEn: article1.title,
        titleDe: article1.title,
        titleZh: article1.title,
        leadHu: article1.lead,
        leadEn: article1.lead,
        leadDe: article1.lead,
        leadZh: article1.lead,
        bodyHu: article1.body,
        bodyEn: article1.body,
        bodyDe: article1.body,
        bodyZh: article1.body,
        publishedHu: true,
        publishedEn: false,
        publishedDe: false,
        publishedZh: false,
        date: article1.date,
      },
      {
        slug: article2.slug,
        titleHu: article2.title,
        titleEn: article2.title,
        titleDe: article2.title,
        titleZh: article2.title,
        leadHu: article2.lead,
        leadEn: article2.lead,
        leadDe: article2.lead,
        leadZh: article2.lead,
        bodyHu: article2.body,
        bodyEn: article2.body,
        bodyDe: article2.body,
        bodyZh: article2.body,
        publishedHu: true,
        publishedEn: false,
        publishedDe: false,
        publishedZh: false,
        date: article2.date,
      },
    ]);
    console.log("seeded news (2 rows)");
  }

  // ─── CERTIFICATIONS — 2 ISO rows (9001 verified, 27001 placeholder) ─────
  //
  // ISO 9001 fields are verified from the actual PDF in
  // public/certifications/iso-9001-avenir-2026.pdf. ISO 27001 fields are
  // tentative placeholders pending the user's PDF upload — every uncertain
  // field is marked `// TODO: confirm with PDF` so they're easy to update
  // via admin CRUD or by editing this seed and re-running after a wipe.
  //
  // The `description_*` fields are not from the PDFs; they are AI/SEO
  // friendly explanations of what each standard means and how Avenir is
  // certified. HU is original copy; EN/DE/ZH are TRANSLATION DRAFTs that
  // the user reviews before public deploy.

  if (Number(certsCount) > 0) {
    console.log(
      `certifications already populated (${certsCount} rows), skipping`,
    );
  } else {
    await db.insert(certifications).values([
      // ─── ISO 9001 — VERIFIED (cert 843579099, MARTON Szakértő Iroda, 2026-03-19 → 2029-03-18) ───
      {
        slug: "iso-9001",
        name: "ISO 9001",
        // International format (matches IAF CertSearch); was MSZ EN adoption
        standardCode: "ISO 9001:2015",
        certificateNumber: "843579099",

        fullNameHu: "ISO 9001 Minőségirányítási Rendszer Tanúsítvány",
        // TRANSLATION DRAFT: review by user
        fullNameEn: "ISO 9001 Quality Management System Certification",
        // TRANSLATION DRAFT: review by user
        fullNameDe: "ISO 9001 Qualitätsmanagementsystem-Zertifikat",
        // TRANSLATION DRAFT: review by user
        fullNameZh: "ISO 9001 质量管理体系认证",

        descriptionHu:
          "Az ISO 9001 a minőségirányítási rendszerek nemzetközi szabványa. " +
          "Az Avenir tanúsítása a teljeskörű biztonsági szolgáltatásra terjed ki — " +
          "a NAH-akkreditált MARTON Szakértő Iroda auditja igazolja, hogy a vagyonvédelmi és " +
          "facility management szolgáltatási folyamataink megfelelnek a 2015-ös " +
          "szabvány követelményeinek. A tanúsítvány az IAF MLA megállapodás " +
          "keretében nemzetközileg is elismert.",
        // TRANSLATION DRAFT: review by user
        descriptionEn:
          "ISO 9001 is the international standard for quality management systems. " +
          "Avenir's certification covers comprehensive security services — the audit " +
          "by NAH-accredited MARTON Szakértő Iroda verifies that our property protection and " +
          "facility management service processes meet the 2015 standard's requirements. " +
          "The certificate is internationally recognized under the IAF MLA agreement.",
        // TRANSLATION DRAFT: review by user
        descriptionDe:
          "ISO 9001 ist der internationale Standard für Qualitätsmanagementsysteme. " +
          "Avenirs Zertifizierung umfasst umfassende Sicherheitsdienstleistungen — das " +
          "Audit der NAH-akkreditierten MARTON Szakértő Iroda bestätigt, dass unsere Eigentumsschutz- " +
          "und Facility-Management-Serviceprozesse den Anforderungen der Norm von 2015 " +
          "entsprechen. Das Zertifikat ist im Rahmen des IAF MLA-Abkommens international " +
          "anerkannt.",
        // TRANSLATION DRAFT: review by user
        descriptionZh:
          "ISO 9001 是质量管理体系的国际标准。Avenir 的认证范围涵盖全面安保服务——" +
          "NAH 认可的 MARTON Szakértő Iroda 审核证明，我们的财产保护和设施管理服务流程符合 2015 " +
          "年标准要求。该证书在 IAF MLA 协议下获得国际认可。",

        // verbatim from PDF
        scopeHu: "Teljeskörű biztonsági szolgáltatás",
        // TRANSLATION DRAFT: review by user
        scopeEn: "Comprehensive security services",
        // TRANSLATION DRAFT: review by user
        scopeDe: "Umfassende Sicherheitsdienstleistungen",
        // TRANSLATION DRAFT: review by user
        scopeZh: "全面安保服务",

        issuer: "MARTON Szakértő Iroda Kft.",
        issuerUrl: "https://www.rendszertanusitas.hu",
        accreditationBody: "NAH",
        accreditationNumber: "NAH-4-0047/2023",
        iafMlaMember: true,
        verifyUrl: "https://www.iafcertsearch.org",

        issuedDate: "2026-03-19",
        expiresDate: "2029-03-18",

        credentialCategory: "Quality Management System Certification",
        // designer pack pending — Knowledge Panel logo will replace null
        logoUrl: null,
        pdfUrl: "/certifications/iso-9001-marton-843579099.pdf",

        active: true,
        sortOrder: 1,
      },

      // ─── ISO 27001 — VERIFIED (cert 988960032, MARTON Szakértő Iroda, 2026-04-27 → 2029-04-26) ───
      {
        slug: "iso-27001",
        name: "ISO 27001",
        // International format (matches IAF CertSearch); MSZ adoption is :2023
        standardCode: "ISO/IEC 27001:2022",
        certificateNumber: "988960032",

        fullNameHu:
          "ISO 27001 Információbiztonsági Irányítási Rendszer Tanúsítvány",
        // TRANSLATION DRAFT: review by user
        fullNameEn:
          "ISO 27001 Information Security Management System Certification",
        // TRANSLATION DRAFT: review by user
        fullNameDe:
          "ISO 27001 Informationssicherheits-Managementsystem-Zertifikat",
        // TRANSLATION DRAFT: review by user
        fullNameZh: "ISO 27001 信息安全管理体系认证",

        descriptionHu:
          "Az ISO/IEC 27001:2022 az információbiztonsági irányítási rendszerek " +
          "(ISMS) nemzetközi szabványa. Az Avenir tanúsítása igazolja, hogy a " +
          "vagyonvédelmi munkánk során kezelt ügyfélinformációk, beléptetési " +
          "naplók, kameraadatok és pénzügyi adatok kezelése a teljes körű " +
          "biztonsági szolgáltatásra kiterjedően megfelel a szabvány " +
          "bizalmasság-, sértetlenség- és rendelkezésre állás-követelményeinek. " +
          "A NAH-akkreditált MARTON Szakértő Iroda auditja igazolja a rendszer " +
          "megfelelőségét. A tanúsítvány az IAF MLA megállapodás keretében " +
          "nemzetközileg is elismert.",
        // TRANSLATION DRAFT: review by user
        descriptionEn:
          "ISO/IEC 27001:2022 is the international standard for information " +
          "security management systems (ISMS). Avenir's certification verifies " +
          "that the customer information, access logs, camera data, and " +
          "financial records handled in our property protection work meet the " +
          "standard's confidentiality, integrity, and availability requirements " +
          "across the full security service scope. The audit by NAH-accredited " +
          "MARTON Szakértő Iroda confirms the system's conformance. The " +
          "certificate is internationally recognized under the IAF MLA agreement.",
        // TRANSLATION DRAFT: review by user
        descriptionDe:
          "ISO/IEC 27001:2022 ist der internationale Standard für " +
          "Informationssicherheits-Managementsysteme (ISMS). Avenirs " +
          "Zertifizierung bestätigt, dass die im Rahmen unserer Eigentumsschutz-" +
          "Tätigkeit verarbeiteten Kundeninformationen, Zutrittsprotokolle, " +
          "Kameradaten und Finanzdaten die Vertraulichkeits-, Integritäts- und " +
          "Verfügbarkeitsanforderungen der Norm im gesamten umfassenden " +
          "Sicherheitsdienstleistungsbereich erfüllen. Das Audit der " +
          "NAH-akkreditierten MARTON Szakértő Iroda bestätigt die Konformität " +
          "des Systems. Das Zertifikat ist im Rahmen des IAF MLA-Abkommens " +
          "international anerkannt.",
        // TRANSLATION DRAFT: review by user
        descriptionZh:
          "ISO/IEC 27001:2022 是信息安全管理体系（ISMS）的国际标准。Avenir 的认证" +
          "证明，我们在财产保护工作中对客户信息、门禁日志、摄像数据和财务记录的处理" +
          "在全面安保服务范围内符合该标准的保密性、完整性和可用性要求。NAH 认可的 " +
          "MARTON Szakértő Iroda 审核证实了体系的合规性。该证书在 IAF MLA 协议下" +
          "获得国际认可。",

        // verbatim from PDF
        scopeHu: "Teljes körű biztonsági szolgáltatás",
        // TRANSLATION DRAFT: review by user
        scopeEn: "Comprehensive security services",
        // TRANSLATION DRAFT: review by user
        scopeDe: "Umfassende Sicherheitsdienstleistungen",
        // TRANSLATION DRAFT: review by user
        scopeZh: "全面安保服务",

        issuer: "MARTON Szakértő Iroda Kft.",
        issuerUrl: "https://www.rendszertanusitas.hu",
        accreditationBody: "NAH",
        accreditationNumber: "NAH-4-0047/2023",
        iafMlaMember: true,
        verifyUrl: "https://www.iafcertsearch.org",

        issuedDate: "2026-04-27",
        expiresDate: "2029-04-26",

        credentialCategory:
          "Information Security Management System Certification",
        // designer pack pending
        logoUrl: null,
        pdfUrl: "/certifications/iso-27001-marton-988960032.pdf",

        active: true,
        sortOrder: 2,
      },
    ]);
    console.log("seeded certifications (2 rows)");
  }

  // ─── MESSAGES — empty by design ─────────────────────────────────────────
  // (Populated by contact-form submissions once the contact API is wired.
  // No count-check or insert here — the table is intentionally untouched.)

  console.log("--- seed complete ---");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  });
