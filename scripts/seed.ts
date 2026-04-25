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
import { db, news, positions, clientReferences } from "../lib/db";

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
