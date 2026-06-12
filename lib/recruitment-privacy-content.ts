// Recruitment privacy notice (PL-091) — public page content, sourced from
// the DPO-prepared final v3 texts:
//   docs/legal/recruitment-privacy-notice-hu-final-v3.md (authoritative)
//   docs/legal/recruitment-privacy-notice-en-final-v3.md (mirror)
// Only the public body is included here; the workflow/status blocks of the
// markdown files are intentionally omitted. Do not edit this content
// without DPO/legal review (same rule as lib/current-privacy-content.ts).
//
// PUBLICATION GATE: this page may reach production only after the written
// DPO + legal sign-off (PL-091 gate). Confirm the publication date below at
// sign-off before merging to main.

const PUBLICATION_DATE_HU = "2026. június 12.";
const PUBLICATION_DATE_EN = "12 June 2026";

export type RecruitmentPrivacySection = {
  readonly id: string;
  readonly title: string;
  readonly body: string;
};

export type RecruitmentPrivacyContent = {
  readonly title: string;
  readonly lastUpdated: string;
  readonly version: string;
  readonly intro: string;
  readonly sections: readonly RecruitmentPrivacySection[];
  readonly versionHistory: string;
};

export const RECRUITMENT_PRIVACY_CONTENT: Record<
  "hu" | "en",
  RecruitmentPrivacyContent
> = {
  hu: {
    title: "Pályázói adatkezelési tájékoztató",
    lastUpdated: `Hatályos: ${PUBLICATION_DATE_HU}`,
    version: "1.0 verzió",
    intro:
      "Ez a tájékoztató azt mutatja be, hogy az Avenir Facility Management Kft. hogyan kezeli az álláspályázatok során megadott személyes adatokat. Célja, hogy a jelentkezők tömör, átlátható és érthető tájékoztatást kapjanak még a pályázat beküldése előtt.\n\nA tájékoztató különösen az (EU) 2016/679 rendelet (általános adatvédelmi rendelet, GDPR), az információs önrendelkezési jogról és az információszabadságról szóló 2011. évi CXII. törvény (Infotv.), valamint a munka törvénykönyvéről szóló 2012. évi I. törvény (Mt.) — különösen annak 10. §-a — rendelkezésein alapul.\n\nA tájékoztató a www.afm.hu weboldal Karrier szekcióján keresztül indított, valamint a közzétett jelentkezési e-mail-címekre közvetlenül beküldött álláspályázatokra vonatkozik — ideértve a meghirdetett pozíciótól függetlenül, önkéntesen megküldött pályázatokat is. Nem terjed ki a munkaviszony létrejötte utáni munkavállalói adatkezelésre, amelyre külön tájékoztató vonatkozik.",
    sections: [
      {
        id: "controller",
        title: "1. Adatkezelő",
        body: "Adatkezelő: Avenir Facility Management Kft.\nHivatalos cégnév: Avenir Facility Management Szolgáltató Korlátolt Felelősségű Társaság\nSzékhely: 1039 Budapest, Királyok útja 291. B. ép. 15. ajtó\nCégjegyzékszám: 01-09-328046\nAdószám: 26395124-2-41\nE-mail: info@afm.hu\nTelefon: +36 70 316 8218\nWeboldal: https://www.afm.hu",
      },
      {
        id: "dpo",
        title: "2. Adatvédelmi tisztviselő (DPO)",
        body: "Adatvédelmi tisztviselő: Csegény Fanni\nE-mail: dpo@afm.hu\nTelefon: +36 70 622 6242\nPostai elérhetőség: 1039 Budapest, Királyok útja 291. B. ép. 15. ajtó\n\nAz adatvédelmi tisztviselő a pályázói adatkezeléssel kapcsolatos kérdésekben és az érintetti jogok gyakorlásával összefüggésben érhető el.",
      },
      {
        id: "scope",
        title: "3. A tájékoztató hatálya és a jelentkezés módja",
        body: "A weboldal Karrier szekciója a meghirdetett pozíciókat jeleníti meg. A „Jelentkezés\" gomb a jelentkező saját levelezőprogramját nyitja meg; a weboldal önmagában nem rögzít és nem tárol pályázati adatot, nem kér önéletrajz-feltöltést, és nem működtet külön jelentkezési űrlapot.\n\nA pályázati anyagot a jelentkező e-mailben küldi meg a meghirdetett jelentkezési címre. Az adatkezelés a beérkezett e-mailek és csatolmányaik kezelésével valósul meg.",
      },
      {
        id: "data-subjects",
        title: "4. Érintettek köre",
        body: "A meghirdetett pozíciókra jelentkező, valamint az Adatkezelőnek pályázati anyagot önkéntesen megküldő természetes személyek (a továbbiakban: jelentkezők).",
      },
      {
        id: "processed-data",
        title: "5. A kezelt adatok köre",
        body: "- a jelentkező neve;\n- elérhetőségi adatai (e-mail-cím, telefonszám);\n- az önéletrajzban, motivációs levélben és azok csatolmányaiban a jelentkező által önként megadott adatok (például végzettség, szakmai tapasztalat, korábbi munkahelyek);\n- a megpályázott pozíció megnevezése;\n- a jelentkezéssel kapcsolatos levelezés tartalma.\n\nAz Adatkezelő a jelentkezőtől a pályázat elbírálásához nem szükséges adatot nem kér.\n\nA személyes adatok megadása nem jogszabályon vagy szerződésen alapuló kötelezettség; az adatszolgáltatás önkéntes. A pályázat elbírálásához szükséges adatok hiányában azonban a pályázat nem bírálható el, illetve a jelentkezővel a kapcsolat nem vehető fel.",
      },
      {
        id: "purpose",
        title: "6. Az adatkezelés célja",
        body: "- az álláspályázatok fogadása és nyilvántartása;\n- a pályázatok elbírálása és a kiválasztási folyamat lebonyolítása;\n- a jelentkezővel való kapcsolattartás a kiválasztási folyamat során;\n- a jelentkező kifejezett hozzájárulása esetén a pályázati anyag megőrzése későbbi, hasonló pozíciók céljából (8. pont).\n\nAz Adatkezelő a pályázatok elbírálása során kizárólag automatizált adatkezelésen alapuló döntést nem hoz, és profilalkotást nem végez.",
      },
      {
        id: "legal-basis",
        title: "7. Az adatkezelés jogalapja",
        body: "- GDPR 6. cikk (1) bekezdés b) pontja: az adatkezelés a jelentkező kérésére, a munkaszerződés megkötését megelőző lépések megtételéhez szükséges, amennyiben a jelentkezés munkaviszony létesítésére irányul.\n- GDPR 6. cikk (1) bekezdés f) pontja: az Adatkezelő jogos érdeke a kiválasztási folyamat adminisztrációja, a pályázatok összevetése és a kapcsolattartás dokumentálása.\n- GDPR 6. cikk (1) bekezdés a) pontja: a jelentkező kifejezett hozzájárulása, kizárólag a pályázati anyag lezárt kiválasztási folyamatot követő megőrzése esetén, későbbi pozíciókra történő megkeresés céljából (8. pont).",
      },
      {
        id: "retention",
        title: "8. Megőrzési idő",
        body: "Sikertelen pályázat esetén az Adatkezelő a pályázati anyagot és a kapcsolódó levelezést az adott kiválasztási folyamat lezárását követően törli.\n\nA pályázati anyag a kiválasztási folyamat lezárása után kizárólag akkor őrizhető meg későbbi, hasonló pozíciókra történő megkeresés céljából, ha ehhez a jelentkező kifejezetten hozzájárult. A hozzájáruláson alapuló megőrzés időtartama a hozzájárulás megadásától számított 1 év; ennek elteltével az Adatkezelő az adatokat törli, kivéve, ha a jelentkező a hozzájárulását megújítja. A hozzájárulás bármikor visszavonható (11. pont).\n\nSikeres pályázat esetén a munkaviszonyhoz szükséges adatok a munkavállalói adatkezelésre vonatkozó külön tájékoztató szerint kerülnek kezelésre.",
      },
      {
        id: "recipients-processor",
        title: "9. Címzettek, hozzáférés és adatfeldolgozó",
        body: "A pályázati anyagokhoz az Adatkezelő szervezetén belül kizárólag a kiválasztásban részt vevő személyek férnek hozzá:\n\n- a HR-feladatokat ellátó munkatársak;\n- az érintett pozíció szerint illetékes vezetők;\n- a kiválasztási folyamatban részt vevő munkatársak.\n\nAz e-mailben beérkező pályázatok kezelése az Adatkezelő levelezőrendszerén keresztül történik, amelynek működtetéséhez az Adatkezelő az alábbi adatfeldolgozót veszi igénybe:\n\nMicrosoft 365 — Microsoft Ireland Operations Limited\nSzerep: e-mail- és irodai szolgáltatások; a pályázati e-mailek és csatolmányaik tárolása és kezelése.\nSzékhely: One Microsoft Place, South County Business Park, Leopardstown, Dublin 18, D18 P521, Írország\nHarmadik országba történő adattovábbítási garancia: a Microsoft Corporation (USA) a jelen tájékoztató készítésekor szerepel az EU–USA Data Privacy Framework listán, ezért az adattovábbítás a GDPR 45. cikke szerinti megfelelőségi határozat alapján történhet; emellett a Microsoft adatfeldolgozási feltételei az Európai Bizottság 2021/914/EU határozata szerinti általános adatvédelmi kikötéseket (Standard Contractual Clauses, SCC) is tartalmazzák, kiegészítő technikai és szervezési intézkedésekkel.\n\nAz Adatkezelő a pályázati adatokat harmadik fél részére nem továbbítja, kivéve, ha azt jogszabály írja elő.",
      },
      {
        id: "excluded-data",
        title: "10. Különleges adatok mellőzése",
        body: "Kérjük, hogy a pályázati anyagban ne adjon meg a pályázat elbírálásához nem szükséges különleges adatot (például egészségügyi adatot), büntetőjogi adatot vagy harmadik személyre vonatkozó részletes magánéleti információt.\n\nHa a beküldött pályázat ilyen adatot tartalmaz, az Adatkezelő az elbíráláshoz nem szükséges adatokat törölheti, illetve kérheti a pályázat ilyen adatok nélküli ismételt beküldését. Ha valamely pozíciónál jogszabály ír elő például hatósági erkölcsi bizonyítványt, arról az Adatkezelő az adott kiválasztási folyamatban külön tájékoztatást ad.",
      },
      {
        id: "data-subject-rights",
        title: "11. Az érintettek jogai",
        body: "A jelentkező a jelen tájékoztatóban megadott elérhetőségeken — elsősorban a dpo@afm.hu címen — kérheti:\n\n- a személyes adataihoz való hozzáférést;\n- adatai helyesbítését;\n- adatai törlését;\n- az adatkezelés korlátozását;\n- adatainak hordozhatóságát (GDPR 20. cikk), amennyiben annak jogszabályi feltételei fennállnak;\n- továbbá tiltakozhat a GDPR 6. cikk (1) bekezdés f) pontján alapuló adatkezelés ellen.\n\nA pályázati anyag megőrzéséhez adott hozzájárulás (8. pont) bármikor visszavonható; a visszavonás nem érinti a visszavonás előtti adatkezelés jogszerűségét.\n\nAz Adatkezelő a kérelmeket indokolatlan késedelem nélkül, de legfeljebb a beérkezéstől számított egy hónapon belül megválaszolja. Szükség esetén — figyelembe véve a kérelem összetettségét és a kérelmek számát — ez a határidő további két hónappal meghosszabbítható; a hosszabbításról az Adatkezelő egy hónapon belül tájékoztatja a jelentkezőt. Az érintetti jogok részletes leírását az Adatkezelő Adatkezelési tájékoztatójának 9. és 11. pontja tartalmazza.",
      },
      {
        id: "remedies",
        title: "12. Jogorvoslati lehetőségek",
        body: "A jelentkező adatkezeléssel kapcsolatos kérdéssel vagy panasszal elsőként az Adatkezelőhöz vagy az adatvédelmi tisztviselőhöz fordulhat.\n\nFelügyeleti hatóság:\nNemzeti Adatvédelmi és Információszabadság Hatóság (NAIH)\nCím: 1055 Budapest, Falk Miksa utca 9-11.\nPostacím: 1363 Budapest, Pf.: 9\nTelefon: +36 1 391 1400\nE-mail: ugyfelszolgalat@naih.hu\nWeb: https://www.naih.hu\n\nAz érintett bírósághoz is fordulhat. A pert az érintett választása szerint a lakóhelye vagy tartózkodási helye szerinti törvényszék előtt is megindíthatja.",
      },
    ],
    versionHistory: `Verziótörténet: 1.0 verzió - Hatály: ${PUBLICATION_DATE_HU}-tól. Első közzététel.`,
  },
  en: {
    title: "Recruitment Privacy Notice",
    lastUpdated: `Effective: ${PUBLICATION_DATE_EN}`,
    version: "Version 1.0",
    intro:
      "This notice explains how Avenir Facility Management Kft. processes the personal data provided in job applications. Its purpose is to give applicants concise, transparent and intelligible information before they submit an application.\n\nThis notice is based in particular on Regulation (EU) 2016/679 (General Data Protection Regulation, GDPR), Act CXII of 2011 on Informational Self-Determination and Freedom of Information (Infotv.), and Act I of 2012 on the Labour Code (Mt.), in particular its Section 10.\n\nThis notice covers job applications initiated through the Career section of the www.afm.hu website and applications sent directly to the published application email addresses — including applications sent voluntarily, independently of an advertised position. It does not cover employee data processing after an employment relationship is established, which is governed by a separate notice.\n\nAuthoritative language: the authoritative version of this notice is the Hungarian text published at https://www.afm.hu/hu/palyazoi-adatkezeles. The English version is provided for the convenience of non-Hungarian-speaking readers; in the event of any discrepancy between language versions, the Hungarian text prevails.",
    sections: [
      {
        id: "controller",
        title: "1. Controller",
        body: "Controller: Avenir Facility Management Kft.\nLegal name: Avenir Facility Management Szolgáltató Korlátolt Felelősségű Társaság\nRegistered office: Királyok útja 291, building B, door 15, 1039 Budapest, Hungary\nCompany registration number: 01-09-328046\nTax ID: 26395124-2-41\nEmail: info@afm.hu\nPhone: +36 70 316 8218\nWebsite: https://www.afm.hu",
      },
      {
        id: "dpo",
        title: "2. Data Protection Officer (DPO)",
        body: "Data Protection Officer: Fanni Csegény\nEmail: dpo@afm.hu\nPhone: +36 70 622 6242\nPostal contact: Királyok útja 291, building B, door 15, 1039 Budapest, Hungary\n\nThe Data Protection Officer can be contacted with questions about applicant data processing and the exercise of data subject rights.",
      },
      {
        id: "scope",
        title: "3. Scope and How Applications Are Submitted",
        body: "The Career section of the website displays the open positions. The \"Apply\" button opens the applicant's own email client; the website itself does not record or store application data, does not request CV uploads, and does not operate a separate application form.\n\nApplicants send their application material by email to the published application address. Processing takes place through the handling of the received emails and their attachments.",
      },
      {
        id: "data-subjects",
        title: "4. Data Subjects",
        body: "Natural persons who apply for an advertised position or who voluntarily send application material to the Controller (hereinafter: applicants).",
      },
      {
        id: "processed-data",
        title: "5. Categories of Personal Data Processed",
        body: "- the applicant's name;\n- contact details (email address, phone number);\n- data voluntarily provided in the CV, cover letter and their attachments (such as education, professional experience, previous employers);\n- the position applied for;\n- the content of the correspondence related to the application.\n\nThe Controller does not request data from applicants that is not necessary for assessing the application.\n\nProviding personal data is not a statutory or contractual obligation; it is voluntary. However, without the data necessary for assessing the application, the application cannot be assessed and the Controller cannot contact the applicant.",
      },
      {
        id: "purpose",
        title: "6. Purpose of Processing",
        body: "- receiving and recording job applications;\n- assessing applications and conducting the selection process;\n- keeping in contact with the applicant during the selection process;\n- with the applicant's express consent, retaining the application material for future, similar positions (Section 8).\n\nThe Controller does not make decisions based solely on automated processing and does not carry out profiling when assessing applications.",
      },
      {
        id: "legal-basis",
        title: "7. Legal Basis",
        body: "- GDPR Article 6(1)(b): the processing is necessary in order to take steps at the request of the applicant prior to entering into an employment contract, where the application is directed at establishing employment.\n- GDPR Article 6(1)(f): the Controller's legitimate interest in administering the selection process, comparing applications and documenting the related communication.\n- GDPR Article 6(1)(a): the applicant's express consent, solely for retaining the application material after the selection process has closed, for the purpose of contacting the applicant about future positions (Section 8).",
      },
      {
        id: "retention",
        title: "8. Retention Period",
        body: "In the case of an unsuccessful application, the Controller deletes the application material and the related correspondence after the relevant selection process closes.\n\nAfter the selection process closes, application material may be retained for the purpose of contacting the applicant about future, similar positions only if the applicant has expressly consented to this. The consent-based retention period is 1 year from the date the consent is given; upon its expiry, the Controller deletes the data unless the applicant renews the consent. Consent may be withdrawn at any time (Section 11).\n\nIn the case of a successful application, the data necessary for the employment relationship is processed in accordance with the separate employee privacy notice.",
      },
      {
        id: "recipients-processor",
        title: "9. Recipients, Access and Processor",
        body: "Within the Controller's organisation, application material is accessible only to the persons involved in the selection process:\n\n- staff performing HR tasks;\n- the managers responsible for the relevant position;\n- employees taking part in the selection process.\n\nApplications received by email are handled through the Controller's email system, operated with the following processor:\n\nMicrosoft 365 — Microsoft Ireland Operations Limited\nRole: email and office services; storage and handling of application emails and their attachments.\nRegistered office: One Microsoft Place, South County Business Park, Leopardstown, Dublin 18, D18 P521, Ireland\nThird-country transfer safeguard: at the time of preparing this notice, Microsoft Corporation (USA) is listed under the EU–U.S. Data Privacy Framework, so transfers may take place on the basis of an adequacy decision under GDPR Article 45; in addition, Microsoft's data processing terms include the standard contractual clauses (SCC) adopted by Commission Decision (EU) 2021/914, together with supplementary technical and organisational measures.\n\nThe Controller does not transfer application data to third parties unless required by law.",
      },
      {
        id: "excluded-data",
        title: "10. No Unnecessary Special-Category Data",
        body: "Please do not include special-category data (such as health data), criminal-offence data, or detailed private-life information about third parties in your application where it is not necessary for assessing the application.\n\nIf a submitted application contains such data, the Controller may delete the data not necessary for the assessment, or may ask the applicant to resubmit the application without such data. Where a statutory requirement applies to a specific position (for example a certificate of good conduct), the Controller provides separate information in that selection process.",
      },
      {
        id: "data-subject-rights",
        title: "11. Rights of the Applicant",
        body: "Applicants may use the contact details in this notice — primarily dpo@afm.hu — to request:\n\n- access to their personal data;\n- rectification of their data;\n- erasure of their data;\n- restriction of processing;\n- portability of their data (GDPR Article 20), where its statutory conditions are met;\n- and they may object to processing based on GDPR Article 6(1)(f).\n\nConsent given to the retention of application material (Section 8) may be withdrawn at any time; withdrawal does not affect the lawfulness of processing carried out before the withdrawal.\n\nThe Controller responds to requests without undue delay, but within one month of receipt at the latest. Where necessary, taking into account the complexity and number of the requests, this period may be extended by two further months; the Controller informs the applicant of any such extension within one month. A detailed description of data subject rights is provided in Sections 9 and 11 of the Controller's Privacy Policy.",
      },
      {
        id: "remedies",
        title: "12. Remedies",
        body: "For any question or complaint relating to data processing, applicants may first turn to the Controller or the Data Protection Officer.\n\nSupervisory authority:\nNational Authority for Data Protection and Freedom of Information (NAIH)\nAddress: Falk Miksa utca 9-11, 1055 Budapest, Hungary\nPostal address: P.O. Box 9, 1363 Budapest\nPhone: +36 1 391 1400\nEmail: ugyfelszolgalat@naih.hu\nWeb: https://www.naih.hu\n\nApplicants may also turn to the courts. At the applicant's choice, the action may be brought before the regional court (törvényszék) of their place of residence or stay.",
      },
    ],
    versionHistory: `Version history: Version 1.0 - Effective from ${PUBLICATION_DATE_EN}. First publication.`,
  },
};
