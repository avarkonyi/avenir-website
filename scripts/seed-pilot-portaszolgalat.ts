// One-shot pilot data seeder for "Recepciós és portaszolgálat" (P5 Phase 1).
//
// Usage:
//   npx tsx scripts/seed-pilot-portaszolgalat.ts            # writes
//   npx tsx scripts/seed-pilot-portaszolgalat.ts --dry-run  # read-only preview
//
// What it does (normal mode):
//   1. Resolves the existing canonical row by slug, first looking for
//      "portaszolgalat", then falling back to the legacy "reception"
//      slug. The row is renamed in-place if it still uses the legacy
//      slug.
//   2. Writes Hungarian pilot copy into every service-detail-page
//      column (SEO, value proposition, use cases, included items,
//      process steps, trust items, FAQ, related services).
//   3. Sets isPublished=true so the public detail page renders.
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
// untouched.
// This script intentionally does not write nameHu: the display name
// stays the short baseline/i18n name. Long landing-page positioning
// belongs in detail fields such as seoTitleHu, valuePropositionHu,
// and longDescHu.
//
// Run after the 0011 migration has been applied; otherwise the new
// columns won't exist in the target DB and the UPDATE will fail.

import "./load-env";
import { eq, or } from "drizzle-orm";
import { db, services } from "../lib/db";

const TARGET_SLUG = "portaszolgalat";
const LEGACY_SLUG = "reception";

const PILOT_HU = {
  seoTitle: "Recepciós és portaszolgálat vállalatoknak | Avenir",
  seoDescription:
    "Portaszolgálat beléptetéssel, vendégkezeléssel, kulcskezeléssel és " +
    "dokumentált napi működéssel irodaházaknak és vállalati helyszíneknek.",
  valueProposition:
    "A recepciós és portaszolgálat az első működési pont, ahol a látogatók, " +
    "beszállítók, munkatársak és bérlők találkoznak a helyszín szabályaival. " +
    "Az Avenir célja, hogy ez a pont egyszerre legyen rendezett, udvarias, " +
    "ellenőrizhető és biztonsági szempontból következetes.",
  longDesc:
    "A portaszolgálat nem egyszerű jelenlét a bejáratnál: a napi működés " +
    "egyik legfontosabb kontrollpontja. A szolgáltatás a helyszín igényei " +
    "szerint támogathatja a látogatók fogadását, a vendégregisztrációt, a " +
    "beszállítók és alvállalkozók beléptetését, a kulcskezelést, a csomagok " +
    "átvételét, az információadást és a rendkívüli események jelzését.\n\n" +
    "Az Avenir a helyszíni felmérés alapján rögzíti a portaszolgálati és " +
    "recepciós protokollt: ki léphet be, milyen jogosultsággal, milyen " +
    "dokumentáció mellett, mikor szükséges értesítés, és milyen eseményt " +
    "kell naplózni vagy eszkalálni. A cél, hogy a megrendelő ne csak " +
    "reprezentatív vendégfogadást kapjon, hanem visszakövethető működést " +
    "is: szolgálati naplóval, egyeztetett riportálással és kijelölt felelős " +
    "kapcsolattartóval.\n\n" +
    "A portaszolgálat kapcsolódhat élőerős objektumőrzéshez, beléptető " +
    "rendszerhez, kamerarendszerhez vagy belső üzemeltetési folyamathoz. " +
    "A működés ISO 9001 és ISO 27001 tanúsított irányítási rendszerekhez " +
    "illeszkedő dokumentált folyamatokra épül, 24/7 diszpécseri háttérrel " +
    "támogatható, és több mint 30 aktív helyszínen szerzett tapasztalatra " +
    "támaszkodik.",
  useCases: [
    "Irodaházak és üzleti központok recepciós működése",
    "Logisztikai és ipari telephelyek porta- és beléptetési pontjai",
    "Bérlői, munkatársi és látogatói forgalmat kezelő helyszínek",
    "Beszállítói, futár- és teherforgalommal érintett objektumok",
    "Olyan vállalati helyszínek, ahol fontos a rendezett első benyomás és a dokumentált beléptetés",
  ],
  includedItems: [
    "Látogatók és vendégek fogadása",
    "Vendégregisztráció és beléptetési rend támogatása",
    "Beszállítók, futárok és alvállalkozók kezelése",
    "Kulcskezelési és kiadási szabályok követése",
    "Csomagátvétel és információtovábbítás egyeztetett rend szerint",
    "Szolgálati napló, eseményrögzítés és riportálás",
    "Kapcsolódás beléptető rendszerhez vagy belső üzemeltetési folyamathoz, ha a helyszín ezt igényli",
  ],
  processSteps: [
    {
      title: "Első egyeztetés és működési igényfelmérés",
      body:
        "A megkeresésre 2 munkanapon belül visszajelzünk, majd rögzítjük a " +
        "helyszín típusát, a látogatói forgalmat, a portapontok számát és a " +
        "kapcsolódó biztonsági vagy üzemeltetési elvárásokat.",
    },
    {
      title: "Helyszíni bejárás és forgalmi pontok áttekintése",
      body:
        "Áttekintjük a bejáratokat, recepciós vagy portapontokat, " +
        "beléptetési helyzeteket, kulcskezelési igényeket és a rendszeres " +
        "beszállítói vagy vendégforgalmat.",
    },
    {
      title: "Portaszolgálati és recepciós protokoll kialakítása",
      body:
        "Meghatározzuk a vendégfogadás, beléptetés, kulcskiadás, " +
        "csomagátvétel, értesítés és eseményrögzítés napi rendjét.",
    },
    {
      title: "Szolgálati utasítás és riportálási rend rögzítése",
      body:
        "Írásban rögzítjük a dokumentálandó eseményeket, a riportformátumot, " +
        "az eszkalációs pontokat és a kijelölt kapcsolattartókat.",
    },
    {
      title: "Személyzet megszervezése és betanítás",
      body:
        "A szolgálatot a szerződéses igények, a helyszíni protokoll és a " +
        "napi forgalom alapján szervezzük meg, betanítással és indulási " +
        "egyeztetéssel.",
    },
    {
      title: "Rendszeres egyeztetés és finomhangolás",
      body:
        "A működési tapasztalatokat, visszatérő kérdéseket és riportokat a " +
        "kijelölt felelős kapcsolattartóval egyeztetjük.",
    },
  ],
  trustItems: [
    {
      title: "Dokumentált napi működés",
      body:
        "Szolgálati napló, vendégkezelési rend, eseményrögzítés és " +
        "egyeztetett riportálás segíti a visszakövethető portaszolgálati " +
        "működést.",
    },
    {
      title: "Kijelölt felelős kapcsolattartó",
      body:
        "A megrendelő egy felelős kapcsolattartóval egyeztethet a napi " +
        "működésről, a riportokról és a szükséges protokoll-módosításokról.",
    },
    {
      title: "24/7 diszpécseri háttér",
      body:
        "A portaszolgálati működés 24/7 diszpécseri háttérrel támogatható; " +
        "az értesítési és eszkalációs rendet az együttműködés elején " +
        "rögzítjük.",
    },
    {
      title: "ISO 9001 és ISO 27001",
      body:
        "A folyamatok ISO 9001 és ISO 27001 tanúsított irányítási " +
        "rendszerekhez illeszkedő dokumentált működésre épülnek.",
    },
    {
      title: "Szervezeti háttér",
      body:
        "Több mint 30 aktív helyszínen szerzett tapasztalat és 200+ " +
        "munkatársból álló szervezeti háttér támogatja a szolgáltatást.",
    },
    {
      title: "Kapcsolódó vagyonvédelmi működés",
      body:
        "A porta- és recepciós működés szükség esetén élőerős " +
        "objektumőrzéssel, biztonságtechnikával vagy távfelügyeleti " +
        "folyamattal is összehangolható.",
    },
  ],
  faq: [
    {
      q: "Mit tartalmaz a recepciós és portaszolgálat?",
      a:
        "A szolgáltatás a helyszín igényei szerint tartalmazhat " +
        "vendégfogadást, vendégregisztrációt, beléptetési támogatást, " +
        "beszállítók és futárok kezelését, kulcskezelést, csomagátvételt, " +
        "szolgálati naplót és egyeztetett riportálást.",
    },
    {
      q: "Miben különbözik a portaszolgálat az objektumőrzéstől?",
      a:
        "A portaszolgálat elsősorban a bejárati, recepciós és napi " +
        "forgalomkezelési pontokra koncentrál, míg az objektumőrzés " +
        "szélesebb vagyonvédelmi jelenlétet, járőrözést és incidenskezelést " +
        "is jelenthet. A két szolgáltatás szükség esetén összehangolható.",
    },
    {
      q: "Kezelhető-e a beszállítói és futárforgalom?",
      a:
        "Igen, a beszállítói, futár- és alvállalkozói beléptetés rendjét a " +
        "helyszíni felmérés alapján alakítjuk ki. Meghatározható, milyen " +
        "adatokat kell rögzíteni, kit kell értesíteni, és hogyan történjen a " +
        "ki- és beléptetés dokumentálása.",
    },
    {
      q: "Van-e kulcskezelés?",
      a:
        "Igen, a szolgáltatás része lehet kulcskezelési rend követése, " +
        "kulcskiadás és kulcsvisszavétel dokumentálása. A pontos szabályokat " +
        "az együttműködés elején, helyszínre szabottan rögzítjük.",
    },
    {
      q: "Kapunk-e riportot a napi működésről?",
      a:
        "Igen, a portaszolgálati működéshez szolgálati napló, " +
        "eseményrögzítés és egyeztetett riportálás kapcsolódhat. A pontos " +
        "riportformátumot a megrendelői igény és a helyszín működése alapján " +
        "rögzítjük.",
    },
    {
      q: "Összeköthető-e beléptető rendszerrel?",
      a:
        "Igen, ahol erre lehetőség van, a portaszolgálat kapcsolódhat " +
        "meglévő beléptető rendszerhez, kamerarendszerhez vagy belső " +
        "üzemeltetési folyamathoz.",
    },
    {
      q: "Mikor érdemes portaszolgálati felmérést kérni?",
      a:
        "A felmérés akkor különösen hasznos, ha nő a látogatói vagy " +
        "beszállítói forgalom, változik a beléptetési rend, több szereplő " +
        "használja ugyanazt az objektumot, vagy rendezettebb dokumentálásra " +
        "és felelősségi rendre van szükség.",
    },
  ],
  // Related services use future canonical Hungarian public slugs. Some
  // may not exist in the baseline seed yet; the public query filters
  // missing/unpublished services so links do not break. Add future
  // service pilots one-by-one by aligning their canonical baseline slug,
  // not by reverting these values to legacy slugs.
  relatedSlugs: [
    "objektumorzes",
    "biztonsagtechnika",
    "tavfelugyelet-vonuloszolgalat",
    "mystery-shopping-helyszini-audit",
    "rendezvenybiztositas",
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
    ? "--- seed-pilot-portaszolgalat DRY-RUN start ---"
    : "--- seed-pilot-portaszolgalat start ---";
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
      "--- seed-pilot-portaszolgalat DRY-RUN done - no rows written. " +
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
    `--- seed-pilot-portaszolgalat done - row id=${existing.id} updated, ` +
      `slug=${TARGET_SLUG} published. ---`,
  );
}

main().catch((err) => {
  console.error("seed-pilot-portaszolgalat FAILED:", err);
  process.exit(1);
});
