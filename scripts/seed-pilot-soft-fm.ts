// One-shot pilot data seeder for "Soft FM" (P5 Phase 1).
//
// Usage:
//   npx tsx scripts/seed-pilot-soft-fm.ts            # writes
//   npx tsx scripts/seed-pilot-soft-fm.ts --dry-run  # read-only preview
//
// What it does (normal mode):
//   1. Resolves exactly one existing row by slug, looking for the
//      canonical "soft-fm" slug or the legacy "green" slug. The row
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
// display name stays the short baseline/i18n name "Soft FM".
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

const TARGET_SLUG = "soft-fm";
const LEGACY_SLUG = "green";

const PILOT_HU = {
  seoTitle: "Soft FM szolgáltatások vállalati helyszínekre | Avenir",
  seoDescription:
    "Soft FM szolgáltatások takarítási koordinációval, zöldterület-gondozással, " +
    "higiéniai folyamatokkal, operatív támogatással és riportálással.",
  valueProposition:
    "A Soft FM célja, hogy a helyszínek napi működést támogató szolgáltatásai " +
    "ne különálló feladatokként, hanem átlátható, riportálható folyamatként " +
    "működjenek: takarítási egyeztetéssel, zöldterület-gondozással, higiéniai " +
    "és operatív támogatással, szolgáltatói koordinációval és minőségellenőrzéssel.",
  longDesc:
    "Az Avenir Soft FM szolgáltatása a helyszín napi, nem műszaki működését " +
    "támogató feladatokat fogja össze: takarítás, kertészeti és higiéniai " +
    "folyamatok, hulladékkezelési támogatás, szolgáltatói koordináció és " +
    "helyszíni működési támogatás. A szerződés indulásakor az Avenir az " +
    "ügyféllel együtt rögzíti a szolgáltatási modellt: saját munkatársak, " +
    "jóváhagyott alvállalkozók vagy meglévő ügyféloldali szolgáltatók " +
    "Avenir-koordináció alatt, az egyeztetett helyszíni modell szerint.\n\n" +
    "A Soft FM együttműködés írásos scope-pal indul: területek, " +
    "feladatgyakoriságok, minőségi elvárások, riportálási ritmus és " +
    "eszkalációs útvonalak. A cél nem nyitott, „ahogy szükséges” jellegű " +
    "működés, hanem előre rögzített, ellenőrizhető és riportálható " +
    "szolgáltatási keret.\n\n" +
    "Ha az ügyfél meglévő takarítási, kertészeti, higiéniai vagy egyéb " +
    "szolgáltatókkal dolgozik, az Avenir átveheti a koordinációs réteget: " +
    "a napi helyszíni egyeztetést, a minőségellenőrzést és a riportálást, " +
    "hogy az ügyfél ne több széttagolt szerződésből, hanem egy összefogott " +
    "működési képből dolgozzon.",
  useCases: [
    "Irodaházak és üzleti központok, ahol a bérlők látható nappali szolgáltatási színvonalat várnak el",
    "Ipari vagy logisztikai helyszínek, ahol a takarításnak, higiéniai folyamatoknak és hulladékkezelési támogatásnak a műszakrendhez kell igazodnia",
    "Több helyszínes portfóliók, ahol egységes scope-ra, gyakoriságokra és riportálásra van szükség",
    "Helyszínek, ahol több külön szolgáltató koordinációja ma az ügyfél feladata",
    "Működések, ahol a Soft FM, Hard FM, portaszolgálat és őrzés egy operatív felületen kapcsolódhat össze",
    "Helyzetek, ahol a beszerzési, ESG- vagy auditcsapat írásos riportot vár az egyeztetett KPI-k és minőségi szempontok alapján",
  ],
  includedItems: [
    "Napi takarítási működés az egyeztetett területeken és feladatgyakoriságok szerint",
    "Időszakos takarítási feladatok, például padló-, üveg- vagy szőnyegtisztítás, ha a scope tartalmazza",
    "Kertészeti és külső területgondozási koordináció, ha a helyszíni modell része",
    "Higiéniai fogyóanyagok és mosdóhigiéniai szolgáltatások koordinációja",
    "Hulladékkezelési támogatás és szolgáltatói kapcsolattartás az egyeztetett működési modell szerint",
    "Szolgáltatók és alvállalkozók koordinációja meglévő ügyféloldali beszállítók esetén",
    "Helyszíni eltérések, visszatérő problémák és korrekciós intézkedések követése",
    "Írásos riport az elvégzett feladatokról, minőségi megfigyelésekről, visszatérő problémákról és teendőkről",
  ],
  processSteps: [
    {
      title: "Helyszíni bejárás és scope-felmérés",
      body:
        "Az Avenir a scope véglegesítése előtt áttekinti az érintett területeket, " +
        "szolgáltatási pontokat, működési időablakokat és a meglévő szolgáltatói modellt.",
    },
    {
      title: "Írásos scope, gyakoriságok és minőségi szempontok",
      body:
        "A szolgáltatási területeket, feladatgyakoriságokat, ellenőrzési pontokat, " +
        "minőségi elvárásokat és riportálási ritmust az operatív indulás előtt rögzítjük.",
    },
    {
      title: "Szolgáltatási modell és csapatstruktúra rögzítése",
      body:
        "A scope egyeztetésekor az Avenir az ügyféllel együtt rögzíti a teljesítési " +
        "modellt: saját munkatársak, jóváhagyott alvállalkozók vagy meglévő " +
        "ügyféloldali szolgáltatók Avenir-koordináció alatt, a helyszíni modell szerint.",
    },
    {
      title: "Mobilizáció és működési beállítás",
      body:
        "Az indulás előtt az Avenir előkészíti a működési keretet: felelősségek, " +
        "kapcsolattartási pontok, eszkalációs útvonalak, helyszíni utasítások " +
        "és a napi kontrollhoz szükséges nyilvántartások.",
    },
    {
      title: "Indítás és stabilizációs időszak",
      body:
        "Az első működési időszakban az Avenir követi a kezdeti eltéréseket, " +
        "pontosítja a felelősségeket és stabilizálja a működési ritmust az " +
        "egyeztetett scope-on belül.",
    },
    {
      title: "Rendszeres riportálás és ügyféloldali áttekintés",
      body:
        "Az Avenir riportálja az elvégzett feladatokat, minőségi megfigyeléseket, " +
        "visszatérő problémákat és egyeztetett intézkedéseket, majd rendszeresen " +
        "áttekinti a szolgáltatást az ügyféllel.",
    },
  ],
  trustItems: [
    {
      title: "Írásos scope, nem nyitott „ahogy szükséges” működés",
      body:
        "Az Avenir a területeket, gyakoriságokat, minőségi szempontokat és " +
        "riportálási ritmust a szerződés indulásakor rögzíti, így a megbízás " +
        "kerete az operatív működés előtt egyértelmű.",
    },
    {
      title: "Minőségellenőrzés meghatározott szempontok alapján",
      body:
        "Az Avenir a takarítási, higiéniai, kertészeti és operatív támogatási " +
        "feladatokat egyeztetett ellenőrzési pontok alapján követi, nem általános " +
        "elvárások szerint.",
    },
    {
      title: "Egy operatív felület több szolgáltató között",
      body:
        "Az ügyfél egy összehangolt működési képet kap az Avenir munkatársai, " +
        "jóváhagyott alvállalkozók és meglévő ügyféloldali szolgáltatók között, " +
        "a helyszíni modell szerint.",
    },
    {
      title: "Szolgáltatói és alvállalkozói koordináció",
      body:
        "Az Avenir dokumentálja a felelősségeket, kapcsolattartási pontokat és " +
        "eszkalációs útvonalakat, hogy a napi szolgáltatókezelés kontrollált legyen, " +
        "ne széttagolt.",
    },
    {
      title: "Korrekciós intézkedések követése",
      body:
        "Az Avenir követi a helyszíni eltéréseket, visszatérő problémákat és " +
        "korrekciós intézkedéseket, hogy azok áttekinthetők és utánkövethetők legyenek.",
    },
    {
      title: "Írásos riportálás",
      body:
        "Az Avenir az egyeztetett riportálási ritmus szerint beszámol az elvégzett " +
        "scope-ról, minőségi megfigyelésekről, visszatérő problémákról és egyeztetett " +
        "intézkedésekről.",
    },
    {
      title: "Kapcsolódás Hard FM-hez, portaszolgálathoz és őrzéshez",
      body:
        "Ha ezek a szolgáltatások ugyanazon a helyszínen működnek, az Avenir " +
        "összehangolja a Soft FM riportálását és eltéréskezelését a portaszolgálati, " +
        "őrzési és Hard FM folyamatokkal.",
    },
    {
      title: "Helyszínspecifikus működési modell",
      body:
        "A létszám, szolgáltatói bevonás, gyakoriságok és riportálás a helyszíni " +
        "modellhez és az egyeztetett szerződéses scope-hoz igazodik.",
    },
  ],
  faq: [
    {
      q: "Mit jelent a Soft FM?",
      a:
        "A Soft FM a helyszínek napi működését támogató, nem műszaki facility " +
        "szolgáltatások összehangolt kezelését jelenti. Az Avenirnél ez takarítást, " +
        "kertészeti folyamatokat, higiéniai és hulladékkezelési támogatást, " +
        "operatív koordinációt és szolgáltatókezelést fed le az egyeztetett " +
        "scope-on belül.",
    },
    {
      q: "Miben különbözik a Soft FM a Hard FM-től?",
      a:
        "A Hard FM elsősorban műszaki, karbantartási és épületüzemeltetési " +
        "folyamatokra fókuszál. A Soft FM a napi támogató szolgáltatásokat fogja " +
        "össze: takarítás, kertészet, higiéniai folyamatok és helyszíni operatív " +
        "koordináció. Sok helyszínen a két terület akkor működik jól, ha a " +
        "riportálási és eszkalációs útvonalak összehangoltak.",
    },
    {
      q: "Csak takarításról szól a Soft FM?",
      a:
        "Nem. A takarítás gyakran a Soft FM egyik központi eleme, de a szolgáltatás " +
        "ennél szélesebb. Az Avenir a takarításhoz, szolgáltatókezeléshez, " +
        "kertészeti folyamatokhoz, higiéniai működéshez, minőségellenőrzéshez, " +
        "riportáláshoz és helyszíni támogatáshoz kapcsolódó működési réteget kezeli.",
    },
    {
      q: "Koordinálhat az Avenir több szolgáltatót vagy alvállalkozót?",
      a:
        "Igen. Az egyeztetett Soft FM modellben az Avenir a szerződés indulásától " +
        "koordinálja a szolgáltatói felelősségeket, kapcsolattartási pontokat, " +
        "eszkalációs útvonalakat és riportálási elvárásokat.",
    },
    {
      q: "Van garantált takarítási minőség?",
      a:
        "Az általános takarítási minőségre vonatkozó garancia nem helyettesítheti " +
        "a meghatározott scope-ot. Az Avenir a minőséget egyeztetett feladatokkal, " +
        "meghatározott szempontokkal, szolgáltatási ellenőrzésekkel, riportálással " +
        "és korrekciós intézkedésekkel kezeli, így az elvárások konkrétak és áttekinthetők.",
    },
    {
      q: "Hogyan ellenőrizhető a Soft FM szolgáltatások minősége?",
      a:
        "Az Avenir a minőséget egyeztetett ellenőrzési pontokon, szolgáltatási " +
        "ellenőrzéseken, visszatérő problémák követésén, visszajelzési körökön " +
        "és rendszeres írásos riportáláson keresztül követi, helyszínspecifikus " +
        "elvárások alapján.",
    },
    {
      q: "Kapunk írásos riportot a Soft FM feladatokról?",
      a:
        "Igen. A strukturált Soft FM együttműködések része a rendszeres írásos " +
        "riportálás, amely lefedi az elvégzett scope-ot, minőségi megfigyeléseket, " +
        "visszatérő problémákat és egyeztetett intézkedéseket.",
    },
    {
      q: "Kapcsolódhat a Soft FM portaszolgálati vagy biztonsági működéshez?",
      a:
        "Igen. Sok helyszínen a porta, recepció, objektumőrzés vagy Hard FM csapat " +
        "jelzi először az operatív problémákat. A Soft FM akkor működik jobban, " +
        "ha a jelzések, felelősségek, szolgáltatók és riportálási folyamatok egy " +
        "működési modellben kapcsolódnak össze.",
    },
  ],
  // Canonical Hungarian public service slugs. Missing or unpublished
  // related services are filtered safely by the public query layer.
  // Do not replace soft-fm with green in related arrays: green is only
  // the legacy slug for this service. hard-fm is the canonical Hard FM
  // service and should remain distinct from Soft FM.
  relatedSlugs: [
    "hard-fm",
    "portaszolgalat",
    "mystery-shopping-helyszini-audit",
    "objektumorzes",
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
    ? "--- seed-pilot-soft-fm DRY-RUN start ---"
    : "--- seed-pilot-soft-fm start ---";
  console.log(banner);
  ensureStagingDbTarget({ scriptName: "seed-pilot-soft-fm", isDryRun });
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
      "--- seed-pilot-soft-fm DRY-RUN done - no rows written. " +
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
    `--- seed-pilot-soft-fm done - row id=${existing.id} ` +
      `updated, slug=${TARGET_SLUG} published. ---`,
  );
}

main().catch((err) => {
  console.error("seed-pilot-soft-fm FAILED:", err);
  process.exit(1);
});
