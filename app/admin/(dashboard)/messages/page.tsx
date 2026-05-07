import Link from "next/link";
import { connection } from "next/server";
import { and, desc, eq, ilike, isNotNull, isNull, or, sql } from "drizzle-orm";
import { db, messages } from "@/lib/db";
import { isLeadStatus, leadStatusMeta } from "@/lib/messages-lead";
import { MessagesFilters } from "./_components/MessagesFilters";
import { formatAbsoluteHu, formatRelativeHu } from "./_components/formatRelative";

const PAGE_SIZE = 50;

const STATUS_KEYS = [
  "olvasatlan",
  "olvasott",
  "megvalaszolt",
  "archivalt",
] as const;

type StatusKey = (typeof STATUS_KEYS)[number] | "mind";

type SearchParams = Promise<{
  status?: string;
  locale?: string;
  lead?: string;
  q?: string;
}>;

export default async function MessagesListPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const rawStatus = sp.status ?? "";
  const status: StatusKey = (STATUS_KEYS as readonly string[]).includes(
    rawStatus,
  )
    ? (rawStatus as StatusKey)
    : "mind";
  const locale = ["hu", "en", "de", "zh"].includes(sp.locale ?? "")
    ? sp.locale
    : undefined;
  const lead = isLeadStatus(sp.lead ?? "") ? sp.lead : undefined;
  const q = (sp.q ?? "").trim();

  await connection();

  const conditions = [];
  if (status === "mind") {
    conditions.push(isNull(messages.archivedAt));
  } else if (status === "olvasatlan") {
    conditions.push(isNull(messages.readAt), isNull(messages.archivedAt));
  } else if (status === "olvasott") {
    conditions.push(
      isNotNull(messages.readAt),
      isNull(messages.repliedAt),
      isNull(messages.archivedAt),
    );
  } else if (status === "megvalaszolt") {
    conditions.push(isNotNull(messages.repliedAt), isNull(messages.archivedAt));
  } else if (status === "archivalt") {
    conditions.push(isNotNull(messages.archivedAt));
  }
  if (locale) conditions.push(eq(messages.locale, locale));
  if (lead) conditions.push(eq(messages.leadStatus, lead));
  if (q) {
    const pattern = `%${q}%`;
    const search = or(
      ilike(messages.name, pattern),
      ilike(messages.email, pattern),
      ilike(messages.company, pattern),
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
      repliedAt: messages.repliedAt,
      archivedAt: messages.archivedAt,
      createdAt: messages.createdAt,
      leadStatus: messages.leadStatus,
      leadOwnerName: messages.leadOwnerName,
      leadNextActionAt: messages.leadNextActionAt,
    })
    .from(messages)
    .where(and(...conditions))
    .orderBy(desc(messages.createdAt))
    .limit(PAGE_SIZE);

  const totalActive = await db
    .select({ value: sql<number>`count(*)::int` })
    .from(messages)
    .where(isNull(messages.archivedAt));

  const total = totalActive[0]?.value ?? 0;
  const filteredCount = rows.length;
  const hasFilters = status !== "mind" || !!locale || !!lead || !!q;

  return (
    <div style={{ maxWidth: 1240 }}>
      <header style={{ marginBottom: 24 }}>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: "#0B1E3E",
            margin: 0,
          }}
        >
          Uzenetek es leadek
        </h1>
        <p style={{ color: "#64748B", marginTop: 4, fontSize: 14 }}>
          {hasFilters
            ? `${filteredCount} talalat (${total} aktiv osszesen)`
            : `${total} aktiv uzenet`}
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
                <Th>Beerkezes</Th>
                <Th>Nev</Th>
                <Th>Ceg</Th>
                <Th>Lead</Th>
                <Th>Kovetkezo</Th>
                <Th>Nyelv</Th>
                <Th>Uzenet</Th>
                <Th>Inbox</Th>
                <Th></Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((m) => {
                const derived = deriveStatus(m);
                const unread = derived === "uj";
                const isArchived = derived === "archivalt";
                const snippet = (m.message ?? "").slice(0, 80);
                const truncated = (m.message ?? "").length > 80;
                return (
                  <tr
                    key={m.id}
                    style={{
                      borderTop: "1px solid #E2E8F0",
                      background: unread
                        ? "rgba(209,23,46,0.02)"
                        : isArchived
                          ? "rgba(100,116,139,0.04)"
                          : "#fff",
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
                      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <span style={{ fontWeight: unread ? 700 : 600 }}>
                          {m.name}
                        </span>
                        <a
                          href={`mailto:${m.email}`}
                          style={{
                            color: "#64748B",
                            textDecoration: "none",
                            fontSize: 12,
                          }}
                        >
                          {m.email}
                        </a>
                      </div>
                    </Td>
                    <Td>
                      <span style={{ color: "#64748B" }}>
                        {m.company ?? "-"}
                      </span>
                    </Td>
                    <Td>
                      <LeadPill status={m.leadStatus} owner={m.leadOwnerName} />
                    </Td>
                    <Td>
                      <NextAction value={m.leadNextActionAt} />
                    </Td>
                    <Td>
                      <LocaleBadge locale={m.locale} />
                    </Td>
                    <Td>
                      <span style={{ color: "#475569", fontSize: 13 }}>
                        {snippet}
                        {truncated && "..."}
                      </span>
                    </Td>
                    <Td>
                      <StatusPill status={derived} />
                    </Td>
                    <Td>
                      <Link
                        href={`/admin/messages/${m.id}`}
                        style={{
                          color: "#0B1E3E",
                          textDecoration: "none",
                          fontWeight: 700,
                          fontSize: 13,
                          whiteSpace: "nowrap",
                        }}
                      >
                        Megtekint -&gt;
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
          Csak az elso {PAGE_SIZE} uzenet lathato. Pontositsd a szurest a
          regebbi tetelekhez.
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
      <p
        style={{
          fontSize: 16,
          fontWeight: 600,
          color: "#0B1E3E",
          margin: 0,
        }}
      >
        {hasFilters ? "Nincs talalat a szuresre." : "Meg nincs beerkezett uzenet."}
      </p>
      {hasFilters && (
        <Link
          href="/admin/messages"
          style={{
            color: "#D1172E",
            textDecoration: "underline",
            fontSize: 13,
            fontWeight: 600,
            display: "inline-block",
            marginTop: 10,
          }}
        >
          Szurok torlese
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
  return (
    <span
      style={{
        background: "#F1F5F9",
        color: "#0B1E3E",
        padding: "2px 8px",
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: 0.5,
      }}
    >
      {locale.toUpperCase()}
    </span>
  );
}

function LeadPill({
  status,
  owner,
}: {
  status: string;
  owner: string | null;
}) {
  const meta = leadStatusMeta(status);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <span
        style={{
          background: `${meta.color}1A`,
          color: meta.color,
          padding: "2px 8px",
          borderRadius: 999,
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: 0.4,
          whiteSpace: "nowrap",
          width: "fit-content",
        }}
      >
        {meta.shortLabel}
      </span>
      {owner && (
        <span style={{ color: "#64748B", fontSize: 11 }}>{owner}</span>
      )}
    </div>
  );
}

function NextAction({ value }: { value: Date | null }) {
  if (!value) return <span style={{ color: "#94A3B8" }}>-</span>;
  return (
    <span
      title={formatAbsoluteHu(value)}
      style={{ color: "#0B1E3E", fontSize: 12, fontWeight: 600 }}
    >
      {formatRelativeHu(value)}
    </span>
  );
}

type DerivedRowStatus = "uj" | "olvasva" | "megvalaszolva" | "archivalt";

function deriveStatus(row: {
  archivedAt: Date | null;
  repliedAt: Date | null;
  readAt: Date | null;
}): DerivedRowStatus {
  if (row.archivedAt) return "archivalt";
  if (row.repliedAt) return "megvalaszolva";
  if (row.readAt) return "olvasva";
  return "uj";
}

const STATUS_PILL: Record<
  DerivedRowStatus,
  { label: string; color: string }
> = {
  uj: { label: "Uj", color: "#D1172E" },
  olvasva: { label: "Olvasva", color: "#2563EB" },
  megvalaszolva: { label: "Megvalaszolva", color: "#15803D" },
  archivalt: { label: "Archivalt", color: "#64748B" },
};

function StatusPill({ status }: { status: DerivedRowStatus }) {
  const { label, color } = STATUS_PILL[status];
  return (
    <span
      style={{
        background: `${color}1A`,
        color,
        padding: "2px 8px",
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: 0.4,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}
