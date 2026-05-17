// One-shot pilot data seeder for "Élőerős objektumőrzés" (P5 Phase 1).
//
// Usage:
//   npx tsx scripts/seed-pilot-objektumorzes.ts            # writes
//   npx tsx scripts/seed-pilot-objektumorzes.ts --dry-run  # read-only preview
//
// What it does (normal mode):
//   1. Resolves the existing canonical row by slug — first looking for
//      "objektumorzes", then falling back to the legacy "security"
//      slug. The row is renamed in-place if it still uses the legacy
//      slug.
//   2. Writes Hungarian pilot copy into every service-detail-page
//      column (SEO, value proposition, use cases, included items,
//      process steps, trust items, FAQ, related services).
//   3. Sets isPublished=true so the public detail page renders.
//
// Dry-run mode (--dry-run):
//   - Loads env identically to the live mode.
//   - Prints a credential-free DATABASE_URL identity (host + db only)
//     so the operator can confirm they are pointing at staging, not
//     production.
//   - SELECTs the same target row.
//   - Prints id / current slug / isPublished / isActive plus a
//     side-by-side diff of every field that would change.
//   - Performs no UPDATE.
//
// Idempotent: running multiple times re-applies the same canonical
// pilot content. Other services and any admin-edited copy are
// untouched.
// This script intentionally does not write nameHu: the display name
// stays the short baseline/i18n name. Long landing-page positioning
// belongs in detail fields such as seoTitleHu, valuePropositionHu,
// and longDescHu.
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

const TARGET_SLUG = "objektumorzes";
const LEGACY_SLUG = "security";

const PILOT_HU = {
  seoTitle: "Élőerős objektumőrzés vállalatoknak | Avenir",
  seoDescription:
    "Objektumőrzés beléptetéssel, járőrözéssel, incidenskezeléssel és " +
    "riportálással. Helyszínre szabott protokollok vállalati helyszínekre.",
  valueProposition:
    "Helyszínre szabott objektumőrzéssel támogatjuk a telephelyek, " +
    "irodaházak, logisztikai és ipari helyszínek biztonsági rendjét: " +
    "beléptetés, kiléptetés, járőrözés, incidenskezelés, szolgálati napló " +
    "és egyeztetett eszkaláció alapján.",
  longDesc:
    "Az élőerős objektumőrzés célja, hogy a helyszínen ne csak őri " +
    "jelenlét legyen, hanem helyszínhez igazított vagyonvédelmi rend. " +
    "Avenir a helyszíni felmérés alapján szolgálati utasítást " +
    "készít: meghatározza a belépési és kilépési pontokat, a látogatók és " +
    "beszállítók kezelését, a járőrútvonalakat, a kulcskezelési " +
    "szabályokat, az incidensek dokumentálását és az eszkalációs rendet.\n\n" +
    "A szolgáltatás igény szerint összehangolható meglévő kamerarendszerrel, " +
    "beléptető rendszerrel vagy riasztási folyamattal. A cél, hogy a " +
    "megrendelő ne csak jelenlétet kapjon, hanem egyértelmű szolgálati " +
    "keretet: naplózással, eseményjelentéssel, rendszeres egyeztetéssel " +
    "és kijelölt felelős kapcsolattartóval.\n\n" +
    "A vagyonőri jelenlét a helyszín kockázati profiljához és a " +
    "szerződéses igényhez igazodik: fegyver nélküli vagy a jogi feltételek " +
    "teljesülése esetén fegyveres vagyonőri szolgáltatás is kialakítható. " +
    "Avenir SzVMt. szerinti vagyonvédelmi tevékenységi engedélyének száma: " +
    "01030-822/4926-7/2023. A szolgálati rend ISO 9001 és " +
    "ISO 27001 tanúsított irányítási rendszerekhez illeszkedő, " +
    "szabályozott folyamatokra építhető, 24/7 diszpécseri háttérrel " +
    "támogatva.",
  useCases: [
    "Logisztikai központok, raktárak és teherkapus helyszínek",
    "Ipari és gyártási telephelyek",
    "Irodaházak és üzleti központok",
    "Kiskereskedelmi és bevásárlóközponti környezet",
    "Építési, átmeneti vagy fokozott kockázatú helyszínek",
  ],
  includedItems: [
    "Beléptetési és kiléptetési rend támogatása",
    "Látogató-, beszállító- és kulcskezelés",
    "Járőrözés, ellenőrzési pontok és területbejárás",
    "Incidensek rögzítése és eszkalációja",
    "Szolgálati napló és egyeztetett riportálás",
    "Helyszíni biztonsági felmérés és protokoll-javaslat",
    "Kapcsolódás meglévő kamerarendszerhez, beléptetőhöz vagy " +
      "riasztási folyamathoz, ha a helyszín ezt igényli",
  ],
  processSteps: [
    {
      title: "Első egyeztetés és igényfelmérés",
      body: "A megkeresésre 2 munkanapon belül visszajelzünk, majd " +
        "rögzítjük az őrzési célt, a helyszín típusát, az időszakot és " +
        "az elsődleges kockázati pontokat.",
    },
    {
      title: "Helyszíni felmérés és kockázati pontok áttekintése",
      body: "A helyszíni bejárás és az alapvető kockázati áttekintés " +
        "jellemzően 1–3 munkanapon belül megszervezhető.",
    },
    {
      title: "Belépési, kilépési, járőrözési és eszkalációs rend kialakítása",
      body: "Meghatározzuk a belépési pontokat, a látogatói és beszállítói " +
        "folyamatot, a járőrútvonalakat és az incidensek jelzési rendjét.",
    },
    {
      title: "Szolgálati utasítás és riportálási folyamat rögzítése",
      body: "Írásban rögzítjük, mit kell dokumentálni, milyen rendszerességű " +
        "riport készül, és kik kapnak értesítést eltérés vagy incidens esetén.",
    },
    {
      title: "Vagyonőri jelenlét megszervezése",
      body: "A fegyver nélküli vagy fegyveres vagyonőri jelenlétet a " +
        "szerződéses igény, a jogi feltételek és a helyszín kockázati " +
        "profilja alapján szervezzük meg.",
    },
    {
      title: "Rendszeres kapcsolattartás, riportálás és finomhangolás",
      body: "A működés közben a szolgálati tapasztalatokat, visszatérő " +
        "eseményeket és riportokat a kijelölt kapcsolattartóval egyeztetjük.",
    },
  ],
  trustItems: [
    {
      title: "24/7 diszpécseri háttér",
      body: "Az objektumőrzési működés 24/7 diszpécseri háttérrel " +
        "támogatható; az értesítési és eszkalációs rendet az együttműködés " +
        "elején rögzítjük.",
    },
    {
      title: "Szolgálati napló és eseménykezelés",
      body: "Szolgálati napló, eseményrögzítés, egyeztetett riportálás és " +
        "eszkalációs rend segíti a helyszíni kontrollt.",
    },
    {
      title: "Egy felelős kapcsolattartó",
      body: "A napi működéshez kijelölt felelős kapcsolattartót adunk, így " +
        "a megrendelő nem különálló szereplők között egyeztet.",
    },
    {
      title: "ISO 9001 és ISO 27001",
      body: "A szolgálati folyamatok ISO 9001 és ISO 27001 tanúsított " +
        "irányítási rendszerekhez illeszkedő szabályozott működésre épülnek.",
    },
    {
      title: "Helyszínhez igazított szolgálati modell",
      body: "A szolgálati rendet a helyszín kockázati profilja, nyitvatartása, " +
        "belépési pontjai és riportálási elvárásai alapján érdemes kialakítani.",
    },
    {
      title: "Vagyonvédelmi engedély",
      body: "Avenir SzVMt. szerinti vagyonvédelmi tevékenységi " +
        "engedélyének száma: 01030-822/4926-7/2023.",
    },
  ],
  faq: [
    {
      q: "Mit tartalmaz az objektumőrzés?",
      a: "Az objektumőrzés a helyszín igényei szerint magában foglalhatja " +
        "a beléptetést és kiléptetést, a látogatók és beszállítók kezelését, " +
        "a járőrözést, a kulcskezelési szabályokat, az incidensek rögzítését, " +
        "a szolgálati naplót és az egyeztetett riportálást.",
    },
    {
      q: "Mikor szükséges helyszíni biztonsági felmérés?",
      a: "Helyszíni biztonsági felmérés különösen akkor hasznos, ha új " +
        "objektumot kell őrizni, változik a beléptetési rend, nő a " +
        "teherforgalom, visszatérő incidensek vannak, vagy a meglévő őrzési " +
        "és technikai folyamatokat szeretnék átláthatóbbá tenni.",
    },
    {
      q: "Milyen szerződéses formában érdemes indítani az objektumőrzést?",
      a: "A megfelelő modell a helyszín méretétől, kockázati profiljától, " +
        "nyitvatartásától, belépési pontjaitól, járőrözési igényétől, " +
        "incidenskezelési rendjétől és riportálási elvárásaitól függ. " +
        "Ezeket az indulás előtt érdemes rögzíteni, hogy a szolgálat a " +
        "helyszín valós működéséhez igazodjon.",
    },
    {
      q: "Hogyan történik a látogatók és beszállítók beléptetése?",
      a: "A beléptetési rendet a helyszíni felmérés alapján alakítjuk ki. " +
        "Meghatározható, ki, mikor, milyen jogosultsággal léphet be, hogyan " +
        "történik a vendégregisztráció, a beszállítói beléptetés, a " +
        "teherforgalom kezelése és a kiléptetés dokumentálása.",
    },
    {
      q: "Összeköthető az őrzés kamerarendszerrel vagy beléptető rendszerrel?",
      a: "Igen, ahol erre lehetőség van, az élőerős őrzés összehangolható " +
        "meglévő kamerarendszerhez, beléptető rendszerhez, riasztási " +
        "folyamathoz vagy távfelügyeleti működéshez. Így az őri jelenlét " +
        "és a technikai vagyonvédelem egymást erősítheti.",
    },
    {
      q: "Fegyveres őrzés is kérhető?",
      a: "A helyszín kockázati profiljától, a szerződéses igénytől és a " +
        "jogi feltételek teljesülésétől függően fegyver nélküli vagy " +
        "fegyveres vagyonőri jelenlét is kialakítható.",
    },
    {
      q: "Rendelkezik az Avenir a szükséges vagyonvédelmi engedéllyel?",
      a: "Igen. Az élőerős objektumőrzés az alkalmazandó magyar személy- " +
        "és vagyonvédelmi szabályozási keret szerint történik. Az engedélyre " +
        "és a vagyonőri állomány engedélyezési dokumentációjára vonatkozó " +
        "információk a szerződéses előkészítés során egyeztethetők.",
    },
    {
      q: "Van-e 24/7 háttértámogatás?",
      a: "Igen, az objektumőrzési szolgáltatás 24/7 diszpécseri háttérrel " +
        "támogatható, az eszkalációs és értesítési rendet pedig az " +
        "együttműködés elején rögzítjük.",
    },
    {
      q: "Mi történik incidens esetén?",
      a: "Az incidenskezelést egyeztetett eszkalációs rend alapján " +
        "alakítjuk ki. Ez meghatározza, milyen eseményt kell rögzíteni, kit " +
        "kell értesíteni, milyen sorrendben történik a jelzés, és hogyan " +
        "kerül dokumentálásra az eset.",
    },
    {
      q: "Kapunk-e szolgálati naplót vagy incidensriportot?",
      a: "Igen, a szolgáltatás része lehet szolgálati napló, " +
        "eseményrögzítés és egyeztetett riportálás. A pontos " +
        "riportformátumot az együttműködés elején rögzítjük, hogy a " +
        "megrendelő naprakész információt kapjon a helyszíni működésről.",
    },
  ],
  // Related services use future canonical Hungarian public slugs. Some
  // may not exist in the baseline seed yet; the public query filters
  // missing/unpublished services so links do not break. Add future
  // service pilots one-by-one by aligning their canonical baseline slug,
  // not by reverting these values to legacy slugs.
  relatedSlugs: [
    "portaszolgalat",
    "biztonsagtechnika",
    "tavfelugyelet-vonuloszolgalat",
    "mystery-shopping-helyszini-audit",
    "rendezvenybiztositas",
  ],
};

// Build the column-level update payload once so dry-run and live mode
// describe + write the exact same set.
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

// Strip credentials from a Postgres connection string and return a
// "host/database" identity string suitable for log output. Tolerant
// of missing pieces: returns "<unknown>" if DATABASE_URL is unset and
// "<unparseable>" if parsing throws (e.g., malformed URL). Never
// surfaces username, password, query parameters, or the full URL.
function redactedDbIdentity(): string {
  const raw = process.env.DATABASE_URL;
  if (!raw) return "<unknown — DATABASE_URL is not set>";
  try {
    const u = new URL(raw);
    const host = u.host || "<no-host>";
    const dbName = u.pathname.replace(/^\//, "") || "<no-db>";
    return `${host}/${dbName}`;
  } catch {
    return "<unparseable DATABASE_URL>";
  }
}

// Format a diff line for the dry-run report. Long string/array values
// are summarised by length to keep stdout readable; the goal is for
// the operator to spot-check intent, not to dump full content.
function summarise(value: unknown): string {
  if (value === null || value === undefined) return "(null)";
  if (typeof value === "string") {
    const oneLine = value.replace(/\s+/g, " ").trim();
    if (oneLine.length <= 80) return JSON.stringify(oneLine);
    return `${JSON.stringify(oneLine.slice(0, 77))}… [${value.length} chars]`;
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
    ? "--- seed-pilot-objektumorzes DRY-RUN start ---"
    : "--- seed-pilot-objektumorzes start ---";
  console.log(banner);
  ensureStagingDbTarget({ scriptName: "seed-pilot-objektumorzes", isDryRun });
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
      `--- seed-pilot-objektumorzes DRY-RUN done — no rows written. ` +
        `Re-run without --dry-run to apply. ---`,
    );
    return;
  }

  console.log("");
  console.log(
    `Applying pilot content to row id=${existing.id}...`,
  );

  await db
    .update(services)
    .set({ ...values, updatedAt: new Date() })
    .where(eq(services.id, existing.id));

  console.log(
    `--- seed-pilot-objektumorzes done — row id=${existing.id} updated, ` +
      `slug=${TARGET_SLUG} published. ---`,
  );
}

main().catch((err) => {
  console.error("seed-pilot-objektumorzes FAILED:", err);
  process.exit(1);
});
