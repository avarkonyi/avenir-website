import type {
  LocalizedServiceDetail,
  LocalizedServiceRow,
  PublishedServicePath,
} from "@/lib/db/queries/services";
import {
  DE_REVIEW_SERVICE_DETAIL_SHARED_COPY,
  DE_REVIEW_SERVICE_QUOTE_COPY,
} from "./de-service-shared-copy";

// Generated from docs/translations/de/source/service_tiles_de_full.csv.
// Source package validation: docs/translations/de/service_tiles_de_full_validation.md.
// Review-mode policy: these routes are renderable, noindex, and excluded from sitemap/hreflang.
export const DE_REVIEW_SERVICE_SLUGS = [
  "objektumorzes",
  "portaszolgalat",
  "mystery-shopping-helyszini-audit",
  "rendezvenybiztositas",
  "biztonsagtechnika",
  "tavfelugyelet-vonuloszolgalat",
  "hard-fm",
  "soft-fm"
] as const;

export type DeReviewServiceSlug = (typeof DE_REVIEW_SERVICE_SLUGS)[number];

export type DeReviewServiceDetail = LocalizedServiceDetail & {
  readonly legalReviewRequired: boolean;
  readonly legalReviewRequiredKeys: readonly string[];
};

export const DE_REVIEW_SERVICE_PATHS = DE_REVIEW_SERVICE_SLUGS.map((slug) => ({
  locale: "de" as const,
  slug,
})) satisfies readonly PublishedServicePath[];

const DE_REVIEW_SERVICE_DETAILS = {
  "objektumorzes": {
    "id": 1,
    "slug": "objektumorzes",
    "icon": "shield",
    "imageUrl": null,
    "name": "Objektschutz vor Ort",
    "shortDesc": "Objektschutz mit Zutrittskontrolle, Kontrollgängen, Vorfallbearbeitung und Berichtswesen. Standortspezifische Protokolle für Unternehmensstandorte.",
    "longDesc": "Ziel des Objektschutzes vor Ort ist nicht allein die Präsenz von Sicherheitspersonal, sondern der Aufbau einer auf den Standort zugeschnittenen Sicherheitsordnung. Auf Grundlage einer Begehung vor Ort erstellt Avenir eine Dienstanweisung: Sie legt die Zutritts- und Austrittspunkte, den Umgang mit Besuchern und Lieferanten, die Routen der Kontrollgänge, die Regeln der Schlüsselverwaltung, die Dokumentation von Vorfällen und die Eskalationsordnung fest.\n\nDer Dienst kann mit dem vorhandenen Kamerasystem, der Zutrittskontrollanlage oder dem Alarmprozess des Auftraggebers verknüpft werden. Ziel ist, dass der Auftraggeber nicht nur Präsenz erhält, sondern einen nachvollziehbaren Betrieb: mit Dienstbuch, Ereignisberichten, regelmäßiger Abstimmung und einem benannten verantwortlichen Ansprechpartner.\n\nDie Präsenz des Sicherheitspersonals richtet sich nach dem Risikoprofil des Standorts und dem vertraglichen Bedarf: Es kann ein unbewaffneter oder — bei Erfüllung der gesetzlichen Voraussetzungen — ein bewaffneter Sicherheitsdienst eingerichtet werden. Avenir erbringt die Leistung nach dem anwendbaren ungarischen Regulierungsrahmen für Personen- und Vermögensschutz.",
    "seoTitle": "Objektschutz vor Ort für Unternehmen | Avenir",
    "seoDescription": "Objektschutz mit Zutrittskontrolle, Kontrollgängen, Vorfallbearbeitung und Berichtswesen. Standortspezifische Protokolle für Unternehmensstandorte.",
    "valueProposition": "Mit standortgerechtem Objektschutz unterstützen wir die Sicherheitsordnung von Betriebsgeländen, Bürogebäuden, Logistik- und Industriestandorten: auf Basis von Zutritts- und Austrittskontrolle, Kontrollgängen, Vorfallbearbeitung, Dienstbuch und abgestimmter Eskalation.",
    "highlights": [],
    "useCases": [
      "Logistikzentren, Lager und Standorte mit Lkw-Toren",
      "Industrie- und Produktionsstandorte",
      "Bürogebäude und Businesscenter",
      "Einzelhandels- und Einkaufszentrumsumgebungen",
      "Baustellen sowie temporäre oder erhöht risikobehaftete Standorte"
    ],
    "includedItems": [
      "Unterstützung der Zutritts- und Austrittsordnung",
      "Besucher-, Lieferanten- und Schlüsselverwaltung",
      "Kontrollgänge, Kontrollpunkte und Geländebegehung",
      "Erfassung und Eskalation von Vorfällen",
      "Dienstbuch und abgestimmtes Berichtswesen",
      "Sicherheitsbegehung vor Ort und Protokollvorschlag",
      "Anbindung an vorhandene Kamera-, Zutrittskontroll- oder Alarmprozesse, sofern der Standort dies erfordert"
    ],
    "processSteps": [
      {
        "title": "Erstabstimmung und Bedarfsaufnahme",
        "body": "Wir sehen die Anfrage durch und melden uns spätestens am nächsten Werktag über die angegebenen Kontaktdaten. Wie lange die Angebotserstellung dauert, hängt vom Standort und der Komplexität der Anfrage ab."
      },
      {
        "title": "Begehung vor Ort und Überblick über die Risikopunkte",
        "body": "Die Begehung vor Ort und die grundlegende Risikoübersicht lassen sich in der Regel innerhalb von 1–3 Arbeitstagen organisieren."
      },
      {
        "title": "Festlegung der Zutritts-, Austritts-, Kontrollgang- und Eskalationsordnung",
        "body": "Wir legen die Zutrittspunkte, den Besucher- und Lieferantenprozess, die Routen der Kontrollgänge und die Meldeordnung für Vorfälle fest."
      },
      {
        "title": "Festschreibung der Dienstanweisung und des Berichtsprozesses",
        "body": "Wir halten schriftlich fest, was zu dokumentieren ist, in welchem Rhythmus berichtet wird und wer bei Abweichungen oder Vorfällen benachrichtigt wird."
      },
      {
        "title": "Organisation der Präsenz des Sicherheitspersonals",
        "body": "Die unbewaffnete oder bewaffnete Präsenz des Sicherheitspersonals organisieren wir auf Grundlage des vertraglichen Bedarfs, der rechtlichen Voraussetzungen und des Risikoprofils des Standorts."
      },
      {
        "title": "Regelmäßige Abstimmung, Berichtswesen und Feinjustierung",
        "body": "Im laufenden Betrieb stimmen wir die Erfahrungen aus dem Dienst, wiederkehrende Ereignisse und die Berichte mit dem benannten Ansprechpartner ab."
      }
    ],
    "trustItems": [
      {
        "title": "24/7-Leitstelle im Hintergrund",
        "body": "Der Objektschutzbetrieb kann durch eine 24/7-Leitstelle unterstützt werden; die Benachrichtigungs- und Eskalationsordnung legen wir zu Beginn der Zusammenarbeit fest."
      },
      {
        "title": "Dienstbuch und Ereignisbearbeitung",
        "body": "Dienstbuch, Ereigniserfassung, abgestimmtes Berichtswesen und Eskalationsordnung unterstützen die Kontrolle vor Ort."
      },
      {
        "title": "Ein verantwortlicher Ansprechpartner",
        "body": "Für den laufenden Betrieb stellen wir einen benannten verantwortlichen Ansprechpartner, sodass der Auftraggeber nicht zwischen getrennten Akteuren koordinieren muss."
      },
      {
        "title": "ISO 9001 und ISO 27001",
        "body": "Die Dienstprozesse werden durch die nach ISO 9001 und ISO 27001 zertifizierten Managementsysteme von Avenir unterstützt, sofern die betreffenden Prozesse in den zertifizierten Geltungsbereich fallen."
      },
      {
        "title": "Dokumentierte Standorteinführung",
        "body": "Die Dienstanweisung wird vor Dienstbeginn festgeschrieben und mit dem verantwortlichen Ansprechpartner abgestimmt; sie umfasst Zutrittspunkte, Kontrollgangrouten, Schlüsselverwaltung, Vorfallerfassung und Eskalation."
      },
      {
        "title": "Genehmigung für Sicherheitsdienstleistungen",
        "body": "Avenir erbringt die Leistung nach dem anwendbaren ungarischen Regulierungsrahmen für Personen- und Vermögensschutz; die Genehmigungsdokumentation kann im Rahmen der Vertragsvorbereitung abgestimmt werden."
      }
    ],
    "faq": [
      {
        "q": "Was umfasst der Objektschutz?",
        "a": "Der Objektschutz kann je nach Bedarf des Standorts die Zutritts- und Austrittskontrolle, den Umgang mit Besuchern und Lieferanten, Kontrollgänge, Regeln der Schlüsselverwaltung, die Erfassung von Vorfällen, das Dienstbuch und ein abgestimmtes Berichtswesen umfassen."
      },
      {
        "q": "Wann ist eine Sicherheitsbegehung vor Ort sinnvoll?",
        "a": "Eine Sicherheitsbegehung vor Ort ist besonders dann sinnvoll, wenn ein neues Objekt zu schützen ist, sich die Zutrittsordnung ändert, der Lieferverkehr zunimmt, wiederkehrende Vorfälle auftreten oder die bestehenden Schutz- und Technikprozesse transparenter gestaltet werden sollen."
      },
      {
        "q": "In welcher Vertragsform sollte der Objektschutz starten?",
        "a": "Das passende Modell hängt von der Größe des Standorts, dem Risikoprofil, den Öffnungszeiten, den Zutrittspunkten, dem Bedarf an Kontrollgängen, der Vorfallbearbeitung und den Berichtsanforderungen ab. Diese sollten vor dem Start festgelegt werden, damit sich der Dienst am tatsächlichen Betrieb des Standorts orientiert."
      },
      {
        "q": "Wie erfolgt die Zutrittskontrolle für Besucher und Lieferanten?",
        "a": "Die Zutrittsordnung gestalten wir auf Grundlage der Begehung vor Ort. Festgelegt werden kann, wer wann mit welcher Berechtigung Zutritt erhält, wie die Besucherregistrierung, die Zufahrt von Lieferanten, die Abwicklung des Lieferverkehrs und die Dokumentation des Austritts erfolgen."
      },
      {
        "q": "Lässt sich der Objektschutz mit Kamera- oder Zutrittskontrollsystemen verbinden?",
        "a": "Ja, wo dies möglich ist, kann der Objektschutz mit vorhandenen Kamerasystemen, Zutrittskontrollanlagen, Alarmprozessen oder einer Fernüberwachung abgestimmt werden. So können personelle Präsenz und technische Sicherheit einander verstärken."
      },
      {
        "q": "Ist auch ein bewaffneter Dienst möglich?",
        "a": "Abhängig vom Risikoprofil des Standorts, dem vertraglichen Bedarf und der Erfüllung der rechtlichen Voraussetzungen kann eine unbewaffnete oder bewaffnete Präsenz des Sicherheitspersonals eingerichtet werden."
      },
      {
        "q": "Verfügt Avenir über die erforderliche Genehmigung für Sicherheitsdienstleistungen?",
        "a": "Ja. Der Objektschutz vor Ort erfolgt nach dem anwendbaren ungarischen Regulierungsrahmen für Personen- und Vermögensschutz. Informationen zur Genehmigung und zur Genehmigungsdokumentation des Sicherheitspersonals können im Rahmen der Vertragsvorbereitung abgestimmt werden."
      },
      {
        "q": "Gibt es eine 24/7-Unterstützung im Hintergrund?",
        "a": "Ja, der Objektschutz kann durch eine 24/7-Leitstelle unterstützt werden; die Eskalations- und Benachrichtigungsordnung legen wir zu Beginn der Zusammenarbeit fest."
      },
      {
        "q": "Was geschieht bei einem Vorfall?",
        "a": "Die Vorfallbearbeitung gestalten wir auf Grundlage einer abgestimmten Eskalationsordnung. Diese legt fest, welche Ereignisse zu erfassen sind, wer zu benachrichtigen ist, in welcher Reihenfolge gemeldet wird und wie der Fall dokumentiert wird."
      },
      {
        "q": "Erhalten wir ein Dienstbuch oder einen Vorfallbericht?",
        "a": "Ja, Bestandteil der Leistung können Dienstbuch, Ereigniserfassung und ein abgestimmtes Berichtswesen sein. Das genaue Berichtsformat legen wir zu Beginn der Zusammenarbeit fest, damit der Auftraggeber stets aktuelle Informationen über den Betrieb vor Ort erhält."
      }
    ],
    "relatedSlugs": [
      "portaszolgalat",
      "biztonsagtechnika",
      "tavfelugyelet-vonuloszolgalat",
      "mystery-shopping-helyszini-audit",
      "rendezvenybiztositas"
    ],
    "legalReviewRequired": true,
    "legalReviewRequiredKeys": [
      "objektumorzes:PILOT_HU.longDesc.body.2",
      "objektumorzes:PILOT_HU.processSteps.4.body",
      "objektumorzes:PILOT_HU.trustItems.5.body",
      "objektumorzes:PILOT_HU.faq.5.a",
      "objektumorzes:PILOT_HU.faq.6.a"
    ]
  },
  "portaszolgalat": {
    "id": 2,
    "slug": "portaszolgalat",
    "icon": "desk",
    "imageUrl": null,
    "name": "Empfangs- und Pförtnerdienst",
    "shortDesc": "Pförtnerdienst mit Zutrittskontrolle, Besuchermanagement, Schlüsselverwaltung und protokolliertem Tagesablauf für Bürogebäude und Unternehmensstandorte.",
    "longDesc": "Der Pförtnerdienst ist keine bloße Präsenz am Eingang, sondern einer der wichtigsten Kontrollpunkte des täglichen Betriebs. Die Leistung kann je nach Bedarf des Standorts den Empfang von Besuchern, die Besucherregistrierung, die Zutrittskontrolle von Lieferanten und Nachunternehmern, die Schlüsselverwaltung, die Annahme von Paketen, die Auskunftserteilung und die Meldung außergewöhnlicher Ereignisse unterstützen.\n\nAuf Grundlage einer Begehung vor Ort legt Avenir das Pförtner- und Empfangsprotokoll fest: wer mit welcher Berechtigung und mit welcher Dokumentation Zutritt erhält, wann eine Benachrichtigung erforderlich ist und welche Ereignisse zu protokollieren oder zu eskalieren sind. Bei der Verarbeitung von Besucher- und Zutrittsdaten sind auch die Zweckbindung, die zeitlich begrenzte Aufbewahrung und die angemessene Information Bestandteil des Empfangs- und Pförtnerprozesses.\n\nDer Pförtnerdienst kann an den Objektschutz vor Ort, an Zutrittskontroll- oder Kamerasysteme oder an interne Betriebsprozesse angebunden werden. Der Auftraggeber erhält einen klaren Dienstrahmen: mit Dienstbuch, abgestimmtem Berichtswesen und einem benannten verantwortlichen Ansprechpartner.",
    "seoTitle": "Empfangs- und Pförtnerdienst für Unternehmen | Avenir",
    "seoDescription": "Pförtnerdienst mit Zutrittskontrolle, Besuchermanagement, Schlüsselverwaltung und protokolliertem Tagesablauf für Bürogebäude und Unternehmensstandorte.",
    "valueProposition": "Der Empfangs- und Pförtnerdienst ist der erste Betriebspunkt, an dem Besucher, Lieferanten, Mitarbeiter und Mieter auf die Regeln des Standorts treffen. Ziel von Avenir ist, dass dieser Punkt geordnet, zuvorkommend, nachvollziehbar und sicherheitsseitig konsequent funktioniert.",
    "highlights": [],
    "useCases": [
      "Empfangsbetrieb von Bürogebäuden und Businesscentern",
      "Pforten- und Zutrittspunkte von Logistik- und Industriestandorten",
      "Standorte mit Mieter-, Mitarbeiter- und Besucherverkehr",
      "Objekte mit Lieferanten-, Kurier- und Lieferverkehr",
      "Unternehmensstandorte, an denen ein geordneter erster Eindruck und eine geregelte Zutrittskontrolle wichtig sind"
    ],
    "includedItems": [
      "Empfang von Besuchern und Gästen",
      "Besucherregistrierung und Unterstützung der Zutrittsordnung",
      "Betreuung von Lieferanten, Kurieren und Nachunternehmern",
      "Einhaltung der Regeln für Schlüsselverwaltung und -ausgabe",
      "Paketannahme und Informationsweitergabe nach abgestimmter Ordnung",
      "Dienstbuch, Ereigniserfassung und Berichtswesen",
      "Anbindung an Zutrittskontrollsysteme oder interne Betriebsprozesse, sofern der Standort dies erfordert"
    ],
    "processSteps": [
      {
        "title": "Erstabstimmung und Aufnahme des Betriebsbedarfs",
        "body": "Wir sehen die Anfrage durch und melden uns spätestens am nächsten Werktag über die angegebenen Kontaktdaten. Wie lange die Angebotserstellung dauert, hängt vom Standort und der Komplexität der Anfrage ab."
      },
      {
        "title": "Begehung vor Ort und Überblick über die Verkehrspunkte",
        "body": "Wir prüfen die Eingänge, Empfangs- und Pfortenpunkte, Zutrittssituationen, den Bedarf an Schlüsselverwaltung sowie den regelmäßigen Lieferanten- und Besucherverkehr."
      },
      {
        "title": "Gestaltung des Pförtner- und Empfangsprotokolls",
        "body": "Wir legen den Tagesablauf für Gästeempfang, Zutrittskontrolle, Schlüsselausgabe, Paketannahme, Benachrichtigung und Ereigniserfassung fest."
      },
      {
        "title": "Festschreibung der Dienstanweisung und der Berichtsordnung",
        "body": "Wir halten schriftlich fest, welche Ereignisse zu dokumentieren sind, in welchem Format berichtet wird, wo die Eskalationspunkte liegen und wer als Ansprechpartner benannt ist."
      },
      {
        "title": "Organisation des Personals und Einarbeitung",
        "body": "Den Dienst organisieren wir auf Grundlage der vertraglichen Anforderungen, des Standortprotokolls und des täglichen Verkehrsaufkommens, mit Einarbeitung und Abstimmung zum Start."
      },
      {
        "title": "Regelmäßige Abstimmung und Feinjustierung",
        "body": "Die Betriebserfahrungen, wiederkehrenden Fragen und Berichte stimmen wir mit dem benannten verantwortlichen Ansprechpartner ab."
      }
    ],
    "trustItems": [
      {
        "title": "Tägliche Dienstordnung und Protokollierung",
        "body": "Dienstbuch, Besuchermanagement, Ereigniserfassung und abgestimmtes Berichtswesen unterstützen die Kontrolle des Pförtnerdienstes."
      },
      {
        "title": "Benannter verantwortlicher Ansprechpartner",
        "body": "Der Auftraggeber stimmt sich mit einem verantwortlichen Ansprechpartner über den laufenden Betrieb, die Berichte und notwendige Protokollanpassungen ab."
      },
      {
        "title": "24/7-Leitstelle im Hintergrund",
        "body": "Der Pförtnerbetrieb kann durch eine 24/7-Leitstelle unterstützt werden; die Benachrichtigungs- und Eskalationsordnung legen wir zu Beginn der Zusammenarbeit fest."
      },
      {
        "title": "ISO 9001 und ISO 27001",
        "body": "Die Dienstprozesse werden durch die nach ISO 9001 und ISO 27001 zertifizierten Managementsysteme von Avenir unterstützt, sofern die betreffenden Prozesse in den zertifizierten Geltungsbereich fallen."
      },
      {
        "title": "Berücksichtigung der Besucherdaten-Aspekte",
        "body": "Bei der Verarbeitung von Besucher- und Zutrittsdaten sind die Zweckbindung, die Information der Betroffenen und die zeitlich begrenzte Aufbewahrung zu berücksichtigen."
      },
      {
        "title": "Gästeempfang und Zutrittskontrolle in einem Ablauf",
        "body": "Die Empfangs- und Pförtnerprotokolle verbinden den zuvorkommenden Umgang mit Besuchern mit kontrollierter Zutrittskontrolle, Eskalation und Berichtswesen, sodass der Empfangsbetrieb und die Sicherheitsroutinen denselben Standortregeln folgen."
      }
    ],
    "faq": [
      {
        "q": "Was umfasst der Empfangs- und Pförtnerdienst?",
        "a": "Die Leistung kann je nach Bedarf des Standorts den Gästeempfang, die Besucherregistrierung, die Unterstützung der Zutrittskontrolle, die Betreuung von Lieferanten und Kurieren, die Schlüsselverwaltung, die Paketannahme, das Dienstbuch und ein abgestimmtes Berichtswesen umfassen."
      },
      {
        "q": "Wann ist eine Aufnahme des Pförtnerdienstes vor Ort sinnvoll?",
        "a": "Die Aufnahme ist besonders dann sinnvoll, wenn das Besucher- oder Lieferantenaufkommen zunimmt, sich die Zutrittsordnung ändert, mehrere Parteien dasselbe Objekt nutzen oder eine geordnetere Protokollierung und Verantwortungsstruktur benötigt wird."
      },
      {
        "q": "Worin unterscheidet sich der Pförtnerdienst vom Objektschutz?",
        "a": "Der Pförtnerdienst konzentriert sich vor allem auf die Eingangs-, Empfangs- und täglichen Verkehrspunkte, während der Objektschutz eine breitere Sicherheitspräsenz mit Kontrollgängen und Vorfallbearbeitung bedeuten kann. Beide Leistungen lassen sich bei Bedarf aufeinander abstimmen."
      },
      {
        "q": "Kann der Lieferanten- und Kurierverkehr abgewickelt werden?",
        "a": "Ja, die Ordnung für die Zutrittskontrolle von Lieferanten, Kurieren und Nachunternehmern gestalten wir auf Grundlage der Begehung vor Ort. Festgelegt werden kann, welche Daten zu erfassen sind, wer zu benachrichtigen ist und wie Ein- und Austritt protokolliert werden."
      },
      {
        "q": "Gibt es eine Schlüsselverwaltung?",
        "a": "Ja, Bestandteil der Leistung können die Einhaltung der Schlüsselordnung sowie die Erfassung von Schlüsselausgabe und -rücknahme sein. Die genauen Regeln legen wir zu Beginn der Zusammenarbeit standortspezifisch fest."
      },
      {
        "q": "Ist eine Anbindung an Zutrittskontrollsysteme möglich?",
        "a": "Ja, wo dies möglich ist, kann der Pförtnerdienst an vorhandene Zutrittskontroll- oder Kamerasysteme oder an interne Betriebsprozesse angebunden werden."
      },
      {
        "q": "Wie können Besucherdaten im Pforten- und Empfangsprozess verarbeitet werden?",
        "a": "Bei der Verarbeitung von Besucherdaten sind die Zweckbindung, die zeitlich begrenzte Aufbewahrung, die Information der Besucher, der Zutrittskontext und die standorteigenen Regeln maßgeblich. Die genauen Datenkategorien und die Aufbewahrungsordnung sind im Einklang mit den Anforderungen des Auftraggebers und den Datenschutzregeln des Standorts festzulegen."
      },
      {
        "q": "Erhalten wir Berichte über den laufenden Betrieb?",
        "a": "Ja, der Pförtnerbetrieb kann mit Dienstbuch, Ereigniserfassung und abgestimmtem Berichtswesen verbunden werden. Das genaue Berichtsformat legen wir auf Grundlage der Anforderungen des Auftraggebers und des Standortbetriebs fest."
      }
    ],
    "relatedSlugs": [
      "objektumorzes",
      "biztonsagtechnika",
      "mystery-shopping-helyszini-audit",
      "soft-fm"
    ],
    "legalReviewRequired": true,
    "legalReviewRequiredKeys": [
      "portaszolgalat:PILOT_HU.longDesc.body.1",
      "portaszolgalat:PILOT_HU.trustItems.4.body",
      "portaszolgalat:PILOT_HU.faq.6.a"
    ]
  },
  "mystery-shopping-helyszini-audit": {
    "id": 3,
    "slug": "mystery-shopping-helyszini-audit",
    "icon": "eye",
    "imageUrl": null,
    "name": "Mystery Shopping und Serviceaudit",
    "shortDesc": "Mystery Shopping, Brand Audit, Testfahrt und Serviceaudit zur Prüfung von Kundenerlebnis, Prozesstreue und Compliance-Aspekten.",
    "longDesc": "Mystery Shopping ist keine einfache Kontrolle, sondern eine geplante und dokumentierte Messung der Servicequalität. Avenir legt in Abstimmung mit dem Auftraggeber den Prüfumfang des Audits fest, entwickelt das Szenario und die Bewertungskriterien, schult den Tester und führt die Prüfung anschließend in einer realen Kundensituation durch: als Testkauf, Geschäftsvorgang, Standortbesuch, Testfahrt oder an einem anderen Kundenkontaktpunkt.\n\nDer Prüfumfang legt fest, welche Servicepunkte, Prozessschritte, Markenstandards, Kommunikationsanforderungen, Informationspflichten oder Compliance-Aspekte zu prüfen sind. Ziel ist nicht die Fehlersuche um ihrer selbst willen, sondern dass die Geschäftsleitung ein genaues, strukturiertes Bild vom tatsächlichen Kundenerlebnis erhält.\n\nDie Leistung ist in mehreren Formen einsetzbar. Das Brand Audit prüft Erscheinungsbild, visuelle Standards, Sauberkeit, Atmosphäre und Servicestandards. Das Situation Shopping testet konkrete Kundensituationen, Fragen, Konflikte oder Prozessschritte. Das Serviceaudit oder die Testfahrt kann eine vollständige Customer Journey untersuchen, etwa in Personenbeförderungs-, Kundenservice- oder Vor-Ort-Bedienprozessen.\n\nAvenir erstellt einen strukturierten Bericht über Beobachtungen, wiederkehrende Muster, Risikopunkte und Verbesserungsempfehlungen. Die Ergebnisse besprechen wir gemeinsam mit dem Auftraggeber, damit sie Entscheidungen zu Servicequalität, Prozessverbesserung und abgestimmten Kontrollpunkten unterstützen.",
    "seoTitle": "Mystery Shopping und Serviceaudit | Avenir",
    "seoDescription": "Mystery Shopping, Brand Audit, Testfahrt und Serviceaudit zur Prüfung von Kundenerlebnis, Prozesstreue und Compliance-Aspekten.",
    "valueProposition": "Mystery Shopping und Serviceaudit zeigen in realen Kundensituationen, was der Kunde erlebt, ob der vorgesehene Prozess eingehalten wird, ob Marken-, Informations- und Servicestandards erfüllt werden und wo Qualitäts-, Reputations- oder Compliance-Risiken sichtbar werden.",
    "highlights": [],
    "useCases": [
      "Testkäufe in Geschäften, an Servicepunkten oder in Kundenservicesituationen",
      "Testfahrten bei Taxi-, Personenbeförderungs- oder Verkehrsdienstleistungen",
      "Brand Audit: Prüfung von Erscheinungsbild, Sauberkeit, visueller Präsenz und Servicestandards",
      "Situation Shopping: Test konkreter Kundensituationen, Fragen oder Konfliktsituationen",
      "Untersuchung der Customer Journey und des Besuchererlebnisses",
      "Prüfung von Informations-, Preiskommunikations-, Rechnungs-, Belegausgabe- oder anderen Compliance-Aspekten nach vereinbartem Prüfumfang",
      "Vergleichbares Audit mehrerer Standorte, Dienstleister oder Einheiten"
    ],
    "includedItems": [
      "Abstimmung von Auditziel, Prüfumfang und Bewertungskriterien",
      "Entwicklung des Testkauf-, Testfahrt- oder Customer-Journey-Szenarios",
      "Auswahl der Methodik: Brand Audit oder Situation Shopping",
      "Messung der Servicequalität in realer Kundensituation",
      "Bewertung von Customer Journey, Kommunikation, Prozesstreue und Bedienung",
      "Prüfung vereinbarter Compliance-Aspekte",
      "Dokumentation von Abweichungen, Risiken und Verbesserungspunkten",
      "Strukturierter Bericht und Management-Zusammenfassung"
    ],
    "processSteps": [
      {
        "title": "Abstimmung von Auditziel und Prüfumfang",
        "body": "Wir legen fest, welche geschäftliche, servicequalitäts- oder compliance-bezogene Frage das Audit beantworten soll und welche Prozesse genau Gegenstand der Prüfung sind."
      },
      {
        "title": "Entwicklung der Bewertungskriterien und des Szenarios",
        "body": "Wir definieren die Messpunkte, die Markenstandards, die Kommunikations- und Informationsanforderungen sowie das Testkauf-, Testfahrt- oder Customer-Journey-Szenario."
      },
      {
        "title": "Durchführung von Brand Audit, Situation Shopping, Testkauf oder Testfahrt",
        "body": "Das Audit erfolgt nach dem freigegebenen Prüfumfang in realer Kundensituation, mit Fokus auf die Messung des Serviceprozesses, des Kundenerlebnisses und der vorab festgelegten Compliance-Punkte."
      },
      {
        "title": "Dokumentation von Erfahrungen, Abweichungen und Compliance-Punkten",
        "body": "Die Erfahrungen halten wir strukturiert fest: was während der Customer Journey geschehen ist, was dem erwarteten Ablauf entsprach, wo es Abweichungen gab und welche Risiken oder Verbesserungspunkte sichtbar wurden."
      },
      {
        "title": "Erstellung von Bericht, Management-Zusammenfassung und Verbesserungsempfehlungen",
        "body": "Die Ergebnisse fassen wir in einem auch auf Führungsebene gut lesbaren Bericht zusammen, der Compliance-Feststellungen, wiederkehrende Muster und konkrete Verbesserungsempfehlungen enthalten kann."
      },
      {
        "title": "Besprechung der Ergebnisse und Festlegung der nächsten Schritte",
        "body": "Die Auditergebnisse besprechen wir gemeinsam, damit der Auftraggeber über Protokollanpassungen, Schulungen, die Präzisierung von Markenstandards oder weitere Messungen entscheiden kann."
      }
    ],
    "trustItems": [
      {
        "title": "Vor der Durchführung festgelegter Prüfumfang",
        "body": "Ziel, Szenario, Kriterien und Berichtsform des Audits sind vor der Durchführung abzustimmen, damit die Beobachtungen innerhalb des festgelegten servicequalitätsbezogenen Prüfumfangs bleiben."
      },
      {
        "title": "Neutrale Beobachtung der Customer Journey",
        "body": "Die Prüfung erfasst, wie sich die vereinbarten Serviceschritte, Markenanforderungen und Customer-Journey-Punkte in realen Kundensituationen darstellen — ohne aufsichtsrechtliche oder disziplinarische Rahmung."
      },
      {
        "title": "Strukturierter Bericht und Abstimmung mit dem Auftraggeber",
        "body": "Avenir erstellt einen strukturierten Bericht mit Beobachtungen, wiederkehrenden Mustern, Risikopunkten und Verbesserungsempfehlungen und bespricht die Feststellungen mit dem Auftraggeber zur Unterstützung von Servicequalitätsentscheidungen."
      },
      {
        "title": "Vergleichbares Bild mehrerer Standorte",
        "body": "Dasselbe Szenario kann an mehreren Standorten oder bei mehreren Dienstleistern wiederholt werden, um Servicekonsistenz, Prozessabweichungen und wiederkehrende Verbesserungspunkte zu vergleichen."
      },
      {
        "title": "Zweckgebundene und vertrauliche Berichterstattung",
        "body": "Die Berichterstattung beschränkt sich auf den vereinbarten Prüfumfang und den festgelegten Überprüfungsprozess des Auftraggebers. Angaben zu einzelnen Mitarbeitern sind kein standardmäßiger Berichtsbestandteil; solche Inhalte können nur innerhalb vorab vereinbarter Datenschutzrahmen erscheinen."
      }
    ],
    "faq": [
      {
        "q": "Was umfasst Mystery Shopping und Serviceaudit?",
        "a": "Die Leistung besteht aus der Festlegung von Auditziel, Prüfumfang und Bewertungskriterien, der Entwicklung des Testkauf- oder Customer-Journey-Szenarios, der Beobachtung in realer Kundensituation und der Erstellung eines strukturierten Berichts."
      },
      {
        "q": "Wie wird der Prüfumfang festgelegt, und wie bleibt die Prüfung im vereinbarten Rahmen?",
        "a": "Der Prüfumfang wird vor der Durchführung festgelegt. Avenir definiert vorab das Ziel, das Szenario, die Prüfkriterien, die Berichtsform und die zulässigen Beobachtungspunkte. Die Feststellungen beziehen sich auf die vereinbarten Servicekriterien und Verbesserungsziele und erscheinen nicht als rechtliche Schlussfolgerung oder disziplinarischer Beweis."
      },
      {
        "q": "Was kann im Rahmen des Serviceaudits geprüft werden?",
        "a": "Das Audit kann Brand-Audit-Aspekte, Situation-Shopping-Szenarien, Customer-Journey-Schritte, Servicequalitätskriterien, vereinbarte Compliance-Punkte und die Konsistenz zwischen mehreren Standorten prüfen. Beispiele sind Kommunikation, Information, Bedienung sowie Rechnungs- oder Belegausgabeprozesse, sofern sie Teil des vereinbarten Prüfumfangs sind."
      },
      {
        "q": "Wird ein Bericht über die Ergebnisse erstellt?",
        "a": "Ja. Avenir erstellt einen strukturierten Bericht über den beobachteten Prozess, die Abweichungen, wiederkehrenden Muster, Risikopunkte und Verbesserungsempfehlungen nach dem vereinbarten Prüfumfang."
      },
      {
        "q": "Werden Mitarbeiter im Bericht namentlich genannt?",
        "a": "Der Bericht ist standardmäßig prozess- und servicequalitätsorientiert. Eine namentliche oder personenbezogene Darstellung kann nur innerhalb vorab vereinbarter Rahmen und im Einklang mit den anwendbaren Datenschutzanforderungen erfolgen."
      },
      {
        "q": "Kann dasselbe Szenario an mehreren Standorten wiederholt werden?",
        "a": "Ja, auf Grundlage eines einheitlichen Szenarios und einheitlicher Bewertungskriterien können mehrere Standorte, Dienstleister, Einheiten oder Zeiträume verglichen werden. Das hilft, Abweichungen, wiederkehrende Muster und Verbesserungsprioritäten zu erkennen."
      },
      {
        "q": "Ist die Methode auf Verkehrs- oder Service-Customer-Journeys anwendbar?",
        "a": "Ja. Im Rahmen einer Testfahrt oder einer Service-Customer-Journey können beispielsweise Information, Bedienung, Rechnungs- oder Belegausgabeprozesse, Verhaltensprotokolle und die Erfüllung vorab festgelegter Service- oder Compliance-Kriterien geprüft werden."
      },
      {
        "q": "Worin unterscheidet sich Mystery Shopping von einer Privatermittlung?",
        "a": "Mystery Shopping und Serviceaudit messen Servicequalität, Prozesstreue, Customer Journey und vereinbarte Compliance-Punkte auf Grundlage eines festgelegten Prüfumfangs. Es handelt sich nicht um Privatermittlung, nicht um unbegrenzte Beobachtung, nicht um Beweiserhebung und nicht um einen disziplinarischen Automatismus."
      }
    ],
    "relatedSlugs": [
      "portaszolgalat",
      "soft-fm",
      "rendezvenybiztositas",
      "objektumorzes"
    ],
    "legalReviewRequired": true,
    "legalReviewRequiredKeys": [
      "mystery-shopping-helyszini-audit:PILOT_HU.trustItems.4.body",
      "mystery-shopping-helyszini-audit:PILOT_HU.faq.1.a",
      "mystery-shopping-helyszini-audit:PILOT_HU.faq.4.a",
      "mystery-shopping-helyszini-audit:PILOT_HU.faq.7.a"
    ]
  },
  "rendezvenybiztositas": {
    "id": 4,
    "slug": "rendezvenybiztositas",
    "icon": "shield",
    "imageUrl": null,
    "name": "Veranstaltungssicherheit",
    "shortDesc": "Veranstaltungssicherheit mit Zutrittskontrolle, Unterstützung der Gäste- und Besucherströme, Zonenmanagement, Vorfallmeldung und Kontakt zur Veranstaltungsleitung.",
    "longDesc": "Veranstaltungssicherheit beschränkt sich nicht auf Firmen- oder geschlossene Veranstaltungen. Je nach Charakter der Veranstaltung unterstützt Avenir die Zutrittskontrolle, die Lenkung der Gäste- oder Besucherströme, das Management geschlossener Bereiche und Zonen, die Überwachungsordnung der Randbereiche, die Konfliktprävention, die Vorfallerfassung und den von der Veranstaltungsleitung festgelegten Eskalationsprozess.\n\nBei Firmen- und geschlossenen Veranstaltungen können dazu Konferenzen, Geschäftstreffen, Ausstellungen, Produktpräsentationen sowie VIP-, Backstage- oder andere geschlossene Bereiche gehören. Bei öffentlichen Veranstaltungen, Festivals, Konzerten, Sportveranstaltungen und Kulturprogrammen liegt der Schwerpunkt auf dem abgestimmten Zusammenspiel von Besucherströmen, mehreren Zutrittspunkten, Zonen und der Kontaktkette zur Veranstaltungsleitung.\n\nZiel ist nicht, eine allgemeine Garantie für jede Situation zu geben, sondern dass während der Veranstaltung ein transparenter Sicherheitsrahmen funktioniert: mit Unterstützung der Zutrittskontrolle, Lenkung der Gäste- oder Besucherströme, konfliktpräventiver Präsenz, Vorfallerfassung, Eskalationsordnung und einer Rückmeldung zum Veranstaltungsabschluss.",
    "seoTitle": "Veranstaltungssicherheit | Avenir",
    "seoDescription": "Veranstaltungssicherheit mit Zutrittskontrolle, Unterstützung der Gäste- und Besucherströme, Zonenmanagement, Vorfallmeldung und Kontakt zur Veranstaltungsleitung.",
    "valueProposition": "Ziel der Veranstaltungssicherheit ist, dass Zutrittskontrolle, Gäste- und Besucherströme, Zonenmanagement, Konfliktprävention und Vorfallbearbeitung bei Firmen-, geschlossenen und öffentlichen Veranstaltungen in einem abgestimmten Rahmen funktionieren.",
    "highlights": [],
    "useCases": [
      "Firmenveranstaltungen, Konferenzen und Geschäftsevents",
      "Geschlossene Veranstaltungen, Produktpräsentationen und Ausstellungen",
      "Festivals und Open-Air-Kulturveranstaltungen",
      "Konzerte und öffentliche Indoor-Veranstaltungen",
      "Sportveranstaltungen und Turniere",
      "Veranstaltungen mit VIP-, Backstage-, geschlossenen oder besonders geschützten Bereichen",
      "Events mit mehreren Zutrittspunkten, Besucherströmen oder Koordinationsbedarf mit der Veranstaltungsleitung",
      "Veranstaltungen, die Vorfallerfassung und einen Eskalationsrahmen erfordern"
    ],
    "includedItems": [
      "Zutrittskontrolle und Management der Zutrittspunkte",
      "Unterstützung der Gäste- und Besucherströme",
      "Management von Zonen, Randbereichen und geschlossenen Bereichen",
      "Betreuung von VIP-, Backstage- oder besonders geschützten Bereichen, sofern der Veranstaltungscharakter dies erfordert",
      "Konfliktprävention und Vorfalleskalation",
      "Vorfallerfassung und Bericht zur Veranstaltungssicherheit",
      "Management mehrerer Zutrittspunkte bei öffentlichen oder größeren Veranstaltungen",
      "Kontakt zu den von der Veranstaltungsleitung benannten Verantwortlichen und Eskalationspunkten"
    ],
    "processSteps": [
      {
        "title": "Abstimmung von Veranstaltungsumfang und Standortbedarf",
        "body": "Wir erfassen Art und Dauer der Veranstaltung, die erwarteten Gäste- oder Besucherströme, die örtlichen Gegebenheiten, die Zonen und die Erwartungen der Veranstaltungsleitung."
      },
      {
        "title": "Erfassung von Zutrittspunkten, Zonen und Kontaktwegen zur Veranstaltungsleitung",
        "body": "Wir prüfen die Zutrittspunkte, geschlossene oder besonders geschützte Bereiche, die Richtungen der Gäste- oder Besucherströme, die Randbereiche und die Kontaktordnung der Veranstaltungsleitung."
      },
      {
        "title": "Gestaltung der Personal- und Eskalationsordnung",
        "body": "Die erforderliche Sicherheitspräsenz, die Berechtigungspunkte, die Kontaktkette und die Vorfallmeldeordnung legen wir auf Grundlage des Veranstaltungsumfangs und der vertraglichen Rahmenbedingungen fest."
      },
      {
        "title": "Unterstützung von Zutrittskontrolle, Zonenmanagement und Vorfallmeldung während der Veranstaltung",
        "body": "Während der Veranstaltung unterstützt das Sicherheitspersonal die abgestimmte Ordnung von Zutrittskontrolle, Zonenmanagement, Gäste- oder Besucherströmen und Vorfallmeldung."
      },
      {
        "title": "Dokumentation von Ereignissen, Abweichungen und Eingriffen",
        "body": "Die relevanten Ereignisse, Abweichungen und Eingriffe erfassen wir nach dem mit dem Auftraggeber abgestimmten Dokumentationsumfang."
      },
      {
        "title": "Abschlussrückmeldung und Abstimmung von Verbesserungsvorschlägen",
        "body": "Nach der Veranstaltung lässt sich zusammenfassen, was gut funktioniert hat, wo es Abweichungen gab und welche Anpassungen den Ablauf der nächsten Veranstaltung unterstützen können."
      }
    ],
    "trustItems": [
      {
        "title": "Auf die Veranstaltung zugeschnittenes Sicherheitskonzept",
        "body": "Sicherheitspräsenz, Zutrittspunkte, Zonen, Gäste- oder Besucherströme und Eskalationswege richten sich nach dem Veranstaltungstyp und dem vereinbarten Umfang."
      },
      {
        "title": "Management von Besucherströmen und Zutrittspunkten",
        "body": "Zutrittskontrolle, Gäste- oder Besucherbewegungen und das Management mehrerer Zutrittspunkte richten sich nach dem Veranstaltungslayout, dem erwarteten Aufkommen und den Regeln der Veranstaltungsleitung."
      },
      {
        "title": "Management von Zonen, Randbereichen und geschlossenen Bereichen",
        "body": "VIP-, Backstage-, geschlossene, besonders geschützte oder Randbereiche werden nach dem vereinbarten Sicherheitskonzept und den Zutrittsregeln betreut."
      },
      {
        "title": "Vorfallerfassung und Eskalation an die Veranstaltungsleitung",
        "body": "Vorfälle, Abweichungen und Eskalationsbedarfe werden nach der von der Veranstaltungsleitung festgelegten Kontakt- und Eskalationskette erfasst und bearbeitet."
      },
      {
        "title": "Ein benannter verantwortlicher Kontaktpunkt",
        "body": "Die Veranstaltungsleitung erhält einen benannten Sicherheitskontaktpunkt für Koordination, Berichterstattung und die Kommunikation am Veranstaltungstag."
      },
      {
        "title": "Nachbetrachtung und Verbesserungspunkte",
        "body": "Nach der Veranstaltung kann Avenir die Auswertung von Vorfällen, wiederkehrenden Problemen und Verbesserungspunkten für die künftige Veranstaltungsplanung unterstützen."
      }
    ],
    "faq": [
      {
        "q": "Worin unterscheidet sich Veranstaltungssicherheit vom Objektschutz?",
        "a": "Der Objektschutz beruht in der Regel auf einem dauerhaften oder längerfristigen Betrieb vor Ort, während die Veranstaltungssicherheit eine zeitlich begrenzte, auf das Event zugeschnittene Leistung ist. Im Vordergrund stehen Besucherströme, Zutrittskontrolle, Zonenmanagement, der Kontakt zur Veranstaltungsleitung und die Vorfallmeldung."
      },
      {
        "q": "Ist Veranstaltungssicherheit auch für Festivals, Konzerte und Sportveranstaltungen verfügbar?",
        "a": "Ja. Veranstaltungssicherheit kann für Firmen-, geschlossene und öffentliche Veranstaltungen gestaltet werden, einschließlich Festivals, Konzerten, Sportveranstaltungen und Kulturprogrammen. Der Leistungsrahmen richtet sich nach Veranstaltungstyp, Gäste- oder Besucherströmen, Zutrittspunkten, Zonen, der Kontaktkette der Veranstaltungsleitung und den Anforderungen an die Vorfallerfassung."
      },
      {
        "q": "Können VIP- oder Backstage-Bereiche betreut werden?",
        "a": "Ja, wenn der Veranstaltungsumfang dies vorsieht, kann sich der Sicherheitsbetrieb auch auf VIP-, Backstage-, geschlossene oder besonders geschützte Bereiche erstrecken. Die Berechtigungspunkte und Zutrittsregeln sind vorab festzulegen."
      },
      {
        "q": "Gibt es eine Garantie für eine konfliktfreie Veranstaltung?",
        "a": "Eine garantierte Konfliktfreiheit kann nicht zugesagt werden. Ziel der Leistung ist es, Risiken zu verringern sowie Präsenz vor Ort, eine abgestimmte Eskalationsordnung und eine schnelle Abstimmung mit der Veranstaltungsleitung sicherzustellen."
      },
      {
        "q": "Welche Rolle spielt der Kontakt zur Veranstaltungsleitung?",
        "a": "Für einen wirksamen Ablauf der Veranstaltungssicherheit ist wichtig, dass es sowohl auf Seiten der Veranstaltungsleitung als auch auf der Sicherheitsseite einen benannten Ansprechpartner gibt. So lassen sich Vorfälle, Zutrittsfragen, Zonenprobleme oder Besucherstromsituationen schneller abstimmen."
      },
      {
        "q": "Wird ein Abschlussbericht zur Veranstaltung erstellt?",
        "a": "Bestandteil der Leistung kann eine Abschlussrückmeldung oder ein Bericht sein, der die wichtigsten Ereignisse, Abweichungen, Vorfälle und Verbesserungsvorschläge zusammenfasst. Den Detaillierungsgrad des Berichts sollte man zu Beginn der Zusammenarbeit festlegen."
      },
      {
        "q": "Wann ist eine vorbereitende Begehung zur Veranstaltungssicherheit sinnvoll?",
        "a": "Eine vorbereitende Begehung ist besonders dann sinnvoll, wenn mehrere Zutrittspunkte, VIP-, Backstage- oder geschlossene Zonen, größere Besucherströme, externer Lieferverkehr, eine ungewöhnliche Standortanordnung, risikoreichere Programmelemente oder ein hoher Koordinationsbedarf mit der Veranstaltungsleitung zu erwarten sind."
      },
      {
        "q": "Kann die Veranstaltungssicherheit an Zutritts- oder Sicherheitstechniksysteme angebunden werden?",
        "a": "Ja, wo der Standort dies zulässt, kann die Veranstaltungssicherheit an Zutrittskontrollsysteme, Kamerasysteme, Zonenmanagement- oder andere sicherheitstechnische Prozesse angebunden werden. Den genauen Ablauf bestimmen die Gegebenheiten des Standorts und der Veranstaltungsumfang."
      }
    ],
    "relatedSlugs": [
      "objektumorzes",
      "portaszolgalat",
      "mystery-shopping-helyszini-audit",
      "biztonsagtechnika"
    ],
    "legalReviewRequired": false,
    "legalReviewRequiredKeys": []
  },
  "biztonsagtechnika": {
    "id": 5,
    "slug": "biztonsagtechnika",
    "icon": "camera",
    "imageUrl": null,
    "name": "Sicherheitstechnik",
    "shortDesc": "Kamerasystem, Zutrittskontrolle, Einbruchmeldung und Alarmprozesse — abgestimmt mit Objektschutz und Pförtnerdienst.",
    "longDesc": "Ziel der Sicherheitstechnik ist, dass sich die Sicherheit vor Ort nicht allein auf personelle Präsenz stützt, sondern auch gut handhabbare technische Unterstützung erhält. Dazu können das Kamerasystem, die Zutrittskontrollanlage, die Einbruchmeldung, der Alarmprozess, die Weiterleitung von Meldungen und die Dokumentation der Ereignisse gehören.\n\nAvenir behandelt den sicherheitstechnischen Betrieb nicht als isolierte Gerätebeschaffung. Auf Grundlage der Begehung vor Ort prüfen wir, wo sich Zutrittspunkte, schwach kontrollierte Zonen, wiederkehrende Ereignisse, kritische Bereiche und Prozesse befinden, in denen die Technik den Objektschutz, den Pförtnerdienst oder die Fernüberwachung unterstützen kann.\n\nAvenir bezieht bei der sicherheitstechnischen Bestandsaufnahme und Planung auch die Datenschutzaspekte ein: Der dokumentierte Zweck, der verhältnismäßige Erfassungsbereich, die Zugriffsberechtigungen, die Information der Betroffenen und die Speicherlogik werden auf den Betrieb des Standorts und den Datenschutzrahmen des Kunden abgestimmt — im Einklang mit den Grundsätzen der DSGVO und dem in Ungarn anwendbaren Rechtsrahmen. Dies unterstützt die datenschutzrechtliche Prüfung des Kunden; die Rechtsgrundlage und die abschließenden Datenschutzentscheidungen verbleiben beim Kunden und seinen Beratern.\n\nZiel ist eine transparente, wartbare und im Tagesbetrieb nutzbare sicherheitstechnische Ebene: eine Lösung, die nicht nur aufzeichnet, sondern Erkennung, Eskalation, Zutrittskontrolle, Berichtswesen und Entscheidungsfindung unterstützt.",
    "seoTitle": "Sicherheitstechnik für Unternehmensstandorte | Avenir",
    "seoDescription": "Kamerasystem, Zutrittskontrolle, Einbruchmeldung und Alarmprozesse — abgestimmt mit Objektschutz und Pförtnerdienst.",
    "valueProposition": "Die Sicherheitstechnik verbindet Kamerasystem, Zutrittskontrolle und Alarmprozesse zu einem standortgerechten Sicherheitssystem — mit dokumentiertem Zweck, verhältnismäßiger Abdeckung, Eskalation und betrieblicher Integration.",
    "highlights": [],
    "useCases": [
      "Zutrittspunkte von Bürogebäuden und Businesscentern",
      "Kamera- und Alarmzonen von Industrie- und Logistikstandorten",
      "Lager, Lkw-Tore und kritische Zutrittspunkte",
      "Standorte, an denen der personelle Objektschutz technisch ergänzt werden soll",
      "Überprüfung vorhandener Kamerasysteme, Zutrittskontroll- oder Alarmprozesse"
    ],
    "includedItems": [
      "Bestandsaufnahme des Kamerasystems und der Überwachungspunkte",
      "Überprüfung der Zutrittspunkte und Berechtigungsprozesse",
      "Prüfung von Einbruchmeldung und Alarmprozessen",
      "Verknüpfung mit Objektschutz und Pförtnerdienst",
      "Gestaltung der Meldungsbearbeitungs- und Eskalationsordnung",
      "Sicherheitsbegehung vor Ort und Technologievorschlag",
      "Ereigniserfassung und Unterstützung des Berichtswesens"
    ],
    "processSteps": [
      {
        "title": "Sicherheitstechnische Begehung vor Ort",
        "body": "Wir prüfen die Zutrittspunkte des Standorts, die Kameraabdeckung, die Alarmprozesse und den zugehörigen Objektschutz- oder Pförtnerbetrieb."
      },
      {
        "title": "Identifikation kritischer Punkte, Zutrittszonen und Risikobereiche",
        "body": "Wir identifizieren die Zonen, in denen Bewegungen, Berechtigungen, Lieferverkehr oder wiederkehrende Ereignisse technische Unterstützung erfordern."
      },
      {
        "title": "Überprüfung der Kamera-, Zutritts-, Alarm- und Meldungsprozesse",
        "body": "Wir prüfen, wie das vorhandene oder geplante technische System Erkennung, Zutrittskontrolle, Alarmierung und Ereignisbearbeitung unterstützt."
      },
      {
        "title": "Abstimmung von technischem und personellem Sicherheitsbetrieb",
        "body": "Die technischen Meldungen stimmen wir auf die Prozesse von Sicherheitspersonal, Pförtnerdienst, Ansprechpartnern und Fernüberwachung ab."
      },
      {
        "title": "Festlegung von Eskalations-, Berichts- und Wartungsaspekten",
        "body": "Wir halten fest, wer auf welches Ereignis reagiert, was zu protokollieren ist, welcher Bericht erstellt wird und wie das System wartbar bleibt."
      },
      {
        "title": "Vorschlag zur Weiterentwicklung oder Integration des sicherheitstechnischen Betriebs",
        "body": "Auf Grundlage der Bestandsaufnahme geben wir einen praxisnahen Vorschlag, wie die Technik besser an den täglichen Sicherheitsbetrieb angebunden werden kann."
      }
    ],
    "trustItems": [
      {
        "title": "Standortgerechte sicherheitstechnische Bestandsaufnahme",
        "body": "Die technischen Anforderungen erfassen wir auf Grundlage einer Begehung vor Ort und einer Betriebsanalyse — nicht als bloße Geräteliste."
      },
      {
        "title": "Betrieb auf Grundlage der sicherheitstechnischen Genehmigung",
        "body": "Die Leistung wird im Einklang mit der sicherheitstechnischen Genehmigung und den vertraglichen Anforderungen des Standorts gestaltet."
      },
      {
        "title": "Integration in den Standortbetrieb und die Eskalationskette",
        "body": "Kamera-, Zutritts- und Alarmmeldungen schaffen erst dann echten betrieblichen Wert, wenn sie mit der Präsenz des Sicherheitspersonals, den Pförtnerprozessen, den definierten Eskalationswegen und klar benannten Reaktionsverantwortlichkeiten verbunden sind."
      },
      {
        "title": "Anbindung an Pförtner- und Zutrittsprozesse",
        "body": "Das technische System kann die Zutrittskontrolle von Besuchern, Lieferanten und Mitarbeitern sowie die Einhaltung der Berechtigungsregeln unterstützen."
      },
      {
        "title": "Sicherheitstechnische Planung, die Datenschutzaspekte einbezieht",
        "body": "Die Abdeckung der Kamerabilder, der Erfassungsbereich, die Zugriffsberechtigungen, die Information der Betroffenen und die Speicherlogik sind als Teil der sicherheitstechnischen Bestandsaufnahme und Planung zu behandeln."
      },
      {
        "title": "Dokumentierte Feststellungen und Umsetzungsvorschlag",
        "body": "Das Ergebnis der Bestandsaufnahme lässt sich in berichtsfähigen Feststellungen, Prioritäten, Integrationspunkten und einem Umsetzungsvorschlag zusammenfassen."
      },
      {
        "title": "Betriebsdisziplin, gestützt auf ISO 9001 und ISO 27001",
        "body": "Der Betrieb kann auf geregelte Prozesse gestützt werden, die an die nach ISO 9001 und ISO 27001 zertifizierten Managementsysteme anschließen, sofern die betreffenden Prozesse in den zertifizierten Geltungsbereich fallen."
      }
    ],
    "faq": [
      {
        "q": "Was bedeutet Sicherheitstechnik in der Leistung von Avenir?",
        "a": "Sicherheitstechnik ist die technische Ebene der Sicherheit vor Ort: Kamerasystem, Zutrittskontrolle, Einbruchmeldung, Alarmprozess, Meldungsbearbeitung und deren geregelter Betrieb. Ziel ist, dass die Technik kein isoliertes Gerät bleibt, sondern Objektschutz, Pförtnerdienst und Eskalation unterstützt."
      },
      {
        "q": "Lässt sich die Sicherheitstechnik mit dem personellen Objektschutz verbinden?",
        "a": "Ja. Kamerasystem, Zutrittskontrolle oder Alarmprozess schaffen erst dann echten Wert, wenn auch Sicherheitspersonal, Pforte, Ansprechpartner und Eskalationsordnung wissen, was bei welcher Meldung zu tun ist."
      },
      {
        "q": "An welchen Standorten ist eine sicherheitstechnische Bestandsaufnahme sinnvoll?",
        "a": "Besonders sinnvoll ist sie bei Bürogebäuden, Industrie- und Logistikstandorten, Lagern, Lkw-Toren, Objekten mit mehreren Zutrittspunkten sowie an Standorten mit wiederkehrenden Vorfällen oder unkontrollierten Bewegungen."
      },
      {
        "q": "Kann nur ein neues System geplant oder auch ein bestehendes überprüft werden?",
        "a": "Auch vorhandene Kamerasysteme, Zutrittskontroll- oder Alarmprozesse können überprüft werden. Dabei untersuchen wir, ob die aktuelle Technik den täglichen Betrieb, den Objektschutz, die Ereignisbearbeitung und das Berichtswesen unterstützt."
      },
      {
        "q": "Kann das System an eine Fernüberwachung angebunden werden?",
        "a": "Ja, wo dies erforderlich ist, kann der sicherheitstechnische Prozess an eine Fernüberwachung oder Meldungsbearbeitung angebunden werden. Die Einzelheiten sollten auf Grundlage der Standortrisiken, der technischen Gegebenheiten und der vertraglichen Anforderungen festgelegt werden."
      },
      {
        "q": "Warum ist eine festgeschriebene Eskalationsordnung wichtig?",
        "a": "Die Eskalationsordnung legt fest, wer bei Alarm, außergewöhnlichem Ereignis oder unbefugtem Zutrittsversuch eine Meldung erhält, in welcher Reihenfolge benachrichtigt wird, was zu erfassen ist und wie die Bearbeitung des Ereignisses abgeschlossen wird."
      },
      {
        "q": "Worin unterscheidet sich das von einem einfachen Kamera- oder Alarmsystem?",
        "a": "Ein Kamera- oder Alarmsystem ist für sich genommen nur ein Gerät. Im Verständnis von Avenir ist Sicherheitstechnik Teil des gesamten Standortbetriebs: verbunden mit Objektschutz, Pförtnerdienst, Zutrittskontrolle, Meldungsbearbeitung und Berichtswesen."
      },
      {
        "q": "Müssen bei der Gestaltung eines Kamerasystems Datenschutzaspekte geprüft werden?",
        "a": "Ja. Bei der Planung eines Kamerasystems sind die Zweckbindung, die Information der Betroffenen, die Dokumentation des berechtigten Interesses, der Erfassungsbereich der Kameras, die Speicherdauer und das eigene Datenschutzumfeld des Standorts zu prüfen. Dies ist keine Rechtsberatung, doch der technische Vorschlag muss diese Aspekte berücksichtigen."
      },
      {
        "q": "Welche Faktoren beeinflussen die Speicherdauer von Kameraaufnahmen?",
        "a": "Die Speicherdauer wird vom Zweck der Aufzeichnung, vom Risikoprofil des Standorts, vom Bedarf der Vorfallbearbeitung, von internen Richtlinien und vom Datenschutzumfeld beeinflusst. Eine für alle Standorte gleiche, allgemeine Antwort gibt es nicht; die Speicherordnung ist fachlich begründet festzulegen."
      },
      {
        "q": "Wer führt die Interessenabwägung für eine Videoüberwachung durch?",
        "a": "Die Interessenabwägung — etwa zur Stützung eines berechtigten Interesses nach der DSGVO — ist Teil des Datenschutzrahmens des Kunden als Verantwortlichem. Avenir liefert dafür die technische und betriebliche Grundlage: den dokumentierten Zweck, die Erfassungsbereiche sowie die Zugriffs- und Speicherlogik. Die Bewertung selbst und die Entscheidung über die Rechtsgrundlage verbleiben beim Kunden und seinen Beratern. Dies ist keine Rechtsberatung."
      },
      {
        "q": "Wie lange dürfen Kameraaufnahmen gespeichert werden?",
        "a": "Eine einheitliche, für alle Standorte gültige Speicherdauer gibt es nicht. Maßgeblich sind der dokumentierte Zweck der Aufzeichnung, das Risikoprofil des Standorts, der Bedarf der Vorfallbearbeitung, interne Richtlinien und der anwendbare Datenschutzrahmen — einschließlich des Grundsatzes der Speicherbegrenzung. Die Speicherordnung ist fachlich begründet festzulegen; die abschließende Entscheidung liegt beim Kunden als Verantwortlichem."
      }
    ],
    "relatedSlugs": [
      "tavfelugyelet-vonuloszolgalat",
      "objektumorzes",
      "portaszolgalat",
      "hard-fm"
    ],
    "legalReviewRequired": true,
    "legalReviewRequiredKeys": [
      "biztonsagtechnika:PILOT_HU.longDesc.body.2",
      "biztonsagtechnika:PILOT_HU.trustItems.1.body",
      "biztonsagtechnika:PILOT_HU.trustItems.4.body",
      "biztonsagtechnika:PILOT_HU.faq.7.a",
      "biztonsagtechnika:PILOT_HU.faq.8.a",
      "biztonsagtechnika:DE_ONLY.faq.9.q",
      "biztonsagtechnika:DE_ONLY.faq.9.a",
      "biztonsagtechnika:DE_ONLY.faq.10.q",
      "biztonsagtechnika:DE_ONLY.faq.10.a"
    ]
  },
  "tavfelugyelet-vonuloszolgalat": {
    "id": 6,
    "slug": "tavfelugyelet-vonuloszolgalat",
    "icon": "radar",
    "imageUrl": null,
    "name": "Fernüberwachung und Interventionsdienst",
    "shortDesc": "Bearbeitung von Alarmmeldungen, Eskalation, Ereigniserfassung und Interventionsdienst — abgestimmt mit Sicherheitstechnik und Objektschutz.",
    "longDesc": "Avenir nimmt die Alarm-, Einbruch- und kamerabezogenen Meldungen der aufgeschalteten Standorte gemäß der vereinbarten Aufschaltungskonfiguration entgegen. Die Meldungen werden vor der Eskalation nach dem vorab festgelegten Verifikationsprotokoll geprüft. Fehlalarme können protokolliert und ausgewertet werden; reale Ereignisse werden nach dem Standortprotokoll an den benannten Ansprechpartner, den Interventionsdienst oder den externen Eskalationsweg weitergeleitet. Die Maßnahmen werden im Ereignisprotokoll festgehalten.\n\nUmfasst die Leistung die Meldungsbearbeitung der Fernüberwachung, ist der Verifikationsschritt Teil des Betriebsverfahrens und wird je Ereignis dokumentiert. Die rechtlichen und vertraglichen Rahmenbedingungen der Fernüberwachung und des Interventionsdienstes werden in der Vorbereitungsphase abgestimmt; die externe Eskalation erfolgt nach dem vereinbarten Standortprotokoll und den anwendbaren Vorschriften.\n\nDie Fernüberwachung funktioniert dann gut, wenn sie mit den übrigen Sicherheitsebenen des Standorts verbunden ist: mit der Sicherheitstechnik, dem Objektschutz, dem Pförtnerdienst und dem abgestimmten Reaktionsprozess. So fügen sich Meldungsbearbeitung, Eskalation, Ereignisprotokollierung und Abschluss zu einem Betriebsmodell zusammen.",
    "seoTitle": "Fernüberwachung und Interventionsdienst | Avenir",
    "seoDescription": "Bearbeitung von Alarmmeldungen, Eskalation, Ereigniserfassung und Interventionsdienst — abgestimmt mit Sicherheitstechnik und Objektschutz.",
    "valueProposition": "Avenir bearbeitet mit einer 24/7-Leitstelle die Alarm-, Einbruch- und Kamerameldungen der aufgeschalteten Standorte; jede Meldung durchläuft einen geprüften Eskalationsprozess, und die Maßnahmen werden im Ereignisprotokoll festgehalten.",
    "highlights": [],
    "useCases": [
      "Industrie- und Logistikstandorte mit Einbruch-, Alarm- oder Perimeterschutz-Meldungen",
      "Bürogebäude, Lager und Businesscenter mit kameraüberwachten Zonen",
      "Standorte mit Zutrittskontrolle oder Einbruchmeldung, an denen eine 24/7-Meldungsbearbeitung erforderlich ist",
      "Betrieb mit mehreren Mietern oder Standorten und dokumentierter Eskalationskette",
      "Überprüfung bestehender Fernüberwachungs- oder Interventionsprozesse wegen Lücken bei Verifikation, Reaktion oder Berichtswesen"
    ],
    "includedItems": [
      "24/7-Entgegennahme von Alarm- und Kamerameldungen gemäß der vereinbarten Aufschaltungskonfiguration",
      "Verifiziertes Alarmprotokoll mit je Ereignis dokumentiertem Prüfschritt",
      "Namentliche Kontaktkette, Eskalationsmatrix und Benachrichtigungsregeln",
      "Eigener Interventionsdienst nach vereinbarten Vertragsbedingungen",
      "Ereignisprotokoll mit Zeitstempel und Ereignisbericht",
      "Anbindung an Sicherheitstechnik, Objektschutz und Pförtnerdienst des Standorts"
    ],
    "processSteps": [
      {
        "title": "Überblick über Standort und technische Gegebenheiten",
        "body": "Wir prüfen die Alarmpunkte, Meldungsquellen, technischen Gegebenheiten sowie den Objektschutz- oder Pförtnerbetrieb des Standorts."
      },
      {
        "title": "Erfassung von Meldungsquellen und Verifikationspunkten",
        "body": "Wir bestimmen, welche Meldungen entstehen können, aus welchen Quellen sie kommen, welche Prüfpunkte dazugehören und wie die Verifikation zu dokumentieren ist."
      },
      {
        "title": "Gestaltung der Kontaktkette und Eskalationsmatrix",
        "body": "Wir legen fest, wer bei welchem Ereignis zu benachrichtigen ist, in welcher Reihenfolge eskaliert wird und welches Ereignis einen Interventions- oder externen Reaktionsprozess auslöst."
      },
      {
        "title": "Interventionsdienst nach vereinbarten Bedingungen",
        "body": "Den Reaktionsprozess vor Ort stimmen wir auf die technischen Gegebenheiten, das Einsatzgebiet und die vertraglichen Bedingungen ab."
      },
      {
        "title": "Regeln für Ereignisprotokollierung und Berichtswesen",
        "body": "Wir definieren, was zu protokollieren ist, welcher Bericht erstellt wird, welche Abschlussstatus verwendet werden und wie die Ereignisbearbeitung rückverfolgbar bleibt."
      },
      {
        "title": "Start, Betriebsbegleitung und Feinjustierung",
        "body": "Nach dem Start stimmen wir wiederkehrende Meldungen, Erfahrungen und Berichte ab und präzisieren den Prozess bei Bedarf."
      }
    ],
    "trustItems": [
      {
        "title": "24/7-Meldungsempfang mit verifizierter Eskalation",
        "body": "Avenir stellt für die aufgeschalteten Standorte einen 24/7-Meldungsempfang sicher; die Alarme werden vor der Eskalation nach dem vereinbarten Verifikationsprotokoll geprüft."
      },
      {
        "title": "Dokumentiertes Alarmverifikationsprotokoll",
        "body": "Jede Meldung, jeder Prüfschritt und jede Eskalationsentscheidung wird im Ereignisprotokoll festgehalten, das gemäß der Servicevereinbarung rückverfolgbar ist."
      },
      {
        "title": "Namentliche Kontaktkette und Eskalationsmatrix",
        "body": "Benachrichtigungsreihenfolge, benannte Ansprechpartner und Reaktionsauslöser sind vorab abgestimmt und je Standort dokumentiert."
      },
      {
        "title": "Betriebliche Integration mit Sicherheitstechnik, Objektschutz und Pförtnerdienst",
        "body": "Die Fernüberwachung arbeitet mit dem Kamerasystem, der Zutrittskontrolle, dem Objektschutz und dem Pförtnerdienst des Standorts zusammen, damit Meldungsbearbeitung und Reaktion nach einem Betriebsmodell erfolgen."
      },
      {
        "title": "Ereigniserfassung und periodischer Vorfallbericht",
        "body": "Der Kunde erhält nach der vereinbarten Häufigkeit einen Ereignisbericht; das Ereignisprotokoll unterstützt die Auswertung von Fehlalarmen, wiederkehrenden Ereignissen und Verbesserungspunkten."
      },
      {
        "title": "Managementsysteme nach ISO 9001 und ISO 27001",
        "body": "Der Fernüberwachungsbetrieb wird durch die nach ISO 9001 und ISO 27001 zertifizierten Managementsysteme von Avenir unterstützt, sofern diese Prozesse in den zertifizierten Geltungsbereich fallen."
      }
    ],
    "faq": [
      {
        "q": "Was bedeutet Fernüberwachung in der Leistung von Avenir?",
        "a": "Avenir nimmt die von den aufgeschalteten Standorten eingehenden Alarm-, Einbruch-, kamerabezogenen oder sonstigen sicherheitstechnischen Meldungen entgegen, prüft und protokolliert sie und eskaliert sie nach dem vereinbarten Protokoll."
      },
      {
        "q": "Was ist der Unterschied zwischen Fernüberwachung und Interventionsdienst?",
        "a": "Die Fernüberwachung konzentriert sich auf die Entgegennahme und Bearbeitung der Meldungen, während der Interventionsdienst auf vertraglicher Grundlage einen Reaktionsprozess vor Ort sicherstellen kann. Zusammen ergeben beide ein vollständigeres Meldungs- und Reaktionssystem."
      },
      {
        "q": "Welche Meldungen können bearbeitet werden?",
        "a": "Der Prozess kann an Einbruchmeldeanlagen, Alarmereignisse, Kamerasysteme, Zutrittsereignisse, Perimeterschutz-Meldungen oder andere sicherheitstechnische Meldungen anschließen. Die genauen Meldungstypen sind auf Grundlage der Standortgegebenheiten und der vertraglichen Anforderungen festzulegen."
      },
      {
        "q": "Wie wird ein Alarm vor der Eskalation geprüft?",
        "a": "Der Verifikationsschritt wird im Standortprotokoll festgelegt. Avenir prüft den Alarm vor der Eskalation anhand der verfügbaren Meldungsquellen und der vereinbarten Prüfregel. Fehlalarme können protokolliert und nachträglich ausgewertet werden; reale Ereignisse werden nach dem dokumentierten Kontakt- und Reaktionsprotokoll eskaliert. Jeder Schritt wird im Ereignisprotokoll festgehalten."
      },
      {
        "q": "Verfügt Avenir über die für Fernüberwachung und Interventionsdienst erforderlichen Genehmigungen?",
        "a": "Ja. Fernüberwachung und Interventionsdienst erfolgen nach dem anwendbaren ungarischen Regulierungsrahmen für Personen- und Vermögensschutz. Informationen zur Genehmigung und zur Leistungsdokumentation können im Rahmen der Vertragsvorbereitung abgestimmt werden."
      },
      {
        "q": "Gibt es eine garantierte Anfahrtszeit?",
        "a": "Der Interventionsprozess ist auf Grundlage der Vertragsbedingungen, des Standorts, der technischen Gegebenheiten und des Einsatzgebiets festzulegen. Deshalb sollten die Anfahrts- bzw. Reaktionsregeln immer zu Beginn der Zusammenarbeit genau festgehalten werden."
      },
      {
        "q": "Wie erfolgt die Eskalation?",
        "a": "Die Eskalation erfolgt nach der im Standortprotokoll festgehaltenen namentlichen Kontaktkette, Benachrichtigungsreihenfolge und Reaktionsmatrix. Das Protokoll legt fest, wann ein benannter Ansprechpartner, der Interventionsdienst oder ein externer Eskalationsweg einzubeziehen ist."
      },
      {
        "q": "Erhalten wir einen Ereignisbericht?",
        "a": "Ja. Der Kunde erhält nach der vereinbarten Häufigkeit einen Ereignisbericht; Format, Häufigkeit und Inhalt des Berichts können zu Beginn der Zusammenarbeit festgelegt werden."
      },
      {
        "q": "Wie lassen sich Alarmmeldungen und Ereignisse dokumentieren?",
        "a": "Die Meldungen können in einem Ereignisprotokoll mit Zeitstempel erfasst werden: wann die Meldung einging, welcher Prüfschritt erfolgte, welche Benachrichtigungskette anlief, ob eskaliert wurde, welche Maßnahme folgte und welcher Abschlussstatus vergeben wurde. Die Einzelheiten sind nach den Standort- und Vertragsregeln festzulegen."
      },
      {
        "q": "Lässt sich die Fernüberwachung mit der Sicherheitstechnik verbinden?",
        "a": "Ja. Die Fernüberwachung funktioniert dann gut, wenn sich Kamerasystem, Einbruchmeldeanlage, Zutrittskontrolle, Objektschutz und Pförtnerdienst in ihren Prozessen abgestimmt unterstützen."
      },
      {
        "q": "Wie werden Datenschutzaspekte im Fernüberwachungsbetrieb behandelt?",
        "a": "Die in der Fernüberwachung genutzten Meldungen, Kamerabilder und Zutrittsereignisse dürfen ausschließlich zum vereinbarten Fernüberwachungszweck und im Datenschutzrahmen des Kunden verarbeitet werden. Die Regeln für Speicherung, Zugriffsprotokollierung und Datenminimierung werden je Standort festgelegt. Avenir unterstützt die technische und betriebliche Seite des Prozesses; die Rechtsgrundlage und die abschließenden Datenschutzentscheidungen verbleiben beim Kunden und seinen Beratern."
      },
      {
        "q": "Wann ist eine Sicherheitsbegehung vor Ort sinnvoll?",
        "a": "Eine Sicherheitsbegehung vor Ort ist sinnvoll, wenn ein neuer Alarm- oder Fernüberwachungsbetrieb aufzubauen ist, wiederkehrende Meldungen auftreten, sich die Zutrittsordnung ändert oder die bestehenden Reaktions- und Eskalationsprozesse transparenter gestaltet werden sollen."
      }
    ],
    "relatedSlugs": [
      "biztonsagtechnika",
      "objektumorzes",
      "portaszolgalat",
      "hard-fm"
    ],
    "legalReviewRequired": true,
    "legalReviewRequiredKeys": [
      "tavfelugyelet-vonuloszolgalat:PILOT_HU.longDesc.body.1",
      "tavfelugyelet-vonuloszolgalat:PILOT_HU.faq.4.a",
      "tavfelugyelet-vonuloszolgalat:PILOT_HU.faq.10.a"
    ]
  },
  "hard-fm": {
    "id": 7,
    "slug": "hard-fm",
    "icon": "gear",
    "imageUrl": null,
    "name": "Hard FM – Technisches Gebäudemanagement",
    "shortDesc": "Geplante vorbeugende Instandhaltung, reaktive Störungsbearbeitung, Koordination von Fachfirmen und dokumentiertes Berichtswesen für den technischen Standortbetrieb.",
    "longDesc": "Die Hard-FM-Leistung von Avenir bündelt die geplante vorbeugende Instandhaltung und die reaktive Störungsbearbeitung der technischen Anlagen von Unternehmens-, Industrie- und Logistikstandorten. Der Leistungsumfang kann die Gebäudesubstanz, gebäudetechnische und elektrische Anlagen, Sanitär- und HLK-Prozesse, kleinere technische Arbeiten, die Koordination von Fachfirmen und die dokumentierte Störungsverfolgung umfassen.\n\nWährend der Mobilisierung legt Avenir gemeinsam mit dem Kunden den Störungsmeldeweg, die Eskalationspunkte, die Dienstleisterverantwortlichkeiten, die Maßnahmendokumentation und den Berichtsrhythmus fest. Sind für HLK-, Elektro-, Sanitär- oder Pflichtprüfungsarbeiten Fachfirmen erforderlich, erfolgt deren Steuerung als Teil des vereinbarten Betriebsmodells — nicht als verdeckte Rückübertragung an den Kunden.\n\nHard FM kann als eigenständige technische Betriebsleistung funktionieren oder gemeinsam mit dem Pförtnerdienst, dem Objektschutz oder der Soft-FM-Leistung von Avenir am selben Standort. Im integrierten Betrieb sind Berichtsrhythmus, Eskalationskette und operative Kontaktpunkte aufeinander abgestimmt — der Kunde erhält kein fragmentiertes Dienstleisterfeedback, sondern ein einheitliches technisches Bild.",
    "seoTitle": "Hard FM – Technisches Gebäudemanagement | Avenir",
    "seoDescription": "Geplante vorbeugende Instandhaltung, reaktive Störungsbearbeitung, Koordination von Fachfirmen und dokumentiertes Berichtswesen für den technischen Standortbetrieb.",
    "valueProposition": "Hard FM bündelt die geplante vorbeugende Instandhaltung und die reaktive Störungsbearbeitung für Gebäudebetrieb, gebäudetechnische und elektrische Anlagen, Sanitär, HLK und den technischen Betrieb — mit dokumentierter Eskalation und Berichtswesen.",
    "highlights": [],
    "useCases": [
      "Eigentümer und Betreiber von Bürogebäuden und Businesscentern",
      "Logistik-, Lager- und Leichtindustriestandorte mit komplexen technischen Anlagen",
      "Betreiber einzelner Standorte, die ein einheitliches technisches Betriebsmodell suchen",
      "Portfolios mit mehreren Standorten, bei denen eine fragmentierte FM-Dienstleisterkoordination zusammenzuführen ist",
      "Standorte, an denen Hard FM mit Pförtnerdienst, Objektschutz oder Soft FM zusammenarbeiten muss"
    ],
    "includedItems": [
      "Geplante vorbeugende Instandhaltung mit Terminplan für die vereinbarten Anlagen und Systeme",
      "Reaktive Störungsbearbeitung mit vereinbarten Prioritätskategorien",
      "Dokumentiertes Störungsprotokoll, Maßnahmendokumentation und Abschlussstatus",
      "Koordination von Fachfirmen für HLK-, Elektro-, Sanitär- und Prüfaufgaben",
      "Koordination und Dokumentationsunterstützung der Pflichtprüfungen, sofern im Leistungsumfang enthalten",
      "Monatlicher Betriebsbericht über offene Aufgaben, abgeschlossene Maßnahmen, wiederkehrende Störungen und Verbesserungspunkte"
    ],
    "processSteps": [
      {
        "title": "Anlagen- und Zustandsaufnahme",
        "body": "Wir prüfen die vereinbarten Anlagen und Systeme, den technischen Zustand, wiederkehrende Störungen und den betroffenen Dienstleisterkreis."
      },
      {
        "title": "PPM-Terminplan und Prioritätskategorien",
        "body": "Gemeinsam mit dem Kunden legen wir den Terminplan der vorbeugenden Instandhaltung, den Störungsmeldeweg und die Prioritätskategorien der reaktiven Aufgaben fest."
      },
      {
        "title": "Mobilisierung und betriebliche Einrichtung",
        "body": "Wir halten die Dienstleisterverantwortlichkeiten, die Regeln für die Einbindung von Fachfirmen, die Eskalationspunkte und die operativen Kontakte fest."
      },
      {
        "title": "Betrieb, Protokollierung und Berichtswesen",
        "body": "Störungsmeldungen, Maßnahmen, Statusänderungen, Abschlüsse und offene Aufgaben sind im dokumentierten Störungsprotokoll und im Monatsbericht nachvollziehbar."
      },
      {
        "title": "Überprüfung wiederkehrender Störungen und Verbesserungspunkte",
        "body": "Auf Grundlage der Berichte und Erfahrungen prüfen wir wiederkehrende Störungen, offene Risiken und die nächsten Verbesserungspunkte."
      }
    ],
    "trustItems": [
      {
        "title": "Namentlich benannter operativer Ansprechpartner",
        "body": "Der Kunde erhält einen namentlich benannten operativen Ansprechpartner für Störungsmeldungen, Eskalation, Dienstleisterkoordination und Berichtswesen."
      },
      {
        "title": "Prioritätsbasierte reaktive Störungsbearbeitung",
        "body": "Reaktive Aufgaben können nach den in der Mobilisierung vereinbarten Prioritätskategorien bearbeitet werden, sodass dringende Störungen, Routineaufgaben und geplante Arbeiten über unterschiedliche Bearbeitungswege laufen."
      },
      {
        "title": "Koordination von Fachfirmen",
        "body": "HLK-, Elektro-, Sanitär- und Prüfaufgaben können auch unter Einbindung von Fachfirmen erfüllt werden — koordiniert nach dem vereinbarten Betriebsmodell."
      },
      {
        "title": "Dokumentiertes Störungsprotokoll und Monatsbericht",
        "body": "Störungsmeldungen, Maßnahmen, Statusänderungen und Abschlüsse werden erfasst und können im monatlichen Betriebsbericht zusammengefasst werden."
      },
      {
        "title": "Anbindung an Pförtnerdienst, Objektschutz und Soft FM",
        "body": "Arbeitet Hard FM mit Pförtnerdienst, Objektschutz oder Soft FM zusammen, lassen sich Berichtswesen, Eskalation und operative Kontaktpunkte am jeweiligen Standort aufeinander abstimmen."
      }
    ],
    "faq": [
      {
        "q": "Was bedeutet Hard FM?",
        "a": "Hard FM bezeichnet die koordinierte Steuerung des technischen Gebäudebetriebs, der Instandhaltungsprozesse, der Störungsmeldungen und der Dienstleisterabstimmung an den Standorten. Ziel ist ein transparenter und berichtsfähiger technischer Betrieb."
      },
      {
        "q": "Worin unterscheidet sich Hard FM von Soft FM?",
        "a": "Hard FM konzentriert sich vor allem auf technische, Instandhaltungs- und Gebäudebetriebsprozesse, während Soft FM eher die täglichen unterstützenden Leistungen umfasst, etwa Reinigung, Grünflächen oder operative Unterstützung. An vielen Standorten arbeiten beide Bereiche effizient zusammen."
      },
      {
        "q": "Können auch Störungsmeldungen bearbeitet werden?",
        "a": "Ja, Teil des Hard FM kann die Gestaltung der Annahme, Weiterleitung, Priorisierung und Eskalation von Störungsmeldungen sein. Der genaue Prozess sollte auf Grundlage der Standortanforderungen und der vertraglichen Rahmenbedingungen festgelegt werden."
      },
      {
        "q": "Führt Avenir alle technischen Arbeiten selbst aus?",
        "a": "Der Betrieb hängt von der Art der Aufgabe und den vertraglichen Rahmenbedingungen ab. Die Hard-FM-Leistung kann eigene Koordination, die Einbindung benannter Dienstleister, die Abstimmung mit Nachunternehmern oder die koordinierte Steuerung der bestehenden Partner des Auftraggebers umfassen."
      },
      {
        "q": "Gibt es eine garantierte Reparaturzeit?",
        "a": "Die Reparatur- bzw. Reaktionszeit hängt vom Standort, der Aufgabenart, den Zugangsbedingungen und den erforderlichen Fachfirmen ab. Avenir kann in der Mobilisierung Prioritätskategorien festlegen, damit dringende Störungen, Routineaufgaben und geplante Instandhaltung über unterschiedliche Bearbeitungswege laufen — eine allgemeine garantierte Reparaturzeit bedeutet das jedoch nicht."
      },
      {
        "q": "Erhalten wir einen Bericht über die technischen Aufgaben?",
        "a": "Ja, Teil der Leistung kann ein vereinbartes Berichtswesen sein. Der Bericht kann Störungsmeldungen, Status, Maßnahmen, abgeschlossene Aufgaben, wiederkehrende Probleme und Verbesserungsvorschläge enthalten."
      },
      {
        "q": "Wann lohnt sich ein eigener Hard-FM-Prozess?",
        "a": "Ein dedizierter Hard-FM-Prozess lohnt sich, wenn technische Störungen, Instandhaltungsaufgaben, Fachfirmen und Berichtswesen derzeit fallweise oder über mehrere, voneinander getrennte Dienstleister laufen. Der dedizierte Prozess gibt dem Kunden einen transparenteren Störungsweg, Prioritätskategorien, Statusverfolgung und einen festen Berichtsrhythmus."
      },
      {
        "q": "Kann Hard FM an Sicherheits- oder Pförtnerprozesse angebunden werden?",
        "a": "Ja. An vielen Standorten erkennt die Pforte, der Objektschutz oder der sicherheitstechnische Betrieb ein technisches Problem zuerst. Der Hard-FM-Prozess funktioniert gut, wenn Meldungen, Verantwortliche, Dienstleister und Eskalationspunkte aufeinander abgestimmt sind."
      }
    ],
    "relatedSlugs": [
      "soft-fm",
      "biztonsagtechnika",
      "tavfelugyelet-vonuloszolgalat",
      "objektumorzes"
    ],
    "legalReviewRequired": false,
    "legalReviewRequiredKeys": []
  },
  "soft-fm": {
    "id": 8,
    "slug": "soft-fm",
    "icon": "leaf",
    "imageUrl": null,
    "name": "Soft FM – Infrastrukturelles Gebäudemanagement",
    "shortDesc": "Soft-FM-Leistungen mit Reinigungskoordination, Grünpflege, Hygieneprozessen, operativer Unterstützung und Berichtswesen.",
    "longDesc": "Die Soft-FM-Leistung von Avenir bündelt die Aufgaben, die den täglichen, nicht technischen Betrieb des Standorts unterstützen: Reinigung, Grünpflege- und Hygieneprozesse, Unterstützung bei der Abfallentsorgung, Dienstleisterkoordination und operative Unterstützung vor Ort. Zum Vertragsbeginn legt Avenir gemeinsam mit dem Kunden das Leistungsmodell fest: eigene Mitarbeiter, freigegebene Nachunternehmer oder bestehende kundenseitige Dienstleister unter Koordination von Avenir, nach dem vereinbarten Standortmodell.\n\nDie Soft-FM-Zusammenarbeit startet mit einem schriftlichen Leistungsumfang: Flächen, Aufgabenfrequenzen, Qualitätsanforderungen, Berichtsrhythmus und Eskalationswege. Ziel ist kein offener Betrieb „nach Bedarf“, sondern ein vorab festgelegter, überprüfbarer und berichtsfähiger Leistungsrahmen.\n\nArbeitet der Kunde mit bestehenden Reinigungs-, Grünpflege-, Hygiene- oder sonstigen Dienstleistern, kann Avenir die Koordinationsebene übernehmen: die tägliche Abstimmung vor Ort, die Qualitätskontrolle und das Berichtswesen — damit der Kunde nicht mit mehreren getrennten Verträgen, sondern mit einem zusammengeführten Betriebsbild arbeitet.",
    "seoTitle": "Soft FM – Infrastrukturelles Gebäudemanagement | Avenir",
    "seoDescription": "Soft-FM-Leistungen mit Reinigungskoordination, Grünpflege, Hygieneprozessen, operativer Unterstützung und Berichtswesen.",
    "valueProposition": "Soft FM bündelt die Leistungen, die den täglichen Betrieb des Standorts unterstützen: Reinigung, Grünpflege, Hygiene, Unterstützung bei der Abfallentsorgung und Dienstleisterkoordination — mit vereinbartem Leistungsumfang, definierten Qualitätskriterien und regelmäßigem Berichtsrhythmus.",
    "highlights": [],
    "useCases": [
      "Bürogebäude und Businesscenter, in denen Mieter ein sichtbares Serviceniveau am Tag erwarten",
      "Industrie- oder Logistikstandorte, an denen sich Reinigung, Hygieneprozesse und Abfallentsorgungs-Unterstützung am Schichtbetrieb ausrichten müssen",
      "Portfolios mit mehreren Standorten, die einen einheitlichen Leistungsumfang, einheitliche Frequenzen und ein einheitliches Berichtswesen benötigen",
      "Standorte, an denen die Koordination mehrerer separater Dienstleister heute Aufgabe des Kunden ist",
      "Betriebe, in denen Soft FM, Hard FM, Pförtnerdienst und Objektschutz über eine operative Schnittstelle verbunden werden können",
      "Situationen, in denen Einkaufs-, ESG- oder Auditteams schriftliche Berichte nach vereinbarten KPIs und Qualitätskriterien erwarten"
    ],
    "includedItems": [
      "Tägliche Unterhaltsreinigung in den vereinbarten Flächen und nach den vereinbarten Aufgabenfrequenzen",
      "Periodische Reinigungsleistungen, etwa Boden-, Glas- oder Teppichreinigung, sofern im Leistungsumfang enthalten",
      "Koordination von Grünpflege und Außenanlagenpflege, sofern Teil des Standortmodells",
      "Koordination von Hygieneverbrauchsmaterialien und Waschraumhygiene-Leistungen",
      "Unterstützung bei der Abfallentsorgung und Dienstleisterkontakt nach dem vereinbarten Betriebsmodell",
      "Koordination von Dienstleistern und Nachunternehmern bei bestehenden kundenseitigen Lieferanten",
      "Verfolgung von Abweichungen vor Ort, wiederkehrenden Problemen und Korrekturmaßnahmen",
      "Schriftlicher Bericht über erledigte Aufgaben, Qualitätsbeobachtungen, wiederkehrende Probleme und To-dos"
    ],
    "processSteps": [
      {
        "title": "Begehung vor Ort und Aufnahme des Leistungsumfangs",
        "body": "Vor der Festlegung des Leistungsumfangs prüft Avenir die betroffenen Flächen, Servicepunkte, Betriebszeitfenster und das bestehende Dienstleistermodell."
      },
      {
        "title": "Schriftlicher Leistungsumfang, Frequenzen und Qualitätskriterien",
        "body": "Serviceflächen, Aufgabenfrequenzen, Kontrollpunkte, Qualitätsanforderungen und Berichtsrhythmus werden vor dem operativen Start festgehalten."
      },
      {
        "title": "Festlegung von Leistungsmodell und Teamstruktur",
        "body": "Bei der Abstimmung des Leistungsumfangs legt Avenir gemeinsam mit dem Kunden das Erfüllungsmodell fest: eigene Mitarbeiter, freigegebene Nachunternehmer oder bestehende kundenseitige Dienstleister unter Koordination von Avenir, nach dem Standortmodell."
      },
      {
        "title": "Mobilisierung und betriebliche Einrichtung",
        "body": "Vor dem Start bereitet Avenir den Betriebsrahmen vor: Verantwortlichkeiten, Kontaktpunkte, Eskalationswege, Standortanweisungen und die für die tägliche Kontrolle erforderlichen Aufzeichnungen."
      },
      {
        "title": "Start und Stabilisierungsphase",
        "body": "In der ersten Betriebsphase verfolgt Avenir die anfänglichen Abweichungen, präzisiert die Verantwortlichkeiten und stabilisiert den Betriebsrhythmus innerhalb des vereinbarten Leistungsumfangs."
      },
      {
        "title": "Regelmäßiges Berichtswesen und Überprüfung mit dem Kunden",
        "body": "Avenir berichtet über erledigte Aufgaben, Qualitätsbeobachtungen, wiederkehrende Probleme und vereinbarte Maßnahmen und bespricht die Leistung regelmäßig mit dem Kunden."
      }
    ],
    "trustItems": [
      {
        "title": "Schriftlicher Leistungsumfang statt offenem Betrieb „nach Bedarf“",
        "body": "Avenir legt Flächen, Frequenzen, Qualitätskriterien und Berichtsrhythmus zum Vertragsbeginn fest, sodass der Rahmen des Auftrags vor dem operativen Betrieb eindeutig ist."
      },
      {
        "title": "Qualitätskontrolle nach definierten Kriterien",
        "body": "Avenir verfolgt Reinigungs-, Hygiene-, Grünpflege- und operative Unterstützungsaufgaben anhand vereinbarter Kontrollpunkte — nicht nach allgemeinen Erwartungen."
      },
      {
        "title": "Eine operative Schnittstelle über mehrere Dienstleister hinweg",
        "body": "Der Kunde erhält ein abgestimmtes Betriebsbild über die Mitarbeiter von Avenir, freigegebene Nachunternehmer und bestehende kundenseitige Dienstleister hinweg, nach dem Standortmodell."
      },
      {
        "title": "Koordination von Dienstleistern und Nachunternehmern",
        "body": "Avenir dokumentiert Verantwortlichkeiten, Kontaktpunkte und Eskalationswege, damit die tägliche Dienstleistersteuerung kontrolliert und nicht fragmentiert abläuft."
      },
      {
        "title": "Verfolgung von Korrekturmaßnahmen",
        "body": "Avenir verfolgt Abweichungen vor Ort, wiederkehrende Probleme und Korrekturmaßnahmen, damit diese überschaubar und nachverfolgbar bleiben."
      },
      {
        "title": "Schriftliches Berichtswesen",
        "body": "Avenir berichtet nach dem vereinbarten Berichtsrhythmus über den erledigten Leistungsumfang, Qualitätsbeobachtungen, wiederkehrende Probleme und vereinbarte Maßnahmen."
      },
      {
        "title": "Anbindung an Hard FM, Pförtnerdienst und Objektschutz",
        "body": "Werden diese Leistungen am selben Standort erbracht, stimmt Avenir das Soft-FM-Berichtswesen und die Abweichungsbearbeitung mit den Pförtner-, Objektschutz- und Hard-FM-Prozessen ab."
      },
      {
        "title": "Standortspezifisches Betriebsmodell",
        "body": "Personalstärke, Dienstleistereinbindung, Frequenzen und Berichtswesen richten sich nach dem Standortmodell und dem vereinbarten vertraglichen Leistungsumfang."
      }
    ],
    "faq": [
      {
        "q": "Was bedeutet Soft FM?",
        "a": "Soft FM bezeichnet die koordinierte Erbringung der nicht technischen Facility-Leistungen, die den täglichen Betrieb der Standorte unterstützen. Bei Avenir umfasst das Reinigung, Grünpflegeprozesse, Hygiene- und Abfallentsorgungs-Unterstützung, operative Koordination und Dienstleistersteuerung innerhalb des vereinbarten Leistungsumfangs."
      },
      {
        "q": "Worin unterscheidet sich Soft FM von Hard FM?",
        "a": "Hard FM konzentriert sich vor allem auf technische, Instandhaltungs- und Gebäudebetriebsprozesse. Soft FM bündelt die täglichen unterstützenden Leistungen: Reinigung, Grünpflege, Hygieneprozesse und operative Koordination vor Ort. An vielen Standorten funktionieren beide Bereiche dann gut, wenn Berichts- und Eskalationswege aufeinander abgestimmt sind."
      },
      {
        "q": "Geht es bei Soft FM nur um Reinigung?",
        "a": "Nein. Die Reinigung ist oft ein zentrales Element des Soft FM, doch die Leistung ist breiter. Avenir steuert die Betriebsebene rund um Reinigung, Dienstleistersteuerung, Grünpflegeprozesse, Hygienebetrieb, Qualitätskontrolle, Berichtswesen und Unterstützung vor Ort."
      },
      {
        "q": "Kann Avenir mehrere Dienstleister oder Nachunternehmer koordinieren?",
        "a": "Ja. Im vereinbarten Soft-FM-Modell koordiniert Avenir ab Vertragsbeginn die Dienstleisterverantwortlichkeiten, Kontaktpunkte, Eskalationswege und Berichtsanforderungen."
      },
      {
        "q": "Gibt es eine garantierte Reinigungsqualität?",
        "a": "Eine allgemeine Garantie für Reinigungsqualität kann den definierten Leistungsumfang nicht ersetzen. Avenir steuert die Qualität über vereinbarte Aufgaben, definierte Kriterien, Leistungskontrollen, Berichtswesen und Korrekturmaßnahmen — so bleiben die Erwartungen konkret und überschaubar."
      },
      {
        "q": "Wie lässt sich die Qualität der Soft-FM-Leistungen kontrollieren?",
        "a": "Avenir verfolgt die Qualität über vereinbarte Kontrollpunkte, Leistungskontrollen, die Nachverfolgung wiederkehrender Probleme, Feedbackrunden und regelmäßiges schriftliches Berichtswesen — auf Grundlage standortspezifischer Anforderungen."
      },
      {
        "q": "Erhalten wir einen schriftlichen Bericht über die Soft-FM-Aufgaben?",
        "a": "Ja. Zu strukturierten Soft-FM-Kooperationen gehört ein regelmäßiges schriftliches Berichtswesen, das den erledigten Leistungsumfang, Qualitätsbeobachtungen, wiederkehrende Probleme und vereinbarte Maßnahmen abdeckt."
      },
      {
        "q": "Kann Soft FM an Pförtner- oder Sicherheitsprozesse angebunden werden?",
        "a": "Ja. An vielen Standorten melden Pforte, Empfang, Objektschutz oder das Hard-FM-Team operative Probleme zuerst. Soft FM funktioniert besser, wenn Meldungen, Verantwortlichkeiten, Dienstleister und Berichtsprozesse in einem Betriebsmodell verbunden sind."
      }
    ],
    "relatedSlugs": [
      "hard-fm",
      "portaszolgalat",
      "mystery-shopping-helyszini-audit",
      "objektumorzes",
      "rendezvenybiztositas"
    ],
    "legalReviewRequired": false,
    "legalReviewRequiredKeys": []
  }
} as const satisfies Record<
  DeReviewServiceSlug,
  DeReviewServiceDetail
>;

const DE_REVIEW_RELATED_SERVICES_BY_SOURCE_SLUG = {
  "objektumorzes": [
    {
      "slug": "portaszolgalat",
      "icon": "desk",
      "name": "Empfangs- und Pförtnerdienst",
      "shortDesc": "Empfangs- und Pförtnerdienst für Besucher, Lieferanten, Mitarbeiter, Schlüssel, Pakete, Protokollierung und abgestimmte Eskalation."
    },
    {
      "slug": "biztonsagtechnika",
      "icon": "camera",
      "name": "Sicherheitstechnik",
      "shortDesc": "Sicherheitstechnik für Kamerasysteme, Zutrittskontrolle und Alarmprozesse, eingebettet in ein standortgerechtes Sicherheitsmodell, mit technischer Planung, die Datenschutzaspekte einbezieht."
    },
    {
      "slug": "tavfelugyelet-vonuloszolgalat",
      "icon": "radar",
      "name": "Fernüberwachung und Interventionsdienst",
      "shortDesc": "Fernüberwachung und Interventionsdienst mit Alarmempfang, Alarmverifikation, Eskalation, Ereignisprotokollierung und abgestimmtem Reaktionsprozess."
    },
    {
      "slug": "mystery-shopping-helyszini-audit",
      "icon": "eye",
      "name": "Mystery Shopping und Serviceaudit",
      "shortDesc": "Mystery Shopping und Serviceaudit in realen Kunden- und Betriebssituationen, mit strukturierter Beobachtung, Berichtswesen und Verbesserungsempfehlungen."
    },
    {
      "slug": "rendezvenybiztositas",
      "icon": "shield",
      "name": "Veranstaltungssicherheit",
      "shortDesc": "Veranstaltungssicherheit für Firmen-, geschlossene und öffentliche Veranstaltungen, mit Zutrittskontrolle, Unterstützung der Besucherströme, Zonenmanagement, Vorfallerfassung und Eskalation an die Veranstaltungsleitung."
    }
  ],
  "portaszolgalat": [
    {
      "slug": "objektumorzes",
      "icon": "shield",
      "name": "Objektschutz vor Ort",
      "shortDesc": "Objektschutz vor Ort mit Zutrittskontrolle, Kontrollgängen, Vorfallbearbeitung, Dienstbuch und abgestimmter Eskalationsordnung."
    },
    {
      "slug": "biztonsagtechnika",
      "icon": "camera",
      "name": "Sicherheitstechnik",
      "shortDesc": "Sicherheitstechnik für Kamerasysteme, Zutrittskontrolle und Alarmprozesse, eingebettet in ein standortgerechtes Sicherheitsmodell, mit technischer Planung, die Datenschutzaspekte einbezieht."
    },
    {
      "slug": "mystery-shopping-helyszini-audit",
      "icon": "eye",
      "name": "Mystery Shopping und Serviceaudit",
      "shortDesc": "Mystery Shopping und Serviceaudit in realen Kunden- und Betriebssituationen, mit strukturierter Beobachtung, Berichtswesen und Verbesserungsempfehlungen."
    },
    {
      "slug": "soft-fm",
      "icon": "leaf",
      "name": "Soft FM",
      "shortDesc": "Soft FM für Reinigung, Grünpflege, Hygiene, Unterstützung bei der Abfallentsorgung und Dienstleistersteuerung, mit vereinbartem Leistungsumfang, Qualitätskontrolle und schriftlichem Berichtswesen."
    }
  ],
  "mystery-shopping-helyszini-audit": [
    {
      "slug": "portaszolgalat",
      "icon": "desk",
      "name": "Empfangs- und Pförtnerdienst",
      "shortDesc": "Empfangs- und Pförtnerdienst für Besucher, Lieferanten, Mitarbeiter, Schlüssel, Pakete, Protokollierung und abgestimmte Eskalation."
    },
    {
      "slug": "soft-fm",
      "icon": "leaf",
      "name": "Soft FM",
      "shortDesc": "Soft FM für Reinigung, Grünpflege, Hygiene, Unterstützung bei der Abfallentsorgung und Dienstleistersteuerung, mit vereinbartem Leistungsumfang, Qualitätskontrolle und schriftlichem Berichtswesen."
    },
    {
      "slug": "rendezvenybiztositas",
      "icon": "shield",
      "name": "Veranstaltungssicherheit",
      "shortDesc": "Veranstaltungssicherheit für Firmen-, geschlossene und öffentliche Veranstaltungen, mit Zutrittskontrolle, Unterstützung der Besucherströme, Zonenmanagement, Vorfallerfassung und Eskalation an die Veranstaltungsleitung."
    },
    {
      "slug": "objektumorzes",
      "icon": "shield",
      "name": "Objektschutz vor Ort",
      "shortDesc": "Objektschutz vor Ort mit Zutrittskontrolle, Kontrollgängen, Vorfallbearbeitung, Dienstbuch und abgestimmter Eskalationsordnung."
    }
  ],
  "rendezvenybiztositas": [
    {
      "slug": "objektumorzes",
      "icon": "shield",
      "name": "Objektschutz vor Ort",
      "shortDesc": "Objektschutz vor Ort mit Zutrittskontrolle, Kontrollgängen, Vorfallbearbeitung, Dienstbuch und abgestimmter Eskalationsordnung."
    },
    {
      "slug": "portaszolgalat",
      "icon": "desk",
      "name": "Empfangs- und Pförtnerdienst",
      "shortDesc": "Empfangs- und Pförtnerdienst für Besucher, Lieferanten, Mitarbeiter, Schlüssel, Pakete, Protokollierung und abgestimmte Eskalation."
    },
    {
      "slug": "mystery-shopping-helyszini-audit",
      "icon": "eye",
      "name": "Mystery Shopping und Serviceaudit",
      "shortDesc": "Mystery Shopping und Serviceaudit in realen Kunden- und Betriebssituationen, mit strukturierter Beobachtung, Berichtswesen und Verbesserungsempfehlungen."
    },
    {
      "slug": "biztonsagtechnika",
      "icon": "camera",
      "name": "Sicherheitstechnik",
      "shortDesc": "Sicherheitstechnik für Kamerasysteme, Zutrittskontrolle und Alarmprozesse, eingebettet in ein standortgerechtes Sicherheitsmodell, mit technischer Planung, die Datenschutzaspekte einbezieht."
    }
  ],
  "biztonsagtechnika": [
    {
      "slug": "tavfelugyelet-vonuloszolgalat",
      "icon": "radar",
      "name": "Fernüberwachung und Interventionsdienst",
      "shortDesc": "Fernüberwachung und Interventionsdienst mit Alarmempfang, Alarmverifikation, Eskalation, Ereignisprotokollierung und abgestimmtem Reaktionsprozess."
    },
    {
      "slug": "objektumorzes",
      "icon": "shield",
      "name": "Objektschutz vor Ort",
      "shortDesc": "Objektschutz vor Ort mit Zutrittskontrolle, Kontrollgängen, Vorfallbearbeitung, Dienstbuch und abgestimmter Eskalationsordnung."
    },
    {
      "slug": "portaszolgalat",
      "icon": "desk",
      "name": "Empfangs- und Pförtnerdienst",
      "shortDesc": "Empfangs- und Pförtnerdienst für Besucher, Lieferanten, Mitarbeiter, Schlüssel, Pakete, Protokollierung und abgestimmte Eskalation."
    },
    {
      "slug": "hard-fm",
      "icon": "gear",
      "name": "Hard FM",
      "shortDesc": "Hard FM mit geplanter vorbeugender Instandhaltung, reaktiver Störungsbearbeitung, Koordination von Fachfirmen, dokumentiertem Störungsprotokoll und betrieblichem Berichtswesen."
    }
  ],
  "tavfelugyelet-vonuloszolgalat": [
    {
      "slug": "biztonsagtechnika",
      "icon": "camera",
      "name": "Sicherheitstechnik",
      "shortDesc": "Sicherheitstechnik für Kamerasysteme, Zutrittskontrolle und Alarmprozesse, eingebettet in ein standortgerechtes Sicherheitsmodell, mit technischer Planung, die Datenschutzaspekte einbezieht."
    },
    {
      "slug": "objektumorzes",
      "icon": "shield",
      "name": "Objektschutz vor Ort",
      "shortDesc": "Objektschutz vor Ort mit Zutrittskontrolle, Kontrollgängen, Vorfallbearbeitung, Dienstbuch und abgestimmter Eskalationsordnung."
    },
    {
      "slug": "portaszolgalat",
      "icon": "desk",
      "name": "Empfangs- und Pförtnerdienst",
      "shortDesc": "Empfangs- und Pförtnerdienst für Besucher, Lieferanten, Mitarbeiter, Schlüssel, Pakete, Protokollierung und abgestimmte Eskalation."
    },
    {
      "slug": "hard-fm",
      "icon": "gear",
      "name": "Hard FM",
      "shortDesc": "Hard FM mit geplanter vorbeugender Instandhaltung, reaktiver Störungsbearbeitung, Koordination von Fachfirmen, dokumentiertem Störungsprotokoll und betrieblichem Berichtswesen."
    }
  ],
  "hard-fm": [
    {
      "slug": "soft-fm",
      "icon": "leaf",
      "name": "Soft FM",
      "shortDesc": "Soft FM für Reinigung, Grünpflege, Hygiene, Unterstützung bei der Abfallentsorgung und Dienstleistersteuerung, mit vereinbartem Leistungsumfang, Qualitätskontrolle und schriftlichem Berichtswesen."
    },
    {
      "slug": "biztonsagtechnika",
      "icon": "camera",
      "name": "Sicherheitstechnik",
      "shortDesc": "Sicherheitstechnik für Kamerasysteme, Zutrittskontrolle und Alarmprozesse, eingebettet in ein standortgerechtes Sicherheitsmodell, mit technischer Planung, die Datenschutzaspekte einbezieht."
    },
    {
      "slug": "tavfelugyelet-vonuloszolgalat",
      "icon": "radar",
      "name": "Fernüberwachung und Interventionsdienst",
      "shortDesc": "Fernüberwachung und Interventionsdienst mit Alarmempfang, Alarmverifikation, Eskalation, Ereignisprotokollierung und abgestimmtem Reaktionsprozess."
    },
    {
      "slug": "objektumorzes",
      "icon": "shield",
      "name": "Objektschutz vor Ort",
      "shortDesc": "Objektschutz vor Ort mit Zutrittskontrolle, Kontrollgängen, Vorfallbearbeitung, Dienstbuch und abgestimmter Eskalationsordnung."
    }
  ],
  "soft-fm": [
    {
      "slug": "hard-fm",
      "icon": "gear",
      "name": "Hard FM",
      "shortDesc": "Hard FM mit geplanter vorbeugender Instandhaltung, reaktiver Störungsbearbeitung, Koordination von Fachfirmen, dokumentiertem Störungsprotokoll und betrieblichem Berichtswesen."
    },
    {
      "slug": "portaszolgalat",
      "icon": "desk",
      "name": "Empfangs- und Pförtnerdienst",
      "shortDesc": "Empfangs- und Pförtnerdienst für Besucher, Lieferanten, Mitarbeiter, Schlüssel, Pakete, Protokollierung und abgestimmte Eskalation."
    },
    {
      "slug": "mystery-shopping-helyszini-audit",
      "icon": "eye",
      "name": "Mystery Shopping und Serviceaudit",
      "shortDesc": "Mystery Shopping und Serviceaudit in realen Kunden- und Betriebssituationen, mit strukturierter Beobachtung, Berichtswesen und Verbesserungsempfehlungen."
    },
    {
      "slug": "objektumorzes",
      "icon": "shield",
      "name": "Objektschutz vor Ort",
      "shortDesc": "Objektschutz vor Ort mit Zutrittskontrolle, Kontrollgängen, Vorfallbearbeitung, Dienstbuch und abgestimmter Eskalationsordnung."
    },
    {
      "slug": "rendezvenybiztositas",
      "icon": "shield",
      "name": "Veranstaltungssicherheit",
      "shortDesc": "Veranstaltungssicherheit für Firmen-, geschlossene und öffentliche Veranstaltungen, mit Zutrittskontrolle, Unterstützung der Besucherströme, Zonenmanagement, Vorfallerfassung und Eskalation an die Veranstaltungsleitung."
    }
  ]
} as const satisfies Record<
  DeReviewServiceSlug,
  readonly LocalizedServiceRow[]
>;

export const DE_REVIEW_LEGAL_REVIEW_REQUIRED_ROWS = [
  {
    "service": "objektumorzes",
    "key": "objektumorzes:PILOT_HU.longDesc.body.2",
    "section": "body.3",
    "preview": "Die Präsenz des Sicherheitspersonals richtet sich nach dem Risikoprofil des Standorts und dem vertraglichen Bedarf: Es kann ein unbewaffneter oder — bei Erfüllu..."
  },
  {
    "service": "objektumorzes",
    "key": "objektumorzes:PILOT_HU.processSteps.4.body",
    "section": "processSteps.4.body",
    "preview": "Die unbewaffnete oder bewaffnete Präsenz des Sicherheitspersonals organisieren wir auf Grundlage des vertraglichen Bedarfs, der rechtlichen Voraussetzungen und ..."
  },
  {
    "service": "objektumorzes",
    "key": "objektumorzes:PILOT_HU.trustItems.5.body",
    "section": "trustItems.5.body",
    "preview": "Avenir erbringt die Leistung nach dem anwendbaren ungarischen Regulierungsrahmen für Personen- und Vermögensschutz; die Genehmigungsdokumentation kann im Rahmen..."
  },
  {
    "service": "objektumorzes",
    "key": "objektumorzes:PILOT_HU.faq.5.a",
    "section": "faq.5.a",
    "preview": "Abhängig vom Risikoprofil des Standorts, dem vertraglichen Bedarf und der Erfüllung der rechtlichen Voraussetzungen kann eine unbewaffnete oder bewaffnete Präse..."
  },
  {
    "service": "objektumorzes",
    "key": "objektumorzes:PILOT_HU.faq.6.a",
    "section": "faq.6.a",
    "preview": "Ja. Der Objektschutz vor Ort erfolgt nach dem anwendbaren ungarischen Regulierungsrahmen für Personen- und Vermögensschutz. Informationen zur Genehmigung und zu..."
  },
  {
    "service": "portaszolgalat",
    "key": "portaszolgalat:PILOT_HU.longDesc.body.1",
    "section": "body.2",
    "preview": "Auf Grundlage einer Begehung vor Ort legt Avenir das Pförtner- und Empfangsprotokoll fest: wer mit welcher Berechtigung und mit welcher Dokumentation Zutritt er..."
  },
  {
    "service": "portaszolgalat",
    "key": "portaszolgalat:PILOT_HU.trustItems.4.body",
    "section": "trustItems.4.body",
    "preview": "Bei der Verarbeitung von Besucher- und Zutrittsdaten sind die Zweckbindung, die Information der Betroffenen und die zeitlich begrenzte Aufbewahrung zu berücksic..."
  },
  {
    "service": "portaszolgalat",
    "key": "portaszolgalat:PILOT_HU.faq.6.a",
    "section": "faq.6.a",
    "preview": "Bei der Verarbeitung von Besucherdaten sind die Zweckbindung, die zeitlich begrenzte Aufbewahrung, die Information der Besucher, der Zutrittskontext und die sta..."
  },
  {
    "service": "mystery-shopping-helyszini-audit",
    "key": "mystery-shopping-helyszini-audit:PILOT_HU.trustItems.4.body",
    "section": "trustItems.4.body",
    "preview": "Die Berichterstattung beschränkt sich auf den vereinbarten Prüfumfang und den festgelegten Überprüfungsprozess des Auftraggebers. Angaben zu einzelnen Mitarbeit..."
  },
  {
    "service": "mystery-shopping-helyszini-audit",
    "key": "mystery-shopping-helyszini-audit:PILOT_HU.faq.1.a",
    "section": "faq.1.a",
    "preview": "Der Prüfumfang wird vor der Durchführung festgelegt. Avenir definiert vorab das Ziel, das Szenario, die Prüfkriterien, die Berichtsform und die zulässigen Beoba..."
  },
  {
    "service": "mystery-shopping-helyszini-audit",
    "key": "mystery-shopping-helyszini-audit:PILOT_HU.faq.4.a",
    "section": "faq.4.a",
    "preview": "Der Bericht ist standardmäßig prozess- und servicequalitätsorientiert. Eine namentliche oder personenbezogene Darstellung kann nur innerhalb vorab vereinbarter ..."
  },
  {
    "service": "mystery-shopping-helyszini-audit",
    "key": "mystery-shopping-helyszini-audit:PILOT_HU.faq.7.a",
    "section": "faq.7.a",
    "preview": "Mystery Shopping und Serviceaudit messen Servicequalität, Prozesstreue, Customer Journey und vereinbarte Compliance-Punkte auf Grundlage eines festgelegten Prüf..."
  },
  {
    "service": "biztonsagtechnika",
    "key": "biztonsagtechnika:PILOT_HU.longDesc.body.2",
    "section": "body.3",
    "preview": "Avenir bezieht bei der sicherheitstechnischen Bestandsaufnahme und Planung auch die Datenschutzaspekte ein: Der dokumentierte Zweck, der verhältnismäßige Erfass..."
  },
  {
    "service": "biztonsagtechnika",
    "key": "biztonsagtechnika:PILOT_HU.trustItems.1.body",
    "section": "trustItems.1.body",
    "preview": "Die Leistung wird im Einklang mit der sicherheitstechnischen Genehmigung und den vertraglichen Anforderungen des Standorts gestaltet."
  },
  {
    "service": "biztonsagtechnika",
    "key": "biztonsagtechnika:PILOT_HU.trustItems.4.body",
    "section": "trustItems.4.body",
    "preview": "Die Abdeckung der Kamerabilder, der Erfassungsbereich, die Zugriffsberechtigungen, die Information der Betroffenen und die Speicherlogik sind als Teil der siche..."
  },
  {
    "service": "biztonsagtechnika",
    "key": "biztonsagtechnika:PILOT_HU.faq.7.a",
    "section": "faq.7.a",
    "preview": "Ja. Bei der Planung eines Kamerasystems sind die Zweckbindung, die Information der Betroffenen, die Dokumentation des berechtigten Interesses, der Erfassungsber..."
  },
  {
    "service": "biztonsagtechnika",
    "key": "biztonsagtechnika:PILOT_HU.faq.8.a",
    "section": "faq.8.a",
    "preview": "Die Speicherdauer wird vom Zweck der Aufzeichnung, vom Risikoprofil des Standorts, vom Bedarf der Vorfallbearbeitung, von internen Richtlinien und vom Datenschu..."
  },
  {
    "service": "biztonsagtechnika",
    "key": "biztonsagtechnika:DE_ONLY.faq.9.q",
    "section": "faq.9.q",
    "preview": "Wer führt die Interessenabwägung für eine Videoüberwachung durch?"
  },
  {
    "service": "biztonsagtechnika",
    "key": "biztonsagtechnika:DE_ONLY.faq.9.a",
    "section": "faq.9.a",
    "preview": "Die Interessenabwägung — etwa zur Stützung eines berechtigten Interesses nach der DSGVO — ist Teil des Datenschutzrahmens des Kunden als Verantwortlichem. Aveni..."
  },
  {
    "service": "biztonsagtechnika",
    "key": "biztonsagtechnika:DE_ONLY.faq.10.q",
    "section": "faq.10.q",
    "preview": "Wie lange dürfen Kameraaufnahmen gespeichert werden?"
  },
  {
    "service": "biztonsagtechnika",
    "key": "biztonsagtechnika:DE_ONLY.faq.10.a",
    "section": "faq.10.a",
    "preview": "Eine einheitliche, für alle Standorte gültige Speicherdauer gibt es nicht. Maßgeblich sind der dokumentierte Zweck der Aufzeichnung, das Risikoprofil des Stando..."
  },
  {
    "service": "tavfelugyelet-vonuloszolgalat",
    "key": "tavfelugyelet-vonuloszolgalat:PILOT_HU.longDesc.body.1",
    "section": "body.2",
    "preview": "Umfasst die Leistung die Meldungsbearbeitung der Fernüberwachung, ist der Verifikationsschritt Teil des Betriebsverfahrens und wird je Ereignis dokumentiert. Di..."
  },
  {
    "service": "tavfelugyelet-vonuloszolgalat",
    "key": "tavfelugyelet-vonuloszolgalat:PILOT_HU.faq.4.a",
    "section": "faq.4.a",
    "preview": "Ja. Fernüberwachung und Interventionsdienst erfolgen nach dem anwendbaren ungarischen Regulierungsrahmen für Personen- und Vermögensschutz. Informationen zur Ge..."
  },
  {
    "service": "tavfelugyelet-vonuloszolgalat",
    "key": "tavfelugyelet-vonuloszolgalat:PILOT_HU.faq.10.a",
    "section": "faq.10.a",
    "preview": "Die in der Fernüberwachung genutzten Meldungen, Kamerabilder und Zutrittsereignisse dürfen ausschließlich zum vereinbarten Fernüberwachungszweck und im Datensch..."
  }
] as const;

export function isDeReviewServiceSlug(slug: string): slug is DeReviewServiceSlug {
  return (DE_REVIEW_SERVICE_SLUGS as readonly string[]).includes(slug);
}

export function isDeReviewServicePath(locale: string, slug: string): boolean {
  return locale === "de" && isDeReviewServiceSlug(slug);
}

export function getDeReviewServiceDetailBySlug(
  slug: string,
): DeReviewServiceDetail | null {
  if (!isDeReviewServiceSlug(slug)) return null;
  return DE_REVIEW_SERVICE_DETAILS[slug];
}

export function getDeReviewRelatedServicesForServiceSlug(
  slug: string,
): readonly LocalizedServiceRow[] {
  if (!isDeReviewServiceSlug(slug)) return [];
  return DE_REVIEW_RELATED_SERVICES_BY_SOURCE_SLUG[slug];
}

export function getDeReviewRelatedServicesBySlugs(
  slugs: readonly string[],
): readonly LocalizedServiceRow[] {
  const rows: LocalizedServiceRow[] = [];
  for (const slug of slugs) {
    if (!isDeReviewServiceSlug(slug)) continue;
    const detail = DE_REVIEW_SERVICE_DETAILS[slug];
    rows.push({
      slug,
      icon: detail.icon,
      name: detail.name,
      shortDesc: detail.shortDesc,
    });
  }
  return rows;
}

export function getDeReviewServiceDetailSharedCopy() {
  return {
    serviceDetail: DE_REVIEW_SERVICE_DETAIL_SHARED_COPY,
    serviceQuote: DE_REVIEW_SERVICE_QUOTE_COPY,
  } as const;
}
