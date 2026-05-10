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
  seoTitle: "Rendezvénybiztosítás vállalati és zártkörű eseményekre | Avenir",
  seoDescription:
    "Rendezvénybiztosítás beléptetéssel, vendégáramlás-támogatással, " +
    "zónakezeléssel, incidensjelzéssel és szervezői kapcsolattartással.",
  valueProposition:
    "A rendezvénybiztosítás célja, hogy az esemény ideje alatt a " +
    "vendégáramlás, a beléptetés, a zárt vagy kiemelt területek kezelése, " +
    "a konfliktusmegelőzés és az incidensjelzés előre egyeztetett rend " +
    "szerint működjön. Az Avenir a rendezvény jellegéhez, helyszínéhez és " +
    "szervezői elvárásaihoz igazított biztonsági jelenlétet és dokumentált " +
    "eseménykezelést biztosít.",
  longDesc:
    "A rendezvénybiztosítás nem azonos a folyamatos objektumőrzéssel. A " +
    "rendezvények időben, helyszínben és kockázati profilban is eltérő " +
    "működést igényelnek: vendégek érkeznek, zónák nyílnak és záródnak, " +
    "beszállítók és szervezők mozognak, VIP vagy backstage területek " +
    "kezelése merülhet fel, és a helyszíni személyzetnek gyorsan kell " +
    "együttműködnie a szervezőkkel.\n\n" +
    "Az Avenir a rendezvénybiztosítást előre egyeztetett scope alapján " +
    "szervezi. A helyszín, a résztvevői kör, a belépési pontok, a zárt " +
    "területek, a szervezői kapcsolattartás, az incidensjelzési rend és a " +
    "szükséges biztonsági személyzet az esemény jellegétől és szerződéses " +
    "kereteitől függően kerül meghatározásra.\n\n" +
    "A cél nem az, hogy általános garanciát adjunk minden helyzetre, hanem " +
    "hogy a rendezvény ideje alatt átlátható, koordinált és dokumentált " +
    "biztonsági működés álljon rendelkezésre: beléptetés támogatásával, " +
    "vendégáramlás kezelésével, konfliktusmegelőző jelenléttel, " +
    "eszkalációs renddel és rendezvényzáró visszajelzéssel.",
  useCases: [
    "Vállalati rendezvények és zártkörű események",
    "Konferenciák, partnertalálkozók és üzleti események",
    "VIP, backstage vagy zárt területekkel működő rendezvények",
    "Kiállítások, bemutatók és promóciós események",
    "Olyan helyszínek, ahol beléptetés, vendégáramlás vagy szervezői koordináció szükséges",
    "Események, ahol incidensjelzési és eszkalációs rendet kell működtetni",
  ],
  includedItems: [
    "Beléptetési és vendégáramlási pontok támogatása",
    "Rendezvényhelyszín biztonsági jelenléte",
    "Zárt, VIP vagy backstage területek kezelése",
    "Szervezői kapcsolattartás és helyszíni koordináció",
    "Konfliktusmegelőző biztonsági jelenlét",
    "Incidensjelzés és eszkaláció előre egyeztetett rend szerint",
    "Dokumentált eseménykezelés és rendezvényzáró visszajelzés",
  ],
  processSteps: [
    {
      title: "Rendezvény scope és helyszíni igények egyeztetése",
      body:
        "Rögzítjük a rendezvény jellegét, időtartamát, várható résztvevői " +
        "körét, helyszíni adottságait és a szervezői elvárásokat.",
    },
    {
      title: "Belépési pontok, zónák és szervezői kapcsolattartás feltérképezése",
      body:
        "Áttekintjük a beléptetési pontokat, zárt vagy kiemelt területeket, " +
        "vendégáramlási irányokat és a szervezői kapcsolattartási rendet.",
    },
    {
      title: "Biztonsági személyzeti és eszkalációs rend kialakítása",
      body:
        "A szükséges biztonsági jelenlétet, jogosultsági pontokat és " +
        "incidensjelzési rendet az esemény scope-ja és szerződéses keretei " +
        "alapján határozzuk meg.",
    },
    {
      title: "Rendezvény alatti beléptetési, zónakezelési és incidensjelzési támogatás",
      body:
        "A rendezvény alatt a biztonsági személyzet a beléptetés, zónakezelés, " +
        "vendégáramlás és incidensjelzés egyeztetett rendjét támogatja.",
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
      title: "Előre egyeztetett rendezvénybiztosítási scope",
      body:
        "A biztonsági jelenlét, beléptetés, zónakezelés és kapcsolattartás " +
        "kereteit az esemény előtt kell rögzíteni.",
    },
    {
      title: "Kijelölt szervezői kapcsolattartás",
      body:
        "A gyors helyszíni döntésekhez és jelzésekhez a szervezői és " +
        "biztonsági oldalon is egyértelmű kapcsolattartási pont szükséges.",
    },
    {
      title: "Dokumentált incidensjelzési és eszkalációs rend",
      body:
        "A váratlan helyzetek kezelését előre egyeztetett jelzési, értesítési " +
        "és dokumentálási rend támogatja.",
    },
    {
      title: "Biztonsági személyzet az esemény jellegéhez igazítva",
      body:
        "A szükséges jelenlétet az esemény típusa, helyszíne, résztvevői köre " +
        "és szerződéses scope-ja alapján kell kialakítani.",
    },
    {
      title: "Zárt és kiemelt területek kezelése",
      body:
        "VIP, backstage vagy más zárt területek kezelése akkor része a " +
        "szolgáltatásnak, ha ezt a rendezvény scope-ja tartalmazza.",
    },
    {
      title: "Kapcsolódás beléptetési és vendégáramlási folyamatokhoz",
      body:
        "A rendezvénybiztosítás a beléptetés, vendégirányítás és helyszíni " +
        "koordináció gyakorlati működéséhez kapcsolódik.",
    },
    {
      title: "Rendezvényzáró visszajelzés",
      body:
        "Az esemény után visszajelzés vagy riport készülhet a főbb " +
        "tapasztalatokról, eltérésekről és fejlesztési pontokról.",
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
      q: "Milyen rendezvényekhez kérhető biztonsági jelenlét?",
      a:
        "Rendezvénybiztosítás kérhető például vállalati eseményekhez, " +
        "konferenciákhoz, partnertalálkozókhoz, zártkörű rendezvényekhez, " +
        "kiállításokhoz, bemutatókhoz vagy olyan eseményekhez, ahol beléptetési, " +
        "vendégáramlási vagy zónakezelési feladatok merülnek fel.",
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
        "kockázatok csökkentése, a helyszíni jelenlét, az előre egyeztetett " +
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
    "biztonsagtechnika",
    "tavfelugyelet-vonuloszolgalat",
    "mystery-shopping-helyszini-audit",
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
