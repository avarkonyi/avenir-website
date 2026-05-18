// One-shot pilot data seeder for "Hard FM" (P5 Phase 1).
//
// Usage:
//   npx tsx scripts/seed-pilot-hard-fm.ts            # writes
//   npx tsx scripts/seed-pilot-hard-fm.ts --dry-run  # read-only preview
//
// What it does (normal mode):
//   1. Resolves exactly one existing row by slug, looking for the
//      canonical "hard-fm" slug or the legacy "hardfm" slug. The row
//      is renamed in-place if it still uses the legacy slug.
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
// display name stays the short baseline/i18n name "Hard FM".
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

const TARGET_SLUG = "hard-fm";
const LEGACY_SLUG = "hardfm";

const PILOT_HU = {
  seoTitle: "Hard FM és műszaki üzemeltetés | Avenir",
  seoDescription:
    "Tervezett megelőző karbantartás, reaktív hibakezelés, szakcéges " +
    "koordináció és dokumentált riportálás műszaki helyszíni működéshez.",
  valueProposition:
    "A Hard FM a tervezett megelőző karbantartást és a reaktív hibakezelést " +
    "fogja össze az épületüzemeltetés, gépészeti és elektromos rendszerek, " +
    "vízvezeték, HVAC és műszaki működés területén, dokumentált " +
    "eszkalációval és riportálással.",
  longDesc:
    "Az Avenir Hard FM szolgáltatása a vállalati, ipari és logisztikai " +
    "helyszínek műszaki rendszereinek tervezett megelőző karbantartását és " +
    "reaktív hibakezelését fogja össze. A scope kiterjedhet az " +
    "épületállagra, gépészeti és elektromos rendszerekre, vízvezeték- és " +
    "HVAC-folyamatokra, kisebb műszaki munkákra, szakcéges koordinációra és " +
    "dokumentált hibakövetésre.\n\n" +
    "Az Avenir a mobilizáció során az ügyféllel együtt rögzíti a " +
    "hibabejelentési útvonalat, az eszkalációs pontokat, a szolgáltatói " +
    "felelősségeket, a beavatkozási naplózást és a riportálási ritmust. Ha " +
    "HVAC-, elektromos, vízvezeték- vagy kötelező felülvizsgálati munkákhoz " +
    "szakcég szükséges, azok kezelése az egyeztetett működési modell részeként " +
    "történik, nem rejtett átadásként az ügyfél felé.\n\n" +
    "A Hard FM működhet önálló műszaki üzemeltetési szolgáltatásként, vagy " +
    "az Avenir portaszolgálatával, élőerős őrzésével vagy Soft FM " +
    "szolgáltatásával együtt ugyanazon a helyszínen. Integrált működésben a " +
    "riportálási ritmus, az eszkalációs lánc és az operatív kapcsolattartási " +
    "pontok összehangoltak, így az ügyfél nem széttagolt szolgáltatói " +
    "visszajelzéseket, hanem egységes műszaki képet kap.",
  useCases: [
    "Irodaházak és üzleti központok tulajdonosai és üzemeltetői",
    "Logisztikai, raktári és könnyűipari helyszínek összetett műszaki rendszerekkel",
    "Egyhelyszínes üzemeltetők, akik egységes műszaki működési modellt keresnek",
    "Több helyszínes portfóliók, ahol a széttagolt FM-szolgáltatói koordinációt kell összevonni",
    "Helyszínek, ahol a Hard FM-nek a portaszolgálattal, őrzéssel vagy Soft FM-mel együtt kell működnie",
  ],
  includedItems: [
    "Tervezett megelőző karbantartási ütemezés az egyeztetett eszközökre és rendszerekre",
    "Reaktív hibakezelés egyeztetett prioritási kategóriákkal",
    "Dokumentált hibanapló, beavatkozási nyilvántartás és lezárási státusz",
    "Szakcéges koordináció HVAC-, elektromos, vízvezeték- és felülvizsgálati feladatokhoz",
    "Kötelező felülvizsgálatok koordinációja és dokumentációs támogatása, ha a scope tartalmazza",
    "Havi működési riport nyitott feladatokról, lezárt beavatkozásokról, visszatérő hibákról és fejlesztési pontokról",
  ],
  processSteps: [
    {
      title: "Eszköz- és állapotfelmérés",
      body:
        "Áttekintjük az egyeztetett eszközöket, rendszereket, műszaki " +
        "állapotot, visszatérő hibákat és az érintett szolgáltatói kört.",
    },
    {
      title: "PPM-ütemezés és prioritási kategóriák",
      body:
        "Az ügyféllel együtt meghatározzuk a megelőző karbantartási " +
        "ütemezést, a hibabejelentési útvonalat és a reaktív feladatok " +
        "prioritási kategóriáit.",
    },
    {
      title: "Mobilizáció és működési beállítás",
      body:
        "Rögzítjük a szolgáltatói felelősségeket, a szakcéges bevonás " +
        "szabályait, az eszkalációs pontokat és az operatív kapcsolattartást.",
    },
    {
      title: "Működtetés, naplózás és riportálás",
      body:
        "A hibabejelentések, beavatkozások, státuszváltozások, lezárások és " +
        "nyitott feladatok dokumentált hibanaplóban és havi riportban követhetők.",
    },
    {
      title: "Visszatérő hibák és fejlesztési pontok áttekintése",
      body:
        "A riportok és tapasztalatok alapján áttekintjük a visszatérő " +
        "hibákat, a nyitott kockázatokat és a következő fejlesztési pontokat.",
    },
  ],
  trustItems: [
    {
      title: "Név szerinti operatív kapcsolattartó",
      body:
        "Az ügyfél név szerinti operatív kapcsolattartót kap a " +
        "hibabejelentéshez, az eszkalációhoz, a szolgáltatói koordinációhoz " +
        "és a riportáláshoz.",
    },
    {
      title: "Prioritásalapú reaktív hibakezelés",
      body:
        "A reaktív feladatok a mobilizáció során egyeztetett prioritási " +
        "kategóriák szerint kezelhetők, így a sürgős hibák, a rutin feladatok " +
        "és a tervezett munkák eltérő kezelési úton futnak.",
    },
    {
      title: "Szakcéges koordináció",
      body:
        "A HVAC-, elektromos, vízvezeték- és felülvizsgálati feladatok " +
        "szakcégek bevonásával is teljesíthetők, az egyeztetett működési " +
        "modell szerint koordinálva.",
    },
    {
      title: "Dokumentált hibanapló és havi riport",
      body:
        "A hibabejelentések, beavatkozások, státuszváltozások és lezárások " +
        "rögzítésre kerülnek, és havi működési riportban összegezhetők.",
    },
    {
      title: "Kapcsolódás portaszolgálathoz, őrzéshez és Soft FM-hez",
      body:
        "Ha a Hard FM portaszolgálattal, élőerős őrzéssel vagy Soft FM-mel " +
        "együtt működik, a riportálás, az eszkaláció és az operatív " +
        "kapcsolattartási pontok az adott helyszínen összehangolhatók.",
    },
  ],
  faq: [
    {
      q: "Mit jelent a Hard FM?",
      a:
        "A Hard FM a helyszínek műszaki üzemeltetésének, karbantartási " +
        "folyamatainak, hibabejelentéseinek és szolgáltatói egyeztetéseinek " +
        "koordinált kezelését jelenti. A cél, hogy a műszaki működés " +
        "átlátható és riportálható legyen.",
    },
    {
      q: "Miben különbözik a Hard FM a Soft FM-től?",
      a:
        "A Hard FM elsősorban műszaki, karbantartási és üzemeltetési " +
        "folyamatokra fókuszál, míg a Soft FM inkább a napi működést támogató " +
        "szolgáltatásokhoz, például takarításhoz, zöldterülethez vagy operatív " +
        "támogatáshoz kapcsolódik. A két terület sok helyszínen együtt működik " +
        "hatékonyan.",
    },
    {
      q: "Kezelhetők hibabejelentések is?",
      a:
        "Igen, a Hard FM része lehet a hibabejelentések fogadási, továbbítási, " +
        "priorizálási és eszkalációs rendjének kialakítása. A pontos folyamatot " +
        "a helyszíni igények és a szerződéses keretek alapján érdemes rögzíteni.",
    },
    {
      q: "Avenir saját maga végez minden műszaki munkát?",
      a:
        "A működés a feladat jellegétől és a szerződéses keretektől függ. A " +
        "Hard FM szolgáltatás része lehet saját koordináció, kijelölt " +
        "szolgáltatók bevonása, alvállalkozói egyeztetés vagy a megrendelő " +
        "meglévő partnereinek koordinált kezelése.",
    },
    {
      q: "Van garantált javítási idő?",
      a:
        "A javítási vagy reagálási idő a helyszíntől, a feladat típusától, a " +
        "hozzáférési feltételektől és a szükséges szakcégektől függ. Az " +
        "Avenir a mobilizáció során prioritási kategóriákat tud meghatározni, " +
        "hogy a sürgős hibák, a rutin feladatok és a tervezett karbantartás " +
        "eltérő kezelési úton fusson, de ez nem jelent általános garantált " +
        "javítási időt.",
    },
    {
      q: "Kapunk riportot a műszaki feladatokról?",
      a:
        "Igen, a szolgáltatás része lehet egyeztetett riportálás. A riport " +
        "tartalmazhatja a hibabejelentéseket, státuszokat, beavatkozásokat, " +
        "lezárt feladatokat, visszatérő problémákat és fejlesztési javaslatokat.",
    },
    {
      q: "Mikor érdemes külön Hard FM folyamatot kialakítani?",
      a:
        "Dedikált Hard FM folyamatot akkor érdemes kialakítani, ha a műszaki " +
        "hibák, karbantartási feladatok, szakcégek és riportálás jelenleg " +
        "eseti módon vagy több, egymástól leváló szolgáltatón keresztül " +
        "működnek. A dedikált folyamat átláthatóbb hibautat, prioritási " +
        "kategóriákat, státuszkövetést és riportálási ritmust ad az ügyfélnek.",
    },
    {
      q: "Kapcsolódhat a Hard FM biztonsági vagy portaszolgálati működéshez?",
      a:
        "Igen. Sok helyszínen a porta, objektumőrzés vagy biztonságtechnikai " +
        "működés észleli először a műszaki problémát. A Hard FM folyamat akkor " +
        "működik jól, ha a jelzések, felelősök, szolgáltatók és eszkalációs " +
        "pontok össze vannak hangolva.",
    },
  ],
  // Canonical Hungarian public service slugs. Missing or unpublished
  // related services are filtered safely by the public query layer.
  // Do not replace hard-fm with hardfm in related arrays: hardfm is
  // only the legacy slug for this service. soft-fm is the canonical
  // Soft FM slug; green is only its legacy slug.
  relatedSlugs: [
    "soft-fm",
    "biztonsagtechnika",
    "tavfelugyelet-vonuloszolgalat",
    "objektumorzes",
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
    ? "--- seed-pilot-hard-fm DRY-RUN start ---"
    : "--- seed-pilot-hard-fm start ---";
  console.log(banner);
  ensureStagingDbTarget({ scriptName: "seed-pilot-hard-fm", isDryRun });
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
      "--- seed-pilot-hard-fm DRY-RUN done - no rows written. " +
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
    `--- seed-pilot-hard-fm done - row id=${existing.id} ` +
      `updated, slug=${TARGET_SLUG} published. ---`,
  );
}

main().catch((err) => {
  console.error("seed-pilot-hard-fm FAILED:", err);
  process.exit(1);
});
