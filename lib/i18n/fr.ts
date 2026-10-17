import { en } from "./en";

// Source translation of the existing EN homepage. Review required before
// indexing. Inherited legal/detail copy is unreachable on French routes.
export const fr = {
  ...en,
  nav: {
    home: "Accueil", about: "À propos", services: "Services", references: "Références",
    news: "Actualités", career: "Recrutement", contact: "Contact", cta: "Demander un devis",
  },
  hero: {
    tag: "SÉCURITÉ · TECHNOLOGIES DE SÉCURITÉ · AUDITS",
    h1a: "Moins de risques.", h1b: "Plus de maîtrise.",
    sub: "Avenir coordonne vos opérations de sécurité : gardiennage, contrôle des accès, technologies de sécurité, contrôles sur site et rapports. Un contrat. Un interlocuteur responsable.",
    cta1: "Nos services", cta2: "Demander un devis",
    bgAlt: "Avenir Facility Management — exploitation des bâtiments et sécurité en Hongrie",
  },
  stats: [
    { n: "30+", l: "Sites actifs" }, { n: "200+", l: "Collaborateurs qualifiés" },
    { n: "AA", l: "Solvabilité élevée selon D&B, 2026" }, { n: "24/7", l: "Permanence de dispatching" },
  ],
  aboutTitle: "À propos d’Avenir",
  aboutSub: "SÉCURITÉ · FIABILITÉ OPÉRATIONNELLE",
  aboutText: "Fondée en 2018, Avenir s’appuie sur une équipe dirigeante et des spécialistes disposant de plusieurs décennies d’expérience dans la gestion des installations et les services de sécurité. Aujourd’hui, plus de 200 professionnels interviennent sur plus de 30 sites actifs en Hongrie, dans des environnements d’entreprise, commerciaux, industriels et logistiques.\n\nNous coordonnons le gardiennage, le contrôle des accès, les rondes, la gestion des incidents et les rapports. Notre objectif : alléger la coordination quotidienne pour nos clients, réduire les risques et rendre les opérations sur site plus transparentes.\n\nSelon les besoins, nous complétons la sécurité par des technologies de sécurité, des visites mystères et un accompagnement en facility management. Nos clients disposent ainsi d’un interlocuteur responsable pour coordonner ces prestations.",
  values: [
    { t: "Un suivi transparent", d: "Des processus documentés, des rapports réguliers et des responsabilités clairement définies pour comprendre ce qui se passe sur site." },
    { t: "Une présence professionnelle", d: "Du personnel formé, des protocoles propres à chaque site et des prestations contrôlées dans les environnements industriels, logistiques, commerciaux et de bureaux." },
    { t: "Réactivité et responsabilité", d: "Lors d’un incident, Avenir assure une présence, documente les faits, rend compte et contribue à réduire les problèmes opérationnels récurrents." },
  ],
  servicesTitle: "Nos services", servicesSub: "Des prestations coordonnées par un seul partenaire",
  services: [
    { id: "security", icon: "shield", t: "Gardiennage sur site", d: "Gardiennage des sites professionnels : contrôle des accès, rondes, gestion des incidents, journal de service et remontée des alertes selon les procédures convenues." },
    { id: "cleaning", icon: "sparkle", t: "Sécurité événementielle", d: "Sécurité des événements d’entreprise, sur invitation ou ouverts au public : gestion des accès et des flux, contrôle des zones, rapports d’incident et remontée des alertes selon les consignes de l’organisateur." },
    { id: "building", icon: "camera", t: "Technologies de sécurité", d: "Vidéosurveillance, contrôle des accès et systèmes d’alarme intégrés au dispositif de sécurité du site, avec une conception technique attentive à la protection des données." },
    { id: "reception", icon: "desk", t: "Accueil et services de poste de garde", d: "Accueil des visiteurs, fournisseurs et collaborateurs, gestion des clés et colis, tenue des registres et remontée des alertes selon les procédures convenues." },
    { id: "green", icon: "leaf", t: "Soft FM — services aux installations", d: "Nettoyage, entretien des espaces verts, hygiène, soutien à la gestion des déchets et coordination des prestataires, selon un périmètre convenu, avec contrôles qualité et rapports écrits." },
    { id: "technical", icon: "radar", t: "Télésurveillance et intervention", d: "Réception des signaux, vérification des alarmes, remontée des alertes, enregistrement des événements et processus d’intervention selon les conditions convenues." },
    { id: "mystery", icon: "eye", t: "Visites mystères et audit de service", d: "Visites mystères et contrôle de la qualité de service en situation réelle, avec observations structurées, rapports et recommandations d’amélioration." },
    { id: "hardfm", icon: "gear", t: "Hard FM — gestion technique des bâtiments", d: "Maintenance préventive planifiée, traitement des pannes, coordination des sous-traitants spécialisés, registre des anomalies et rapports d’exploitation." },
  ],
  refTitle: "Partenaires", refSub: "Collaborations sélectionnées",
  refText: "Chaque site est différent, mais l’attente reste la même : des opérations sûres, transparentes et prévisibles. Avenir intervient dans des environnements professionnels et institutionnels où la sécurité, l’ordre et la qualité de service sont essentiels.",
  refs: ["Immeubles de bureaux", "Centres commerciaux", "Sites industriels et logistiques", "Établissements publics"],
  newsTitle: "Actualités", newsSub: "Informations et annonces", newsText: "Actualités de l’entreprise, informations sectorielles et annonces d’Avenir.", newsReadMore: "En savoir plus", newsEmpty: "De nouvelles actualités seront publiées prochainement.",
  careerTitle: "Recrutement", careerSub: "Rejoignez notre équipe",
  careerText: "Les équipes d’Avenir interviennent dans toute la Hongrie sur les sites de grandes entreprises. Nous recherchons des collègues qui respectent leurs engagements et comprennent l’importance d’une présence fiable et d’un travail responsable.\n\nNous accueillons les candidatures pour des postes dans la sécurité, le nettoyage, la technique et l’encadrement. Nous proposons un cadre stable, un emploi déclaré, une intégration professionnelle et des possibilités de développement.",
  applyBtn: "Postuler",
  careerFallbacks: {
    titles: { "Security Guard": "Agent de sécurité", "Cleaning Team Leader": "Responsable d’équipe de nettoyage", "Facility Management Engineer": "Ingénieur en gestion technique des bâtiments", "Reception Manager": "Responsable de l’accueil" },
    locations: { "Budapest, regional": "Budapest et autres régions", Budapest: "Budapest" },
    types: { "Full-time": "Temps plein" },
  },
  contactTitle: "Contact", contactSub: "Demander un devis",
  contactLabels: { address: "Adresse", phone: "Téléphone", email: "E-mail" },
  form: {
    name: "Nom et prénom", company: "Entreprise", email: "Adresse e-mail", phone: "Numéro de téléphone",
    service: "Service souhaité", message: "Message / Besoins", send: "Envoyer la demande", sending: "Envoi en cours…",
    success: "Nous avons reçu votre message. Notre équipe vous répondra aux coordonnées indiquées. Vos données sont traitées conformément à notre politique de confidentialité.",
    successPrivacyLink: "Politique de confidentialité (en anglais)", requiredField: "* Champ obligatoire",
    nextStepHelper: "Pendant les heures de bureau, nous répondons généralement le jour même et vous recontactons au plus tard le jour ouvré suivant. Le délai de préparation du devis dépend du périmètre et de la complexité de votre demande.",
    specialDataWarning: "Ne transmettez pas de données sensibles, de données relatives aux condamnations pénales, d’informations classifiées, de secrets commerciaux ou de détails sur la vie privée de tiers via ce formulaire. Ces sujets nécessitent un engagement distinct et un examen de la protection des données.",
    specialDataWarningLink: "Conditions d’utilisation, section 4 (en anglais)", privateInvestigation: "Enquête privée",
    layeredNotice: "En envoyant ce formulaire, vous reconnaissez avoir pris connaissance de notre", layeredNoticeLink: "politique de confidentialité (en anglais)",
    errors: { nameRequired: "Veuillez saisir votre nom et prénom.", emailRequired: "Veuillez saisir votre adresse e-mail.", emailInvalid: "Veuillez saisir une adresse e-mail valide.", server: "Une erreur est survenue lors de l’envoi. Réessayez plus tard ou appelez-nous au +36 70 316 8218.", throttled: "Trop de tentatives d’envoi en peu de temps. Veuillez patienter une minute." },
  },
  footer: {
    rights: "© 2026 Avenir Facility Management Kft. · Tous droits réservés.", legalTitle: "Informations légales",
    privacy: "Confidentialité (en anglais)", terms: "Conditions d’utilisation (en anglais)", impressum: "Mentions légales (en anglais)",
    companyNumberLabel: "Numéro d’immatriculation", taxNumberLabel: "Numéro fiscal", headquartersLabel: "Siège social",
    machineTranslationDisclaimer: "Les traductions françaises de la page d’accueil et des services sont en cours de révision. Les liens juridiques mènent aux textes anglais ; les actualités ne sont pas encore disponibles en français.",
  },
  certifications: {
    sub: "Certifications", title: "Qualité certifiée.\nProcessus audités.",
    intro: "Nos systèmes de management de la qualité et de la sécurité de l’information sont audités par des organismes de certification indépendants. Ces certifications soutiennent des opérations documentées, traçables et améliorées en continu.",
    qualityManagement: "Management de la qualité", informationSecurity: "Sécurité de l’information", standardLabel: "Norme", scopeLabel: "Périmètre", issuedBy: "Délivré par", certNumber: "Numéro de certificat", issuedOn: "Date de délivrance", validUntil: "Valable jusqu’au", accreditation: "Accréditation", iafMember: "Membre de l’IAF MLA", downloadPdf: "Télécharger le certificat (PDF)", altText: "Logo de la certification {name}",
  },
} as const;
