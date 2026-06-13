import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TrustCenterPage } from "@/components/TrustCenterPage";
import { getTranslation } from "@/lib/i18n";
import {
  buildTrustCenterMetadata,
  getTrustCenterContent,
} from "@/lib/trust-center-content";

export function generateStaticParams() {
  return [{ locale: "hu" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "hu") notFound();
  return buildTrustCenterMetadata("hu");
}

export default async function HungarianTrustCenterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale !== "hu") notFound();
  const t = getTranslation("hu");
  return (
    <TrustCenterPage
      t={t}
      locale="hu"
      content={getTrustCenterContent("hu")}
    />
  );
}

