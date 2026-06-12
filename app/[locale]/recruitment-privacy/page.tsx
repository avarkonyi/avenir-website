import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RecruitmentPrivacyPage } from "@/components/RecruitmentPrivacyPage";
import { buildRecruitmentPrivacyMetadata } from "@/lib/recruitment-privacy-routes";

// English recruitment privacy notice (PL-091 Option B). This slug is
// EN-only: the authoritative Hungarian counterpart lives at
// /hu/palyazoi-adatkezeles, and any other locale/slug combination
// returns 404.

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
  return buildRecruitmentPrivacyMetadata("en");
}

export default async function EnRecruitmentPrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale !== "en") notFound();
  return <RecruitmentPrivacyPage locale="en" />;
}
