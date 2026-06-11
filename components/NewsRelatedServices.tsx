import Link from "next/link";
import type { NewsPublicLocale } from "@/lib/news-routing";

// Short related-services + quote CTA block rendered by the news article
// template after the DB-backed article body (no DB content change). Scope
// follows the public news locales (HU/EN indexable, DE noindex review).
// Labels are the canonical service labels per locale; DE links point to
// the 200/noindex DE review service routes. ZH/KO have no news routes, so
// this component is never rendered for them.

type RelatedServiceLink = {
  readonly slug: string;
  readonly label: string;
};

const RELATED_SERVICES: Record<NewsPublicLocale, readonly RelatedServiceLink[]> = {
  hu: [
    { slug: "objektumorzes", label: "Élőerős objektumőrzés" },
    { slug: "biztonsagtechnika", label: "Biztonságtechnika" },
    { slug: "hard-fm", label: "Hard FM" },
    { slug: "soft-fm", label: "Soft FM" },
  ],
  en: [
    { slug: "objektumorzes", label: "On-site Security Guarding" },
    { slug: "biztonsagtechnika", label: "Security Technology" },
    { slug: "hard-fm", label: "Hard FM" },
    { slug: "soft-fm", label: "Soft FM" },
  ],
  de: [
    { slug: "objektumorzes", label: "Objektschutz vor Ort" },
    { slug: "biztonsagtechnika", label: "Sicherheitstechnik" },
    { slug: "hard-fm", label: "Hard FM – Technisches Gebäudemanagement" },
    { slug: "soft-fm", label: "Soft FM – Infrastrukturelles Gebäudemanagement" },
  ],
};

const HEADINGS: Record<NewsPublicLocale, string> = {
  hu: "Kapcsolódó szolgáltatások",
  en: "Related services",
  de: "Verwandte Dienstleistungen",
};

const CTA_LABELS: Record<NewsPublicLocale, string> = {
  hu: "Ajánlatkérés",
  en: "Request a quote",
  de: "Angebot anfordern",
};

export function NewsRelatedServices({ locale }: { locale: NewsPublicLocale }) {
  const services = RELATED_SERVICES[locale];

  return (
    <aside
      aria-labelledby="news-related-services-title"
      style={{
        marginTop: 56,
        paddingTop: 36,
        borderTop: "1px solid #E2E8F0",
      }}
    >
      <h2
        id="news-related-services-title"
        style={{
          fontFamily: "var(--font-head)",
          fontWeight: 800,
          fontSize: 22,
          color: "#0B1E3E",
          margin: "0 0 18px",
        }}
      >
        {HEADINGS[locale]}
      </h2>
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: "0 0 28px",
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        {services.map((service) => (
          <li key={service.slug}>
            <Link
              href={`/${locale}/szolgaltatasok/${service.slug}`}
              style={{
                display: "inline-block",
                padding: "10px 16px",
                border: "1px solid #E2E8F0",
                borderRadius: 3,
                color: "#0B1E3E",
                fontSize: 14,
                fontWeight: 600,
                textDecoration: "none",
                background: "#F8FAFC",
              }}
            >
              {service.label}
            </Link>
          </li>
        ))}
      </ul>
      {/* CTA follows the homepage contact-anchor pattern (no service
          prefill: the article is not service-specific). */}
      <Link
        href={`/${locale}#contact`}
        style={{
          display: "inline-block",
          background: "#D1172E",
          color: "#fff",
          fontFamily: "var(--font-head)",
          fontWeight: 700,
          fontSize: 13,
          letterSpacing: 1,
          textTransform: "uppercase",
          padding: "12px 24px",
          borderRadius: 2,
          textDecoration: "none",
        }}
      >
        {CTA_LABELS[locale]}
      </Link>
    </aside>
  );
}
