import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { and, asc, eq, isNull, ne, sql } from "drizzle-orm";
import { db, services } from "@/lib/db";
import {
  ServiceForm,
  type ParentOption,
  type ServiceInitial,
} from "../../_components/ServiceForm";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: idParam } = await params;
  const id = Number.parseInt(idParam, 10);
  if (!Number.isInteger(id) || id <= 0) notFound();

  await connection();

  const [row] = await db
    .select()
    .from(services)
    .where(eq(services.id, id))
    .limit(1);

  if (!row) notFound();

  // Parent options exclude self (defense in depth — server action
  // also rejects self-as-parent). Top-level only, ordered by
  // sortOrder ASC.
  const [parentRows, [{ value: childCount }]] = await Promise.all([
    db
      .select({ id: services.id, nameHu: services.nameHu })
      .from(services)
      .where(and(isNull(services.parentId), ne(services.id, id)))
      .orderBy(asc(services.sortOrder), asc(services.id)),
    db
      .select({ value: sql<number>`count(*)::int` })
      .from(services)
      .where(eq(services.parentId, id)),
  ]);

  // If this service has children, the parent dropdown is locked —
  // the row cannot be demoted to a child while it still has
  // descendants.
  const isParentDisabled = (childCount ?? 0) > 0;
  const parentOptions: ParentOption[] = parentRows;

  // The DB-side jsonb columns are typed as `string[]` via $type<>().
  // Re-assert the cast at the prop boundary so the form can rely on
  // the array shape without nullish guards.
  const initial: ServiceInitial = {
    id: row.id,
    parentId: row.parentId,
    slug: row.slug,
    icon: row.icon,
    imageUrl: row.imageUrl,

    nameHu: row.nameHu,
    nameEn: row.nameEn,
    nameDe: row.nameDe,
    nameZh: row.nameZh,

    shortDescHu: row.shortDescHu,
    shortDescEn: row.shortDescEn,
    shortDescDe: row.shortDescDe,
    shortDescZh: row.shortDescZh,

    longDescHu: row.longDescHu,
    longDescEn: row.longDescEn,
    longDescDe: row.longDescDe,
    longDescZh: row.longDescZh,

    highlightsHu: row.highlightsHu,
    highlightsEn: row.highlightsEn,
    highlightsDe: row.highlightsDe,
    highlightsZh: row.highlightsZh,

    seoTitleHu: row.seoTitleHu,
    seoTitleEn: row.seoTitleEn,
    seoTitleDe: row.seoTitleDe,
    seoTitleZh: row.seoTitleZh,

    seoDescriptionHu: row.seoDescriptionHu,
    seoDescriptionEn: row.seoDescriptionEn,
    seoDescriptionDe: row.seoDescriptionDe,
    seoDescriptionZh: row.seoDescriptionZh,

    valuePropositionHu: row.valuePropositionHu,
    valuePropositionEn: row.valuePropositionEn,
    valuePropositionDe: row.valuePropositionDe,
    valuePropositionZh: row.valuePropositionZh,

    useCasesHu: row.useCasesHu,
    useCasesEn: row.useCasesEn,
    useCasesDe: row.useCasesDe,
    useCasesZh: row.useCasesZh,

    includedItemsHu: row.includedItemsHu,
    includedItemsEn: row.includedItemsEn,
    includedItemsDe: row.includedItemsDe,
    includedItemsZh: row.includedItemsZh,

    processStepsHu: row.processStepsHu,
    processStepsEn: row.processStepsEn,
    processStepsDe: row.processStepsDe,
    processStepsZh: row.processStepsZh,

    trustItemsHu: row.trustItemsHu,
    trustItemsEn: row.trustItemsEn,
    trustItemsDe: row.trustItemsDe,
    trustItemsZh: row.trustItemsZh,

    faqHu: row.faqHu,
    faqEn: row.faqEn,
    faqDe: row.faqDe,
    faqZh: row.faqZh,

    relatedServiceSlugs: row.relatedServiceSlugs,

    sortOrder: row.sortOrder,
    isFeatured: row.isFeatured,
    isPublished: row.isPublished,
    isActive: row.isActive,
  };

  return (
    <div style={{ maxWidth: 980 }}>
      <div style={{ marginBottom: 20 }}>
        <Link
          href="/admin/services"
          style={{
            color: "#0B1E3E",
            textDecoration: "none",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          ← Vissza a listához
        </Link>
      </div>

      <header style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#0B1E3E", margin: 0 }}>
          Szolgáltatás szerkesztése
        </h1>
        <p style={{ color: "#64748B", marginTop: 4, fontSize: 13 }}>
          ID #{row.id} · slug: <code>{row.slug}</code>
          {isParentDisabled && (
            <>
              {" "}· {childCount} al-szolgáltatása van (a szülő nem módosítható)
            </>
          )}
        </p>
      </header>

      <ServiceForm
        mode="edit"
        initial={initial}
        parentOptions={parentOptions}
        isParentDisabled={isParentDisabled}
      />
    </div>
  );
}
