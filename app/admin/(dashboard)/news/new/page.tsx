import Link from "next/link";
import { NewsForm } from "../_components/NewsForm";

export default function NewNewsPage() {
  return (
    <div style={{ maxWidth: 980 }}>
      <div style={{ marginBottom: 20 }}>
        <Link
          href="/admin/news"
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
          Új hír
        </h1>
        <p style={{ color: "#64748B", marginTop: 4, fontSize: 13 }}>
          A magyar cím kötelező; a többi nyelv opcionális (üres = nincs
          fordítás).
        </p>
      </header>

      <NewsForm mode="create" />
    </div>
  );
}
