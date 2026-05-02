import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db, messages } from "@/lib/db";
import { formatTimestampHu } from "../_components/formatRelative";
import { ArchiveButton } from "./_components/ArchiveButton";
import { MarkAsReadOnMount } from "./_components/MarkAsReadOnMount";

// Hungarian locale flags + label for the metadata grid. Kept in-file
// (rather than reaching into the list page's LocaleBadge helper) so
// the detail view stays self-contained.
const LOCALE_DISPLAY: Record<string, { flag: string; label: string }> = {
  hu: { flag: "🇭🇺", label: "Magyar" },
  en: { flag: "🇬🇧", label: "English" },
  de: { flag: "🇩🇪", label: "Deutsch" },
  zh: { flag: "🇨🇳", label: "中文" },
};

type DerivedStatus = "archived" | "replied" | "read" | "new";

// Derive presentational status from timestamp presence (A2 — no enum).
// Order matters: archived wins, then replied, then read.
function deriveStatus(row: {
  archivedAt: Date | null;
  repliedAt: Date | null;
  readAt: Date | null;
}): DerivedStatus {
  if (row.archivedAt) return "archived";
  if (row.repliedAt) return "replied";
  if (row.readAt) return "read";
  return "new";
}

const STATUS_BADGE: Record<DerivedStatus, { label: string; color: string }> = {
  new: { label: "Új", color: "#D1172E" },
  read: { label: "Olvasva", color: "#2563EB" },
  replied: { label: "Megválaszolva", color: "#15803D" },
  archived: { label: "Archivált", color: "#94A3B8" },
};

export default async function MessageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Defense-in-depth auth check before touching the DB. Middleware
  // (proxy.ts) gates /admin/* and the (dashboard) layout already
  // resolves a session to populate the topbar — this duplicate check
  // ensures the page-level data fetch never runs without a session
  // even if either of those layers is misconfigured.
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/admin/login");
  }

  const { id: idParam } = await params;
  const id = Number.parseInt(idParam, 10);
  if (!Number.isInteger(id) || id <= 0) notFound();

  await connection();

  // The detail view also surfaces archived messages (you might open one
  // from the future "Archivált" filter pill in Commit 4) — so the
  // archived_at IS NULL guard from earlier is intentionally dropped.
  // The reply card placeholder will be the gate for archived rows in
  // Commit 3 (form is disabled with notice on archived messages).
  const [row] = await db
    .select()
    .from(messages)
    .where(eq(messages.id, id))
    .limit(1);

  if (!row) notFound();

  const status = deriveStatus(row);
  const badge = STATUS_BADGE[status];
  const isUnread = row.readAt === null && row.archivedAt === null;
  const localeInfo =
    LOCALE_DISPLAY[row.locale] ?? { flag: "🏳️", label: row.locale };

  return (
    <div style={{ maxWidth: 880 }}>
      {/* Auto mark-as-read fires post-hydration when the message is
          unread + active. Idempotent at the DB level. */}
      <MarkAsReadOnMount messageId={row.id} isUnread={isUnread} />

      <div style={{ marginBottom: 20 }}>
        <Link
          href="/admin/messages"
          style={{
            color: "#0B1E3E",
            textDecoration: "none",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          ← Vissza az üzenetekhez
        </Link>
      </div>

      <header
        style={{
          marginBottom: 24,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#0B1E3E", margin: 0 }}>
            Üzenet részletei
          </h1>
          <p style={{ color: "#64748B", marginTop: 4, fontSize: 13 }}>
            ID #{row.id}
          </p>
        </div>
        {/* Action bar — top-right per spec. The 2-stage confirm UX
            stays from Commit 1; Commit 4 swaps it for a modal +
            unarchive flow. */}
        {row.archivedAt === null && <ArchiveButton messageId={row.id} />}
      </header>

      {/* Card 1 — Metadata */}
      <section
        style={{
          background: "#fff",
          border: "1px solid #E2E8F0",
          borderRadius: 6,
          padding: "20px 24px",
          marginBottom: 16,
        }}
      >
        <h2 style={cardTitleStyle}>Adatok</h2>
        <div
          style={{
            display: "grid",
            gap: "10px 16px",
            gridTemplateColumns: "120px 1fr",
            fontSize: 14,
          }}
        >
          <Label>Név</Label>
          <Value>{row.name}</Value>

          <Label>Email</Label>
          <Value>
            <a
              href={`mailto:${row.email}`}
              style={{ color: "#D1172E", textDecoration: "none" }}
            >
              {row.email}
            </a>
          </Value>

          <Label>Cég</Label>
          <Value>{row.company ?? "—"}</Value>

          <Label>Nyelv</Label>
          <Value>
            <span style={{ marginRight: 6 }}>{localeInfo.flag}</span>
            {localeInfo.label}
          </Value>

          <Label>Beérkezés</Label>
          <Value>{formatTimestampHu(row.createdAt)}</Value>

          <Label>Státusz</Label>
          <Value>
            <span
              style={{
                background: `${badge.color}1A`,
                color: badge.color,
                padding: "3px 10px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 0.4,
                textTransform: "uppercase",
              }}
            >
              {badge.label}
            </span>
          </Value>
        </div>
      </section>

      {/* Card 2 — Üzenet body */}
      <section
        style={{
          background: "#fff",
          border: "1px solid #E2E8F0",
          borderRadius: 6,
          padding: "20px 24px",
          marginBottom: 16,
        }}
      >
        <h2 style={cardTitleStyle}>Üzenet</h2>
        <div
          style={{
            whiteSpace: "pre-wrap",
            fontSize: 15,
            lineHeight: 1.65,
            color: "#0B1E3E",
            fontFamily: "inherit",
          }}
        >
          {row.message ?? <em style={{ color: "#94A3B8" }}>(üres üzenet)</em>}
        </div>
      </section>

      {/* Card 3 — Válasz placeholder (Commit 3 will replace) */}
      <section
        style={{
          background: "#F8FAFC",
          border: "1px dashed #CBD5E1",
          borderRadius: 6,
          padding: "20px 24px",
          color: "#64748B",
          fontSize: 13,
        }}
      >
        <h2 style={cardTitleStyle}>Válasz</h2>
        <p style={{ margin: 0 }}>
          Válasz funkció hamarosan (Iter 3B Commit 3).
        </p>
      </section>
    </div>
  );
}

const cardTitleStyle: React.CSSProperties = {
  fontSize: 12,
  letterSpacing: 0.8,
  textTransform: "uppercase",
  fontWeight: 700,
  color: "#64748B",
  margin: "0 0 12px",
};

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ color: "#64748B", fontSize: 12, fontWeight: 600 }}>
      {children}
    </span>
  );
}

function Value({ children }: { children: React.ReactNode }) {
  return <span style={{ color: "#0B1E3E", fontSize: 14 }}>{children}</span>;
}
