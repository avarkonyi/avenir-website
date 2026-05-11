import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { Icon, ICON_NAMES, type IconName } from "@/components/Icon";
import { getTranslation, LOCALES, type Locale } from "@/lib/i18n";
import {
  getPublishedServiceDetailBySlug,
  getPublishedServicesBySlugs,
  getAllPublishedServicePaths,
  getPublishedServiceLocalesBySlug,
} from "@/lib/db/queries/services";
import { SEO_DATA, SEO_LOCALES, type SeoLocale } from "@/lib/seo-data";

// Public service detail page (P5 Phase 1).
//
// URL: /[locale]/szolgaltatasok/[slug]. The HU segment is reused for
// every locale to keep the URL canonical across languages — same
// approach the site uses for /[locale]/impresszum etc. Slug is
// locale-independent (one row per service, locale-aware columns).
//
// Draft handling: getPublishedServiceDetailBySlug already filters
// isPublished=true AND isActive=true; missing/draft → notFound().
// Sitemap (app/sitemap.ts) calls getAllPublishedServicePaths so
// drafts and incomplete locale detail pages never get indexed via that
// surface either.
//
// JSON-LD: Service + BreadcrumbList always; FAQPage only when the
// page actually renders the FAQ section (per spec).

const URL_SEGMENT = "szolgaltatasok";

export const revalidate = 3600;

export async function generateStaticParams() {
  return getAllPublishedServicePaths();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!SEO_LOCALES.includes(locale as SeoLocale)) {
    return {};
  }
  const detail = await getPublishedServiceDetailBySlug(slug, locale);
  if (!detail) {
    // Returning empty metadata is fine — the page itself will call
    // notFound() and the route returns 404 + the not-found.tsx UI.
    return { robots: { index: false, follow: false } };
  }

  const title =
    detail.seoTitle.trim().length > 0
      ? detail.seoTitle
      : `${detail.name} — ${SEO_DATA.legalNameShort}`;
  const description =
    detail.seoDescription.trim().length > 0
      ? detail.seoDescription
      : detail.shortDesc.trim().length > 0
        ? detail.shortDesc
        : detail.valueProposition;

  const path = `/${locale}/${URL_SEGMENT}/${slug}`;
  const canonical = `${SEO_DATA.url}${path}`;
  const readyLocales = await getPublishedServiceLocalesBySlug(slug);
  const languages: Record<string, string> = {};
  for (const l of readyLocales) {
    languages[l] = `${SEO_DATA.url}/${l}/${URL_SEGMENT}/${slug}`;
  }
  if (readyLocales.includes("hu")) {
    languages["x-default"] = `${SEO_DATA.url}/hu/${URL_SEGMENT}/${slug}`;
  }

  return {
    metadataBase: new URL(SEO_DATA.url),
    title,
    description,
    robots: { index: true, follow: true },
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      type: "article",
      title,
      description,
      url: canonical,
      siteName: SEO_DATA.name,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

function safeIconName(dbIcon: string | null): IconName {
  if (dbIcon && (ICON_NAMES as readonly string[]).includes(dbIcon)) {
    return dbIcon as IconName;
  }
  return "shield";
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!LOCALES.includes(locale as Locale)) notFound();

  const detail = await getPublishedServiceDetailBySlug(slug, locale);
  if (!detail) notFound();

  const t = getTranslation(locale);
  const related = await getPublishedServicesBySlugs(
    detail.relatedSlugs,
    locale,
  );

  const pageUrl = `${SEO_DATA.url}/${locale}/${URL_SEGMENT}/${slug}`;
  const homeUrl = `${SEO_DATA.url}/${locale}`;
  const servicesAnchorUrl = `${homeUrl}#services`;

  const hasFaq = detail.faq.length > 0;

  // Query comes before the hash so a future Contact prefill can read
  // it via URLSearchParams. Today the hash still lands on the form.
  const ctaUrl = `/${locale}?service=${encodeURIComponent(slug)}#contact`;

  // ── JSON-LD ─────────────────────────────────────────────────────────
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: t.nav.home,
        item: homeUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: t.nav.services,
        item: servicesAnchorUrl,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: detail.name,
        item: pageUrl,
      },
    ],
  };

  const serviceSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${pageUrl}#service`,
    name: detail.name,
    serviceType: detail.name,
    description:
      detail.seoDescription.trim().length > 0
        ? detail.seoDescription
        : detail.shortDesc || detail.valueProposition || detail.name,
    url: pageUrl,
    areaServed: { "@type": "Country", name: "Magyarország" },
    provider: { "@id": `${SEO_DATA.url}/#organization` },
  };
  if (detail.imageUrl) {
    serviceSchema.image = detail.imageUrl.startsWith("http")
      ? detail.imageUrl
      : `${SEO_DATA.url}${detail.imageUrl}`;
  }

  const schemas: Record<string, unknown>[] = [breadcrumb, serviceSchema];
  if (hasFaq) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `${pageUrl}#faq`,
      mainEntity: detail.faq.map((entry) => ({
        "@type": "Question",
        name: entry.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: entry.a,
        },
      })),
    });
  }

  return (
    <>
      <JsonLd schemas={schemas} />
      <Nav t={{ nav: t.nav }} />

      <main style={{ background: "#fff", color: "#0B1E3E" }}>
        {/* Hero */}
        <section
          style={{
            background: "linear-gradient(180deg,#0B1E3E 0%,#142a52 100%)",
            color: "#fff",
            padding: "140px 5vw 80px",
          }}
        >
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <Breadcrumbs
              homeLabel={t.nav.home}
              servicesLabel={t.nav.services}
              currentLabel={detail.name}
              locale={locale}
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 18,
                marginTop: 18,
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 4,
                  background: "rgba(255,255,255,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
                aria-hidden
              >
                <Icon name={safeIconName(detail.icon)} size={28} color="#fff" />
              </div>
              <h1
                style={{
                  fontFamily: "var(--font-head)",
                  fontWeight: 800,
                  fontSize: "clamp(32px, 4.4vw, 56px)",
                  lineHeight: 1.05,
                  margin: 0,
                }}
              >
                {detail.name}
              </h1>
            </div>
            {detail.valueProposition.trim().length > 0 && (
              <p
                style={{
                  marginTop: 24,
                  fontSize: "clamp(17px, 1.6vw, 21px)",
                  lineHeight: 1.55,
                  color: "rgba(255,255,255,0.85)",
                  maxWidth: 760,
                }}
              >
                {detail.valueProposition}
              </p>
            )}
            <div className="service-detail-cta-row" style={{ marginTop: 28 }}>
              <Link
                href={ctaUrl}
                className="service-detail-cta-button"
                style={{
                  background: "#D1172E",
                  color: "#fff",
                  fontFamily: "var(--font-head)",
                  fontWeight: 700,
                  fontSize: 13,
                  letterSpacing: 1.2,
                  textTransform: "uppercase",
                  padding: "12px 24px",
                  borderRadius: 2,
                  textDecoration: "none",
                }}
              >
                {t.nav.cta}
              </Link>
            </div>
          </div>
        </section>

        {/* Long description */}
        {detail.longDesc.trim().length > 0 && (
          <Section>
            <RichText text={detail.longDesc} />
          </Section>
        )}

        {/* Use cases — "Kinek jó" */}
        {detail.useCases.length > 0 && (
          <Section eyebrow="Kinek ajánljuk" title="Kinek jó">
            <BulletList items={detail.useCases} />
          </Section>
        )}

        {/* Included items — "Mit tartalmaz" */}
        {detail.includedItems.length > 0 && (
          <Section eyebrow="Tartalom" title="Mit tartalmaz">
            <BulletList items={detail.includedItems} />
          </Section>
        )}

        {/* Process steps — "Hogyan indul az együttműködés" */}
        {detail.processSteps.length > 0 && (
          <Section
            eyebrow="Folyamat"
            title="Hogyan indul az együttműködés"
            background="#F8FAFC"
          >
            <ol
              style={{
                display: "grid",
                gap: 20,
                listStyle: "none",
                padding: 0,
                margin: 0,
                counterReset: "step",
              }}
            >
              {detail.processSteps.map((step, i) => (
                <li
                  key={`${i}-${step.title}`}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "44px 1fr",
                    gap: 16,
                    alignItems: "start",
                  }}
                >
                  <span
                    aria-hidden
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: "#D1172E",
                      color: "#fff",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "var(--font-head)",
                      fontWeight: 700,
                      fontSize: 15,
                    }}
                  >
                    {i + 1}
                  </span>
                  <div>
                    <h3
                      style={{
                        margin: 0,
                        fontFamily: "var(--font-head)",
                        fontSize: 18,
                        fontWeight: 700,
                      }}
                    >
                      {step.title}
                    </h3>
                    {step.body.trim().length > 0 && (
                      <p
                        style={{
                          margin: "6px 0 0",
                          color: "rgba(11,30,62,0.78)",
                          lineHeight: 1.6,
                          fontSize: 15,
                        }}
                      >
                        {step.body}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </Section>
        )}

        {/* Trust elements */}
        {detail.trustItems.length > 0 && (
          <Section eyebrow="Miért bízhat bennünk" title="Bizalmi elemek">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: 20,
              }}
            >
              {detail.trustItems.map((item, i) => (
                <div
                  key={`${i}-${item.title}`}
                  style={{
                    border: "1px solid #E2E8F0",
                    borderRadius: 4,
                    padding: "20px 22px",
                    background: "#fff",
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      fontFamily: "var(--font-head)",
                      fontSize: 17,
                      fontWeight: 700,
                    }}
                  >
                    {item.title}
                  </h3>
                  {item.body.trim().length > 0 && (
                    <p
                      style={{
                        margin: "8px 0 0",
                        color: "rgba(11,30,62,0.75)",
                        lineHeight: 1.55,
                        fontSize: 14,
                      }}
                    >
                      {item.body}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* FAQ — only present in JSON-LD when actually rendered (per spec) */}
        {hasFaq && (
          <Section
            eyebrow="Gyakori kérdések"
            title="Mit kérdeznek leggyakrabban"
            background="#F8FAFC"
          >
            <div style={{ display: "grid", gap: 14 }}>
              {detail.faq.map((entry, i) => (
                <details
                  key={`${i}-${entry.q}`}
                  style={{
                    border: "1px solid #E2E8F0",
                    borderRadius: 4,
                    padding: "14px 18px",
                    background: "#fff",
                  }}
                >
                  <summary
                    style={{
                      cursor: "pointer",
                      fontFamily: "var(--font-head)",
                      fontWeight: 700,
                      fontSize: 16,
                      color: "#0B1E3E",
                    }}
                  >
                    {entry.q}
                  </summary>
                  {entry.a.trim().length > 0 && (
                    <p
                      style={{
                        margin: "10px 0 0",
                        color: "rgba(11,30,62,0.78)",
                        lineHeight: 1.6,
                        fontSize: 15,
                      }}
                    >
                      {entry.a}
                    </p>
                  )}
                </details>
              ))}
            </div>
          </Section>
        )}

        {/* Related services */}
        {related.length > 0 && (
          <Section eyebrow="Még az Avenirtől" title="Kapcsolódó szolgáltatások">
            <div className="service-detail-related-grid">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/${locale}/${URL_SEGMENT}/${r.slug}`}
                  className="service-detail-related-card"
                  style={{
                    border: "1px solid #E2E8F0",
                    borderRadius: 4,
                    padding: "20px 22px",
                    textDecoration: "none",
                    color: "#0B1E3E",
                    background: "#fff",
                  }}
                >
                  <div
                    className="service-detail-related-head"
                    style={{
                      marginBottom: 8,
                    }}
                  >
                    <span className="service-detail-related-icon" aria-hidden>
                      <Icon name={safeIconName(r.icon)} size={22} />
                    </span>
                    <h3
                      className="service-detail-related-title"
                      style={{
                        margin: 0,
                        fontFamily: "var(--font-head)",
                        fontSize: 17,
                        fontWeight: 700,
                      }}
                    >
                      {r.name}
                    </h3>
                  </div>
                  {r.shortDesc && (
                    <p
                      className="service-detail-related-desc"
                      style={{
                        margin: 0,
                        color: "rgba(11,30,62,0.7)",
                        lineHeight: 1.55,
                        fontSize: 14,
                      }}
                    >
                      {r.shortDesc}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </Section>
        )}

        {/* Final CTA */}
        <section
          style={{
            background: "#0B1E3E",
            color: "#fff",
            padding: "80px 5vw",
          }}
        >
          <div
            style={{
              maxWidth: 880,
              margin: "0 auto",
              textAlign: "center",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-head)",
                fontSize: "clamp(28px, 3.4vw, 42px)",
                fontWeight: 800,
                lineHeight: 1.15,
                marginBottom: 16,
              }}
            >
              {t.contactTitle}
            </h2>
            {detail.valueProposition.trim().length > 0 && (
              <p
                style={{
                  color: "rgba(255,255,255,0.78)",
                  fontSize: 17,
                  lineHeight: 1.6,
                  marginBottom: 28,
                  maxWidth: 640,
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                {detail.valueProposition}
              </p>
            )}
            <div className="service-detail-cta-row service-detail-cta-row--center">
              <Link
                href={ctaUrl}
                className="service-detail-cta-button"
                style={{
                  background: "#D1172E",
                  color: "#fff",
                  fontFamily: "var(--font-head)",
                  fontWeight: 700,
                  fontSize: 14,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                  padding: "14px 28px",
                  borderRadius: 2,
                  textDecoration: "none",
                }}
              >
                {t.nav.cta}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer t={t} locale={locale} />
    </>
  );
}

// ── presentational helpers ────────────────────────────────────────────

function Section({
  eyebrow,
  title,
  background,
  children,
}: {
  eyebrow?: string;
  title?: string;
  background?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      style={{
        padding: "72px 5vw",
        background: background ?? "#fff",
      }}
    >
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        {(eyebrow || title) && (
          <header style={{ marginBottom: 28 }}>
            {eyebrow && (
              <span
                style={{
                  fontFamily: "var(--font-head)",
                  fontSize: 12,
                  letterSpacing: 2.4,
                  color: "#D1172E",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  display: "inline-block",
                  marginBottom: 10,
                }}
              >
                {eyebrow}
              </span>
            )}
            {title && (
              <h2
                style={{
                  margin: 0,
                  fontFamily: "var(--font-head)",
                  fontSize: "clamp(26px, 3vw, 36px)",
                  fontWeight: 800,
                  lineHeight: 1.15,
                  color: "#0B1E3E",
                }}
              >
                {title}
              </h2>
            )}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}

function BulletList({ items }: { items: readonly string[] }) {
  return (
    <ul
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: 12,
        listStyle: "none",
        padding: 0,
        margin: 0,
      }}
    >
      {items.map((item, i) => (
        <li
          key={`${i}-${item.slice(0, 24)}`}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
            fontSize: 15,
            lineHeight: 1.55,
            color: "rgba(11,30,62,0.85)",
          }}
        >
          <span
            aria-hidden
            style={{
              flexShrink: 0,
              marginTop: 8,
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#D1172E",
            }}
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

// Renders the long description as paragraph blocks split on blank
// lines. Keeps whitespace-pre-wrap so single newlines inside a
// paragraph still show as soft breaks. No Markdown parser dependency
// in Phase 1 — deliberate; admin can use plain text or a future
// iteration can plug in remark/MDX without disturbing this surface.
function RichText({ text }: { text: string }) {
  const paragraphs = text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
  return (
    <div style={{ display: "grid", gap: 16 }}>
      {paragraphs.map((p, i) => (
        <p
          key={i}
          style={{
            margin: 0,
            fontSize: 16,
            lineHeight: 1.7,
            color: "rgba(11,30,62,0.85)",
            whiteSpace: "pre-wrap",
          }}
        >
          {p}
        </p>
      ))}
    </div>
  );
}

function Breadcrumbs({
  homeLabel,
  servicesLabel,
  currentLabel,
  locale,
}: {
  homeLabel: string;
  servicesLabel: string;
  currentLabel: string;
  locale: string;
}) {
  const linkStyle: React.CSSProperties = {
    color: "rgba(255,255,255,0.7)",
    textDecoration: "none",
    fontSize: 13,
  };
  return (
    <nav
      aria-label="Breadcrumb"
      style={{
        display: "flex",
        gap: 8,
        flexWrap: "wrap",
        alignItems: "center",
        fontSize: 13,
        color: "rgba(255,255,255,0.55)",
      }}
    >
      <Link href={`/${locale}`} style={linkStyle}>
        {homeLabel}
      </Link>
      <span aria-hidden>›</span>
      <Link href={`/${locale}#services`} style={linkStyle}>
        {servicesLabel}
      </Link>
      <span aria-hidden>›</span>
      <span style={{ color: "rgba(255,255,255,0.95)", fontWeight: 600 }}>
        {currentLabel}
      </span>
    </nav>
  );
}
