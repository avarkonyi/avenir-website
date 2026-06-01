# Analytics Privacy Review TODO

Date: 2026-05-28

## Current Implementation Summary

The website includes a direct GA4 integration using `NEXT_PUBLIC_GA4_ID`. Google
Analytics is not loaded until the visitor accepts analytics consent in the
first-party consent banner. The consent choice is stored client-side and can be
changed from the footer Cookie settings control.

Provider: Google Analytics / Google

Integration type: direct GA4 `gtag.js`, not Google Tag Manager

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

## Review Status

DPO/legal review is required before treating the public privacy notice as final
for this analytics implementation. The public HU/EN Privacy Policy text has been
aligned to the current consent-gated GA4 implementation, but this repository
change is not a legal approval.

GA4 Enhanced Measurement settings should be reviewed before relying on the
privacy notice as final, especially form interactions, outbound clicks, file
downloads, site search, and any future measurement setting that could collect
more detail than the current code-level event list. The implementation is
privacy-first, but account-side GA4 settings remain a separate review item.
