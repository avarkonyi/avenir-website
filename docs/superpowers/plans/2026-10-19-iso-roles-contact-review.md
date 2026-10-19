# ISO roles and contact data-flow review

> **For agentic workers:** Use superpowers:subagent-driven-development for the delegated contact fixes; independent agents review public evidence and the ISO implementation.

**Goal:** Make the ISO schema identify the certified company, issuer and accreditor accurately, and record the actual contact-data flow against the accepted Hungarian privacy copy.

**Architecture:** Keep the current certificate IDs, PDFs, CMS columns and visual design. Represent management-system certificates with Schema.org `Certification`, linked from the company by `hasCertification`; represent the issuer's accreditation as its credential, recognized by the accreditation body. The legacy IAF checkbox describes a mark on the PDF, never membership of Avenir or its issuer.

**Tech stack:** Next.js, TypeScript, Drizzle, existing node:test/tsx and Preview smoke tools. No new dependencies or database writes.

## Accepted scope

The owner accepted the existing ISO evidence and the Hungarian legal baseline, and approved this work with “csináld”. Base commit: `8411529` (approved visual refresh). Production release still follows the separate post-Preview approval gate in AGENTS.md.

## Steps

- [x] Add behavioral tests in `tests/schema-localization.test.ts`: certificate → Avenir `about`, company → certificate `hasCertification`, certificate → issuer `issuedBy`, issuer → accreditation credential → NAH `recognizedBy`; optional fields must not fabricate accreditation or membership. Red → green verified, including a separate direct-link regression.
- [x] Implement in `lib/homepage-schema.ts` and align `components/Certifications.tsx` microdata with the same stable IDs and roles. Preserve certificate number, full standard name, dates, PDF URLs and all visual styles. Remove unscoped `IAF MLA member=true` and unsupported certificate `additionalProperty` output. Keep category localization for the visible/accessibility text.
- [x] Clarify the legacy IAF admin checkbox in `app/admin/(dashboard)/certifications/_components/CertificationForm.tsx`; keep its stored column unchanged. Remove unused public membership labels from dictionaries/schema copy.
- [x] Verify a direct registry record before adding it. NAH issuer accreditation verified and linked; the Avenir IAF detail record was CAPTCHA-blocked, so the clearly labeled generic search remains. No fabricated company/certificate URL.
- [x] Save a source-referenced contact flow report: submitted fields, stores, mail recipients, logging, consented GA4 events, retention implementation and configuration limitations. No form submission, mail or database write.
- [x] Resolve the two demonstrated code mismatches found by that audit: remove user-selected homepage form service values from GA4 and replace raw Resend error logging with bounded diagnostics. Synthetic errors and a fully mocked contact endpoint prove the regressions; approved consent wording and public service-link analytics remain. Historical documentation honors the accepted HU baseline.
- [x] Run unit tests (221), lint, TypeScript, copy guard (33) and a production build (100 pages) with verified staging. Offline browser regression: 3/3. Initial build found a missing NODE_ENV in a test fixture; fixed and reverified. Independent ISO source review passed; final contact review recorded alongside release evidence.
- [ ] Create a PR and Vercel Preview; run GET-only smoke, six-locale schema checks and public/admin visual QA. Record deployment SHA and limits. Production release is requested only with the concrete reviewed result.

## Schema contract

```text
Avenir (#organization)
  hasCertification -> existing #credential-* IDs
Certification
  about -> Avenir
  issuedBy -> PDF issuer
    hasCredential -> accreditation (only if body or identifier exists)
      credentialCategory -> localized "Accreditation"
      identifier -> NAH accreditation number (when present)
      recognizedBy -> named accreditation body (when present)
  name -> complete standard code, falling back to certificate display name
  identifier / certificationIdentification -> certificate number
  datePublished / expires -> existing CMS dates
  url -> existing public PDF
```

Sources: https://schema.org/Certification, https://schema.org/issuedBy, https://schema.org/hasCertification, https://schema.org/recognizedBy. Existing PDFs are the accepted issuer/standard/validity evidence; no new certification or legal claim is introduced.
