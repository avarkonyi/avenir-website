import Link from "next/link";
import { connection } from "next/server";
import { and, eq, ilike, inArray, or, type SQL } from "drizzle-orm";
import { db, services } from "@/lib/db";
import { ServicesFilters } from "./_components/ServicesFilters";
import { ServiceRowActions } from "./_components/ServiceRowActions";

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
    // No search: just base-filtered rows.
    rows = await db
      .select()
      .from(services)
      .where(baseConditions.length > 0 ? and(...baseConditions) : undefined);
  } else {
    rows = await fetchWithSearchContext(q, baseConditions);
  }

  // Total active count for the header subtitle. Counts services regardless
  // of any current filter so the operator sees catalog size at a glance.
  const totalActiveRows = await db
    .select({ id: services.id })
    .from(services)
    .where(eq(services.isActive, true));
  const totalActive = totalActiveRows.length;

  const grouped = groupHierarchically(rows);
  const hasFilters = status !== "all" || showInactive || q !== "";

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

      {grouped.flatRows.length === 0 ? (
        <EmptyState hasFilters={hasFilters} />
      ) : (
        <div
          style={{
            background: "#fff",
            border: "1px solid #E2E8F0",
            borderRadius: 6,
            overflow: "hidden",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ background: "#F8FAFC" }}>
              <tr>
                <Th>Név</Th>
                <Th>Slug</Th>
                <Th>Szülő</Th>
                <Th>Státusz</Th>
                <Th>Akciók</Th>
              </tr>
            </thead>
            <tbody>
              {grouped.flatRows.map((entry) => {
                const { row, isChild, parentName } = entry;
                return (
                  <tr
                    key={row.id}
                    style={{
                      borderTop: "1px solid #E2E8F0",
                      opacity: row.isActive ? 1 : 0.55,
                    }}
                  >
                    <Td>
                      <span
                        style={{
                          paddingLeft: isChild ? 24 : 0,
                          fontWeight: isChild ? 400 : 700,
                          color: "#0B1E3E",
                        }}
                      >
                        {isChild && (
                          <span aria-hidden style={{ color: "#94A3B8", marginRight: 6 }}>
                            ↳
                          </span>
                        )}
                        {row.nameHu}
                      </span>
                    </Td>
                    <Td>
                      <code
                        style={{
                          fontFamily: "var(--font-geist-mono, monospace)",
                          fontSize: 12,
                          color: "#64748B",
                          background: "#F1F5F9",
                          padding: "2px 6px",
                          borderRadius: 3,
                        }}
                      >
                        {row.slug}
                      </code>
                    </Td>
                    <Td>
                      <span style={{ color: "#64748B", fontSize: 13 }}>
                        {parentName ?? "—"}
                      </span>
                    </Td>
                    <Td>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {row.isPublished ? (
                          <Badge color="#15803D" label="Publikálva" />
                        ) : (
                          <Badge color="#A16207" label="Vázlat" />
                        )}
                        {!row.isActive && <Badge color="#94A3B8" label="Inaktív" />}
                        {row.isFeatured && <Badge color="#2563EB" label="Kiemelt" />}
                      </div>
                    </Td>
                    <Td>
                      <ServiceRowActions
                        serviceId={row.id}
                        isActive={row.isActive}
                      />
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── search-context helpers ──────────────────────────────────────────────

// Two-query JS merge per spec. With ~25 rows in the table the difference
// vs a single UNION CTE is academic; this version reads clearer.
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

  // Rule 1 — fetch parent context for matched children. Not gated on
  // base filters: we always want the parent visible as the anchor.
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

  // Rule 2 — for parents in primary, fetch base-filtered siblings/children.
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
  // Index parents in the result set so children can look up their
  // displayable parent name without a second DB round-trip.
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
      // Child whose parent isn't in the result set (filtered out by
      // a non-search base filter, or an unexpected DB state). Render
      // at the bottom in a flat list — Szülő column shows the parent
      // id as a fallback so the operator can investigate.
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

// ── UI bits ─────────────────────────────────────────────────────────────

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

function Th({ children }: { children?: React.ReactNode }) {
  return (
    <th
      style={{
        textAlign: "left",
        padding: "10px 12px",
        fontSize: 11,
        letterSpacing: 0.8,
        textTransform: "uppercase",
        fontWeight: 700,
        color: "#475569",
      }}
    >
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return (
    <td style={{ padding: "12px 12px", fontSize: 13, verticalAlign: "middle" }}>
      {children}
    </td>
  );
}

function Badge({ color, label }: { color: string; label: string }) {
  return (
    <span
      style={{
        background: `${color}1A`,
        color,
        padding: "2px 8px",
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: 0.4,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}
