// One-shot pilot data seeder for "Rendezvénybiztosítás" (P5 Phase 1).
//
// Usage:
//   npx tsx scripts/seed-pilot-rendezvenybiztositas.ts            # writes
//   npx tsx scripts/seed-pilot-rendezvenybiztositas.ts --dry-run  # read-only preview
//
// What it does (normal mode):
//   1. Resolves exactly one existing row by slug, looking for the
//      canonical "rendezvenybiztositas" slug or the legacy "cleaning"
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
// display name stays the short baseline/i18n name "Rendezvénybiztosítás".
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

const TARGET_SLUG = "rendezvenybiztositas";
const LEGACY_SLUG = "cleaning";

const PILOT_HU = {
  seoTitle: "Rendezvénybiztosítás vállalati, zártkörű és nyilvános eseményekre | Avenir",
  seoDescription:
    "Rendezvénybiztosítás beléptetéssel, vendég- és közönségáramlás " +
    "támogatásával, zónakezeléssel, incidensjelzéssel és szervezői " +
    "kapcsolattartással.",
  valueProposition:
    "A rendezvénybiztosítás célja, hogy a beléptetés, a vendég- és " +
    "közönségáramlás, a zónakezelés, a konfliktusmegelőzés és az " +
    "incidenskezelés vállalati, zártkörű és nyilvános eseményeken is " +
    "egyeztetett keretben működjön.",
  longDesc:
    "A rendezvénybiztosítás nem kizárólag vállalati vagy zártkörű " +
    "eseményekre vonatkozik. A rendezvény jellegétől függően az Avenir " +
    "támogatja a beléptetést, a vendég- vagy közönségáramlás kezelését, a " +
    "zárt területek és zónák kezelését, a peremterületek felügyeleti " +
    "rendjét, a konfliktusmegelőzést, az incidensrögzítést és a szervező " +
    "által meghatározott eszkalációs folyamatot.\n\n" +
    "A vállalati és zártkörű eseményeknél ide tartozhatnak konferenciák, " +
    "üzleti találkozók, kiállítások, termékbemutatók, VIP-, backstage- vagy " +
    "más zárt területek. Nyilvános eseményeknél, fesztiváloknál, " +
    "koncerteknél, sporteseményeknél és kulturális programoknál a hangsúly " +
    "a közönségáramlás, a több belépési pont, a zónák és a szervezői " +
    "kapcsolattartási lánc egyeztetett működésére kerül.\n\n" +
    "A cél nem az, hogy általános garanciát adjunk minden helyzetre, hanem " +
    "hogy a rendezvény ideje alatt átlátható biztonsági keret működjön: " +
    "beléptetés támogatásával, vendég- vagy közönségáramlás kezelésével, " +
    "konfliktusmegelőző jelenléttel, incidensrögzítéssel, eszkalációs " +
    "renddel és rendezvényzáró visszajelzéssel.",
  useCases: [
    "Vállalati rendezvények, konferenciák és üzleti események",
    "Zártkörű események, termékbemutatók és kiállítások",
    "Fesztiválok és szabadtéri kulturális rendezvények",
    "Koncertek és beltéri nyilvános előadások",
    "Sportesemények és tornák",
    "VIP-, backstage-, zárt vagy kiemelt területekkel rendelkező rendezvények",
    "Több belépési ponttal, közönségáramlással vagy szervezői koordinációval járó események",
    "Incidensrögzítést és eszkalációs keretet igénylő rendezvények",
  ],
  includedItems: [
    "Beléptetés és belépési pontok kezelése",
    "Vendég- és közönségáramlás támogatása",
    "Zónák, peremterületek és zárt területek kezelése",
    "VIP-, backstage- vagy kiemelt területek támogatása, ha a rendezvény jellege indokolja",
    "Konfliktusmegelőzés és incidenseszkaláció",
    "Incidensrögzítés és rendezvénybiztosítási jelentés",
    "Több belépési pont kezelése nyilvános vagy nagyobb létszámú eseményeken",
    "Kapcsolattartás a szervező által meghatározott felelősökkel és eszkalációs pontokkal",
  ],
  processSteps: [
    {
      title: "Rendezvény scope és helyszíni igények egyeztetése",
      body:
        "Rögzítjük a rendezvény típusát, időtartamát, várható vendég- vagy " +
        "közönségáramlását, helyszíni adottságait, zónáit és a szervezői " +
        "elvárásokat.",
    },
    {
      title: "Belépési pontok, zónák és szervezői kapcsolattartás feltérképezése",
      body:
        "Áttekintjük a beléptetési pontokat, zárt vagy kiemelt területeket, " +
        "vendég- vagy közönségáramlási irányokat, peremterületeket és a " +
        "szervezői kapcsolattartási rendet.",
    },
    {
      title: "Biztonsági személyzeti és eszkalációs rend kialakítása",
      body:
        "A szükséges biztonsági jelenlétet, jogosultsági pontokat, " +
        "kapcsolattartási láncot és incidensjelzési rendet az esemény " +
        "scope-ja és szerződéses keretei alapján határozzuk meg.",
    },
    {
      title: "Rendezvény alatti beléptetési, zónakezelési és incidensjelzési támogatás",
      body:
        "A rendezvény alatt a biztonsági személyzet a beléptetés, a " +
        "zónakezelés, a vendég- vagy közönségáramlás és az incidensjelzés " +
        "egyeztetett rendjét támogatja.",
    },
    {
      title: "Események, eltérések és beavatkozások dokumentálása",
      body:
        "A releváns eseményeket, eltéréseket és beavatkozásokat a megrendelővel " +
        "egyeztetett dokumentálási szint szerint rögzítjük.",
    },
    {
      title: "Rendezvényzáró visszajelzés és fejlesztési javaslatok egyeztetése",
      body:
        "A rendezvényt követően összefoglalható, mi működött jól, hol volt " +
        "eltérés, és milyen módosítás segítheti a következő esemény működését.",
    },
  ],
  trustItems: [
    {
      title: "Rendezvényre szabott biztosítási terv",
      body:
        "A biztonsági jelenlét, a belépési pontok, a zónák, a vendég- vagy " +
        "közönségáramlás és az eszkalációs útvonalak a rendezvény típusához " +
        "és az egyeztetett scope-hoz igazodnak.",
    },
    {
      title: "Közönségáramlás és belépési pontok kezelése",
      body:
        "A beléptetés, a vendég- vagy közönségmozgás és a több belépési pont " +
        "kezelése a rendezvény elrendezéséhez, várható forgalmához és a " +
        "szervező által meghatározott szabályokhoz igazodik.",
    },
    {
      title: "Zónák, peremterületek és zárt területek kezelése",
      body:
        "A VIP-, backstage-, zárt, kiemelt vagy peremterületek kezelése az " +
        "egyeztetett rendezvénybiztosítási terv és belépési szabályok " +
        "szerint történik.",
    },
    {
      title: "Incidensrögzítés és szervezői eszkaláció",
      body:
        "Az incidensek, eltérések és eszkalációs igények rögzítése és " +
        "kezelése a szervező által meghatározott kapcsolattartási és " +
        "eszkalációs lánc szerint történik.",
    },
    {
      title: "Egy kijelölt felelős kapcsolattartási pont",
      body:
        "A szervező kijelölt rendezvénybiztonsági kapcsolattartási pontot " +
        "kap a koordinációhoz, a jelentéshez és az eseménynapi kommunikációhoz.",
    },
    {
      title: "Utólagos áttekintés és fejlesztési pontok",
      body:
        "A rendezvény után az Avenir támogatni tudja az incidensek, " +
        "visszatérő problémák és fejlesztési pontok áttekintését a jövőbeli " +
        "rendezvénytervezéshez.",
    },
  ],
  faq: [
    {
      q: "Miben különbözik a rendezvénybiztosítás az objektumőrzéstől?",
      a:
        "Az objektumőrzés jellemzően állandó vagy hosszabb távú helyszíni " +
        "működésre épül, míg a rendezvénybiztosítás időben behatárolt, " +
        "eseményhez igazított szolgáltatás. Itt a vendégáramlás, beléptetés, " +
        "zónakezelés, szervezői kapcsolattartás és incidensjelzés kerül előtérbe.",
    },
    {
      q: "Fesztiválokra, koncertekre és sporteseményekre is kérhető rendezvénybiztosítás?",
      a:
        "Igen. A rendezvénybiztosítás vállalati, zártkörű és nyilvános " +
        "eseményekre is kialakítható, ideértve a fesztiválokat, koncerteket, " +
        "sporteseményeket és kulturális programokat. A szolgáltatási keret a " +
        "rendezvény típusához, a vendég- vagy közönségáramláshoz, a belépési " +
        "pontokhoz, a zónákhoz, a szervezői kapcsolattartási lánchoz és az " +
        "incidensrögzítési igényekhez igazodik.",
    },
    {
      q: "Kezelhető VIP vagy backstage terület?",
      a:
        "Igen, ha a rendezvény scope-ja ezt tartalmazza, a biztonsági működés " +
        "kiterjedhet VIP, backstage, zárt vagy kiemelt területek kezelésére is. " +
        "A jogosultsági pontokat és a belépési szabályokat előre kell rögzíteni.",
    },
    {
      q: "Van garantált konfliktusmentes rendezvény?",
      a:
        "Nem ígérhető garantált konfliktusmentesség. A szolgáltatás célja a " +
        "kockázatok csökkentése, a helyszíni jelenlét, az egyeztetett " +
        "eszkalációs rend és a szervezőkkel való gyors kapcsolattartás biztosítása.",
    },
    {
      q: "Milyen szerepe van a szervezői kapcsolattartásnak?",
      a:
        "A rendezvénybiztosítás hatékony működéséhez fontos, hogy legyen kijelölt " +
        "kapcsolattartó a szervezői oldalon és a biztonsági oldalon is. Így " +
        "incidens, beléptetési kérdés, zónakezelési probléma vagy vendégáramlási " +
        "helyzet esetén gyorsabb az egyeztetés.",
    },
    {
      q: "Készül rendezvényzáró riport?",
      a:
        "A szolgáltatás része lehet rendezvényzáró visszajelzés vagy riport, " +
        "amely összefoglalja a főbb eseményeket, eltéréseket, incidenseket és " +
        "fejlesztési javaslatokat. A riport részletezettségét az együttműködés " +
        "elején érdemes rögzíteni.",
    },
    {
      q: "Mikor érdemes előzetes rendezvénybiztosítási bejárást tartani?",
      a:
        "Előzetes bejárás különösen akkor hasznos, ha több belépési pont, " +
        "VIP, backstage vagy zárt zóna, nagyobb vendégáramlás, külső " +
        "beszállítói mozgás, szokatlan helyszíni elrendezés, magasabb " +
        "kockázatú programelem vagy erős szervezői koordinációs igény várható.",
    },
    {
      q: "Kapcsolódhat a rendezvénybiztosítás beléptető vagy biztonságtechnikai rendszerhez?",
      a:
        "Igen, ahol a helyszín ezt lehetővé teszi, a rendezvénybiztosítás " +
        "kapcsolódhat beléptetési rendszerhez, kamerarendszerhez, zónakezelési " +
        "vagy más biztonságtechnikai folyamathoz. A pontos működést a helyszín " +
        "adottságai és a rendezvény scope-ja határozza meg.",
    },
  ],
  // Canonical Hungarian public service slugs. Missing or unpublished
  // related services are filtered safely by the public query layer.
  // Do not replace rendezvenybiztositas with cleaning in related
  // arrays: cleaning is only the legacy slug for this service. green
  // belongs to Soft FM and must not be used here.
  relatedSlugs: [
    "objektumorzes",
    "portaszolgalat",
    "mystery-shopping-helyszini-audit",
    "biztonsagtechnika",
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
    ? "--- seed-pilot-rendezvenybiztositas DRY-RUN start ---"
    : "--- seed-pilot-rendezvenybiztositas start ---";
  console.log(banner);
  ensureStagingDbTarget({
    scriptName: "seed-pilot-rendezvenybiztositas",
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
      "--- seed-pilot-rendezvenybiztositas DRY-RUN done - no rows written. " +
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
    `--- seed-pilot-rendezvenybiztositas done - row id=${existing.id} ` +
      `updated, slug=${TARGET_SLUG} published. ---`,
  );
}

main().catch((err) => {
  console.error("seed-pilot-rendezvenybiztositas FAILED:", err);
  process.exit(1);
});
