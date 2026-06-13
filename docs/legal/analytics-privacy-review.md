# Analytics Privacy Review TODO

Date: 2026-06-13

## Current Implementation Summary

The website includes a direct GA4 integration using `NEXT_PUBLIC_GA4_ID`. Google
Analytics is not loaded until the visitor accepts analytics consent in the
first-party consent banner. The consent choice is stored client-side and can be
changed from the footer Cookie settings control.

Provider: Google Analytics / Google

Integration type: direct GA4 `gtag.js`, not Google Tag Manager

Privacy notice status: HU/EN/DE source was updated to version 1.3 with Google
Analytics 4 processor and transfer wording. This is a content/legal notice
clarification only; analytics runtime behavior was not changed.

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
- `special_service_option_selected`
- `service_quote_cta_click`
- `service_quote_form_open`
- `service_quote_form_start`
- `service_quote_form_submit_success`
- `service_quote_form_submit_error`

## Data Categories

Allowed event parameters:

- locale
- path
- predefined service key
- predefined service label
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
