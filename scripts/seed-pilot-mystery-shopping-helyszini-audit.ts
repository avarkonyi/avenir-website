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
//
// Safety: pilot seeds are staging-only. The runtime DB target guard
// verifies DATABASE_URL before any SELECT/UPDATE, including direct
// `npx tsx scripts/seed-pilot-*.ts` execution, and never prints the
// full connection string.

import "./load-env";
import { ensureStagingDbTarget } from "./ensure-staging-db";
import { eq, or } from "drizzle-orm";
import { db, services } from "../lib/db";

const TARGET_SLUG = "mystery-shopping-helyszini-audit";
const LEGACY_SLUG = "mystery";

const PILOT_HU = {
  seoTitle: "Próbavásárlás és szolgáltatásaudit | Avenir",
  seoDescription:
    "Mystery Shopping, brand audit, próbautazás és szolgáltatásaudit " +
    "ügyfélélmény, folyamatkövetés és megfelelési szempontok vizsgálatára.",
  valueProposition:
    "A próbavásárlás és szolgáltatásaudit valós ügyfélhelyzetben mutatja meg, " +
    "hogyan működik egy szolgáltatás a gyakorlatban: mit tapasztal az ügyfél, " +
    "követik-e a munkatársak az elvárt folyamatot, teljesülnek-e a brand-, " +
    "tájékoztatási és működési szabályok, és hol jelenik meg minőségi, " +
    "reputációs vagy megfelelési kockázat.",
  longDesc:
    "A Mystery Shopping nem egyszerű ellenőrzés, hanem előre megtervezett, " +
    "dokumentált szolgáltatásminőség-mérés. A vizsgálat során a próbavásárló " +
    "vagy auditor valós ügyfélhelyzetben járja végig az adott szolgáltatási " +
    "folyamatot: vásárlást, ügyintézést, helyszíni látogatást, próbautazást " +
    "vagy más ügyfélkapcsolati pontot.\n\n" +
    "A vizsgálat scope-ja előre egyeztetett: meghatározható, milyen " +
    "szolgáltatási pontokat, folyamatlépéseket, brand standardokat, " +
    "kommunikációs elvárásokat, tájékoztatási kötelezettségeket vagy " +
    "megfelelési szempontokat kell vizsgálni. A cél nem az öncélú " +
    "hibakeresés, hanem az, hogy a vezetés pontos, riportálható " +
    "képet kapjon a tényleges működésről.\n\n" +
    "A szolgáltatás több formában is alkalmazható. A Brand Audit az arculati, " +
    "vizuális, tisztasági, hangulati és szolgáltatási standardokat vizsgálja. " +
    "A Situation Shopping konkrét ügyfélhelyzeteket, kérdéseket, konfliktusokat " +
    "vagy folyamatlépéseket tesztel. A szolgáltatásaudit vagy próbautazás pedig " +
    "egy teljes ügyfélutat vizsgálhat, például személyszállítási, " +
    "ügyfélszolgálati vagy helyszíni kiszolgálási folyamatban.\n\n" +
    "Az audit eredménye strukturált riport: mi történt az ügyfélút során, mi " +
    "felelt meg az elvárt működésnek, hol volt eltérés, milyen kockázat jelent " +
    "meg, és milyen fejlesztési javaslat segítheti a szolgáltatásminőség, a " +
    "kontroll vagy a megfelelés javítását.",
  useCases: [
    "Próbavásárlás üzletekben, szolgáltatási pontokon vagy ügyfélszolgálati helyzetekben",
    "Próbautazás taxi, személyszállítási vagy közlekedési szolgáltatás esetén",
    "Brand Audit: arculat, tisztaság, vizuális megjelenés és szolgáltatási standardok ellenőrzése",
    "Situation Shopping: konkrét ügyfélhelyzetek, kérdések vagy konfliktushelyzetek tesztelése",
    "Ügyfélút és látogatói élmény vizsgálata",
    "Tájékoztatási, árkommunikációs, számlázási, nyugtaadási vagy más megfelelési szempontok vizsgálata előre egyeztetett scope alapján",
    "Több helyszín, szolgáltató vagy egység összehasonlítható auditja",
  ],
  includedItems: [
    "Audit cél, scope és értékelési szempontok egyeztetése",
    "Próbavásárlási, próbautazási vagy ügyfélút-forgatókönyv kialakítása",
    "Brand Audit vagy Situation Shopping módszertan kiválasztása",
    "Valós ügyfélhelyzetben történő szolgáltatásminőség-mérés",
    "Ügyfélút, kommunikáció, folyamatkövetés és kiszolgálás értékelése",
    "Előre egyeztetett megfelelési szempontok vizsgálata",
    "Eltérések, kockázatok és fejlesztési pontok dokumentálása",
    "Strukturált riport és vezetői összefoglaló",
  ],
  processSteps: [
    {
      title: "Audit cél és scope egyeztetése",
      body:
        "Rögzítjük, milyen üzleti, szolgáltatásminőségi vagy megfelelési " +
        "kérdésre kell választ adnia az auditnak, és pontosan milyen folyamatok " +
        "tartoznak a vizsgálatba.",
    },
    {
      title: "Értékelési szempontok és forgatókönyv kialakítása",
      body:
        "Meghatározzuk a mérési pontokat, a brand standardokat, a " +
        "kommunikációs és tájékoztatási elvárásokat, valamint a próbavásárlási, " +
        "próbautazási vagy ügyfélút-forgatókönyvet.",
    },
    {
      title: "Brand Audit, Situation Shopping, próbavásárlás vagy próbautazás elvégzése",
      body:
        "Az audit a jóváhagyott scope szerint, valós ügyfélhelyzetben történik, " +
        "a szolgáltatási folyamat, az ügyfélélmény és az előre rögzített " +
        "megfelelési pontok mérésére fókuszálva.",
    },
    {
      title: "Tapasztalatok, eltérések és megfelelési pontok dokumentálása",
      body:
        "A tapasztalatokat strukturált módon rögzítjük: mi történt az ügyfélút " +
        "során, mi felelt meg az elvárt működésnek, hol volt eltérés, és milyen " +
        "kockázat vagy javítási pont jelent meg.",
    },
    {
      title: "Riport, vezetői összefoglaló és fejlesztési javaslatok elkészítése",
      body:
        "Az eredményeket vezetői szinten is áttekinthető riportba rendezzük, " +
        "amely tartalmazhat megfelelési megállapításokat, visszatérő mintákat " +
        "és konkrét fejlesztési javaslatokat.",
    },
    {
      title: "Eredmények egyeztetése és következő lépések meghatározása",
      body:
        "Az audit eredményeit közösen áttekintjük, hogy a megrendelő dönteni " +
        "tudjon protokollmódosításról, képzésről, brand standard pontosításról " +
        "vagy további mérésről.",
    },
  ],
  trustItems: [
    {
      title: "Előre egyeztetett audit scope",
      body:
        "A vizsgálat célját, módszerét, érintett folyamatait és értékelési " +
        "szempontjait előre rögzíteni kell.",
    },
    {
      title: "Strukturált értékelési szempontok",
      body:
        "Az audit összehasonlítható szempontok alapján méri az ügyfélutat, a " +
        "kommunikációt, a brand standardokat és a folyamatkövetést.",
    },
    {
      title: "Brand Audit és Situation Shopping módszertan",
      body:
        "A vizsgálat kialakítható arculati, szolgáltatási, interakciós vagy " +
        "konkrét ügyfélhelyzetre épülő forgatókönyv szerint.",
    },
    {
      title: "Dokumentált ügyfélút vagy szolgáltatási folyamat",
      body:
        "A riport az ügyfélhelyzetben megtapasztalt folyamatot, eltéréseket, " +
        "megfelelési pontokat és fejlesztési lehetőségeket rögzíti.",
    },
    {
      title: "Szolgáltatásminőség és megfelelési pontok együttes vizsgálata",
      body:
        "Az audit egyszerre vizsgálhat ügyfélélményt, tájékoztatást, " +
        "folyamatkövetést, számlázási vagy más előre egyeztetett megfelelési " +
        "szempontokat.",
    },
    {
      title: "Több helyszín vagy szolgáltató összehasonlítható riportja",
      body:
        "Egységes mérési szempontrendszerrel több egység, szolgáltató vagy " +
        "időszak eredménye is összehasonlíthatóvá válik.",
    },
    {
      title: "Vezetői összefoglaló és fejlesztési javaslatok",
      body:
        "Az eredmények nem önmagukért készülnek: a riport döntéstámogató " +
        "javaslatokat adhat a szolgáltatásminőség, kontroll vagy megfelelés " +
        "javításához.",
    },
    {
      title: "Jogszerű, célhoz kötött és arányos vizsgálati keretek",
      body:
        "A vizsgálat nem korlátlan ellenőrzés: a cél, módszer, scope és " +
        "értékelési keret az együttműködés elején kerül rögzítésre.",
    },
  ],
  faq: [
    {
      q: "Mit jelent a próbavásárlás vagy Mystery Shopping?",
      a:
        "A próbavásárlás olyan előre megtervezett szolgáltatásminőség-mérés, " +
        "amelyben a próbavásárló vagy auditor valós ügyfélhelyzetben járja " +
        "végig az adott folyamatot. Ez lehet vásárlás, ügyintézés, helyszíni " +
        "látogatás, próbautazás vagy más ügyfélkapcsolati pont.",
    },
    {
      q: "Mi az a Brand Audit?",
      a:
        "A Brand Audit az arculati, vizuális, tisztasági, hangulati és " +
        "szolgáltatási standardokat vizsgálja. Segít megmutatni, hogy a " +
        "helyszín vagy szolgáltatási pont mennyire felel meg a márka elvárt " +
        "működésének és ügyfélélményének.",
    },
    {
      q: "Mi az a Situation Shopping?",
      a:
        "A Situation Shopping interakciós próbavásárlás, ahol előre egyeztetett " +
        "ügyfélhelyzeteket, kérdéseket, konfliktusokat vagy folyamatlépéseket " +
        "tesztelünk. Így nem csak a környezet, hanem a kommunikáció, reakció " +
        "és folyamatkövetés is mérhető.",
    },
    {
      q: "Alkalmazható közlekedési vagy taxi jellegű szolgáltatásnál?",
      a:
        "Igen. Próbautazás keretében vizsgálható például az utazás teljes " +
        "ügyfélútja, a tájékoztatás, a kiszolgálás, a számlázási vagy " +
        "nyugtaadási folyamat, a viselkedési protokoll és az előre " +
        "meghatározott szolgáltatási vagy megfelelési szempontok teljesülése.",
    },
    {
      q: "Milyen megfelelési szempontok vizsgálhatók?",
      a:
        "Az audit előre egyeztetett scope alapján vizsgálhat tájékoztatási, " +
        "árkommunikációs, számlázási, nyugtaadási, ügyfélkezelési, brand " +
        "standardhoz vagy szerződéses szolgáltatási szinthez kapcsolódó " +
        "szempontokat. Jogi vagy compliance auditként csak külön rögzített " +
        "szakmai keretben kezelhető.",
    },
    {
      q: "Készül riport az eredményekről?",
      a:
        "Igen, az audit eredménye strukturált riportban foglalható össze. A " +
        "riport tartalmazhatja a tapasztalt folyamatot, az eltéréseket, a " +
        "kockázati pontokat, a megfelelési megállapításokat és a fejlesztési " +
        "javaslatokat.",
    },
    {
      q: "Használható több helyszín vagy szolgáltató összehasonlítására?",
      a:
        "Igen, egységes értékelési szempontok alapján több helyszín, " +
        "szolgáltató, egység vagy időszak is összehasonlítható. Ez segít az " +
        "eltérések, visszatérő minták és fejlesztési prioritások azonosításában.",
    },
    {
      q: "Hogyan biztosítható a jogszerűség?",
      a:
        "A vizsgálat célját, módszerét, scope-ját és értékelési szempontjait " +
        "előre rögzíteni kell. Az auditnak jogszerű, célhoz kötött és arányos " +
        "keretek között kell történnie, különösen akkor, ha munkavállalói, " +
        "ügyféloldali vagy szolgáltatói folyamatokat érint.",
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
    "rendezvenybiztositas",
    "hard-fm",
    "soft-fm",
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
  ensureStagingDbTarget({
    scriptName: "seed-pilot-mystery-shopping-helyszini-audit",
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
