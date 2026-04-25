# Avenir FM — SEO & AI-Search Audit + Javítócsomag

**Dátum:** 2026. április 24.
**Vizsgált fájl:** `Avenir_FM_Website.html` (React SPA, single-file bundle)

---

## 🔴 Diagnózis — összegzés

| Súlyosság | Probléma | Hatás |
|---|---|---|
| 🔴 **Kritikus** | Client-side rendering, üres `<div id="root">` | AI keresők (ChatGPT, Perplexity, Claude, Bing AI) **JavaScriptet nem futtatnak** → üres oldalt látnak |
| 🔴 **Kritikus** | Hiányzik `<meta name="description">` | Google snippet véletlenszerűen generálódik, CTR drasztikusan rosszabb |
| 🔴 **Kritikus** | Nincs Organization / LocalBusiness JSON-LD | Google Knowledge Panel, AI Overview, Bing Places nem ismeri fel a céget |
| 🔴 **Kritikus** | Nincs Open Graph / Twitter Card | LinkedIn / FB / WhatsApp link megosztáskor üres preview |
| 🟠 **Magas** | Nincs canonical URL | Duplikált tartalom kockázat (pl. `?lang=en` vs `/`) |
| 🟠 **Magas** | Nincs hreflang | A 4 nyelv (HU/EN/DE/ZH) közül csak a default indexelődik |
| 🟠 **Magas** | Nincs favicon, manifest | Mobil home screen, böngésző-fül kép hiányzik |
| 🟠 **Magas** | Nincs robots.txt, sitemap.xml | Crawler nem tudja, mit indexeljen |
| 🟡 **Közepes** | Nincs FAQPage schema | Google AI Overview / "People Also Ask" nem fog idézni |
| 🟡 **Közepes** | Nincs llms.txt | AI-keresőknek nincs explicit forrás |
| 🟢 **Megvan** | `<html lang="hu">` | ✓ |
| 🟢 **Megvan** | NewsArticle JSON-LD | ✓ (csak a hírek szekciónak) |
| 🟢 **Megvan** | itemProp microdata részlegesen | ✓ |

### A legfontosabb dolog, amit érteni kell

A weboldal jelenleg úgy működik, hogy a böngésző **letölti a HTML-t (üres), majd futtatja a JavaScriptet, ami beilleszti a tartalmat.** Egy emberi látogató ezt nem veszi észre, pillanatok alatt megjelenik az oldal. **Egy keresőrobot viszont:**

- **Google:** futtatja a JS-t, de lassabban indexeli, mintha statikus HTML lenne
- **Bing, Yandex, DuckDuckGo:** részlegesen futtat JS-t, megbízhatatlan
- **OpenAI GPTBot, Anthropic ClaudeBot, Perplexity PerplexityBot, Common Crawl:** **NEM futtatnak JS-t** → üres oldalt látnak → a céget AI-keresésben **gyakorlatilag nem találják meg**

Ez a 2026-os webes trendben komoly probléma: az AI-keresések részaránya gyorsan nő, és a B2B döntéshozók egyre gyakrabban használnak ChatGPT-t, Perplexity-t, Claude-ot előminősítésre — szállítóválasztás, ajánlatkérés előtti kutatás során.

---

## 🟢 Javítócsomag — három szinten

A megoldás háromszintű, gyorsan vagy alaposan választható:

### 1. szint — Kötelező minimum (gyors, ma elvégezhető)
- Comprehensive `<head>` blokk meta tag-ekkel
- Statikus JSON-LD (Organization, LocalBusiness, Service, FAQPage) közvetlenül a HTML-ben
- `<noscript>` fallback szöveggel
- robots.txt + sitemap.xml + llms.txt fájlok

### 2. szint — Közepes (1–2 nap fejlesztés)
- Pre-rendering: a React SPA build-jét egy `react-snap` / `prerender.io` / saját Puppeteer script statikus HTML-lé renderelni — minden URL-re
- Külön URL-ek nyelvenként: `/`, `/en/`, `/de/`, `/zh/` → hreflang működik
- Lazy-loaded képek `width`/`height` attribútummal (CLS)

### 3. szint — Hosszú távú (komolyabb refaktor)
- Migráció Next.js / Astro framework-re → SSR/SSG
- Headless CMS a hírek szekcióhoz (Sanity / Contentful)
- Google Search Console + Bing Webmaster Tools regisztráció
- Strukturált blog rendszer (cikkek = AI-keresési forrás)

A 1. szintet **most odaadom teljes egészében**. A 2–3. szintet csak akkor érdemes, ha az AI-keresési láthatóság stratégiai prioritás.

---

## 📦 1. szint — Drop-in javítócsomag

### A) Cseréld le a teljes `<head>` blokkot

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- ===== Page identity ===== -->
  <title>Avenir Facility Management Kft. — Épületüzemeltetés és vagyonvédelem | Budapest</title>
  <meta name="description" content="Komplex épületüzemeltetés és vagyonvédelem 200+ szakembergárdával, 30+ helyszínen Magyarországon. Őrzés-védelem, takarítás, karbantartás — egy szerződéssel. 24/7 diszpécseri készenlét.">
  <meta name="keywords" content="facility management, épületüzemeltetés, vagyonvédelem, őrzés-védelem, takarítás, portaszolgálat, Budapest, FM szolgáltató, hard FM, mystery shopping">
  <meta name="author" content="Avenir Facility Management Kft.">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <link rel="canonical" href="https://www.afm.hu/">

  <!-- ===== AI search bots (explicit allow) ===== -->
  <meta name="GPTBot" content="index, follow">
  <meta name="ClaudeBot" content="index, follow">
  <meta name="PerplexityBot" content="index, follow">
  <meta name="CCBot" content="index, follow">

  <!-- ===== Multilingual ===== -->
  <link rel="alternate" hreflang="hu" href="https://www.afm.hu/">
  <link rel="alternate" hreflang="en" href="https://www.afm.hu/en/">
  <link rel="alternate" hreflang="de" href="https://www.afm.hu/de/">
  <link rel="alternate" hreflang="zh" href="https://www.afm.hu/zh/">
  <link rel="alternate" hreflang="x-default" href="https://www.afm.hu/">

  <!-- ===== Open Graph (Facebook, LinkedIn, WhatsApp) ===== -->
  <meta property="og:type" content="website">
  <meta property="og:locale" content="hu_HU">
  <meta property="og:locale:alternate" content="en_US">
  <meta property="og:locale:alternate" content="de_DE">
  <meta property="og:site_name" content="Avenir Facility Management">
  <meta property="og:title" content="Avenir Facility Management — Épületüzemeltetés és vagyonvédelem">
  <meta property="og:description" content="Komplex épületüzemeltetés és vagyonvédelem 200+ szakemberrel, 30+ helyszínen. Egy szerződés, egy felelős kapcsolattartó, 24/7 készenlét.">
  <meta property="og:url" content="https://www.afm.hu/">
  <meta property="og:image" content="https://www.afm.hu/og-image.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Avenir Facility Management — épületüzemeltetés és vagyonvédelem Magyarországon">

  <!-- ===== Twitter / X Card ===== -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Avenir Facility Management — Épületüzemeltetés és vagyonvédelem">
  <meta name="twitter:description" content="Komplex FM- és vagyonvédelmi szolgáltatások 200+ szakemberrel, 30+ helyszínen. Egy szerződés, egy felelős. 24/7.">
  <meta name="twitter:image" content="https://www.afm.hu/og-image.jpg">

  <!-- ===== Favicon, app icons ===== -->
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
  <link rel="manifest" href="/site.webmanifest">
  <meta name="theme-color" content="#0B1E3E">

  <!-- ===== Performance hints ===== -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="dns-prefetch" href="https://fonts.googleapis.com">

  <!-- ===== JSON-LD: Organization ===== -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://www.afm.hu/#organization",
    "name": "Avenir Facility Management Kft.",
    "legalName": "Avenir Facility Management Szolgáltató Korlátolt Felelősségű Társaság",
    "url": "https://www.afm.hu/",
    "logo": "https://www.afm.hu/logo.png",
    "image": "https://www.afm.hu/og-image.jpg",
    "description": "Komplex épületüzemeltetési és vagyonvédelmi szolgáltatások Magyarországon. Őrzés-védelem, takarítás, karbantartás, portaszolgálat — egy szerződéssel.",
    "foundingDate": "2018-07-31",
    "taxID": "26395124-2-41",
    "vatID": "HU26395124",
    "iso6523Code": "0190:01-09-328046",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Királyok útja 291.",
      "addressLocality": "Budapest",
      "postalCode": "1039",
      "addressCountry": "HU"
    },
    "contactPoint": [{
      "@type": "ContactPoint",
      "telephone": "+36-70-316-8218",
      "email": "info@afm.hu",
      "contactType": "customer service",
      "areaServed": "HU",
      "availableLanguage": ["Hungarian", "English"]
    }],
    "sameAs": []
  }
  </script>

  <!-- ===== JSON-LD: LocalBusiness ===== -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": "https://www.afm.hu/#localbusiness",
    "name": "Avenir Facility Management Kft.",
    "image": "https://www.afm.hu/og-image.jpg",
    "url": "https://www.afm.hu/",
    "telephone": "+36-70-316-8218",
    "email": "info@afm.hu",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Királyok útja 291.",
      "addressLocality": "Budapest",
      "postalCode": "1039",
      "addressCountry": "HU"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Magyarország"
    },
    "openingHoursSpecification": [{
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "00:00",
      "closes": "23:59",
      "description": "24/7 diszpécseri készenlét"
    }]
  }
  </script>

  <!-- ===== JSON-LD: Services ===== -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Avenir szolgáltatások",
    "itemListElement": [
      { "@type": "Service", "position": 1, "name": "Őrzés-védelem", "description": "Személy- és vagyonvédelem képzett munkatársakkal: objektumőrzés, járőrszolgálat, beléptetés, központi diszpécserszolgálat 24 órában.", "provider": { "@id": "https://www.afm.hu/#organization" } },
      { "@type": "Service", "position": 2, "name": "Takarítás", "description": "Napi és időszakos takarítás, nagytakarítás, gépi padlótisztítás, magassági ablaktisztítás irodaházaktól ipari létesítményekig.", "provider": { "@id": "https://www.afm.hu/#organization" } },
      { "@type": "Service", "position": 3, "name": "Épületüzemeltetés", "description": "Teljes körű épületüzemeltetés egyetlen felelőssel: műszaki felügyelet, karbantartási ütemezés, alvállalkozó-menedzsment, energiagazdálkodás.", "provider": { "@id": "https://www.afm.hu/#organization" } },
      { "@type": "Service", "position": 4, "name": "Portaszolgálat", "description": "Recepciós és portaszolgálat reprezentatív megjelenéssel, beléptetéssel, vendég- és kulcskezeléssel.", "provider": { "@id": "https://www.afm.hu/#organization" } },
      { "@type": "Service", "position": 5, "name": "Zöldterület-kezelés", "description": "Zöldfelület-gondozás szezonálisan: fűnyírás, metszés, télesítés, hó- és síkosságmentesítés, szerződött SLA-val.", "provider": { "@id": "https://www.afm.hu/#organization" } },
      { "@type": "Service", "position": 6, "name": "Technikai karbantartás", "description": "Épületgépészeti, elektromos és HVAC rendszerek tervszerű karbantartása, jogszabályi felülvizsgálatokkal.", "provider": { "@id": "https://www.afm.hu/#organization" } },
      { "@type": "Service", "position": 7, "name": "Mystery Shopping", "description": "Titkosvásárlói programok tervezése és lebonyolítása független, dokumentált méréssel.", "provider": { "@id": "https://www.afm.hu/#organization" } },
      { "@type": "Service", "position": 8, "name": "Hard FM", "description": "Épületszerkezet, gépészeti infrastruktúra és kritikus rendszerek üzemfenntartása 24 órás riasztási készenléttel.", "provider": { "@id": "https://www.afm.hu/#organization" } }
    ]
  }
  </script>

  <!-- ===== JSON-LD: FAQ (kritikus AI Overview-hoz) ===== -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Milyen szolgáltatásokat nyújt az Avenir Facility Management?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Az Avenir Facility Management Kft. nyolc komplex szolgáltatást nyújt egyetlen szerződés keretében: őrzés-védelem, takarítás, épületüzemeltetés, portaszolgálat, zöldterület-kezelés, technikai karbantartás, mystery shopping és Hard FM."
        }
      },
      {
        "@type": "Question",
        "name": "Hol érhető el az Avenir Facility Management?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Az Avenir Facility Management Magyarország teljes területén nyújt szolgáltatásokat, központja Budapesten található (1039 Budapest, Királyok útja 291.). 30+ aktív helyszínen dolgozunk országszerte."
        }
      },
      {
        "@type": "Question",
        "name": "Hány embert foglalkoztat az Avenir?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Az Avenir Facility Management 200+ szakképzett munkatársat foglalkoztat — biztonsági őröket, takarítókat, épületüzemeltetési mérnököket és recepciósokat. A cég 2018-ban alakult, vezetői és kulcsmunkatársai több évtizedes szakmai tapasztalattal rendelkeznek."
        }
      },
      {
        "@type": "Question",
        "name": "Milyen ügyfeleknek dolgozik az Avenir?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Az Avenir ügyfélkörébe irodaházak, bevásárlóközpontok, ipari és logisztikai parkok, valamint közintézmények tartoznak. A cég OPTEN bonitási minősítése A+, közepes vállalkozási kategóriában működik."
        }
      },
      {
        "@type": "Question",
        "name": "Hogyan lehet ajánlatot kérni az Avenirtől?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ajánlat a +36 70 316 8218-as telefonszámon, az info@afm.hu e-mail címen, vagy a www.afm.hu weboldalon található űrlapon kérhető. Visszajelzés 2 munkanapon belül."
        }
      }
    ]
  }
  </script>

  <!-- ===== JSON-LD: WebSite ===== -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://www.afm.hu/#website",
    "url": "https://www.afm.hu/",
    "name": "Avenir Facility Management",
    "publisher": { "@id": "https://www.afm.hu/#organization" },
    "inLanguage": ["hu", "en", "de", "zh"]
  }
  </script>
</head>
```

### B) `<noscript>` fallback — bots without JS see this

Az `<body>` tag elejére, a React `<div id="root">` előtt:

```html
<noscript>
  <style>
    .seo-fallback { max-width: 900px; margin: 40px auto; padding: 0 20px; font-family: -apple-system, sans-serif; color: #0B1E3E; }
    .seo-fallback h1 { font-size: 32px; margin-bottom: 8px; }
    .seo-fallback h2 { font-size: 22px; margin-top: 32px; color: #D1172E; }
    .seo-fallback ul { padding-left: 20px; }
  </style>
  <div class="seo-fallback">
    <h1>Avenir Facility Management Kft.</h1>
    <p><strong>Komplex épületüzemeltetés és vagyonvédelem Magyarországon.</strong> 200+ szakembergárda, 30+ aktív helyszín, 24/7 diszpécseri készenlét. A weboldal teljes funkcióinak használatához JavaScript szükséges.</p>

    <h2>Szolgáltatásaink</h2>
    <ul>
      <li><strong>Őrzés-védelem</strong> — személy- és vagyonvédelem, objektumőrzés, járőrszolgálat, beléptetés.</li>
      <li><strong>Takarítás</strong> — napi és időszakos takarítás, gépi padlótisztítás, magassági ablaktisztítás.</li>
      <li><strong>Épületüzemeltetés</strong> — műszaki felügyelet, karbantartási ütemezés, energiagazdálkodás.</li>
      <li><strong>Portaszolgálat</strong> — recepciós és portaszolgálat, beléptetés, vendég- és kulcskezelés.</li>
      <li><strong>Zöldterület-kezelés</strong> — fűnyírás, metszés, hó- és síkosságmentesítés.</li>
      <li><strong>Technikai karbantartás</strong> — épületgépészet, elektromos és HVAC rendszerek.</li>
      <li><strong>Mystery Shopping</strong> — titkosvásárlói programok tervezése és lebonyolítása.</li>
      <li><strong>Hard FM</strong> — épületszerkezet, kritikus rendszerek, 24 órás riasztási készenlét.</li>
    </ul>

    <h2>Kapcsolat</h2>
    <p>
      Avenir Facility Management Kft.<br>
      1039 Budapest, Királyok útja 291.<br>
      Telefon: <a href="tel:+36703168218">+36 70 316 8218</a><br>
      E-mail: <a href="mailto:info@afm.hu">info@afm.hu</a>
    </p>

    <h2>Cégadatok</h2>
    <p>Cégjegyzékszám: 01-09-328046 · Adószám: 26395124-2-41 · Alapítás: 2018</p>
  </div>
</noscript>
```

### C) `robots.txt` — gyökérbe (`https://www.afm.hu/robots.txt`)

```
User-agent: *
Allow: /

# AI search bots — explicit allow
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: CCBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: anthropic-ai
Allow: /

Sitemap: https://www.afm.hu/sitemap.xml
```

> 💡 Ha **nem szeretnéd**, hogy az AI-modellek a tartalmat tanítóadatra használják (csak indexeljék), cseréld a fenti AI-bot blokkokat `Disallow: /`-ra. Az indexelést ettől még a Google/Bing fogja, csak az AI tréninghez nem használják fel.

### D) `sitemap.xml` — gyökérbe (`https://www.afm.hu/sitemap.xml`)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://www.afm.hu/</loc>
    <lastmod>2026-04-24</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="hu" href="https://www.afm.hu/"/>
    <xhtml:link rel="alternate" hreflang="en" href="https://www.afm.hu/en/"/>
    <xhtml:link rel="alternate" hreflang="de" href="https://www.afm.hu/de/"/>
    <xhtml:link rel="alternate" hreflang="zh" href="https://www.afm.hu/zh/"/>
  </url>
  <url>
    <loc>https://www.afm.hu/impresszum</loc>
    <lastmod>2026-04-24</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>https://www.afm.hu/adatvedelem</loc>
    <lastmod>2026-04-24</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
</urlset>
```

### E) `llms.txt` — gyökérbe (`https://www.afm.hu/llms.txt`)

Új, 2024-ben felmerült standard, AI-search modellek számára. Tömör tényfájl, amit AI keresők prioritással olvasnak:

```markdown
# Avenir Facility Management Kft.

> Komplex épületüzemeltetési és vagyonvédelmi szolgáltatások Magyarországon.
> 200+ szakembergárda, 30+ aktív helyszín, 24/7 diszpécseri készenlét.

## Cégadatok

- **Hivatalos név:** Avenir Facility Management Szolgáltató Korlátolt Felelősségű Társaság
- **Rövid név:** Avenir Facility Kft.
- **Alapítás:** 2018. július 31.
- **Cégjegyzékszám:** 01-09-328046
- **Adószám:** 26395124-2-41
- **Székhely:** 1039 Budapest, Királyok útja 291.
- **Ügyvezető:** Kovács Attila
- **Bonitási minősítés (OPTEN):** A+
- **Méretkategória:** Közepes vállalkozás

## Kapcsolat

- **Telefon:** +36 70 316 8218
- **E-mail:** info@afm.hu
- **Web:** https://www.afm.hu/
- **Ügyelet:** 24/7 diszpécseri készenlét

## Szolgáltatások

1. **Őrzés-védelem** — személy- és vagyonvédelem, objektumőrzés, járőrszolgálat, beléptetés, központi diszpécserszolgálat
2. **Takarítás** — napi és időszakos, nagytakarítás, gépi padlótisztítás, magassági ablaktisztítás
3. **Épületüzemeltetés** — műszaki felügyelet, karbantartási ütemezés, alvállalkozó-menedzsment, energiagazdálkodás
4. **Portaszolgálat** — recepció, beléptetés, vendég- és kulcskezelés
5. **Zöldterület-kezelés** — szezonális zöldfelület-gondozás, hó- és síkosságmentesítés
6. **Technikai karbantartás** — épületgépészet, elektromos, HVAC rendszerek
7. **Mystery Shopping** — titkosvásárlói programok
8. **Hard FM** — kritikus rendszerek üzemfenntartása

## Ügyfélkör

Irodaházak, bevásárlóközpontok, ipari és logisztikai parkok, közintézmények — Magyarország teljes területén.

## Földrajzi lefedettség

Magyarország teljes területe, központtal Budapesten.
```

---

## ⚠️ Mit tegyél a `<head>`-ben szereplő placeholderekkel

A javításhoz három fájlt is kell biztosítani a domainen:

| Fájl | Méret | Miért kell |
|---|---|---|
| `/og-image.jpg` | 1200×630 px, < 1MB | LinkedIn / FB / WhatsApp link preview |
| `/logo.png` | min. 600×60 px transzparens | Google Knowledge Panel logó |
| `/favicon.svg` + PNG-k | 16, 32, 180 px | Böngésző fül, mobil home screen |

Ha még nincsenek, ezt a designerrel külön rendezzétek le — én sablon szerinti mérettel írtam be őket.

---

## 🤖 AI-search specifikus tippek (2026)

Túl a technikai SEO-n, az AI-keresési láthatósághoz tartalmi optimalizáció is kell. Néhány konkrét javaslat az Avenir esetére:

1. **Blog / Tudásbázis indítása** — minden AI-search modell prioritással idéz hosszabb, faktuális tartalmakból. Témajavaslatok:
   - "Hogyan válasszunk facility management szolgáltatót?"
   - "Mi a különbség a Hard FM és a Soft FM között?"
   - "Mit jelent a 24/7 diszpécseri készenlét a vagyonvédelemben?"
   - Mindegyik FAQ-szerűen, konkrét válaszokkal. **AI Overview-k pontosan ilyen formátumot keresnek.**

2. **Strukturált adatok bővítése** — minden új cikkhez `Article` + `BreadcrumbList` schema.

3. **Külső jelenlét** — Google Business Profile (ingyenes, kötelező lenne), LinkedIn céges oldal, ipari katalógusok (Magyar Facility Management Társaság — ha van tagság). Ezek mind növelik az AI-modellek confidence-ét, hogy a cég létezik és aktív.

4. **Rendszeres frissítés** — a hírek szekciót valóban használjátok. Akár havi 1 poszt is sokat segít.

5. **Külső backlinkek** — ipari portálok, tender-aggregátorok, sajtóhírek. AI-modellek pontosan azokat idézik, amelyekre sokan hivatkoznak.

---

## ✅ Telepítési checklist

Sürgősség szerint:

- [ ] **MA:** Új `<head>` blokk beillesztése (A pont)
- [ ] **MA:** `<noscript>` fallback a `<body>` tetejére (B pont)
- [ ] **EZEN A HÉTEN:** og-image.jpg, logo.png, favicon-set elkészítése + feltöltése
- [ ] **EZEN A HÉTEN:** robots.txt, sitemap.xml, llms.txt feltöltése a gyökérbe (C, D, E pont)
- [ ] **EZEN A HÉTEN:** [Google Search Console](https://search.google.com/search-console) regisztráció + sitemap beküldés
- [ ] **EZEN A HÉTEN:** [Bing Webmaster Tools](https://www.bing.com/webmasters) regisztráció
- [ ] **EZEN A HÉTEN:** [Google Business Profile](https://www.google.com/business/) létrehozás (Avenir Facility Kft. + 1039 Budapest cím + telefon + e-mail + nyitvatartás 24/7)
- [ ] **EZEN A HÓNAPBAN:** Pre-rendering bevezetése (2. szint) — ha az AI-search forgalom prioritás
- [ ] **HOSSZÚ TÁVON:** Blog / tudásbázis indítása FAQ-formátumú cikkekkel

---

## Mi jön a következő körben?

Ha jelzed, hogy mehet, ezt készítem el:

1. **EN / DE / ZH `T` objektumok** — fordítás, hogy ne csak a HU verzió legyen jó
2. **Adatvédelmi tájékoztató + ÁSZF** — GDPR-kompatibilis sablon Avenir tevékenységére szabva (vagyonvédelem, kameramegfigyelés, adatkezelés)
3. **Külön `/en/`, `/de/`, `/zh/` URL-ek** — architekturális javaslat, hogy a hreflang valóban működjön
4. **Pre-rendering script** — ha a 2. szint kell, írok egy Puppeteer-alapú static export szkriptet, amit a build-be tudtok illeszteni
