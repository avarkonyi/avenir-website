import Link from "next/link";
import { connection } from "next/server";
import { and, eq, ilike, inArray, or, type SQL } from "drizzle-orm";
import { db, services } from "@/lib/db";
import { ServicesFilters } from "./_components/ServicesFilters";
import {
  ServicesListView,
  type ServicesListRow,
} from "./_components/ServicesListView";

type ServiceRow = typeof services.$inferSelect;

type StatusFilter = "all" | "draft" | "published";

type SearchParams = Promise<{
  status?: string;
  showInactive?: string;
  q?: string;
}>;

export default async function ServicesListPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const status: StatusFilter =
    sp.status === "draft" || sp.status === "published" ? sp.status : "all";
  const showInactive = sp.showInactive === "1";
  const q = (sp.q ?? "").trim();

  await connection();

  const baseConditions: SQL[] = [];
  if (status === "draft") baseConditions.push(eq(services.isPublished, false));
  if (status === "published") baseConditions.push(eq(services.isPublished, true));
  if (!showInactive) baseConditions.push(eq(services.isActive, true));

  let rows: ServiceRow[];
  if (q === "") {
    rows = await db
      .select()
      .from(services)
      .where(baseConditions.length > 0 ? and(...baseConditions) : undefined);
  } else {
    rows = await fetchWithSearchContext(q, baseConditions);
  }

  const totalActiveRows = await db
    .select({ id: services.id })
    .from(services)
    .where(eq(services.isActive, true));
  const totalActive = totalActiveRows.length;

  const grouped = groupHierarchically(rows);
  const hasFilters = status !== "all" || showInactive || q !== "";

  // Reorder is allowed only on the unfiltered, default-search,
  // hide-inactive view — anything else changes which rows the admin
  // sees, which would make a drag-to-reorder fundamentally ambiguous.
  const reorderEnabled = status === "all" && !showInactive && q === "";
  const showReorderBanner = !reorderEnabled;

  // Active top-level IDs in current sortOrder — the SortableContext
  // items array. Pulled directly from the grouped flatRows so the
  // client mirror starts in the same order the server rendered.
  const activeTopLevelIds = grouped.flatRows
    .filter(
      (entry) =>
        !entry.isChild && entry.row.parentId === null && entry.row.isActive,
    )
    .map((entry) => entry.row.id);

  // Slim the rows down for the client: drop timestamps + jsonb arrays
  // that the list-view never reads. Keeps the server→client payload
  // small and avoids Date serialization quirks across the boundary.
  const listRows: ServicesListRow[] = grouped.flatRows.map((entry) => ({
    id: entry.row.id,
    parentId: entry.row.parentId,
    nameHu: entry.row.nameHu,
    slug: entry.row.slug,
    isActive: entry.row.isActive,
    isPublished: entry.row.isPublished,
    isFeatured: entry.row.isFeatured,
    isChild: entry.isChild,
    parentName: entry.parentName,
  }));

  return (
    <div style={{ maxWidth: 1200 }}>
      <header style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#0B1E3E", margin: 0 }}>
          Szolgáltatások
        </h1>
        <p style={{ color: "#64748B", marginTop: 4, fontSize: 14 }}>
          {hasFilters
            ? `${rows.length} találat (${totalActive} aktív összesen)`
            : `${totalActive} aktív szolgáltatás`}
        </p>
      </header>

      <ServicesFilters />

      {showReorderBanner && (
        <div
          role="status"
          style={{
            background: "#F8FAFC",
            border: "1px solid #E2E8F0",
            borderRadius: 4,
            padding: "10px 14px",
            color: "#64748B",
            fontSize: 13,
            marginBottom: 16,
          }}
        >
          A sorrend módosításához kapcsold ki a szűrőket és a keresést.
        </div>
      )}

      {grouped.flatRows.length === 0 ? (
        <EmptyState hasFilters={hasFilters} />
      ) : (
        <ServicesListView
          rows={listRows}
          reorderEnabled={reorderEnabled}
          activeTopLevelIds={activeTopLevelIds}
        />
      )}
    </div>
  );
}

// ── search-context helpers ──────────────────────────────────────────────

// Two-query JS merge (Iter 3C C2). With ~25 rows in the table the
// difference vs a single UNION CTE is academic; this version reads
// clearer.
//
// Rule 1 — child match: include child + its parent (parent included
//          regardless of whether the parent passes base filters; pure
//          context, otherwise the child has no anchor in the hierarchy).
// Rule 2 — parent match: include parent + ALL of its children that
//          independently pass the base filters.
// Rule 3 — dedup via Map<id, row>. Sorting is done by groupHierarchically.
async function fetchWithSearchContext(
  q: string,
  baseConditions: SQL[],
): Promise<ServiceRow[]> {
  const pattern = `%${q}%`;
  const searchClause = or(
    ilike(services.nameHu, pattern),
    ilike(services.nameEn, pattern),
    ilike(services.nameDe, pattern),
    ilike(services.nameZh, pattern),
    ilike(services.slug, pattern),
    ilike(services.shortDescHu, pattern),
    ilike(services.shortDescEn, pattern),
    ilike(services.shortDescDe, pattern),
    ilike(services.shortDescZh, pattern),
  );

  const primaryConditions = searchClause
    ? [...baseConditions, searchClause]
    : baseConditions;

  const primary = await db
    .select()
    .from(services)
    .where(
      primaryConditions.length > 0 ? and(...primaryConditions) : undefined,
    );

  if (primary.length === 0) return [];

  const byId = new Map<number, ServiceRow>();
  for (const r of primary) byId.set(r.id, r);

  const parentIds = new Set<number>();
  for (const r of primary) {
    if (r.parentId !== null && !byId.has(r.parentId)) {
      parentIds.add(r.parentId);
    }
  }
  if (parentIds.size > 0) {
    const parentRows = await db
      .select()
      .from(services)
      .where(inArray(services.id, [...parentIds]));
    for (const r of parentRows) if (!byId.has(r.id)) byId.set(r.id, r);
  }

  const matchedParentIds = primary
    .filter((r) => r.parentId === null)
    .map((r) => r.id);
  if (matchedParentIds.length > 0) {
    const childConditions: SQL[] = [
      inArray(services.parentId, matchedParentIds),
      ...baseConditions,
    ];
    const childRows = await db
      .select()
      .from(services)
      .where(and(...childConditions));
    for (const r of childRows) if (!byId.has(r.id)) byId.set(r.id, r);
  }

  return [...byId.values()];
}

// ── hierarchical grouping for render ────────────────────────────────────

type FlatEntry = {
  row: ServiceRow;
  isChild: boolean;
  parentName: string | null;
};

function groupHierarchically(rows: ServiceRow[]): {
  flatRows: FlatEntry[];
} {
  const parentMap = new Map<number, ServiceRow>();
  for (const r of rows) {
    if (r.parentId === null) parentMap.set(r.id, r);
  }

  const sortByOrderThenId = (a: ServiceRow, b: ServiceRow) =>
    a.sortOrder - b.sortOrder || a.id - b.id;

  const parents = rows
    .filter((r) => r.parentId === null)
    .sort(sortByOrderThenId);

  const childrenByParent = new Map<number, ServiceRow[]>();
  const orphans: ServiceRow[] = [];
  for (const r of rows) {
    if (r.parentId === null) continue;
    if (parentMap.has(r.parentId)) {
      const list = childrenByParent.get(r.parentId) ?? [];
      list.push(r);
      childrenByParent.set(r.parentId, list);
    } else {
      orphans.push(r);
    }
  }
  for (const list of childrenByParent.values()) list.sort(sortByOrderThenId);
  orphans.sort(sortByOrderThenId);

  const flatRows: FlatEntry[] = [];
  for (const parent of parents) {
    flatRows.push({ row: parent, isChild: false, parentName: null });
    const kids = childrenByParent.get(parent.id) ?? [];
    for (const child of kids) {
      flatRows.push({
        row: child,
        isChild: true,
        parentName: parent.nameHu,
      });
    }
  }
  for (const orphan of orphans) {
    flatRows.push({
      row: orphan,
      isChild: true,
      parentName: orphan.parentId !== null ? `#${orphan.parentId}` : null,
    });
  }

  return { flatRows };
}

// ── empty state ─────────────────────────────────────────────────────────

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #E2E8F0",
        borderRadius: 6,
        padding: "60px 24px",
        textAlign: "center",
      }}
    >
      <p style={{ fontSize: 36, margin: 0, lineHeight: 1 }}>🧰</p>
      <p
        style={{
          fontSize: 16,
          fontWeight: 600,
          color: "#0B1E3E",
          marginTop: 16,
          marginBottom: 8,
        }}
      >
        {hasFilters
          ? "Nem található szolgáltatás a megadott szűrőkkel."
          : "Még nincsenek szolgáltatások."}
      </p>
      {hasFilters ? (
        <Link
          href="/admin/services"
          style={{
            color: "#D1172E",
            textDecoration: "underline",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          Szűrők törlése
        </Link>
      ) : (
        <Link
          href="/admin/services/new"
          style={{
            display: "inline-block",
            marginTop: 8,
            background: "#D1172E",
            color: "#fff",
            padding: "10px 18px",
            borderRadius: 4,
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: 0.5,
            textTransform: "uppercase",
            textDecoration: "none",
          }}
        >
          + Új szolgáltatás
        </Link>
      )}
    </div>
  );
}
