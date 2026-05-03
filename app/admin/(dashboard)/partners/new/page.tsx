import Link from "next/link";
import { connection } from "next/server";
import { PartnerForm } from "../_components/PartnerForm";

export default async function NewPartnerPage() {
  await connection();

  return (
    <div style={{ maxWidth: 980 }}>
      <div style={{ marginBottom: 20 }}>
        <Link
          href="/admin/partners"
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
          Új partner
        </h1>
        <p style={{ color: "#64748B", marginTop: 4, fontSize: 13 }}>
          A partner alapadatait egy nyelven add meg (cégnevek általában
          nem fordulnak nyelvre). A slug a névből generálódik. A
          publikáláshoz logo és név kötelező.
        </p>
      </header>

      <PartnerForm mode="create" />
    </div>
  );
}
