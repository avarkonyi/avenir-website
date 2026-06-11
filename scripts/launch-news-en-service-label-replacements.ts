// Pure replacement data + transform for the EN launch article terminology
// updater (scripts/update-launch-news-en-service-labels.ts). Kept free of
// env/db side effects so unit tests can import it directly.
//
// Scope: full canonical EN service-name alignment for the launch article
// bodyEn. Replacements are case-sensitive exact phrases; the dry-run output
// of the updater script reports per-replacement occurrence counts.

export const LAUNCH_NEWS_EN_SERVICE_LABEL_REPLACEMENTS = [
  {
    before: "manned guarding",
    after: "On-site Security Guarding",
  },
  {
    before: "reception and concierge services",
    after: "Reception and Gatehouse Services",
  },
  {
    before: "security technology solutions",
    after: "Security Technology",
  },
  {
    before: "remote monitoring and response services",
    after: "Remote Monitoring and Response Service",
  },
] as const;

export function applyLaunchNewsEnServiceLabelTerminology(
  body: string,
): string {
  return LAUNCH_NEWS_EN_SERVICE_LABEL_REPLACEMENTS.reduce(
    (next, replacement) => next.replaceAll(replacement.before, replacement.after),
    body,
  );
}
