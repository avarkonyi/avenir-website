import { connection } from "next/server";
import { loadSiteSettings } from "./_actions";
import { SettingsForm } from "./_components/SettingsForm";

export default async function AdminSettingsPage() {
  await connection();
  const settings = await loadSiteSettings();

  return (
    <div style={{ maxWidth: 980 }}>
      <header style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#0B1E3E", margin: 0 }}>
          Beállítások
        </h1>
        <p style={{ color: "#64748B", marginTop: 4, fontSize: 14 }}>
          Cég-, cím- és kapcsolati alapadatok admin felülete.
        </p>
      </header>

      <SettingsForm initial={settings} />
    </div>
  );
}
