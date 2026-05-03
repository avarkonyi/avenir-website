import Link from "next/link";
import { connection } from "next/server";
import { CertificationForm } from "../_components/CertificationForm";

export default async function NewCertificationPage() {
  await connection();

  return (
    <div style={{ maxWidth: 980 }}>
      <div style={{ marginBottom: 20 }}>
        <Link
          href="/admin/certifications"
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
          Új tanúsítvány
        </h1>
        <p style={{ color: "#64748B", marginTop: 4, fontSize: 13 }}>
          A teljes cím mind a 4 nyelven (HU/EN/DE/ZH) kötelező. A slug
          a rövid névből generálódik. A publikáláshoz név, magyar
          teljes cím, magyar leírás és PDF mind kötelező.
        </p>
      </header>

      <CertificationForm mode="create" />
    </div>
  );
}
