import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { eq } from "drizzle-orm";
import { db, partners } from "@/lib/db";
import {
  PartnerForm,
  type PartnerInitial,
} from "../../_components/PartnerForm";

export default async function EditPartnerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: idParam } = await params;
  const numericId = Number(idParam);
  if (!Number.isInteger(numericId) || numericId <= 0) notFound();

  await connection();

  const [row] = await db
    .select()
    .from(partners)
    .where(eq(partners.id, numericId))
    .limit(1);
  if (!row) notFound();

  const initial: PartnerInitial = {
    id: row.id,
    name: row.name,
    websiteUrl: row.websiteUrl,
    logoUrl: row.logoUrl,
    sortOrder: row.sortOrder,
    isActive: row.isActive,
    isPublished: row.isPublished,
  };

  return (
    <div style={{ maxWidth: 980 }}>
      <div style={{ marginBottom: 20 }}>
        <Link
          href="/admin/partners"
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
          Partner szerkesztése
        </h1>
        <p style={{ color: "#64748B", marginTop: 4, fontSize: 13 }}>
          ID #{row.id} · slug:{" "}
          <code style={{ fontFamily: "var(--font-geist-mono, monospace)" }}>
            {row.slug}
          </code>{" "}
          · {row.isActive ? "aktív" : "inaktív"} ·{" "}
          {row.isPublished ? "publikálva" : "vázlat"}
        </p>
      </header>

      <PartnerForm mode="edit" initial={initial} />
    </div>
  );
}
