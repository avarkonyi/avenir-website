# AOS Guard Log / Elektronikus őrnapló

Status: future AOS module

Priority: after mini-CRM and after the public lead-generation layer is stable.

Do not implement yet.

## Strategic Role

AOS Guard Log is a future electronic guard log system for guarding, reception, monitoring, event-security, and facility operations.

It should support Avenir's object guarding, reception, monitoring, FM, incident handling, handover, and client reporting operations by replacing paper-based or ad hoc reporting with structured digital records.

Positioning:

- internal operational tool first;
- later client-facing reporting layer;
- connected to object guarding, reception, monitoring, event security, Hard FM, Soft FM, incident reporting, and service quality;
- supports trust, auditability, documentation, and operational control;
- may later include an AI Report Assistant, but only as a supervisor-reviewed drafting tool.

Do not let this module overtake the current public website priorities:

1. Service detail pages
2. References / trust layer
3. SEO/GEO sprint
4. Conversion improvements
5. Mini-CRM
6. Electronic Guard Log discovery
7. Manual electronic forms MVP
8. AI Report Assistant discovery and pilot
9. Supervisor approval workflow
10. OneDrive / SharePoint reporting integration
11. Client-facing reporting layer

## MVP Concept

Tablet-friendly or mobile-friendly interface for guards and site staff to record:

- service start / service end;
- daily guard log entries;
- incident records;
- patrol or checkpoint records;
- key handover records;
- visitor/vendor irregularity notes;
- shift handover notes;
- site-specific instruction acknowledgement;
- supervisor/admin review;
- filtering by site, client, service, date, status, and responsible person;
- exportable reports.

## Industry-Specific Operational Registers

Future registers should be designed around real service workflows, not as one generic free-text log.

Candidate register types:

- Kulcskiadás / kulcsátvétel regiszter;
- Látogatói beléptetés regiszter;
- Beszállítói beléptetés regiszter;
- Gépjármű / teherforgalom regiszter;
- Járőr / ellenőrzési pont regiszter;
- Szolgálatátadás regiszter;
- Rendkívüli esemény jelentés;
- Káresemény / incidens jelentés;
- Talált tárgy / átadás-átvétel regiszter;
- Karbantartási vagy FM hibabejelentés;
- Napi szolgálati összefoglaló.

Potential service-specific mapping:

Objektumőrzés:

- patrol log;
- incident report;
- gate irregularity;
- key handover;
- vehicle entry issue.

Portaszolgálat:

- visitor log;
- supplier/vendor log;
- key handling;
- package/document handover;
- front desk irregularity.

Távfelügyelet:

- signal handling log;
- escalation log;
- dispatch request;
- event closure report.

Rendezvénybiztosítás:

- crowd/security event report;
- entry control issue;
- lost/found item;
- emergency escalation.

Hard FM:

- technical issue report;
- maintenance request;
- contractor handover;
- downtime report.

Soft FM:

- cleaning quality issue;
- green area issue;
- operational support note.

## AI Report Assistant

Working module name: AOS Guard Log + AI Report Assistant.

Hungarian names to evaluate:

- Elektronikus őrnapló;
- AI jelentésasszisztens;
- Rendkívüli esemény jelentésasszisztens;
- Szolgálati jelentés asszisztens.

The AI Report Assistant should help turn rough field notes into formal report drafts. It is not an autonomous reporting, decision-making, disciplinary, legal-assessment, or client-communication system.

Human-in-the-loop rule:

- the AI assistant can only transform and structure recorded facts;
- it must not infer intent, blame, liability, legal breach, or disciplinary responsibility;
- every client-facing output requires explicit human approval;
- AI-assisted output should stay internal until approved by the responsible supervisor or territorial manager.

The AI Report Assistant must not be positioned as:

- automated decision-making;
- employee surveillance;
- disciplinary automation;
- automatic client notification;
- legal assessment tool.

Example raw note:

> 22:14 kapu 2-nél kamion papír nélkül jött. Nem engedtem be. Sofőr ideges volt. Hívtam műszakvezetőt. 22:30 elment.

Expected AI support:

- rewrite rough notes into formal Hungarian business language;
- preserve factual content;
- structure the report by fields;
- generate incident summary;
- generate client-ready wording only as a draft;
- flag missing required data;
- propose neutral, non-accusatory language;
- format report for supervisor review;
- prepare email/report text only after human approval.

The assistant should flag missing information such as:

- exact time;
- site;
- gate/location;
- involved person/vehicle;
- license plate;
- who was notified;
- what action was taken;
- whether damage/injury occurred;
- whether the client must be notified.

The AI Report Assistant must not:

- invent details;
- alter facts;
- remove material facts;
- create legal conclusions;
- infer intent, blame, liability, legal breach, or disciplinary responsibility;
- blame people without recorded evidence;
- send reports automatically;
- hide or overwrite the original raw note;
- act without approval.

## Approval Workflow

The client-facing workflow must remain human-approved.

1. Guard creates raw note.
2. AI creates formal report draft.
3. AI flags missing fields.
4. Guard or supervisor completes missing information.
5. Territorial manager / supervisor reviews.
6. Supervisor approves or requests correction.
7. Only an approved report can be sent to the client.
8. Original raw note, AI draft, approved version, and sent version are all preserved.

Roles:

- Guard can create raw notes and complete missing fields.
- AI can create drafts and flag missing data.
- Supervisor or territorial manager can approve or request correction.
- Admin can view the audit trail.
- Client-facing reports can be sent only after approval.

Suggested statuses:

- draft_raw
- ai_draft
- needs_missing_info
- supervisor_review
- correction_requested
- approved
- sent_to_client
- archived

## Data and Versioning Requirements

For every AI-assisted report, preserve:

- raw guard note;
- normalized AI draft;
- missing-field checklist;
- supervisor-edited version;
- final approved version;
- sent-to-client version;
- timestamps;
- author;
- reviewer;
- role;
- approval state;
- correction requests;
- supervisor decisions;
- audit trail.

This versioning is mandatory for auditability. AI must never overwrite the original guard note.

## Future Legal and Privacy Design Questions

Before implementation, legal/privacy design must answer at least:

- What is the lawful basis for storing guard notes and incident logs?
- What data minimization rules apply to raw notes, AI drafts, approved reports, and sent reports?
- What retention period applies to raw notes, AI drafts, approved reports, sent reports, photos, and attachments?
- Which roles can access raw notes, AI drafts, approved reports, sent reports, and audit trails?
- May client-visible reports contain personal data, and if yes, under what scope and minimization rules?
- Are license plates, names, phone numbers, photos, CCTV references, or other personal data stored?
- Does the AI provider processing require a data processing agreement?
- Are AI prompts and outputs stored, logged, or reused by the provider?
- Must AI-assisted drafts be marked internally as AI-assisted?
- How are corrections, missing-field completions, approval decisions, and supervisor edits audit-logged?
- How are client-facing report sends logged, including sender, timestamp, recipient, and approved source version?

## Potential MVP Modules

1. Guard log entries
2. Incident reporting
3. Key handover
4. Visitor/vendor irregularity records
5. Shift handover
6. Site instructions
7. Supervisor review
8. Admin reporting
9. AI-assisted report drafting, only after manual forms are stable

## Future Features

- tablet UI;
- QR checkpoint scanning;
- offline mode;
- photo attachments;
- OneDrive / SharePoint report folders;
- weekly client reports;
- automatic escalation workflow;
- role-based access:
  - guard
  - supervisor
  - territorial manager
  - admin
  - client read-only
- digital signature / handover acknowledgement;
- integration with mini-CRM / client/site records;
- PDF / CSV export;
- report scheduling;
- audit log;
- AI-assisted weekly/monthly report summaries, subject to human review.

## Future Integration Notes

- can connect to mini-CRM clients/sites;
- can connect to OneDrive / SharePoint report folders;
- can generate PDF reports;
- can support weekly client summaries;
- can connect to service detail pages as operational proof;
- can become part of the broader Avenir Operating System.

## Compliance-Safe Language

Do not call this a surveillance, employee-monitoring, or worker-tracking product.

Use:

- electronic guard log;
- operational reporting;
- structured service documentation;
- incident and handover logging;
- patrol/checkpoint documentation;
- service quality documentation;
- client reporting;
- supervisor-approved report workflow;
- AI-assisted draft.

Avoid:

- employee surveillance;
- tracking workers;
- monitoring guards;
- performance policing;
- hidden monitoring;
- automatic disciplinary reporting.

AI wording rules:

- AI output must be treated as a draft.
- AI must be human-in-the-loop by design.
- AI must not invent facts.
- AI must only transform and structure recorded facts.
- AI must not make legal conclusions.
- AI must not infer intent, liability, legal breach, or disciplinary responsibility.
- AI must not assign blame without recorded evidence.
- AI-assisted output should be marked internally as AI-assisted draft.
- Client-facing report text must be human-approved before sending.

Staff activity logs and AI-assisted reports may create privacy, labor-law, proportionality, and data-retention questions. Legal/privacy review is required before production use.

## Suggested Phasing

Phase 0:

- Discovery only.
- Collect examples of current paper logs, incident reports, key registers, guard notes, and client report formats.
- Define legal/privacy constraints.
- Define minimum record types.
- Define which industry-specific register should be MVP first.

Phase 1:

- Manual electronic forms:
  - raw guard log;
  - incident report;
  - key handover;
  - visitor/vendor irregularity;
  - shift handover.

Phase 2:

- AI draft assistant:
  - rewrite raw notes;
  - flag missing fields;
  - generate supervisor-review draft.

Phase 3:

- Supervisor approval workflow:
  - approve;
  - request correction;
  - send to client;
  - preserve audit trail.

Phase 4:

- Client reporting:
  - PDF export;
  - email text;
  - OneDrive / SharePoint folder storage;
  - weekly/monthly report summaries.

Phase 5:

- Tablet UI:
  - fast field entry;
  - large buttons;
  - offline-aware design;
  - QR checkpoint support.

## Decisions Needed

- Which register should be MVP first?
- Should the first pilot be Objektumőrzés or Portaszolgálat?
- Who approves reports: supervisor, territorial manager, or admin?
- Should AI drafts be visible to the client before approval? Recommended default: no.
- What minimum fields are mandatory for incident reports?
- Should photos be included in MVP?
- Should reports be sent by email or stored first in OneDrive?
- Should clients have read-only access later?
- What legal/privacy rules apply to guard notes and staff activity logs?
- Should AI output be marked as "AI-assisted draft" internally?
- What is the minimum report format a client would value?
- Which retention period applies to raw notes, AI drafts, approved reports, and sent reports?
