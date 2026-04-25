import { getTranslation } from "@/lib/i18n";

const LOCALES = ["hu", "en", "de", "zh"];

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = getTranslation(locale);

  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
      <p>{t.hero.tag}</p>
      <h1>
        {t.hero.h1a} <span style={{ color: "#D1172E" }}>{t.hero.h1b}</span>
      </h1>
      <p>{t.hero.sub}</p>
      <hr style={{ margin: "2rem 0" }} />
      <h2>{t.servicesTitle}</h2>
      <ul>
        {t.services.map((s) => (
          <li key={s.id}>
            <strong>{s.t}</strong>: {s.d}
          </li>
        ))}
      </ul>
      <hr style={{ margin: "2rem 0" }} />
      <small>
        Locale: {locale} · {t.footer.rights}
      </small>
    </main>
  );
}
