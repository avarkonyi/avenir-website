import Link from "next/link";
import { connection } from "next/server";
import { PositionForm } from "../_components/PositionForm";

export default async function NewPositionPage() {
  await connection();

  return (
    <div style={{ maxWidth: 980 }}>
      <div style={{ marginBottom: 20 }}>
        <Link
          href="/admin/positions"
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
          Új pozíció
        </h1>
        <p style={{ color: "#64748B", marginTop: 4, fontSize: 13 }}>
          Mind a 4 nyelven (HU/EN/DE/ZH) kötelező megadni a pozíció
          megnevezését, helyszínét és típusát.
        </p>
      </header>

      <PositionForm mode="create" />
    </div>
  );
}
