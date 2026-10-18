import Link from "next/link";
import { getTrustCenterNavigation } from "@/lib/trust-center-navigation";

export function TrustCenterCallout({ locale }: { locale: string }) {
  const navigation = getTrustCenterNavigation(locale);
  if (!navigation) return null;

  return (
    <p className="trust-center-callout">
      {navigation.description}
      <br />
      <Link href={navigation.href} className="trust-center-callout__link">
        {navigation.label}
      </Link>
    </p>
  );
}
