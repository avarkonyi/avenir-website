# Google Analytics Processor Review

Date: 2026-06-13

This note supports DPO/legal review of the Google Analytics 4 processor and
international-transfer wording added to the website privacy notices. It is not
a final legal approval and does not publish Google DPA, SCC or account
configuration evidence.

## Current Runtime Facts

- Integration type: direct Google Analytics 4 (GA4) through `gtag.js`.
- Measurement ID source: `NEXT_PUBLIC_GA4_ID`.
- Google Tag Manager is not used.
- LinkedIn Insight Tag is not used.
- Google Ads, remarketing, DoubleClick, pagead and Floodlight endpoints are
  not implemented or allowlisted.
- GA4 loads only after analytics consent is accepted.
- If analytics consent is rejected, GA4 does not load.
- Analytics events do not include name, email address, phone number, company
  name, message text or free-text form content.
- Service quote analytics events are PII-free.

## Processor Wording Added

The HU, EN and DE website privacy notices now identify Google Analytics 4 as a
processor/provider entry:

- provider: Google Ireland Limited / Google LLC, as applicable under the
  contractual and service terms for Google Analytics;
- service: Google Analytics 4 (GA4);
- purpose: consent-based aggregated analysis of website traffic and usage;
- data categories: online identifiers, cookie identifiers, IP addresses,
  device identifiers, client identifiers and technical browsing event data;
- restriction: Avenir does not send names, email addresses, phone numbers,
  company names, message text or free-text form content to Google Analytics;
- legal basis: consent under GDPR Article 6(1)(a).

## Transfer Wording Added

The HU, EN and DE website privacy notices now state cautiously that, when
Google Analytics is used, data may be transferred to or accessed by Google
group entities or subprocessors outside the EEA. The wording refers to the
Data Privacy Framework and/or Standard Contractual Clauses as potentially
relevant safeguards, subject to Google's current data-processing terms and
transfer frameworks.

The wording intentionally does not state that DPF or SCCs are the sole or final
transfer mechanism.

## Official Google Sources Checked

- Google Ads Data Protection Terms: Service Information lists Google Analytics
  as a processor service and identifies the relevant personal-data types as
  online identifiers, including cookie identifiers, IP addresses, device
  identifiers and client identifiers.
- Google Business Data Responsibility / compliance materials describe
  Google's data-protection compliance posture and product controls.

## DPO / Legal Review Checklist

- Google Analytics account DPA / Data Processing Terms accepted?
- Exact Google contracting entity confirmed in the relevant account and terms?
- GA4 data-retention setting documented?
- Google Signals disabled or documented?
- Ads personalization disabled or documented?
- Google Ads link disabled or documented?
- Data sharing settings reviewed?
- Enhanced Measurement settings reviewed, especially form interactions,
  outbound clicks, file downloads and site search?
- Consent banner behavior verified: no GA before consent; reject blocks GA;
  settings can be reopened?
- Processor / subprocessor links reviewed?
- Transfer safeguards reviewed against Google's current DPF/SCC framework?

## Remaining Evidence Items

- Screenshot or export of Google Analytics DPA acceptance / admin settings.
- Screenshot or export of GA4 data-retention setting.
- Screenshot or export showing Google Signals / Ads personalization / Ads link
  status.
- DPO/legal sign-off that v1.3 privacy wording is acceptable for publication.

