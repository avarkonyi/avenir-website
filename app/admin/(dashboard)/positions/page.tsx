import Link from "next/link";
import { connection } from "next/server";
import { asc, desc } from "drizzle-orm";
import { db, positions } from "@/lib/db";
import {
  PositionsFilters,
  type StatusFilter,
} from "./_components/PositionsFilters";
import {
  PositionsListView,
  type PositionsListRow,
} from "./_components/PositionsListView";

type SearchParams = Promise<{
  status?: string;
}>;

export default async function AdminPositionsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const status: StatusFilter =
    sp.status === "active" || sp.status === "inactive" ? sp.status : "all";

  await connection();

  // Single round-trip: fetch all rows in one ORDER BY query, then
  // derive both the filter-pill counts and the displayed slice in
  // JS. With the tiny N (handful of positions) the cost of any
  // alternative — separate count query, conditional WHERE — is
  // higher than the trivial filter pass below.
  const allRows = await db
    .select()
    .from(positions)
    .orderBy(
      desc(positions.active),
      asc(positions.sortOrder),
      desc(positions.createdAt),
    );

  const totalCount = allRows.length;
  const activeCount = allRows.filter((r) => r.active).length;
  const inactiveCount = totalCount - activeCount;

  const rows =
    status === "active"
      ? allRows.filter((r) => r.active)
      : status === "inactive"
        ? allRows.filter((r) => !r.active)
        : allRows;

  // Drag-to-reorder is allowed only on the unfiltered default view —
  // filtering changes which rows the operator sees, which would make
  // a drop ambiguous (which subset are we ordering?).
  const reorderEnabled = status === "all";
  const showReorderBanner = !reorderEnabled;

  // Active rows in current sortOrder — the SortableContext items array.
  // Pulled from the displayed (default-view) result so the client mirror
  // starts in the same order the server rendered.
  const activeOrderedIds = rows.filter((r) => r.active).map((r) => r.id);

  // Slim payload for the client component: drop timestamps + the
  // per-locale fields the list never displays. Avoids Date
  // serialization quirks across the boundary.
  const listRows: PositionsListRow[] = rows.map((r) => ({
    id: r.id,
    titleHu: r.titleHu,
    locationHu: r.locationHu,
    typeHu: r.typeHu,
    active: r.active,
  }));

  return (
    <div style={{ maxWidth: 1200 }}>
      <header
        style={{
          marginBottom: 24,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: "#0B1E3E", margin: 0 }}>
            Karrier
          </h1>
          <p style={{ color: "#64748B", marginTop: 4, fontSize: 14 }}>
            {activeCount} aktív pozíció
            {inactiveCount > 0 ? ` (${inactiveCount} inaktív)` : ""}
          </p>
        </div>
        <Link
          href="/admin/positions/new"
          style={{
            background: "#D1172E",
            color: "#fff",
            border: "none",
            padding: "10px 18px",
            borderRadius: 4,
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: 0.5,
            textTransform: "uppercase",
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          + Új pozíció
        </Link>
      </header>

      <PositionsFilters
        current={status}
        counts={{
          all: totalCount,
          active: activeCount,
          inactive: inactiveCount,
        }}
      />

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
          A sorrend módosításához kapcsold ki a szűrőt.
        </div>
      )}

      <PositionsListView
        rows={listRows}
        totalCount={totalCount}
        reorderEnabled={reorderEnabled}
        activeOrderedIds={activeOrderedIds}
      />
    </div>
  );
}
