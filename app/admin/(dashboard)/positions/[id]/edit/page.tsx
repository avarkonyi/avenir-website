import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { eq } from "drizzle-orm";
import { db, positions } from "@/lib/db";
import {
  PositionForm,
  type PositionInitial,
} from "../../_components/PositionForm";

export default async function EditPositionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: idParam } = await params;
  // Number() is stricter than parseInt — Number("123abc") returns NaN,
  // whereas parseInt("123abc", 10) silently returns 123. The integer +
  // positive checks then catch any non-positive id.
  const numericId = Number(idParam);
  if (!Number.isInteger(numericId) || numericId <= 0) notFound();

  await connection();

  const [row] = await db
    .select()
    .from(positions)
    .where(eq(positions.id, numericId))
    .limit(1);
  if (!row) notFound();

  const initial: PositionInitial = {
    id: row.id,
    titleHu: row.titleHu,
    titleEn: row.titleEn,
    titleDe: row.titleDe,
    titleZh: row.titleZh,
    locationHu: row.locationHu,
    locationEn: row.locationEn,
    locationDe: row.locationDe,
    locationZh: row.locationZh,
    typeHu: row.typeHu,
    typeEn: row.typeEn,
    typeDe: row.typeDe,
    typeZh: row.typeZh,
    applyEmail: row.applyEmail,
    sortOrder: row.sortOrder,
    active: row.active,
  };

  return (
    <div style={{ maxWidth: 980 }}>
      <div style={{ marginBottom: 20 }}>
        <Link
          href="/admin/positions"
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
          Pozíció szerkesztése
        </h1>
        <p style={{ color: "#64748B", marginTop: 4, fontSize: 13 }}>
          ID #{row.id} · {row.active ? "aktív" : "inaktív"}
        </p>
      </header>

      <PositionForm mode="edit" initial={initial} />
    </div>
  );
}
