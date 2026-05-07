import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db, messages } from "@/lib/db";
import { leadStatusMeta } from "@/lib/messages-lead";
import { formatTimestampHu } from "../_components/formatRelative";
import { ArchiveButton } from "./_components/ArchiveButton";
import { LeadDetailsForm } from "./_components/LeadDetailsForm";
import { MarkAsReadOnMount } from "./_components/MarkAsReadOnMount";
import { ReplyForm } from "./_components/ReplyForm";

const LOCALE_DISPLAY: Record<string, { flag: string; label: string }> = {
  hu: { flag: "HU", label: "Magyar" },
  en: { flag: "EN", label: "English" },
  de: { flag: "DE", label: "Deutsch" },
  zh: { flag: "ZH", label: "中文" },
};

type DerivedStatus = "archived" | "replied" | "read" | "new";

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
  new: { label: "Uj", color: "#D1172E" },
  read: { label: "Olvasva", color: "#2563EB" },
  replied: { label: "Megvalaszolva", color: "#15803D" },
  archived: { label: "Archivalt", color: "#94A3B8" },
};

export default async function MessageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/admin/login");
  }

  const { id: idParam } = await params;
  const id = Number.parseInt(idParam, 10);
  if (!Number.isInteger(id) || id <= 0) notFound();

  await connection();

  const [row] = await db
    .select()
    .from(messages)
    .where(eq(messages.id, id))
    .limit(1);

  if (!row) notFound();

  const status = deriveStatus(row);
  const badge = STATUS_BADGE[status];
  const leadBadge = leadStatusMeta(row.leadStatus);
  const isUnread = row.readAt === null && row.archivedAt === null;
  const localeInfo =
    LOCALE_DISPLAY[row.locale] ?? { flag: row.locale.toUpperCase(), label: row.locale };

  return (
    <div style={{ maxWidth: 940 }}>
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
          {"<-"} Vissza az uzenetekhez
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
          <h1
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: "#0B1E3E",
              margin: 0,
            }}
          >
            Uzenet reszletei
          </h1>
          <p style={{ color: "#64748B", marginTop: 4, fontSize: 13 }}>
            ID #{row.id}
          </p>
        </div>
        <ArchiveButton
          messageId={row.id}
          isArchived={row.archivedAt !== null}
        />
      </header>

      <section style={cardStyle}>
        <h2 style={cardTitleStyle}>Adatok</h2>
        <div
          style={{
            display: "grid",
            gap: "10px 16px",
            gridTemplateColumns: "120px 1fr",
            fontSize: 14,
          }}
        >
          <Label>Nev</Label>
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

          <Label>Ceg</Label>
          <Value>{row.company ?? "-"}</Value>

          <Label>Nyelv</Label>
          <Value>
            <span style={{ marginRight: 6 }}>{localeInfo.flag}</span>
            {localeInfo.label}
          </Value>

          <Label>Beerkezes</Label>
          <Value>{formatTimestampHu(row.createdAt)}</Value>

          <Label>Statusz</Label>
          <Value>
            <Badge label={badge.label} color={badge.color} />
          </Value>

          <Label>Lead</Label>
          <Value>
            <Badge label={leadBadge.label} color={leadBadge.color} />
          </Value>
        </div>
      </section>

      <section style={cardStyle}>
        <h2 style={cardTitleStyle}>Lead pipeline</h2>
        <LeadDetailsForm
          messageId={row.id}
          initialValues={{
            leadStatus: row.leadStatus,
            leadOwnerName: row.leadOwnerName ?? "",
            leadNextActionAt: toDateTimeLocalValue(row.leadNextActionAt),
            leadNextActionNote: row.leadNextActionNote ?? "",
            leadEstimatedValue:
              row.leadEstimatedValue === null
                ? ""
                : String(row.leadEstimatedValue),
            leadSiteType: row.leadSiteType ?? "",
            leadProposalUrl: row.leadProposalUrl ?? "",
            leadContractUrl: row.leadContractUrl ?? "",
            internalNotes: row.internalNotes ?? "",
          }}
        />
      </section>

      <section style={cardStyle}>
        <h2 style={cardTitleStyle}>Uzenet</h2>
        <div
          style={{
            whiteSpace: "pre-wrap",
            fontSize: 15,
            lineHeight: 1.65,
            color: "#0B1E3E",
            fontFamily: "inherit",
          }}
        >
          {row.message ?? <em style={{ color: "#94A3B8" }}>(ures uzenet)</em>}
        </div>
      </section>

      <section
        style={{
          ...cardStyle,
          marginBottom: 0,
        }}
      >
        <h2 style={cardTitleStyle}>Valasz</h2>
        <ReplyForm
          messageId={row.id}
          recipientEmail={row.email}
          recipientName={row.name}
          recipientLocale={row.locale}
          isArchived={row.archivedAt !== null}
        />
      </section>
    </div>
  );
}

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span
      style={{
        background: `${color}1A`,
        color,
        padding: "3px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: 0.4,
        textTransform: "uppercase",
      }}
    >
      {label}
    </span>
  );
}

function toDateTimeLocalValue(value: Date | null): string {
  if (!value) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return [
    value.getFullYear(),
    "-",
    pad(value.getMonth() + 1),
    "-",
    pad(value.getDate()),
    "T",
    pad(value.getHours()),
    ":",
    pad(value.getMinutes()),
  ].join("");
}

const cardStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #E2E8F0",
  borderRadius: 6,
  padding: "20px 24px",
  marginBottom: 16,
};

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
