# AOS Guard Log / Elektronikus őrnapló

Status: future AOS module

Priority: after mini-CRM and after the public lead-generation layer is stable.

Do not implement yet.

## Strategic Role

AOS Guard Log is a future electronic guard log system for guarding, reception, and security operations.

It should support Avenir's object guarding, reception, monitoring, and reporting operations by replacing paper-based or ad hoc reporting with structured digital records.

Positioning:

- internal operational tool first;
- later client-facing reporting layer;
- connected to object guarding, reception, monitoring, incident reporting, and service quality;
- supports trust, auditability, documentation, and operational control.

Do not let this module overtake the current public website priorities:

1. Service detail pages
2. References / trust layer
3. SEO/GEO sprint
4. Conversion improvements
5. Mini-CRM
6. Electronic Guard Log MVP discovery
7. Electronic Guard Log MVP implementation
8. OneDrive / SharePoint reporting integration
9. Client-facing reporting layer

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

## Potential MVP Modules

1. Guard log entries
2. Incident reporting
3. Patrol/checkpoint records
4. Key handover
5. Shift handover
6. Site instructions
7. Supervisor review
8. Admin reporting

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
  - admin
  - client read-only
- digital signature / handover acknowledgement;
- integration with mini-CRM / client/site records;
- PDF / CSV export;
- report scheduling;
- audit log.

## Compliance-Safe Language

Do not call this a surveillance or employee-monitoring product.

Use:

- electronic guard log;
- operational reporting;
- structured service documentation;
- incident and handover logging;
- patrol/checkpoint documentation;
- client reporting.

Avoid:

- employee surveillance;
- tracking workers;
- monitoring guards;
- performance policing;
- hidden monitoring.

Staff activity logs may create privacy, labor-law, and proportionality questions. Legal/privacy review is required before production use.

## Suggested Phasing

Phase 0:

- Discovery only.
- Collect existing paper/process examples.
- Define legal/privacy constraints.
- Define minimum record types.

Phase 1:

- Internal MVP:
  - service log;
  - incident log;
  - shift handover;
  - admin review.

Phase 2:

- Site/client structure:
  - clients;
  - sites;
  - services;
  - assigned guards/supervisors;
  - role-based access.

Phase 3:

- Tablet UI:
  - fast entry;
  - large controls;
  - offline-aware design;
  - checkpoint flow.

Phase 4:

- Reporting:
  - PDF/CSV exports;
  - weekly reports;
  - OneDrive / SharePoint folder links.

Phase 5:

- Client-facing layer:
  - read-only client portal;
  - report history;
  - SLA/incident overview;
  - dashboards.

## Decisions Needed

- Should the first version be internal-only?
- Tablet-first or mobile-first?
- Which roles are needed first?
- Which service should be pilot: objektumőrzés or portaszolgálat?
- Should QR checkpoints be MVP or later?
- Are photo attachments needed in MVP?
- Should reports go to OneDrive/SharePoint?
- Should clients get read-only access?
- What legal/privacy rules apply to staff activity logs?
- What is the minimum report format a client would value?
