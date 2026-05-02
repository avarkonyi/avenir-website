import Link from "next/link";
import { connection } from "next/server";
import { asc, isNull } from "drizzle-orm";
import { db, services } from "@/lib/db";
import {
  ServiceForm,
  type ParentOption,
} from "../_components/ServiceForm";

export default async function NewServicePage() {
  await connection();

  // Top-level services only — those are the legal parent choices
  // (2-level hierarchy cap; sub-services cannot themselves be parents).
  const parentRows = await db
    .select({ id: services.id, nameHu: services.nameHu })
    .from(services)
    .where(isNull(services.parentId))
    .orderBy(asc(services.sortOrder), asc(services.id));

  const parentOptions: ParentOption[] = parentRows;

  return (
    <div style={{ maxWidth: 980 }}>
      <div style={{ marginBottom: 20 }}>
        <Link
          href="/admin/services"
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
          Új szolgáltatás
        </h1>
        <p style={{ color: "#64748B", marginTop: 4, fontSize: 13 }}>
          A magyar név kötelező; a többi nyelv opcionális (üres = nincs
          fordítás). Hagy üresen a „Szülő szolgáltatás”-t főszolgáltatás
          létrehozásához.
        </p>
      </header>

      <ServiceForm mode="create" parentOptions={parentOptions} />
    </div>
  );
}
