# Ahrefs Activation Checklist

Date: 2026-10-25

## Current Decision

On 2026-10-25 the owner confirmed that the official Ahrefs SCC document was
signed and sent to Ahrefs, and explicitly authorised push, production deployment
and measurement activation. This is an **owner attestation**, not independent
inspection of a signed PDF, confirmation of provider receipt, or legal approval
by the development assistant. Signed documents and receipt evidence remain in
the owner's private records, outside the public repository.

## Owner / DPO Actions

1. Review the [current Ahrefs DPA](https://ahrefs.com/legal/data-processing-addendum)
   and linked Annex A (Module 2, controller-to-processor) with the responsible
   adviser; confirm the applicable module and actual data flow.
2. Complete Annex I with current company details. An authorised signatory must
   sign. The development assistant does not sign or accept company terms.
3. Send the signed page to the Ahrefs representative and retain receipt.
   Section 2 ties SCC effectiveness to receipt of the validly signed document.
4. Record provider terms, subprocessors, retention criteria, transfer assessment
   and supplementary measures internally. Do not commit signed documents or
   personal signatory details to the public repository.
5. Record activation approval. This implementation is not a legal guarantee.

## Technical Gate

`NEXT_PUBLIC_AHREFS_ENABLED` is a public **build-time** switch. Missing, `0`, or
any value other than exactly `1` keeps Ahrefs unloaded even after acceptance.
The owner's signed/sent confirmation and activation authorisation permit this
release to enable the switch in the intended Vercel environment after QA.

After approval, enable the switch in the intended Vercel environment and rebuild.
Activation uses `avenir_analytics_consent_v2`: prior GA4-only acceptance is not
reused; prior rejection is preserved. The banner names the active providers and
links to the actual locale Privacy Policy. The policy's active/inactive status
uses the same switch.

## Verification

- Run TypeScript, lint, unit tests, copy guard and build on the current main.
- Run `npm run qa:preview -- <url>` and `npm run qa:analytics -- <url>`;
  production QA requires `--allow-production`.
- Disabled production must show the inactive notice and make **no Ahrefs
  requests after acceptance**. Consented GA4 should still work.
- Enabled-path automated QA sets the switch while all
  Ahrefs collection and contact requests are intercepted. The real tag may be
  downloaded; no measurement is sent to Ahrefs.
- After approved activation, verify consent/reject/withdrawal, a real
  `/api/event` response, SPA pageviews, and absence of form data/query strings.
- Do not bypass consent for the installation-check crawler.

Sources: [Web Analytics](https://help.ahrefs.com/en/articles/10247870-about-ahrefs-web-analytics),
[DPA](https://ahrefs.com/legal/data-processing-addendum),
[privacy and retention](https://ahrefs.com/legal/privacy-policy),
[subprocessors](https://ahrefs.com/legal/subprocessors-list).

Owner follow-up: retain provider receipt and the transfer-review record privately;
review account-side processing and retention with DPO/legal. No document has been
signed or sent by the development assistant. Activation is not a compliance guarantee.
