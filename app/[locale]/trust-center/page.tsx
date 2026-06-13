import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TrustCenterPage } from "@/components/TrustCenterPage";
import { getTranslation } from "@/lib/i18n";
import {
  buildTrustCenterMetadata,
  getTrustCenterContent,
} from "@/lib/trust-center-content";

export function generateStaticParams() {
  return [{ locale: "en" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "en") notFound();
  return buildTrustCenterMetadata("en");
}

export default async function EnglishTrustCenterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale !== "en") notFound();
  const t = getTranslation("en");
  return (
    <TrustCenterPage
      t={t}
      locale="en"
      content={getTrustCenterContent("en")}
    />
  );
}

