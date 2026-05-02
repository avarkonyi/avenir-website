import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { and, eq, isNull } from "drizzle-orm";
import { db, messages } from "@/lib/db";
import { markAsRead, markAsUnread } from "../_actions";
import { formatAbsoluteHu } from "../_components/formatRelative";
import { ArchiveButton } from "./_components/ArchiveButton";

export default async function MessageDetailPage({
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
    .from(messages)
    .where(and(eq(messages.id, id), isNull(messages.archivedAt)))
    .limit(1);

  if (!row) notFound();

  const isUnread = row.readAt === null;

  return (
    <div style={{ maxWidth: 880 }}>
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

      <header style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#0B1E3E", margin: 0 }}>
          Üzenet részletei
        </h1>
        <p style={{ color: "#64748B", marginTop: 4, fontSize: 13 }}>
          ID #{row.id} · Beérkezett: {formatAbsoluteHu(row.createdAt)} ·
          Nyelv: {row.locale.toUpperCase()}
          {row.readAt && (
            <>
              {" "}· Olvasva: {formatAbsoluteHu(row.readAt)}
            </>
          )}
        </p>
      </header>

      {/* Sender card */}
      <section
        style={{
          background: "#fff",
          border: "1px solid #E2E8F0",
          borderRadius: 6,
          padding: "20px 24px",
          marginBottom: 16,
        }}
      >
        <h2
          style={{
            fontSize: 12,
            letterSpacing: 0.8,
            textTransform: "uppercase",
            fontWeight: 700,
            color: "#64748B",
            margin: "0 0 12px",
          }}
        >
          Beküldő
        </h2>
        <div style={{ display: "grid", gap: 8, gridTemplateColumns: "120px 1fr", fontSize: 14 }}>
          <Label>Név</Label>
          <Value>{row.name}</Value>

          <Label>Email</Label>
          <Value>
            <a
              href={`mailto:${row.email}?subject=${encodeURIComponent(`Re: Avenir kapcsolatfelvétel (${row.locale.toUpperCase()})`)}`}
              style={{ color: "#D1172E", textDecoration: "none" }}
            >
              {row.email}
            </a>
          </Value>

          {row.phone && (
            <>
              <Label>Telefon</Label>
              <Value>
                <a
                  href={`tel:${row.phone.replace(/\s/g, "")}`}
                  style={{ color: "#D1172E", textDecoration: "none" }}
                >
                  {row.phone}
                </a>
              </Value>
            </>
          )}

          {row.company && (
            <>
              <Label>Cég</Label>
              <Value>{row.company}</Value>
            </>
          )}

          {row.service && (
            <>
              <Label>Szolgáltatás</Label>
              <Value>{row.service}</Value>
            </>
          )}
        </div>
      </section>

      {/* Message body */}
      <section
        style={{
          background: "#fff",
          border: "1px solid #E2E8F0",
          borderRadius: 6,
          padding: "20px 24px",
          marginBottom: 24,
        }}
      >
        <h2
          style={{
            fontSize: 12,
            letterSpacing: 0.8,
            textTransform: "uppercase",
            fontWeight: 700,
            color: "#64748B",
            margin: "0 0 12px",
          }}
        >
          Üzenet
        </h2>
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

      {/* Action bar */}
      <section
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <form
          action={async () => {
            "use server";
            if (isUnread) await markAsRead(row.id);
            else await markAsUnread(row.id);
          }}
        >
          <button
            type="submit"
            style={{
              background: isUnread ? "#0B1E3E" : "transparent",
              color: isUnread ? "#fff" : "#0B1E3E",
              border: `1px solid ${isUnread ? "#0B1E3E" : "#CBD5E1"}`,
              padding: "10px 18px",
              borderRadius: 4,
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: 0.5,
              textTransform: "uppercase",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            {isUnread ? "Megjelölés olvasottként" : "Visszajelölés olvasatlanra"}
          </button>
        </form>

        <a
          href={`mailto:${row.email}?subject=${encodeURIComponent(`Re: Avenir kapcsolatfelvétel (${row.locale.toUpperCase()})`)}`}
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
          Válasz emailben
        </a>

        <div style={{ flex: 1 }} />

        <ArchiveButton messageId={row.id} />
      </section>
    </div>
  );
}

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
