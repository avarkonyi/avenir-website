// One-shot pilot data seeder for "Mystery Shopping és helyszíni audit" (P5 Phase 1).
//
// Usage:
//   npx tsx scripts/seed-pilot-mystery-shopping-helyszini-audit.ts            # writes
//   npx tsx scripts/seed-pilot-mystery-shopping-helyszini-audit.ts --dry-run  # read-only preview
//
// What it does (normal mode):
//   1. Resolves exactly one existing row by slug, looking for the
//      canonical "mystery-shopping-helyszini-audit" slug or the
//      legacy "mystery" slug. The row is renamed in-place if it still
//      uses the legacy slug.
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
// "Mystery Shopping és helyszíni audit".
//
// Run after the 0011 migration has been applied; otherwise the new
// columns won't exist in the target DB and the UPDATE will fail.

import "./load-env";
import { eq, or } from "drizzle-orm";
import { db, services } from "../lib/db";

const TARGET_SLUG = "mystery-shopping-helyszini-audit";
const LEGACY_SLUG = "mystery";

const PILOT_HU = {
  seoTitle: "Mystery Shopping és helyszíni audit vállalati működéshez | Avenir",
  seoDescription:
    "Helyszíni szolgáltatásminőség-mérés, porta- és ügyfélút-ellenőrzés, " +
    "működési audit és riportálható fejlesztési javaslatok.",
  valueProposition:
    "A Mystery Shopping és helyszíni audit segít objektíven látni, hogyan " +
    "működnek a helyszíni folyamatok a gyakorlatban: hogyan zajlik a " +
    "beléptetés, a vendégkezelés, a portaszolgálat, az őrzési protokoll, " +
    "az ügyfélút vagy a beszállítói folyamat, és hol érdemes javítani a " +
    "kontrollt, a szolgáltatásminőséget vagy a dokumentáltságot.",
  longDesc:
    "A helyszíni audit célja, hogy a megrendelő ne csak belső " +
    "visszajelzésekből vagy eseti panaszokból lássa a működés minőségét, " +
    "hanem strukturált, megfigyelhető és riportálható tapasztalatok " +
    "alapján. A vizsgálat előre egyeztetett scope szerint történik: " +
    "meghatározható, mely helyszíneket, folyamatokat, időszakokat és " +
    "szolgáltatási pontokat kell értékelni.\n\n" +
    "A Mystery Shopping és helyszíni audit különösen hasznos ott, ahol a " +
    "porta, recepció, objektumőrzés, ügyfélfogadás, beszállítói beléptetés " +
    "vagy helyszíni kiszolgálási folyamat minősége közvetlenül befolyásolja " +
    "a biztonságot, az ügyfélélményt vagy a napi működés kontrollját.\n\n" +
    "Az Avenir a megfigyeléseket nem általános benyomásként kezeli, hanem " +
    "riportálható működési visszajelzésként: mi volt a folyamat, mi tért el " +
    "az elvárt működéstől, hol volt kockázat, és milyen fejlesztési javaslat " +
    "segítheti a következő lépést.",
  useCases: [
    "Porta- és recepciós működés ellenőrzése",
    "Objektumőrzési protokollok gyakorlati működésének vizsgálata",
    "Beléptetési, kiléptetési és vendégkezelési folyamatok mérése",
    "Ügyfélút, látogatói élmény és helyszíni kiszolgálás értékelése",
    "Beszállítói, futár- vagy teherforgalmi folyamatok kontrollja",
    "Több helyszínes működés összehasonlítható auditja",
  ],
  includedItems: [
    "Előre egyeztetett audit scope és értékelési szempontok",
    "Helyszíni működés megfigyelése jóváhagyott keretek között",
    "Porta-, recepciós vagy őrzési folyamatok ellenőrzése",
    "Beléptetés, vendégkezelés és ügyfélút értékelése",
    "Eltérések, kockázatok és fejlesztési pontok rögzítése",
    "Strukturált riport és vezetői összefoglaló",
    "Fejlesztési javaslatok a működés javítására",
  ],
  processSteps: [
    {
      title: "Audit cél és scope egyeztetése",
      body:
        "Rögzítjük, milyen működési kérdésre kell választ adnia az auditnak, " +
        "mely folyamatok tartoznak bele, és milyen keretek között történhet " +
        "a helyszíni vizsgálat.",
    },
    {
      title: "Helyszínek, folyamatok és értékelési szempontok meghatározása",
      body:
        "Meghatározzuk az érintett helyszíneket, időszakokat, szolgáltatási " +
        "pontokat és azokat a szempontokat, amelyek alapján összehasonlítható " +
        "visszajelzés készül.",
    },
    {
      title: "Helyszíni vizsgálat vagy Mystery Shopping lefolytatása",
      body:
        "A vizsgálat a jóváhagyott scope szerint, jogszerű és célhoz kötött " +
        "keretek között történik, a tényleges helyszíni működés megfigyelhető " +
        "elemeire fókuszálva.",
    },
    {
      title: "Megfigyelések, eltérések és működési kockázatok rögzítése",
      body:
        "A tapasztalatokat nem általános véleményként, hanem strukturált " +
        "működési megfigyelésként rögzítjük: mi történt, hol volt eltérés, " +
        "és milyen kockázat vagy javítási pont merült fel.",
    },
    {
      title: "Riport és fejlesztési javaslatok elkészítése",
      body:
        "A megállapításokat vezetői szinten áttekinthető riportba rendezzük, " +
        "amely tartalmazhat kockázati pontokat, eltéréseket és javasolt " +
        "következő lépéseket.",
    },
    {
      title: "Eredmények egyeztetése és következő lépések meghatározása",
      body:
        "Az audit eredményeit közös egyeztetésen áttekintjük, hogy a " +
        "megrendelő dönteni tudjon a képzésről, protokollmódosításról vagy " +
        "további működési kontrollról.",
    },
  ],
  trustItems: [
    {
      title: "Előre jóváhagyott audit scope",
      body:
        "A vizsgálat célját, módszertanát és kereteit előre rögzíteni kell, " +
        "hogy az audit jogszerű, arányos és célhoz kötött maradjon.",
    },
    {
      title: "Strukturált értékelési szempontok",
      body:
        "Az audit összehasonlítható szempontok alapján méri a porta, recepció, " +
        "beléptetés, őrzés vagy ügyfélút gyakorlati működését.",
    },
    {
      title: "Riportálható működési megfigyelések",
      body:
        "A visszajelzés nem általános benyomás, hanem dokumentálható " +
        "működési tapasztalat, amely vezetői döntéshez is felhasználható.",
    },
    {
      title: "Vezetői összefoglaló és fejlesztési javaslatok",
      body:
        "Az eredmények rövid vezetői összefoglalóban és részletesebb " +
        "működési riportban is összegezhetők.",
    },
    {
      title: "Kapcsolódás portaszolgálathoz és objektumőrzéshez",
      body:
        "A vizsgálat különösen hasznos ott, ahol a porta, recepció, " +
        "beléptetés vagy őrzési protokoll minősége napi működési kockázatot " +
        "vagy ügyféloldali élményt befolyásol.",
    },
    {
      title: "Helyszíni biztonsági audit szemlélet",
      body:
        "Az audit a szolgáltatásminőség mellett a helyszíni kontrollpontokat, " +
        "szabálykövetést és működési kockázatokat is vizsgálhatja.",
    },
    {
      title: "Jogszerű és célhoz kötött vizsgálati keretek",
      body:
        "A vizsgálat nem jelent korlátlan vagy jogellenes megfigyelést: a " +
        "módszert, célt és terjedelmet az együttműködés elején kell rögzíteni.",
    },
  ],
  faq: [
    {
      q: "Mit jelent a Mystery Shopping és helyszíni audit?",
      a:
        "A Mystery Shopping és helyszíni audit előre egyeztetett szempontok " +
        "alapján vizsgálja, hogyan működnek a helyszíni folyamatok a " +
        "gyakorlatban. Ide tartozhat a porta, recepció, beléptetés, " +
        "vendégkezelés, ügyfélút, őrzési protokoll vagy beszállítói folyamat " +
        "értékelése.",
    },
    {
      q: "Miben más ez, mint egy belső ellenőrzés?",
      a:
        "A belső ellenőrzés gyakran a meglévő dokumentumokra és belső " +
        "visszajelzésekre épül. A helyszíni audit ezzel szemben a tényleges " +
        "működés megfigyelhető elemeit vizsgálja, majd strukturált riportban " +
        "mutatja meg az eltéréseket, kockázatokat és fejlesztési lehetőségeket.",
    },
    {
      q: "Milyen folyamatokat lehet vizsgálni?",
      a:
        "Vizsgálható például a beléptetés, kiléptetés, vendégfogadás, " +
        "portaszolgálat, objektumőrzési protokoll, ügyfélút, beszállítói " +
        "folyamat, teherforgalom vagy helyszíni kiszolgálás. A pontos scope-ot " +
        "az együttműködés elején kell rögzíteni.",
    },
    {
      q: "Készül riport az eredményekről?",
      a:
        "Igen, az audit eredménye strukturált riportban összesíthető. A riport " +
        "tartalmazhat megfigyeléseket, eltéréseket, kockázati pontokat és " +
        "fejlesztési javaslatokat, valamint vezetői összefoglalót is.",
    },
    {
      q: "Ez jogi vagy compliance audit?",
      a:
        "A szolgáltatás alapvetően működési és szolgáltatásminőségi audit. " +
        "Jogi vagy compliance auditként csak akkor kezelhető, ha annak scope-ja, " +
        "módszertana és szakmai kerete külön rögzítve van.",
    },
    {
      q: "Használható több helyszín összehasonlítására?",
      a:
        "Igen, több helyszín is vizsgálható azonos értékelési szempontok " +
        "alapján. Ez segíthet abban, hogy a megrendelő lássa, hol működnek " +
        "jól a folyamatok, és hol érdemes további képzést, protokollmódosítást " +
        "vagy kontrollt bevezetni.",
    },
    {
      q: "Hogyan biztosítható, hogy az audit jogszerű legyen?",
      a:
        "Az audit scope-ját, célját és módszerét előre rögzíteni kell. A " +
        "vizsgálatnak jogszerű, célhoz kötött és arányos keretek között kell " +
        "történnie, különösen akkor, ha munkavállalói, látogatói vagy " +
        "ügyféloldali folyamatokat érint.",
    },
  ],
  // Related services use canonical Hungarian public slugs. Missing or
  // unpublished services are filtered safely by the public service query.
  // Do not replace mystery-shopping-helyszini-audit with "mystery" in
  // related arrays: "mystery" is only the legacy slug for this service.
  relatedSlugs: [
    "portaszolgalat",
    "objektumorzes",
    "biztonsagtechnika",
    "tavfelugyelet-vonuloszolgalat",
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
    ? "--- seed-pilot-mystery-shopping-helyszini-audit DRY-RUN start ---"
    : "--- seed-pilot-mystery-shopping-helyszini-audit start ---";
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
      "--- seed-pilot-mystery-shopping-helyszini-audit DRY-RUN done - no rows written. " +
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
    `--- seed-pilot-mystery-shopping-helyszini-audit done - row id=${existing.id} updated, ` +
      `slug=${TARGET_SLUG} published. ---`,
  );
}

main().catch((err) => {
  console.error("seed-pilot-mystery-shopping-helyszini-audit FAILED:", err);
  process.exit(1);
});
