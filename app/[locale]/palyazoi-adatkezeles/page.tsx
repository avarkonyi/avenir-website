import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RecruitmentPrivacyPage } from "@/components/RecruitmentPrivacyPage";
import { buildRecruitmentPrivacyMetadata } from "@/lib/recruitment-privacy-routes";

// Hungarian recruitment privacy notice (PL-091 Option B). This slug is
// HU-only: the English counterpart lives at /en/recruitment-privacy, and
// any other locale/slug combination returns 404.

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
  return buildRecruitmentPrivacyMetadata("hu");
}

export default async function HuRecruitmentPrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale !== "hu") notFound();
  return <RecruitmentPrivacyPage locale="hu" />;
}
