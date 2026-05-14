import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { AvenirLogo } from "@/components/AvenirLogo";
import { Icon } from "@/components/Icon";
import { getTranslation } from "@/lib/i18n";
import {
  getPublishedNewsIndexHu,
  newsDetailHrefHu,
} from "@/lib/db/queries/news";
import { SEO_DATA } from "@/lib/seo-data";
import { getSafePublicImageSrc } from "@/lib/safe-public-image";

export const revalidate = 3600;

const INDEX_PATH = "/hu/hirek";
const INDEX_URL = `${SEO_DATA.url}${INDEX_PATH}`;

export function generateStaticParams() {
  return [{ locale: "hu" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "hu") {
    return { robots: { index: false, follow: false } };
  }

  return {
    metadataBase: new URL(SEO_DATA.url),
    title: `Hírek és tudásanyag - ${SEO_DATA.legalNameShort}`,
    description:
      "Avenir hírek, szakmai cikkek és facility management témájú tudásanyagok vállalati döntéshozóknak.",
    alternates: {
      canonical: INDEX_URL,
      languages: {
        hu: INDEX_URL,
        "x-default": INDEX_URL,
      },
    },
    openGraph: {
      type: "website",
      title: `Hírek és tudásanyag - ${SEO_DATA.legalNameShort}`,
      description:
        "Avenir hírek, szakmai cikkek és facility management témájú tudásanyagok vállalati döntéshozóknak.",
      url: INDEX_URL,
      siteName: SEO_DATA.name,
    },
    twitter: {
      card: "summary_large_image",
      title: `Hírek és tudásanyag - ${SEO_DATA.legalNameShort}`,
      description:
        "Avenir hírek, szakmai cikkek és facility management témájú tudásanyagok vállalati döntéshozóknak.",
    },
  };
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("hu-HU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function NewsIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale !== "hu") notFound();

  const articles = await getPublishedNewsIndexHu();
  if (articles.length === 0) notFound();

  const t = getTranslation("hu");

  return (
    <>
      <Nav t={{ nav: t.nav }} />
      <main style={{ background: "#fff", color: "#0B1E3E" }}>
        <section
          style={{
            background: "linear-gradient(180deg,#0B1E3E 0%,#142a52 100%)",
            color: "#fff",
            padding: "140px 5vw 80px",
          }}
        >
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
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
              <Link
                href="/hu"
                style={{
                  color: "rgba(255,255,255,0.7)",
                  textDecoration: "none",
                }}
              >
                {t.nav.home}
              </Link>
              <span aria-hidden>›</span>
              <span style={{ color: "rgba(255,255,255,0.95)", fontWeight: 600 }}>
                Hírek
              </span>
            </nav>
            <h1
              style={{
                fontFamily: "var(--font-head)",
                fontWeight: 800,
                fontSize: "clamp(36px, 4.4vw, 58px)",
                lineHeight: 1.05,
                margin: "28px 0 0",
              }}
            >
              Hírek és tudásanyag
            </h1>
            <p
              style={{
                marginTop: 20,
                fontSize: "clamp(17px, 1.5vw, 20px)",
                lineHeight: 1.55,
                color: "rgba(255,255,255,0.82)",
                maxWidth: 720,
              }}
            >
              Avenir hírek, szakmai cikkek és facility management témájú
              anyagok vállalati döntéshozóknak.
            </p>
          </div>
        </section>

        <section style={{ padding: "84px 5vw", background: "#F8FAFC" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: 28,
              }}
            >
              {articles.map((article) => {
                const imageUrl = getSafePublicImageSrc(article.imageUrl);

                return (
                  <Link
                    key={article.id}
                    href={newsDetailHrefHu(article.slug)}
                    className="news-card"
                    style={{ color: "inherit", textDecoration: "none" }}
                  >
                  <div
                    style={{
                      position: "relative",
                      aspectRatio: "16/9",
                      background: "linear-gradient(135deg, #0B1E3E, #1a3a6b)",
                      overflow: "hidden",
                    }}
                  >
                    {imageUrl ? (
                      <>
                        <Image
                          src={imageUrl}
                          alt=""
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 380px"
                          style={{ objectFit: "cover" }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            background:
                              "linear-gradient(180deg, rgba(11,30,62,0.12), rgba(11,30,62,0.28))",
                          }}
                        />
                      </>
                    ) : (
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <AvenirLogo size={36} />
                      </div>
                    )}
                    <div
                      style={{
                        position: "absolute",
                        top: 16,
                        left: 16,
                        background: "#D1172E",
                        color: "#fff",
                        fontFamily: "var(--font-head)",
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: 1,
                        padding: "4px 10px",
                        borderRadius: 2,
                        textTransform: "uppercase",
                      }}
                    >
                      {formatDate(article.date)}
                    </div>
                  </div>
                  <div
                    style={{
                      padding: "24px 24px 28px",
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <h2
                      style={{
                        fontFamily: "var(--font-head)",
                        fontWeight: 700,
                        fontSize: 22,
                        color: "#0B1E3E",
                        lineHeight: 1.25,
                        marginBottom: 12,
                      }}
                    >
                      {article.title}
                    </h2>
                    <p
                      style={{
                        color: "#667788",
                        fontSize: 14.5,
                        lineHeight: 1.6,
                        fontWeight: 300,
                        flex: 1,
                      }}
                    >
                      {article.lead}
                    </p>
                    <div
                      style={{
                        marginTop: 18,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-head)",
                          fontWeight: 700,
                          fontSize: 13,
                          letterSpacing: 1.2,
                          color: "#D1172E",
                          textTransform: "uppercase",
                        }}
                      >
                        Tovább olvasom
                      </span>
                      <Icon name="arrow" size={14} color="#D1172E" />
                    </div>
                  </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer t={t} locale="hu" />
    </>
  );
}
