import type { Translation } from "@/lib/i18n";
import { SEO_DATA } from "@/lib/seo-data";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { JsonLd } from "./JsonLd";

type Props = {
  t: Translation;
  locale: string;
  pageTitle: string;
  pageDescription: string;
  pageSlug: "adatvedelem" | "aszf" | "impresszum";
  children: React.ReactNode;
};

export function LegalPageChrome({
  t,
  locale,
  pageTitle,
  pageDescription,
  pageSlug,
  children,
}: Props) {
  const pageUrl = `${SEO_DATA.url}/${locale}/${pageSlug}`;

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: t.nav.home,
        item: `${SEO_DATA.url}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: pageTitle,
        item: pageUrl,
      },
    ],
  };

  const webpage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: pageTitle,
    description: pageDescription,
    url: pageUrl,
    inLanguage: locale,
    isPartOf: { "@id": `${SEO_DATA.url}/#website` },
    breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
  };

  return (
    <>
      <JsonLd schemas={[breadcrumb, webpage]} />
      <Nav t={t} />
      <main style={{ minHeight: "60vh", background: "#fff" }}>
        <div
          style={{
            maxWidth: 880,
            margin: "0 auto",
            padding: "120px 5vw 80px",
            fontFamily: "var(--font-geist-sans)",
            color: "#0B1E3E",
            lineHeight: 1.7,
          }}
        >
          {children}
        </div>
      </main>
      <Footer t={t} locale={locale} />
    </>
  );
}

export function LegalSection({
  id,
  title,
  body,
}: {
  id: string;
  title: string;
  body: string;
}) {
  return (
    <section id={id} style={{ marginBottom: 32 }}>
      <h2
        style={{
          fontFamily: "var(--font-head)",
          fontSize: 22,
          fontWeight: 700,
          marginBottom: 12,
          color: "#0B1E3E",
        }}
      >
        {title}
      </h2>
      <div
        style={{
          whiteSpace: "pre-wrap",
          fontSize: 15,
          lineHeight: 1.75,
          color: "rgba(11,30,62,0.85)",
        }}
      >
        {body}
      </div>
    </section>
  );
}

export function LegalHeader({
  title,
  lastUpdated,
  version,
  intro,
}: {
  title: string;
  lastUpdated: string;
  version?: string;
  intro?: string;
}) {
  return (
    <header style={{ marginBottom: 48 }}>
      <h1
        style={{
          fontFamily: "var(--font-head)",
          fontSize: "clamp(28px, 4vw, 44px)",
          fontWeight: 800,
          marginBottom: 8,
          color: "#0B1E3E",
          lineHeight: 1.15,
        }}
      >
        {title}
      </h1>
      <p
        style={{
          color: "rgba(11,30,62,0.55)",
          fontSize: 14,
          marginBottom: 4,
        }}
      >
        {lastUpdated}
      </p>
      {version && (
        <p
          style={{
            color: "rgba(11,30,62,0.45)",
            fontSize: 13,
            marginBottom: intro ? 24 : 0,
          }}
        >
          {version}
        </p>
      )}
      {intro && (
        <p
          style={{
            fontSize: 16,
            lineHeight: 1.75,
            color: "rgba(11,30,62,0.85)",
            whiteSpace: "pre-wrap",
            marginTop: version ? 0 : 16,
          }}
        >
          {intro}
        </p>
      )}
    </header>
  );
}
