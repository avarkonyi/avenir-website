# Fordítási CMS-javítás — alkalmazatlan javaslat

8 szolgáltatás, 68 idegen nyelvű oszlop. EN: 44, DE: 11, ZH: 13. Magyar mező nem változik.

SHA-256: `da02b01b2676c1827b0a621829b9cbe16e2ae4061489e5d984bb0081679431e6`

Cél: staging `ep-twilight-sound-al2b7jsb`. Írás kizárólag külön jóváhagyás után; az élesítés külön lépés.

A JSON-tömböt tartalmazó oszlopoknál a teljes mező előtte–utána látható; az EN-csomag 89 részváltozást tartalmaz.

A friss összehasonlító olvasás eredménye: cms-dry-run.json.

## objektumorzes / short_desc_en

Audit: EDU-026

**Előtte**

```json
"On-site guarding for access, patrol, incident handling, service logging and agreed escalation at business sites."
```

**Utána**

```json
"On-site guarding with access control, patrols, incident handling, service logging and agreed escalation at business sites."
```

## objektumorzes / long_desc_en

Audit: ENS-031, ENS-028

**Előtte**

```json
"The aim of on-site security guarding is not merely to maintain guard presence at the site, but to provide a site-tailored security framework. Following an on-site assessment, Avenir prepares service instructions: it defines the entry and exit points, the handling of visitors and suppliers, patrol routes, key-management rules, incident documentation and the escalation framework.\n\nWhen the site requires it, the service can be aligned with an existing camera system, access-control system or alarm process. The goal is for the client to receive not just presence on site, but a clear service framework: with logging, incident reporting, regular review and a designated responsible point of contact.\n\nSecurity guard presence is adapted to the site's risk profile and contractual requirement: unarmed or, where the legal conditions are met, armed security guarding can also be arranged. Avenir operates under the applicable Hungarian personal and property security licensing framework."
```

**Utána**

```json
"The aim of on-site security guarding is not merely to maintain guard presence at the site, but to provide a site-tailored security framework. Following an on-site assessment, Avenir prepares service instructions: it defines the entry and exit points, the handling of visitors and suppliers, patrol routes, key-management rules, incident documentation and the escalation framework.\n\nThe service can be aligned with an existing camera system, access-control system or alarm process. The goal is for the client to receive not just presence on site, but traceable operations: with a service log, incident reporting, regular review and a designated responsible point of contact.\n\nSecurity guard presence is adapted to the site's risk profile and contractual requirement: unarmed or, where the legal conditions are met, armed security guarding can also be arranged. Avenir provides the service under the applicable Hungarian regulatory framework for personal and property protection."
```

## objektumorzes / included_items_en

Audit: ENS-034, ENS-027

**Előtte**

```json
[
  "Entry and exit point management",
  "Visitor, supplier and key management",
  "Patrols, check points and area walk-throughs",
  "Incident recording and escalation",
  "Service log and agreed reporting",
  "On-site security assessment and protocol recommendation",
  "Integration with an existing camera system, access control or alarm process where the site requires it"
]
```

**Utána**

```json
[
  "Support for entry and exit control procedures",
  "Visitor, supplier and key management",
  "Patrols, checkpoints and area walk-throughs",
  "Incident recording and escalation",
  "Service log and agreed reporting",
  "On-site security assessment and protocol recommendation",
  "Integration with an existing camera system, access control or alarm process where the site requires it"
]
```

## objektumorzes / process_steps_en

Audit: ENS-035

**Előtte**

```json
[
  {
    "body": "We go over your enquiry and get in touch by the next business day using the details you provided. The time needed to prepare a quote depends on the site and the complexity of the request.",
    "title": "Initial consultation and requirements review"
  },
  {
    "body": "An on-site visit and basic risk overview can typically be organised within 1–3 working days.",
    "title": "On-site assessment and risk-point review"
  },
  {
    "body": "We define the entry points, the visitor and supplier flow, patrol routes and the incident-reporting framework.",
    "title": "Service framework design"
  },
  {
    "body": "We record in writing what must be documented, with what regularity reports are produced, and who is notified in the event of deviations or incidents.",
    "title": "Recording of service instructions and reporting process"
  },
  {
    "body": "We arrange unarmed or armed security guard presence based on the contractual requirement, legal conditions and the site's risk profile.",
    "title": "Setting up security guard presence"
  },
  {
    "body": "During operations, we discuss service experience, recurring events and reports with the designated point of contact.",
    "title": "Regular contact, reporting and fine-tuning"
  }
]
```

**Utána**

```json
[
  {
    "body": "We go over your enquiry and get in touch by the next business day using the details you provided. The time needed to prepare a quote depends on the site and the complexity of the request.",
    "title": "Initial consultation and requirements review"
  },
  {
    "body": "An on-site visit and basic risk overview can typically be organised within 1–3 working days.",
    "title": "On-site assessment and risk-point review"
  },
  {
    "body": "We define the entry points, the visitor and supplier flow, patrol routes and the incident-reporting framework.",
    "title": "Design of entry, exit, patrol and escalation procedures"
  },
  {
    "body": "We record in writing what must be documented, with what regularity reports are produced, and who is notified in the event of deviations or incidents.",
    "title": "Recording of service instructions and reporting process"
  },
  {
    "body": "We arrange unarmed or armed security guard presence based on the contractual requirement, legal conditions and the site's risk profile.",
    "title": "Setting up security guard presence"
  },
  {
    "body": "During operations, we discuss service experience, recurring events and reports with the designated point of contact.",
    "title": "Regular contact, reporting and fine-tuning"
  }
]
```

## objektumorzes / trust_items_en

Audit: ENS-033, ENS-032, ENS-022, ENS-028, ENS-029

**Előtte**

```json
[
  {
    "body": "On-site security guarding operations can be supported by 24/7 dispatch support; the notification and escalation framework is set at the start of the engagement.",
    "title": "24/7 dispatch support"
  },
  {
    "body": "Service log, incident recording, agreed reporting and escalation form the documented backbone of daily on-site operations.",
    "title": "Service log and incident handling"
  },
  {
    "body": "We provide a designated responsible point of contact for daily operations, so the client does not have to coordinate between separate parties.",
    "title": "One responsible point of contact"
  },
  {
    "body": "Service processes are supported by Avenir's ISO 9001 and ISO 27001 certified management systems where the relevant processes fall within the certified operating scope.",
    "title": "ISO 9001 and ISO 27001"
  },
  {
    "body": "Service instructions are recorded before deployment and reviewed with the responsible contact point, covering access, patrol, key handling, incident recording and escalation.",
    "title": "Documented site onboarding"
  },
  {
    "body": "Avenir provides the service under the applicable Hungarian personal and property security licensing framework; licensing documentation can be reviewed during contractual onboarding.",
    "title": "Security activity licence"
  }
]
```

**Utána**

```json
[
  {
    "body": "On-site security guarding operations can be backed by 24/7 dispatcher support; the notification and escalation framework is set at the start of the engagement.",
    "title": "24/7 dispatch support"
  },
  {
    "body": "The service log, incident recording, agreed reporting and escalation procedures support on-site control.",
    "title": "Service log and incident handling"
  },
  {
    "body": "We provide a designated responsible point of contact for daily operations, so the client does not have to coordinate between separate parties.",
    "title": "One responsible point of contact"
  },
  {
    "body": "Service processes are supported by Avenir's ISO 9001 and ISO 27001 certified management systems where the relevant processes fall within the certified operating scope.",
    "title": "ISO 9001 and ISO 27001"
  },
  {
    "body": "Service instructions are recorded before deployment and reviewed with the responsible point of contact, covering access, patrol, key handling, incident recording and escalation.",
    "title": "Documented site onboarding"
  },
  {
    "body": "Avenir provides the service under the applicable Hungarian regulatory framework for personal and property protection; licensing documentation can be reviewed during contractual onboarding.",
    "title": "Licensed security operations"
  }
]
```

## objektumorzes / faq_en

Audit: ENS-028, ENS-030, ENS-033, ENS-037

**Előtte**

```json
[
  {
    "a": "Depending on the site's needs, on-site security guarding may include entry and exit control, handling of visitors and suppliers, patrols, key-management rules, incident recording, the service log and agreed reporting.",
    "q": "What does on-site security guarding include?"
  },
  {
    "a": "An on-site security assessment is particularly useful when a new site needs to be guarded, the access rules change, freight traffic grows, recurring incidents occur, or the client wants to make existing guarding and technical processes more transparent.",
    "q": "When is an on-site security assessment needed?"
  },
  {
    "a": "The right model depends on the site's size, risk profile, opening hours, entry points, patrol requirements, incident-handling framework and reporting expectations. These are best defined before launch, so the service aligns with the actual operation of the site.",
    "q": "What contractual setup is best for starting on-site security guarding?"
  },
  {
    "a": "Access rules are defined following an on-site assessment. We can define who may enter, when, with what authorisation, how visitor registration takes place, how supplier access is handled, how freight traffic is managed and how exits are documented.",
    "q": "How are visitors and suppliers admitted?"
  },
  {
    "a": "Yes, where the conditions allow, on-site security guarding can be aligned with an existing camera system, access-control system, alarm process or remote-monitoring operation. This way, guard presence and technical security can reinforce each other.",
    "q": "Can guarding be linked to a camera or access-control system?"
  },
  {
    "a": "Depending on the site's risk profile, the contractual requirement and the fulfilment of legal conditions, both unarmed and armed security guard presence can be arranged.",
    "q": "Can armed guarding also be requested?"
  },
  {
    "a": "Yes. On-site security guarding is provided under the applicable Hungarian personal and property security licensing framework. Licence details and guard documentation can be reviewed during contractual onboarding where required.",
    "q": "Is Avenir licensed to provide on-site security services in Hungary?"
  },
  {
    "a": "Yes, the on-site security guarding service can be supported by 24/7 dispatch support; the escalation and notification framework is set at the start of the engagement.",
    "q": "Is 24/7 dispatch support available?"
  },
  {
    "a": "Incident handling is set up based on an agreed escalation framework. This defines which events must be recorded, who must be notified, in what order signals are sent, and how the incident is documented.",
    "q": "What happens in case of an incident?"
  },
  {
    "a": "Yes, the service can include a service log, incident recording and agreed reporting. The exact report format is set at the start of the engagement, so the client receives up-to-date information about on-site operations.",
    "q": "Do we receive a service log or incident report?"
  }
]
```

**Utána**

```json
[
  {
    "a": "Depending on the site's needs, on-site security guarding may include entry and exit control, handling of visitors and suppliers, patrols, key-management rules, incident recording, the service log and agreed reporting.",
    "q": "What does on-site security guarding include?"
  },
  {
    "a": "An on-site security assessment is particularly useful when a new site needs to be guarded, the access rules change, freight traffic grows, recurring incidents occur, or the client wants to make existing guarding and technical processes more transparent.",
    "q": "When is an on-site security assessment needed?"
  },
  {
    "a": "The right model depends on the site's size, risk profile, opening hours, entry points, patrol requirements, incident-handling framework and reporting expectations. These are best defined before launch, so the service aligns with the actual operation of the site.",
    "q": "What contractual setup is best for starting on-site security guarding?"
  },
  {
    "a": "Access rules are defined following an on-site assessment. We can define who may enter, when, with what authorisation, how visitor registration takes place, how supplier access is handled, how freight traffic is managed and how exits are documented.",
    "q": "How are visitors and suppliers admitted?"
  },
  {
    "a": "Yes, where the conditions allow, on-site security guarding can be aligned with an existing camera system, access-control system, alarm process or remote-monitoring operation. This way, guard presence and technical security can reinforce each other.",
    "q": "Can guarding be linked to a camera or access-control system?"
  },
  {
    "a": "Depending on the site's risk profile, the contractual requirement and the fulfilment of legal conditions, both unarmed and armed security guard presence can be arranged.",
    "q": "Can armed guarding also be requested?"
  },
  {
    "a": "Yes. On-site security guarding is provided under the applicable Hungarian regulatory framework for personal and property protection. Information on the licence and on the licensing documentation of the security staff can be reviewed during contract preparation.",
    "q": "Is Avenir licensed to provide on-site security services in Hungary?"
  },
  {
    "a": "Yes, the on-site security guarding service can be backed by 24/7 dispatcher support; the escalation and notification framework is set at the start of the engagement.",
    "q": "Is 24/7 dispatch support available?"
  },
  {
    "a": "Incident handling is set up based on an agreed escalation framework. This defines which events must be recorded, who must be notified, in what order alerts are raised, and how the incident is documented.",
    "q": "What happens in case of an incident?"
  },
  {
    "a": "Yes, the service can include a service log, incident recording and agreed reporting. The exact report format is set at the start of the engagement, so the client receives up-to-date information about on-site operations.",
    "q": "Do we receive a service log or incident report?"
  }
]
```

## portaszolgalat / long_desc_en

Audit: ENS-036, ENS-013

**Előtte**

```json
"The gatehouse service is not simply presence at the entrance: it is one of the most important control points in daily operations. Depending on the site's needs, the service can support visitor reception, visitor registration, supplier and subcontractor access, key management, parcel handling, information provision and the reporting of extraordinary events.\n\nAvenir defines the gatehouse and reception protocol following an on-site assessment: who may enter, with what authorisation, with what documentation, when notification is required, and what events must be logged or escalated. In handling visitor and access data, purpose limitation, time-limited retention and appropriate information are also part of the gatehouse and reception process.\n\nThe gatehouse service can be integrated with on-site security guarding, an access-control system, a camera system or an internal operations process. The client receives a clear service framework: service log, agreed reporting and a designated responsible point of contact."
```

**Utána**

```json
"The gatehouse service is not simply presence at the entrance: it is one of the most important control points in daily operations. Depending on the site's needs, the service can support visitor reception, visitor registration, supplier and subcontractor access, key management, parcel handling, information provision and the reporting of unusual incidents.\n\nAvenir defines the gatehouse and reception protocol following an on-site assessment: who may enter, with what authorisation, with what documentation, when notification is required, and what events must be logged or escalated. In handling visitor and access data, purpose limitation, time-limited retention and providing appropriate privacy information to visitors are also part of the gatehouse and reception process.\n\nThe gatehouse service can be integrated with on-site security guarding, an access-control system, a camera system or an internal operations process. The client receives a clear service framework: service log, agreed reporting and a designated responsible point of contact."
```

## portaszolgalat / value_proposition_en

Audit: ENS-031

**Előtte**

```json
"The reception and gatehouse service is the first operational point where visitors, suppliers, employees and tenants meet the site's rules. Avenir helps keep this point orderly, courteous, accountable and consistent from a security perspective."
```

**Utána**

```json
"The reception and gatehouse service is the first operational point where visitors, suppliers, employees and tenants meet the site's rules. Avenir helps keep this point orderly, courteous, traceable and consistent from a security perspective."
```

## portaszolgalat / process_steps_en

Audit: ENS-038

**Előtte**

```json
[
  {
    "body": "We go over your enquiry and get in touch by the next business day using the details you provided. The time needed to prepare a quote depends on the site and the complexity of the request.",
    "title": "Initial consultation and operational requirements review"
  },
  {
    "body": "We review the entrances, reception or gatehouse points, access situations, key-management needs and regular supplier or visitor traffic.",
    "title": "On-site walk-through and traffic-point review"
  },
  {
    "body": "We define the daily framework for visitor reception, access, key issuance, parcel handling, notification and incident recording.",
    "title": "Design of the gatehouse and reception protocol"
  },
  {
    "body": "We record in writing the events to be documented, the report format, the escalation points and the designated points of contact.",
    "title": "Recording of service instructions and reporting framework"
  },
  {
    "body": "We organise the service based on contractual requirements, the on-site protocol and daily traffic, with training and deployment alignment.",
    "title": "Organisation and training of personnel"
  },
  {
    "body": "We discuss operational experience, recurring questions and reports with the designated responsible point of contact.",
    "title": "Regular review and fine-tuning"
  }
]
```

**Utána**

```json
[
  {
    "body": "We go over your enquiry and get in touch by the next business day using the details you provided. The time needed to prepare a quote depends on the site and the complexity of the request.",
    "title": "Initial consultation and operational requirements review"
  },
  {
    "body": "We review the entrances, reception or gatehouse points, access situations, key-management needs and regular supplier or visitor traffic.",
    "title": "On-site walk-through and traffic-point review"
  },
  {
    "body": "We define the daily framework for visitor reception, access, key issuance, parcel handling, notification and incident recording.",
    "title": "Design of the gatehouse and reception protocol"
  },
  {
    "body": "We record in writing the events to be documented, the report format, the escalation points and the designated points of contact.",
    "title": "Recording of service instructions and reporting framework"
  },
  {
    "body": "We organise the service based on contractual requirements, the on-site protocol and daily traffic, with training and pre-launch coordination.",
    "title": "Organisation and training of personnel"
  },
  {
    "body": "We discuss operational experience, recurring questions and reports with the designated responsible point of contact.",
    "title": "Regular review and fine-tuning"
  }
]
```

## portaszolgalat / trust_items_en

Audit: ENS-032, ENS-033, ENS-002

**Előtte**

```json
[
  {
    "body": "Service log, visitor-handling framework, incident recording and agreed reporting form the documented backbone of daily gatehouse operations.",
    "title": "Daily service framework and logging"
  },
  {
    "body": "The client has one responsible point of contact for daily operations, reports and required protocol changes.",
    "title": "Designated responsible point of contact"
  },
  {
    "body": "Gatehouse operations can be supported by 24/7 dispatch support; the notification and escalation framework is set at the start of the engagement.",
    "title": "24/7 dispatch support"
  },
  {
    "body": "Service processes are supported by Avenir's ISO 9001 and ISO 27001 certified management systems where the relevant processes fall within the certified operating scope.",
    "title": "ISO 9001 and ISO 27001"
  },
  {
    "body": "Visitor and access data are handled with purpose limitation, time-limited retention and appropriate information provision.",
    "title": "Visitor-data handling"
  },
  {
    "body": "Reception and gatehouse protocols combine courteous visitor handling with controlled access, escalation and reporting, so front-of-house service and security routines work from the same site rules.",
    "title": "Hospitality and access control in one workflow"
  }
]
```

**Utána**

```json
[
  {
    "body": "The service log, visitor-handling procedures, incident recording and agreed reporting support control of gatehouse operations.",
    "title": "Daily service framework and logging"
  },
  {
    "body": "The client has one responsible point of contact for daily operations, reports and required protocol changes.",
    "title": "Designated responsible point of contact"
  },
  {
    "body": "Gatehouse operations can be backed by 24/7 dispatcher support; the notification and escalation framework is set at the start of the engagement.",
    "title": "24/7 dispatch support"
  },
  {
    "body": "Service processes are supported by Avenir's ISO 9001 and ISO 27001 certified management systems where the relevant processes fall within the certified operating scope.",
    "title": "ISO 9001 and ISO 27001"
  },
  {
    "body": "When handling visitor and access data, purpose limitation, information to data subjects and time-limited retention must be taken into account.",
    "title": "Visitor-data handling considerations"
  },
  {
    "body": "Reception and gatehouse protocols combine courteous visitor handling with controlled access, escalation and reporting, so front-of-house service and security routines work from the same site rules.",
    "title": "Hospitality and access control in one workflow"
  }
]
```

## portaszolgalat / faq_en

Audit: ENS-013, ENS-008, NEW-EN-SVC-001

**Előtte**

```json
[
  {
    "a": "Depending on the site's needs, the service covers agreed elements such as visitor reception, visitor registration, access support, handling of suppliers and couriers, key management, parcel handling, the service log and agreed reporting.",
    "q": "What does the reception and gatehouse service include?"
  },
  {
    "a": "The assessment is particularly useful when visitor or supplier traffic grows, the access framework changes, multiple parties use the same site, or more structured logging and accountability are needed.",
    "q": "When is it worth requesting a gatehouse assessment?"
  },
  {
    "a": "The gatehouse service focuses primarily on the entrance, reception and daily traffic-management points, while on-site security guarding can also include broader security presence, patrols and incident handling. The two services can be aligned where needed.",
    "q": "How does the gatehouse service differ from on-site security guarding?"
  },
  {
    "a": "Yes, the framework for supplier, courier and subcontractor access is set up based on an on-site assessment. Avenir defines what information must be recorded, who must be notified, and how entries and exits are logged.",
    "q": "Can supplier and courier traffic be handled?"
  },
  {
    "a": "Yes, the service can include following a key-management framework, with key issuance and return recorded. The exact rules are defined at the start of the engagement, tailored to the site.",
    "q": "Is key management included?"
  },
  {
    "a": "Yes, where the conditions allow, the gatehouse service can be linked to an existing access-control system, camera system or internal operations process.",
    "q": "Can it be linked to an access-control system?"
  },
  {
    "a": "When handling visitor data, the defining factors are purpose limitation, time-limited retention, visitor information, the access-control context and the site's own rules. The exact data categories and retention framework must be aligned with client expectations and the site's data-handling rules.",
    "q": "How can visitor data be handled in the gatehouse and reception process?"
  },
  {
    "a": "Yes. The service is structured around written service logs, incident notes and agreed reporting according to the site protocol.",
    "q": "Do we receive reports on daily operations?"
  }
]
```

**Utána**

```json
[
  {
    "a": "Depending on the site's needs, the service covers agreed elements such as visitor reception, visitor registration, access support, handling of suppliers and couriers, key management, parcel handling, the service log and agreed reporting.",
    "q": "What does the reception and gatehouse service include?"
  },
  {
    "a": "The assessment is particularly useful when visitor or supplier traffic grows, the access framework changes, multiple parties use the same site, or more structured logging and accountability are needed.",
    "q": "When is it worth requesting a gatehouse assessment?"
  },
  {
    "a": "The gatehouse service focuses primarily on the entrance, reception and daily traffic-management points, while on-site security guarding can also include broader security presence, patrols and incident handling. The two services can be aligned where needed.",
    "q": "How does the gatehouse service differ from on-site security guarding?"
  },
  {
    "a": "Yes, the framework for supplier, courier and subcontractor access is set up based on an on-site assessment. The information to record, who to notify, and how entries and exits are logged can be defined.",
    "q": "Can supplier and courier traffic be handled?"
  },
  {
    "a": "Yes, the service can include following a key-management framework, with key issuance and return recorded. The exact rules are defined at the start of the engagement, tailored to the site.",
    "q": "Is key management included?"
  },
  {
    "a": "Yes, where the conditions allow, the gatehouse service can be linked to an existing access-control system, camera system or internal operations process.",
    "q": "Can it be linked to an access-control system?"
  },
  {
    "a": "When handling visitor data, the defining factors are purpose limitation, time-limited retention, providing privacy information to visitors, the access-control context and the site's own rules. The exact data categories and retention framework must be aligned with client expectations and the site's data-handling rules.",
    "q": "How can visitor data be handled in the gatehouse and reception process?"
  },
  {
    "a": "Yes. Gatehouse operations can include a service log, incident recording and agreed reporting. The exact report format is set based on the client's requirements and how the site operates.",
    "q": "Do we receive reports on daily operations?"
  }
]
```

## mystery-shopping-helyszini-audit / long_desc_en

Audit: ENS-048

**Előtte**

```json
"Mystery shopping is not a simple inspection, but a planned and documented service-quality measurement. Avenir defines the audit scope with the client, designs the scenario and evaluation criteria, briefs the evaluator, and carries out the assessment in a real customer or service situation: a purchase, service interaction, on-site visit, test journey or another customer touchpoint.\n\nThe scope of the assessment defines which service points, process steps, brand standards, communication expectations, disclosure obligations or agreed compliance points are reviewed. The goal is not fault-finding for its own sake, but to give management a clear, structured view of the actual customer experience.\n\nThe service can be applied in several forms. A Brand Audit examines visual identity, visual standards, cleanliness, atmosphere and service standards. Situation Shopping tests specific customer situations, questions, conflicts or process steps. A service audit or test journey can examine an entire customer journey, for example in passenger transport, customer service or front-line service delivery processes.\n\nAvenir delivers a structured report with observations, recurring patterns, risk points and improvement recommendations. The findings are reviewed with the client so they can support management decisions about service quality, process improvement and agreed control points."
```

**Utána**

```json
"Mystery shopping is not a simple inspection, but a planned and documented service-quality measurement. Avenir defines the audit scope with the client, designs the scenario and evaluation criteria, trains the evaluator, and carries out the assessment in a real customer or service situation: a purchase, service interaction, on-site visit, test journey or another customer touchpoint.\n\nThe scope of the assessment defines which service points, process steps, brand standards, communication expectations, disclosure obligations or agreed compliance points are reviewed. The goal is not fault-finding for its own sake, but to give management a clear, structured view of the actual customer experience.\n\nThe service can be applied in several forms. A Brand Audit examines visual identity, visual standards, cleanliness, atmosphere and service standards. Situation Shopping tests specific customer situations, questions, conflicts or process steps. A service audit or test journey can examine an entire customer journey, for example in passenger transport, customer service or front-line service delivery processes.\n\nAvenir delivers a structured report with observations, recurring patterns, risk points and improvement recommendations. The findings are reviewed with the client so they can support management decisions about service quality, process improvement and agreed control points."
```

## mystery-shopping-helyszini-audit / value_proposition_en

Audit: ENS-010

**Előtte**

```json
"A Mystery Shopping and Service Audit shows how agreed service standards, customer-journey steps, brand expectations and compliance points appear in real customer situations, with structured reporting and improvement recommendations."
```

**Utána**

```json
"Mystery shopping and service audits show, in real customer situations, what customers experience, whether the expected process is followed, whether brand, disclosure and service rules are met, and where quality, reputational or compliance risks arise."
```

## mystery-shopping-helyszini-audit / use_cases_en

Audit: ENS-050

**Előtte**

```json
[
  "Mystery shopping at stores, service points or customer-service situations",
  "Test journey in taxi, passenger-transport or transportation services",
  "Brand Audit: review of visual identity, cleanliness, visual presentation and service standards",
  "Situation Shopping: testing of specific customer situations, questions or conflict scenarios",
  "Customer journey and visitor experience review",
  "Review of disclosure, price communication, invoicing, receipt or other compliance criteria within an agreed scope",
  "Comparable audit across multiple sites, providers or units"
]
```

**Utána**

```json
[
  "Mystery shopping at stores, service points or customer-service situations",
  "Test journey in taxi, passenger-transport or transportation services",
  "Brand Audit: review of visual identity, cleanliness, visual presentation and service standards",
  "Situation Shopping: testing of specific customer situations, questions or conflict scenarios",
  "Customer journey and visitor experience review",
  "Review of disclosure, price communication, invoicing, receipt issuance or other compliance criteria within an agreed scope",
  "Comparable audit across multiple sites, providers or units"
]
```

## mystery-shopping-helyszini-audit / included_items_en

Audit: ENS-049

**Előtte**

```json
[
  "Agreement on audit purpose, scope and evaluation criteria",
  "Design of the mystery shopping, test journey or customer-journey scenario",
  "Selection of the Brand Audit or Situation Shopping methodology",
  "Service-quality measurement in a real customer situation",
  "Evaluation of the customer journey, communication, process follow-through and service delivery",
  "Examination of agreed compliance criteria",
  "Documentation of deviations, risks and improvement points",
  "Structured report and executive summary"
]
```

**Utána**

```json
[
  "Agreement on audit purpose, scope and evaluation criteria",
  "Design of the mystery shopping, test journey or customer-journey scenario",
  "Selection of the Brand Audit or Situation Shopping methodology",
  "Service-quality measurement in a real customer situation",
  "Evaluation of the customer journey, communication, process adherence and service delivery",
  "Examination of agreed compliance criteria",
  "Documentation of deviations, risks and improvement points",
  "Structured report and executive summary"
]
```

## mystery-shopping-helyszini-audit / process_steps_en

Audit: ENS-051

**Előtte**

```json
[
  {
    "body": "We define which business, service-quality or compliance question the audit needs to answer, and exactly which processes are in scope.",
    "title": "Agreement on audit purpose and scope"
  },
  {
    "body": "We define the measurement points, brand standards, communication and disclosure expectations, and the mystery shopping, test journey or customer-journey scenario.",
    "title": "Design of evaluation criteria and scenario"
  },
  {
    "body": "The audit takes place within the approved scope, in a real customer situation, focusing on the service process, customer experience and the predefined service or compliance points.",
    "title": "Execution of the Brand Audit, Situation Shopping, mystery shopping or test journey"
  },
  {
    "body": "We record observations in a structured way: what happened along the customer journey, what matched the expected process, where there were deviations, and what risks or improvement points emerged.",
    "title": "Documentation of observations, deviations and compliance points"
  },
  {
    "body": "Results are organised into a report that can also be reviewed at executive level, including observations against agreed compliance points, recurring patterns and concrete improvement recommendations.",
    "title": "Preparation of the report, executive summary and improvement recommendations"
  },
  {
    "body": "We review the audit results together so that the client can decide on protocol changes, training, brand standard adjustments or further measurements.",
    "title": "Discussion of results and definition of next steps"
  }
]
```

**Utána**

```json
[
  {
    "body": "We define which business, service-quality or compliance question the audit needs to answer, and exactly which processes are in scope.",
    "title": "Agreement on audit purpose and scope"
  },
  {
    "body": "We define the measurement points, brand standards, communication and disclosure expectations, and the mystery shopping, test journey or customer-journey scenario.",
    "title": "Design of evaluation criteria and scenario"
  },
  {
    "body": "The audit takes place within the approved scope, in a real customer situation, focusing on the service process, customer experience and the predefined service or compliance points.",
    "title": "Execution of the Brand Audit, Situation Shopping, mystery shopping or test journey"
  },
  {
    "body": "We record observations in a structured way: what happened along the customer journey, what matched the expected process, where there were deviations, and what risks or improvement points emerged.",
    "title": "Documentation of observations, deviations and compliance points"
  },
  {
    "body": "Results are organised into a report that can also be reviewed at executive level and may include observations against agreed compliance points, recurring patterns and concrete improvement recommendations.",
    "title": "Preparation of the report, executive summary and improvement recommendations"
  },
  {
    "body": "We review the audit results together so that the client can decide on protocol changes, training, brand standard adjustments or further measurements.",
    "title": "Discussion of results and definition of next steps"
  }
]
```

## mystery-shopping-helyszini-audit / trust_items_en

Audit: ENS-052

**Előtte**

```json
[
  {
    "body": "The audit objective, scenario, criteria and reporting format are agreed before execution, so observations stay within the defined service-quality scope.",
    "title": "Defined scope before execution"
  },
  {
    "body": "The assessment records how agreed service steps, brand expectations and customer-journey points appear in real customer situations, without surveillance or disciplinary framing.",
    "title": "Neutral customer-journey observation"
  },
  {
    "body": "Avenir delivers a structured report with observations, recurring patterns, risk points and improvement recommendations, then reviews the findings with the client for service-quality decisions.",
    "title": "Structured report and client debrief"
  },
  {
    "body": "The same scenario can be repeated across sites or providers to compare service consistency, process gaps and recurring improvement points.",
    "title": "Multi-site consistency insight"
  },
  {
    "body": "Reporting remains limited to the agreed scope and intended client-side review flow. Personal-data-related reporting is not used as a standard element and must remain within the agreed data-protection framework.",
    "title": "Purpose-bound and confidential reporting"
  }
]
```

**Utána**

```json
[
  {
    "body": "The audit objective, scenario, criteria and reporting format are agreed before execution, so observations stay within the defined service-quality scope.",
    "title": "Defined scope before execution"
  },
  {
    "body": "The assessment records how agreed service steps, brand expectations and customer-journey points appear in real customer situations, without surveillance or disciplinary framing.",
    "title": "Neutral customer-journey observation"
  },
  {
    "body": "Avenir delivers a structured report with observations, recurring patterns, risk points and improvement recommendations, then reviews the findings with the client for service-quality decisions.",
    "title": "Structured report and client debrief"
  },
  {
    "body": "The same scenario can be repeated across sites or providers to compare service consistency, process gaps and recurring improvement points.",
    "title": "Multi-site consistency insight"
  },
  {
    "body": "Reporting remains limited to the agreed scope and intended client-side review process. Data on individual employees is not a default reporting element; it may appear only within a data-protection framework agreed in advance.",
    "title": "Purpose-bound and confidential reporting"
  }
]
```

## mystery-shopping-helyszini-audit / faq_en

Audit: ENS-009, ENS-050, ENS-014, ENS-049, ENS-053

**Előtte**

```json
[
  {
    "a": "The service covers definition of the audit objective, scope and evaluation criteria, design of the mystery shopping or customer-journey scenario, structured observation in a real customer situation, and preparation of the report.",
    "q": "What does Mystery Shopping and Service Audit include?"
  },
  {
    "a": "The audit scope is defined before execution. Avenir records the objective, scenario, criteria, reporting format and permitted observations in advance. Findings are reported against agreed service criteria and improvement goals, not as legal conclusions or disciplinary evidence.",
    "q": "How is the audit scope defined and kept within agreed boundaries?"
  },
  {
    "a": "The audit can cover brand-audit criteria, Situation Shopping scenarios, customer-journey steps, service-quality criteria, agreed compliance points and multi-site consistency checks. Examples include communication, information disclosure, service delivery, invoicing or receipt processes where these are within the agreed scope.",
    "q": "What can be audited?"
  },
  {
    "a": "Yes. Avenir delivers a structured report covering the observed process, deviations, recurring patterns, risk points and improvement recommendations within the agreed scope.",
    "q": "What does the final report contain?"
  },
  {
    "a": "The report is process-focused by default. Individual names are not used as a standard reporting element; if any personal-data-related reporting is requested, it is agreed in advance with the client and aligned with the applicable data-protection requirements.",
    "q": "Are individual employees named in the report?"
  },
  {
    "a": "Yes. The same scenario and evaluation criteria can be repeated across multiple sites, providers, units or time periods. This helps identify deviations, recurring patterns and improvement priorities.",
    "q": "Can the same scenario be repeated across multiple sites?"
  },
  {
    "a": "Yes. A test journey or service journey can examine information provision, service delivery, invoicing or receipt processes, behavioural protocol, and fulfilment of predefined service or compliance criteria.",
    "q": "Can it be used for transport or service journeys?"
  },
  {
    "a": "Mystery Shopping and Service Audit measure service quality, process follow-through, customer journey and agreed compliance points within a defined scope. It is not private investigation, not open-ended surveillance, not evidence collection and not automatic disciplinary action.",
    "q": "What is the difference from private investigation?"
  }
]
```

**Utána**

```json
[
  {
    "a": "The service covers definition of the audit objective, scope and evaluation criteria, design of the mystery shopping or customer-journey scenario, structured observation in a real customer situation, and preparation of the report.",
    "q": "What does Mystery Shopping and Service Audit include?"
  },
  {
    "a": "The audit scope is defined before execution. Avenir records the objective, scenario, criteria, reporting format and permitted observations in advance. Findings are reported against agreed service criteria and improvement goals, not as legal conclusions or disciplinary evidence.",
    "q": "How is the audit scope defined and kept within agreed boundaries?"
  },
  {
    "a": "The audit can cover brand-audit criteria, Situation Shopping scenarios, customer-journey steps, service-quality criteria, agreed compliance points and multi-site consistency checks. Examples include communication, information disclosure, service delivery, invoicing or receipt-issuance processes where these are within the agreed scope.",
    "q": "What can be audited?"
  },
  {
    "a": "Yes. Avenir delivers a structured report covering the observed process, deviations, recurring patterns, risk points and improvement recommendations within the agreed scope.",
    "q": "Is a report produced on the findings?"
  },
  {
    "a": "The report is process-focused by default. Individual names are not used as a standard reporting element; if any personal-data-related reporting is requested, it is agreed in advance with the client and aligned with the applicable data-protection requirements.",
    "q": "Are individual employees named in the report?"
  },
  {
    "a": "Yes. The same scenario and evaluation criteria can be repeated across multiple sites, providers, units or time periods. This helps identify deviations, recurring patterns and improvement priorities.",
    "q": "Can the same scenario be repeated across multiple sites?"
  },
  {
    "a": "Yes. A test journey or service journey can examine information provision, service delivery, invoicing or receipt-issuance processes, behavioural protocol, and fulfilment of predefined service or compliance criteria.",
    "q": "Can it be used for transport or service journeys?"
  },
  {
    "a": "The Mystery Shopping and Service Audit service measures service quality, process adherence, customer journey and agreed compliance points within a defined scope. It is not private investigation, not open-ended surveillance, not evidence collection and not automatic disciplinary action.",
    "q": "How does mystery shopping differ from private investigation?"
  }
]
```

## rendezvenybiztositas / use_cases_en

Audit: ENS-054

**Előtte**

```json
[
  "Corporate events, conferences and business events",
  "Invitation-only events, product launches and exhibitions",
  "Festivals and outdoor cultural events",
  "Concerts and indoor public performances",
  "Sports events and tournaments",
  "Events with VIP, backstage, closed or priority areas",
  "Events with multiple entry points, audience flow or organiser coordination needs",
  "Events that require incident reporting and escalation framework"
]
```

**Utána**

```json
[
  "Corporate events, conferences and business events",
  "Invitation-only events, product launches and exhibitions",
  "Festivals and outdoor cultural events",
  "Concerts and indoor public performances",
  "Sports events and tournaments",
  "Events with VIP, backstage, closed or priority areas",
  "Events with multiple entry points, audience flow or organiser coordination needs",
  "Events that require incident reporting and an escalation framework"
]
```

## rendezvenybiztositas / included_items_en

Audit: ENS-054

**Előtte**

```json
[
  "Access control and entry-point handling",
  "Guest and audience flow support",
  "Zone, perimeter and closed-area handling",
  "VIP, backstage or priority-area support where required",
  "Conflict prevention and incident escalation",
  "Incident logging and event-security reporting",
  "Multi-entry-point operations for public and mass events",
  "Coordination with organiser-defined contact and escalation routes"
]
```

**Utána**

```json
[
  "Access control and entry-point handling",
  "Guest and audience flow support",
  "Zone, perimeter and closed-area handling",
  "VIP, backstage or priority-area support where required",
  "Conflict prevention and incident escalation",
  "Incident logging and event-security reporting",
  "Multi-entry-point operations for public or large-scale events",
  "Coordination with organiser-defined contact and escalation routes"
]
```

## rendezvenybiztositas / faq_en

Audit: ENS-055

**Előtte**

```json
[
  {
    "a": "On-site security guarding is typically built on permanent or longer-term on-site operations, while event security is a time-bounded service tailored to a specific event. Here, guest flow, access, zone management, contact with organisers and incident reporting come to the foreground.",
    "q": "How does event security differ from on-site security guarding?"
  },
  {
    "a": "Yes. Event security can be scoped for corporate, invitation-only and public events, including festivals, concerts, sports events and cultural programmes. The service framework is adjusted to the event type, audience flow, entry points, zones, organiser contact chain and incident-reporting requirements.",
    "q": "Can event security cover festivals, concerts and sports events?"
  },
  {
    "a": "Yes, if the event's scope includes it, security operations can also extend to handling VIP, backstage, closed or priority areas. The authorisation points and access rules must be set in advance.",
    "q": "Can VIP or backstage areas be handled?"
  },
  {
    "a": "No guaranteed conflict-free outcome can be promised. The aim of the service is to reduce risks and to provide on-site presence, an agreed escalation framework and rapid contact with organisers.",
    "q": "Is a conflict-free event guaranteed?"
  },
  {
    "a": "For event security to work effectively, it is important to have a designated point of contact on both the organiser side and the security side. This way, incidents, access questions, zone-management issues or guest-flow situations can be resolved faster.",
    "q": "What role does contact with the organiser play?"
  },
  {
    "a": "The service can include a post-event review or report summarising the main events, deviations, incidents and improvement recommendations. The level of detail of the report is best set at the start of the engagement.",
    "q": "Is a post-event report produced?"
  },
  {
    "a": "A pre-event walk-through is particularly useful when multiple entry points, VIP, backstage or closed zones, larger guest flows, external supplier movements, an unusual site layout, a higher-risk programme element or strong organiser-coordination needs are expected.",
    "q": "When is it worth holding a pre-event walk-through?"
  },
  {
    "a": "Yes, where the site allows, event security can be linked to an access-control system, camera system, zone-management or other security technology process. The exact operation is defined by the site's conditions and the event's scope.",
    "q": "Can event security be linked to access-control or security technology systems?"
  }
]
```

**Utána**

```json
[
  {
    "a": "On-site security guarding is typically built on permanent or longer-term on-site operations, while event security is a time-bounded service tailored to a specific event. Here, guest flow, access, zone management, contact with organisers and incident reporting are the main focus.",
    "q": "How does event security differ from on-site security guarding?"
  },
  {
    "a": "Yes. Event security can be scoped for corporate, invitation-only and public events, including festivals, concerts, sports events and cultural programmes. The service framework is adjusted to the event type, audience flow, entry points, zones, organiser contact chain and incident-reporting requirements.",
    "q": "Can event security cover festivals, concerts and sports events?"
  },
  {
    "a": "Yes, if the event's scope includes it, security operations can also extend to handling VIP, backstage, closed or priority areas. The authorisation points and access rules must be set in advance.",
    "q": "Can VIP or backstage areas be handled?"
  },
  {
    "a": "A conflict-free event cannot be guaranteed. The aim of the service is to reduce risks and to provide on-site presence, an agreed escalation framework and rapid contact with organisers.",
    "q": "Is a conflict-free event guaranteed?"
  },
  {
    "a": "For event security to work effectively, it is important to have a designated point of contact on both the organiser side and the security side. This way, incidents, access questions, zone-management issues or guest-flow situations can be coordinated faster.",
    "q": "What role does contact with the organiser play?"
  },
  {
    "a": "The service can include a post-event review or report summarising the main events, deviations, incidents and improvement recommendations. The level of detail of the report is best set at the start of the engagement.",
    "q": "Is a post-event report produced?"
  },
  {
    "a": "A pre-event walk-through is particularly useful when multiple entry points, VIP, backstage or closed zones, larger guest flows, external supplier movements, an unusual site layout, a higher-risk programme element or strong organiser-coordination needs are expected.",
    "q": "When is it worth holding a pre-event walk-through?"
  },
  {
    "a": "Yes, where the site allows, event security can be linked to an access-control system, camera system, zone-management or other security technology process. The exact operation is defined by the site's conditions and the event's scope.",
    "q": "Can event security be linked to access-control or security technology systems?"
  }
]
```

## biztonsagtechnika / long_desc_en

Audit: ENS-039

**Előtte**

```json
"Security technology aims to give on-site security a manageable technical layer, not just human presence. This may include a camera system, access-control system, intrusion detection, alarm process, signal forwarding and event documentation.\n\nAvenir does not treat security technology as an isolated equipment purchase. Following an on-site assessment, we examine where entry points, weak control zones, recurring events, critical areas and processes exist where technology can support guarding, gatehouse service or remote monitoring.\n\nAvenir incorporates data-protection considerations into the security technology assessment and design: documented purpose, proportional field of view, access rights, information to data subjects and retention logic are aligned with the site operation and the client's data-protection framework. This supports the client's data-protection review; legal basis and final data-protection decisions remain with the client and its advisers.\n\nThe goal is a transparent, maintainable technical security layer that is usable in daily operations: a solution that not only records, but also supports detection, escalation, access control, reporting and decision-making."
```

**Utána**

```json
"Security technology aims to give on-site security a manageable technical layer, not just human presence. This may include a camera system, access-control system, intrusion detection, alarm process, signal forwarding and event documentation.\n\nAvenir does not treat security technology as an isolated equipment purchase. Following an on-site assessment, we identify entry points, weak control zones, recurring events, critical areas and processes where technology can support guarding, gatehouse service or remote monitoring.\n\nAvenir incorporates data-protection considerations into the security technology assessment and design: documented purpose, proportional field of view, access rights, information to data subjects and retention logic are aligned with the site operation and the client's data-protection framework. This supports the client's data-protection review; legal basis and final data-protection decisions remain with the client and its advisers.\n\nThe goal is a transparent, maintainable technical security layer that is usable in daily operations: a solution that not only records, but also supports detection, escalation, access control, reporting and decision-making."
```

## biztonsagtechnika / process_steps_en

Audit: ENS-022

**Előtte**

```json
[
  {
    "body": "We review the site's entry points, camera coverage, alarm processes and the related guarding or gatehouse operations.",
    "title": "On-site security technology assessment"
  },
  {
    "body": "We identify the zones where movement, authorisation, freight traffic or recurring events require technical support.",
    "title": "Identification of critical points, entry zones and risk areas"
  },
  {
    "body": "We examine how the existing or planned technical system supports detection, access control, alarm and incident handling.",
    "title": "Review of camera, access control, alarm and signal-handling processes"
  },
  {
    "body": "We align the technical signals with the guard, gatehouse, points-of-contact and remote-monitoring processes.",
    "title": "Alignment of technical and on-site security operations"
  },
  {
    "body": "We define who responds to which event, what must be logged, what report is produced, and how the system stays maintainable.",
    "title": "Definition of escalation, reporting and maintenance considerations"
  },
  {
    "body": "Based on the assessment, we give practical recommendations on how the technology can better connect to daily security operations.",
    "title": "Recommendation for developing or integrating security technology operations"
  }
]
```

**Utána**

```json
[
  {
    "body": "We review the site's entry points, camera coverage, alarm processes and the related guarding or gatehouse operations.",
    "title": "On-site security technology assessment"
  },
  {
    "body": "We identify the zones where movement, authorisation, freight traffic or recurring events require technical support.",
    "title": "Identification of critical points, entry zones and risk areas"
  },
  {
    "body": "We examine how the existing or planned technical system supports detection, access control, alarm and incident handling.",
    "title": "Review of camera, access control, alarm and signal-handling processes"
  },
  {
    "body": "We align technical signals with the procedures for guards, gatehouse staff, designated contacts and remote monitoring.",
    "title": "Alignment of technical and on-site security operations"
  },
  {
    "body": "We define who responds to which event, what must be logged, what report is produced, and how the system stays maintainable.",
    "title": "Definition of escalation, reporting and maintenance considerations"
  },
  {
    "body": "Based on the assessment, we give practical recommendations on how the technology can better connect to daily security operations.",
    "title": "Recommendation for developing or integrating security technology operations"
  }
]
```

## biztonsagtechnika / trust_items_en

Audit: ENS-040, ENS-041, NEW-EN-SVC-002

**Előtte**

```json
[
  {
    "body": "Technical requirements are defined through an on-site assessment and operational review, not as a standalone equipment list.",
    "title": "Site-specific security technology review"
  },
  {
    "body": "The service can be set up in line with the security technology licence and on-site contractual requirements.",
    "title": "Operation supported by a security technology licence"
  },
  {
    "body": "Camera, access-control and alarm signals create operational value when aligned with guard presence, gatehouse workflows, defined escalation routes and clearly assigned response responsibilities.",
    "title": "Integration with on-site operations and escalation chain"
  },
  {
    "body": "The technical system can support visitor, supplier and staff access control, and tracking of authorisation rules.",
    "title": "Integration with gatehouse and access-control processes"
  },
  {
    "body": "Camera coverage, field of view, access rights, information to data subjects and retention logic are treated as design inputs during the technical security assessment.",
    "title": "Data-protection-aware security technology design"
  },
  {
    "body": "The assessment can be summarised in structured findings, priorities, integration points and an implementation recommendation.",
    "title": "Documented findings and implementation plan"
  },
  {
    "body": "Operations can be built on controlled processes aligned with ISO 9001- and ISO 27001-certified management systems, where the relevant processes fall within the certified operating scope.",
    "title": "ISO 9001 and ISO 27001 supported operating discipline"
  }
]
```

**Utána**

```json
[
  {
    "body": "Technical requirements are defined through an on-site assessment and operational review, not as a standalone equipment list.",
    "title": "Site-specific security technology review"
  },
  {
    "body": "The service can be set up in line with the security technology licence and on-site contractual requirements.",
    "title": "Operation supported by a security technology licence"
  },
  {
    "body": "Camera, access-control and alarm signals create operational value when aligned with guard presence, gatehouse workflows, defined escalation routes and clearly assigned response responsibilities.",
    "title": "Integration with on-site operations and escalation chain"
  },
  {
    "body": "The technical system can support visitor, supplier and staff access control, and adherence to authorisation rules.",
    "title": "Integration with gatehouse and access-control processes"
  },
  {
    "body": "Camera coverage, field of view, access rights, information to data subjects and retention logic should be treated as design inputs during the technical security assessment.",
    "title": "Data-protection-aware security technology design"
  },
  {
    "body": "The assessment can be summarised in structured findings, priorities, integration points and an implementation recommendation.",
    "title": "Documented findings and implementation recommendation"
  },
  {
    "body": "Operations can be built on controlled processes aligned with ISO 9001- and ISO 27001-certified management systems, where the relevant processes fall within the certified operating scope.",
    "title": "ISO 9001 and ISO 27001 supported operating discipline"
  }
]
```

## biztonsagtechnika / faq_en

Audit: ENS-043, ENS-036

**Előtte**

```json
[
  {
    "a": "Security technology is the technical layer of on-site security: camera systems, access control, intrusion detection, alarm processes, signal handling and their controlled operation. The goal is for the technology not to be a standalone tool but to support guarding, gatehouse service and escalation.",
    "q": "What does security technology mean within Avenir's service?"
  },
  {
    "a": "Yes. A camera system, access control or alarm process only delivers real value if the guards, the gatehouse, the points of contact and the escalation chain all know what action a given signal requires.",
    "q": "Can security technology be integrated with on-site security guarding?"
  },
  {
    "a": "It is particularly useful for office buildings, industrial and logistics sites, warehouses, freight gates, locations with multiple entry points, and sites where recurring incidents or uncontrolled movement occur.",
    "q": "Where is a security technology assessment most useful?"
  },
  {
    "a": "Existing camera, access control or alarm processes can also be reviewed. In that case we examine whether the current technology supports daily operations, guarding, incident handling and reporting.",
    "q": "Can existing systems be reviewed, or only new ones designed?"
  },
  {
    "a": "Yes, where it is needed, the security technology process can be linked to remote monitoring or signal-handling operations. The details should be defined based on on-site risks, technical conditions and contractual requirements.",
    "q": "Can the system be connected to remote monitoring?"
  },
  {
    "a": "The escalation chain defines who receives a signal in case of an alarm, extraordinary event or unauthorised entry attempt, in what order notifications take place, what must be recorded, and how the incident is closed.",
    "q": "Why is a defined escalation chain important?"
  },
  {
    "a": "A camera or alarm system on its own is only a tool. In Avenir's approach, security technology is part of the full on-site operation: it connects to guarding, gatehouse service, access control, signal handling and reporting.",
    "q": "How is this different from a simple camera or alarm system?"
  },
  {
    "a": "Yes. When designing a camera system, the assessment should consider purpose limitation, information to data subjects, documentation of legitimate interest, the field of view of the cameras, the retention period, and the site's own data-handling environment. This is not legal advice, but the technical recommendation must take these considerations into account.",
    "q": "Does a camera system need to be assessed from a data-protection perspective?"
  },
  {
    "a": "Retention time is influenced by the purpose of recording, the risk profile of the site, incident-handling needs, internal policy and the data-protection environment. There is no universal answer for every site; the retention rule must be established on a professionally justified basis.",
    "q": "What factors influence the retention time of camera footage?"
  }
]
```

**Utána**

```json
[
  {
    "a": "Security technology is the technical layer of on-site security: camera systems, access control, intrusion detection, alarm processes, signal handling and their controlled operation. The goal is for the technology not to be a standalone tool but to support guarding, gatehouse service and escalation.",
    "q": "What does security technology mean within Avenir's service?"
  },
  {
    "a": "Yes. A camera system, access control or alarm process only delivers real value if the guards, the gatehouse, the points of contact and the escalation chain all know what action a given signal requires.",
    "q": "Can security technology be integrated with on-site security guarding?"
  },
  {
    "a": "It is particularly useful for office buildings, industrial and logistics sites, warehouses, freight gates, locations with multiple entry points, and sites where recurring incidents or uncontrolled movement occur.",
    "q": "Where is a security technology assessment most useful?"
  },
  {
    "a": "Existing camera systems, access-control systems or alarm processes can also be reviewed. In that case we examine whether the current technology supports daily operations, guarding, incident handling and reporting.",
    "q": "Can existing systems be reviewed, or only new ones designed?"
  },
  {
    "a": "Yes, where it is needed, the security technology process can be linked to remote monitoring or signal-handling operations. The details should be defined based on on-site risks, technical conditions and contractual requirements.",
    "q": "Can the system be connected to remote monitoring?"
  },
  {
    "a": "The escalation chain defines who receives a signal in case of an alarm, unusual incident or unauthorised entry attempt, in what order notifications take place, what must be recorded, and how the incident is closed.",
    "q": "Why is a defined escalation chain important?"
  },
  {
    "a": "A camera or alarm system on its own is only a tool. In Avenir's approach, security technology is part of the full on-site operation: it connects to guarding, gatehouse service, access control, signal handling and reporting.",
    "q": "How is this different from a simple camera or alarm system?"
  },
  {
    "a": "Yes. When designing a camera system, the assessment should consider purpose limitation, information to data subjects, documentation of legitimate interest, the field of view of the cameras, the retention period, and the site's own data-handling environment. This is not legal advice, but the technical recommendation must take these considerations into account.",
    "q": "Does a camera system need to be assessed from a data-protection perspective?"
  },
  {
    "a": "Retention time is influenced by the purpose of recording, the risk profile of the site, incident-handling needs, internal policy and the data-protection environment. There is no universal answer for every site; the retention rule must be established on a professionally justified basis.",
    "q": "What factors influence the retention time of camera footage?"
  }
]
```

## tavfelugyelet-vonuloszolgalat / long_desc_en

Audit: ENS-023

**Előtte**

```json
"Avenir receives intrusion, alarm and CCTV-related signals from connected sites through the agreed monitoring setup. Each signal is checked against the agreed verification protocol before escalation. False alarms are logged and can be analysed; genuine events are escalated to the named contact, response service or external escalation route according to the site protocol. Each action is recorded in the operations log.\n\nWhere the service involves monitored alarm handling, the verification step is built into the operating procedure and documented per incident. The legal and contractual framework for remote monitoring and response service is reviewed during onboarding; any external escalation is handled according to the agreed site protocol and applicable rules.\n\nRemote monitoring works best when it links to the site's other security layers: security technology, on-site guarding, gatehouse service and agreed response. The result is one operating model for signal handling, escalation, event logging and closure."
```

**Utána**

```json
"Avenir receives intrusion, alarm and CCTV-related signals from connected sites through the agreed monitoring setup. Each signal is checked against the agreed verification protocol before escalation. False alarms are logged and can be analysed; genuine events are escalated to the named contact, response service or external escalation route according to the site protocol. Each action is recorded in the event log.\n\nWhere the service involves monitored alarm handling, the verification step is built into the operating procedure and documented per incident. The legal and contractual framework for remote monitoring and response service is reviewed during onboarding; any external escalation is handled according to the agreed site protocol and applicable rules.\n\nRemote monitoring works best when it links to the site's other security layers: security technology, on-site guarding, gatehouse service and agreed response. The result is one operating model for signal handling, escalation, event logging and closure."
```

## tavfelugyelet-vonuloszolgalat / use_cases_en

Audit: ENS-045

**Előtte**

```json
[
  "Industrial and logistics sites with intrusion, alarm or perimeter signals",
  "Office buildings, warehouses and business centres with CCTV-monitored zones",
  "Sites with access control or intrusion detection requiring 24/7 signal handling",
  "Multi-tenant or multi-site portfolios needing a documented escalation chain",
  "Existing remote-monitoring services under review for verification, response or reporting gaps"
]
```

**Utána**

```json
[
  "Industrial and logistics sites with intrusion, alarm or perimeter signals",
  "Office buildings, warehouses and business centres with CCTV-monitored zones",
  "Sites with access control or intrusion detection requiring 24/7 signal handling",
  "Multi-tenant or multi-site portfolios needing a documented escalation chain",
  "Existing remote-monitoring or response-service processes under review for verification, response or reporting gaps"
]
```

## tavfelugyelet-vonuloszolgalat / included_items_en

Audit: ENS-023, ENS-046

**Előtte**

```json
[
  "24/7 alarm and CCTV signal reception under the agreed monitoring setup",
  "Verified-alarm protocol with documented verification step per incident",
  "Named contact chain, escalation matrix and notification rules",
  "Own response-service process under agreed contractual conditions",
  "Timestamped operations log and event reporting",
  "Integration with the site's security technology, guarding and gatehouse service"
]
```

**Utána**

```json
[
  "24/7 alarm and CCTV signal reception under the agreed monitoring setup",
  "Verified-alarm protocol with documented verification step per incident",
  "Named contact chain, escalation matrix and notification rules",
  "In-house response-service process under agreed contractual conditions",
  "Timestamped event log and event reporting",
  "Integration with the site's security technology, guarding and gatehouse service"
]
```

## tavfelugyelet-vonuloszolgalat / process_steps_en

Audit: ENS-023, ENS-047

**Előtte**

```json
[
  {
    "body": "We review the alarm points, signal sources, technical conditions and the site's guarding or gatehouse operations.",
    "title": "Review of on-site and technical conditions"
  },
  {
    "body": "We map the signal sources, routing points, verification points and documentation requirements for each signal type.",
    "title": "Mapping of signal sources and verification points"
  },
  {
    "body": "We define who must be notified for each event, in what order escalation takes place, and which event triggers a response-service or external escalation route.",
    "title": "Contact chain and escalation matrix design"
  },
  {
    "body": "We align the on-site response process with the technical conditions, service area and agreed contractual conditions.",
    "title": "Response-service deployment under agreed conditions"
  },
  {
    "body": "We define what must be logged, what reports are produced, which closing statuses are used, and how event handling can be reviewed later.",
    "title": "Operations log and reporting rules"
  },
  {
    "body": "After launch, recurring signals, operating experience and reports are reviewed, and the process is refined where needed.",
    "title": "Launch, monitoring and fine-tuning"
  }
]
```

**Utána**

```json
[
  {
    "body": "We review the alarm points, signal sources, technical conditions and the site's guarding or gatehouse operations.",
    "title": "Review of on-site and technical conditions"
  },
  {
    "body": "We map the signal sources, routing points, verification points and documentation requirements for each signal type.",
    "title": "Mapping of signal sources and verification points"
  },
  {
    "body": "We define who must be notified for each event, in what order escalation takes place, and which event triggers a response-service or external escalation route.",
    "title": "Contact chain and escalation matrix design"
  },
  {
    "body": "We align the on-site response process with the technical setup, service area and agreed contractual terms.",
    "title": "Response-service deployment under agreed conditions"
  },
  {
    "body": "We define what must be logged, what reports are produced, which closing statuses are used, and how event handling can be reviewed later.",
    "title": "Event log and reporting rules"
  },
  {
    "body": "After launch, recurring signals, operating experience and reports are reviewed, and the process is refined where needed.",
    "title": "Launch, operational follow-up and fine-tuning"
  }
]
```

## tavfelugyelet-vonuloszolgalat / trust_items_en

Audit: ENS-023

**Előtte**

```json
[
  {
    "body": "Avenir operates 24/7 signal reception for connected sites, with alarms checked against the agreed verification protocol before escalation.",
    "title": "24/7 signal reception with verified escalation"
  },
  {
    "body": "Each signal, verification step and escalation decision is recorded in an operations log that can be reviewed according to the service agreement.",
    "title": "Documented alarm-verification log"
  },
  {
    "body": "Notification order, named contacts and response triggers are agreed up front and documented for the site.",
    "title": "Named contact chain and escalation matrix"
  },
  {
    "body": "Remote monitoring runs alongside the site's CCTV, access control, on-site security and gatehouse service so signal handling and response follow one operating model.",
    "title": "Operational integration with security technology, guarding and gatehouse"
  },
  {
    "body": "Clients receive event reports according to the agreed cadence; the operations log supports review of false alarms, recurring events and improvement points.",
    "title": "Event recording and periodic incident reporting"
  },
  {
    "body": "Remote-monitoring operations are supported by Avenir's ISO 9001 and ISO 27001 certified management systems where these processes fall within the certified operating scope.",
    "title": "ISO 9001 and ISO 27001 management systems"
  }
]
```

**Utána**

```json
[
  {
    "body": "Avenir operates 24/7 signal reception for connected sites, with alarms checked against the agreed verification protocol before escalation.",
    "title": "24/7 signal reception with verified escalation"
  },
  {
    "body": "Each signal, verification step and escalation decision is recorded in an event log that can be reviewed according to the service agreement.",
    "title": "Documented alarm-verification log"
  },
  {
    "body": "Notification order, named contacts and response triggers are agreed up front and documented for the site.",
    "title": "Named contact chain and escalation matrix"
  },
  {
    "body": "Remote monitoring runs alongside the site's CCTV, access control, on-site security and gatehouse service so signal handling and response follow one operating model.",
    "title": "Operational integration with security technology, guarding and gatehouse"
  },
  {
    "body": "Clients receive event reports according to the agreed cadence; the event log supports review of false alarms, recurring events and improvement points.",
    "title": "Event recording and periodic incident reporting"
  },
  {
    "body": "Remote-monitoring operations are supported by Avenir's ISO 9001 and ISO 27001 certified management systems where these processes fall within the certified operating scope.",
    "title": "ISO 9001 and ISO 27001 management systems"
  }
]
```

## tavfelugyelet-vonuloszolgalat / faq_en

Audit: ENS-023, ENS-044, ENS-028, ENS-030, ENS-047, ENS-007

**Előtte**

```json
[
  {
    "a": "Avenir receives alarm, intrusion-detection, CCTV-related or other security technology signals from connected sites, checks them, logs them and escalates them according to the agreed protocol.",
    "q": "What does remote monitoring mean within Avenir's service?"
  },
  {
    "a": "Remote monitoring focuses on receiving and handling signals, while the response service can provide an on-site response process under contractual conditions. Together they form a more complete signal-handling and response model.",
    "q": "What is the difference between remote monitoring and response?"
  },
  {
    "a": "The process can be linked to intrusion detection, alarm events, a camera system, access-control events, perimeter signals or other security technology signals. The exact signal types must be defined based on on-site conditions and contractual requirements.",
    "q": "What kinds of signals can be handled?"
  },
  {
    "a": "The verification step is defined in the site protocol. Avenir checks the alarm against available signal sources and the agreed verification rule before escalation. False alarms are logged and can be reviewed; genuine events are escalated according to the documented contact and response protocol. Each step is recorded in the operations log.",
    "q": "How is an alarm verified before escalation?"
  },
  {
    "a": "Yes. Remote monitoring and response service are provided under the applicable Hungarian personal and property security licensing framework. Licence details and service documentation can be reviewed during contractual onboarding where required.",
    "q": "Is Avenir licensed to provide remote monitoring and response services in Hungary?"
  },
  {
    "a": "The response-service process must be defined based on contractual conditions, the site, technical conditions and the service area. For this reason, arrival or response rules are best recorded precisely at the start of the engagement.",
    "q": "Is a guaranteed arrival time provided?"
  },
  {
    "a": "Escalation follows the named contact chain, notification order and response matrix recorded in the site protocol. The protocol defines when a named contact, response service or external escalation route is involved.",
    "q": "How is escalation handled?"
  },
  {
    "a": "Yes. Clients receive event reports according to the agreed cadence; report format, frequency and content can be defined at the start of the engagement.",
    "q": "Do we receive event reports?"
  },
  {
    "a": "Signals are recorded in a timestamped operations log: when the signal arrived, what verification step was taken, what notification chain was triggered, whether escalation took place, what action followed and what closing status was reached. The details must be defined based on site and contractual rules.",
    "q": "How can alarm signals and events be documented?"
  },
  {
    "a": "Yes. Remote monitoring works well when the camera system, intrusion detection, access control, on-site security guarding and gatehouse processes support each other in alignment.",
    "q": "Can remote monitoring be linked to security technology?"
  },
  {
    "a": "Signals, CCTV streams and access-control events used in remote monitoring are handled only for the agreed monitoring purpose and according to the client's data-protection framework. Retention, access logging and minimisation rules are defined per site. Avenir supports the technical and operational side of this process; legal basis and final data-protection decisions remain with the client and its advisers.",
    "q": "How is data protection handled in remote-monitoring operations?"
  },
  {
    "a": "An on-site security assessment is useful when a new alarm or remote-monitoring operation needs to be set up, recurring signals occur, the access framework changes, or the existing response and escalation processes need to be made more transparent.",
    "q": "When is it worth requesting an on-site security assessment?"
  }
]
```

**Utána**

```json
[
  {
    "a": "Avenir receives alarm, intrusion-detection, CCTV-related or other security technology signals from connected sites, checks them, logs them and escalates them according to the agreed protocol.",
    "q": "What does remote monitoring mean within Avenir's service?"
  },
  {
    "a": "Remote monitoring focuses on receiving and handling signals, while the response service can provide an on-site response process under contractual conditions. Together they form a more complete signal-handling and response model.",
    "q": "What is the difference between remote monitoring and the response service?"
  },
  {
    "a": "The process can be linked to intrusion detection, alarm events, a camera system, access-control events, perimeter signals or other security technology signals. The exact signal types must be defined based on on-site conditions and contractual requirements.",
    "q": "What kinds of signals can be handled?"
  },
  {
    "a": "The verification step is defined in the site protocol. Avenir checks the alarm against available signal sources and the agreed verification rule before escalation. False alarms are logged and can be reviewed; genuine events are escalated according to the documented contact and response protocol. Each step is recorded in the event log.",
    "q": "How is an alarm verified before escalation?"
  },
  {
    "a": "Yes. Remote monitoring and the response service are provided under the applicable Hungarian regulatory framework for personal and property protection. Information on the licence and service documentation can be reviewed during contract preparation.",
    "q": "Is Avenir licensed to provide remote monitoring and response services in Hungary?"
  },
  {
    "a": "The response-service process must be defined based on contractual conditions, the site, technical conditions and the service area. For this reason, arrival or response rules are best recorded precisely at the start of the engagement.",
    "q": "Is a guaranteed arrival time provided?"
  },
  {
    "a": "Escalation follows the named contact chain, notification order and response matrix recorded in the site protocol. The protocol defines when a named contact, response service or external escalation route is involved.",
    "q": "How is escalation handled?"
  },
  {
    "a": "Yes. Clients receive event reports according to the agreed cadence; report format, frequency and content can be defined at the start of the engagement.",
    "q": "Do we receive event reports?"
  },
  {
    "a": "Signals are recorded in a timestamped event log: when the signal arrived, what verification step was taken, what notification chain was triggered, whether escalation took place, what action followed and what closing status was reached. The details must be defined based on site and contractual rules.",
    "q": "How can alarm signals and events be documented?"
  },
  {
    "a": "Yes. Remote monitoring works well when the camera system, intrusion detection, access control, on-site security guarding and gatehouse processes are aligned and support each other.",
    "q": "Can remote monitoring be linked to security technology?"
  },
  {
    "a": "Signals, CCTV streams and access-control events used in remote monitoring may be processed only for the agreed monitoring purpose and according to the client's data-protection framework. Retention, access logging and minimisation rules are defined per site. Avenir supports the technical and operational side of this process; legal basis and final data-protection decisions remain with the client and its advisers.",
    "q": "How is data protection handled in remote-monitoring operations?"
  },
  {
    "a": "An on-site security assessment is useful when a new alarm or remote-monitoring operation needs to be set up, recurring signals occur, the access framework changes, or the existing response and escalation processes need to be made more transparent.",
    "q": "When is it worth requesting an on-site security assessment?"
  }
]
```

## soft-fm / seo_description_en

Audit: ENS-062

**Előtte**

```json
"Soft FM services covering cleaning, landscaping, hygiene and waste-handling support, provider management, quality checks and reporting."
```

**Utána**

```json
"Soft FM services with cleaning coordination, grounds care, hygiene processes, operational support and reporting."
```

## soft-fm / long_desc_en

Audit: ENS-011

**Előtte**

```json
"Soft FM at Avenir covers the non-technical services that keep a corporate site running day to day: cleaning, landscaping, hygiene and waste-handling support, provider management and operational coordination.\n\nAt contract start, Avenir defines the delivery model with the client: Avenir staff, approved subcontractors or existing client-side service providers under Avenir coordination, depending on the site model and agreed scope.\n\nEvery Soft FM engagement starts with a written scope: areas, task frequencies, quality criteria, reporting cadence and escalation routes. Where the client already works with separate cleaning, landscaping or hygiene providers, Avenir manages the agreed coordination layer so the client receives one operational picture instead of several disconnected service flows."
```

**Utána**

```json
"Avenir's Soft FM service brings together the tasks that support a site's day-to-day, non-technical operations: cleaning, landscaping and hygiene processes, waste-handling support, provider coordination and on-site operational support. At contract start, Avenir defines the delivery model with the client: Avenir staff, approved subcontractors or existing client-side service providers under Avenir coordination, according to the agreed site model.\n\nEvery Soft FM engagement starts with a written scope: areas, task frequencies, quality criteria, reporting cadence and escalation routes. The aim is not an open-ended, 'as required' arrangement but a predefined, verifiable and reportable service framework.\n\nWhere the client already works with cleaning, landscaping, hygiene or other providers, Avenir can take over the coordination layer: daily on-site coordination, quality checks and reporting, so the client works from one consolidated operational picture instead of several fragmented contracts."
```

## soft-fm / value_proposition_en

Audit: ENS-061

**Előtte**

```json
"Soft FM covers the day-to-day services that keep a site running: cleaning, landscaping, hygiene, waste-handling support and provider management, delivered to an agreed scope, checked against defined quality criteria and reported through a regular reporting cadence."
```

**Utána**

```json
"Soft FM covers the day-to-day services that keep a site running: cleaning, landscaping, hygiene, waste-handling support and provider management, delivered to an agreed scope, checked against defined quality criteria, with regular reporting."
```

## soft-fm / use_cases_en

Audit: ENS-062

**Előtte**

```json
[
  "Office and business-centre operations where tenants expect visible daytime service standards, not only after-hours cleaning",
  "Industrial or logistics sites where cleaning, hygiene and waste-handling support must fit shift patterns and operating windows",
  "Multi-site operators that need consistent scope, task frequencies and reporting across locations",
  "Sites using multiple providers where day-to-day coordination has become the client's responsibility",
  "Operations where Soft FM, Hard FM, gatehouse and on-site security benefit from one operational interface",
  "Procurement, ESG or audit teams that need regular written reporting against agreed quality criteria"
]
```

**Utána**

```json
[
  "Office and business-centre operations where tenants expect visible daytime service standards",
  "Industrial or logistics sites where cleaning, hygiene and waste-handling support must fit shift patterns and operating windows",
  "Multi-site operators that need consistent scope, task frequencies and reporting across locations",
  "Sites using multiple providers where day-to-day coordination has become the client's responsibility",
  "Operations where Soft FM, Hard FM, gatehouse and on-site security benefit from one operational interface",
  "Procurement, ESG or audit teams that need regular written reporting against agreed KPIs and quality criteria"
]
```

## soft-fm / included_items_en

Audit: ENS-012, ENS-063, NEW-EN-SVC-003

**Előtte**

```json
[
  "Cleaning task frequencies for offices, common areas, washrooms and kitchenettes",
  "Periodic cleaning tasks such as floor, window and carpet cleaning, defined in the service scope.",
  "Landscaping and grounds-care coordination",
  "Hygiene consumables and washroom-service coordination",
  "Waste-handling support and provider liaison",
  "On-site issue, deviation and corrective-action tracking",
  "Provider and subcontractor management with quality checks",
  "Regular written reporting covering completed scope, quality observations, recurring issues and actions"
]
```

**Utána**

```json
[
  "Daily cleaning operations in agreed areas and at agreed task frequencies",
  "Periodic cleaning tasks such as floor, window or carpet cleaning, where included in the scope",
  "Landscaping and grounds-care coordination where part of the site model",
  "Hygiene consumables and washroom-service coordination",
  "Waste-handling support and provider liaison according to the agreed operating model",
  "On-site issue, deviation and corrective-action tracking",
  "Coordination of providers and subcontractors where the client has existing suppliers",
  "Regular written reporting covering completed scope, quality observations, recurring issues and actions"
]
```

## soft-fm / process_steps_en

Audit: ENS-064, ENS-003

**Előtte**

```json
[
  {
    "body": "Avenir starts with an initial site walk, reviewing areas, service touchpoints, operating windows and the existing provider setup before scope finalisation.",
    "title": "Site walk and scope mapping"
  },
  {
    "body": "Avenir defines the service areas, task frequencies, control points, quality criteria and reporting cadence before operational start.",
    "title": "Written scope, frequencies and quality criteria"
  },
  {
    "body": "During scoping, Avenir agrees the delivery model with the client: Avenir staff, approved subcontractors or existing client-side service providers under Avenir coordination, depending on the site model.",
    "title": "Delivery model and team/provider structure"
  },
  {
    "body": "Before go-live, Avenir prepares the operating framework: responsibilities, contact points, escalation routes, site instructions and the records needed for day-to-day control.",
    "title": "Mobilisation and site documentation"
  },
  {
    "body": "During the first month, Avenir tracks early issues, clarifies responsibilities and stabilises the operating cadence within the agreed scope.",
    "title": "Go-live and stabilisation period"
  },
  {
    "body": "Avenir reports completed tasks, quality observations, recurring issues and agreed actions, then reviews the service periodically with the client.",
    "title": "Regular reporting and periodic review"
  }
]
```

**Utána**

```json
[
  {
    "body": "Avenir starts with an initial site walk, reviewing areas, service touchpoints, operating windows and the existing provider setup before scope finalisation.",
    "title": "Site walk and scope mapping"
  },
  {
    "body": "Avenir defines the service areas, task frequencies, control points, quality criteria and reporting cadence before operational start.",
    "title": "Written scope, frequencies and quality criteria"
  },
  {
    "body": "During scoping, Avenir agrees the delivery model with the client: Avenir staff, approved subcontractors or existing client-side service providers under Avenir coordination, depending on the site model.",
    "title": "Delivery model and team structure"
  },
  {
    "body": "Before go-live, Avenir prepares the operating framework: responsibilities, contact points, escalation routes, site instructions and the records needed for day-to-day control.",
    "title": "Mobilisation and operational setup"
  },
  {
    "body": "During the initial operating period, Avenir tracks early issues, clarifies responsibilities and stabilises the operating cadence within the agreed scope.",
    "title": "Go-live and stabilisation period"
  },
  {
    "body": "Avenir reports completed tasks, quality observations, recurring issues and agreed actions, then reviews the service periodically with the client.",
    "title": "Regular reporting and periodic review"
  }
]
```

## soft-fm / faq_en

Audit: ENS-065

**Előtte**

```json
[
  {
    "a": "Soft FM means the coordinated management of non-technical services that keep a site running day to day. At Avenir, this covers cleaning, landscaping, hygiene and waste-handling support, operational coordination and provider management within an agreed scope.",
    "q": "What does Soft FM mean?"
  },
  {
    "a": "Hard FM focuses on technical, maintenance and building-operations processes. Soft FM covers the day-to-day support services around cleaning, landscaping, hygiene processes and on-site operational coordination. On many sites, the two functions work best when their reporting and escalation routes are aligned.",
    "q": "How does Soft FM differ from Hard FM?"
  },
  {
    "a": "No. Cleaning is often a core part of Soft FM, but the service is broader. Avenir manages the operating layer around cleaning, provider management, landscaping, hygiene processes, quality checks, reporting and on-site support.",
    "q": "Is Soft FM only about cleaning?"
  },
  {
    "a": "Yes. Within the agreed Soft FM model, Avenir coordinates provider responsibilities, contact points, escalation routes and reporting expectations from contract start.",
    "q": "Can Avenir coordinate multiple providers or subcontractors?"
  },
  {
    "a": "No universal cleaning-quality guarantee should replace a defined scope. Avenir manages quality through agreed tasks, defined criteria, service checks, reporting and corrective actions, so expectations are specific and reviewable.",
    "q": "Is a guaranteed cleaning quality offered?"
  },
  {
    "a": "Avenir checks quality through agreed control points, service checks, recurring issue tracking, feedback loops and regular written reporting against site-specific expectations.",
    "q": "How is Soft FM service quality checked?"
  },
  {
    "a": "Yes. Regular written reporting is part of structured Soft FM engagements, covering completed scope, quality observations, recurring issues and agreed actions.",
    "q": "Do we receive written reports on Soft FM tasks?"
  },
  {
    "a": "Yes. At many sites, gatehouse, reception, on-site security or Hard FM teams are the first to flag operational issues. Soft FM works better when signals, responsibilities, providers and reporting flows are aligned through one operating model.",
    "q": "Can Soft FM be linked to gatehouse or security operations?"
  }
]
```

**Utána**

```json
[
  {
    "a": "Soft FM means the coordinated management of non-technical services that keep a site running day to day. At Avenir, this covers cleaning, landscaping, hygiene and waste-handling support, operational coordination and provider management within an agreed scope.",
    "q": "What does Soft FM mean?"
  },
  {
    "a": "Hard FM focuses on technical, maintenance and building-operations processes. Soft FM covers the day-to-day support services around cleaning, landscaping, hygiene processes and on-site operational coordination. On many sites, the two functions work best when their reporting and escalation routes are aligned.",
    "q": "How does Soft FM differ from Hard FM?"
  },
  {
    "a": "No. Cleaning is often a core part of Soft FM, but the service is broader. Avenir manages the operating layer around cleaning, provider management, landscaping, hygiene processes, quality checks, reporting and on-site support.",
    "q": "Is Soft FM only about cleaning?"
  },
  {
    "a": "Yes. Within the agreed Soft FM model, Avenir coordinates provider responsibilities, contact points, escalation routes and reporting expectations from contract start.",
    "q": "Can Avenir coordinate multiple providers or subcontractors?"
  },
  {
    "a": "No universal cleaning-quality guarantee should replace a defined scope. Avenir manages quality through agreed tasks, defined criteria, service checks, reporting and corrective actions, so expectations are specific and reviewable.",
    "q": "Do you guarantee cleaning quality?"
  },
  {
    "a": "Avenir checks quality through agreed control points, service checks, recurring issue tracking, feedback loops and regular written reporting against site-specific expectations.",
    "q": "How is Soft FM service quality checked?"
  },
  {
    "a": "Yes. Regular written reporting is part of structured Soft FM engagements, covering completed scope, quality observations, recurring issues and agreed actions.",
    "q": "Do we receive written reports on Soft FM tasks?"
  },
  {
    "a": "Yes. At many sites, gatehouse, reception, on-site security or Hard FM teams are the first to flag operational issues. Soft FM works better when signals, responsibilities, providers and reporting flows are aligned through one operating model.",
    "q": "Can Soft FM be linked to gatehouse or security operations?"
  }
]
```

## hard-fm / long_desc_en

Audit: ENS-057, ENS-026

**Előtte**

```json
"Avenir's Hard FM service covers planned preventive maintenance and reactive fault handling for the technical systems of commercial, industrial and logistics sites. The scope may include building fabric, mechanical and electrical systems, plumbing, HVAC, minor technical works, specialist subcontractor coordination and documented fault tracking.\n\nAvenir sets the fault-reporting route, escalation points, provider responsibilities, intervention records and reporting rhythm with the client at mobilisation. Where specialist subcontractors are needed for HVAC, electrical, plumbing or statutory inspection work, they are coordinated through the agreed operating model rather than left as a hidden hand-off to the client.\n\nHard FM can run as a stand-alone technical operations service or alongside Avenir's Reception, On-site Security Guarding or Soft FM on the same site. In integrated setups, the reporting rhythm, escalation chain and operational contact points are aligned so the client receives one technical picture instead of fragmented provider updates."
```

**Utána**

```json
"Avenir's Hard FM service covers planned preventive maintenance and reactive fault handling for the technical systems of commercial, industrial and logistics sites. The scope may include building fabric, mechanical and electrical systems, plumbing, HVAC, minor technical works, specialist subcontractor coordination and documented fault tracking.\n\nAvenir sets the fault-reporting route, escalation points, provider responsibilities, intervention records and reporting rhythm with the client at mobilisation. Where specialist subcontractors are needed for HVAC, electrical, plumbing or statutory inspection work, they are coordinated through the agreed operating model rather than left as a hidden hand-off to the client.\n\nHard FM can run as a standalone technical operations service or alongside Avenir's Reception and Gatehouse Services, On-site Security Guarding or Soft FM on the same site. In integrated setups, the reporting rhythm, escalation chain and operational contact points are aligned so the client receives one technical picture instead of fragmented provider updates."
```

## hard-fm / value_proposition_en

Audit: ENS-056

**Előtte**

```json
"Hard FM covers planned preventive maintenance and reactive fault handling for building fabric, M&E systems, plumbing, HVAC and technical operations, with documented escalation and reporting."
```

**Utána**

```json
"Hard FM covers planned preventive maintenance and reactive fault handling for building operations, mechanical and electrical systems, plumbing, HVAC and technical operations, with documented escalation and reporting."
```

## hard-fm / use_cases_en

Audit: ENS-056

**Előtte**

```json
[
  "Owners and operators of office buildings and business centres",
  "Logistics, warehouse and light-industrial sites with mixed technical systems",
  "Single-site occupiers needing one accountable technical operating model",
  "Multi-site portfolios consolidating fragmented FM provider coordination",
  "Sites where Hard FM should align with reception, security or Soft FM operations"
]
```

**Utána**

```json
[
  "Owners and operators of office buildings and business centres",
  "Logistics, warehouse and light-industrial sites with complex technical systems",
  "Single-site operators seeking a unified technical operating model",
  "Multi-site portfolios consolidating fragmented FM provider coordination",
  "Sites where Hard FM should align with reception, security or Soft FM operations"
]
```

## hard-fm / process_steps_en

Audit: ENS-059, ENS-058

**Előtte**

```json
[
  {
    "body": "We review the agreed assets, systems, technical condition, recurring faults and relevant provider group.",
    "title": "Asset and condition review"
  },
  {
    "body": "Together with the client, we define the preventive maintenance schedule, fault-reporting route and priority categories for reactive tasks.",
    "title": "PPM schedule and priority categories"
  },
  {
    "body": "We record provider responsibilities, specialist subcontractor involvement rules, escalation points and operational contact points.",
    "title": "Mobilisation and operations setup"
  },
  {
    "body": "Fault reports, interventions, status changes, closures and open tasks are tracked in a documented fault log and monthly report.",
    "title": "Operate, log and report"
  },
  {
    "body": "Based on reports and operating experience, we review recurring faults, open risks and the next improvement points.",
    "title": "Review recurring faults and improvement points"
  }
]
```

**Utána**

```json
[
  {
    "body": "We review the agreed assets, systems, technical condition, recurring faults and the providers involved.",
    "title": "Asset and condition review"
  },
  {
    "body": "Together with the client, we define the preventive maintenance schedule, fault-reporting route and priority categories for reactive tasks.",
    "title": "PPM schedule and priority categories"
  },
  {
    "body": "We record provider responsibilities, specialist subcontractor involvement rules, escalation points and operational contact points.",
    "title": "Mobilisation and operations setup"
  },
  {
    "body": "Fault reports, interventions, status changes, closures and open tasks are tracked in a documented fault log and monthly report.",
    "title": "Operation, logging and reporting"
  },
  {
    "body": "Based on reports and operating experience, we review recurring faults, open risks and the next improvement points.",
    "title": "Review of recurring faults and improvement points"
  }
]
```

## hard-fm / trust_items_en

Audit: ENS-060

**Előtte**

```json
[
  {
    "body": "The client receives a named operational contact for fault intake, escalation, provider coordination and reporting.",
    "title": "Named operational contact"
  },
  {
    "body": "Reactive jobs are classified by agreed priority categories at mobilisation, so urgent faults, routine tasks and planned work follow separate handling paths.",
    "title": "Priority-based reactive fault handling"
  },
  {
    "body": "HVAC, electrical, plumbing and inspection tasks can be delivered by specialist providers coordinated through the agreed operating model.",
    "title": "Specialist subcontractor coordination"
  },
  {
    "body": "Fault reports, interventions, status changes and closures are recorded and summarised in a monthly operations report.",
    "title": "Documented fault log and monthly report"
  },
  {
    "body": "Where Hard FM runs alongside reception, on-site security or Soft FM, reporting, escalation and operational contact points are aligned for the same site.",
    "title": "Integrated with reception, security and Soft FM"
  }
]
```

**Utána**

```json
[
  {
    "body": "The client receives a named operational contact for fault intake, escalation, provider coordination and reporting.",
    "title": "Named operational contact"
  },
  {
    "body": "Reactive jobs are classified by agreed priority categories at mobilisation, so urgent faults, routine tasks and planned work follow separate handling paths.",
    "title": "Priority-based reactive fault handling"
  },
  {
    "body": "HVAC, electrical, plumbing and inspection tasks can be delivered by specialist providers coordinated through the agreed operating model.",
    "title": "Specialist subcontractor coordination"
  },
  {
    "body": "Fault reports, interventions, status changes and closures are recorded and can be summarised in a monthly operations report.",
    "title": "Documented fault log and monthly report"
  },
  {
    "body": "Where Hard FM runs alongside reception, on-site security or Soft FM, reporting, escalation and operational contact points can be aligned for the same site.",
    "title": "Integrated with reception, security and Soft FM"
  }
]
```

## hard-fm / faq_en

Audit: ENS-059

**Előtte**

```json
[
  {
    "a": "Hard FM means the coordinated handling of technical operations, maintenance processes, fault reports and supplier coordination across sites. The goal is for technical operations to be transparent and documented.",
    "q": "What does Hard FM mean?"
  },
  {
    "a": "Hard FM focuses primarily on technical, maintenance and operational processes, while Soft FM is more closely linked to services that support daily operations, such as cleaning, landscaping or operational support. The two areas often work effectively together at the same site.",
    "q": "How does Hard FM differ from Soft FM?"
  },
  {
    "a": "Yes. Hard FM can include the design of how fault reports are received, routed, prioritised and escalated. The exact process should be defined based on on-site needs and contractual scope.",
    "q": "Can fault reports be handled as well?"
  },
  {
    "a": "It depends on the nature of the task and the contractual framework. The Hard FM service may include in-house coordination, the involvement of designated providers, subcontractor management, or coordination of client-side service providers.",
    "q": "Does Avenir carry out all technical work itself?"
  },
  {
    "a": "Repair or response times depend on the site, task type, access conditions and the subcontractors required. Avenir can define priority categories at mobilisation so urgent faults, routine tasks and planned maintenance follow separate handling paths, but this does not create a universal guaranteed repair time.",
    "q": "Is there a guaranteed repair time?"
  },
  {
    "a": "Yes, agreed reporting can be part of the service. Reports may include fault reports, statuses, interventions, closed tasks, recurring issues and improvement recommendations.",
    "q": "Do we receive reports on the technical work?"
  },
  {
    "a": "It is worth setting up a dedicated Hard FM process when technical faults, maintenance tasks, subcontractors and reporting are currently handled ad hoc or by several disconnected providers. A dedicated process gives the client a clearer fault route, priority categories, status tracking and reporting rhythm.",
    "q": "When is it worth setting up a dedicated Hard FM process?"
  },
  {
    "a": "Yes. At many sites, the gatehouse, on-site security guarding or security technology operations are the first to detect a technical issue. Hard FM works well when the signals, responsible parties, providers and escalation points are aligned.",
    "q": "Can Hard FM be linked to security or gatehouse operations?"
  }
]
```

**Utána**

```json
[
  {
    "a": "Hard FM means the coordinated handling of technical operations, maintenance processes, fault reports and provider coordination across sites. The goal is for technical operations to be transparent and documented.",
    "q": "What does Hard FM mean?"
  },
  {
    "a": "Hard FM focuses primarily on technical, maintenance and operational processes, while Soft FM is more closely linked to services that support daily operations, such as cleaning, landscaping or operational support. The two areas often work effectively together at the same site.",
    "q": "How does Hard FM differ from Soft FM?"
  },
  {
    "a": "Yes. Hard FM can include the design of how fault reports are received, routed, prioritised and escalated. The exact process should be defined based on on-site needs and contractual scope.",
    "q": "Can fault reports be handled as well?"
  },
  {
    "a": "It depends on the nature of the task and the contractual framework. The Hard FM service may include in-house coordination, the involvement of designated providers, subcontractor management, or coordination of client-side service providers.",
    "q": "Does Avenir carry out all technical work itself?"
  },
  {
    "a": "Repair or response times depend on the site, task type, access conditions and the subcontractors required. Avenir can define priority categories at mobilisation so urgent faults, routine tasks and planned maintenance follow separate handling paths, but this does not create a universal guaranteed repair time.",
    "q": "Is there a guaranteed repair time?"
  },
  {
    "a": "Yes, agreed reporting can be part of the service. Reports may include fault reports, statuses, interventions, closed tasks, recurring issues and improvement recommendations.",
    "q": "Do we receive reports on the technical work?"
  },
  {
    "a": "It is worth setting up a dedicated Hard FM process when technical faults, maintenance tasks, subcontractors and reporting are currently handled ad hoc or by several disconnected providers. A dedicated process gives the client a clearer fault route, priority categories, status tracking and reporting rhythm.",
    "q": "When is it worth setting up a dedicated Hard FM process?"
  },
  {
    "a": "Yes. At many sites, the gatehouse, on-site security guarding or security technology operations are the first to detect a technical issue. Hard FM works well when the signals, responsible parties, providers and escalation points are aligned.",
    "q": "Can Hard FM be linked to security or gatehouse operations?"
  }
]
```

## objektumorzes / short_desc_de

Audit: EDU-003

**Előtte**

```json
"Personen- und Sachschutz mit geschulten Sicherheitskräften: Objektschutz, Streifendienste, Unterstützung bei der Zutrittskontrolle und Vorfallbearbeitung in Industrie-, Handels- und Büroumgebungen."
```

**Utána**

```json
"Objektschutz vor Ort mit Zutrittskontrolle, Kontrollgängen, Vorfallbearbeitung, Dienstbuch und abgestimmter Eskalationsordnung."
```

## objektumorzes / name_de

Audit: EDU-017 / DEB-044

**Előtte**

```json
"Personeller Objektschutz"
```

**Utána**

```json
"Objektschutz vor Ort"
```

## portaszolgalat / short_desc_de

Audit: EDU-007

**Előtte**

```json
"Repräsentativer Pförtnerdienst und Empfangspräsenz: Besucherempfang, Zutrittskontrolle, Schlüsselverwaltung, Paketannahme und Mieterkommunikation zur Unterstützung des täglichen Betriebs."
```

**Utána**

```json
"Empfangs- und Pförtnerdienst für Besucher, Lieferanten, Mitarbeiter, Schlüssel, Pakete, Protokollierung und abgestimmte Eskalation."
```

## mystery-shopping-helyszini-audit / short_desc_de

Audit: EDU-007

**Előtte**

```json
"Mystery Shopping, Servicequalitätskontrollen und Vor-Ort-Audits in realen Kunden- und Betriebssituationen, mit unabhängiger Bewertung und strukturiertem Reporting."
```

**Utána**

```json
"Mystery Shopping und Serviceaudit in realen Kunden- und Betriebssituationen, mit strukturierter Beobachtung, Berichtswesen und Verbesserungsempfehlungen."
```

## mystery-shopping-helyszini-audit / name_de

Audit: EDU-017 / DEB-044

**Előtte**

```json
"Mystery Shopping und Vor-Ort-Audits"
```

**Utána**

```json
"Mystery Shopping und Serviceaudit"
```

## rendezvenybiztositas / short_desc_de

Audit: EDU-007

**Előtte**

```json
"Absicherung von Firmenevents, Konferenzen und Sonderveranstaltungen nach abgestimmten Protokollen: Zutrittskontrolle, Präsenz vor Ort, Streifendienste und Vorfallbearbeitung."
```

**Utána**

```json
"Veranstaltungssicherheit für Firmen-, geschlossene und öffentliche Veranstaltungen, mit Zutrittskontrolle, Unterstützung der Besucherströme, Zonenmanagement, Vorfallerfassung und Eskalation an die Veranstaltungsleitung."
```

## rendezvenybiztositas / name_de

Audit: EDU-017 / DEB-044

**Előtte**

```json
"Veranstaltungsschutz"
```

**Utána**

```json
"Veranstaltungssicherheit"
```

## biztonsagtechnika / short_desc_de

Audit: EDU-004

**Előtte**

```json
"Planung, Installation und Wartung von Videoüberwachungs-, Zutrittskontroll- und Alarmanlagen als technische Unterstützung für den personellen Objektschutz."
```

**Utána**

```json
"Sicherheitstechnik für Kamerasysteme, Zutrittskontrolle und Alarmprozesse, eingebettet in ein standortgerechtes Sicherheitsmodell, mit technischer Planung, die Datenschutzaspekte einbezieht."
```

## tavfelugyelet-vonuloszolgalat / short_desc_de

Audit: EDU-002

**Előtte**

```json
"Bearbeitung von Alarm- und Kamerasignalen mit Leitstellenunterstützung, bei Bedarf mit Reaktion vor Ort, nach abgestimmten Protokollen."
```

**Utána**

```json
"Fernüberwachung und Interventionsdienst mit Signalempfang, Alarmverifikation, Eskalation, Ereignisprotokollierung und abgestimmtem Reaktionsprozess."
```

## soft-fm / short_desc_de

Audit: EDU-007

**Előtte**

```json
"Organisation von Reinigungs-, Grünpflege- und Hausmeisterleistungen als ergänzende Services, mit kontrollierter Qualität und einem verantwortlichen Ansprechpartner."
```

**Utána**

```json
"Soft FM für Reinigung, Grünpflege, Hygiene, Unterstützung bei der Abfallentsorgung und Dienstleistersteuerung, mit vereinbartem Leistungsumfang, Qualitätskontrolle und schriftlichem Berichtswesen."
```

## hard-fm / short_desc_de

Audit: EDU-007

**Előtte**

```json
"Unterstützung bei technischem Betrieb, Wartungskoordination und kleineren Reparaturarbeiten als ergänzende Leistung in komplexen Kundenumgebungen."
```

**Utána**

```json
"Hard FM mit geplanter vorbeugender Instandhaltung, reaktiver Störungsbearbeitung, Koordination von Fachfirmen, dokumentiertem Störungsprotokoll und betrieblichem Berichtswesen."
```

## objektumorzes / short_desc_zh

Audit: FKZ-004

**Előtte**

```json
"由训练有素的安保人员提供人身及财产安全保护：驻场安保、巡逻服务、出入管理支持和事件处理，适用于工业、商业和办公环境。"
```

**Utána**

```json
"驻场安保服务：出入管理、巡逻、事件处理、执勤日志及约定的升级处理流程。"
```

## biztonsagtechnika / short_desc_zh

Audit: FKZ-004

**Előtte**

```json
"视频监控、门禁和报警系统的设计、安装与维护，为驻场安保提供技术支持。"
```

**Utána**

```json
"通过考虑数据保护的技术设计，将视频监控、门禁及报警流程整合进适合现场的安保模式。"
```

## portaszolgalat / short_desc_zh

Audit: FKZ-011

**Előtte**

```json
"专业规范的门岗和前台服务：访客接待、出入管理、钥匙管理、包裹接收以及租户沟通，支持日常运营。"
```

**Utána**

```json
"前台与门岗服务：管理访客、供应商、员工、钥匙、包裹、日志记录及约定的升级处理。"
```

## mystery-shopping-helyszini-audit / short_desc_zh

Audit: FKZ-011

**Előtte**

```json
"在真实客户和运营场景中开展神秘顾客评估、服务质量检查和现场审核，并提供独立评估与结构化报告。"
```

**Utána**

```json
"在真实客户与运营情境中开展神秘顾客与服务审核，提供结构化观察、报告及改进建议。"
```

## rendezvenybiztositas / short_desc_zh

Audit: FKZ-011

**Előtte**

```json
"按照约定流程为企业活动、会议和专项活动提供安保服务：出入管理、现场值守、巡逻和事件处理。"
```

**Utána**

```json
"为企业、非公开及公开活动提供出入管理、观众动线支持、分区管理、事件记录及向主办方升级处理。"
```

## hard-fm / short_desc_zh

Audit: FKZ-011

**Előtte**

```json
"作为补充服务，支持技术设施运营、维护协调和小型维修工作，适用于复杂客户环境。"
```

**Utána**

```json
"通过计划性预防维护、故障响应、专业服务商协调、书面故障日志及运营报告提供 Hard FM。"
```

## soft-fm / short_desc_zh

Audit: FKZ-011

**Előtte**

```json
"作为补充服务，统筹清洁、绿化维护和现场管理事务，以受控质量和单一责任对接人支持客户运营。"
```

**Utána**

```json
"按约定范围、质量检查及书面报告提供清洁、绿化、卫生、废弃物处理支持及服务商管理。"
```

## tavfelugyelet-vonuloszolgalat / short_desc_zh

Audit: NEW-ZH-006

**Előtte**

```json
"依托调度后台处理报警和视频监控信号，并在需要时按照约定流程进行现场响应。"
```

**Utána**

```json
"远程监控与现场响应服务：信号接收、报警核实、升级处理、事件记录及约定的响应流程。"
```

## objektumorzes / name_zh

Audit: FKZ-012 / ZHS-006

**Előtte**

```json
"驻场安保服务"
```

**Utána**

```json
"驻场安保"
```

## tavfelugyelet-vonuloszolgalat / name_zh

Audit: FKZ-012 / ZHS-006

**Előtte**

```json
"远程监控与现场响应服务"
```

**Utána**

```json
"远程监控与现场响应"
```

## mystery-shopping-helyszini-audit / name_zh

Audit: FKZ-012 / ZHS-006

**Előtte**

```json
"神秘顾客评估与现场审核"
```

**Utána**

```json
"神秘顾客与服务审核"
```

## hard-fm / name_zh

Audit: FKZ-012 / ZHS-006

**Előtte**

```json
"Hard FM（硬性设施管理）"
```

**Utána**

```json
"Hard FM — 技术设施管理"
```

## soft-fm / name_zh

Audit: FKZ-012 / ZHS-006

**Előtte**

```json
"Soft FM（软性设施管理）"
```

**Utána**

```json
"Soft FM — 日常设施支持"
```

