# Trust Center Links Implementation Plan

> **For agentic workers:** Use superpowers:subagent-driven-development for implementation and independent review. Track completion with the checkboxes below.

**Goal:** Make the existing HU/EN Trust Center accessible from the approved footer and contextual locations.

**Architecture:** Use one small locale-aware navigation helper and one server-rendered contextual callout. Footer renders a normal link using the same helper. Reuse the existing route guards and paths; do not expand locale or service publication.

**Tech Stack:** Next.js App Router, React, TypeScript, existing CSS; no dependency changes.

## Task 1 — Shared navigation and contextual component

Files: create `lib/trust-center-navigation.ts`, `components/TrustCenterCallout.tsx`; modify `app/globals.css` for the contextual link only.

- [ ] Implement this helper using the existing route module:

```ts
import { isTrustCenterLocale, trustCenterPath } from "./trust-center-routes";

const COPY = {
  hu: {
    label: "Megfelelőségi központ",
    description: "Tekintse át cégadatainkat, ISO-tanúsítványainkat és engedélyezési információinkat.",
  },
  en: {
    label: "Trust Center",
    description: "View our company details, ISO certificates and licensing information.",
  },
} as const;

export function getTrustCenterNavigation(locale: string) {
  if (!isTrustCenterLocale(locale)) return null;
  return { href: trustCenterPath(locale), ...COPY[locale] };
}
```

- [ ] Render the callout with Next Link and a null result for unsupported locales:

```tsx
import Link from "next/link";
import { getTrustCenterNavigation } from "@/lib/trust-center-navigation";

export function TrustCenterCallout({ locale }: { locale: string }) {
  const link = getTrustCenterNavigation(locale);
  if (!link) return null;
  return (
    <p className="trust-center-callout">
      {link.description}
      <br />
      <Link href={link.href} className="trust-center-callout__link">{link.label}</Link>
    </p>
  );
}
```

- [ ] Add only scoped styles: callout margin 24px 0 0, font 15px, line-height 1.6, body colour #556070; link navy #0B1E3E, weight 600, underline offset 3px, inline-block with margin-top 6px. Give the contextual link a 2px #0B1E3E focus-visible outline with offset 4px. No global anchor reset.

## Task 2 — Approved placements

Files: `components/Footer.tsx`, `components/Certifications.tsx`, `app/[locale]/szolgaltatasok/[slug]/page.tsx`.

- [ ] Footer: calculate `const trustCenterLink = getTrustCenterNavigation(locale);`, then render this item after the existing legal links and before cookie settings:

```tsx
{trustCenterLink && (
  <li>
    <Link href={trustCenterLink.href} className="footer-link" style={{ color: "var(--avenir-on-dark-muted)", fontSize: 13, textDecoration: "none" }}>
      {trustCenterLink.label}
    </Link>
  </li>
)}
```

- [ ] Certifications: import the contextual component and insert `<TrustCenterCallout locale={locale} />` immediately after the certifications grid, inside the existing section/container.
- [ ] Services: import the contextual component and insert it after the trust-card grid, inside the existing trust Section:

```tsx
{(slug === "objektumorzes" || slug === "portaszolgalat") && (
  <TrustCenterCallout locale={locale} />
)}
```

The component itself guards locales. Do not alter service copy, routes, schema, sitemap, nav, legal documents, package files or DB code.

## Task 3 — Verification and review

- [ ] Run existing `npm run test`, `npm run lint`, `tsc --noEmit`, `npm run qa:copy` and `npm run build` with the verified staging connection for build reads. Keep secrets out of output.
- [ ] Inspect rendered HTML for HU/EN home, two primary services, one other service, the two Trust Centers, and a review-locale home/service. Confirm placement and language, existing canonical/noindex behavior, and working targets.
- [ ] Inspect desktop and mobile layouts and keyboard focus. This is a low-impact navigation edit: do not add implementation-mirroring unit tests; use existing coverage plus the rendered-page acceptance checks.
- [ ] Independent spec review, then code-quality review; resolve material findings.

## Task 4 — Preview handover

- [ ] Commit only the scoped implementation and documentation.
- [ ] Push the feature branch, create and attach a PR, inspect the matching Vercel Preview commit and readiness, then run the targeted checks there.
- [ ] Record evidence and mark A01 as ready for review, not production-closed. Share the preview and PR; production approval belongs to the concrete reviewed result.
