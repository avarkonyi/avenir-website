import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { eq } from "drizzle-orm";
import { db, certifications } from "@/lib/db";
import {
  CertificationForm,
  type CertificationInitial,
} from "../../_components/CertificationForm";

export default async function EditCertificationPage({
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
    .from(certifications)
    .where(eq(certifications.id, numericId))
    .limit(1);
  if (!row) notFound();

  const initial: CertificationInitial = {
    id: row.id,
    name: row.name,
    standardCode: row.standardCode,
    certificateNumber: row.certificateNumber,

    fullNameHu: row.fullNameHu,
    fullNameEn: row.fullNameEn,
    fullNameDe: row.fullNameDe,
    fullNameZh: row.fullNameZh,

    descriptionHu: row.descriptionHu,
    descriptionEn: row.descriptionEn,
    descriptionDe: row.descriptionDe,
    descriptionZh: row.descriptionZh,

    scopeHu: row.scopeHu,
    scopeEn: row.scopeEn,
    scopeDe: row.scopeDe,
    scopeZh: row.scopeZh,

    issuer: row.issuer,
    issuerUrl: row.issuerUrl,
    accreditationBody: row.accreditationBody,
    accreditationNumber: row.accreditationNumber,
    iafMlaMember: row.iafMlaMember,
    verifyUrl: row.verifyUrl,

    issuedDate: row.issuedDate,
    expiresDate: row.expiresDate,

    credentialCategory: row.credentialCategory,

    logoUrl: row.logoUrl,
    pdfUrl: row.pdfUrl,

    sortOrder: row.sortOrder,
    active: row.active,
    isPublished: row.isPublished,
  };

  return (
    <div style={{ maxWidth: 980 }}>
      <div style={{ marginBottom: 20 }}>
        <Link
          href="/admin/certifications"
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
          Tanúsítvány szerkesztése
        </h1>
        <p style={{ color: "#64748B", marginTop: 4, fontSize: 13 }}>
          ID #{row.id} · slug:{" "}
          <code style={{ fontFamily: "var(--font-geist-mono, monospace)" }}>
            {row.slug}
          </code>{" "}
          · {row.active ? "aktív" : "inaktív"} ·{" "}
          {row.isPublished ? "publikálva" : "vázlat"}
        </p>
      </header>

      <CertificationForm mode="edit" initial={initial} />
    </div>
  );
}
