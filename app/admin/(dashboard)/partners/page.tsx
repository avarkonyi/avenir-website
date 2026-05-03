import Link from "next/link";
import { connection } from "next/server";
import { asc, desc } from "drizzle-orm";
import { db, partners } from "@/lib/db";
import {
  PartnersListView,
  type PartnersListRow,
} from "./_components/PartnersListView";

// Single round-trip: fetch all rows in one ORDER BY query, then
// derive any per-status counts in JS. Mirrors PositionsListPage.
export default async function AdminPartnersPage() {
  await connection();

  const allRows = await db
    .select()
    .from(partners)
    .orderBy(
      desc(partners.isActive),
      asc(partners.sortOrder),
      desc(partners.createdAt),
    );

  const totalCount = allRows.length;
  const activeCount = allRows.filter((r) => r.isActive).length;
  const inactiveCount = totalCount - activeCount;

  // Iter 5: no status filter UI yet — single canonical view of all
  // partners. Drag-reorder is enabled by default; if a status filter
  // gets added later, mirror the Positions pattern (reorder allowed
  // only on the unfiltered view).
  const reorderEnabled = true;

  // Active rows in current sortOrder — the SortableContext items
  // array. Pulled from the displayed result so the client mirror
  // starts in the same order the server rendered.
  const activeOrderedIds = allRows
    .filter((r) => r.isActive)
    .map((r) => r.id);

  // Slim payload for the client component — drop timestamps to
  // avoid Date serialization quirks across the boundary.
  const listRows: PartnersListRow[] = allRows.map((r) => ({
    id: r.id,
    name: r.name,
    slug: r.slug,
    logoUrl: r.logoUrl,
    websiteUrl: r.websiteUrl,
    isActive: r.isActive,
    isPublished: r.isPublished,
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
            Partnerek
          </h1>
          <p style={{ color: "#64748B", marginTop: 4, fontSize: 14 }}>
            {activeCount} aktív partner
            {inactiveCount > 0 ? ` (${inactiveCount} inaktív)` : ""}
          </p>
        </div>
        <Link
          href="/admin/partners/new"
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
          + Új partner
        </Link>
      </header>

      <PartnersListView
        rows={listRows}
        totalCount={totalCount}
        reorderEnabled={reorderEnabled}
        activeOrderedIds={activeOrderedIds}
      />
    </div>
  );
}
