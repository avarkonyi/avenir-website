// One-shot pilot data seeder for "Biztonságtechnika" (P5 Phase 1).
//
// Usage:
//   npx tsx scripts/seed-pilot-biztonsagtechnika.ts            # writes
//   npx tsx scripts/seed-pilot-biztonsagtechnika.ts --dry-run  # read-only preview
//
// What it does (normal mode):
//   1. Resolves exactly one existing row by slug, looking for the
//      canonical "biztonsagtechnika" slug or the legacy "building"
//      slug. The row is renamed in-place if it still uses the legacy
//      slug.
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
// display name stays the short baseline/i18n name "Biztonságtechnika".
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

const TARGET_SLUG = "biztonsagtechnika";
const LEGACY_SLUG = "building";

const PILOT_HU = {
  seoTitle: "Biztonságtechnika vállalati helyszínekre | Avenir",
  seoDescription:
    "Kamerarendszer, beléptetés, behatolásjelzés és riasztási folyamatok " +
    "élőerős őrzéssel és portaszolgálattal összehangolva.",
  valueProposition:
    "A biztonságtechnika a kamerarendszert, a beléptetést és a riasztási " +
    "folyamatokat helyszínre szabott biztonsági rendszerré kapcsolja össze, " +
    "dokumentált céllal, arányos lefedettséggel, eszkalációval és működési " +
    "integrációval.",
  longDesc:
    "A biztonságtechnika célja, hogy a helyszíni vagyonvédelem ne csak " +
    "emberi jelenlétre támaszkodjon, hanem jól kezelhető technikai " +
    "támogatást is kapjon. Ide tartozhat a kamerarendszer, a beléptető " +
    "rendszer, a behatolásjelzés, a riasztási folyamat, a jelzések " +
    "továbbítása és az események dokumentálása.\n\n" +
    "Avenir a biztonságtechnikai működést nem elszigetelt " +
    "eszközbeszerzésként kezeli. A helyszíni felmérés alapján azt " +
    "vizsgáljuk, hol vannak belépési pontok, gyenge ellenőrzési zónák, " +
    "visszatérő események, kritikus területek és olyan folyamatok, ahol a " +
    "technológia az őrzést, a portaszolgálatot vagy a távfelügyeletet " +
    "támogatni tudja.\n\n" +
    "Az adatvédelmi szempontok a technikai kialakítás részét képezik. A " +
    "kameraképek lefedettségét, a látómezőt, a hozzáférési jogosultságokat, " +
    "az érintettek tájékoztatását és a megőrzési logikát a dokumentált " +
    "célhoz és az ügyfél adatvédelmi keretéhez kell igazítani. Az Avenir " +
    "technikai inputot ad ehhez a felméréshez, de a jogalap és a végső " +
    "adatvédelmi döntések az ügyfél és tanácsadói körében maradnak.\n\n" +
    "A cél egy átlátható, karbantartható és napi működésben is használható " +
    "biztonságtechnikai réteg: olyan megoldás, amely nem csak rögzít, " +
    "hanem segíti az észlelést, az eszkalációt, a beléptetést, a " +
    "riportálást és a döntéshozatalt.",
  useCases: [
    "Irodaházak és üzleti központok beléptetési pontjai",
    "Ipari és logisztikai telephelyek kamerás és riasztási zónái",
    "Raktárak, teherkapuk és kritikus belépési pontok",
    "Olyan helyszínek, ahol az élőerős őrzést technikai támogatással kell kiegészíteni",
    "Meglévő kamerarendszer, beléptető vagy riasztási folyamat felülvizsgálata",
  ],
  includedItems: [
    "Kamerarendszer és megfigyelési pontok felmérése",
    "Beléptetési pontok és jogosultsági folyamatok áttekintése",
    "Behatolásjelzés és riasztási folyamatok vizsgálata",
    "Élőerős őrzéssel és portaszolgálattal való összekapcsolás",
    "Jelzéskezelési és eszkalációs rend kialakítása",
    "Helyszíni biztonsági felmérés és technológiai javaslat",
    "Eseményrögzítés és riportálási támogatás",
  ],
  processSteps: [
    {
      title: "Helyszíni biztonságtechnikai felmérés",
      body:
        "Áttekintjük a helyszín belépési pontjait, kamerás lefedettségét, " +
        "riasztási folyamatait és a kapcsolódó őrzési vagy portaszolgálati " +
        "működést.",
    },
    {
      title: "Kritikus pontok, belépési zónák és kockázati területek azonosítása",
      body:
        "Azonosítjuk azokat a zónákat, ahol a mozgás, a jogosultság, a " +
        "teherforgalom vagy a visszatérő események technikai támogatást " +
        "igényelnek.",
    },
    {
      title: "Kamera-, beléptető-, riasztási és jelzéskezelési folyamatok áttekintése",
      body:
        "Megnézzük, hogy a meglévő vagy tervezett technikai rendszer hogyan " +
        "támogatja az észlelést, a beléptetést, a riasztást és az " +
        "eseménykezelést.",
    },
    {
      title: "Technikai és élőerős vagyonvédelmi működés összehangolása",
      body:
        "A technikai jelzéseket az őri, portaszolgálati, kapcsolattartói és " +
        "távfelügyeleti folyamatokhoz igazítjuk.",
    },
    {
      title: "Eszkalációs, riportálási és karbantartási szempontok rögzítése",
      body:
        "Rögzítjük, milyen eseményre ki reagál, mit kell naplózni, milyen " +
        "riport készül, és hogyan marad karbantartható a rendszer.",
    },
    {
      title: "Javaslat a biztonságtechnikai működés fejlesztésére vagy integrálására",
      body:
        "A felmérés alapján gyakorlati javaslatot adunk arra, hogyan tud a " +
        "technika jobban kapcsolódni a napi biztonsági működéshez.",
    },
  ],
  trustItems: [
    {
      title: "Helyszínre szabott biztonságtechnikai felmérés",
      body:
        "A technikai igényeket helyszíni felmérés és működési áttekintés " +
        "alapján rögzítjük, nem önálló eszközlistaként.",
    },
    {
      title: "Biztonságtechnikai engedéllyel támogatott működés",
      body:
        "A szolgáltatás a biztonságtechnikai engedélyhez és a helyszíni " +
        "szerződéses igényekhez igazodva alakítható ki.",
    },
    {
      title: "Integráció a helyszíni működéssel és eszkalációs lánccal",
      body:
        "A kamera-, beléptetési és riasztási jelzések akkor adnak valódi " +
        "működési értéket, ha kapcsolódnak az őri jelenléthez, a portaszolgálati " +
        "folyamatokhoz, a meghatározott eszkalációs útvonalakhoz és az " +
        "egyértelműen kijelölt reagálási felelősségekhez.",
    },
    {
      title: "Kapcsolódás portaszolgálati és beléptetési folyamatokhoz",
      body:
        "A technikai rendszer támogathatja a vendég-, beszállítói és " +
        "munkatársi beléptetést, valamint a jogosultsági szabályok követését.",
    },
    {
      title: "Adatvédelmi szempontokat figyelembe vevő technikai javaslat",
      body:
        "A kameraképek lefedettsége, a látómező, a hozzáférési jogosultságok, " +
        "az érintetti tájékoztatás és a megőrzési logika a dokumentált célhoz " +
        "és az ügyfél adatvédelmi keretéhez igazítandó.",
    },
    {
      title: "Dokumentált megállapítások és megvalósítási javaslat",
      body:
        "A felmérés eredménye riportálható megállapításokban, prioritásokban, " +
        "integrációs pontokban és megvalósítási javaslatban foglalható össze.",
    },
    {
      title: "ISO 9001 és ISO 27001 által támogatott működési fegyelem",
      body:
        "A működés ISO 9001 és ISO 27001 tanúsított irányítási rendszerekhez " +
        "illeszkedő szabályozott folyamatokra építhető.",
    },
  ],
  faq: [
    {
      q: "Mit jelent a biztonságtechnika az Avenir szolgáltatásában?",
      a:
        "A biztonságtechnika a helyszíni vagyonvédelem technikai rétegét " +
        "jelenti: kamerarendszert, beléptetést, behatolásjelzést, riasztási " +
        "folyamatot, jelzéskezelést és ezek szabályozott működését. A cél, " +
        "hogy a technika ne különálló eszköz legyen, hanem támogassa az " +
        "őrzést, a portaszolgálatot és az eszkalációt.",
    },
    {
      q: "Összeköthető a biztonságtechnika az élőerős őrzéssel?",
      a:
        "Igen. A kamerarendszer, beléptető vagy riasztási folyamat akkor ad " +
        "valódi értéket, ha az őrök, a porta, a kapcsolattartók és az " +
        "eszkalációs rend is tudja, mikor milyen jelzésre mi a teendő.",
    },
    {
      q: "Milyen helyszíneken hasznos a biztonságtechnikai felmérés?",
      a:
        "Különösen hasznos irodaházaknál, ipari és logisztikai telephelyeken, " +
        "raktáraknál, teherkapuknál, több belépési ponttal működő " +
        "objektumoknál, illetve olyan helyszíneken, ahol visszatérő incidensek " +
        "vagy ellenőrizetlen mozgások fordulnak elő.",
    },
    {
      q: "Csak új rendszert lehet tervezni, vagy meglévő rendszert is felül lehet vizsgálni?",
      a:
        "Meglévő kamerarendszer, beléptető vagy riasztási folyamat is " +
        "felülvizsgálható. Ilyenkor azt nézzük meg, hogy a jelenlegi technika " +
        "támogatja-e a napi működést, az őrzést, az eseménykezelést és a " +
        "riportálást.",
    },
    {
      q: "Kapcsolódhat a rendszer távfelügyelethez?",
      a:
        "Igen, ahol erre szükség van, a biztonságtechnikai folyamat kapcsolódhat " +
        "távfelügyeleti vagy jelzéskezelési működéshez. Ennek részleteit a " +
        "helyszíni kockázatok, a technikai adottságok és a szerződéses igények " +
        "alapján érdemes rögzíteni.",
    },
    {
      q: "Miért fontos a rögzített eszkalációs rend?",
      a:
        "Az eszkalációs rend határozza meg, hogy riasztás, rendkívüli esemény " +
        "vagy jogosulatlan belépési kísérlet esetén ki kap jelzést, milyen " +
        "sorrendben történik az értesítés, mit kell rögzíteni, és hogyan zárul " +
        "le az esemény kezelése.",
    },
    {
      q: "Miben más ez, mint egy egyszerű kamera- vagy riasztórendszer?",
      a:
        "Egy kamera- vagy riasztórendszer önmagában csak eszköz. Avenir " +
        "szemléletében a biztonságtechnika a teljes helyszíni működés része: " +
        "kapcsolódik az őrzéshez, a portaszolgálathoz, a beléptetéshez, a " +
        "jelzéskezeléshez és a riportáláshoz.",
    },
    {
      q: "Kell-e adatvédelmi szempontokat vizsgálni kamerarendszer kialakításánál?",
      a:
        "Igen. Kamerarendszer tervezésekor a célhoz kötöttség, az érintetti " +
        "tájékoztatás, a jogos érdek dokumentálása, a kamerák látószöge, a " +
        "megőrzési idő és a helyszín saját adatkezelési környezete is " +
        "vizsgálandó. Ez nem jogi tanácsadás, de a műszaki javaslatnak " +
        "ezekkel a szempontokkal is számolnia kell.",
    },
    {
      q: "Milyen szempontok befolyásolják a kamerafelvételek megőrzési idejét?",
      a:
        "A megőrzési időt a rögzítés célja, a helyszín kockázati profilja, " +
        "az incidenskezelési igény, a belső szabályzat és az adatvédelmi " +
        "környezet befolyásolja. Nincs minden helyszínre azonos, általános " +
        "válasz; a megőrzési rendet szakmailag indokoltan kell kialakítani.",
    },
  ],
  // Related services use future canonical Hungarian public slugs. Missing
  // or unpublished services are filtered safely by the public service query.
  // Do not replace tavfelugyelet-vonuloszolgalat with "technical" here:
  // "technical" is the legacy slug for the future monitoring service.
  relatedSlugs: [
    "tavfelugyelet-vonuloszolgalat",
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
    ? "--- seed-pilot-biztonsagtechnika DRY-RUN start ---"
    : "--- seed-pilot-biztonsagtechnika start ---";
  console.log(banner);
  ensureStagingDbTarget({ scriptName: "seed-pilot-biztonsagtechnika", isDryRun });
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
      "--- seed-pilot-biztonsagtechnika DRY-RUN done - no rows written. " +
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
    `--- seed-pilot-biztonsagtechnika done - row id=${existing.id} updated, ` +
      `slug=${TARGET_SLUG} published. ---`,
  );
}

main().catch((err) => {
  console.error("seed-pilot-biztonsagtechnika FAILED:", err);
  process.exit(1);
});
