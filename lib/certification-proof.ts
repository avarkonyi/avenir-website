// Verified 2026-10-19. This record accredits the certification body, not Avenir.
// It also records the MartonCert -> MCert name change on 2026-04-16.
export const NAH_MCERT_ACCREDITATION_URL =
  "https://nah.gov.hu/hu/szervezet/mcert-rendszertanusito-/";

export const IAF_CERTIFICATE_SEARCH_URL = "https://www.iafcertsearch.org";

export function accreditationVerificationUrl(cert: {
  readonly issuer: string;
  readonly accreditationBody: string | null;
  readonly accreditationNumber: string | null;
}): string | null {
  if (
    cert.accreditationBody === "NAH" &&
    cert.accreditationNumber === "NAH-4-0047/2023" &&
    ["MartonCert Rendszertanúsító Kft.", "MCert Rendszertanúsító Kft."].includes(cert.issuer)
  ) return NAH_MCERT_ACCREDITATION_URL;
  return null;
}
