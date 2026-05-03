import { connection } from "next/server";
import { notFound } from "next/navigation";
import { and, asc, desc, eq, isNotNull, isNull } from "drizzle-orm";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Services } from "@/components/Services";
import { References } from "@/components/References";
import { Certifications } from "@/components/Certifications";
import { News } from "@/components/News";
import { Career } from "@/components/Career";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { getTranslation } from "@/lib/i18n";
import { db, news, services } from "@/lib/db";

const LOCALES = ["hu", "en", "de", "zh"] as const;
type Locale = (typeof LOCALES)[number];

const NEWS_COLS = {
  hu: { title: news.titleHu, lead: news.leadHu, body: news.bodyHu, published: news.publishedHu },
  en: { title: news.titleEn, lead: news.leadEn, body: news.bodyEn, published: news.publishedEn },
  de: { title: news.titleDe, lead: news.leadDe, body: news.bodyDe, published: news.publishedDe },
  zh: { title: news.titleZh, lead: news.leadZh, body: news.bodyZh, published: news.publishedZh },
} as const;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!LOCALES.includes(locale as Locale)) notFound();
  const t = getTranslation(locale);
  const cols = NEWS_COLS[locale as Locale];

  await connection();
  // EN/DE/ZH locale columns are nullable post-Iter 3A. We only surface
  // rows where the picked locale has a non-null title (defensive: an
  // admin could in theory flip publishedXx without filling titleXx).
  // Lead/body fall back to empty strings since the locale model permits
  // title-only teasers.
  const newsRows = await db
    .select({
      id: news.id,
      title: cols.title,
      lead: cols.lead,
      body: cols.body,
      date: news.date,
    })
    .from(news)
    .where(
      and(
        eq(cols.published, true),
        isNotNull(cols.title),
        isNull(news.deletedAt),
      ),
    )
    .orderBy(desc(news.date));

  const articles = newsRows.map((r) => ({
    id: r.id,
    title: r.title ?? "",
    lead: r.lead ?? "",
    body: r.body ?? "",
    date: r.date.toISOString(),
  }));

  // Service-of-interest dropdown options for the Contact form. Same
  // active+published+top-level filter and JS-side HU fallback as
  // Services.tsx (P2 C2) and Footer.tsx (P2 C3) — Contact is a
  // client component so we fetch here and pass serializable props.
  // Wire-format contract: option `value` MUST be services.slug
  // (string) — never the numeric services.id — so /api/contact
  // validation and lib/email-templates/notification.ts
  // SERVICE_LABELS_HU keep working unchanged.
  //
  // Backlog (after P2 C5 lands a 4th call site): extract a shared
  // lib/db/queries/services.ts helper. Premature now.
  const serviceRows = await db
    .select({
      slug: services.slug,
      nameHu: services.nameHu,
      nameEn: services.nameEn,
      nameDe: services.nameDe,
      nameZh: services.nameZh,
    })
    .from(services)
    .where(
      and(
        eq(services.isActive, true),
        eq(services.isPublished, true),
        isNull(services.parentId),
      ),
    )
    .orderBy(asc(services.sortOrder));

  const serviceOptions = serviceRows
    .map((row) => {
      const namesByLocale = {
        hu: row.nameHu,
        en: row.nameEn,
        de: row.nameDe,
        zh: row.nameZh,
      } as const;
      const label =
        namesByLocale[locale as Locale]?.trim() ||
        row.nameHu?.trim() ||
        "";
      return { slug: row.slug, label };
    })
    .filter((opt) => opt.label.length > 0);

  return (
    <>
      <Nav t={t} />
      <main>
        <Hero t={t} />
        <About t={t} />
        <Services locale={locale} />
        <References t={t} />
        <Certifications t={t} locale={locale} />
        <News t={t} locale={locale} articles={articles} />
        <Career t={t} locale={locale} />
        <Contact
          t={t}
          locale={locale}
          serviceOptions={serviceOptions}
        />
      </main>
      <Footer t={t} locale={locale} />
    </>
  );
}
