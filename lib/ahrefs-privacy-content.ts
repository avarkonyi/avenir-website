import type { Translation } from "@/lib/i18n";
import { isAhrefsAnalyticsEnabled } from "@/lib/analytics/ahrefs-config";

type PrivacyContent = Translation["legal"]["privacy"];

// Additive v1.4 notice: the lawyer-reviewed v1.3 baseline is preserved.
const COPY = {
  hu: {
    date: "Hatályos: 2026. október 25.",
    version: "1.4 verzió - Ahrefs analitika és aktiválási feltételek",
    processors: "6.5. Ahrefs Web Analytics - Ahrefs Pte. Ltd.\nSzolgáltató: Ahrefs Pte. Ltd. (UEN: 201227417H), 16 Raffles Quay #33-03 Hong Leong Building, Singapore 048581.\nCél: a weboldal látogatottságának és a látogatások forrásainak hozzájáruláson alapuló, összesített elemzése.\nAktiválás után kezelt adatok: megtisztított oldal-URL és oldalcím; paraméterektől és fragmentumtól mentes hivatkozó URL; böngésző- és eszközadatok, nyelv, képernyőméret és képpontsűrűség. Az IP-cím a hálózati kapcsolat részeként eljut a szolgáltatóhoz. Az Ahrefs tájékoztatása szerint ebből hozzávetőleges, ország- és városszintű helyet és naponta változó álneves látogatói azonosítót képez; a nyers IP-címet nem tárolja az analitikai adatokkal, és nem használ analitikai sütit vagy napokon át fennmaradó látogatói azonosítót.\nAvenir-korlátozások: nincs név-, e-mail-, telefon-, cégnév-, üzenet- vagy szabad szöveges űrlapadat-küldés. Az Ahrefs automatikus link- és űrlapeseményeit nem használjuk. A mérésből kizárjuk azokat a látogatásokat, amelyek hivatkozó URL-je paramétert vagy fragmentumot tartalmaz.\nJogalap: GDPR 6. cikk (1) a) - hozzájárulás.\nAdatkezelési és megőrzési részletek: https://ahrefs.com/legal/privacy-policy\nA Web Analytics sajátosságai: https://help.ahrefs.com/en/articles/10247870-about-ahrefs-web-analytics",
    transfers: "Az Ahrefs szingapúri szolgáltató; szolgáltatói háttere és alfeldolgozói az EGT-n kívül, így Szingapúrban és az Egyesült Államokban is kezelhetnek adatot. Az Ahrefs DPA-ja az EGT-ből történő adatkezelő-adatfeldolgozó adattovábbításhoz a 2. modul szerinti SCC-t írja le. Ehhez az ügyfélnek ki kell töltenie és alá kell írnia az I. mellékletet, majd el kell küldenie az Ahrefsnek; az Ahrefs feltételei a szabályosan aláírt dokumentum beérkezéséhez kötik annak hatálybalépését. A látogatói hozzájárulás nem helyettesíti ezt. Az Ahrefs aktiválásának feltétele az alkalmazandó szerződéses és adattovábbítási garanciák dokumentált lezárása.\nDPA: https://ahrefs.com/legal/data-processing-addendum\nAlfeldolgozók: https://ahrefs.com/legal/subprocessors-list",
    inactive: "Az Ahrefs Web Analytics előkészített, jelenleg inaktív szolgáltatás. A weboldal nem tölti be az Ahrefs scriptjét és nem küld Ahrefs-mérési adatot, még analitikai elfogadás után sem. Az aktiválás az SCC- és adatvédelmi feltételek lezárásáig letiltott.",
    active: "Az Ahrefs Web Analytics csak az analitikai hozzájárulás elfogadása után töltődik be. A korábbi, csak GA4-re adott elfogadás nem jogosítja fel az új szolgáltatót mérésre; új döntést kérünk. A korábbi elutasítás érvényben marad.",
    controls: "Az Ahrefs-hez adott hozzájárulás a lábléc „Süti beállítások” gombjával és az „Elutasítom” választással vonható vissza. A visszavonás letiltja a további Ahrefs-mérést; az oldal újratöltése eltávolítja a már betöltött scriptet. Korábban jogszerűen elküldött mérési adatot a visszavonás nem hív vissza. Személyes adatot ne írjon oldal-URL-be vagy URL-paraméterbe.",
    rights: "Az Ahrefs analitikai célú használata is csak hozzájárulással indulhat el, a fenti aktiválási feltételek teljesülése után. A hozzájárulás visszavonására ugyanaz a „Süti beállítások” / „Elutasítom” vezérlő szolgál.",
    history: "1.4 verzió - 2026. október 25. Ahrefs szolgáltatói, adatköri és adattovábbítási tájékoztatás; aktiválási feltétel és új szolgáltatóhoz kötött hozzájárulás.",
  },
  en: {
    date: "Effective: 25 October 2026",
    version: "Version 1.4 - Ahrefs analytics and activation conditions",
    processors: "6.5. Ahrefs Web Analytics - Ahrefs Pte. Ltd.\nProvider: Ahrefs Pte. Ltd. (UEN: 201227417H), 16 Raffles Quay #33-03 Hong Leong Building, Singapore 048581.\nPurpose: consent-based, aggregated analysis of website traffic and visit sources.\nData processed after activation: a sanitized page URL and page title; a referrer URL without query or fragment; browser/device data, language, screen dimensions and pixel ratio. The provider receives the IP address as part of the network connection. According to Ahrefs, it uses this to derive approximate country/city location and a daily rotating pseudonymous visitor identifier; it does not store raw IP addresses with analytics data or use analytics cookies or cross-day visitor identifiers.\nAvenir restrictions: no names, email addresses, phone numbers, company names, messages or free-text form content are sent. We do not use Ahrefs automatic link or form events. Visits with a query-bearing or fragment-bearing referrer URL are excluded from measurement.\nLegal basis: GDPR Article 6(1)(a) - consent.\nProcessing and retention information: https://ahrefs.com/legal/privacy-policy\nWeb Analytics-specific information: https://help.ahrefs.com/en/articles/10247870-about-ahrefs-web-analytics",
    transfers: "Ahrefs is a Singapore provider; its infrastructure and subprocessors may process data outside the EEA, including Singapore and the United States. Ahrefs' DPA describes Module 2 SCCs for controller-to-processor transfers from the EEA. The customer must complete and sign Annex I and send it to Ahrefs; the published terms make the SCCs effective upon receipt of validly signed documents. Visitor consent does not replace this process. Activation requires documented completion of the applicable contractual and transfer safeguards.\nDPA: https://ahrefs.com/legal/data-processing-addendum\nSubprocessors: https://ahrefs.com/legal/subprocessors-list",
    inactive: "Ahrefs Web Analytics is prepared but currently inactive. The website does not load its script or send Ahrefs measurement data, even after analytics acceptance. Activation is blocked until the SCC and privacy prerequisites are completed.",
    active: "Ahrefs Web Analytics loads only after analytics consent is accepted. An earlier GA4-only acceptance does not authorize the new provider; a new choice is requested. An earlier rejection remains respected.",
    controls: "Ahrefs consent can be withdrawn through the footer's “Cookie settings” control and “Reject”. Withdrawal disables further Ahrefs measurement; reloading removes the already loaded script. It does not recall measurement data lawfully sent before withdrawal. Do not put personal information in page URLs or URL parameters.",
    rights: "Use of Ahrefs for analytics can begin only with consent after the activation prerequisites above are fulfilled. The same “Cookie settings” / “Reject” controls apply to withdrawal.",
    history: "Version 1.4 - 25 October 2026. Ahrefs provider, data-category and transfer notice; activation prerequisite and renewed consent for the added provider.",
  },
  de: {
    date: "Gültig ab: 25. Oktober 2026",
    version: "Version 1.4 - Ahrefs-Analyse und Aktivierungsvoraussetzungen",
    processors: "6.5. Ahrefs Web Analytics - Ahrefs Pte. Ltd.\nAnbieter: Ahrefs Pte. Ltd. (UEN: 201227417H), 16 Raffles Quay #33-03 Hong Leong Building, Singapore 048581.\nZweck: einwilligungsbasierte, aggregierte Analyse des Websiteverkehrs und der Besuchsquellen.\nDaten nach Aktivierung: bereinigte Seiten-URL und Seitentitel, verweisende URL ohne Abfrageparameter oder Fragment, Browser-/Gerätedaten, Sprache, Bildschirmgröße und Pixeldichte. Die IP-Adresse erreicht den Anbieter als Teil der Netzwerkverbindung. Laut Ahrefs werden daraus ein ungefährer Standort auf Länder-/Stadtebene und eine täglich wechselnde pseudonyme Besucherkennung abgeleitet; rohe IP-Adressen werden nicht zusammen mit Analysedaten gespeichert. Ahrefs verwendet keine Analyse-Cookies oder tageübergreifenden Besucherkennungen.\nAvenir übermittelt keine Namen, E-Mail-Adressen, Telefonnummern, Unternehmensnamen, Nachrichten oder frei eingegebenen Formularinhalte. Automatische Link- und Formularereignisse von Ahrefs werden nicht verwendet. Besuche mit Abfrageparametern oder Fragmenten in der verweisenden URL werden nicht gemessen.\nRechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO - Einwilligung.\nVerarbeitung und Aufbewahrung: https://ahrefs.com/legal/privacy-policy\nWeb-Analytics-Informationen: https://help.ahrefs.com/en/articles/10247870-about-ahrefs-web-analytics",
    transfers: "Ahrefs ist ein Anbieter aus Singapur; Infrastruktur und Unterauftragsverarbeiter können Daten außerhalb des EWR, unter anderem in Singapur und den USA, verarbeiten. Das Ahrefs-DPA beschreibt SCC-Modul 2 für Übermittlungen von Verantwortlichen an Auftragsverarbeiter aus dem EWR. Der Kunde muss Anhang I ausfüllen, unterzeichnen und an Ahrefs senden; nach den veröffentlichten Bedingungen werden die SCC mit Eingang der ordnungsgemäß unterzeichneten Dokumente wirksam. Eine Besuchereinwilligung ersetzt diesen Vorgang nicht. Die Aktivierung setzt den dokumentierten Abschluss der einschlägigen Vertrags- und Übermittlungsgarantien voraus.\nDPA: https://ahrefs.com/legal/data-processing-addendum\nUnterauftragsverarbeiter: https://ahrefs.com/legal/subprocessors-list",
    inactive: "Ahrefs Web Analytics ist vorbereitet, derzeit jedoch inaktiv. Die Website lädt kein Ahrefs-Script und sendet auch nach Annahme der Analyse keine Ahrefs-Messdaten. Die Aktivierung bleibt bis zum Abschluss der SCC- und Datenschutzvoraussetzungen gesperrt.",
    active: "Ahrefs Web Analytics wird erst nach Annahme der Analyse-Einwilligung geladen. Eine frühere, nur auf GA4 bezogene Annahme erlaubt dem neuen Anbieter keine Messung; eine neue Entscheidung wird angefordert. Eine frühere Ablehnung bleibt berücksichtigt.",
    controls: "Die Einwilligung zu Ahrefs kann über „Cookie-Einstellungen“ in der Fußzeile und „Ablehnen“ widerrufen werden. Der Widerruf deaktiviert weitere Ahrefs-Messungen; ein Neuladen entfernt das bereits geladene Script. Bereits rechtmäßig übermittelte Messdaten werden dadurch nicht zurückgerufen. Geben Sie keine personenbezogenen Angaben in Seiten-URLs oder URL-Parametern an.",
    rights: "Ahrefs darf erst nach Erfüllung der genannten Aktivierungsvoraussetzungen und mit Einwilligung für Analysen eingesetzt werden. Für den Widerruf gelten dieselben Schaltflächen „Cookie-Einstellungen“ / „Ablehnen“.",
    history: "Version 1.4 - 25. Oktober 2026. Ahrefs-Anbieter-, Datenkategorien- und Übermittlungsinformation; Aktivierungsvoraussetzung und erneute Einwilligung für den zusätzlichen Anbieter.",
  },
} as const;

export function withAhrefsPrivacyNotice(locale: string, baseline: PrivacyContent): PrivacyContent {
  if (locale !== "hu" && locale !== "en" && locale !== "de") return baseline;
  const copy = COPY[locale];
  const status = isAhrefsAnalyticsEnabled() ? copy.active : copy.inactive;
  const additions: Record<string, string> = {
    processors: `${copy.processors}\n${status}`,
    "third-country-transfers": copy.transfers,
    "third-country": copy.transfers,
    cookies: `${status}\n\n${copy.controls}`,
    "data-subject-rights": copy.rights,
    rights: copy.rights,
  };
  return {
    ...baseline,
    lastUpdated: copy.date,
    version: copy.version,
    sections: baseline.sections.map((section) => additions[section.id]
      ? { ...section, body: `${section.body}\n\n${additions[section.id]}` }
      : section),
    versionHistory: `${copy.history}\n\n${baseline.versionHistory ?? ""}`,
  };
}
