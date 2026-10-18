import type { LocalizedServiceDetail, LocalizedServiceRow } from "@/lib/db/queries/services";
import { DE_REVIEW_SERVICE_SLUGS, getDeReviewServiceDetailBySlug } from "./de-service-details";
import { fr } from "../i18n/fr";

// French review drafts translated from the existing approved HU pilot service
// content, using the complete DE review package as the field/section inventory.
// No new services, claims, proof metadata or indexing eligibility are introduced.
// Native-language and legal review remain required before publication approval.
export const FR_REVIEW_SERVICE_SLUGS = DE_REVIEW_SERVICE_SLUGS;
export type FrReviewServiceSlug = (typeof FR_REVIEW_SERVICE_SLUGS)[number];
export const FR_REVIEW_SERVICE_PATHS = FR_REVIEW_SERVICE_SLUGS.map((slug) => ({ locale: "fr" as const, slug }));

type TranslatedFields = Pick<LocalizedServiceDetail, "name" | "shortDesc" | "longDesc" | "seoTitle" | "seoDescription" | "valueProposition" | "highlights" | "useCases" | "includedItems" | "processSteps" | "trustItems" | "faq">;
export type FrReviewServiceDetail = LocalizedServiceDetail & {
  readonly translationReviewRequired: true;
  readonly legalReviewRequired: boolean;
  readonly legalReviewRequiredKeys: readonly string[];
};

const FIRST_CONTACT = "Nous examinons votre demande et vous recontactons aux coordonnées indiquées au plus tard le jour ouvré suivant. Le délai de préparation du devis dépend du site et de la complexité de la demande.";
const ISO_SYSTEMS = "Les processus de service s’appuient sur les systèmes de management d’Avenir certifiés ISO 9001 et ISO 27001, lorsque les processus concernés relèvent du périmètre certifié.";

const DETAILS: Record<FrReviewServiceSlug, TranslatedFields> = {
  objektumorzes: {
    name: "Gardiennage sur site",
    shortDesc: "Gardiennage avec contrôle des accès, rondes, gestion des incidents et rapports. Des protocoles propres aux sites professionnels.",
    seoTitle: "Gardiennage sur site pour les entreprises | Avenir",
    seoDescription: "Gardiennage avec contrôle des accès, rondes, gestion des incidents et rapports. Des protocoles propres aux sites professionnels.",
    valueProposition: "Nous contribuons à la sécurité des établissements, bureaux et sites logistiques ou industriels grâce à un gardiennage adapté : contrôle des entrées et sorties, rondes, gestion des incidents, journal de service et remontée des alertes selon les procédures convenues.",
    longDesc: "Le gardiennage ne se limite pas à une présence humaine : il vise à établir une organisation de sécurité adaptée au site. À partir d’une visite sur place, Avenir rédige les consignes de service : points d’entrée et de sortie, accueil des visiteurs et fournisseurs, itinéraires des rondes, gestion des clés, documentation des incidents et procédure de remontée des alertes.\n\nLe service peut être coordonné avec les caméras, le contrôle des accès ou le dispositif d’alarme existants. L’objectif est de proposer une exploitation traçable, avec journal de service, rapports d’incident, échanges réguliers et interlocuteur responsable désigné.\n\nLa présence des agents dépend du profil de risque du site et des besoins contractuels : un service non armé ou, lorsque les conditions légales sont réunies, armé peut être organisé. Avenir intervient selon le cadre réglementaire hongrois applicable à la protection des personnes et des biens.",
    highlights: [],
    useCases: ["Centres logistiques, entrepôts et sites avec accès poids lourds", "Sites industriels et de production", "Immeubles de bureaux et centres d’affaires", "Commerces et centres commerciaux", "Chantiers, sites temporaires ou présentant des risques accrus"],
    includedItems: ["Application des règles d’entrée et de sortie", "Gestion des visiteurs, fournisseurs et clés", "Rondes, points de contrôle et inspections du site", "Enregistrement des incidents et remontée des alertes", "Journal de service et rapports convenus", "Visite de sécurité sur site et proposition de protocole", "Coordination avec les caméras, le contrôle des accès ou les alarmes existants, selon les besoins du site"],
    processSteps: [
      { title: "Premier échange et analyse du besoin", body: FIRST_CONTACT },
      { title: "Visite sur site et examen des points de risque", body: "Nous convenons ensemble de la date de la visite sur site et de l’examen initial des risques lors du premier échange." },
      { title: "Définition des accès, des rondes et des alertes", body: "Nous définissons les points d’accès, le parcours des visiteurs et fournisseurs, les itinéraires des rondes et la procédure de signalement des incidents." },
      { title: "Consignes de service et processus de rapport", body: "Nous précisons par écrit les éléments à documenter, la fréquence des rapports et les personnes à prévenir en cas d’écart ou d’incident." },
      { title: "Organisation de la présence des agents", body: "La présence non armée ou armée est organisée selon les besoins contractuels, les conditions légales et le profil de risque du site." },
      { title: "Suivi régulier, rapports et ajustements", body: "Nous examinons les retours du service, les événements récurrents et les rapports avec l’interlocuteur désigné." },
    ],
    trustItems: [
      { title: "Appui du dispatching 24 h/24 et 7 j/7", body: "Le gardiennage peut bénéficier de l’appui du dispatching disponible 24 h/24 et 7 j/7 ; les procédures de notification et de remontée des alertes sont définies au début de la collaboration." },
      { title: "Journal de service et suivi des événements", body: "Le journal de service, l’enregistrement des événements, les rapports convenus et la procédure de remontée des alertes facilitent le contrôle sur site." },
      { title: "Un interlocuteur responsable", body: "Un interlocuteur responsable est désigné pour les opérations courantes afin d’éviter au client de coordonner plusieurs intervenants séparément." },
      { title: "ISO 9001 et ISO 27001", body: ISO_SYSTEMS },
      { title: "Mise en place documentée", body: "Les consignes sont rédigées et validées avec l’interlocuteur responsable avant le démarrage : accès, rondes, gestion des clés, enregistrement des incidents et remontée des alertes." },
      { title: "Autorisation d’exercer les activités de sécurité", body: "Avenir intervient selon le cadre réglementaire hongrois applicable à la protection des personnes et des biens. Les documents d’autorisation peuvent être examinés lors de la préparation du contrat." },
    ],
    faq: [
      { q: "Que comprend le gardiennage ?", a: "Selon les besoins du site, il peut comprendre le contrôle des entrées et sorties, la gestion des visiteurs et fournisseurs, les rondes, la gestion des clés, l’enregistrement des incidents, un journal de service et les rapports convenus." },
      { q: "Quand une visite de sécurité sur site est-elle utile ?", a: "Elle est particulièrement utile pour un nouveau site, lors d’un changement des règles d’accès, d’une hausse des livraisons, d’incidents récurrents ou pour clarifier les processus de sécurité et les dispositifs techniques existants." },
      { q: "Quel cadre contractuel choisir pour démarrer ?", a: "Le modèle dépend de la taille et du profil de risque du site, des horaires, des accès, des rondes, de la gestion des incidents et des besoins de rapport. Ces éléments doivent être définis avant le démarrage pour adapter le service à l’exploitation réelle." },
      { q: "Comment sont contrôlés les accès des visiteurs et fournisseurs ?", a: "Les règles sont établies après la visite du site. Elles précisent qui peut entrer, à quel moment et avec quelle autorisation, ainsi que l’enregistrement des visiteurs, l’accès des fournisseurs, la gestion des livraisons et la documentation des sorties." },
      { q: "Le gardiennage peut-il être associé aux caméras ou au contrôle des accès ?", a: "Oui, lorsque cela est possible, il peut être coordonné avec les caméras, le contrôle des accès, les alarmes ou la télésurveillance existants. La présence humaine et les dispositifs techniques peuvent ainsi se compléter." },
      { q: "Un service armé est-il possible ?", a: "Selon le profil de risque du site, les besoins contractuels et le respect des conditions légales, une présence non armée ou armée peut être organisée." },
      { q: "Avenir dispose-t-elle des autorisations nécessaires ?", a: "Oui. Le gardiennage sur site est assuré conformément au cadre réglementaire hongrois applicable à la protection des personnes et des biens. Les informations sur les autorisations de l’entreprise et des agents peuvent être examinées lors de la préparation du contrat." },
      { q: "Existe-t-il un appui disponible 24 h/24 et 7 j/7 ?", a: "Oui, le gardiennage peut bénéficier de l’appui du dispatching disponible 24 h/24 et 7 j/7. Les procédures de notification et de remontée des alertes sont définies au début de la collaboration." },
      { q: "Que se passe-t-il en cas d’incident ?", a: "La gestion des incidents suit une procédure convenue qui précise les événements à enregistrer, les personnes à prévenir, l’ordre des notifications et la documentation du cas." },
      { q: "Recevons-nous un journal de service ou des rapports d’incident ?", a: "Oui, le service peut comprendre un journal de service, l’enregistrement des événements et les rapports convenus. Leur format est défini au début de la collaboration pour fournir au client des informations actualisées sur les opérations." },
    ],
  },
  portaszolgalat: {
    name: "Accueil et services de poste de garde",
    shortDesc: "Accueil et poste de garde avec contrôle des accès, gestion des visiteurs et des clés, et suivi documenté des opérations quotidiennes des sites professionnels.",
    seoTitle: "Accueil et poste de garde pour les entreprises | Avenir",
    seoDescription: "Accueil et poste de garde avec contrôle des accès, gestion des visiteurs et des clés, et suivi documenté des opérations quotidiennes des sites professionnels.",
    valueProposition: "L’accueil et le poste de garde sont le premier point où visiteurs, fournisseurs, collaborateurs et locataires rencontrent les règles du site. Avenir vise un fonctionnement ordonné, courtois, traçable et cohérent avec les exigences de sécurité.",
    longDesc: "Le poste de garde est un point de contrôle essentiel de l’exploitation quotidienne. Selon les besoins du site, il assure l’accueil et l’enregistrement des visiteurs, le contrôle des fournisseurs et sous-traitants, la gestion des clés, la réception des colis, l’information et le signalement des événements inhabituels.\n\nÀ partir d’une visite sur place, Avenir définit le protocole d’accueil : autorisations d’accès, documents à établir, notifications nécessaires et événements à consigner ou à transmettre. La limitation des finalités, des durées de conservation et l’information appropriée font partie du traitement des données des visiteurs et des accès.\n\nLe service peut être relié au gardiennage, aux dispositifs de contrôle des accès ou de vidéosurveillance, ou aux processus internes d’exploitation. Le client dispose d’un cadre clair, d’un journal de service, de rapports convenus et d’un interlocuteur responsable désigné.",
    highlights: [],
    useCases: ["Accueil d’immeubles de bureaux et de centres d’affaires", "Postes de garde et accès de sites logistiques ou industriels", "Sites accueillant des locataires, collaborateurs et visiteurs", "Sites avec fournisseurs, coursiers et livraisons", "Établissements où la première impression et un contrôle organisé des accès sont importants"],
    includedItems: ["Accueil des visiteurs et invités", "Enregistrement des visiteurs et application des règles d’accès", "Gestion des fournisseurs, coursiers et sous-traitants", "Respect des règles de gestion et de remise des clés", "Réception des colis et transmission des informations selon les procédures convenues", "Journal de service, enregistrement des événements et rapports", "Coordination avec le contrôle des accès ou les processus internes, selon les besoins du site"],
    processSteps: [
      { title: "Premier échange et besoins d’exploitation", body: FIRST_CONTACT },
      { title: "Visite et examen des flux", body: "Nous examinons les entrées, les points d’accueil et de garde, les situations d’accès, les besoins de gestion des clés et les flux réguliers de fournisseurs et de visiteurs." },
      { title: "Définition du protocole d’accueil", body: "Nous définissons le fonctionnement quotidien de l’accueil, du contrôle des accès, de la remise des clés, de la réception des colis, des notifications et de l’enregistrement des événements." },
      { title: "Consignes et règles de rapport", body: "Nous documentons les événements à consigner, les formats de rapport, les niveaux de remontée des alertes et les interlocuteurs désignés." },
      { title: "Organisation et formation du personnel", body: "Le service est organisé selon les exigences contractuelles, le protocole du site et les flux quotidiens, avec prise de poste accompagnée et coordination au démarrage." },
      { title: "Suivi et ajustements réguliers", body: "Nous examinons les retours d’exploitation, les questions récurrentes et les rapports avec l’interlocuteur responsable désigné." },
    ],
    trustItems: [
      { title: "Organisation quotidienne et traçabilité", body: "Journal de service, gestion des visiteurs, enregistrement des événements et rapports convenus facilitent le contrôle du poste de garde." },
      { title: "Un interlocuteur responsable désigné", body: "Le client échange avec un interlocuteur responsable sur l’exploitation, les rapports et les ajustements nécessaires des protocoles." },
      { title: "Appui du dispatching 24 h/24 et 7 j/7", body: "Le poste de garde peut bénéficier de cet appui ; les procédures de notification et de remontée des alertes sont définies au début de la collaboration." },
      { title: "ISO 9001 et ISO 27001", body: ISO_SYSTEMS },
      { title: "Prise en compte des données des visiteurs", body: "La finalité du traitement, l’information des personnes et la limitation de la conservation doivent être prises en compte pour les données des visiteurs et des accès." },
      { title: "Accueil et contrôle dans un même processus", body: "Les protocoles associent un accueil courtois au contrôle des accès, aux notifications et aux rapports afin que l’accueil et les routines de sécurité suivent les mêmes règles du site." },
    ],
    faq: [
      { q: "Que comprennent l’accueil et le poste de garde ?", a: "Selon le site, la prestation peut comprendre l’accueil, l’enregistrement des visiteurs, le contrôle des accès, la gestion des fournisseurs et coursiers, des clés et colis, un journal de service et des rapports convenus." },
      { q: "Quand une analyse du poste de garde est-elle utile ?", a: "Lors d’une augmentation des visiteurs ou fournisseurs, d’un changement des règles d’accès, d’un partage des locaux entre plusieurs parties, ou lorsqu’une meilleure traçabilité et des responsabilités plus claires sont nécessaires." },
      { q: "Quelle est la différence avec le gardiennage ?", a: "Le poste de garde se concentre sur les entrées, l’accueil et les flux quotidiens. Le gardiennage peut comprendre une présence de sécurité plus large, avec rondes et gestion des incidents. Les deux prestations peuvent être coordonnées." },
      { q: "Pouvez-vous gérer les fournisseurs et les coursiers ?", a: "Oui. Les règles d’accès des fournisseurs, coursiers et sous-traitants sont établies après la visite du site. Elles peuvent préciser les données à enregistrer, les personnes à prévenir et la consignation des entrées et sorties." },
      { q: "La gestion des clés est-elle incluse ?", a: "Elle peut l’être, avec application des règles de remise et de restitution et tenue des registres. Les modalités précises sont définies pour chaque site au début de la collaboration." },
      { q: "Le service peut-il être relié au contrôle des accès ?", a: "Oui, lorsque cela est possible, il peut être coordonné avec les systèmes de contrôle des accès, les caméras ou les processus internes d’exploitation existants." },
      { q: "Comment les données des visiteurs peuvent-elles être traitées ?", a: "Les règles dépendent de la finalité, de la durée limitée de conservation, de l’information des visiteurs, du contexte d’accès et des règles du site. Les catégories de données et les durées doivent être définies conformément aux exigences du client et aux règles de protection des données du site." },
      { q: "Recevons-nous des rapports d’exploitation ?", a: "Oui, le poste de garde peut être associé à un journal de service, à l’enregistrement des événements et à des rapports convenus. Le format dépend des exigences du client et du fonctionnement du site." },
    ],
  },
  "mystery-shopping-helyszini-audit": {
    name: "Visites mystères et audit de service",
    shortDesc: "Visites mystères, audits de marque, trajets tests et audits de service pour examiner l’expérience client, le respect des processus et les points de conformité convenus.",
    seoTitle: "Visites mystères et audit de service | Avenir",
    seoDescription: "Visites mystères, audits de marque, trajets tests et audits de service pour examiner l’expérience client, le respect des processus et les points de conformité convenus.",
    valueProposition: "Les visites mystères et l’audit de service révèlent l’expérience réelle du client, le respect des processus et des exigences de marque, d’information et de service, ainsi que les risques visibles pour la qualité, la réputation ou la conformité.",
    longDesc: "La visite mystère est une mesure planifiée et documentée de la qualité de service. Avec le client, Avenir définit le périmètre, le scénario et les critères d’évaluation, forme le testeur puis réalise l’observation dans une situation client réelle : achat test, transaction, visite de site, trajet test ou autre point de contact.\n\nLe périmètre précise les étapes de service et de processus, les standards de marque, les exigences de communication et d’information et les points de conformité à examiner. L’objectif est de fournir à la direction une vision précise et structurée de l’expérience réelle, et non de rechercher des erreurs pour elles-mêmes.\n\nPlusieurs méthodes sont possibles. L’audit de marque examine la présentation, les standards visuels, la propreté, l’ambiance et les standards de service. La mise en situation client teste des questions, conflits ou étapes précises. L’audit de service ou le trajet test peut couvrir un parcours complet, notamment dans le transport de voyageurs, la relation client ou les prestations sur site.\n\nAvenir rédige un rapport structuré présentant observations, tendances récurrentes, risques et recommandations d’amélioration. Les résultats sont discutés avec le client pour éclairer les décisions concernant la qualité de service, les processus et les points de contrôle convenus.",
    highlights: [],
    useCases: ["Achats tests en magasin, dans un point de service ou auprès d’un service client", "Trajets tests en taxi, transport de voyageurs ou autres services de transport", "Audit de marque : présentation, propreté, identité visuelle et standards de service", "Mises en situation client : questions, situations précises ou conflits", "Examen du parcours client et de l’expérience visiteur", "Examen de l’information, des prix, de la facturation, de la remise de reçus ou d’autres points de conformité selon le périmètre convenu", "Audits comparables de plusieurs sites, prestataires ou unités"],
    includedItems: ["Définition de l’objectif, du périmètre et des critères d’évaluation", "Conception du scénario d’achat, de trajet test ou de parcours client", "Choix de la méthode : audit de marque ou mise en situation client", "Mesure de la qualité de service en situation réelle", "Évaluation du parcours, de la communication, du respect des processus et du service", "Examen des points de conformité convenus", "Documentation des écarts, risques et pistes d’amélioration", "Rapport structuré et synthèse pour la direction"],
    processSteps: [
      { title: "Définition de l’objectif et du périmètre", body: "Nous précisons la question commerciale, de qualité de service ou de conformité à laquelle l’audit doit répondre et les processus concernés." },
      { title: "Critères et scénario", body: "Nous définissons les points de mesure, les standards de marque, les exigences de communication et d’information, et le scénario d’achat, de trajet test ou de parcours client." },
      { title: "Réalisation de l’audit ou du test", body: "L’audit de marque, la mise en situation, l’achat ou le trajet test se déroule en situation réelle, selon le périmètre approuvé, pour mesurer le processus, l’expérience et les points de conformité prédéfinis." },
      { title: "Documentation des observations et des écarts", body: "Nous enregistrons de façon structurée le déroulement du parcours, les éléments conformes aux attentes, les écarts, les risques et les possibilités d’amélioration." },
      { title: "Rapport, synthèse et recommandations", body: "Nous réunissons les résultats dans un rapport lisible par la direction, pouvant comprendre des observations sur les points de conformité, les tendances récurrentes et des recommandations concrètes." },
      { title: "Restitution et prochaines étapes", body: "Les résultats sont discutés avec le client afin qu’il puisse décider d’ajuster les protocoles, les formations, les standards de marque ou les mesures futures." },
    ],
    trustItems: [
      { title: "Périmètre défini avant l’intervention", body: "Objectif, scénario, critères et format du rapport sont convenus avant le test pour maintenir les observations dans le périmètre de qualité de service défini." },
      { title: "Observation neutre du parcours client", body: "L’examen observe les étapes de service, exigences de marque et points du parcours convenus en situation réelle, sans finalité de surveillance ni cadre disciplinaire." },
      { title: "Rapport structuré et échange avec le client", body: "Avenir présente les observations, tendances récurrentes, risques et recommandations dans un rapport discuté avec le client pour soutenir ses décisions sur la qualité de service." },
      { title: "Comparaison entre plusieurs sites", body: "Un même scénario peut être répété sur plusieurs sites ou auprès de plusieurs prestataires afin de comparer la cohérence du service, les écarts de processus et les points d’amélioration récurrents." },
      { title: "Rapports confidentiels à finalité définie", body: "Les rapports sont limités au périmètre convenu et au processus d’examen défini par le client. Les informations sur des collaborateurs individuels ne sont pas incluses par défaut ; elles nécessitent un cadre de protection des données convenu au préalable." },
    ],
    faq: [
      { q: "Que comprennent les visites mystères et l’audit de service ?", a: "Ils comprennent la définition de l’objectif, du périmètre et des critères, la conception du scénario d’achat ou de parcours, l’observation en situation réelle et la rédaction d’un rapport structuré." },
      { q: "Comment le périmètre est-il défini et respecté ?", a: "Avenir définit avant l’intervention l’objectif, le scénario, les critères, le format du rapport et les points d’observation autorisés. Les constats portent sur les critères de service et les objectifs d’amélioration convenus ; ils ne constituent ni des conclusions juridiques ni des preuves disciplinaires." },
      { q: "Quels aspects peuvent être examinés ?", a: "L’audit peut couvrir la marque, les mises en situation, les étapes du parcours, les critères de qualité, les points de conformité convenus et la cohérence entre sites. La communication, l’information, le service, la facturation ou la remise de reçus peuvent être examinés s’ils relèvent du périmètre convenu." },
      { q: "Un rapport est-il fourni ?", a: "Oui. Avenir rédige un rapport structuré sur le processus observé, les écarts, les tendances récurrentes, les risques et les recommandations, selon le périmètre convenu." },
      { q: "Les collaborateurs sont-ils nommés dans le rapport ?", a: "Par défaut, le rapport porte sur les processus et la qualité de service. Toute présentation nominative ou contenant des données personnelles exige un cadre convenu à l’avance et le respect des exigences applicables de protection des données." },
      { q: "Le même scénario peut-il être répété sur plusieurs sites ?", a: "Oui. Un scénario et des critères communs permettent de comparer des sites, prestataires, unités ou périodes pour identifier les écarts, les tendances récurrentes et les priorités d’amélioration." },
      { q: "La méthode convient-elle aux transports et aux parcours de service ?", a: "Oui. Un trajet test ou un parcours de service peut examiner l’information, le service, la facturation ou la remise de reçus, les protocoles de comportement et les critères de service ou de conformité prédéfinis." },
      { q: "Quelle est la différence avec une enquête privée ?", a: "Les visites mystères et l’audit de service mesurent la qualité, le respect des processus, le parcours client et les points de conformité convenus selon un périmètre défini. Il ne s’agit ni d’une enquête privée, ni d’une observation illimitée, ni d’une collecte de preuves, ni d’un processus disciplinaire automatique." },
    ],
  },
  rendezvenybiztositas: {
    name: "Sécurité événementielle",
    shortDesc: "Sécurité des événements : contrôle des accès, accompagnement des flux, gestion des zones, signalement des incidents et coordination avec l’organisateur.",
    seoTitle: "Sécurité événementielle | Avenir",
    seoDescription: "Sécurité des événements : contrôle des accès, accompagnement des flux, gestion des zones, signalement des incidents et coordination avec l’organisateur.",
    valueProposition: "La sécurité événementielle coordonne les accès, les flux d’invités et de visiteurs, les zones, la prévention des conflits et la gestion des incidents lors d’événements d’entreprise, privés ou ouverts au public.",
    longDesc: "La sécurité événementielle couvre les événements d’entreprise, privés et publics. Selon l’événement, Avenir soutient le contrôle des accès, la circulation des invités ou visiteurs, la gestion des espaces fermés et des zones, la surveillance des abords, la prévention des conflits, l’enregistrement des incidents et la remontée des alertes définie par l’organisateur.\n\nLes événements d’entreprise ou privés peuvent comprendre conférences, rencontres professionnelles, expositions, présentations de produits et zones VIP, coulisses ou autres espaces réservés. Pour les événements publics, festivals, concerts, manifestations sportives ou culturelles, l’accent porte sur la coordination des flux, des accès multiples, des zones et de la chaîne de contact avec l’organisateur.\n\nL’objectif est un cadre de sécurité transparent pendant l’événement, sans garantie générale couvrant toutes les situations : contrôle des accès, orientation des flux, présence préventive, enregistrement des incidents, procédure d’alerte et retour en fin d’événement.",
    highlights: [],
    useCases: ["Événements d’entreprise, conférences et rencontres professionnelles", "Événements privés, présentations de produits et expositions", "Festivals et événements culturels en plein air", "Concerts et événements publics en intérieur", "Manifestations et compétitions sportives", "Événements comportant des zones VIP, coulisses, espaces fermés ou protégés", "Événements avec plusieurs accès, flux de visiteurs ou besoins de coordination", "Événements nécessitant un enregistrement des incidents et une procédure d’alerte"],
    includedItems: ["Contrôle et gestion des points d’accès", "Accompagnement des flux d’invités et de visiteurs", "Gestion des zones, abords et espaces fermés", "Gestion des zones VIP, coulisses ou espaces protégés selon l’événement", "Prévention des conflits et remontée des incidents", "Enregistrement des incidents et rapport de sécurité", "Gestion des accès multiples pour les événements publics ou de plus grande ampleur", "Contact avec les responsables et niveaux d’alerte désignés par l’organisateur"],
    processSteps: [
      { title: "Périmètre et besoins du site", body: "Nous recueillons le type et la durée de l’événement, les flux prévus, les caractéristiques du lieu, les zones et les attentes de l’organisateur." },
      { title: "Accès, zones et contacts", body: "Nous examinons les accès, les espaces fermés ou protégés, les sens de circulation, les abords et la chaîne de contact de l’organisateur." },
      { title: "Effectifs et procédure d’alerte", body: "La présence de sécurité, les points d’autorisation, la chaîne de contact et le signalement des incidents sont définis selon le périmètre de l’événement et le cadre contractuel." },
      { title: "Soutien pendant l’événement", body: "Les agents appliquent les dispositions convenues pour les accès, les zones, les flux d’invités ou de visiteurs et le signalement des incidents." },
      { title: "Documentation des événements et interventions", body: "Les événements pertinents, écarts et interventions sont enregistrés selon le périmètre documentaire convenu avec le client." },
      { title: "Bilan et propositions d’amélioration", body: "Après l’événement, il est possible de résumer les points satisfaisants, les écarts et les ajustements utiles à l’organisation d’un prochain événement." },
    ],
    trustItems: [
      { title: "Dispositif adapté à l’événement", body: "La présence de sécurité, les accès, les zones, les flux et les circuits d’alerte dépendent du type d’événement et du périmètre convenu." },
      { title: "Gestion des flux et des accès", body: "Le contrôle des accès, la circulation des invités ou visiteurs et les accès multiples suivent la configuration du lieu, l’affluence attendue et les règles de l’organisateur." },
      { title: "Gestion des zones et espaces réservés", body: "Les zones VIP, coulisses, espaces fermés, protégés et abords sont gérés selon le dispositif de sécurité et les règles d’accès convenus." },
      { title: "Signalement à l’organisateur", body: "Incidents, écarts et besoins de remontée d’alerte sont enregistrés et traités selon la chaîne de contact définie par l’organisateur." },
      { title: "Un contact sécurité responsable", body: "L’organisateur dispose d’un contact sécurité désigné pour la coordination, les rapports et les communications le jour de l’événement." },
      { title: "Bilan et améliorations", body: "Après l’événement, Avenir peut aider à analyser les incidents, problèmes récurrents et points d’amélioration pour les prochaines organisations." },
    ],
    faq: [
      { q: "Quelle est la différence avec le gardiennage ?", a: "Le gardiennage correspond généralement à une exploitation continue ou de longue durée. La sécurité événementielle est temporaire et adaptée à l’événement, avec une attention particulière aux flux, accès, zones, contacts organisateur et incidents." },
      { q: "Le service convient-il aux festivals, concerts et événements sportifs ?", a: "Oui. Il peut être organisé pour des événements d’entreprise, privés ou publics, notamment festivals, concerts, manifestations sportives et culturelles. Le périmètre dépend du type d’événement, des flux, des accès, des zones, des contacts et des besoins de documentation des incidents." },
      { q: "Pouvez-vous gérer les zones VIP ou les coulisses ?", a: "Oui, si le périmètre le prévoit. Le service peut couvrir les zones VIP, coulisses, espaces fermés ou protégés. Les autorisations et règles d’accès doivent être définies à l’avance." },
      { q: "Garantissez-vous un événement sans conflit ?", a: "L’absence de conflit ne peut pas être garantie. Le service vise à réduire les risques, assurer une présence sur place, appliquer une procédure d’alerte convenue et permettre une coordination rapide avec l’organisateur." },
      { q: "Pourquoi le contact avec l’organisateur est-il important ?", a: "Des interlocuteurs désignés côté organisation et sécurité facilitent la coordination des incidents, questions d’accès, problèmes de zone et situations liées aux flux de visiteurs." },
      { q: "Un rapport final est-il fourni ?", a: "La prestation peut inclure un bilan ou un rapport reprenant les événements importants, écarts, incidents et propositions d’amélioration. Son niveau de détail doit être fixé au début de la collaboration." },
      { q: "Quand une visite préparatoire est-elle utile ?", a: "Elle est particulièrement utile en présence d’accès multiples, de zones VIP ou fermées, de flux importants, de livraisons externes, d’une configuration inhabituelle, d’activités plus risquées ou d’importants besoins de coordination." },
      { q: "Le service peut-il être associé à des systèmes techniques ?", a: "Oui, si le site le permet, il peut être coordonné avec le contrôle des accès, les caméras, la gestion des zones ou d’autres processus de sécurité. Le fonctionnement précis dépend du lieu et du périmètre de l’événement." },
    ],
  },
  biztonsagtechnika: {
    name: "Technologies de sécurité",
    shortDesc: "Caméras, contrôle des accès, détection d’intrusion et gestion des alarmes, coordonnés avec le gardiennage et le poste de garde.",
    seoTitle: "Technologies de sécurité pour les sites professionnels | Avenir",
    seoDescription: "Caméras, contrôle des accès, détection d’intrusion et gestion des alarmes, coordonnés avec le gardiennage et le poste de garde.",
    valueProposition: "Les technologies de sécurité relient caméras, contrôle des accès et alarmes dans un dispositif adapté au site, avec finalité documentée, couverture proportionnée, remontée des alertes et intégration à l’exploitation.",
    longDesc: "Les technologies de sécurité apportent un soutien technique utilisable au quotidien à la présence humaine. Elles peuvent couvrir les caméras, le contrôle des accès, la détection d’intrusion, les alarmes, la transmission des signaux et la documentation des événements.\n\nAvenir ne traite pas ce dispositif comme un simple achat d’équipements. La visite du site permet d’examiner les accès, zones peu contrôlées, événements récurrents, espaces critiques et processus où la technique peut soutenir le gardiennage, l’accueil ou la télésurveillance.\n\nL’état des lieux et la conception prennent en compte la protection des données : finalité documentée, champ de captation proportionné, droits d’accès, information des personnes et règles de conservation sont adaptés à l’exploitation et au cadre de protection des données du client. Ce travail soutient l’examen du client ; le choix de la base légale et les décisions finales restent de sa responsabilité et de celle de ses conseillers.\n\nL’objectif est un dispositif transparent, maintenable et utilisable dans l’exploitation quotidienne, qui soutient la détection, les alertes, le contrôle des accès, les rapports et les décisions, au-delà du seul enregistrement.",
    highlights: [],
    useCases: ["Accès d’immeubles de bureaux et de centres d’affaires", "Zones couvertes par les caméras et alarmes des sites industriels et logistiques", "Entrepôts, accès poids lourds et points d’entrée critiques", "Sites souhaitant compléter le gardiennage par des moyens techniques", "Examen de caméras, contrôles d’accès ou processus d’alarme existants"],
    includedItems: ["État des lieux des caméras et points de surveillance", "Examen des accès et des processus d’autorisation", "Examen de la détection d’intrusion et des alarmes", "Coordination avec le gardiennage et le poste de garde", "Organisation du traitement des signaux et de la remontée des alertes", "Visite de sécurité sur site et proposition technique", "Enregistrement des événements et soutien aux rapports"],
    processSteps: [
      { title: "Visite technique de sécurité", body: "Nous examinons les accès du site, la couverture des caméras, les alarmes et le fonctionnement du gardiennage ou du poste de garde associé." },
      { title: "Identification des points critiques et zones à risque", body: "Nous identifions les zones où les déplacements, autorisations, livraisons ou événements récurrents nécessitent un soutien technique." },
      { title: "Examen des caméras, accès et alarmes", body: "Nous examinons comment le système existant ou envisagé soutient la détection, le contrôle des accès, les alertes et la gestion des événements." },
      { title: "Coordination des moyens techniques et humains", body: "Nous coordonnons les signaux techniques avec les processus des agents, du poste de garde, des interlocuteurs et de la télésurveillance." },
      { title: "Alertes, rapports et maintenance", body: "Nous précisons qui réagit à chaque événement, ce qui doit être consigné, les rapports à produire et les conditions de maintenance du dispositif." },
      { title: "Proposition d’amélioration ou d’intégration", body: "À partir de l’état des lieux, nous proposons des mesures pratiques pour mieux intégrer la technique aux opérations quotidiennes de sécurité." },
    ],
    trustItems: [
      { title: "État des lieux adapté au site", body: "Les besoins techniques sont définis à partir d’une visite et d’une analyse du fonctionnement, et non d’une simple liste d’équipements." },
      { title: "Cadre d’autorisation des activités techniques", body: "La prestation est définie conformément à l’autorisation relative aux technologies de sécurité et aux exigences contractuelles du site." },
      { title: "Intégration à l’exploitation et aux alertes", body: "Les signaux des caméras, accès et alarmes prennent leur valeur opérationnelle lorsqu’ils sont reliés aux agents, au poste de garde, à des circuits d’alerte définis et à des responsabilités de réaction explicites." },
      { title: "Lien avec l’accueil et les accès", body: "Le système technique peut soutenir le contrôle des visiteurs, fournisseurs et collaborateurs et l’application des règles d’autorisation." },
      { title: "Conception attentive à la protection des données", body: "La couverture des images, les champs de captation, les droits d’accès, l’information des personnes et les règles de conservation font partie de l’état des lieux et de la conception." },
      { title: "Constats documentés et proposition de mise en œuvre", body: "L’état des lieux peut déboucher sur des constats exploitables, des priorités, des points d’intégration et une proposition de mise en œuvre." },
      { title: "Processus liés à ISO 9001 et ISO 27001", body: "L’exploitation peut s’appuyer sur des processus encadrés liés aux systèmes de management certifiés ISO 9001 et ISO 27001, lorsque ces processus relèvent du périmètre certifié." },
    ],
    faq: [
      { q: "Que recouvrent les technologies de sécurité chez Avenir ?", a: "Il s’agit des moyens techniques de sécurité du site : caméras, contrôle des accès, détection d’intrusion, alarmes, traitement des signaux et exploitation encadrée. L’objectif est de les relier au gardiennage, à l’accueil et aux alertes." },
      { q: "Peuvent-elles être associées au gardiennage ?", a: "Oui. Caméras, contrôle des accès et alarmes prennent toute leur utilité lorsque les agents, le poste de garde et les interlocuteurs savent quelle action effectuer pour chaque signal selon une procédure convenue." },
      { q: "Quels sites bénéficient d’un état des lieux technique ?", a: "Notamment les bureaux, sites industriels et logistiques, entrepôts, accès poids lourds, sites à accès multiples et lieux connaissant des incidents récurrents ou des mouvements non contrôlés." },
      { q: "Un système existant peut-il être examiné ?", a: "Oui. Les caméras, contrôles d’accès et alarmes existants peuvent être examinés pour vérifier leur contribution à l’exploitation, au gardiennage, à la gestion des événements et aux rapports." },
      { q: "Une connexion à la télésurveillance est-elle possible ?", a: "Oui, lorsque le besoin le justifie. Les modalités doivent être définies selon les risques du site, les possibilités techniques et les exigences contractuelles." },
      { q: "Pourquoi documenter la procédure de remontée des alertes ?", a: "Elle précise les destinataires d’une alarme, d’un événement inhabituel ou d’une tentative d’accès non autorisée, l’ordre des notifications, les éléments à consigner et la clôture du traitement." },
      { q: "Quelle est la différence avec une simple installation de caméras ou d’alarmes ?", a: "Un équipement isolé ne suffit pas. Avenir inscrit les technologies de sécurité dans l’exploitation du site, en lien avec le gardiennage, l’accueil, le contrôle des accès, le traitement des signaux et les rapports." },
      { q: "La conception d’un système de caméras nécessite-t-elle un examen de la protection des données ?", a: "Oui. Il faut examiner la finalité, l’information des personnes, la documentation de l’intérêt légitime, le champ des caméras, la conservation et le contexte de protection des données du site. La proposition technique doit tenir compte de ces aspects, sans constituer un conseil juridique." },
      { q: "Quels facteurs influencent la durée de conservation des images ?", a: "La finalité de l’enregistrement, les risques du site, les besoins de gestion des incidents, les règles internes et le cadre de protection des données. Il n’existe pas de réponse universelle ; les règles doivent être définies de manière justifiée." },
    ],
  },
  "tavfelugyelet-vonuloszolgalat": {
    name: "Télésurveillance et intervention",
    shortDesc: "Traitement des alarmes, remontée des alertes, enregistrement des événements et intervention, coordonnés avec les technologies de sécurité et le gardiennage.",
    seoTitle: "Télésurveillance et intervention | Avenir",
    seoDescription: "Traitement des alarmes, remontée des alertes, enregistrement des événements et intervention, coordonnés avec les technologies de sécurité et le gardiennage.",
    valueProposition: "Le centre de supervision d’Avenir traite 24 h/24 et 7 j/7 les alarmes, signaux d’intrusion et signaux des caméras des sites raccordés. Chaque signal suit un processus de vérification et de remontée d’alerte, et les actions sont consignées dans le journal des événements.",
    longDesc: "Avenir reçoit les alarmes, signaux d’intrusion et signaux liés aux caméras des sites raccordés selon la configuration convenue. Avant toute remontée d’alerte, ils sont examinés suivant le protocole de vérification prédéfini. Les fausses alarmes peuvent être consignées et analysées ; les événements réels sont transmis à l’interlocuteur désigné, au service d’intervention ou à un destinataire externe selon le protocole du site. Les actions sont consignées dans le journal des événements.\n\nLorsque la prestation comprend le traitement des signaux de télésurveillance, la vérification fait partie de la procédure d’exploitation et est documentée pour chaque événement. Le cadre juridique et contractuel de la télésurveillance et de l’intervention est convenu pendant la préparation ; les notifications externes suivent le protocole du site et les règles applicables.\n\nLa télésurveillance fonctionne au mieux lorsqu’elle est reliée aux autres dispositifs du site : technologies de sécurité, gardiennage, poste de garde et processus de réaction convenu. Traitement des signaux, remontée des alertes, enregistrement et clôture des événements forment alors un même modèle d’exploitation.",
    highlights: [],
    useCases: ["Sites industriels et logistiques avec détection d’intrusion, alarmes ou protection périmétrique", "Bureaux, entrepôts et centres d’affaires avec zones couvertes par caméras", "Sites avec contrôle des accès ou détection d’intrusion nécessitant un traitement des signaux 24 h/24 et 7 j/7", "Exploitations à plusieurs locataires ou sites avec chaîne d’alerte documentée", "Examen de dispositifs existants présentant des lacunes de vérification, de réaction ou de rapport"],
    includedItems: ["Réception des alarmes et signaux des caméras 24 h/24 et 7 j/7 selon la configuration convenue", "Protocole de vérification des alarmes documenté pour chaque événement", "Chaîne de contacts nominatifs, matrice d’alerte et règles de notification", "Service d’intervention propre selon les conditions contractuelles convenues", "Journal horodaté et rapport d’événements", "Coordination avec les technologies de sécurité, le gardiennage et le poste de garde du site"],
    processSteps: [
      { title: "Examen du site et des possibilités techniques", body: "Nous examinons les points d’alarme, les sources de signaux, les possibilités techniques et le fonctionnement du gardiennage ou du poste de garde." },
      { title: "Sources de signaux et points de vérification", body: "Nous déterminons les signaux possibles, leurs sources, les points à vérifier et la documentation de la vérification." },
      { title: "Chaîne de contact et matrice d’alerte", body: "Nous précisons qui prévenir pour chaque événement, dans quel ordre et quels événements déclenchent une intervention sur place ou une réaction externe." },
      { title: "Intervention selon les conditions convenues", body: "Le processus de réaction sur site est adapté aux possibilités techniques, à la zone d’intervention et aux conditions contractuelles." },
      { title: "Journal des événements et rapports", body: "Nous définissons les données à consigner, les rapports à produire, les statuts de clôture et les moyens de retracer le traitement des événements." },
      { title: "Démarrage, suivi et ajustements", body: "Après le démarrage, nous examinons les signaux récurrents, les retours et les rapports, et précisons le processus si nécessaire." },
    ],
    trustItems: [
      { title: "Réception continue et vérification avant alerte", body: "Avenir assure la réception des signaux des sites raccordés 24 h/24 et 7 j/7 ; les alarmes sont vérifiées selon le protocole convenu avant leur transmission." },
      { title: "Protocole de vérification documenté", body: "Chaque signal, étape de vérification et décision de transmission est consigné dans le journal des événements et reste traçable selon l’accord de service." },
      { title: "Contacts nominatifs et matrice d’alerte", body: "L’ordre des notifications, les interlocuteurs désignés et les déclencheurs de réaction sont convenus à l’avance et documentés pour chaque site." },
      { title: "Intégration aux opérations de sécurité", body: "La télésurveillance est coordonnée avec les caméras, les accès, le gardiennage et le poste de garde pour réunir le traitement des signaux et les réactions dans un même modèle d’exploitation." },
      { title: "Journal et rapports périodiques", body: "Le client reçoit un rapport selon la fréquence convenue. Le journal permet d’examiner les fausses alarmes, les événements récurrents et les pistes d’amélioration." },
      { title: "Systèmes de management ISO 9001 et ISO 27001", body: "La télésurveillance s’appuie sur les systèmes de management d’Avenir certifiés ISO 9001 et ISO 27001, lorsque ces processus relèvent du périmètre certifié." },
    ],
    faq: [
      { q: "Que comprend la télésurveillance d’Avenir ?", a: "Avenir reçoit, vérifie, consigne et transmet selon le protocole convenu les alarmes, signaux d’intrusion, signaux liés aux caméras et autres signaux techniques des sites raccordés." },
      { q: "Quelle est la différence entre télésurveillance et intervention ?", a: "La télésurveillance porte sur la réception et le traitement des signaux. Le service d’intervention peut assurer une réaction sur place dans un cadre contractuel. Les deux forment un dispositif plus complet de signalement et de réaction." },
      { q: "Quels signaux peuvent être traités ?", a: "Le processus peut être relié à la détection d’intrusion, aux alarmes, aux caméras, aux événements d’accès, à la protection périmétrique ou à d’autres signaux techniques. Les types précis dépendent du site et des exigences contractuelles." },
      { q: "Comment une alarme est-elle vérifiée avant sa transmission ?", a: "Le protocole du site définit la vérification. Avenir examine l’alarme à partir des sources disponibles et des règles convenues. Les fausses alarmes peuvent être consignées et analysées ; les événements réels sont transmis selon les règles documentées de contact et de réaction. Chaque étape est enregistrée." },
      { q: "Avenir dispose-t-elle des autorisations nécessaires ?", a: "Oui. La télésurveillance et l’intervention sont assurées selon le cadre réglementaire hongrois applicable à la protection des personnes et des biens. Les informations sur les autorisations et la documentation des prestations peuvent être examinées lors de la préparation du contrat." },
      { q: "Un délai d’arrivée est-il garanti ?", a: "Le processus d’intervention doit être défini selon le contrat, le site, les possibilités techniques et la zone couverte. Les règles d’arrivée et de réaction doivent donc être précisées au début de la collaboration." },
      { q: "Comment les alertes sont-elles transmises ?", a: "Selon la chaîne de contacts nominatifs, l’ordre des notifications et la matrice de réaction du protocole du site. Celui-ci détermine quand solliciter un interlocuteur désigné, le service d’intervention ou un destinataire externe." },
      { q: "Recevons-nous un rapport d’événements ?", a: "Oui, selon la fréquence convenue. Le format, la fréquence et le contenu peuvent être définis au début de la collaboration." },
      { q: "Comment les alarmes et événements sont-ils documentés ?", a: "Un journal horodaté peut préciser la réception du signal, la vérification effectuée, la chaîne de notification, la transmission de l’alerte, l’action menée et le statut de clôture. Les modalités suivent les règles du site et du contrat." },
      { q: "La télésurveillance peut-elle être reliée aux technologies de sécurité ?", a: "Oui. Elle fonctionne au mieux lorsque les caméras, la détection d’intrusion, le contrôle des accès, le gardiennage et le poste de garde se complètent dans des processus coordonnés." },
      { q: "Comment la protection des données est-elle prise en compte ?", a: "Les signaux, images et événements d’accès ne peuvent être traités que pour la finalité de télésurveillance convenue et dans le cadre de protection des données du client. Conservation, journalisation des accès et minimisation sont définies par site. Avenir apporte le soutien technique et opérationnel ; la base légale et les décisions finales restent au client et à ses conseillers." },
      { q: "Quand une visite de sécurité est-elle utile ?", a: "Lors de la création d’un dispositif d’alarme ou de télésurveillance, en cas de signaux récurrents, de modification des accès ou pour rendre les processus de réaction et de transmission plus transparents." },
    ],
  },
  "hard-fm": {
    name: "Hard FM — gestion technique des bâtiments",
    shortDesc: "Maintenance préventive planifiée, traitement des pannes, coordination des spécialistes et rapports documentés pour l’exploitation technique des sites.",
    seoTitle: "Hard FM — gestion technique des bâtiments | Avenir",
    seoDescription: "Maintenance préventive planifiée, traitement des pannes, coordination des spécialistes et rapports documentés pour l’exploitation technique des sites.",
    valueProposition: "Le Hard FM coordonne la maintenance préventive et le traitement des pannes des bâtiments, équipements techniques et électriques, installations sanitaires, chauffage, ventilation et climatisation, avec alertes et rapports documentés.",
    longDesc: "Le Hard FM d’Avenir coordonne la maintenance préventive planifiée et le traitement des pannes des équipements techniques des sites professionnels, industriels et logistiques. Le périmètre peut couvrir le bâti, les installations techniques, électriques et sanitaires, le chauffage, la ventilation et la climatisation, les petits travaux, la coordination des spécialistes et le suivi documenté des anomalies.\n\nLors de la mise en place, Avenir définit avec le client le circuit de signalement, les niveaux d’alerte, les responsabilités des prestataires, la documentation des actions et le rythme des rapports. Lorsque des spécialistes sont nécessaires pour les installations techniques ou les contrôles obligatoires, leur coordination fait partie du modèle convenu et n’est pas transférée implicitement au client.\n\nLe Hard FM peut être autonome ou associé au poste de garde, au gardiennage et au Soft FM d’Avenir sur le même site. Dans un fonctionnement intégré, rapports, circuits d’alerte et contacts opérationnels sont coordonnés pour donner au client une vue technique cohérente.",
    highlights: [],
    useCases: ["Propriétaires et exploitants d’immeubles de bureaux et de centres d’affaires", "Sites logistiques, entrepôts et sites d’industrie légère avec installations techniques complexes", "Exploitants d’un site recherchant un modèle technique unifié", "Portefeuilles multisites souhaitant regrouper une coordination FM fragmentée", "Sites où le Hard FM doit coopérer avec le poste de garde, le gardiennage ou le Soft FM"],
    includedItems: ["Programme de maintenance préventive pour les installations et équipements convenus", "Traitement des pannes selon des catégories de priorité convenues", "Registre des anomalies, documentation des actions et statuts de clôture", "Coordination des spécialistes en chauffage, ventilation, climatisation, électricité, plomberie et contrôles", "Coordination et soutien documentaire des contrôles obligatoires, si inclus dans le périmètre", "Rapport mensuel sur les tâches ouvertes, actions terminées, pannes récurrentes et améliorations"],
    processSteps: [
      { title: "Inventaire et état des installations", body: "Nous examinons les installations convenues, leur état technique, les pannes récurrentes et les prestataires concernés." },
      { title: "Programme préventif et priorités", body: "Avec le client, nous définissons le calendrier de maintenance préventive, le circuit de signalement et les priorités des interventions correctives." },
      { title: "Mise en place opérationnelle", body: "Nous précisons les responsabilités des prestataires, les règles de recours aux spécialistes, les niveaux d’alerte et les contacts opérationnels." },
      { title: "Exploitation, journalisation et rapports", body: "Signalements, actions, changements de statut, clôtures et tâches ouvertes sont traçables dans le registre des anomalies et le rapport mensuel." },
      { title: "Examen des pannes récurrentes", body: "Les rapports et retours permettent d’examiner les pannes récurrentes, les risques non résolus et les prochaines améliorations." },
    ],
    trustItems: [
      { title: "Interlocuteur opérationnel désigné", body: "Le client dispose d’un interlocuteur nommé pour les signalements, alertes, prestataires et rapports." },
      { title: "Traitement des pannes selon leur priorité", body: "Les catégories convenues lors de la mise en place permettent de traiter distinctement les pannes urgentes, les tâches courantes et les travaux planifiés." },
      { title: "Coordination des spécialistes", body: "Les tâches liées au chauffage, à la ventilation, à la climatisation, à l’électricité, à la plomberie et aux contrôles peuvent faire appel à des spécialistes coordonnés selon le modèle convenu." },
      { title: "Registre documenté et rapport mensuel", body: "Les signalements, actions, changements de statut et clôtures sont consignés et peuvent être résumés dans le rapport mensuel d’exploitation." },
      { title: "Lien avec l’accueil, le gardiennage et le Soft FM", body: "Lorsque ces services travaillent ensemble, leurs rapports, circuits d’alerte et contacts opérationnels peuvent être coordonnés sur le site." },
    ],
    faq: [
      { q: "Qu’est-ce que le Hard FM ?", a: "C’est la coordination de l’exploitation technique des bâtiments, de la maintenance, des signalements de panne et des prestataires. L’objectif est un fonctionnement technique transparent et documenté." },
      { q: "Quelle est la différence avec le Soft FM ?", a: "Le Hard FM porte sur la technique, la maintenance et l’exploitation des bâtiments. Le Soft FM couvre les services quotidiens de soutien, comme le nettoyage, les espaces verts et l’appui opérationnel. Les deux peuvent se compléter sur un même site." },
      { q: "Les signalements de panne peuvent-ils être gérés ?", a: "Oui. Le Hard FM peut organiser leur réception, transmission, priorisation et remontée. Les modalités précises dépendent des besoins du site et du contrat." },
      { q: "Avenir réalise-t-elle elle-même tous les travaux techniques ?", a: "Cela dépend des tâches et du cadre contractuel. Le service peut comprendre la coordination propre d’Avenir, des prestataires désignés, des sous-traitants ou les partenaires existants du client." },
      { q: "Un délai de réparation est-il garanti ?", a: "Les délais dépendent du site, de la tâche, des conditions d’accès et des spécialistes nécessaires. Avenir peut définir des priorités pour distinguer urgences, tâches courantes et maintenance planifiée, sans que cela constitue une garantie générale de délai." },
      { q: "Recevons-nous des rapports sur les tâches techniques ?", a: "Oui, des rapports peuvent être convenus. Ils peuvent présenter les signalements, statuts, actions, tâches terminées, problèmes récurrents et propositions d’amélioration." },
      { q: "Quand un processus Hard FM dédié est-il utile ?", a: "Lorsque pannes, maintenance, spécialistes et rapports sont gérés au cas par cas ou par des prestataires séparés. Un processus dédié clarifie les signalements, priorités, statuts et échéances de rapport." },
      { q: "Le Hard FM peut-il être relié à la sécurité ou au poste de garde ?", a: "Oui. Le poste de garde, les agents ou les dispositifs de sécurité détectent souvent les premiers problèmes techniques. Le fonctionnement est facilité lorsque signalements, responsables, prestataires et niveaux d’alerte sont coordonnés." },
    ],
  },
  "soft-fm": {
    name: "Soft FM — services aux installations",
    shortDesc: "Coordination du nettoyage, des espaces verts, de l’hygiène, de l’appui opérationnel et des rapports dans le cadre du Soft FM.",
    seoTitle: "Soft FM — services aux installations | Avenir",
    seoDescription: "Coordination du nettoyage, des espaces verts, de l’hygiène, de l’appui opérationnel et des rapports dans le cadre du Soft FM.",
    valueProposition: "Le Soft FM coordonne les services quotidiens du site : nettoyage, espaces verts, hygiène, soutien à la gestion des déchets et coordination des prestataires, avec périmètre convenu, critères de qualité définis et rapports réguliers.",
    longDesc: "Le Soft FM d’Avenir regroupe les tâches non techniques qui soutiennent l’exploitation quotidienne : nettoyage, entretien des espaces verts, hygiène, soutien à la gestion des déchets, coordination des prestataires et appui opérationnel sur place. Au début du contrat, Avenir et le client définissent le modèle de réalisation : personnel propre, sous-traitants approuvés ou prestataires existants du client coordonnés par Avenir, selon le modèle du site.\n\nLa collaboration commence par un périmètre écrit précisant les surfaces, fréquences, exigences de qualité, rythme des rapports et circuits d’alerte. L’objectif est un cadre prédéfini, contrôlable et documenté, plutôt qu’un fonctionnement ouvert sans limites précises.\n\nSi le client dispose déjà de prestataires de nettoyage, d’espaces verts, d’hygiène ou d’autres services, Avenir peut en assurer la coordination quotidienne, le contrôle qualité et les rapports pour fournir une vue consolidée de l’exploitation.",
    highlights: [],
    useCases: ["Bureaux et centres d’affaires dont les locataires attendent un niveau de service visible en journée", "Sites industriels ou logistiques où nettoyage, hygiène et déchets doivent suivre les horaires des équipes", "Portefeuilles multisites nécessitant un périmètre, des fréquences et des rapports homogènes", "Sites où le client coordonne actuellement plusieurs prestataires séparés", "Exploitations pouvant relier Soft FM, Hard FM, accueil et gardiennage par une interface opérationnelle", "Situations où les équipes achats, ESG ou audit attendent des rapports écrits selon des indicateurs et critères de qualité convenus"],
    includedItems: ["Nettoyage courant des surfaces selon les fréquences convenues", "Nettoyages périodiques des sols, vitres ou moquettes, s’ils sont inclus dans le périmètre", "Coordination de l’entretien des espaces verts et extérieurs selon le modèle du site", "Coordination des consommables d’hygiène et des prestations sanitaires", "Soutien à la gestion des déchets et contact prestataires selon le modèle convenu", "Coordination des prestataires et sous-traitants existants du client", "Suivi des écarts, problèmes récurrents et actions correctives sur site", "Rapports écrits sur les tâches effectuées, observations qualité, problèmes récurrents et actions à mener"],
    processSteps: [
      { title: "Visite et définition du périmètre", body: "Avenir examine les surfaces, points de service, plages d’intervention et prestataires existants avant de définir le périmètre." },
      { title: "Périmètre écrit, fréquences et qualité", body: "Surfaces, fréquences, points de contrôle, exigences de qualité et rythme des rapports sont précisés avant le démarrage." },
      { title: "Modèle de réalisation et équipe", body: "Avenir définit avec le client le recours au personnel propre, aux sous-traitants approuvés ou aux prestataires existants coordonnés par Avenir, selon l’organisation du site." },
      { title: "Préparation opérationnelle", body: "Avant le démarrage, Avenir prépare les responsabilités, contacts, circuits d’alerte, consignes du site et registres nécessaires au contrôle quotidien." },
      { title: "Démarrage et stabilisation", body: "Au début de l’exploitation, Avenir suit les écarts, précise les responsabilités et stabilise le rythme des prestations dans le périmètre convenu." },
      { title: "Rapports réguliers et revue avec le client", body: "Avenir rend compte des tâches effectuées, observations qualité, problèmes récurrents et actions convenues, puis examine régulièrement la prestation avec le client." },
    ],
    trustItems: [
      { title: "Un périmètre écrit et défini", body: "Surfaces, fréquences, critères de qualité et rythme des rapports sont définis au début du contrat pour clarifier la mission avant l’exploitation." },
      { title: "Contrôle qualité selon des critères précis", body: "Avenir suit le nettoyage, l’hygiène, les espaces verts et l’appui opérationnel à partir de points de contrôle convenus plutôt que d’attentes générales." },
      { title: "Une interface pour plusieurs intervenants", body: "Le client dispose d’une vue coordonnée du personnel Avenir, des sous-traitants approuvés et de ses prestataires existants, selon le modèle du site." },
      { title: "Coordination des prestataires et sous-traitants", body: "Avenir documente responsabilités, contacts et circuits d’alerte pour encadrer la gestion quotidienne des prestataires." },
      { title: "Suivi des actions correctives", body: "Les écarts, problèmes récurrents et actions correctives sont suivis pour rester lisibles et traçables." },
      { title: "Rapports écrits", body: "Avenir rend compte du périmètre réalisé, des observations qualité, des problèmes récurrents et des actions convenues selon la fréquence définie." },
      { title: "Lien avec le Hard FM, l’accueil et le gardiennage", body: "Lorsque ces services interviennent sur le même site, Avenir coordonne les rapports et le traitement des écarts du Soft FM avec leurs processus." },
      { title: "Un modèle adapté au site", body: "Les effectifs, prestataires, fréquences et rapports suivent l’organisation du site et le périmètre contractuel convenu." },
    ],
    faq: [
      { q: "Qu’est-ce que le Soft FM ?", a: "C’est la coordination des services non techniques qui soutiennent l’exploitation quotidienne. Chez Avenir, cela couvre nettoyage, espaces verts, hygiène, soutien à la gestion des déchets, coordination opérationnelle et prestataires dans le périmètre convenu." },
      { q: "Quelle est la différence avec le Hard FM ?", a: "Le Hard FM concerne la technique, la maintenance et les bâtiments. Le Soft FM réunit nettoyage, espaces verts, hygiène et coordination quotidienne sur place. Leurs rapports et circuits d’alerte gagnent à être coordonnés." },
      { q: "Le Soft FM se limite-t-il au nettoyage ?", a: "Non. Le nettoyage en est souvent une composante importante, mais Avenir coordonne aussi les prestataires, espaces verts, processus d’hygiène, contrôles qualité, rapports et interventions de soutien sur site." },
      { q: "Avenir peut-elle coordonner plusieurs prestataires ou sous-traitants ?", a: "Oui. Dans le modèle convenu, Avenir coordonne dès le début du contrat les responsabilités, contacts, circuits d’alerte et exigences de rapport." },
      { q: "La qualité du nettoyage est-elle garantie ?", a: "Une garantie générale ne remplace pas un périmètre défini. Avenir gère la qualité par des tâches convenues, des critères précis, des contrôles, des rapports et des actions correctives, afin de rendre les attentes concrètes et vérifiables." },
      { q: "Comment contrôler la qualité des services Soft FM ?", a: "Par les points de contrôle convenus, les vérifications de prestation, le suivi des problèmes récurrents, les retours et des rapports écrits réguliers, selon les exigences du site." },
      { q: "Recevons-nous des rapports écrits ?", a: "Oui. Une collaboration Soft FM structurée comprend des rapports réguliers couvrant le périmètre réalisé, les observations qualité, les problèmes récurrents et les actions convenues." },
      { q: "Le Soft FM peut-il être relié à l’accueil et à la sécurité ?", a: "Oui. Le poste de garde, l’accueil, les agents ou l’équipe Hard FM signalent souvent les premiers problèmes. Relier signalements, responsabilités, prestataires et rapports dans un même modèle améliore le fonctionnement." },
    ],
  },
};

export function getFrReviewServiceDetailBySlug(slug: string): FrReviewServiceDetail | null {
  if (!(FR_REVIEW_SERVICE_SLUGS as readonly string[]).includes(slug)) return null;
  const source = getDeReviewServiceDetailBySlug(slug)!;
  return {
    id: source.id, slug: source.slug, icon: source.icon, imageUrl: source.imageUrl,
    relatedSlugs: source.relatedSlugs,
    legalReviewRequired: source.legalReviewRequired,
    legalReviewRequiredKeys: source.legalReviewRequiredKeys.filter(
      (key) => !key.startsWith("biztonsagtechnika:DE_ONLY.faq."),
    ),
    translationReviewRequired: true,
    ...DETAILS[slug as FrReviewServiceSlug],
  };
}

export function getFrReviewRelatedServicesBySlugs(slugs: readonly string[]): readonly LocalizedServiceRow[] {
  return slugs.flatMap((slug) => {
    const detail = getFrReviewServiceDetailBySlug(slug);
    return detail ? [{ slug, icon: detail.icon, name: detail.name, shortDesc: detail.shortDesc }] : [];
  });
}

export function getFrReviewRelatedServicesForServiceSlug(slug: string): readonly LocalizedServiceRow[] {
  return getFrReviewRelatedServicesBySlugs(getFrReviewServiceDetailBySlug(slug)?.relatedSlugs ?? []);
}

export function getFrReviewServiceDetailSharedCopy() {
  return {
    serviceDetail: {
      useCasesEyebrow: "Pour qui", useCasesTitle: "Sites concernés", includedEyebrow: "Périmètre", includedTitle: "Prestations incluses",
      processEyebrow: "Déroulement", processTitle: "Démarrer la collaboration", trustEyebrow: "Pourquoi nous choisir", trustTitle: "Éléments de confiance",
      faqEyebrow: "Questions fréquentes", faqTitle: "Vos questions", relatedEyebrow: "Autres services Avenir", relatedTitle: "Services associés",
    },
    serviceQuote: {
      title: "Demander un devis", button: "Demander un devis", close: "Annuler", name: "Nom et prénom", email: "E-mail", phone: "Téléphone", company: "Entreprise (facultatif)", message: "Message",
      messagePlaceholder: "Décrivez brièvement vos besoins.", send: "Envoyer", sending: "Envoi en cours…",
      success: fr.form.success, error: fr.form.errors.server, nameRequired: fr.form.errors.nameRequired,
      emailRequired: fr.form.errors.emailRequired, emailInvalid: fr.form.errors.emailInvalid,
      requiredField: fr.form.requiredField, nextStepHelper: fr.form.nextStepHelper,
    },
  } as const;
}
