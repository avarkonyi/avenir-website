import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { AvenirLogo } from "@/components/AvenirLogo";
import { NewsRelatedServices } from "@/components/NewsRelatedServices";
import { JsonLd } from "@/components/JsonLd";
import { getTranslation } from "@/lib/i18n";
import {
  getAllPublishedNewsPathsForBuild,
  getPublishedNewsDetailBySlugForPublic,
  getPublishedNewsLocalesForSlugForPublic,
} from "@/lib/db/queries/news";
import { SEO_DATA } from "@/lib/seo-data";
import {
  getSafeAbsolutePublicImageUrl,
  getSafePublicImageSrc,
} from "@/lib/safe-public-image";
import {
  isIndexableNewsLocale,
  isPublicNewsLocale,
  newsAlternateLanguages,
  newsDetailUrl,
  newsIndexPath,
  newsIndexUrl,
  type NewsPublicLocale,
} from "@/lib/news-routing";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const paths = await getAllPublishedNewsPathsForBuild(
    "article detail generateStaticParams",
  );
  return paths.map(({ locale, slug }) => ({ locale, slug }));
}

function articleMetadataImageUrl(imageUrl: string | null): string {
  return (
    getSafeAbsolutePublicImageUrl(imageUrl, SEO_DATA.url) ??
    SEO_DATA.ogImageUrl
  );
}

function dateLocale(locale: NewsPublicLocale): string {
  if (locale === "hu") return "hu-HU";
  if (locale === "de") return "de-DE";
  return "en-GB";
}

function formatDate(date: Date, locale: NewsPublicLocale): string {
  return date.toLocaleDateString(dateLocale(locale), {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isPublicNewsLocale(locale)) {
    return { robots: { index: false, follow: false } };
  }

  const article = await getPublishedNewsDetailBySlugForPublic(
    locale,
    slug,
    "article metadata detail",
  );
  if (!article) {
    return { robots: { index: false, follow: false } };
  }

  const availableLocales = await getPublishedNewsLocalesForSlugForPublic(
    article.slug,
    "article metadata alternates",
  );
  const url = newsDetailUrl(locale, article.slug);
  const title = `${article.title} - ${SEO_DATA.legalNameShort}`;
  const image = articleMetadataImageUrl(article.imageUrl);
  const indexable = isIndexableNewsLocale(locale);

  return {
    metadataBase: new URL(SEO_DATA.url),
    title,
    description: article.lead,
    authors: [{ name: SEO_DATA.legalNameShort }],
    robots: { index: indexable, follow: true },
    alternates: {
      canonical: url,
      ...(indexable
        ? { languages: newsAlternateLanguages(article.slug, availableLocales) }
        : {}),
    },
    openGraph: {
      type: "article",
      title,
      description: article.lead,
      url,
      siteName: SEO_DATA.name,
      publishedTime: article.date.toISOString(),
      modifiedTime: article.updatedAt.toISOString(),
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: article.lead,
      images: [image],
    },
  };
}

function RichText({ text }: { text: string }) {
  const paragraphs = text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  return (
    <div style={{ display: "grid", gap: 18 }}>
      {paragraphs.map((paragraph, i) => (
        <p
          key={i}
          style={{
            margin: 0,
            color: "rgba(11,30,62,0.84)",
            fontSize: 17,
            lineHeight: 1.75,
            whiteSpace: "pre-wrap",
          }}
        >
          {paragraph}
        </p>
      ))}
    </div>
  );
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isPublicNewsLocale(locale)) notFound();

  const article = await getPublishedNewsDetailBySlugForPublic(
    locale,
    slug,
    "article detail page",
  );
  if (!article) notFound();

  const t = getTranslation(locale);
  const url = newsDetailUrl(locale, article.slug);
  const image = articleMetadataImageUrl(article.imageUrl);
  const coverImage = getSafePublicImageSrc(article.imageUrl);
  const indexPath = newsIndexPath(locale);
  const indexUrl = newsIndexUrl(locale);

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
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
        name: t.nav.news,
        item: indexUrl,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: url,
      },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    mainEntityOfPage: url,
    headline: article.title,
    description: article.lead,
    image,
    datePublished: article.date.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    inLanguage: locale,
    author: { "@id": `${SEO_DATA.url}/#organization` },
    publisher: { "@id": `${SEO_DATA.url}/#organization` },
  };

  return (
    <>
      <JsonLd schemas={[breadcrumb, articleSchema]} />
      <Nav t={{ nav: t.nav }} />
      <main id="main" style={{ background: "#fff", color: "#0B1E3E" }}>
        <section
          style={{
            background: "linear-gradient(180deg,#0B1E3E 0%,#142a52 100%)",
            color: "#fff",
            padding: "140px 5vw 76px",
          }}
        >
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
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
                href={`/${locale}`}
                style={{
                  color: "rgba(255,255,255,0.7)",
                  textDecoration: "none",
                }}
              >
                {t.nav.home}
              </Link>
              <span aria-hidden>›</span>
              <Link
                href={indexPath}
                style={{
                  color: "rgba(255,255,255,0.7)",
                  textDecoration: "none",
                }}
              >
                {t.nav.news}
              </Link>
              <span aria-hidden>›</span>
              <span
                aria-current="page"
                style={{ color: "rgba(255,255,255,0.95)", fontWeight: 600 }}
              >
                {article.title}
              </span>
            </nav>

            <p
              style={{
                margin: "28px 0 0",
                color: "#D1172E",
                fontFamily: "var(--font-head)",
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: 1.5,
                textTransform: "uppercase",
              }}
            >
              {formatDate(article.date, locale)}
            </p>
            <h1
              style={{
                fontFamily: "var(--font-head)",
                fontWeight: 800,
                fontSize: "clamp(34px, 4.4vw, 58px)",
                lineHeight: 1.05,
                margin: "14px 0 0",
              }}
            >
              {article.title}
            </h1>
            <p
              style={{
                marginTop: 22,
                maxWidth: 760,
                color: "rgba(255,255,255,0.82)",
                fontSize: "clamp(17px, 1.5vw, 21px)",
                lineHeight: 1.55,
              }}
            >
              {article.lead}
            </p>
          </div>
        </section>

        <article style={{ padding: "72px 5vw 88px" }}>
          <div style={{ maxWidth: 860, margin: "0 auto" }}>
            {coverImage ? (
              <div
                style={{
                  position: "relative",
                  aspectRatio: "16/9",
                  overflow: "hidden",
                  borderRadius: 4,
                  background: "#0B1E3E",
                  marginBottom: 36,
                }}
              >
                <Image
                  src={coverImage}
                  alt=""
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1100px) 90vw, 860px"
                  quality={90}
                  style={{ objectFit: "cover" }}
                />
              </div>
            ) : (
              <div
                style={{
                  height: 180,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid #E2E8F0",
                  borderRadius: 4,
                  background: "#F8FAFC",
                  marginBottom: 36,
                }}
                aria-hidden
              >
                <AvenirLogo size={42} />
              </div>
            )}

            <RichText text={article.body} />

            <NewsRelatedServices locale={locale} />
          </div>
        </article>
      </main>
      <Footer t={t} locale={locale} />
    </>
  );
}
