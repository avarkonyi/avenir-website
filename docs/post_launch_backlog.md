# Avenir Website Post-launch Backlog

Last updated: 2026-05-28

This backlog supports the Phase 0-8 roadmap in `docs/product_roadmap.md`.
It is a product/development tracking document, not a deployment approval.

| ID | Phase | Priority | Area | Task | Why it matters | Status | Decision/owner needed | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| PL-001 | Phase 0 | P1 | Contact | Run real production contact form smoke with non-sensitive test content. | Confirms lead intake works after launch and env changes. | Pending verification | Operator / owner | Do not submit sensitive data. |
| PL-002 | Phase 0 | P1 | SEO | Set up or verify Google Search Console and submit `https://www.afm.hu/sitemap.xml`. | Confirms production indexing pipeline. | Pending | Owner / SEO | Monitor coverage after submission. |
| PL-003 | Phase 0 | P1 | SEO | Set up or verify Bing Webmaster Tools and submit sitemap. | Supports Bing/Copilot discovery. | Pending | Owner / SEO | Keep sitemap URL canonical. |
| PL-004 | Phase 0 | P1 | SEO | Run IndexNow submission if approved. | Speeds discovery for updated URLs. | Pending approval | Owner | Do not run automatically without approval. |
| PL-005 | Phase 0 | P1 | Analytics | Verify GA4 Realtime and consented page_view/event flow. | Confirms analytics works without violating consent rules. | Pending verification | Owner / analytics | GA4 loads only after consent. |
| PL-006 | Phase 0 | P1 | QA | Run `npm run qa:preview -- https://www.afm.hu --allow-production`. | Confirms public route matrix and noindex behavior. | Pending recurring check | Developer | Production-safe GET-only smoke. |
| PL-007 | Phase 0 | P1 | QA | Run `npm run qa:analytics -- https://www.afm.hu --allow-production`. | Confirms consent gating, collect flow and PII guards. | Pending recurring check | Developer | Intercepts contact/collect in QA. |
| PL-008 | Phase 0 | P1 | UX | Review mobile overflow on key HU/EN pages. | Prevents poor mobile launch experience. | Pending | UX/dev | Check homepage, service pages, contact. |
| PL-009 | Phase 0 | P1 | UX/Privacy | Review consent banner placement on mobile. | Keeps privacy UI visible but not intrusive. | Pending | UX/legal | Do not change consent behavior without review. |
| PL-010 | Phase 0 | P1 | Navigation | Handle EN news broken-link policy. | Avoids EN public 404 flows. | Pending | Content owner | Hide EN news or link clearly to HU until EN content exists. |
| PL-011 | Phase 0 | P1 | Localization | Audit DE/ZH partial-localization flows. | Avoids links to non-ready DE/ZH routes. | Pending | Product/dev | Keep route-aware language switcher/footer legal behavior. |
| PL-012 | Phase 1 | P1 | Legal/privacy | Sync HU/EN Privacy Policy versions. | Public legal pages must match current consent/contact behavior. | Pending | Legal/DPO | Do not edit legal body without legal review. |
| PL-013 | Phase 1 | P1 | Analytics/privacy | Review analytics privacy documentation and GA4 consent copy. | Required before privacy notice is treated as final. | Pending | Legal/DPO | See `docs/legal/analytics-privacy-review.md`. |
| PL-014 | Phase 1 | P1 | Analytics/privacy | Review GA4 Enhanced Measurement settings. | Account settings can collect more than code-level events. | Pending | Analytics/legal | Pay attention to form interactions. |
| PL-015 | Phase 1 | P1 | Sensitive intake | Improve private investigation dropdown explanation. | Prevents sensitive personal data in general contact flow. | Pending | Legal/product | Do not conflate with complaint handling. |
| PL-016 | Phase 1 | P1 | Contact/legal | Review sensitive-data warning wording. | Reduces legal/privacy risk in form submissions. | Pending | Legal/DPO | Keep warning concise and visible. |
| PL-017 | Phase 1 | P1 | Proof governance | Finalize OPTEN vs D&B governance. | Prevents mislabeling D&B AA as OPTEN A+. | Owner-deferred | Owner/proof reviewer | D&B AA is approved separately. |
| PL-018 | Phase 1 | P1 | Proof governance | Keep `docs/verified_claims.md` current. | Maintains source of truth for public claims. | Ongoing | Proof owner | Track allowed/restricted wording. |
| PL-019 | Phase 2 | P2 | Trust Center | Define Trust Center / Megfelelőségi központ IA. | Gives procurement users one proof/support layer. | Not started | Product/proof owner | Should not be a generic marketing page. |
| PL-020 | Phase 2 | P2 | Dokumentumtár | Design public document library / dokumentumtár. | Makes approved documents discoverable. | Not started | Product/proof owner | Include status and expiry tracking. |
| PL-021 | Phase 2 | P2 | Proof documents | Prepare ISO 9001 and ISO 27001 public certificate entries. | Core procurement trust requirement. | Pending | Proof owner | Use scope-safe wording. |
| PL-022 | Phase 2 | P2 | Proof documents | Prepare security activity licence summary. | Supports regulated-service trust. | Pending | Legal/proof owner | Avoid generic service-page licence-number exposure. |
| PL-023 | Phase 2 | P2 | Proof documents | Decide private investigation licence public scope. | Needed if Special Services/intake mention it. | Pending decision | Legal/owner | Do not publish without scoped approval. |
| PL-024 | Phase 2 | P2 | Proof documents | Add professional liability insurance summary if approved. | Supports tenders/procurement. | Pending decision | Owner/proof reviewer | Publish only with proof and allowed wording. |
| PL-025 | Phase 2 | P2 | Creditworthiness | Add D&B AA proof-safe statement in Trust Center. | Uses approved creditworthiness proof accurately. | Not started | Proof owner | Do not call it OPTEN A+. |
| PL-026 | Phase 2 | P2 | Procurement | Create downloadable procurement/tender pack. | Helps vendor onboarding and sales. | Not started | Sales/proof owner | Include only approved documents. |
| PL-027 | Phase 2 | P2 | Capability PDF | Create HU/EN capability statement PDF. | Useful for tenders, sales emails and LinkedIn follow-up. | Not started | Sales/product | Must match current service labels and claims. |
| PL-028 | Phase 2 | P2 | ESG | Define ESG/sustainability documentation framing. | Supports procurement without unverified ESG claims. | Not started | Owner/proof reviewer | No EcoVadis achieved/rating/medal claims. |
| PL-029 | Phase 2 | P2 | Partner trust | Decide logo wall vs sector icons vs sector text. | Avoids unapproved partner/client claims. | Pending decision | Owner/proof reviewer | Partner logos require approval metadata. |
| PL-030 | Phase 3 | P2 | Complaint handling | Draft Panaszkezelés / complaint handling page or section. | Creates professional escalation process. | Not started | Legal/process owner | Not a whistleblowing system. |
| PL-031 | Phase 3 | P2 | Ethics | Draft Etikai kódex / Code of Ethics public document. | Supports governance and procurement trust. | Not started | Legal/HR/owner | Needs owner and review cadence. |
| PL-032 | Phase 3 | P2 | Complaint intake | Define complaint intake path and internal routing. | Avoids unowned complaints and privacy confusion. | Not started | Process owner | May need separate form from quote contact. |
| PL-033 | Phase 3 | Strategic | Whistleblowing | Decide whether a regulated whistleblowing/ethics reporting system exists or is planned. | Prevents accidental legal overclaim. | Not started | Legal/owner | Do not imply a system before legal/process review. |
| PL-034 | Phase 4 | P2 | Tudástár | Publish article: jó objektumőrzési szolgálati rend. | Builds SEO/procurement depth. | Not started | Editorial owner | Educational, not legal advice. |
| PL-035 | Phase 4 | P2 | Tudástár | Publish article: portaszolgálati és recepciós protokoll. | Supports service understanding and search. | Not started | Editorial owner | No client examples without approval. |
| PL-036 | Phase 4 | P2 | Tudástár | Publish article: távfelügyeleti riasztás-verifikáció. | Explains high-value compliance-sensitive concept. | Not started | Editorial/legal | No guaranteed response wording. |
| PL-037 | Phase 4 | P2 | Tudástár | Publish article: Hard FM és Soft FM különbsége. | Supports FM buyer education. | Not started | Editorial owner | Avoid unverified SLA/statutory guarantees. |
| PL-038 | Phase 4 | P2 | Tudástár | Publish article: próbavásárlás és szolgáltatásaudit limits. | Prevents surveillance/private-investigation confusion. | Not started | Editorial/legal | Keep compliance-safe framing. |
| PL-039 | Phase 4 | P3 | Content | Add procurement checklists and security scope templates. | Useful for tenders and serious leads. | Not started | Product/editorial | Proof-safe templates only. |
| PL-040 | Phase 4 | P3 | Content | Draft event security brief checklist. | Supports Event Security lead quality. | Not started | Editorial/service owner | No event-size or incident-free guarantee. |
| PL-041 | Phase 4 | P3 | Content | Draft data-protection-aware security technology explainer. | Supports Security Technology SEO and compliance clarity. | Not started | Editorial/legal | No legal advice or GDPR guarantee. |
| PL-042 | Phase 4 | P3 | Content | Draft Integrated Facility and Security Operations page. | Positions bundled operations model. | Not started | Product/editorial | HU/EN names defined in roadmap. |
| PL-043 | Phase 4 | P3 | Sector pages | Plan logistics, office, industrial, retail, multi-site and event-venue landing pages. | Expands search coverage. | Not started | Product/SEO | No case studies without approval. |
| PL-044 | Phase 5 | P2 | Conversion | Review lead quality after launch. | Improves sales usefulness of inquiries. | Not started | Sales/product | Use non-PII aggregate analysis. |
| PL-045 | Phase 5 | P2 | Contact UX | Add thank-you state or confirmation page if approved. | Improves user feedback and measurement. | Not started | Product/dev | Keep analytics privacy-safe. |
| PL-046 | Phase 5 | P2 | Contact UX | Improve quote-preparation and “what happens next” copy. | Reduces uncertainty for B2B buyers. | Not started | Product/copy | No guaranteed SLA overclaim. |
| PL-047 | Phase 5 | P2 | Analytics | Mark `contact_submit_success` as GA4 key event if approved. | Helps measure lead conversion. | Pending decision | Owner/analytics | No PII in event params. |
| PL-048 | Phase 5 | P2 | Analytics | Analyze `service_cta_click` and service selection quality. | Shows which services drive leads. | Not started | Analytics/product | Use aggregate data only. |
| PL-049 | Phase 5 | P2 | Analytics | Review `special_service_option_selected` usage. | Identifies sensitive-service interest and warning needs. | Not started | Legal/product | Do not create sensitive-data analytics payloads. |
| PL-050 | Phase 5 | P2 | Performance | Decide on Vercel Analytics / Speed Insights. | Adds performance monitoring. | Pending decision | Owner/dev | Separate from GA4 consent model. |
| PL-051 | Phase 5 | Strategic | Marketing tags | Decide if GTM is needed later. | Only useful if multiple tags exist. | Not needed now | Owner/legal/marketing | Direct GA4 is current architecture. |
| PL-052 | Phase 6 | Strategic | Localization | Choose DE/ZH full rollout or homepage-only model. | Determines route/sitemap/hreflang architecture. | Pending decision | Owner/product | Current model is partial homepage-only. |
| PL-053 | Phase 6 | Strategic | Legal localization | Decide if DE/ZH legal pages will be translated/reviewed. | Legal pages cannot be machine-translated casually. | Pending decision | Legal/owner | No legal route until reviewed. |
| PL-054 | Phase 6 | P3 | Localization QA | Define DE/ZH language switcher and footer legal-link behavior. | Prevents broken 404 flows. | Partly implemented | Product/dev | Keep route-aware. |
| PL-055 | Phase 6 | P3 | Localization QA | Add DE/ZH smoke matrix if full rollout is chosen. | Ensures future locale readiness. | Not started | Dev/product | Only after strategic decision. |
| PL-056 | Phase 7 | Strategic | Special Services | Create content brief for Site Security Audit. | Prepares sensitive service safely. | Not started | Product/legal | No route until approved. |
| PL-057 | Phase 7 | Strategic | Special Services | Create content brief for Data Protection and GDPR Process Review. | Clarifies process-review scope. | Not started | Product/legal | No GDPR compliance/legal advice wording. |
| PL-058 | Phase 7 | Strategic | Special Services | Create content brief for Private Investigation. | Requires controlled intake and careful framing. | Not started | Owner/legal | No hidden monitoring/employee surveillance framing. |
| PL-059 | Phase 7 | Strategic | Special intake | Define sensitive-service intake model. | Standard contact form may be unsafe for sensitive data. | Not started | Legal/product | Needs warnings and routing. |
| PL-060 | Phase 8 | Strategic | AOS | Keep AOS roadmap separate from website. | Prevents internal product scope leaking into public site. | Ongoing | AOS/product owner | Separate repo/app/DB/release. |
| PL-061 | Phase 8 | Strategic | AOS Guard Log | Plan electronic guard log in separate AOS track. | Internal operations capability. | Not started here | AOS owner | Not public website scope. |
| PL-062 | Phase 8 | Strategic | AI Report Assistant | Plan human-reviewed AI report drafting in AOS. | Operational efficiency without public overclaim. | Not started here | AOS/legal | AI must not invent facts or legal conclusions. |
| PL-063 | Phase 8 | Strategic | Proposal generation | Plan proposal generation as internal tooling. | Supports sales/tenders. | Not started here | AOS/sales | Not public service promise. |
| PL-064 | Phase 8 | Strategic | Internal docs | Plan operational handover docs, service instruction templates and escalation matrices. | Builds operational standardization. | Not started here | AOS/operations | Keep separate from public copy. |
| PL-065 | Phase 2 | P2 | Procurement | Plan procurement / tender readiness page. | Gives buyers one place for company data, licences, ISO, insurance, D&B and D-U-N-S. | Not started | Sales/proof owner | Related to Trust Center but can be a focused landing page. |
| PL-066 | Phase 4 | P3 | Integrated operations | Plan Integrated Facility and Security Operations page. | Explains one operating model, reporting rhythm and escalation structure. | Not started | Product/editorial | HU: Integrált telephelyüzemeltetés és vagyonvédelmi működés. |
| PL-067 | Phase 4 | P3 | Career | Decide whether recruitment needs `/karrier` and job detail pages. | Supports hiring if recruitment becomes a growth channel. | Not started | HR/owner | May need JobPosting schema and guard/FM role content. |
| PL-068 | Phase 6 | Strategic | URL architecture | Decide whether future EN-native `/en/services/...` slugs are worth implementing. | Could improve EN UX but requires redirects/canonical/hreflang changes. | Deferred | Product/SEO/dev | Not a launch blocker. Needs 301 plan. |
