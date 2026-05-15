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

  // ─── POSITIONS — 4 placeholder positions, multi-locale ──────────────────
  if (Number(positionsCount) > 0) {
    console.log(
      `positions already populated (${positionsCount} rows), skipping`,
    );
  } else {
    await db.insert(positions).values([
      {
        titleHu: "Biztonsági őr",
        titleEn: "Security Guard",
        titleDe: "Sicherheitsmitarbeiter",
        titleZh: "保安员",
        locationHu: "Budapest / országosan",
        locationEn: "Budapest, regional",
        locationDe: "Budapest, Land",
        locationZh: "布达佩斯及周边",
        typeHu: "Teljes munkaidő",
        typeEn: "Full-time",
        typeDe: "Vollzeit",
        typeZh: "全职",
        sortOrder: 1,
      },
      {
        titleHu: "Takarítási csoportvezető",
        titleEn: "Cleaning Team Leader",
        titleDe: "Reinigungs-Teamleiter",
        titleZh: "清洁主管",
        locationHu: "Budapest",
        locationEn: "Budapest",
        locationDe: "Budapest",
        locationZh: "布达佩斯",
        typeHu: "Teljes munkaidő",
        typeEn: "Full-time",
        typeDe: "Vollzeit",
        typeZh: "全职",
        sortOrder: 2,
      },
      {
        titleHu: "Épületüzemeltetési mérnök",
        titleEn: "Facility Management Engineer",
        titleDe: "Facility-Management-Ingenieur",
        titleZh: "设施管理工程师",
        locationHu: "Budapest",
        locationEn: "Budapest",
        locationDe: "Budapest",
        locationZh: "布达佩斯",
        typeHu: "Teljes munkaidő",
        typeEn: "Full-time",
        typeDe: "Vollzeit",
        typeZh: "全职",
        sortOrder: 3,
      },
      {
        titleHu: "Recepcióvezető",
        titleEn: "Reception Manager",
        titleDe: "Empfangsleiter",
        titleZh: "接待主管",
        locationHu: "Budapest",
        locationEn: "Budapest",
        locationDe: "Budapest",
        locationZh: "布达佩斯",
        typeHu: "Teljes munkaidő",
        typeEn: "Full-time",
        typeDe: "Vollzeit",
        typeZh: "全职",
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
      slug: "avenir-weboldal-szolgaltatasoldalak",
      title: "Elindultak az Avenir szolgáltatásoldalai",
      lead: "Az Avenir weboldalán új, magyar nyelvű szolgáltatásoldalak segítik a tájékozódást.",
      body: "Az Avenir weboldalán új szolgáltatásoldalak jelentek meg, amelyek áttekinthetőbbé teszik az objektumőrzés, portaszolgálat, biztonságtechnika, távfelügyelet, rendezvénybiztosítás, Hard FM és Soft FM területeit. A cél, hogy az érdeklődők pontosabb képet kapjanak a szolgáltatási irányokról, és könnyebben indíthassanak ajánlatkérést.",
      date: new Date("2026-01-15T00:00:00Z"),
    };

    const article2 = {
      slug: "avenir-tudastar-elokeszites",
      title: "Tudástár előkészítése az Avenir weboldalán",
      lead: "Az Avenir weboldalán új szakmai tartalmi felület előkészítése indult el.",
      body: "Az Avenir weboldalán olyan tudástár jellegű tartalmak előkészítése indult el, amelyek később a vállalati biztonsági, portaszolgálati, rendezvénybiztosítási és facility management témákban segíthetik a tájékozódást. A cél, hogy az érdeklődők közérthető, szakmai és proof-safe háttéranyagokat találjanak a szolgáltatási döntések előkészítéséhez.",
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
          "Az ISO 9001 tanúsítványon szereplő hatókör megnevezése: \"Teljeskörű biztonsági szolgáltatás\". " +
          "A tanúsított irányítási rendszer a tanúsítványon meghatározott hatókör szerint " +
          "került auditálásra a NAH-akkreditált MARTON Szakértő Iroda által. " +
          "A tanúsítvány az IAF MLA megállapodás keretében nemzetközileg is elismert.",
        // TRANSLATION DRAFT: review by user
        descriptionEn:
          "ISO 9001 is the international standard for quality management systems. " +
          "The certificate scope is listed as \"Comprehensive security services\". The certified management system " +
          "was audited within the certificate-defined scope by NAH-accredited MARTON Szakértő Iroda. " +
          "The certificate is internationally recognized under the IAF MLA agreement.",
        // TRANSLATION DRAFT: review by user
        descriptionDe:
          "ISO 9001 ist der internationale Standard für Qualitätsmanagementsysteme. " +
          "Der im Zertifikat angegebene Geltungsbereich lautet \"Comprehensive security services\". Das " +
          "zertifizierte Managementsystem wurde innerhalb des im Zertifikat definierten Geltungsbereichs " +
          "durch die NAH-akkreditierte MARTON Szakértő Iroda auditiert. Das Zertifikat ist im Rahmen des IAF MLA-Abkommens international " +
          "anerkannt.",
        // TRANSLATION DRAFT: review by user
        descriptionZh:
          "ISO 9001 是质量管理体系的国际标准。证书中列明的范围为 “Comprehensive security services”。" +
          "该认证管理体系已由 NAH 认可的 MARTON Szakértő Iroda 按证书定义的范围进行审核。" +
          "该证书在 IAF MLA 协议下获得国际认可。",

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
          "(ISMS) nemzetközi szabványa. Az Avenir tanúsított információbiztonsági " +
          "irányítási rendszere a tanúsítványon meghatározott hatókör szerint " +
          "került auditálásra a NAH-akkreditált MARTON Szakértő Iroda által. " +
          "A tanúsítvány az IAF MLA megállapodás keretében nemzetközileg is elismert.",
        // TRANSLATION DRAFT: review by user
        descriptionEn:
          "ISO/IEC 27001:2022 is the international standard for information " +
          "security management systems (ISMS). Avenir's certified information security " +
          "management system was audited within the certificate-defined scope by NAH-accredited " +
          "MARTON Szakértő Iroda. The " +
          "certificate is internationally recognized under the IAF MLA agreement.",
        // TRANSLATION DRAFT: review by user
        descriptionDe:
          "ISO/IEC 27001:2022 ist der internationale Standard für " +
          "Informationssicherheits-Managementsysteme (ISMS). Avenirs zertifiziertes " +
          "Informationssicherheits-Managementsystem wurde innerhalb des im Zertifikat definierten " +
          "Geltungsbereichs durch die NAH-akkreditierte MARTON Szakértő Iroda auditiert. " +
          "Das Zertifikat ist im Rahmen des IAF MLA-Abkommens " +
          "international anerkannt.",
        // TRANSLATION DRAFT: review by user
        descriptionZh:
          "ISO/IEC 27001:2022 是信息安全管理体系（ISMS）的国际标准。Avenir 的认证" +
          "信息安全管理体系已由 NAH 认可的 MARTON Szakértő Iroda 按证书定义的范围进行审核。" +
          "该证书在 IAF MLA 协议下获得国际认可。",

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
