import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { getTranslation, LOCALES } from "@/lib/i18n";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = getTranslation(locale);
  return {
    metadataBase: new URL("https://www.afm.hu"),
    title: "Avenir Facility Management Kft.",
    description: t.hero.sub,
    alternates: {
      canonical: `https://www.afm.hu/${locale}`,
      languages: {
        hu: "https://www.afm.hu/hu",
        en: "https://www.afm.hu/en",
        de: "https://www.afm.hu/de",
        zh: "https://www.afm.hu/zh",
        "x-default": "https://www.afm.hu/hu",
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
