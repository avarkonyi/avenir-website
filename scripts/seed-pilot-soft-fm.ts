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
    "A Soft FM célja, hogy a vállalati, ipari, logisztikai és irodai helyszínek " +
    "napi működést támogató szolgáltatásai ne különálló feladatokként, hanem " +
    "koordinált, ellenőrizhető és riportálható folyamatként működjenek: " +
    "takarítási egyeztetéssel, zöldterület-gondozással, higiéniai és operatív " +
    "támogatással, szolgáltatói koordinációval és minőségellenőrzéssel.",
  longDesc:
    "A Soft FM a helyszínek napi működését támogató, nem műszaki facility " +
    "szolgáltatások koordinált kezelését jelenti. Ide tartozhat a takarítási " +
    "működés, a zöldterület-gondozás, a higiéniai és hulladékkezelési folyamatok " +
    "támogatása, a helyszíni operatív feladatok egyeztetése, valamint a " +
    "szolgáltatók és alvállalkozók koordinációja.\n\n" +
    "Az Avenir a Soft FM feladatokat nem elszigetelt napi teendőként kezeli, " +
    "hanem működési rendszerként. A helyszíni igények alapján meghatározható, " +
    "milyen gyakorisággal, milyen területeken, milyen minőségi elvárások szerint " +
    "és milyen riportálással történjenek a támogató szolgáltatások.\n\n" +
    "A cél az, hogy a megrendelő átláthatóbb, visszakövethetőbb és kiszámíthatóbb " +
    "operatív működést kapjon: kevesebb ad hoc egyeztetéssel, egyértelmű " +
    "felelősségi pontokkal, egyeztetett minőségellenőrzéssel és olyan " +
    "riportálással, amely segíti a helyszíni működés folyamatos javítását.",
  useCases: [
    "Irodaházak és üzleti központok napi működést támogató Soft FM folyamatai",
    "Ipari és logisztikai telephelyek takarítási és operatív támogatása",
    "Raktárak, szolgáltatási pontok és több helyszínes működések Soft FM koordinációja",
    "Takarítási, higiéniai vagy zöldterület-gondozási folyamatok egyeztetése",
    "Olyan helyszínek, ahol fontos a minőségellenőrzés, riportálás és szolgáltatói koordináció",
    "Soft FM és Hard FM, portaszolgálati vagy biztonsági működés összehangolása",
  ],
  includedItems: [
    "Takarítási és operatív támogatási folyamatok koordinációja",
    "Zöldterület-gondozási feladatok egyeztetése, ha a helyszín ezt igényli",
    "Higiéniai és hulladékkezelési folyamatok támogatása, szerződéses scope szerint",
    "Szolgáltatói és alvállalkozói koordináció",
    "Minőségellenőrzési és visszajelzési folyamat kialakítása",
    "Helyszíni eltérések, igények és visszatérő problémák rögzítése",
    "Egyeztetett riportálás a megrendelő felé",
    "Kapcsolódás Hard FM, portaszolgálati és helyszíni működéshez",
  ],
  processSteps: [
    {
      title: "Helyszíni Soft FM igények és működési területek áttekintése",
      body:
        "Áttekintjük, mely napi működést támogató szolgáltatások érintettek, " +
        "milyen területeken jelentkezik igény, és hol szükséges koordináció vagy " +
        "minőségellenőrzés.",
    },
    {
      title: "Takarítási, higiéniai, zöldterület- és operatív folyamatok egyeztetése",
      body:
        "Rögzíthető a feladatok köre, gyakorisága, helyszíni prioritása és az, " +
        "hogy mely elemek tartoznak a szerződéses Soft FM scope-ba.",
    },
    {
      title: "Szolgáltatói / alvállalkozói koordinációs rend kialakítása",
      body:
        "Meghatározható, hogyan történjen a szolgáltatók, alvállalkozók vagy " +
        "meglévő partnerek összehangolása, és ki felel az operatív egyeztetésért.",
    },
    {
      title: "Minőségellenőrzési és visszajelzési pontok rögzítése",
      body:
        "Az ellenőrzési szempontok, visszajelzési útvonalak és eltéréskezelési " +
        "pontok előre rögzíthetők, hogy a minőség ne általános ígéretre épüljön.",
    },
    {
      title: "Riportálási és kapcsolattartási rend egyeztetése",
      body:
        "A megrendelővel egyeztethető, milyen gyakran és milyen tartalommal " +
        "érkezzen riport a teljesített feladatokról, eltérésekről és nyitott pontokról.",
    },
    {
      title: "Működés elindítása, ellenőrzése és finomhangolása",
      body:
        "Az indulás után a helyszíni tapasztalatok alapján pontosíthatók a " +
        "feladatok, szolgáltatói felelősségek, minőségellenőrzési pontok és riportok.",
    },
  ],
  trustItems: [
    {
      title: "Dokumentált Soft FM működési folyamat",
      body:
        "A takarítási, higiéniai, zöldterület- és operatív feladatok egyeztetett " +
        "módon követhetők, nem csak eseti kommunikációban kezelhetők.",
    },
    {
      title: "Egyeztetett takarítási és operatív támogatási rend",
      body:
        "A feladatkör, gyakoriság és minőségi elvárás mindig a helyszíni igényekhez " +
        "és a szerződéses scope-hoz igazodik.",
    },
    {
      title: "Szolgáltatói és alvállalkozói koordináció",
      body:
        "A Soft FM működés támogathatja a kijelölt szolgáltatók, alvállalkozók " +
        "vagy megrendelői partnerek összehangolását.",
    },
    {
      title: "Minőségellenőrzési és visszajelzési pontok",
      body:
        "Az ellenőrzési és visszajelzési pontok előre egyeztethetők, hogy az " +
        "eltérések kezelése követhetőbb legyen.",
    },
    {
      title: "Helyszíni eltérések és visszatérő problémák rögzítése",
      body:
        "A visszatérő operatív problémák, eltérések és javítási pontok riportálható " +
        "formában összegyűjthetők.",
    },
    {
      title: "Riportálás a megrendelő felé",
      body:
        "A riport tartalma, gyakorisága és részletezettsége az együttműködés elején " +
        "egyeztethető.",
    },
    {
      title: "Kapcsolódás Hard FM és helyszíni működéshez",
      body:
        "A Soft FM sok helyszínen a Hard FM, porta, recepció vagy biztonsági " +
        "működéssel együtt ad átláthatóbb operatív képet.",
    },
    {
      title: "Szerződéses és helyszíni igényekhez igazított működés",
      body:
        "A feladatok, szolgáltatói bevonás, gyakoriság és riportálás mindig a " +
        "helyszín adottságaihoz és szerződéses kereteihez igazodik.",
    },
  ],
  faq: [
    {
      q: "Mit jelent a Soft FM?",
      a:
        "A Soft FM a helyszínek napi működését támogató, nem műszaki facility " +
        "szolgáltatások koordinált kezelését jelenti. Ide tartozhat például a " +
        "takarítási működés, a zöldterület-gondozás, a higiéniai folyamatok, az " +
        "operatív támogatás és a szolgáltatói egyeztetés.",
    },
    {
      q: "Miben különbözik a Soft FM a Hard FM-től?",
      a:
        "A Hard FM elsősorban műszaki, karbantartási és üzemeltetési folyamatokra " +
        "fókuszál. A Soft FM inkább a napi működést támogató szolgáltatásokhoz " +
        "kapcsolódik, például takarításhoz, zöldterülethez, higiéniai folyamatokhoz " +
        "és helyszíni operatív támogatáshoz. A két terület sok helyszínen együtt " +
        "működik hatékonyan.",
    },
    {
      q: "Csak takarításról szól a Soft FM?",
      a:
        "Nem. A takarítás fontos része lehet, de a Soft FM ennél szélesebb " +
        "működési réteg. Magában foglalhatja a szolgáltatói koordinációt, " +
        "zöldterület-gondozást, higiéniai folyamatokat, minőségellenőrzést, " +
        "riportálást és a helyszíni operatív támogatást is.",
    },
    {
      q: "Kezelhető több szolgáltató vagy alvállalkozó koordinációja?",
      a:
        "Igen, a Soft FM része lehet a szolgáltatók és alvállalkozók összehangolása. " +
        "A pontos felelősségi köröket, kapcsolattartási pontokat és riportálási " +
        "rendet az együttműködés elején érdemes rögzíteni.",
    },
    {
      q: "Van garantált takarítási minőség?",
      a:
        "A minőségi elvárásokat, ellenőrzési szempontokat és visszajelzési " +
        "folyamatokat előre kell rögzíteni. Így a szolgáltatás nem általános " +
        "ígéretre, hanem egyeztetett scope-ra, ellenőrzési pontokra és riportálásra épül.",
    },
    {
      q: "Kapunk riportot a Soft FM feladatokról?",
      a:
        "Igen, a szolgáltatás része lehet egyeztetett riportálás. A riport " +
        "tartalmazhatja a teljesített feladatokat, észlelt eltéréseket, visszatérő " +
        "problémákat, minőségellenőrzési megállapításokat és fejlesztési javaslatokat.",
    },
    {
      q: "Kapcsolódhat a Soft FM portaszolgálati vagy biztonsági működéshez?",
      a:
        "Igen. Sok helyszínen a porta, recepció, objektumőrzés vagy Hard FM működés " +
        "jelzi először az operatív problémákat. A Soft FM akkor működik jól, ha a " +
        "helyszíni jelzések, felelősök, szolgáltatók és riportálási folyamatok össze " +
        "vannak hangolva.",
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
    "objektumorzes",
    "rendezvenybiztositas",
    "biztonsagtechnika",
    "tavfelugyelet-vonuloszolgalat",
    "mystery-shopping-helyszini-audit",
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
