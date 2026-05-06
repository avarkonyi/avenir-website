import type { Translation } from "@/lib/i18n";
import {
  SEO_DATA,
  SEO_DATA_PROCESSORS,
  SEO_DPO,
} from "@/lib/seo-data";

type PrivacyContent = Translation["legal"]["privacy"];
type TermsContent = Translation["legal"]["terms"];

const resend = SEO_DATA_PROCESSORS.find((processor) => processor.id === "resend");
const vercel = SEO_DATA_PROCESSORS.find((processor) => processor.id === "vercel");
const neon = SEO_DATA_PROCESSORS.find((processor) => processor.id === "neon");

const HU_PRIVACY_20260506: PrivacyContent = {
  title: "Adatkezelési tájékoztató",
  lastUpdated: "Hatályos: 2026. május 6.",
  version: "1.1 verzió - DPO észrevételek átvezetése",
  intro:
    "Ez a tájékoztató azt mutatja be, hogy az Avenir Facility Management Kft. hogyan kezeli a www.afm.hu weboldalon keresztül megadott személyes adatokat, különösen a kapcsolatfelvételi és ajánlatkérési folyamat során. A tájékoztató célja, hogy az érintettek tömör, átlátható, érthető és könnyen hozzáférhető információt kapjanak az adatkezelésről.",
  sections: [
    {
      id: "controller",
      title: "1. Adatkezelő",
      body: `Adatkezelő: ${SEO_DATA.legalNameShort}
Hivatalos cégnév: ${SEO_DATA.legalName}
Székhely: 1039 Budapest, Királyok útja 291. B. ép. 15. ajtó
Cégjegyzékszám: 01-09-328046
Adószám: 26395124-2-41
E-mail: info@afm.hu
Telefon: +36 70 316 8218
Weboldal: https://www.afm.hu`,
    },
    {
      id: "representative",
      title: "2. Az adatkezelő képviselője",
      body: `Képviselő: Kovács Attila ügyvezető
E-mail: info@afm.hu
Telefon: +36 70 312 5868`,
    },
    {
      id: "dpo",
      title: "3. Adatvédelmi tisztviselő (Data Protection Officer, DPO)",
      body: `Adatvédelmi tisztviselő: ${SEO_DPO.name}
E-mail: ${SEO_DPO.email}
Telefon: ${SEO_DPO.phoneDisplay}

Az adatvédelmi tisztviselő az adatkezeléssel kapcsolatos kérdésekben, valamint az érintetti jogok gyakorlásával összefüggésben érhető el. A jogorvoslati lehetőségeket külön pont ismerteti.`,
    },
    {
      id: "contact-processing",
      title:
        "4. A kapcsolatfelvételi folyamathoz kapcsolódó adatkezelések (GDPR 13. cikke)",
      body: `A www.afm.hu weboldal kapcsolatfelvételi folyamatában az alábbi adatkezeléseket végezzük:

4.1. Kapcsolatfelvétel és ajánlatkérés feldolgozása

Kezelt adatok: teljes név, cégnév, email cím, telefonszám, érdeklődési terület, üzenet szövegében rögzített személyes adatok.

Az adatkezelés célja: a megkeresés fogadása, az ajánlatkérés feldolgozása, a válaszadás, valamint a megkereséshez kapcsolódó üzleti kommunikáció.

Jogalap: GDPR 6. cikk (1) bekezdés b) pontja, ha az ajánlatkérés az érintettel mint leendő szerződő féllel történő szerződéskötést megelőző lépések megtételéhez szükséges, például természetes személy vagy egyéni vállalkozó esetén. GDPR 6. cikk (1) bekezdés f) pontja, ha az érintett valamely jogi személy vagy szervezet kapcsolattartójaként jár el. Az Adatkezelő jogos érdeke ilyen esetben az üzleti kapcsolatfelvétel kezelése, az ajánlat előkészítése és a B2B ügyfélkommunikáció fenntartása.

Megőrzési idő: sikertelen ajánlatkérés esetén az utolsó kapcsolatfelvételtől számított legfeljebb 12 hónap, kivéve, ha jogi igény érvényesítése vagy védekezés miatt hosszabb megőrzés szükséges.

Szerződéskötés esetén: az ajánlatkérésből és üzleti levelezésből a szerződés előkészítéséhez, teljesítéséhez vagy igényérvényesítéshez szükséges adatok a szerződéses iratanyag részeként a szerződés megszűnésétől, illetve az adott követelés esedékességétől számított általános elévülési időig kezelhetők. A Polgári Törvénykönyv 6:22. § szerinti főszabály alapján ez 5 év.

Számviteli bizonylatok esetén az adatok megőrzési ideje 8 év. Ennek jogalapja a számvitelről szóló 2000. évi C. törvény, röviden Sztv.

4.2. Visszaélés-megelőzés és weboldal-biztonság

Kezelt adatok: a kapcsolatfelvételi űrlap technikai használatához kapcsolódó naplóadatok, így különösen IP-cím, időbélyeg, böngésző- és eszközinformáció, valamint a beküldés technikai azonosítói.

Az adatkezelés célja: a kapcsolatfelvételi űrlap visszaélésszerű használatának technikai megakadályozása.

Jogalap: GDPR 6. cikk (1) bekezdés f) pontja. Az Adatkezelő jogos érdeke a weboldal és az űrlap biztonságos működtetése, a jogosulatlan vagy tömeges beküldések megelőzése.

Megőrzési idő: az adatok rögzítésétől számított legfeljebb 30 nap, kivéve, ha biztonsági incidens vagy jogi igény miatt hosszabb megőrzés szükséges.

4.3. Sikeres ajánlatkérést követő szerződéses adminisztráció

Kezelt adatok: a kapcsolattartó neve, beosztása, e-mail címe, telefonszáma, a kommunikáció során a kapcsolattartó által megadott személyes adatok.

Az adatkezelés célja: szerződés előkészítése, teljesítése, kapcsolattartás, teljesítésigazolás, számlázáshoz és igényérvényesítéshez kapcsolódó adminisztráció.

Jogalap: GDPR 6. cikk (1) bekezdés b) pontja, ha az érintett maga szerződő félként jár el. Jogi személy vagy szervezet kapcsolattartója esetén a GDPR 6. cikk (1) bekezdés f) pontja alapján az Adatkezelő jogos érdeke a szerződéses üzleti kapcsolat fenntartása és teljesítése.

Megőrzési idő: a szerződés megszűnésétől, illetve az adott követelés esedékességétől számított általános elévülési időig, főszabály szerint 5 évig. Számviteli bizonylatok esetén az Sztv. alapján 8 évig.`,
    },
    {
      id: "excluded-data",
      title:
        "5. Különleges, büntetőjogi és harmadik személyre vonatkozó adatok mellőzése",
      body: `Kérjük, hogy a kapcsolatfelvételi űrlapon ne küldjön különleges adatot, büntetőjogi adatot, minősített adatot, üzleti titkot vagy harmadik személyre vonatkozó részletes magánéleti információt.

Ilyen adatok kezelését az Adatkezelő a weboldal kapcsolatfelvételi folyamatában nem kéri és nem végzi. Ha a beküldött üzenet ilyen adatot tartalmaz, az Adatkezelő a megkeresés kezeléséhez nem szükséges adatokat törölheti, illetve kérheti az érintettől a megkeresés ilyen adatok nélküli pontosítását.`,
    },
    {
      id: "processors",
      title: "6. Adatfeldolgozóink (GDPR 28. cikke)",
      body: `A weboldal és a kapcsolatfelvételi folyamat működtetéséhez az Adatkezelő adatfeldolgozókat vesz igénybe. Az adatfeldolgozók az Adatkezelő utasításai szerint járnak el. Az Adatkezelő az adatfeldolgozói feltételeket és az adattovábbítási garanciákat nyilvántartja; az érintett ezek tartalmáról további tájékoztatást kérhet.

6.1. ${resend?.tradeName ?? "Resend"} - ${resend?.legalName ?? "Plus Five Five, Inc."}
Szerep: tranzakcionális email továbbítás.
Székhely: ${resend?.address ?? "2261 Market Street #5039, San Francisco, CA 94114, USA"}
Adatkezelés helye: ${resend?.location ?? "EU Frankfurt (sending region)"}
Harmadik országba történő adattovábbítási garancia: az Európai Bizottság 2021/914/EU határozata szerinti általános adatvédelmi kikötések, vagyis Standard Contractual Clauses (SCC), a GDPR 46. cikk (2) bekezdés d) pontja alapján, valamint kiegészítő technikai és szervezési intézkedések.

6.2. ${vercel?.tradeName ?? "Vercel"} - ${vercel?.legalName ?? "Vercel Inc."}
Szerep: hosting, edge/CDN szolgáltatás és szerveroldali naplózás.
Székhely: ${vercel?.address ?? "440 N Barranca Avenue #4133, Covina, CA 91723, USA"}
Adatkezelés helye: ${vercel?.location ?? "EU edge regions (configured)"}
Harmadik országba történő adattovábbítási garancia: a Vercel Inc. a jelen tájékoztató készítésekor szerepel az EU-USA Data Privacy Framework listán, ezért a GDPR 45. cikke szerinti megfelelőségi határozat alapján történhet adattovábbítás.

6.3. ${neon?.tradeName ?? "Neon"} - ${neon?.legalName ?? "Neon, LLC"}
Szerep: PostgreSQL adatbázis-szolgáltatás.
Székhely: ${neon?.address ?? "160 Spear Street, Suite 1300, San Francisco, CA 94105, USA"}
Adatkezelés helye: ${neon?.location ?? "EU AWS Frankfurt (eu-central-1)"}
Harmadik országba történő adattovábbítási garancia: az Európai Bizottság 2021/914/EU határozata szerinti általános adatvédelmi kikötések, vagyis Standard Contractual Clauses (SCC), a GDPR 46. cikk (2) bekezdés d) pontja alapján, valamint kiegészítő technikai és szervezési intézkedések.`,
    },
    {
      id: "third-country-transfers",
      title: "7. Harmadik országba történő adattovábbítások",
      body: `A weboldal működtetéséhez igénybe vett egyes szolgáltatók az Európai Gazdasági Térségen kívüli, különösen amerikai hátterű szolgáltatók. Ilyen esetben az Adatkezelő csak akkor továbbít személyes adatot, ha a GDPR szerinti megfelelő garancia rendelkezésre áll.

Ilyen garancia lehet különösen:
- az Európai Bizottság megfelelőségi határozata, például az EU-USA Data Privacy Framework alapján;
- az Európai Bizottság által elfogadott általános adatvédelmi kikötések, vagyis Standard Contractual Clauses (SCC);
- kiegészítő technikai és szervezési intézkedések.

Az EU-USA Data Privacy Framework működéséről és az amerikai szolgáltatók tanúsításának ellenőrzéséről az Európai Adatvédelmi Testület magyar nyelvű tájékoztatója ad részletesebb információt:
https://www.edpb.europa.eu/system/files/2024-12/edpb_dpf_faq-for-individuals_hu.pdf`,
    },
    {
      id: "cookies",
      title: "8. Sütik és hasonló technológiák",
      body: `A weboldal jelenlegi nyilvános felülete marketing- vagy analitikai sütit nem használ. A kapcsolatfelvételi űrlap működéséhez és biztonságához szükséges technikai megoldások nem szolgálnak reklámcélú követésre.

Ha a jövőben analitikai, marketing- vagy egyéb nem feltétlenül szükséges sütik kerülnek bevezetésre, az Adatkezelő előzetesen külön tájékoztatást és szükség esetén hozzájárulás-kezelést biztosít.`,
    },
    {
      id: "data-subject-rights",
      title: "9. Az érintett jogai (GDPR 12-22. cikkei)",
      body: `Az érintett a jelen tájékoztatóban megadott elérhetőségeken keresztül gyakorolhatja jogait.

A hozzáféréshez való jog

Az érintett jogosult arra, hogy az Adatkezelőtől tájékoztatást kérjen arra vonatkozóan, hogy személyes adatainak kezelése folyamatban van-e. Ha ilyen adatkezelés folyamatban van, jogosult megismerni, hogy az Adatkezelő milyen személyes adatait, milyen jogalapon, milyen adatkezelési célból és mennyi ideig kezeli.

Az érintett jogosult továbbá tájékoztatást kapni arról, hogy az Adatkezelő kinek, mikor, milyen jogszabály alapján és mely személyes adataihoz biztosított hozzáférést, illetve kinek továbbította a személyes adatokat; milyen forrásból származnak a személyes adatai; valamint alkalmaz-e az Adatkezelő automatizált döntéshozatalt vagy profilalkotást.

Az Adatkezelő az adatkezelés tárgyát képező személyes adatok másolatát az érintett kérésére első alkalommal díjmentesen bocsátja rendelkezésre. További másolatokért adminisztratív költségeken alapuló, ésszerű mértékű díj számítható fel.

A helyesbítéshez való jog

Az érintett kérheti, hogy az Adatkezelő módosítsa vagy pontosítsa valamely személyes adatát. Ha az érintett hitelt érdemlően igazolni tudja a helyesbített adat pontosságát, az Adatkezelő a kérést legfeljebb egy hónapon belül teljesíti, és erről az érintettet értesíti.

A zároláshoz, vagyis az adatkezelés korlátozásához való jog

Az érintett kérheti, hogy az Adatkezelő korlátozza személyes adatainak kezelését, ha vitatja az adatok pontosságát; ha az adatkezelés jogellenes, de az érintett ellenzi az adatok törlését; ha az Adatkezelőnek már nincs szüksége az adatokra, de az érintett jogi igény előterjesztéséhez, érvényesítéséhez vagy védelméhez igényli azokat; vagy ha az érintett tiltakozott az adatkezelés ellen, arra az időre, amíg megállapítható, hogy az Adatkezelő jogos indokai elsőbbséget élveznek-e.

A tiltakozáshoz való jog

Az érintett saját helyzetével kapcsolatos okokból bármikor tiltakozhat a GDPR 6. cikk (1) bekezdés f) pontján alapuló adatkezelés ellen. Ebben az esetben az Adatkezelőnek kell igazolnia, hogy az adatkezelést olyan kényszerítő erejű jogos okok indokolják, amelyek elsőbbséget élveznek az érintett érdekeivel, jogaival és szabadságaival szemben, vagy amelyek jogi igények előterjesztéséhez, érvényesítéséhez vagy védelméhez kapcsolódnak.

A törléshez, vagyis az elfeledtetéshez való jog

Az érintett kérheti személyes adatainak törlését, ha az adatok kezelésére már nincs szükség; ha tiltakozott az adatkezelés ellen és nincs elsőbbséget élvező jogszerű ok; ha az Adatkezelő az adatokat jogellenesen kezeli; vagy ha az adatokat jogszabály vagy uniós rendelkezés alapján törölni kell.

Az adathordozhatósághoz való jog

Ha az adatkezelés jogalapja szerződés teljesítése vagy szerződéskötést megelőző lépések megtétele, és az adatkezelés automatizált módon történik, az érintett kérheti, hogy az általa megadott személyes adatokat tagolt, széles körben használt, géppel olvasható formátumban megkapja.

Hozzájárulás visszavonása

A kapcsolatfelvételi folyamatban az Adatkezelő elsődlegesen nem hozzájárulás alapján kezel adatot. Ha valamely jövőbeni adatkezelés hozzájáruláson alapulna, az érintett jogosult lenne azt bármikor visszavonni.`,
    },
    {
      id: "automated-decision-making",
      title: "10. Automatizált döntéshozatal és profilalkotás",
      body: `Az Adatkezelő a weboldalon keresztül megadott személyes adatok alapján nem alkalmaz a GDPR 22. cikke szerinti automatizált döntéshozatalt, és nem végez profilalkotást.`,
    },
    {
      id: "rights-procedure",
      title: "11. Érintetti jogok gyakorlásának módja",
      body: `Az érintetti kérelmeket az Adatkezelő indokolatlan késedelem nélkül, de legfeljebb a kérelem beérkezésétől számított egy hónapon belül megválaszolja. Szükség esetén, figyelembe véve a kérelem összetettségét és a kérelmek számát, ez a határidő további két hónappal meghosszabbítható. A hosszabbításról az Adatkezelő egy hónapon belül tájékoztatja az érintettet.

Az adatbiztonsági követelmények teljesülése és az érintett jogainak védelme érdekében az Adatkezelő jogosult meggyőződni arról, hogy a kérelmet valóban az érintett vagy az arra jogosult képviselője nyújtotta be. Ha az érintett személyazonosságával kapcsolatban megalapozott kétség merül fel, az Adatkezelő a GDPR 12. cikk (6) bekezdése alapján további, az azonosításhoz szükséges információkat kérhet.

Ha a kérelem egyértelműen megalapozatlan vagy túlzó, különösen ismétlődő jellege miatt, az Adatkezelő a GDPR 12. cikk (5) bekezdése alapján ésszerű díjat számíthat fel, vagy megtagadhatja a kérelem teljesítését.`,
    },
    {
      id: "remedies",
      title: "12. Jogorvoslati lehetőségek",
      body: `Az érintett adatkezeléssel kapcsolatos kérdéssel vagy panasszal elsőként az Adatkezelőhöz vagy az adatvédelmi tisztviselőhöz fordulhat.

Felügyeleti hatóság:
Nemzeti Adatvédelmi és Információszabadság Hatóság (NAIH)
Cím: 1055 Budapest, Falk Miksa utca 9-11.
Postacím: 1363 Budapest, Pf.: 9
Telefon: +36 1 391 1400
E-mail: ugyfelszolgalat@naih.hu
Web: https://www.naih.hu

Az érintett bírósághoz is fordulhat. A pert az érintett választása szerint a lakóhelye vagy tartózkodási helye szerinti törvényszék előtt is megindíthatja.`,
    },
    {
      id: "breach",
      title: "13. Adatvédelmi incidensek kezelése",
      body: `Az Adatkezelő az adatvédelmi incidenseket nyilvántartja, kivizsgálja, és szükség esetén megteszi a GDPR szerinti bejelentési és tájékoztatási lépéseket.

Ha az incidens valószínűsíthetően kockázattal jár a természetes személyek jogaira és szabadságaira nézve, az Adatkezelő indokolatlan késedelem nélkül, lehetőség szerint 72 órán belül bejelenti azt a NAIH felé. Ha az incidens valószínűsíthetően magas kockázattal jár az érintettekre nézve, az Adatkezelő az érintetteket is tájékoztatja.`,
    },
    {
      id: "security",
      title: "14. Adatbiztonsági intézkedések",
      body: `Az Adatkezelő az adatkezelés biztonsága érdekében különösen az alábbi intézkedéseket alkalmazza: adattakarékosság, titkosított adatátvitel és -tárolás, hozzáférés-korlátozás, jogosultságkezelés, naplózás, biztonsági mentések, sérülékenység-kezelés, incidenskezelési folyamat, valamint adatvédelmi és információbiztonsági szervezeti intézkedések.

Az Adatkezelő ISO 9001 és ISO/IEC 27001 tanúsítványokkal rendelkezik, amelyek a dokumentált, ellenőrzött és folyamatosan fejlesztett működést támogatják.`,
    },
    {
      id: "modification",
      title: "15. A tájékoztató módosítása",
      body: `Az Adatkezelő fenntartja a jogot a jelen tájékoztató módosítására. A mindenkor hatályos változat a https://www.afm.hu weboldalon érhető el. A lényeges módosításokról az Adatkezelő a weboldalon megfelelő tájékoztatást ad.`,
    },
  ],
  versionHistory:
    "Verziótörténet: 1.1 verzió - Hatály: 2026. május 6-tól. A DPO észrevételei alapján pontosított adatkezelési folyamatok, közérthetőbb GDPR-hivatkozások, harmadik országbeli adattovábbítási garanciák és érintetti jogok.",
};

function replaceTermsLanguage(text: string): string {
  return text
    .replace(/Felhasználási feltételek/g, "Jogi nyilatkozatok")
    .replace(/felhasználási feltételek/g, "jogi nyilatkozatok")
    .replace(/Felhasználási Feltételek/g, "Jogi nyilatkozatok");
}

export function getPrivacyContent(locale: string, fallback: Translation): PrivacyContent {
  if (locale === "hu") {
    return HU_PRIVACY_20260506;
  }

  return fallback.legal.privacy;
}

export function getTermsContent(locale: string, fallback: Translation): TermsContent {
  const base = fallback.legal.terms;
  if (locale !== "hu") {
    return base;
  }

  return {
    ...base,
    title: "Jogi nyilatkozatok",
    lastUpdated: "Hatályos: 2026. május 6.",
    version: "1.1 verzió - cím pontosítása",
    intro:
      "A jelen dokumentum a www.afm.hu weboldal használatára, a kapcsolatfelvételi és ajánlatkérési folyamatra, valamint a weboldalon közzétett jogi nyilatkozatokra vonatkozó tájékoztatást tartalmazza. A dokumentum nem a teljes üzleti működésre vonatkozó általános szerződési feltételrendszer.",
    sections: base.sections.map((section) => {
      if (section.id === "general") {
        return {
          ...section,
          title: "1. Általános rendelkezések és hatály",
          body: replaceTermsLanguage(section.body)
            .replace(
              "A Jogi nyilatkozatok hatálya: a https://www.afm.hu weboldal használatára, a kapcsolatfelvételi és ajánlatkérési flow-ra.",
              "A Jogi nyilatkozatok hatálya: a https://www.afm.hu weboldal használatára, valamint a kapcsolatfelvételi és ajánlatkérési folyamatra.",
            )
            .replace(
              "A jelen Jogi nyilatkozatok nyelve: magyar; a magyar nyelvű változat az autentikus.",
              "A jelen Jogi nyilatkozatok nyelve: magyar; a magyar nyelvű változat az irányadó.",
            ),
        };
      }

      if (section.id === "modification") {
        return {
          ...section,
          title: "13. A jogi nyilatkozatok módosítása",
          body:
            "A Szolgáltató fenntartja a jogot a jelen jogi nyilatkozatok módosítására. A módosítások a https://www.afm.hu/hu/aszf oldalon történő közzététellel lépnek hatályba. A korábbi verziókat a Szolgáltató archiválja és kérésre rendelkezésre bocsátja.",
        };
      }

      return {
        ...section,
        title: replaceTermsLanguage(section.title),
        body: replaceTermsLanguage(section.body),
      };
    }),
    dataProtection: {
      ...base.dataProtection,
      body:
        "A weboldal használatához kapcsolódó adatkezelésekre az Adatkezelési tájékoztató irányadó. A jogi nyilatkozatok nem helyettesítik az Adatkezelési tájékoztatót.",
    },
    versionHistory:
      "Verziótörténet: 1.1 verzió - Hatály: 2026. május 6-tól. A dokumentum címe DPO észrevétel alapján Jogi nyilatkozatokra módosult.",
  };
}

export function withLegalContent(locale: string, fallback: Translation): Translation {
  if (locale !== "hu") {
    return fallback;
  }

  const privacy = getPrivacyContent(locale, fallback);
  const terms = getTermsContent(locale, fallback);

  return {
    ...fallback,
    legal: {
      ...fallback.legal,
      privacy,
      terms,
    },
  };
}
