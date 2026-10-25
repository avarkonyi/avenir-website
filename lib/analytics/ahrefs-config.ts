// Enable only after the Ahrefs DPA/SCC release checklist has been completed.
// This is a public build-time switch, not a credential.
export function isAhrefsAnalyticsEnabled(): boolean {
  return process.env.NEXT_PUBLIC_AHREFS_ENABLED === "1";
}
