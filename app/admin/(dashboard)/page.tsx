import Link from "next/link";
import { connection } from "next/server";
import { and, eq, isNull, or, sql } from "drizzle-orm";
import { auth } from "@/auth";
import { db, messages, news } from "@/lib/db";

// Admin dashboard. Iter 2: Üzenetek live counts. Iter 3A: Hírek card
// linked to the news inbox with total + published/draft split.
// "Published" here = at least one locale_X published.
export default async function AdminDashboard() {
  const session = await auth();

  await connection();
  const [{ value: totalMessages }] = await db
    .select({ value: sql<number>`count(*)::int` })
    .from(messages)
    .where(isNull(messages.archivedAt));
  const [{ value: unreadMessages }] = await db
    .select({ value: sql<number>`count(*)::int` })
    .from(messages)
    .where(and(isNull(messages.readAt), isNull(messages.archivedAt)));

  const [{ value: totalNews }] = await db
    .select({ value: sql<number>`count(*)::int` })
    .from(news)
    .where(isNull(news.deletedAt));

  const anyPublished = or(
    eq(news.publishedHu, true),
    eq(news.publishedEn, true),
    eq(news.publishedDe, true),
    eq(news.publishedZh, true),
  );
  const [{ value: publishedNews }] = await db
    .select({ value: sql<number>`count(*)::int` })
    .from(news)
    .where(
      anyPublished
        ? and(isNull(news.deletedAt), anyPublished)
        : isNull(news.deletedAt),
    );
  const draftNews = totalNews - publishedNews;

  return (
    <div style={{ maxWidth: 1100 }}>
      <header style={{ marginBottom: 32 }}>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: "#0B1E3E",
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          Vezérlőpult
        </h1>
        <p style={{ color: "#64748B", marginTop: 4, fontSize: 14 }}>
          Üdvözöljük, {session?.user?.name ?? session?.user?.email ?? "Admin"}.
        </p>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 16,
        }}
      >
        {/* Üzenetek — live, clickable */}
        <Link
          href="/admin/messages"
          style={{
            textDecoration: "none",
            background: "#fff",
            border: "1px solid #E2E8F0",
            borderRadius: 6,
            padding: "20px 24px",
            boxShadow: "0 1px 2px rgba(11,30,62,0.04)",
            transition: "border-color 0.15s ease, box-shadow 0.15s ease",
            display: "block",
          }}
        >
          <h3
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#64748B",
              textTransform: "uppercase",
              letterSpacing: 0.8,
              margin: 0,
            }}
          >
            Üzenetek
          </h3>
          <p
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: "#0B1E3E",
              margin: "8px 0 4px",
              lineHeight: 1,
            }}
          >
            {totalMessages}
          </p>
          <p style={{ fontSize: 12, color: "#475569", margin: 0 }}>
            {unreadMessages > 0 ? (
              <>
                <span style={{ color: "#D1172E", fontWeight: 700 }}>
                  {unreadMessages} olvasatlan
                </span>
                {" · "}
                <span>összesen</span>
              </>
            ) : (
              <span>Mind olvasva ✓</span>
            )}
          </p>
        </Link>

        {/* Hírek — live, clickable */}
        <Link
          href="/admin/news"
          style={{
            textDecoration: "none",
            background: "#fff",
            border: "1px solid #E2E8F0",
            borderRadius: 6,
            padding: "20px 24px",
            boxShadow: "0 1px 2px rgba(11,30,62,0.04)",
            transition: "border-color 0.15s ease, box-shadow 0.15s ease",
            display: "block",
          }}
        >
          <h3
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#64748B",
              textTransform: "uppercase",
              letterSpacing: 0.8,
              margin: 0,
            }}
          >
            Hírek
          </h3>
          <p
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: "#0B1E3E",
              margin: "8px 0 4px",
              lineHeight: 1,
            }}
          >
            {totalNews}
          </p>
          <p style={{ fontSize: 12, color: "#475569", margin: 0 }}>
            {totalNews === 0 ? (
              <span>Még nincs hír</span>
            ) : (
              <>
                <span style={{ color: "#15803D", fontWeight: 700 }}>
                  {publishedNews} publikálva
                </span>
                {" · "}
                <span style={{ color: "#A16207", fontWeight: 700 }}>
                  {draftNews} vázlat
                </span>
              </>
            )}
          </p>
        </Link>

        {/* Karrier pozíciók — Iter 4 placeholder */}
        {STAT_CARDS_PENDING.map((card) => (
          <div
            key={card.label}
            style={{
              background: "#fff",
              border: "1px solid #E2E8F0",
              borderRadius: 6,
              padding: "20px 24px",
              boxShadow: "0 1px 2px rgba(11,30,62,0.04)",
            }}
          >
            <h3
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#64748B",
                textTransform: "uppercase",
                letterSpacing: 0.8,
                margin: 0,
              }}
            >
              {card.label}
            </h3>
            <p
              style={{
                fontSize: 32,
                fontWeight: 700,
                color: "#0B1E3E",
                margin: "8px 0 4px",
                lineHeight: 1,
              }}
            >
              —
            </p>
            <p style={{ fontSize: 12, color: "#94A3B8", margin: 0 }}>
              {card.note}
            </p>
          </div>
        ))}
      </div>

      <section
        style={{
          marginTop: 40,
          padding: "20px 24px",
          background: "#fff",
          border: "1px solid #E2E8F0",
          borderRadius: 6,
        }}
      >
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0B1E3E", margin: 0 }}>
          Phase 2 ütemezés
        </h2>
        <ol
          style={{
            margin: "12px 0 0",
            paddingLeft: 20,
            color: "#475569",
            fontSize: 13,
            lineHeight: 1.7,
          }}
        >
          <li>
            <strong>Iteration 1:</strong> NextAuth M365 OAuth + admin shell
            ✓
          </li>
          <li>
            <strong>Iteration 2:</strong> Üzenetek inbox CRUD ✓
          </li>
          <li>
            <strong>Iteration 3A (jelenlegi):</strong> Hírek CRUD multi-locale
            (kép + Markdown szerkesztő hamarosan) ✓
          </li>
          <li>
            <strong>Iteration 3B:</strong> Vercel Blob képfeltöltés +
            Markdown szerkesztő/előnézet.
          </li>
          <li>
            <strong>Iteration 4+:</strong> Karrier, partnerek, tanúsítványok,
            beállítások, audit-log.
          </li>
        </ol>
      </section>
    </div>
  );
}

const STAT_CARDS_PENDING = [
  { label: "Karrier pozíciók", note: "Iteration 4 (Hamarosan)" },
] as const;
