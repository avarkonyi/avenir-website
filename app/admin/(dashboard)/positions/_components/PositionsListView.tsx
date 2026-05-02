import type { positions } from "@/lib/db";

// Pure server component. No state, no client interactivity. The
// "Szerkesztés" cell is a disabled <span> placeholder until Iter 4
// C2 wires the actual edit route.

export type PositionRow = typeof positions.$inferSelect;

type Props = {
  rows: PositionRow[];
  totalCount: number;
};

export function PositionsListView({ rows, totalCount }: Props) {
  if (rows.length === 0) {
    // Distinguish "system is truly empty" from "filter excluded
    // everything" so the operator gets the right next step.
    const message =
      totalCount === 0
        ? "Még nincsenek pozíciók a rendszerben."
        : "Nincs a szűrésnek megfelelő pozíció.";
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
        <p style={{ fontSize: 36, margin: 0, lineHeight: 1 }}>💼</p>
        <p
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: "#0B1E3E",
            marginTop: 16,
            marginBottom: 0,
          }}
        >
          {message}
        </p>
      </div>
    );
  }

  return (
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
            <Th>Név</Th>
            <Th>Helyszín</Th>
            <Th>Típus</Th>
            <Th>Státusz</Th>
            <Th>Akciók</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              style={{
                borderTop: "1px solid #E2E8F0",
                opacity: row.active ? 1 : 0.55,
              }}
            >
              <Td>
                <strong style={{ color: "#0B1E3E", fontWeight: 700 }}>
                  {row.titleHu}
                </strong>
              </Td>
              <Td>
                <span style={{ color: "#475569" }}>{row.locationHu}</span>
              </Td>
              <Td>
                <span style={{ color: "#475569" }}>{row.typeHu}</span>
              </Td>
              <Td>
                {row.active ? (
                  <Badge color="#15803D" label="Aktív" />
                ) : (
                  <Badge color="#94A3B8" label="Inaktív" />
                )}
              </Td>
              <Td>
                <span
                  title="A szerkesztés a következő commitban érkezik."
                  style={{
                    color: "#94A3B8",
                    fontWeight: 600,
                    fontSize: 13,
                    cursor: "not-allowed",
                  }}
                >
                  Szerkesztés
                </span>
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── presentational helpers ────────────────────────────────────────────

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

function Badge({ color, label }: { color: string; label: string }) {
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
