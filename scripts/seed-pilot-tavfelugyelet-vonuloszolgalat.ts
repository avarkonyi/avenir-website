// One-shot pilot data seeder for "Távfelügyelet és vonulószolgálat" (P5 Phase 1).
//
// Usage:
//   npx tsx scripts/seed-pilot-tavfelugyelet-vonuloszolgalat.ts            # writes
//   npx tsx scripts/seed-pilot-tavfelugyelet-vonuloszolgalat.ts --dry-run  # read-only preview
//
// What it does (normal mode):
//   1. Resolves exactly one existing row by slug, looking for the
//      canonical "tavfelugyelet-vonuloszolgalat" slug or the legacy
//      "technical" slug. The row is renamed in-place if it still uses
//      the legacy slug.
//   2. Writes Hungarian pilot copy into service-detail-page columns
//      only (SEO, value proposition, use cases, included items,
//      process steps, trust items, FAQ, related services).
//   3. Sets isPublished=true so the HU public detail page renders.
//
// Dry-run mode (--dry-run):
//   - Loads env identically to live mode.
//   - Prints a credential-free DATABASE_URL identity (host + db only)
//     so the operator can confirm staging vs production.
//   - SELECTs the same target row.
//   - Prints id / current slug / isPublished / isActive plus a
//     side-by-side diff of every field that would change.
//   - Performs no UPDATE.
//
// Idempotent: running multiple times re-applies the same canonical
// pilot content. Other services and any admin-edited copy are
// untouched. This script intentionally does not write nameHu: the
// display name stays the short baseline/i18n name
// "Távfelügyelet és vonulószolgálat".
//
// Run after the 0011 migration has been applied; otherwise the new
// columns won't exist in the target DB and the UPDATE will fail.

import "./load-env";
import { eq, or } from "drizzle-orm";
import { db, services } from "../lib/db";

const TARGET_SLUG = "tavfelugyelet-vonuloszolgalat";
const LEGACY_SLUG = "technical";

const PILOT_HU = {
  seoTitle: "Távfelügyelet és vonulószolgálat vállalati helyszínekre | Avenir",
  seoDescription:
    "Riasztási jelzések kezelése, eszkaláció, eseményrögzítés és " +
    "vonulószolgálati folyamat biztonságtechnikával és őrzéssel összehangolva.",
  valueProposition:
    "A távfelügyelet és vonulószolgálat akkor ad valódi kontrollt, ha a " +
    "jelzések nem önmagukban érkeznek be, hanem előre egyeztetett " +
    "eszkalációs rend, kapcsolattartási lánc, eseményrögzítés és helyszíni " +
    "reagálási folyamat kapcsolódik hozzájuk.",
  longDesc:
    "A távfelügyelet célja, hogy a riasztási, behatolásjelzési vagy más " +
    "biztonságtechnikai események ne maradjanak elszigetelt jelzések. A " +
    "működés lényege, hogy a jelzések fogadása, értékelése, dokumentálása " +
    "és továbbítása előre rögzített szabályok szerint történjen.\n\n" +
    "Az Avenir a távfelügyeleti és vonulószolgálati folyamatot a helyszín " +
    "biztonságtechnikai adottságaihoz, őrzési rendjéhez és kapcsolattartási " +
    "struktúrájához igazítja. A helyszíni felmérés során meghatározható, " +
    "milyen eseményre milyen jelzési és eszkalációs rend vonatkozzon, kiket " +
    "kell értesíteni, mikor indokolt helyszíni reagálás, és hogyan történjen " +
    "az esemény dokumentálása.\n\n" +
    "A cél egy átlátható, visszakövethető és szerződéses feltételekhez " +
    "igazított jelzéskezelési működés: olyan folyamat, amely összekapcsolja " +
    "a biztonságtechnikát, az objektumőrzést, a portaszolgálatot és a " +
    "vonulószolgálati reagálást.",
  useCases: [
    "Ipari és logisztikai telephelyek riasztási jelzései",
    "Irodaházak, raktárak és üzleti központok jelzéskezelése",
    "Kamerarendszerrel, beléptetővel vagy behatolásjelzővel működő helyszínek",
    "Olyan objektumok, ahol a jelzésekhez eszkalációs és értesítési rend szükséges",
    "Meglévő távfelügyeleti vagy vonulószolgálati folyamat felülvizsgálata",
  ],
  includedItems: [
    "Riasztási és behatolásjelzési folyamatok áttekintése",
    "Jelzéskezelési és eszkalációs rend kialakítása",
    "Kapcsolattartási lánc és értesítési szabályok rögzítése",
    "Vonulószolgálati folyamat szerződéses feltételek szerinti kezelése",
    "Eseményrögzítés és dokumentált riportálás",
    "Kapcsolódás kamerarendszerhez, beléptetéshez és objektumőrzéshez",
    "Helyszíni biztonsági felmérés és működési javaslat",
  ],
  processSteps: [
    {
      title: "Helyszíni és technikai adottságok áttekintése",
      body:
        "Áttekintjük a riasztási pontokat, jelzésforrásokat, technikai " +
        "adottságokat és a helyszín őrzési vagy portaszolgálati működését.",
    },
    {
      title: "Riasztási, behatolásjelzési és jelzéskezelési folyamatok feltérképezése",
      body:
        "Meghatározzuk, milyen jelzések keletkezhetnek, hova futnak be, ki " +
        "értékeli őket, és milyen dokumentálás kapcsolódik hozzájuk.",
    },
    {
      title: "Kapcsolattartási és eszkalációs rend kialakítása",
      body:
        "Rögzítjük, milyen esemény esetén kit kell értesíteni, milyen " +
        "sorrendben történjen a jelzés, és mikor indokolt további reagálás.",
    },
    {
      title: "Vonulószolgálati folyamat szerződéses feltételeinek rögzítése",
      body:
        "A helyszíni reagálási folyamatot a technikai adottságokhoz, a " +
        "szolgáltatási területhez és a szerződéses feltételekhez igazítjuk.",
    },
    {
      title: "Eseményrögzítési és riportálási szabályok egyeztetése",
      body:
        "Meghatározzuk, mit kell naplózni, milyen riport készüljön, és hogyan " +
        "legyen visszakövethető az esemény kezelése.",
    },
    {
      title: "Működés elindítása, ellenőrzése és finomhangolása",
      body:
        "Az indulás után a visszatérő jelzéseket, tapasztalatokat és " +
        "riportokat egyeztetjük, majd szükség szerint pontosítjuk a folyamatot.",
    },
  ],
  trustItems: [
    {
      title: "24/7 diszpécseri háttérrel támogatható működés",
      body:
        "A jelzéskezelési folyamat 24/7 diszpécseri háttérrel támogatható; " +
        "az értesítési és reagálási szabályokat a szerződéses működésben kell " +
        "rögzíteni.",
    },
    {
      title: "Dokumentált jelzéskezelési folyamat",
      body:
        "A jelzések fogadása, értékelése, továbbítása és lezárása előre " +
        "rögzített működési rend szerint történhet.",
    },
    {
      title: "Egyeztetett eszkalációs rend",
      body:
        "Az eszkalációs rend határozza meg, hogy riasztás vagy rendkívüli " +
        "esemény esetén ki, mikor és milyen sorrendben kap értesítést.",
    },
    {
      title: "Kapcsolódás biztonságtechnikához",
      body:
        "A távfelügyeleti működés kamerarendszerhez, behatolásjelzéshez, " +
        "beléptetési eseményhez vagy más biztonságtechnikai jelzéshez " +
        "kapcsolódhat.",
    },
    {
      title: "Kapcsolódás objektumőrzéshez és portaszolgálathoz",
      body:
        "A jelzéskezelés akkor működik hatékonyan, ha az őrzési, porta- és " +
        "kapcsolattartási folyamatok is illeszkednek hozzá.",
    },
    {
      title: "Eseményrögzítés és riportálás",
      body:
        "A szolgáltatás része lehet eseményrögzítés és egyeztetett riportálás, " +
        "hogy a helyszíni működés visszakövethető maradjon.",
    },
    {
      title: "Szerződéses feltételekhez igazított vonulószolgálati folyamat",
      body:
        "A helyszíni reagálás feltételeit, területét és szabályait az " +
        "együttműködés elején kell rögzíteni.",
    },
    {
      title: "ISO 9001 és ISO 27001",
      body:
        "A működés ISO 9001 és ISO 27001 tanúsított irányítási rendszerekhez " +
        "illeszkedő dokumentált folyamatokra építhető.",
    },
  ],
  faq: [
    {
      q: "Mit jelent a távfelügyelet az Avenir szolgáltatásában?",
      a:
        "A távfelügyelet a riasztási, behatolásjelzési vagy más " +
        "biztonságtechnikai jelzések fogadását, kezelését, továbbítását és " +
        "dokumentálását jelenti. A cél, hogy a jelzések előre egyeztetett " +
        "eszkalációs rend szerint kerüljenek feldolgozásra.",
    },
    {
      q: "Mi a különbség a távfelügyelet és a vonulószolgálat között?",
      a:
        "A távfelügyelet a jelzések fogadására és kezelésére fókuszál, míg " +
        "a vonulószolgálat szerződéses feltételek alapján helyszíni reagálási " +
        "folyamatot biztosíthat. A két működés együtt ad teljesebb " +
        "jelzéskezelési és reagálási rendszert.",
    },
    {
      q: "Milyen jelzések kezelhetők?",
      a:
        "A folyamat kapcsolódhat behatolásjelzőhöz, riasztási eseményhez, " +
        "kamerarendszerhez, beléptetési eseményhez vagy más " +
        "biztonságtechnikai jelzéshez. A pontos jelzéstípusokat a helyszíni " +
        "adottságok és a szerződéses igények alapján kell rögzíteni.",
    },
    {
      q: "Van garantált kiérkezési idő?",
      a:
        "A vonulószolgálati folyamatot a szerződéses feltételek, a helyszín, " +
        "a technikai adottságok és a szolgáltatási terület alapján kell " +
        "meghatározni. Emiatt a kiérkezési vagy reagálási szabályokat mindig " +
        "az együttműködés elején érdemes pontosan rögzíteni.",
    },
    {
      q: "Kapunk eseményriportot?",
      a:
        "Igen, a szolgáltatás része lehet eseményrögzítés és egyeztetett " +
        "riportálás. A riport formátuma, gyakorisága és tartalma az " +
        "együttműködés elején rögzíthető.",
    },
    {
      q: "Összekapcsolható a távfelügyelet a biztonságtechnikával?",
      a:
        "Igen. A távfelügyelet akkor működik jól, ha a kamerarendszer, " +
        "behatolásjelző, beléptetés, objektumőrzés és portaszolgálat " +
        "folyamatai összehangoltan támogatják egymást.",
    },
    {
      q: "Mikor érdemes helyszíni biztonsági felmérést kérni?",
      a:
        "Helyszíni biztonsági felmérés akkor hasznos, ha új riasztási vagy " +
        "távfelügyeleti működést kell kialakítani, visszatérő jelzések vannak, " +
        "változik a beléptetési rend, vagy a meglévő reagálási és eszkalációs " +
        "folyamatokat szeretnék átláthatóbbá tenni.",
    },
  ],
  // Related services use future canonical Hungarian public slugs. Missing
  // or unpublished services are filtered safely by the public service query.
  // Do not replace tavfelugyelet-vonuloszolgalat with "technical" in
  // related arrays: "technical" is only the legacy slug for this service.
  relatedSlugs: [
    "biztonsagtechnika",
    "objektumorzes",
    "portaszolgalat",
    "mystery-shopping-helyszini-audit",
    "rendezvenybiztositas",
  ],
};

function buildUpdateValues() {
  return {
    slug: TARGET_SLUG,
    isPublished: true,
    isActive: true,

    seoTitleHu: PILOT_HU.seoTitle,
    seoDescriptionHu: PILOT_HU.seoDescription,
    valuePropositionHu: PILOT_HU.valueProposition,
    longDescHu: PILOT_HU.longDesc,
    useCasesHu: PILOT_HU.useCases,
    includedItemsHu: PILOT_HU.includedItems,
    processStepsHu: PILOT_HU.processSteps,
    trustItemsHu: PILOT_HU.trustItems,
    faqHu: PILOT_HU.faq,
    relatedServiceSlugs: PILOT_HU.relatedSlugs,
  };
}

function redactedDbIdentity(): string {
  const raw = process.env.DATABASE_URL;
  if (!raw) return "<unknown - DATABASE_URL is not set>";
  try {
    const u = new URL(raw);
    const host = u.host || "<no-host>";
    const dbName = u.pathname.replace(/^\//, "") || "<no-db>";
    return `${host}/${dbName}`;
  } catch {
    return "<unparseable DATABASE_URL>";
  }
}

function summarise(value: unknown): string {
  if (value === null || value === undefined) return "(null)";
  if (typeof value === "string") {
    const oneLine = value.replace(/\s+/g, " ").trim();
    if (oneLine.length <= 80) return JSON.stringify(oneLine);
    return `${JSON.stringify(oneLine.slice(0, 77))}... [${value.length} chars]`;
  }
  if (Array.isArray(value)) {
    return `[${value.length} item${value.length === 1 ? "" : "s"}]`;
  }
  return JSON.stringify(value);
}

function printDiff(
  fieldLabel: string,
  current: unknown,
  proposed: unknown,
): void {
  const same =
    JSON.stringify(current ?? null) === JSON.stringify(proposed ?? null);
  const marker = same ? "  =" : "  ~";
  console.log(`${marker} ${fieldLabel}`);
  console.log(`      from: ${summarise(current)}`);
  console.log(`      to:   ${summarise(proposed)}`);
}

async function main() {
  const isDryRun = process.argv.includes("--dry-run");
  const banner = isDryRun
    ? "--- seed-pilot-tavfelugyelet-vonuloszolgalat DRY-RUN start ---"
    : "--- seed-pilot-tavfelugyelet-vonuloszolgalat start ---";
  console.log(banner);
  console.log(`DB target (host/db): ${redactedDbIdentity()}`);

  const matches = await db
    .select()
    .from(services)
    .where(or(eq(services.slug, TARGET_SLUG), eq(services.slug, LEGACY_SLUG)))
    .orderBy(services.id);

  if (matches.length === 0) {
    console.error(
      `No existing canonical row found (looked for slug "${TARGET_SLUG}" ` +
        `or "${LEGACY_SLUG}"). Run "npm run db:seed-services" first to ` +
        `create the baseline rows, then re-run this script.`,
    );
    process.exit(1);
  }

  if (matches.length > 1) {
    console.error(
      `Expected exactly one target row but found ${matches.length} ` +
        `matching "${TARGET_SLUG}" or "${LEGACY_SLUG}". Resolve duplicate ` +
        `service rows before running this pilot seed.`,
    );
    process.exit(1);
  }

  const existing = matches[0];
  const values = buildUpdateValues();

  console.log("");
  console.log("Target row:");
  console.log(`  id:           ${existing.id}`);
  console.log(`  slug:         ${existing.slug}`);
  console.log(`  isPublished:  ${existing.isPublished}`);
  console.log(`  isActive:     ${existing.isActive}`);

  console.log("");
  console.log("Planned changes (= unchanged, ~ would change):");
  printDiff("slug", existing.slug, values.slug);
  printDiff("isPublished", existing.isPublished, values.isPublished);
  printDiff("isActive", existing.isActive, values.isActive);
  printDiff("seoTitleHu", existing.seoTitleHu, values.seoTitleHu);
  printDiff(
    "seoDescriptionHu",
    existing.seoDescriptionHu,
    values.seoDescriptionHu,
  );
  printDiff(
    "valuePropositionHu",
    existing.valuePropositionHu,
    values.valuePropositionHu,
  );
  printDiff("longDescHu", existing.longDescHu, values.longDescHu);
  printDiff("useCasesHu", existing.useCasesHu, values.useCasesHu);
  printDiff("includedItemsHu", existing.includedItemsHu, values.includedItemsHu);
  printDiff("processStepsHu", existing.processStepsHu, values.processStepsHu);
  printDiff("trustItemsHu", existing.trustItemsHu, values.trustItemsHu);
  printDiff("faqHu", existing.faqHu, values.faqHu);
  printDiff(
    "relatedServiceSlugs",
    existing.relatedServiceSlugs,
    values.relatedServiceSlugs,
  );

  if (isDryRun) {
    console.log("");
    console.log(
      "--- seed-pilot-tavfelugyelet-vonuloszolgalat DRY-RUN done - no rows written. " +
        "Re-run without --dry-run to apply. ---",
    );
    return;
  }

  console.log("");
  console.log(`Applying pilot content to row id=${existing.id}...`);

  await db
    .update(services)
    .set({ ...values, updatedAt: new Date() })
    .where(eq(services.id, existing.id));

  console.log(
    `--- seed-pilot-tavfelugyelet-vonuloszolgalat done - row id=${existing.id} updated, ` +
      `slug=${TARGET_SLUG} published. ---`,
  );
}

main().catch((err) => {
  console.error("seed-pilot-tavfelugyelet-vonuloszolgalat FAILED:", err);
  process.exit(1);
});
