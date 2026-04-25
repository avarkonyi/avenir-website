# Avenir FM weboldal — Drop-in csomag (HU végleges)

**Dátum:** 2026. április 24.
**Tartalom:** (1) `T.hu` lecserélhető objektum · (2) Hardcoded kapcsolati blokk frissítés · (3) Footer frissítés · (4) Impresszum külön oldal HTML

---

## ⚙️ Két pont, amire én döntöttem (jelöld, ha mást szeretnél)

| # | Döntés | Választott | Indoklás |
|---|---|---|---|
| 1 | `Security` vs `Őrzés-védelem` | **Őrzés-védelem** | Magyar oldal magyar szóval; a `services` tömb `id: "security"` belső kulcs változatlan |
| 2 | 3. statisztika `A+` vagy `8 szolgáltatás` | **A+** | Erősebb B2B hitelességi jel (független OPTEN bonitási minősítés) |

---

## 1) `T.hu` — drop-in JS objektum

**Mit cserélj:** az `app.js` 6–67. soraiban (a `T = { hu: { ... } }` blokk). A többi nyelvet (en/de/zh) ne bántsd ebben a körben — azokat külön fordítjuk, miután ezt jóváhagyod.

```js
hu: {
  nav: { about: "Rólunk", services: "Szolgáltatások", references: "Referenciák", news: "Hírek", career: "Karrier", contact: "Kapcsolat", cta: "Ajánlatkérés" },
  hero: {
    tag: "Épületüzemeltetés · Vagyonvédelem · Karbantartás",
    h1a: "Az épület üzemel.",
    h1b: "Ön a saját dolgára koncentrál.",
    sub: "Az Avenir átveszi az épületüzemeltetés és a vagyonvédelem teljes terhét — napi működéstől a riportokig, egyetlen szerződéssel, egy kapcsolattartóval.",
    cta1: "Szolgáltatásaink", cta2: "Ajánlatkérés"
  },
  stats: [
    { n: "30+",  l: "Aktív helyszín" },
    { n: "200+", l: "Szakképzett munkatárs" },
    { n: "A+",   l: "Bonitási minősítés" },
    { n: "24/7", l: "Diszpécseri készenlét" }
  ],
  aboutTitle: "Az Avenir-ről",
  aboutSub: "Egy partner. Minden szolgáltatás.",
  aboutText: "Cégünk 2018-ban alakult, de csapatunk és vezetőink több évtizedes tapasztalattal rendelkeznek az épületüzemeltetés és a vagyonvédelem területén. Ma 200+ fős szakembergárdával, 30+ aktív helyszínen dolgozunk országszerte — irodaházak, bevásárlóközpontok, logisztikai és ipari létesítmények, közintézmények számára. Nem nyolc külön szolgáltatást árulunk: egy integrált működést biztosítunk egyetlen szerződéssel, egy felelős kapcsolattartóval.",
  values: [
    { t: "Átláthatóság",        d: "Mérhető teljesítmény, rendszeres riportok, kiszámítható számlázás." },
    { t: "Szakmai lefedettség", d: "Vagyonvédelem, takarítás, műszak, zöldterület — minden diszciplína egy helyen." },
    { t: "Felelős jelenlét",    d: "Nem tűnünk el egy incidens után. Ott vagyunk, amikor számít." }
  ],
  servicesTitle: "Szolgáltatásaink",
  servicesSub: "Komplex működés egy kézből",
  services: [
    { id: "security",  icon: "shield",   t: "Őrzés-védelem",          d: "Személy- és vagyonvédelem képzett munkatársakkal: objektumőrzés, járőrszolgálat, beléptetés és központi diszpécserszolgálat — 24 órában, országos lefedettséggel." },
    { id: "cleaning",  icon: "sparkle",  t: "Takarítás",               d: "Napi és időszakos takarítás, nagytakarítás, gépi padlótisztítás és magassági ablaktisztítás — irodaházaktól ipari létesítményekig. Dokumentált protokollok, ellenőrzött minőség." },
    { id: "building",  icon: "building", t: "Épületüzemeltetés",       d: "Teljes körű épületüzemeltetés egyetlen felelőssel: műszaki felügyelet, karbantartási ütemezés, alvállalkozó-menedzsment és energiagazdálkodás — a jogszabályi megfelelésre is kiterjedően." },
    { id: "reception", icon: "desk",     t: "Portaszolgálat",          d: "Recepciós és portaszolgálat reprezentatív megjelenéssel: beléptetés, vendégkezelés, kulcskezelés és bérlőkapcsolat — a cég első benyomása, amit komolyan veszünk." },
    { id: "green",     icon: "leaf",     t: "Zöldterület-kezelés",     d: "Zöldfelület-gondozás szezonális ütemezéssel: fűnyírás, metszés, télesítés, hó- és síkosságmentesítés. Társasházaktól ipari parkokig, szerződött SLA-val." },
    { id: "technical", icon: "wrench",   t: "Technikai karbantartás",  d: "Épületgépészeti, elektromos és HVAC rendszerek tervszerű karbantartása és hibaelhárítása. Jogszabályi felülvizsgálatok, mérések, dokumentáció egy kézből." },
    { id: "mystery",   icon: "eye",      t: "Mystery Shopping",        d: "Titkosvásárlói programok tervezése és lebonyolítása — független, dokumentált méréssel arról, hogyan működik a szolgáltatás az ügyfél oldalán." },
    { id: "hardfm",    icon: "gear",     t: "Hard FM",                 d: "Épületszerkezet, gépészeti infrastruktúra és kritikus rendszerek üzemfenntartása — tervszerű megelőző karbantartással és 24 órás riasztási készenléttel." }
  ],
  refTitle: "Referenciáink",
  refSub: "Bíznak bennünk",
  refText: "Ügyfeleink közös pontja nem a méret vagy az iparág — hanem az elvárás, hogy az épület hibátlanul működjön. Logisztikai központtól bevásárlóközpontig, ipari parktól közintézményig dolgozunk együtt olyan partnerekkel, akiknek a működési minőség nem kompromisszum kérdése.",
  refs: ["Irodaházak", "Bevásárlóközpontok", "Ipari és logisztikai parkok", "Közintézmények"],
  newsTitle: "Híreink",
  newsSub: "Aktualitások és bejelentések",
  newsText: "Szakmai hírek, új referenciák, iparági események és bejelentések az Avenir-től.",
  newsReadMore: "Tovább olvasom",
  newsViewAll: "Összes hír",
  newsEmpty: "Hamarosan friss hírekkel jelentkezünk.",
  careerTitle: "Karrier",
  careerSub: "Csatlakozz a csapathoz",
  careerText: "Az Avenir csapata országosan dolgozik nagyvállalati ügyfeleknek. Keressük azokat, akik komolyan veszik a műszakot: biztonsági, takarítási, műszaki és irányítói pozíciókra egyaránt. Amit kínálunk: stabil háttér, legális foglalkoztatás, szakmai képzés, belső előrelépés.",
  positions: [
    { t: "Biztonsági őr",                l: "Budapest / országosan", type: "Teljes munkaidő" },
    { t: "Takarítási csoportvezető",     l: "Budapest",              type: "Teljes munkaidő" },
    { t: "Épületüzemeltetési mérnök",    l: "Budapest",              type: "Teljes munkaidő" },
    { t: "Recepcióvezető",               l: "Budapest",              type: "Teljes munkaidő" }
  ],
  applyBtn: "Jelentkezés",
  contactTitle: "Kapcsolat",
  contactSub: "Kérjen ajánlatot",
  form: {
    name: "Teljes név", company: "Cégnév", email: "E-mail cím", phone: "Telefonszám",
    service: "Érdeklő szolgáltatás", message: "Üzenet / Igény leírása",
    send: "Ajánlatkérés küldése",
    success: "Üzenetét megkaptuk. 2 munkanapon belül felvesszük Önnel a kapcsolatot."
  },
  footer: {
    rights: "© 2026 Avenir Facility Management Kft. · Minden jog fenntartva.",
    privacy: "Adatvédelem",
    terms: "ÁSZF"
  }
}
```

---

## 2) Hardcoded kapcsolati blokk — `app.js` ~845–847. sor

**Probléma:** a Contact komponens a 3 elérhetőségi sort (cím / telefon / e-mail) **nem** a `T` objektumból olvassa, hanem hardkódolva van. Ezt is le kell cserélni.

**Keresd meg ezt a részt** (kb. 845–847. sor):

```js
{ icon: "pin", text: "1234 Budapest, Példa utca 1." },
{ icon: "clock", text: "+36 1 234 5678" },
{ icon: "arrow", text: "info@avenir.hu" }
```

**Cseréld erre:**

```js
{ icon: "pin",   text: "1039 Budapest, Királyok útja 291." },
{ icon: "clock", text: "+36 70 316 8218" },
{ icon: "arrow", text: "info@afm.hu" }
```

> 💡 *Apró tipp:* a `clock` ikon telefonszámra logikailag furcsa — érdemes lehet `phone` ikonra cserélni, ha az `Icon` komponensben elérhető. Nem kötelező, csak finomítás.

---

## 3) Footer cégjogi sor — kiegészítés

A `footer.rights` mellé érdemes egy második, halványabb sort tenni a cégjogi adatokkal (B2B hitelességi jel). A Footer komponensben (~928. sor körül) a `<p>{t.footer.rights}</p>` után add hozzá:

```jsx
<p style={{ color: "rgba(255,255,255,0.25)", fontSize: 12, fontWeight: 300, marginTop: 6 }}>
  Cégjegyzékszám: 01-09-328046 · Adószám: 26395124-2-41 · Székhely: 1039 Budapest, Királyok útja 291.
</p>
```

A footer linklistájához (`privacy`, `terms`) add hozzá az **Impresszum**-ot is — ez Magyarországon **kötelező** (Ekertv. 2001. évi CVIII. tv. 4. §):

```jsx
<a href="/impresszum">Impresszum</a>
```

---

## 4) Impresszum — külön oldal tartalma

Mentsd el külön HTML/JSX oldalként (pl. `/impresszum` route alá). Lent két formátum: tiszta HTML (gyorsan beilleszthető bárhova), és sima szöveg (ha React-komponensbe rakod).

### HTML változat

```html
<section style="padding: 100px 5vw; background: #fff;">
  <div style="max-width: 800px; margin: 0 auto;">
    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
      <div style="width: 40px; height: 3px; background: #D1172E;"></div>
      <span style="font-family: var(--font-head); font-size: 13px; letter-spacing: 2.5px; color: #D1172E; text-transform: uppercase; font-weight: 600;">Jogi információk</span>
    </div>
    <h1 style="font-family: var(--font-head); font-weight: 800; font-size: clamp(36px, 4vw, 54px); color: var(--navy); line-height: 1.1; margin-bottom: 32px;">Impresszum</h1>

    <h2 style="font-family: var(--font-head); font-size: 22px; color: var(--navy); margin: 32px 0 12px;">Szolgáltató adatai</h2>
    <p style="color: #445566; font-size: 16px; line-height: 1.75; font-weight: 300;">
      <strong>Avenir Facility Management Szolgáltató Korlátolt Felelősségű Társaság</strong><br>
      Rövid név: Avenir Facility Kft.<br>
      Székhely: 1039 Budapest, Királyok útja 291.<br>
      Cégjegyzékszám: 01-09-328046<br>
      Nyilvántartó bíróság: Fővárosi Törvényszék Cégbírósága<br>
      Adószám: 26395124-2-41<br>
      Képviselő (ügyvezető): Kovács Attila
    </p>

    <h2 style="font-family: var(--font-head); font-size: 22px; color: var(--navy); margin: 32px 0 12px;">Elérhetőség</h2>
    <p style="color: #445566; font-size: 16px; line-height: 1.75; font-weight: 300;">
      Telefon: +36 70 316 8218<br>
      E-mail: info@afm.hu
    </p>

    <h2 style="font-family: var(--font-head); font-size: 22px; color: var(--navy); margin: 32px 0 12px;">Tárhelyszolgáltató</h2>
    <p style="color: #445566; font-size: 16px; line-height: 1.75; font-weight: 300;">
      <strong>Servergarden Kft.</strong><br>
      Székhely: 1023 Budapest, Lajos utca 28-32.<br>
      Telefon: +36 1 432 3133<br>
      E-mail: info@servergarden.hu<br>
      Web: https://www.servergarden.hu
    </p>

    <h2 style="font-family: var(--font-head); font-size: 22px; color: var(--navy); margin: 32px 0 12px;">Szerzői jogok</h2>
    <p style="color: #445566; font-size: 16px; line-height: 1.75; font-weight: 300;">
      A weboldalon megjelenő tartalmak — szövegek, képek, logók, grafikai elemek és forráskód — az Avenir Facility Management Kft. szellemi tulajdonát képezik. Felhasználásuk, többszörözésük, terjesztésük kizárólag a jogtulajdonos előzetes írásbeli engedélyével lehetséges.
    </p>

    <h2 style="font-family: var(--font-head); font-size: 22px; color: var(--navy); margin: 32px 0 12px;">Adatkezelés</h2>
    <p style="color: #445566; font-size: 16px; line-height: 1.75; font-weight: 300;">
      A weboldal használata során rögzített személyes adatok kezelésének részleteiről az <a href="/adatvedelem" style="color: #D1172E;">Adatvédelmi tájékoztatóban</a> tájékozódhat.
    </p>
  </div>
</section>
```

### Sima szöveg (ha máshová is kell)

```
IMPRESSZUM

Szolgáltató adatai
------------------
Avenir Facility Management Szolgáltató Korlátolt Felelősségű Társaság
Rövid név: Avenir Facility Kft.
Székhely: 1039 Budapest, Királyok útja 291.
Cégjegyzékszám: 01-09-328046
Nyilvántartó bíróság: Fővárosi Törvényszék Cégbírósága
Adószám: 26395124-2-41
Képviselő (ügyvezető): Kovács Attila

Elérhetőség
-----------
Telefon: +36 70 316 8218
E-mail: info@afm.hu

Tárhelyszolgáltató
------------------
Servergarden Kft.
Székhely: 1023 Budapest, Lajos utca 28-32.
Telefon: +36 1 432 3133
E-mail: info@servergarden.hu
Web: https://www.servergarden.hu

Szerzői jogok
-------------
A weboldalon megjelenő tartalmak — szövegek, képek, logók, grafikai elemek és
forráskód — az Avenir Facility Management Kft. szellemi tulajdonát képezik.
Felhasználásuk kizárólag a jogtulajdonos előzetes írásbeli engedélyével lehetséges.

Adatkezelés
-----------
A weboldal használata során rögzített személyes adatok kezelésének
részleteiről az Adatvédelmi tájékoztatóban tájékozódhat.
```

---

## ✅ Checklist — telepítés sorrendje

1. [ ] Lecseréld a `T.hu` blokkot az `app.js`-ben (1. pont)
2. [ ] Frissíted a hardcoded kapcsolati 3 sort (2. pont)
3. [ ] Footer cégjogi sor + Impresszum link hozzáadása (3. pont)
4. [ ] Impresszum oldal létrehozása `/impresszum` route alatt (4. pont)
5. [ ] DNS / e-mail beállítás: `info@afm.hu` postaláda működjön (űrlap-küldés célja)
6. [ ] **Adatvédelmi tájékoztató + ÁSZF** — ezek még hiányoznak; ha kéred, a következő körben megírom

## Ha mindez kész, jelezd — és:
- megírom az **EN / DE / ZH** verziót ugyanezen szerkezetben,
- elkészítem az **Adatvédelmi tájékoztató + ÁSZF** szövegvázát (GDPR-kompatibilis sablon).
