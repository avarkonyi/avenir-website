import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { and, eq, isNull } from "drizzle-orm";
import { db, news } from "@/lib/db";
import { NewsForm } from "../../_components/NewsForm";
import { formatAbsoluteHu } from "../../_components/formatRelative";

export default async function EditNewsPage({
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
    .from(news)
    .where(and(eq(news.id, id), isNull(news.deletedAt)))
    .limit(1);

  if (!row) notFound();

  return (
    <div style={{ maxWidth: 980 }}>
      <div style={{ marginBottom: 20 }}>
        <Link
          href="/admin/news"
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
          Hír szerkesztése
        </h1>
        <p style={{ color: "#64748B", marginTop: 4, fontSize: 13 }}>
          ID #{row.id} · Létrehozva: {formatAbsoluteHu(row.createdAt)} ·
          Frissítve: {formatAbsoluteHu(row.updatedAt)}
        </p>
      </header>

      <NewsForm
        mode="edit"
        initial={{
          id: row.id,
          titleHu: row.titleHu,
          titleEn: row.titleEn ?? "",
          titleDe: row.titleDe ?? "",
          titleZh: row.titleZh ?? "",
          leadHu: row.leadHu,
          leadEn: row.leadEn ?? "",
          leadDe: row.leadDe ?? "",
          leadZh: row.leadZh ?? "",
          bodyHu: row.bodyHu,
          bodyEn: row.bodyEn ?? "",
          bodyDe: row.bodyDe ?? "",
          bodyZh: row.bodyZh ?? "",
          slug: row.slug,
          publishedHu: row.publishedHu,
          publishedEn: row.publishedEn,
          publishedDe: row.publishedDe,
          publishedZh: row.publishedZh,
          date: row.date.toISOString(),
          imageUrl: row.imageUrl,
        }}
      />
    </div>
  );
}
