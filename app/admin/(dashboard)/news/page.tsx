import Link from "next/link";
import { connection } from "next/server";
import {
  and,
  desc,
  eq,
  ilike,
  isNotNull,
  isNull,
  or,
  sql,
} from "drizzle-orm";
import { db, news } from "@/lib/db";
import { NewsFilters } from "./_components/NewsFilters";
import { formatAbsoluteHu, formatRelativeHu } from "./_components/formatRelative";

const PAGE_SIZE = 50;

type Locale = "hu" | "en" | "de" | "zh";
const LOCALES: readonly Locale[] = ["hu", "en", "de", "zh"];

type SearchParams = Promise<{
  status?: string;
  locale?: string;
  q?: string;
}>;

export default async function NewsListPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const status =
    sp.status === "draft" || sp.status === "published" ? sp.status : undefined;
  const locale = LOCALES.includes((sp.locale ?? "") as Locale)
    ? (sp.locale as Locale)
    : undefined;
  const q = (sp.q ?? "").trim();

  await connection();

  const conditions = [isNull(news.deletedAt)];

  if (status === "draft") {
    conditions.push(eq(news.publishedHu, false));
    conditions.push(eq(news.publishedEn, false));
    conditions.push(eq(news.publishedDe, false));
    conditions.push(eq(news.publishedZh, false));
  } else if (status === "published") {
    const anyPublished = or(
      eq(news.publishedHu, true),
      eq(news.publishedEn, true),
      eq(news.publishedDe, true),
      eq(news.publishedZh, true),
    );
    if (anyPublished) conditions.push(anyPublished);
  }

  if (locale === "hu") conditions.push(isNotNull(news.titleHu));
  if (locale === "en") conditions.push(isNotNull(news.titleEn));
  if (locale === "de") conditions.push(isNotNull(news.titleDe));
  if (locale === "zh") conditions.push(isNotNull(news.titleZh));

  if (q) {
    const pattern = `%${q}%`;
    const search = or(
      ilike(news.titleHu, pattern),
      ilike(news.leadHu, pattern),
    );
    if (search) conditions.push(search);
  }

  const rows = await db
    .select({
      id: news.id,
      slug: news.slug,
      titleHu: news.titleHu,
      titleEn: news.titleEn,
      titleDe: news.titleDe,
      titleZh: news.titleZh,
      publishedHu: news.publishedHu,
      publishedEn: news.publishedEn,
      publishedDe: news.publishedDe,
      publishedZh: news.publishedZh,
      imageUrl: news.imageUrl,
      date: news.date,
      updatedAt: news.updatedAt,
    })
    .from(news)
    .where(and(...conditions))
    .orderBy(desc(news.updatedAt))
    .limit(PAGE_SIZE);

  const totalActive = await db
    .select({ value: sql<number>`count(*)::int` })
    .from(news)
    .where(isNull(news.deletedAt));

  const total = totalActive[0]?.value ?? 0;
  const filteredCount = rows.length;
  const hasFilters = !!status || !!locale || !!q;

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
            Hírek
          </h1>
          <p style={{ color: "#64748B", marginTop: 4, fontSize: 14 }}>
            {hasFilters
              ? `${filteredCount} találat (${total} összesen)`
              : `${total} hír`}
          </p>
        </div>
        <Link
          href="/admin/news/new"
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
          + Új hír
        </Link>
      </header>

      <NewsFilters />

      {rows.length === 0 ? (
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
                <Th></Th>
                <Th>Cím</Th>
                <Th>Slug</Th>
                <Th>Nyelvek</Th>
                <Th>Frissítve</Th>
                <Th></Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((n) => {
                const titles: Record<Locale, string | null> = {
                  hu: n.titleHu,
                  en: n.titleEn,
                  de: n.titleDe,
                  zh: n.titleZh,
                };
                const published: Record<Locale, boolean> = {
                  hu: n.publishedHu,
                  en: n.publishedEn,
                  de: n.publishedDe,
                  zh: n.publishedZh,
                };
                const updatedAt = n.updatedAt ?? n.date;
                return (
                  <tr
                    key={n.id}
                    style={{ borderTop: "1px solid #E2E8F0", background: "#fff" }}
                  >
                    <Td>
                      <CoverThumb url={n.imageUrl} />
                    </Td>
                    <Td>
                      <span style={{ fontWeight: 600, color: "#0B1E3E" }}>
                        {n.titleHu}
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
                        {n.slug}
                      </code>
                    </Td>
                    <Td>
                      <div style={{ display: "flex", gap: 6 }}>
                        {LOCALES.map((loc) => (
                          <LocaleBadge
                            key={loc}
                            locale={loc}
                            hasContent={!!titles[loc]}
                            isPublished={published[loc]}
                          />
                        ))}
                      </div>
                    </Td>
                    <Td>
                      <span
                        title={formatAbsoluteHu(updatedAt)}
                        style={{ color: "#64748B", fontSize: 12 }}
                      >
                        {formatRelativeHu(updatedAt)}
                      </span>
                    </Td>
                    <Td>
                      <Link
                        href={`/admin/news/${n.id}/edit`}
                        style={{
                          color: "#0B1E3E",
                          textDecoration: "none",
                          fontWeight: 600,
                          fontSize: 13,
                        }}
                      >
                        Szerkesztés →
                      </Link>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {rows.length === PAGE_SIZE && (
        <p
          style={{
            marginTop: 16,
            fontSize: 12,
            color: "#94A3B8",
            fontStyle: "italic",
          }}
        >
          Csak az első {PAGE_SIZE} hír látható. Pontosítsd a szűrést a
          régebbi tételekhez (lapozás későbbi iterációban).
        </p>
      )}
    </div>
  );
}

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
      <p style={{ fontSize: 36, margin: 0, lineHeight: 1 }}>📰</p>
      <p
        style={{
          fontSize: 16,
          fontWeight: 600,
          color: "#0B1E3E",
          marginTop: 16,
          marginBottom: 4,
        }}
      >
        {hasFilters ? "Nincs találat a szűrésre." : "Még nincs hír."}
      </p>
      <p style={{ color: "#64748B", fontSize: 13, marginTop: 4 }}>
        {hasFilters ? (
          <Link
            href="/admin/news"
            style={{
              color: "#D1172E",
              textDecoration: "underline",
              fontWeight: 600,
            }}
          >
            Szűrők törlése
          </Link>
        ) : (
          "Hozz létre egy új hírt a fenti gombbal."
        )}
      </p>
    </div>
  );
}

const coverImgStyle: React.CSSProperties = {
  width: 40,
  height: 40,
  objectFit: "cover",
  borderRadius: 4,
  background: "#F1F5F9",
  display: "block",
};

function CoverThumb({ url }: { url: string | null }) {
  // Iter 3A: Vercel Blob upload comes in 3B. For now we honour any
  // `image_url` that may already exist (seeded rows can have one) but
  // render a placeholder when it's null.
  if (url) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={url} alt="" style={coverImgStyle} />;
  }
  return (
    <div
      style={{
        width: 40,
        height: 40,
        borderRadius: 4,
        background: "#E2E8F0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#94A3B8",
        fontSize: 14,
      }}
      aria-hidden
    >
      📰
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

function LocaleBadge({
  locale,
  hasContent,
  isPublished,
}: {
  locale: Locale;
  hasContent: boolean;
  isPublished: boolean;
}) {
  let bg = "#F1F5F9";
  let color = "#94A3B8";
  let glyph = "—";
  let title = `${locale.toUpperCase()}: nincs fordítás`;

  if (hasContent && isPublished) {
    bg = "rgba(34,197,94,0.12)";
    color = "#15803D";
    glyph = "✓";
    title = `${locale.toUpperCase()}: publikálva`;
  } else if (hasContent && !isPublished) {
    bg = "rgba(234,179,8,0.15)";
    color = "#A16207";
    glyph = "●";
    title = `${locale.toUpperCase()}: vázlat`;
  }

  return (
    <span
      title={title}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        background: bg,
        color,
        padding: "2px 8px",
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: 0.4,
      }}
    >
      <span>{locale.toUpperCase()}</span>
      <span aria-hidden>{glyph}</span>
    </span>
  );
}
