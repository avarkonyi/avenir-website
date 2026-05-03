import Link from "next/link";
import { connection } from "next/server";
import { asc, desc } from "drizzle-orm";
import { db, certifications } from "@/lib/db";
import {
  CertificationsListView,
  type CertificationsListRow,
} from "./_components/CertificationsListView";

// Single round-trip: fetch all rows in one ORDER BY query, then
// derive any per-status counts in JS. Mirrors PartnersListPage.
export default async function AdminCertificationsPage() {
  await connection();

  const allRows = await db
    .select()
    .from(certifications)
    .orderBy(
      desc(certifications.active),
      asc(certifications.sortOrder),
      desc(certifications.createdAt),
    );

  const totalCount = allRows.length;
  const activeCount = allRows.filter((r) => r.active).length;
  const inactiveCount = totalCount - activeCount;

  // Iter 6A: no status filter UI yet — single canonical view of all
  // certifications. Drag-reorder is enabled by default.
  const reorderEnabled = true;

  const activeOrderedIds = allRows
    .filter((r) => r.active)
    .map((r) => r.id);

  // Slim payload for the client component — drop timestamps + the
  // long localized text fields the list never renders.
  const listRows: CertificationsListRow[] = allRows.map((r) => ({
    id: r.id,
    name: r.name,
    slug: r.slug,
    fullNameHu: r.fullNameHu,
    issuer: r.issuer,
    expiresDate: r.expiresDate,
    hasPdf: r.pdfUrl !== null && r.pdfUrl.length > 0,
    isActive: r.active,
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
            Tanúsítványok
          </h1>
          <p style={{ color: "#64748B", marginTop: 4, fontSize: 14 }}>
            {activeCount} aktív tanúsítvány
            {inactiveCount > 0 ? ` (${inactiveCount} inaktív)` : ""}
          </p>
        </div>
        <Link
          href="/admin/certifications/new"
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
          + Új tanúsítvány
        </Link>
      </header>

      <CertificationsListView
        rows={listRows}
        totalCount={totalCount}
        reorderEnabled={reorderEnabled}
        activeOrderedIds={activeOrderedIds}
      />
    </div>
  );
}
