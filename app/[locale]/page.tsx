import { connection } from "next/server";
import { desc, eq } from "drizzle-orm";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Services } from "@/components/Services";
import { References } from "@/components/References";
import { News } from "@/components/News";
import { Career } from "@/components/Career";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { getTranslation } from "@/lib/i18n";
import { db, news } from "@/lib/db";

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
  const t = getTranslation(locale);
  const cols = NEWS_COLS[locale as Locale];

  await connection();
  const newsRows = await db
    .select({
      id: news.id,
      title: cols.title,
      lead: cols.lead,
      body: cols.body,
      date: news.date,
    })
    .from(news)
    .where(eq(cols.published, true))
    .orderBy(desc(news.date));

  const articles = newsRows.map((r) => ({
    id: r.id,
    title: r.title,
    lead: r.lead,
    body: r.body,
    date: r.date.toISOString(),
  }));

  return (
    <>
      <Nav t={t} />
      <main>
        <Hero t={t} />
        <About t={t} />
        <Services t={t} />
        <References t={t} />
        <News t={t} locale={locale} articles={articles} />
        <Career t={t} />
        <Contact t={t} />
      </main>
      <Footer t={t} />
    </>
  );
}
