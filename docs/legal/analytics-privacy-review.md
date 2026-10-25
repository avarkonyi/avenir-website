# Analytics Privacy Review TODO

Date: 2026-10-25

Status update 2026-10-19: the owner accepted the lawyer-reviewed Hungarian
legal baseline and the specific consent-copy correction (see
`docs/audits/2026-10-17/owner-confirmations-2026-10-18.md`). The historical
general HU approval request below is superseded. Actual runtime/account
verification remains separate; see the current
[ISO/contact review](../audits/2026-10-19/iso-contact-review.md).

## Current Implementation Summary

The website includes a direct GA4 integration using `NEXT_PUBLIC_GA4_ID`. Google
Analytics is not loaded until the visitor accepts analytics consent in the
first-party consent banner. The consent choice is stored client-side and can be
changed from the footer Cookie settings control.

Provider: Google Analytics / Google

Integration type: direct GA4 `gtag.js`, not Google Tag Manager

Privacy notice status: the public HU/EN/DE accessor adds a targeted v1.4 notice
to the reviewed v1.3 baseline. It identifies Ahrefs and its switch-dependent status,
documents data categories and the transfer prerequisite, and preserves unrelated
legal sections and existing Google/Resend/Vercel/Neon wording. The owner confirmed
on 2026-10-25 that the official SCC was signed and sent and authorised activation.
This records owner attestation, not independent signature/receipt verification.

## Consent Model

- Analytics consent is required before GA4 loads.
- Rejection prevents GA4 loading.
- Missing `NEXT_PUBLIC_GA4_ID` disables GA4 loading.
- Consent settings can be reopened by the visitor.

## Event List

The implementation may emit these events after consent only:

- `page_view`
- `contact_submit_success`
- `contact_submit_error`
- `phone_click`
- `email_click`
- `service_cta_click`
- `service_quote_cta_click`
- `service_quote_form_open`
- `service_quote_form_start`
- `service_quote_form_submit_success`
- `service_quote_form_submit_error`

## Data Categories

Allowed event parameters:

- locale
- path
- predefined public page/link service key (not the homepage form selection)
- predefined public page/link service label
- event type
- service slug
- form variant, for example `service_embedded`

Excluded from analytics:

- name
- email address
- phone number
- company name
- message body
- free-text form fields
- IP address as an explicit event parameter

## Processor / Transfer Notice

The public privacy notice source names Google Analytics 4 (GA4) as a
processor/provider entry using cautious entity wording: Google Ireland Limited /
Google LLC, as applicable under the contractual and service terms for Google
Analytics.

The notice also states that when Google Analytics is used, data may be
transferred to or accessed by Google group entities or subprocessors outside
the EEA, and that the Data Privacy Framework and/or Standard Contractual
Clauses may be relevant safeguards under Google's current terms.

## Review Status

DPO/legal review is required before treating the public privacy notice as final
for this analytics implementation. The public HU/EN/DE Privacy Policy source
has been aligned to the current consent-gated GA4 implementation, but this
repository change is not a legal approval.

GA4 Enhanced Measurement settings should be reviewed before relying on the
privacy notice as final, especially form interactions, outbound clicks, file
downloads, site search, and any future measurement setting that could collect
more detail than the current code-level event list. The implementation is
privacy-first, but account-side GA4 settings remain a separate review item.

## Ahrefs Web Analytics Addition (Owner-Authorised Activation)

Owner requested Ahrefs Web Analytics using the supplied public installation
key. This is a separate analytics provider, not an ownership-verification tag.
`NEXT_PUBLIC_AHREFS_ENABLED` must be exactly `1`; the owner authorised enabling it
after confirming the official SCC was signed and sent. Consent cannot activate the tag while
the switch is off. Activation changes the consent key to
`avenir_analytics_consent_v2`: prior GA4-only acceptance is not reused; prior
rejection is respected. The banner identifies providers and links to the policy.
See [activation checklist](ahrefs-activation-checklist.md).
The existing first-party analytics consent gate also controls Ahrefs. No script
or collection is requested before opt-in; rejection on a fresh load keeps it
absent. GA4 configuration, event names and consent behavior are unchanged.

Only explicit pageviews are sent. The official script receives a page location
without query or fragment. Its automatic link/form events are suspended during
DOM interaction without preventing navigation or submission. This avoids
sending link targets (including mailto/tel) and form actions to Ahrefs. No
free-text form data or custom properties are passed. When the document referrer
contains query/fragment/credentials or is invalid, Ahrefs is disabled for that
document rather than sending it unchanged. This is an intentional measurement
coverage limitation.

The tag can still send the public page title, safe referrer, language, screen
dimensions and device pixel ratio. HTTP requests necessarily expose network
metadata to the provider. Do not describe this as zero personal-data processing
or make a compliance guarantee. According to Ahrefs' documentation, it derives
location and a rotating daily visitor identifier using IP/user agent, and does
not store raw IP addresses with analytics. Provider-side processing, retention,
contract terms, entity and international-transfer safeguards need DPO/legal
review before the public provider notice is treated as complete.

Withdrawal removes the tag's installation key and disables subsequent event
construction in the current official script; it cannot undo prior execution or
retract consented events already sent. A reload removes the tag completely.
The real-script QA verifies this integration contract with collection requests
intercepted, and must fail if future vendor behavior breaks the suppression.
No user-agent consent exemption is permitted for installation verification.

Release gates:

- Review the Ahrefs provider/transfer and data-category notice with DPO/legal.
- Complete and send SCC Annex I; retain receipt and transfer review internally.
  The owner confirmed signing and sending; independent receipt is not verified.
- Renewed opt-in for the added provider is enforced in code on activation.
- Confirm the current official script still honors the per-event key and
  page-location guards via `qa:analytics`.
- Owner authorised deployment and activation after the signed/sent confirmation.
  Provider receipt and legal/transfer-review records remain owner responsibilities.

Sources:

- https://help.ahrefs.com/en/articles/10247870-about-ahrefs-web-analytics
- https://help.ahrefs.com/en/articles/11381932-tracked-events-in-ahrefs-web-analytics
- https://help.ahrefs.com/en/articles/10631520-troubleshooting-ahrefs-web-analytics-snippet-isn-t-found-on-your-website
