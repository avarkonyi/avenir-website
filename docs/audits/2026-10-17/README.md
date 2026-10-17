# AFM – kereshetőség, technikai SEO és fordítások

Dátum: 2026. október 17. Kiinduló forrás: `avarkonyi/avenir-website`, `75b2cd7`. Munkapéldány: `C:/Users/andra/Documents/avenir weblap/afm-public-website`, ág: `codex/seo-translations-fr`.

## Vezetői összefoglaló

Az élő oldal fő HU/EN tartalma hozzáférhető, a lényegi szolgáltatási szöveg már a szervertől kapott HTML-ben szerepel. Nem találtam általános keresőrobot-blokkolást. Az audit 65 URL első válaszát rögzítette: 51 darab 200, 2 darab 308, 12 darab 404. Az utóbbiak között szándékos negatív tesztek mellett nyolc hibás nyelvváltó cél is van. A sitemap 32 HU/EN URL-t tartalmaz.

A javítások a bizonyított hibákra irányulnak: hibás nyelvváltó linkek, rögzített sitemap-dátumok, hiányos cache-frissítés, nem megfelelő vállalati schema, valamint a még nem jóváhagyott nyelvek indexelési kapujának következetessége. A fordítási csomag francia főoldalt, helyi feliratokat és nyelvenként nyolc részletes FR/KO/ZH szolgáltatásfordítást készít elő. A várható előny következetesebb keresési jelzés és végig használható idegen nyelvű ajánlatkérési útvonal; a rangsorolás vagy AI-ajánlás nem igazolható ebből.

## Bizonyítékok és módszer

- `live/inventory.json`, `live/inventory.csv`: URL, nyelv, státusz, indexelési utasítások, title, H1, canonical, hreflang, schema, nyers HTML-ből kinyert fő tartalom és belső linkkapcsolatok.
- `live/robots.txt`, `live/sitemap.xml`, `live/transport.json`: élő válaszok és fejlécek.
- `live/url-variants.json`: HTTP/HTTPS, www/nem-www, záróperjel, nagybetűs nyelvkód, paraméter, régi megszüntetett útvonalak, legacy szolgáltatásslug.
- `staging-content-coverage.json`: kizárólag olvasó tranzakcióban vizsgált CMS-szolgáltatásmezők; `transaction_read_only=on` ellenőrizve.
- `local/`, `preview/` és `screenshots/`: helyi production build, felhős Vercel Preview és böngészős ellenőrzés bizonyítékai.

A crawl egymást követő normál HTTP GET-kéréseket küldött, kérésenként legalább 250 ms szünettel, legfeljebb 120 URL-ig. A mért idő tartalmazza ezt a szünetet, nem Core Web Vitals-adat. A kérések nem igazolt Google/Bing/OpenAI robotforgalom. Nem történt terheléses teszt, adminbelépés, űrlapküldés, CMS-írás, migráció vagy élesítés.

Az adatbázishoz a felhasználó kifejezetten csak olvasást engedélyezett. A helyi `.env.local` figyelmen kívül hagyott fájl; nem része az átadásnak. A build és a publikus GET-oldalak kizárólag SELECT-lekérdezéseket használnak, a helyi környezet nem kapott e-mail-küldési vagy feltöltési kulcsot.

## Bizonyítékos hibalista

| Súly | Probléma és érintett felület | Bizonyíték | Javítás / állapot |
|---|---|---|---|
| P2 | Hibás nyelvváltás a felelős hibabejelentés oldalain | Nyolc belső cél 404: például `/en/felelos-hibabejelentes`, `/hu/responsible-disclosure`, valamint nem létező DE/ZH/KO változatok | A nyelvváltó csak HU/EN-t kínál, a helyes slugpárt használja. |
| P2 | A szolgáltatás-sitemap rögzített 2026-05-07 dátumot adott | Élő sitemap és korábbi `app/sitemap.ts`; a staging CMS-ben frissebb módosítási idő | A sitemap a CMS valódi `updatedAt` értékét használja; a nem igazolható statikus dátumok elhagyva. |
| P2 | Hírmódosítás után nem minden fordított lista/részlet frissült | Korábbi admin action főként HU útvonalakat érvénytelenített | Közös helper érvényteleníti HU/EN/DE főoldalát, hírlistáját, régi/új slugját és sitemapjét. |
| P2 | Sitemap-hibalekezelés üres hírlistát jelenthetett sikeres válaszként | A korábbi build-helper elnyelte az adatlekérési hibát | A sitemap saját lekérője továbbadja a hibát, nem készít megtévesztően hiányos sikeres sitemapet. |
| P2 | Teljesre töltött ZH CMS-mezők jóváhagyás nélkül indexelési/hreflang jelzést kaphattak | Metadata és sitemap eltérő locale-szabályt használt | Közös `publication.ts`: kizárólag HU/EN indexelhető és hreflang-képes. |
| P2 | 24/7 irodai nyitvatartás állítása, elavult/nem megfelelő vállalati schema-típusok | `layout.tsx`: `openingHoursSpecification`, `ProfessionalService`, `SecurityService` | Nyitvatartási állítás törölve; `LocalBusiness`, a meglévő Organization és Service entitások megtartva. |
| P2 | Hiányzó FR, vegyes nyelvű KO/ZH/egyéb feliratok | Élő `/fr` 404; forrás és CMS-mezőfedettség | FR főoldal, nyelvváltás, metaadatok, cookie/UI/404/űrlap/karrier/tanúsítvány-feliratok; FR/KO/ZH részletes szolgáltatásfordítások review módban. |
| P2 | Forrásból megjelenő review szolgáltatás a CMS kikapcsolása után is megmaradhatott | Korábbi DE útvonalak feltétel nélküli hozzáfűzése | Minden review útvonal és kapcsolódó link az aktív, publikált HU/EN alapszolgáltatáshoz kötött. |
| P3 | Nem-www domain ideiglenes átirányítása és több lépés | `https://afm.hu/` → 307 www → 308 `/hu`; HTTP-ről még egy 308 | Vercel domainbeállítás szükséges. Projektlekérés 403; nem módosítva. |
| P3 | Mobilon eltakart főoldali statisztikasáv, koreai főcím szavak közti törése, magyar kártyafelirat idegen nyelveken | Böngészős ellenőrzés 390×844 méreten és akadálymentességi fa | Statisztikasáv rétegsorrendje, koreai főcím tördelése és a kártya/breadcrumb hozzáférhető neve javítva. |

## Robotok és hozzáférés

| Robot | Publikus HU/EN és renderelési erőforrások | `/admin`, `/api` | Megjegyzés |
|---|---|---|---|
| Googlebot | Engedélyezett a `*` csoportban | Tiltott | HTML/HTTP alapján nincs általános noindex az élő HU/EN-en. |
| Bingbot | Engedélyezett a `*` csoportban | Tiltott | Tényleges Bing indexelési állapot nem hozzáférhető. |
| OAI-SearchBot | Engedélyezett a saját csoportjában | Saját csoportban is tiltott | Keresési feltérképezés. |
| ChatGPT-User | Engedélyezett a saját csoportjában | Saját csoportban is tiltott | Felhasználói kérésre történő elérés; a robots nem hozzáférés-védelem. |
| GPTBot | Meglévő engedélyezés változatlan | Saját csoportban is tiltott | Modellfejlesztési cél; nem módosult SEO címén. |

A teszt külön csoportillesztéssel, nem a `*` öröklését feltételezve vizsgálja a szabályokat. `/robots.txt` és `/sitemap.xml` élőben 200. A CSS/JS/képfájlokat a robots nem tiltja. A Preview robots minden feltérképezést tilt; a proxy további `X-Robots-Tag: noindex, nofollow` fejlécet ad. Ez az előnézet megjelenésének megelőzésére szolgál, nem már indexelt URL-ek eltávolítási eljárása.

Az admin belépési kaput a NextAuth/proxy védi; ezt nem nyitottam meg. A normál publikus kérések nem kaptak botkihívást, de WAF-beállítások és igazolt robotnaplók nélkül a robot-IP-k tényleges kiszolgálása nem igazolt. OAI-AdsBothoz kapcsolódó hirdetéses céloldalfolyamatra nem volt bizonyíték; külön szabály nem készült. Google-Extended és az AI-tréning beállításai változatlanok.

Források: [Google robots](https://developers.google.com/search/docs/crawling-indexing/robots/intro), [OpenAI botok](https://developers.openai.com/api/docs/bots), [Bing robots tester](https://www4.bing.com/webmasters/help/robots-txt-tester-623520ca).

## URL-ek, tartalom és nyelvek

- A kanonikus domain `https://www.afm.hu`, a gyökér 308-cal `/hu`-ra irányít. Záróperjel és nagybetűs nyelvkód 308-cal normalizálódik. UTM-paraméteres oldalon a canonical a paraméter nélküli URL.
- HU/EN szolgáltatásoldalak önkanonikusak, egy H1-et tartalmaznak, kölcsönös HU/EN és HU `x-default` alternatívákkal. A review nyelvek saját canonicalt, noindexet kapnak, nincs hreflangjuk és nincsenek a sitemapben.
- Ismeretlen tartalom és a régi `security` szolgáltatásslug 404. `/cgi-sys/defaultwebpage.cgi`, `/mall`, `/tw` 410 + noindex. Nincs általános főoldalra történő soft-404 átirányítás.
- A szolgáltatásgyűjtő, referenciák, kapcsolat, karrier a főoldal tényleges szekciói. Nem találtam önálló, publikált iparági/területi vagy esettanulmány-oldalt; ilyen útvonalakat nem hoztam létre bizonyíték nélkül.
- A nyolc szolgáltatás leírja a célt, vállalati helyzeteket, indulást, dokumentálást, jelentéseket/eseménykezelést, kapcsolódó szolgáltatásokat és ajánlatkérést. A fordítások ezeket a meglévő állításokat követik. Az eredeti HU/EN kereskedelmi szöveg nem kapott általános újraírást.
- FR/KO tanúsítványpróza az ismert ISO 9001 és ISO 27001 forrásszövegből készült. Kiállító, szám, dátum, igazoló dokumentum továbbra is a publikált CMS-adatból jön. Új tanúsítvány, referencia, díj vagy teljesítményígéret nem került be.
- FR/KO/ZH jogi oldalak és hírcikkek nem készültek jóváhagyott fordításként. A felület létező, angolként jelölt jogi célokra mutat; nem publikál angol tartalmat hamis francia URL-en. A DE jogi/hír review réteg változatlanul nem indexelhető.

A strukturált adatoknál a Service és BreadcrumbList megmaradt; FAQPage csak ténylegesen megjelenített GYIK-ből készül. A vállalati azonosítók, elérhetőségek, logo és LinkedIn a meglévő központi SEO-adatforrást követik. Külső Rich Results Test és nyelvi/jogi szakértői jóváhagyás nem történt. [Schema.org LocalBusiness](https://schema.org/LocalBusiness), [ProfessionalService elavulása](https://schema.org/ProfessionalService).

A meglévő `llms.txt` fájlokat nem módosítottam; nem tekintem őket indexelési vagy AI-megjelenési bizonyítéknak. A Google AI-funkciókhoz sem külön AI-schema, sem új AI-szövegfájl nem szükséges a dokumentáció szerint. [Google AI-funkciók](https://developers.google.com/search/docs/appearance/ai-features), [sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap), [nyelvi változatok](https://developers.google.com/search/docs/specialty/international/localized-versions).

## Változtatáscsomag

Draft PR: [avarkonyi/avenir-website #2](https://github.com/avarkonyi/avenir-website/pull/2). Ellenőrzött alkalmazáskód: `69feaace9f305c262a21bd20e54e284eb459b120` (első implementációs commit: `bd77002836b478b459be1da8732c44fdd7273b1a`). GitHub CI és Vercel build sikeres ezen a kódverzión. A következő dokumentációs commit csak a felhős ellenőrzés bizonyítékait rögzíti.

- SEO: `lib/public-sitemap.ts`, `app/sitemap.ts`, szolgáltatás/hír queryk, `lib/services/publication.ts`, admin cache-invalidation, locale layout/schema.
- Lokalizáció: közös locale-lista, `lib/i18n/fr.ts`, homepage/certification overlays, accessibility/consent/404/navigation copy, kapcsolatvalidáció, reply template.
- Szolgáltatások: `lib/services/*-service-details.ts`, közös review-regiszter, a részletező oldal, Nav, ServiceQuoteCta, főoldali/követő linkek.
- Ellenőrzés: regressziós tesztek, crawl- és olvasó audit-scriptek, jelen dokumentum és géppel olvasható bizonyítékok.

## Ellenőrzés és kiadási állapot

| Ellenőrzés | Eredmény |
|---|---|
| `npm test` | 119/119 sikeres teszt; robots csoportok, publikációs kapu, sitemap dátum/törlés, cache-frissítés, fordítási fedettség és kapcsolati payload is vizsgált. |
| `npx tsc --noEmit` | Sikeres. A végleges build saját TypeScript-ellenőrzése is sikeres. |
| `npm run lint` | Sikeres a végső vizuális javítások után. |
| `npm run qa:copy` | PASS: 212 fájl, 33 ellenőrzés. |
| `npm run build` | Sikeres; 100 statikus oldal, köztük 6 főoldal és 48 szolgáltatásoldal. |
| `git diff --check` | Nincs whitespace-hiba. |
| Helyi HTTP crawl | 80 megfigyelés, 48 szolgáltatásoldal 200; 0 törött bejárt belső cél. |
| `node scripts/verify-public-seo-audit.mjs` | 10/10 ellenőrzés sikeres, `local/verification.json`. |
| Böngésző | 390×844 és 1440×1000: 6 főoldal és 6 reprezentatív szolgáltatásoldal DOM/viewport ellenőrzése. Nincs vízszintes túlcsordulás, a lekért böngészőnaplóban nincs error/warn. Francia mobilmenü, kapcsolatanker és nyíló ajánlatkérő panel működik; nem történt küldés. |
| Független review | Technikai SEO és runtime review sikeres, feltárt lábléc-eltérés javítva. FR/KO/ZH források fejezet/GYIK és feltételmegőrzési ellenőrzése sikeres; nem anyanyelvi/jogi jóváhagyás. |
| GitHub CI | Sikeres: [39025482475 futás](https://github.com/avarkonyi/avenir-website/actions/runs/39025482475). |
| Vercel Preview | Build sikeres; 80 URL, 48 szolgáltatásoldal és mind a 10 auditellenőrzés sikeres. Francia oldal böngészőben is megtekintve, mobil/asztali képernyők mentve; űrlapküldés nélkül. `preview/verification.json`. |

Konkrét előtte–utána:

| Felület | Élő kiinduló állapot | Javított helyi build |
|---|---|---|
| FR főoldal | 404 | 200, francia title/H1/lang/copy, noindex review |
| FR/KO/ZH részletes szolgáltatások | Nem létező/lezárt réteg | Nyelvenként 8 teljes forrásfordítás, összesen 24 új részletező; noindex, sitemap/hreflang nélkül |
| Hibabejelentés nyelvváltója | 8 hibás cél | HU/EN slugpár, bejárt belső hibás célok száma 0 |
| Szolgáltatás `lastmod` | Általános 2026-05-07 | CMS szerinti valódi módosítási dátum |
| Vállalati schema | Nem megfelelő típusok és 24/7 iroda | LocalBusiness, igazolatlan nyitvatartás nélkül |
| Mobil statisztikasáv | Háttér által takart szöveg | Látható statisztikák a háttér felett |

**Kódban és helyi production buildben ellenőrzött.** A Preview-környezetben minden publikus HTML HTTP-fejléce noindex; az alkalmazás HU/EN metaadatai és a production canonical URL-ek ettől helyesen megmaradnak. A böngészőben megnyitott helyi előnézet: `http://127.0.0.1:3100/fr`.

**Felhős Vercel Preview ellenőrzött:** [francia előnézet](https://avenir-website-git-codex-s-6be06a-andrasvarkonyi-7800s-projects.vercel.app/fr). A GitHub-integráció automatikusan létrehozta; a normál publikus GET-hozzáférés működik a Vercel connector projektlekérésének 403-as hibája mellett is.

**Éles kiadás nem történt.** Az élő leltár a javítás előtti állapot. Main merge, éles deploy, adatbázis-migráció és CMS-írás nem történt. A nyelvi/jogi és írást igénylő admin/űrlap QA továbbra is külön kapu.

A FR/KO/ZH részletek a meglévő DE-mintát követő, verziózott forrásfordítások. A CMS-ben történő alapszolgáltatás-kikapcsolást követik, de új üzleti szöveg esetén a forrásfordításokat is külön frissíteni/ellenőrizni kell. Nem jött létre új CMS-adatbázisséma vagy fordításkezelő admin.

## Hozzáférésre és döntésre váró tételek

1. Vercel: a projekt listázása sikerült, a projektadat lekérése 403-mal elutasult. A megfelelő team/project hozzáférés helyreállítása szükséges a domain redirect és WAF beállításainak megtekintéséhez/módosításához. A publikus Preview eközben elkészült és ellenőrzött. Éles konfiguráció nem változott.
2. Anyanyelvi és szükség esetén jogi ellenőrzés DE/FR/KO/ZH tartalomra, különösen a szolgáltatásforrásokban már jelölt jogi mondatokra. A review kaput ezután lehet külön kiadási döntéssel feloldani.
3. Search Console, Bing Webmaster Tools, analitika és szervernaplók nem voltak hozzáférhetők. Tényleges indexelés, valódi botforgalom, konverzió és valós felhasználói Core Web Vitals nem állítható.
4. Űrlapküldés és admin CMS-publikálás végponttól végpontig csak külön izolált, írásra engedélyezett tesztkörnyezetben ellenőrizhető. Jelen tesztek tiszta helper- és komponensvizsgálatot végeznek, nem valódi üzenetküldést.
5. A lockfile telepítése függőségi sérülékenységeket jelzett; automatikus, ellenőrizetlen verziófrissítés nem történt. Ez külön függőségi karbantartási feladat.
6. A staging/Preview ISO-kártyáinak CMS-kiállítómezője `MARTON Szakértő Iroda Kft.`, miközben a forrásban lévő PDF-ellenőrzött seed/updater újabb MartonCert/MCert megnevezéseket tartalmaz. Adatírási engedély nélkül ezt nem módosítottam. Az új FR/KO próza nem duplikál kiállítónevet; a megjelenített CMS-adatokat külön egyeztetni kell a tényleges tanúsítványokkal.

Hátralévő kiadási sorrend: nyelvi/jogi és írásra engedélyezett admin/űrlap QA → jóváhagyás → main merge/deploy → éles smoke és Search Console/Bing ellenőrzés. A helyi és felhős Preview nem helyettesíti az éles környezet ellenőrzését.
