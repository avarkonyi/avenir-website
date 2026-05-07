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
//
// Run after the 0011 migration has been applied; otherwise the new
// columns won't exist in the target DB and the UPDATE will fail.

import "./load-env";
import { eq, or } from "drizzle-orm";
import { db, services } from "../lib/db";

const TARGET_SLUG = "objektumorzes";
const LEGACY_SLUG = "security";

const PILOT_HU = {
  seoTitle: "Élőerős objektumőrzés | Avenir Facility Management",
  seoDescription:
    "Képzett vagyonőrök, dokumentált folyamatok és 24/7 diszpécseri háttér. " +
    "Egy szerződés, egy felelős kapcsolattartó országosan.",
  valueProposition:
    "Kevesebb kockázat, több kontroll: képzett vagyonőrök, dokumentált " +
    "szolgálati protokollok és 24/7 diszpécseri háttér — egy felelős " +
    "kapcsolattartóval országszerte.",
  longDesc:
    "Az élőerős objektumőrzés a vagyonvédelem klasszikus, " +
    "kiszámítható alapköve: állandó őri jelenlét, ellenőrzött beléptetés, " +
    "járőrözés és dokumentált incidenskezelés. Az Avenir képzett, " +
    "fegyveres és fegyvertelen vagyonőrökkel dolgozik a hatósági " +
    "engedélyek (SzVMt. szerinti tevékenységi engedély " +
    "01030-822/4926-7/2023) és belső ISO 9001 + ISO 27001 protokollok " +
    "szerint.\n\n" +
    "Minden helyszínre testre szabott szolgálati utasítást készítünk: " +
    "ki, mikor, mit ellenőriz, milyen jelentési és eszkalációs rendben. " +
    "A napi szolgálati jegyzőkönyveket digitálisan rögzítjük; heti " +
    "összesített riportot küldünk a kapcsolattartónak.",
  useCases: [
    "Logisztikai központok és raktárbázisok",
    "Ipari és gyártási parkok",
    "Bevásárlóközpontok és kiskereskedelmi egységek",
    "Irodaházak és A-kategóriás bérirodák",
    "Közintézmények és oktatási létesítmények",
  ],
  includedItems: [
    "Hatósági engedéllyel rendelkező vagyonőrök",
    "Helyszínre szabott szolgálati utasítás",
    "Beléptetés-, kulcs- és látogatókezelés",
    "Rendszeres járőrözés és ellenőrzési pontok",
    "Digitális szolgálati napló és incidens-jegyzőkönyv",
    "Heti riport, havi áttekintő egyeztetés",
  ],
  processSteps: [
    {
      title: "Felmérés",
      body: "Helyszíni bejárás, kockázatelemzés és igényfelmérés a " +
        "kapcsolattartóval. 1–3 munkanap.",
    },
    {
      title: "Ajánlat",
      body: "Testre szabott szolgáltatási csomag, létszámterv és " +
        "transzparens árazás 5 munkanapon belül.",
    },
    {
      title: "Indulás",
      body: "Csapat-felállás, oktatás, szolgálati utasítás véglegesítése. " +
        "A vállalt indulási dátumot rögzítjük a szerződésben.",
    },
    {
      title: "Működés",
      body: "Napi digitális jegyzőkönyv, heti riport, havi áttekintés. " +
        "Eskalációs rend a 24/7 diszpécseren át.",
    },
  ],
  trustItems: [
    {
      title: "ISO 9001 + ISO 27001",
      body: "Tanúsított minőségirányítás és információbiztonság — a " +
        "szolgálati adatok és incidens-jegyzőkönyvek kezelése auditált.",
    },
    {
      title: "Működési megbízhatóság",
      body: "30+ aktív helyszín, 200+ szakképzett munkatárs, 24/7 " +
        "diszpécseri háttér országosan.",
    },
    {
      title: "Egy felelős kapcsolattartó",
      body: "Egy szerződés, egy döntéshozó. Nincs ping-pong több " +
        "alvállalkozó között — gyors döntés és reagálás.",
    },
  ],
  faq: [
    {
      q: "Hogyan kérhetek ajánlatot?",
      a: "Telefonon (+36 70 316 8218), e-mailben (info@afm.hu) vagy a " +
        "weboldal kapcsolati űrlapján. 2 munkanapon belül visszajelzünk; " +
        "az írásos ajánlat tipikusan 5 munkanapon belül érkezik.",
    },
    {
      q: "Milyen rendszerességgel kapok riportot?",
      a: "Napi digitális szolgálati jegyzőkönyv, heti összesített riport " +
        "és havi áttekintő egyeztetés. Incidens esetén soron kívüli " +
        "értesítést küldünk a megállapodott eszkalációs rend szerint.",
    },
    {
      q: "Milyen hatósági engedélyekkel rendelkeznek?",
      a: "Az Avenir SzVMt. szerinti vagyonvédelmi tevékenységi engedéllyel " +
        "(01030-822/4926-7/2023, 2028.01.31-ig), biztonságtechnikai és " +
        "magánnyomozói engedéllyel, valamint nemzetbiztonsági névjegyzéki " +
        "regisztrációval rendelkezik. Az impresszumban minden engedély " +
        "számát közöljük.",
    },
    {
      q: "Vállalnak vidéki és többműszakos szolgálatot is?",
      a: "Igen. Országosan 30+ aktív helyszínen dolgozunk, és 24/7 " +
        "(többműszakos) szolgálatot is biztosítunk a megrendelővel " +
        "egyeztetett protokoll szerint.",
    },
  ],
  // Slugs of related services that will appear in the "related" rail.
  // Missing/unpublished slugs are silently dropped at render time.
  relatedSlugs: ["reception", "mystery", "technical"],
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
  console.log(`DB target (host/db): ${redactedDbIdentity()}`);

  const [existing] = await db
    .select()
    .from(services)
    .where(or(eq(services.slug, TARGET_SLUG), eq(services.slug, LEGACY_SLUG)))
    .orderBy(services.id)
    .limit(1);

  if (!existing) {
    console.error(
      `No existing canonical row found (looked for slug "${TARGET_SLUG}" ` +
        `or "${LEGACY_SLUG}"). Run "npm run db:seed-services" first to ` +
        `create the baseline rows, then re-run this script.`,
    );
    process.exit(1);
  }

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
