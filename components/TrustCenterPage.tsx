import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { Nav } from "@/components/Nav";
import type { Translation } from "@/lib/i18n";
import { SEO_DATA } from "@/lib/seo-data";
import {
  type TrustCenterContent,
  type TrustCenterLink,
  trustCenterUrl,
} from "@/lib/trust-center-content";
import type { TrustCenterLocale } from "@/lib/trust-center-routes";

function TrustLink({ link }: { link: TrustCenterLink }) {
  const isExternal = link.external || /^https?:\/\//.test(link.href);
  return (
    <a
      href={link.href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      style={{
        color: "#D1172E",
        fontWeight: 650,
        textDecoration: "none",
      }}
    >
      {link.label}
    </a>
  );
}

export function TrustCenterPage({
  t,
  locale,
  content,
}: {
  t: Translation;
  locale: TrustCenterLocale;
  content: TrustCenterContent;
}) {
  const pageUrl = trustCenterUrl(locale);
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
        name: content.title,
        item: pageUrl,
      },
    ],
  };
  const webpage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: content.title,
    description: content.description,
    url: pageUrl,
    inLanguage: locale,
    isPartOf: { "@id": `${SEO_DATA.url}/#website` },
    breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
  };

  return (
    <>
      <JsonLd schemas={[breadcrumb, webpage]} />
      <Nav t={t} />
      <main id="main" style={{ minHeight: "60vh", background: "#fff" }}>
        <div
          style={{
            maxWidth: 1040,
            margin: "0 auto",
            padding: "120px 5vw 84px",
            fontFamily: "var(--font-geist-sans)",
            color: "#0B1E3E",
            lineHeight: 1.7,
          }}
        >
          <header style={{ maxWidth: 820, marginBottom: 44 }}>
            <h1
              style={{
                fontFamily: "var(--font-head)",
                fontSize: "clamp(32px, 5vw, 52px)",
                lineHeight: 1.1,
                marginBottom: 18,
              }}
            >
              {content.title}
            </h1>
            <p
              style={{
                fontSize: 18,
                lineHeight: 1.75,
                color: "rgba(11,30,62,0.86)",
                marginBottom: 16,
              }}
            >
              {content.intro}
            </p>
            <p
              style={{
                fontSize: 15,
                lineHeight: 1.7,
                color: "rgba(11,30,62,0.68)",
                margin: 0,
              }}
            >
              {content.supportNote}
            </p>
          </header>

          <div style={{ display: "grid", gap: 28 }}>
            {content.sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                style={{
                  borderTop: "1px solid rgba(11,30,62,0.14)",
                  paddingTop: 28,
                }}
              >
                <h2
                  style={{
                    fontFamily: "var(--font-head)",
                    fontSize: "clamp(22px, 3vw, 30px)",
                    lineHeight: 1.18,
                    marginBottom: 12,
                  }}
                >
                  {section.heading}
                </h2>
                {section.body && (
                  <p
                    style={{
                      maxWidth: 820,
                      marginBottom: 18,
                      color: "rgba(11,30,62,0.82)",
                    }}
                  >
                    {section.body}
                  </p>
                )}

                {section.items && (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                      gap: 14,
                      marginTop: 18,
                    }}
                  >
                    {section.items.map((item) => (
                      <article
                        key={item.title}
                        style={{
                          border: "1px solid rgba(11,30,62,0.14)",
                          borderRadius: 8,
                          padding: 18,
                          background: "#fff",
                        }}
                      >
                        <h3
                          style={{
                            fontFamily: "var(--font-head)",
                            fontSize: 18,
                            lineHeight: 1.25,
                            marginBottom: 8,
                          }}
                        >
                          {item.title}
                        </h3>
                        {item.body && (
                          <p
                            style={{
                              color: "rgba(11,30,62,0.78)",
                              marginBottom: item.meta || item.links ? 12 : 0,
                            }}
                          >
                            {item.body}
                          </p>
                        )}
                        {item.meta && (
                          <ul
                            style={{
                              display: "grid",
                              gap: 6,
                              margin: item.links ? "0 0 12px" : 0,
                              color: "rgba(11,30,62,0.78)",
                              fontSize: 14,
                              paddingLeft: 18,
                            }}
                          >
                            {item.meta.map((line) => (
                              <li key={line}>{line}</li>
                            ))}
                          </ul>
                        )}
                        {item.links && (
                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 12,
                            }}
                          >
                            {item.links.map((link) => (
                              <TrustLink key={`${link.href}-${link.label}`} link={link} />
                            ))}
                          </div>
                        )}
                      </article>
                    ))}
                  </div>
                )}

                {section.links && (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 12,
                      marginTop: 18,
                    }}
                  >
                    {section.links.map((link) => (
                      <TrustLink key={`${link.href}-${link.label}`} link={link} />
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer t={t} locale={locale} />
    </>
  );
}
