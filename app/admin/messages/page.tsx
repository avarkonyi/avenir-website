import Link from "next/link";
import { connection } from "next/server";
import { and, desc, eq, ilike, isNotNull, isNull, or, sql } from "drizzle-orm";
import { db, messages } from "@/lib/db";
import { MessagesFilters } from "./_components/MessagesFilters";
import { formatRelativeHu, formatAbsoluteHu } from "./_components/formatRelative";

const PAGE_SIZE = 50;

type SearchParams = Promise<{
  status?: string;
  locale?: string;
  q?: string;
}>;

export default async function MessagesListPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const status = sp.status === "read" || sp.status === "unread" ? sp.status : undefined;
  const locale = ["hu", "en", "de", "zh"].includes(sp.locale ?? "")
    ? sp.locale
    : undefined;
  const q = (sp.q ?? "").trim();

  await connection();

  // Build the WHERE clause incrementally. Always exclude soft-deleted.
  const conditions = [isNull(messages.deletedAt)];
  if (status === "unread") conditions.push(isNull(messages.readAt));
  if (status === "read") conditions.push(isNotNull(messages.readAt));
  if (locale) conditions.push(eq(messages.locale, locale));
  if (q) {
    const pattern = `%${q}%`;
    const search = or(
      ilike(messages.name, pattern),
      ilike(messages.email, pattern),
      ilike(messages.message, pattern),
    );
    if (search) conditions.push(search);
  }

  const rows = await db
    .select({
      id: messages.id,
      name: messages.name,
      company: messages.company,
      email: messages.email,
      message: messages.message,
      locale: messages.locale,
      readAt: messages.readAt,
      createdAt: messages.createdAt,
    })
    .from(messages)
    .where(and(...conditions))
    .orderBy(desc(messages.createdAt))
    .limit(PAGE_SIZE);

  const totalActive = await db
    .select({ value: sql<number>`count(*)::int` })
    .from(messages)
    .where(isNull(messages.deletedAt));

  const total = totalActive[0]?.value ?? 0;
  const filteredCount = rows.length;
  const hasFilters = !!status || !!locale || !!q;

  return (
    <div style={{ maxWidth: 1200 }}>
      <header style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#0B1E3E", margin: 0 }}>
          Üzenetek
        </h1>
        <p style={{ color: "#64748B", marginTop: 4, fontSize: 14 }}>
          {hasFilters
            ? `${filteredCount} találat (${total} összesen)`
            : `${total} üzenet`}
        </p>
      </header>

      <MessagesFilters />

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
                <Th>Beérkezés</Th>
                <Th>Név</Th>
                <Th>Email</Th>
                <Th>Cég</Th>
                <Th>Nyelv</Th>
                <Th>Üzenet</Th>
                <Th>Státusz</Th>
                <Th></Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((m) => {
                const unread = m.readAt === null;
                const snippet = (m.message ?? "").slice(0, 90);
                const truncated = (m.message ?? "").length > 90;
                return (
                  <tr
                    key={m.id}
                    style={{
                      borderTop: "1px solid #E2E8F0",
                      background: unread ? "rgba(209,23,46,0.02)" : "#fff",
                    }}
                  >
                    <Td>
                      <span
                        title={formatAbsoluteHu(m.createdAt)}
                        style={{ color: "#64748B", fontSize: 12 }}
                      >
                        {formatRelativeHu(m.createdAt)}
                      </span>
                    </Td>
                    <Td>
                      <span style={{ fontWeight: unread ? 600 : 400 }}>
                        {m.name}
                      </span>
                    </Td>
                    <Td>
                      <a
                        href={`mailto:${m.email}`}
                        style={{ color: "#0B1E3E", textDecoration: "none" }}
                      >
                        {m.email}
                      </a>
                    </Td>
                    <Td>
                      <span style={{ color: "#64748B" }}>
                        {m.company ?? "—"}
                      </span>
                    </Td>
                    <Td>
                      <LocaleBadge locale={m.locale} />
                    </Td>
                    <Td>
                      <span style={{ color: "#475569", fontSize: 13 }}>
                        {snippet}
                        {truncated && "…"}
                      </span>
                    </Td>
                    <Td>
                      {unread ? (
                        <span style={statusPill("#D1172E")}>📬 Új</span>
                      ) : (
                        <span style={statusPill("#94A3B8")}>👁 Olvasva</span>
                      )}
                    </Td>
                    <Td>
                      <Link
                        href={`/admin/messages/${m.id}`}
                        style={{
                          color: "#0B1E3E",
                          textDecoration: "none",
                          fontWeight: 600,
                          fontSize: 13,
                        }}
                      >
                        Megtekint →
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
          Csak az első {PAGE_SIZE} üzenet látható. Pontosítsd a szűrést a
          régebbi tételekhez (lapozás Iter 2.x).
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
      <p style={{ fontSize: 36, margin: 0, lineHeight: 1 }}>📭</p>
      <p
        style={{
          fontSize: 16,
          fontWeight: 600,
          color: "#0B1E3E",
          marginTop: 16,
          marginBottom: 4,
        }}
      >
        {hasFilters ? "Nincs találat a szűrésre." : "Még nincs beérkezett üzenet."}
      </p>
      {hasFilters && (
        <Link
          href="/admin/messages"
          style={{
            color: "#D1172E",
            textDecoration: "underline",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          Szűrők törlése
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
    <td style={{ padding: "12px 12px", fontSize: 13, verticalAlign: "top" }}>
      {children}
    </td>
  );
}

function LocaleBadge({ locale }: { locale: string }) {
  const map: Record<string, string> = {
    hu: "🇭🇺",
    en: "🇬🇧",
    de: "🇩🇪",
    zh: "🇨🇳",
  };
  return (
    <span
      style={{
        background: "#F1F5F9",
        color: "#0B1E3E",
        padding: "2px 8px",
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: 0.5,
      }}
    >
      {map[locale] ?? "🏳️"} {locale.toUpperCase()}
    </span>
  );
}

function statusPill(color: string): React.CSSProperties {
  return {
    background: `${color}1A`,
    color,
    padding: "2px 8px",
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 0.4,
  };
}
