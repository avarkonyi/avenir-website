import { auth } from "@/auth";

// Admin dashboard. Iteration 1: empty-state cards as placeholders for
// the modules wired in subsequent iterations (Messages → Iter 2, News
// → Iter 3, etc.). The dash counts (—) become live numbers as each
// module ships.
export default async function AdminDashboard() {
  const session = await auth();

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
        {STAT_CARDS.map((card) => (
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
            <strong>Iteration 1 (jelenlegi):</strong> NextAuth M365 OAuth
            + admin shell.
          </li>
          <li>
            <strong>Iteration 2:</strong> Üzenetek inbox (DB-ből kontaktűrlap-naplók).
          </li>
          <li>
            <strong>Iteration 3:</strong> Hírek CRUD (multi-locale).
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

const STAT_CARDS = [
  { label: "Üzenetek", note: "Iteration 2 (Hamarosan)" },
  { label: "Hírek", note: "Iteration 3 (Hamarosan)" },
  { label: "Karrier pozíciók", note: "Iteration 4 (Hamarosan)" },
] as const;
