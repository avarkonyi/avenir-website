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

import "./load-env";
import { eq, or } from "drizzle-orm";
import { db, services } from "../lib/db";

const TARGET_SLUG = "hard-fm";
const LEGACY_SLUG = "hardfm";

const PILOT_HU = {
  seoTitle: "Hard FM és műszaki üzemeltetés vállalati helyszínekre | Avenir",
  seoDescription:
    "Műszaki üzemeltetés, hibabejelentés-kezelés, karbantartási koordináció, " +
    "szolgáltatói egyeztetés és dokumentált riportálás vállalati helyszínekre.",
  valueProposition:
    "A Hard FM célja, hogy a vállalati, ipari, logisztikai és irodai " +
    "helyszínek műszaki működése ne eseti tűzoltásként, hanem átlátható, " +
    "koordinált és dokumentált folyamatként működjön: hibabejelentés-kezeléssel, " +
    "karbantartási egyeztetéssel, szolgáltatói koordinációval, eszkalációs " +
    "renddel és riportálással.",
  longDesc:
    "A Hard FM a helyszínek műszaki üzemeltetésének és karbantartási " +
    "folyamatainak koordinált kezelését jelenti. Ide tartozhatnak az " +
    "épületgépészeti, elektromos, kisebb műszaki, karbantartási, " +
    "hibaelhárítási és szolgáltatói egyeztetési feladatok, valamint azok " +
    "dokumentált követése.\n\n" +
    "Az Avenir a Hard FM feladatokat nem elszigetelt javításként kezeli, " +
    "hanem működési folyamatként. A helyszíni igények alapján meghatározható, " +
    "hogyan érkezzenek a hibabejelentések, ki döntsön az eszkalációról, " +
    "mely szolgáltatók vagy alvállalkozók vonhatók be, hogyan történjen a " +
    "beavatkozások dokumentálása, és milyen riportot kapjon a megrendelő.\n\n" +
    "A cél az, hogy a műszaki üzemeltetés támogassa a napi működés " +
    "folytonosságát: csökkenjen az ad hoc egyeztetés, átláthatóbb legyen a " +
    "hibák és beavatkozások kezelése, és a megrendelő visszakövethető " +
    "információt kapjon a helyszíni műszaki folyamatokról.",
  useCases: [
    "Irodaházak és üzleti központok műszaki üzemeltetési támogatása",
    "Ipari és logisztikai telephelyek karbantartási koordinációja",
    "Raktárak, szolgáltatási pontok és több helyszínes működések műszaki folyamatai",
    "Hibabejelentések, kisebb műszaki problémák és szolgáltatói egyeztetések kezelése",
    "Olyan helyszínek, ahol fontos a dokumentált beavatkozás, riportálás és eszkaláció",
    "Műszaki üzemeltetés és Soft FM / security operation összehangolása",
  ],
  includedItems: [
    "Hibabejelentési és eszkalációs folyamat kialakítása",
    "Karbantartási és műszaki feladatok koordinációja",
    "Szolgáltatói és alvállalkozói egyeztetés támogatása",
    "Helyszíni műszaki kockázatok és visszatérő problémák rögzítése",
    "Beavatkozások, státuszok és lezárások dokumentálása",
    "Egyeztetett riportálás a megrendelő felé",
    "Kapcsolódás Soft FM, portaszolgálati és biztonsági működéshez",
  ],
  processSteps: [
    {
      title: "Helyszíni műszaki működés és igények áttekintése",
      body:
        "Áttekintjük a helyszín műszaki működését, visszatérő problémáit, " +
        "karbantartási pontjait és azokat a szereplőket, akik a napi " +
        "üzemeltetésben érintettek.",
    },
    {
      title: "Hibabejelentési, karbantartási és eszkalációs rend egyeztetése",
      body:
        "Rögzíthető, hogyan érkezzen a hibabejelentés, ki döntsön a " +
        "prioritásról, mikor szükséges eszkaláció, és milyen státuszokat kell " +
        "visszajelezni a megrendelőnek.",
    },
    {
      title: "Szolgáltatói / alvállalkozói koordinációs folyamat kialakítása",
      body:
        "A folyamatba bevonhatók kijelölt szolgáltatók, alvállalkozók vagy a " +
        "megrendelő meglévő partnerei, a szerződéses és helyszíni kereteknek " +
        "megfelelően.",
    },
    {
      title: "Műszaki feladatok, beavatkozások és státuszok dokumentálása",
      body:
        "A hibák, intézkedések, lezárások és nyitott pontok egyeztetett módon " +
        "rögzíthetők, hogy a helyszíni műszaki működés visszakövethető legyen.",
    },
    {
      title: "Rendszeres riportálás és visszajelzés a megrendelő felé",
      body:
        "A riportálás tartalma és gyakorisága az együttműködés elején " +
        "rögzíthető, beleértve a nyitott feladatokat, lezárt beavatkozásokat " +
        "és visszatérő problémákat.",
    },
    {
      title: "Visszatérő hibák, kockázatok és fejlesztési pontok egyeztetése",
      body:
        "A tapasztalatok alapján azonosíthatók azok a pontok, ahol megelőző " +
        "karbantartás, folyamatmódosítás vagy szolgáltatói egyeztetés segítheti " +
        "az üzemeltetési folytonosságot.",
    },
  ],
  trustItems: [
    {
      title: "Dokumentált műszaki üzemeltetési folyamat",
      body:
        "A hibák, beavatkozások, státuszok és lezárások egyeztetett módon " +
        "rögzíthetők, nem csak eseti kommunikációban kezelhetők.",
    },
    {
      title: "Egyeztetett hibabejelentési és eszkalációs rend",
      body:
        "A jelzési, priorizálási és eszkalációs pontok a helyszín és a " +
        "szerződéses működés alapján határozhatók meg.",
    },
    {
      title: "Szolgáltatói és alvállalkozói koordináció",
      body:
        "A Hard FM működés támogathatja a saját, alvállalkozói vagy " +
        "megrendelői szolgáltatói kör összehangolását.",
    },
    {
      title: "Beavatkozások és státuszok visszakövethető rögzítése",
      body:
        "A megrendelő átláthatóbb képet kaphat arról, milyen műszaki feladat " +
        "nyitott, folyamatban lévő vagy lezárt.",
    },
    {
      title: "Riportálás a megrendelő felé",
      body:
        "A riport tartalma, gyakorisága és részletezettsége az együttműködés " +
        "elején egyeztethető.",
    },
    {
      title: "Kapcsolódás Soft FM és biztonsági működéshez",
      body:
        "A porta, őrzés, biztonságtechnika vagy Soft FM működés sok esetben " +
        "elsőként észlel műszaki problémát, ezért a jelzési lánc összehangolása " +
        "fontos.",
    },
    {
      title: "Szerződéses és helyszíni igényekhez igazított működés",
      body:
        "A feladatkör, reagálási rend és szolgáltatói bevonás mindig a " +
        "helyszín adottságaitól és a szerződéses keretektől függ.",
    },
  ],
  faq: [
    {
      q: "Mit jelent a Hard FM?",
      a:
        "A Hard FM a helyszínek műszaki üzemeltetésének, karbantartási " +
        "folyamatainak, hibabejelentéseinek és szolgáltatói egyeztetéseinek " +
        "koordinált kezelését jelenti. A cél, hogy a műszaki működés átlátható, " +
        "dokumentált és visszakövethető legyen.",
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
      q: "Az Avenir saját maga végez minden műszaki munkát?",
      a:
        "A működés a feladat jellegétől és a szerződéses keretektől függ. A " +
        "Hard FM szolgáltatás része lehet saját koordináció, kijelölt " +
        "szolgáltatók bevonása, alvállalkozói egyeztetés vagy a megrendelő " +
        "meglévő partnereinek koordinált kezelése.",
    },
    {
      q: "Van garantált javítási idő?",
      a:
        "A javítási vagy reagálási idők a helyszín, a probléma típusa, az " +
        "elérhető szolgáltatók és a szerződéses feltételek alapján határozhatók " +
        "meg. A vállalható reakcióidőt és eszkalációs szabályokat az " +
        "együttműködés elején érdemes rögzíteni.",
    },
    {
      q: "Kapunk riportot a műszaki feladatokról?",
      a:
        "Igen, a szolgáltatás része lehet egyeztetett riportálás. A riport " +
        "tartalmazhatja a hibabejelentéseket, státuszokat, beavatkozásokat, " +
        "lezárt feladatokat, visszatérő problémákat és fejlesztési javaslatokat.",
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
  // only the legacy slug for this service. soft-fm may be added later
  // once Soft FM is canonicalized and public-ready.
  relatedSlugs: [
    "biztonsagtechnika",
    "portaszolgalat",
    "objektumorzes",
    "tavfelugyelet-vonuloszolgalat",
    "rendezvenybiztositas",
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
    ? "--- seed-pilot-hard-fm DRY-RUN start ---"
    : "--- seed-pilot-hard-fm start ---";
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
