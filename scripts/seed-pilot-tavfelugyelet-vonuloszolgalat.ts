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
//
// Safety: pilot seeds are staging-only. The runtime DB target guard
// verifies DATABASE_URL before any SELECT/UPDATE, including direct
// `npx tsx scripts/seed-pilot-*.ts` execution, and never prints the
// full connection string.

import "./load-env";
import { ensureStagingDbTarget } from "./ensure-staging-db";
import { eq, or } from "drizzle-orm";
import { db, services } from "../lib/db";

const TARGET_SLUG = "tavfelugyelet-vonuloszolgalat";
const LEGACY_SLUG = "technical";

const PILOT_HU = {
  seoTitle: "Távfelügyelet és vonulószolgálat | Avenir",
  seoDescription:
    "Riasztási jelzések kezelése, eszkaláció, eseményrögzítés és " +
    "vonulószolgálati folyamat biztonságtechnikával és őrzéssel összehangolva.",
  valueProposition:
    "Az Avenir 24/7 diszpécseri háttérrel kezeli a csatlakoztatott " +
    "helyszínekről érkező riasztási, behatolásjelzési és kamerajelzéseket; " +
    "minden jelzés ellenőrzött eszkalációs folyamatba kerül, és az " +
    "intézkedések eseménynaplóban rögzülnek.",
  longDesc:
    "Az Avenir az egyeztetett távfelügyeleti beállítás szerint fogadja a " +
    "csatlakoztatott helyszínekről érkező riasztási, behatolásjelzési és " +
    "kamerához kapcsolódó jelzéseket. A jelzések az előre rögzített " +
    "verifikációs protokoll szerint kerülnek ellenőrzésre az eszkaláció " +
    "előtt. A téves jelzések naplózhatók és elemezhetők; a valós események " +
    "a helyszíni protokoll szerint a kijelölt kapcsolattartóhoz, " +
    "vonulószolgálathoz vagy külső eszkalációs útvonalhoz kerülnek. Az " +
    "intézkedések eseménynaplóban rögzülnek.\n\n" +
    "Ha a szolgáltatás távfelügyeleti jelzéskezelést tartalmaz, a " +
    "verifikációs lépés a működési eljárás része, és eseményenként " +
    "dokumentálásra kerül. A távfelügyelet és a vonulószolgálat jogi és " +
    "szerződéses keretei az előkészítés során kerülnek egyeztetésre; a " +
    "külső eszkaláció az egyeztetett helyszíni protokoll és az alkalmazandó " +
    "szabályok szerint történik.\n\n" +
    "A távfelügyelet akkor működik jól, ha kapcsolódik a helyszín többi " +
    "biztonsági rétegéhez: a biztonságtechnikához, az élőerős őrzéshez, a " +
    "portaszolgálathoz és az egyeztetett reagálási folyamathoz. Így a " +
    "jelzéskezelés, az eszkaláció, az eseménynaplózás és a lezárás egy " +
    "működési modellbe rendeződik.",
  useCases: [
    "Ipari és logisztikai helyszínek behatolásjelzési, riasztási vagy peremvédelmi jelzésekkel",
    "Irodaházak, raktárak és üzleti központok kamerával felügyelt zónákkal",
    "Beléptetéssel vagy behatolásjelzéssel működő helyszínek, ahol 24/7 jelzéskezelés szükséges",
    "Több bérlős vagy több helyszínes működés dokumentált eszkalációs lánccal",
    "Meglévő távfelügyeleti vagy vonulószolgálati folyamatok felülvizsgálata verifikációs, reagálási vagy riportálási hiányosságok miatt",
  ],
  includedItems: [
    "24/7 riasztási és kamerajelzések fogadása az egyeztetett távfelügyeleti beállítás szerint",
    "Verifikált riasztási protokoll, eseményenként dokumentált ellenőrzési lépéssel",
    "Név szerinti kapcsolattartási lánc, eszkalációs mátrix és értesítési szabályok",
    "Saját vonulószolgálati folyamat egyeztetett szerződéses feltételek szerint",
    "Időbélyegzett eseménynapló és eseményriport",
    "Kapcsolódás a helyszín biztonságtechnikájához, élőerős őrzéséhez és portaszolgálatához",
  ],
  processSteps: [
    {
      title: "Helyszíni és technikai adottságok áttekintése",
      body:
        "Áttekintjük a riasztási pontokat, jelzésforrásokat, technikai " +
        "adottságokat és a helyszín őrzési vagy portaszolgálati működését.",
    },
    {
      title: "Jelzésforrások és verifikációs pontok feltérképezése",
      body:
        "Meghatározzuk, milyen jelzések keletkezhetnek, milyen forrásból " +
        "érkeznek, milyen ellenőrzési pontok kapcsolódnak hozzájuk, és hogyan " +
        "kell dokumentálni a verifikációt.",
    },
    {
      title: "Kapcsolattartási lánc és eszkalációs mátrix kialakítása",
      body:
        "Rögzítjük, milyen esemény esetén kit kell értesíteni, milyen " +
        "sorrendben történjen az eszkaláció, és milyen esemény indít " +
        "vonulószolgálati vagy külső reagálási folyamatot.",
    },
    {
      title: "Vonulószolgálati működés egyeztetett feltételek szerint",
      body:
        "A helyszíni reagálási folyamatot a technikai adottságokhoz, a " +
        "szolgáltatási területhez és a szerződéses feltételekhez igazítjuk.",
    },
    {
      title: "Eseménynaplózási és riportálási szabályok",
      body:
        "Meghatározzuk, mit kell naplózni, milyen riport készüljön, milyen " +
        "lezárási státuszok használhatók, és hogyan legyen visszakereshető az " +
        "eseménykezelés.",
    },
    {
      title: "Indítás, működéskövetés és finomhangolás",
      body:
        "Az indulás után a visszatérő jelzéseket, tapasztalatokat és " +
        "riportokat egyeztetjük, majd szükség szerint pontosítjuk a folyamatot.",
    },
  ],
  trustItems: [
    {
      title: "24/7 jelzésfogadás verifikált eszkalációval",
      body:
        "Az Avenir 24/7 jelzésfogadást biztosít a csatlakoztatott " +
        "helyszínekhez, a riasztások pedig az egyeztetett verifikációs " +
        "protokoll szerint kerülnek ellenőrzésre az eszkaláció előtt.",
    },
    {
      title: "Dokumentált riasztás-verifikációs napló",
      body:
        "Minden jelzés, ellenőrzési lépés és eszkalációs döntés " +
        "eseménynaplóban rögzül, amely a szolgáltatási megállapodás szerint " +
        "visszakereshető.",
    },
    {
      title: "Név szerinti kapcsolattartási lánc és eszkalációs mátrix",
      body:
        "Az értesítési sorrend, a kijelölt kapcsolattartók és a reagálási " +
        "kiváltó pontok előre egyeztetve és helyszínenként dokumentálva vannak.",
    },
    {
      title: "Működési integráció biztonságtechnikával, őrzéssel és portaszolgálattal",
      body:
        "A távfelügyelet a helyszín kamerarendszerével, beléptetésével, " +
        "élőerős őrzésével és portaszolgálatával együtt működik, hogy a " +
        "jelzéskezelés és a reagálás egy működési modell szerint történjen.",
    },
    {
      title: "Eseményrögzítés és időszakos incidensriport",
      body:
        "Az ügyfél az egyeztetett gyakoriság szerint eseményriportot kap; az " +
        "eseménynapló támogatja a téves jelzések, visszatérő események és " +
        "fejlesztési pontok áttekintését.",
    },
    {
      title: "ISO 9001 és ISO 27001 irányítási rendszerek",
      body:
        "A távfelügyeleti működést az Avenir ISO 9001 és ISO 27001 " +
        "tanúsított irányítási rendszerei támogatják, amennyiben ezek a " +
        "folyamatok a tanúsított működési körbe tartoznak.",
    },
  ],
  faq: [
    {
      q: "Mit jelent a távfelügyelet az Avenir szolgáltatásában?",
      a:
        "Az Avenir a csatlakoztatott helyszínekről érkező riasztási, " +
        "behatolásjelzési, kamerához kapcsolódó vagy más biztonságtechnikai " +
        "jelzéseket fogadja, ellenőrzi, naplózza és az egyeztetett protokoll " +
        "szerint eszkalálja.",
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
        "kamerarendszerhez, beléptetési eseményhez, peremvédelmi jelzéshez " +
        "vagy más biztonságtechnikai jelzéshez. A pontos jelzéstípusokat a " +
        "helyszíni adottságok és a szerződéses igények alapján kell rögzíteni.",
    },
    {
      q: "Hogyan történik a riasztás ellenőrzése az eszkaláció előtt?",
      a:
        "A verifikációs lépés a helyszíni protokollban kerül meghatározásra. " +
        "Az Avenir a rendelkezésre álló jelzésforrások és az egyeztetett " +
        "ellenőrzési szabály alapján vizsgálja a riasztást az eszkaláció " +
        "előtt. A téves jelzések naplózhatók és visszanézhetők; a valós " +
        "események a dokumentált kapcsolattartási és reagálási protokoll " +
        "szerint kerülnek eszkalálásra. Minden lépés eseménynaplóban rögzül.",
    },
    {
      q: "Rendelkezik az Avenir a távfelügyelethez és vonulószolgálathoz szükséges engedélyekkel?",
      a:
        "Igen. A távfelügyelet és a vonulószolgálat az alkalmazandó magyar " +
        "személy- és vagyonvédelmi szabályozási keret szerint történik. Az " +
        "engedélyre és a szolgáltatási dokumentációra vonatkozó információk " +
        "a szerződéses előkészítés során egyeztethetők.",
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
      q: "Hogyan történik az eszkaláció?",
      a:
        "Az eszkaláció a helyszíni protokollban rögzített név szerinti " +
        "kapcsolattartási lánc, értesítési sorrend és reagálási mátrix szerint " +
        "történik. A protokoll határozza meg, mikor kell kijelölt " +
        "kapcsolattartót, vonulószolgálatot vagy külső eszkalációs útvonalat " +
        "bevonni.",
    },
    {
      q: "Kapunk eseményriportot?",
      a:
        "Igen. Az ügyfél az egyeztetett gyakoriság szerint eseményriportot " +
        "kap; a riport formátuma, gyakorisága és tartalma az együttműködés " +
        "elején rögzíthető.",
    },
    {
      q: "Hogyan dokumentálhatók a riasztási jelzések és események?",
      a:
        "A jelzések időbélyegzett eseménynaplóban rögzíthetők: mikor érkezett " +
        "a jelzés, milyen ellenőrzési lépés történt, milyen értesítési lánc " +
        "indult el, történt-e eszkaláció, milyen intézkedés következett, és " +
        "mi lett a lezárási státusz. A részleteket a helyszíni és szerződéses " +
        "szabályok alapján kell meghatározni.",
    },
    {
      q: "Összekapcsolható a távfelügyelet a biztonságtechnikával?",
      a:
        "Igen. A távfelügyelet akkor működik jól, ha a kamerarendszer, " +
        "behatolásjelző, beléptetés, objektumőrzés és portaszolgálat " +
        "folyamatai összehangoltan támogatják egymást.",
    },
    {
      q: "Hogyan kezeljük az adatvédelmi szempontokat a távfelügyeleti működésben?",
      a:
        "A távfelügyeletben használt jelzések, kameraképek és beléptetési " +
        "események kizárólag az egyeztetett távfelügyeleti cél szerint és az " +
        "ügyfél adatvédelmi keretei alapján kezelhetők. A megőrzés, a " +
        "hozzáférésnaplózás és az adatminimalizálás szabályai helyszínenként " +
        "kerülnek meghatározásra. Az Avenir a folyamat technikai és működési " +
        "oldalát támogatja; a jogalap és a végső adatvédelmi döntések az " +
        "ügyfél és tanácsadói körében maradnak.",
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
    "hard-fm",
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
  ensureStagingDbTarget({
    scriptName: "seed-pilot-tavfelugyelet-vonuloszolgalat",
    isDryRun,
  });
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
