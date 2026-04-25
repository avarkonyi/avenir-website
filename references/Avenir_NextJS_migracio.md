# Avenir FM — Next.js migrációs terv

**Dátum:** 2026. április 24.
**Cél:** A jelenlegi kliens-oldali React SPA átalakítása szerveroldali renderelésre (SSR/SSG) Next.js-szel, hogy az AI-keresők és Google is teljes értékűen lássák a tartalmat.

---

## TL;DR — döntés

**Menj Next.js-re, ne pre-rendering-re.** Két ok:

1. A jelenlegi single-file bundle struktúra szokatlan, pre-renderelni körülményes, és a 4 nyelvet (HU/EN/DE/ZH) csak Next.js i18n routing tudja megfelelően kezelni külön URL-eken (`/`, `/en/`, `/de/`, `/zh/`) — ami a `hreflang` SEO működéséhez **kötelező**.
2. A meglévő React kódod (a `T` translations + komponensek) **kb. 90%-ban átvihető** Next.js-be. Ez nem újraírás, hanem áthelyezés egy modern keretrendszerbe.

A **pre-rendering** csak akkor tartható alternatíva, ha _minden áron_ a jelenlegi bundle-architektúrát szeretnéd megőrizni — de ennek nincs jó indoka.

---

## Migrációs idő- és költségbecslés

| Forgatókönyv | Idő | Költség |
|---|---|---|
| **Tapasztalt React/Next dev** kezedben tartva | 1–2 nap | 200–400 EUR (vagy 80–150k HUF tipikus magyar piacon) |
| **Te magad + Claude Code** asszisztens | 4–6 óra | 0 — csak Claude Pro/Max előfizetés (20–100 USD/hó) |
| **Junior dev** Upwork/Fiverr | 3–5 nap | 150–300 EUR |
| **Hosting (Vercel)** havi | — | **0 EUR** ingyenes szinten elég Avenir traffic-hoz; ha skálázódik, ~20 USD/hó |
| **Domain afm.hu** éves | — | ~5 000 HUF/év |

> 💡 **Erős javaslatom: használd Claude Code-ot.** Te megnyitod a terminált, megadod a meglévő bundle fájlt, leírod a célt, és a Claude Code agent **maga elvégzi a teljes migrációt** — fájlokat hoz létre, csomagokat telepít, deployol. Az alábbi tervet **közvetlenül oda tudod adni neki**, és lépésről lépésre megcsinálja. Ehhez kelleni fog Claude Code telepítése (lent).

---

## Mit jelent a Next.js gyakorlatban — röviden

A jelenlegi felépítésed:
```
Avenir_FM_Website.html (önálló fájl)
├── Beépített CSS (fonts, styling)
├── Beépített React (CDN-ről)
├── Beépített app.js (~58 KB, 8 komponens, T translations)
└── <div id="root"></div> (üres, kliensben tölti fel)
```

A Next.js verzió:
```
avenir-website/
├── app/
│   ├── [locale]/                    # /, /en, /de, /zh dinamikusan
│   │   ├── page.tsx                 # Főoldal (Hero + összes szekció)
│   │   ├── impresszum/page.tsx      # Impresszum oldal
│   │   ├── adatvedelem/page.tsx     # GDPR (később)
│   │   ├── aszf/page.tsx            # ÁSZF (később)
│   │   └── layout.tsx               # Közös layout (nav, footer)
│   ├── api/
│   │   └── contact/route.ts         # Ajánlatkérő űrlap backendje
│   ├── robots.txt
│   ├── sitemap.xml
│   └── llms.txt
├── components/
│   ├── Hero.tsx                     # áthozott komponens
│   ├── Stats.tsx
│   ├── About.tsx
│   ├── Services.tsx
│   ├── References.tsx
│   ├── News.tsx
│   ├── Career.tsx
│   ├── Contact.tsx
│   ├── Footer.tsx
│   └── Nav.tsx
├── lib/
│   ├── i18n/
│   │   ├── hu.ts                    # T.hu translations
│   │   ├── en.ts
│   │   ├── de.ts
│   │   └── zh.ts
│   └── seo.ts                       # Metadata helper-ek
├── public/
│   ├── og-image.jpg
│   ├── logo.png
│   ├── favicon.svg
│   └── apple-touch-icon.png
├── package.json
├── next.config.js
└── tsconfig.json
```

A különbség: **minden szöveg már a HTML-ben van**, mire a kliens letölti. A React csak az interaktív részeket veszi át (űrlap, modal, scroll-animáció). A statikus tartalmat (Hero, Szolgáltatások, Rólunk, Kapcsolat) **a szerver már kész HTML-ként küldi**. Ezt látja Google, ChatGPT, Perplexity, Claude.

---

## Lépésről lépésre — migrációs terv

### 0. lépés — Claude Code telepítése (ha ezt választod)

```bash
# macOS / Linux
curl -fsSL claude.ai/install.sh | bash

# vagy npm-mel
npm install -g @anthropic-ai/claude-code
```

Indítsd el egy üres mappában, és add oda a feladatleírást:

```bash
mkdir avenir-website && cd avenir-website
claude
```

Majd a chat-ben:
> "Migráld az Avenir_FM_Website.html-t Next.js 14 App Routerre, i18n routing-gal (hu/en/de/zh), Tailwind nélkül (inline style maradhat). A T translations-t lib/i18n/-be tedd. A SEO-csomagot (Organization JSON-LD, FAQPage, og-tags) tedd be. A kapcsolati űrlapnak legyen /api/contact route, ami Resend-del küldi az e-mailt info@afm.hu-ra. Deployolj Vercelre."

Claude Code maga elvégzi az alábbi lépéseket. Az 1–8. lépéseket csak akkor kell magadnak végigcsinálni, ha _nem_ Claude Code-ot használsz.

---

### 1. lépés — Új projekt létrehozása

```bash
npx create-next-app@latest avenir-website \
  --typescript \
  --app \
  --no-tailwind \
  --no-src-dir \
  --import-alias "@/*"

cd avenir-website
```

> Tailwind-et szándékosan NEM választasz, mert a meglévő kódod inline `style={{...}}`-t használ. Megtartható.

### 2. lépés — i18n routing beállítása

Hozd létre a `middleware.ts`-t a projekt gyökerében:

```typescript
import { NextRequest, NextResponse } from "next/server";

const LOCALES = ["hu", "en", "de", "zh"];
const DEFAULT_LOCALE = "hu";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hasLocale = LOCALES.some(
    (l) => pathname.startsWith(`/${l}/`) || pathname === `/${l}`
  );
  if (hasLocale) return NextResponse.next();

  // Ha nincs locale az URL-ben, alapértelmezett HU
  if (pathname === "/") {
    return NextResponse.rewrite(new URL("/hu", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
```

Hozd létre a `app/[locale]/layout.tsx` fájlt:

```tsx
import { Metadata } from "next";
import { ReactNode } from "react";
import { translations } from "@/lib/i18n";

export async function generateStaticParams() {
  return [{ locale: "hu" }, { locale: "en" }, { locale: "de" }, { locale: "zh" }];
}

export async function generateMetadata({
  params,
}: { params: { locale: string } }): Promise<Metadata> {
  const t = translations[params.locale] || translations.hu;
  return {
    title: "Avenir Facility Management Kft.",
    description: t.hero.sub,
    alternates: {
      canonical: `https://www.afm.hu/${params.locale}`,
      languages: {
        hu: "https://www.afm.hu/hu",
        en: "https://www.afm.hu/en",
        de: "https://www.afm.hu/de",
        zh: "https://www.afm.hu/zh",
      },
    },
    openGraph: {
      title: "Avenir Facility Management",
      description: t.hero.sub,
      url: `https://www.afm.hu/${params.locale}`,
      images: ["https://www.afm.hu/og-image.jpg"],
    },
  };
}

export default function LocaleLayout({
  children,
  params,
}: { children: ReactNode; params: { locale: string } }) {
  return (
    <html lang={params.locale}>
      <body>{children}</body>
    </html>
  );
}
```

### 3. lépés — Translations áthelyezése

Hozd létre a `lib/i18n/index.ts`-t:

```typescript
import { hu } from "./hu";
import { en } from "./en";
import { de } from "./de";
import { zh } from "./zh";

export const translations = { hu, en, de, zh } as const;
export type Locale = keyof typeof translations;
export type Translation = typeof hu;
```

A `lib/i18n/hu.ts` egyszerűen az előző körben adott `T.hu` objektum:

```typescript
export const hu = {
  nav: { about: "Rólunk", services: "Szolgáltatások", /* ... */ },
  hero: { /* ... */ },
  // (a teljes T.hu az előző drop-in csomagból)
} as const;
```

A többi nyelv (en/de/zh) ugyanígy a meglévő bundle-ből kimásolva.

### 4. lépés — Komponensek áthelyezése

A jelenlegi `app.js`-ben minden komponens (`Hero`, `Stats`, `About`, `Services`, stb.) egy fájlban van. Mindegyiket vágd ki külön `.tsx` fájlba a `components/` mappába. Példa:

```tsx
// components/Hero.tsx
"use client"; // csak ha interaktivitás van
import { Translation } from "@/lib/i18n";

export function Hero({ t }: { t: Translation }) {
  return (
    <section style={{ /* meglévő inline style */ }}>
      <h1>{t.hero.h1a} <span style={{ color: "#D1172E" }}>{t.hero.h1b}</span></h1>
      <p>{t.hero.sub}</p>
    </section>
  );
}
```

> **Fontos:** csak azokra a komponensekre tedd a `"use client"` direktívát, amelyek interaktívak (Contact form, Nav scroll, News modal). A statikus szekciók (Hero, Stats, Services, References) **server component**-ek maradnak — ez a SEO előnye.

### 5. lépés — Főoldal összeszerelése

```tsx
// app/[locale]/page.tsx
import { Hero } from "@/components/Hero";
import { Stats } from "@/components/Stats";
import { About } from "@/components/About";
import { Services } from "@/components/Services";
import { References } from "@/components/References";
import { News } from "@/components/News";
import { Career } from "@/components/Career";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { translations } from "@/lib/i18n";
import { OrganizationLD, FAQPageLD, ServiceLD } from "@/lib/seo";

export default function Home({
  params,
}: { params: { locale: string } }) {
  const t = translations[params.locale as keyof typeof translations] || translations.hu;
  return (
    <>
      <OrganizationLD />
      <FAQPageLD locale={params.locale} />
      <ServiceLD locale={params.locale} />
      <Hero t={t} />
      <Stats t={t} />
      <About t={t} />
      <Services t={t} />
      <References t={t} />
      <News t={t} locale={params.locale} />
      <Career t={t} />
      <Contact t={t} />
      <Footer t={t} />
    </>
  );
}
```

### 6. lépés — JSON-LD beépítése

```tsx
// lib/seo.tsx
export function OrganizationLD() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Avenir Facility Management Kft.",
          // (a teljes Organization schema az előző SEO csomagból)
        }),
      }}
    />
  );
}

// FAQPageLD, ServiceLD, LocalBusinessLD ugyanígy
```

### 7. lépés — Kapcsolati űrlap API route

```typescript
// app/api/contact/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, company, email, phone, service, message } = body;

  if (!name || !email) {
    return NextResponse.json({ error: "Hiányos adatok" }, { status: 400 });
  }

  await resend.emails.send({
    from: "noreply@afm.hu",
    to: "info@afm.hu",
    subject: `Új ajánlatkérés — ${name}${company ? ` (${company})` : ""}`,
    html: `
      <h2>Új ajánlatkérés a weboldalról</h2>
      <p><strong>Név:</strong> ${name}</p>
      <p><strong>Cégnév:</strong> ${company || "—"}</p>
      <p><strong>E-mail:</strong> ${email}</p>
      <p><strong>Telefon:</strong> ${phone || "—"}</p>
      <p><strong>Érdeklődési terület:</strong> ${service || "—"}</p>
      <p><strong>Üzenet:</strong></p>
      <p>${message || "—"}</p>
    `,
  });

  return NextResponse.json({ ok: true });
}
```

A meglévő `Contact` komponensben pedig az `handleSubmit`-et át kell írni:

```tsx
const handleSubmit = async (e) => {
  e.preventDefault();
  const res = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form),
  });
  if (res.ok) setSent(true);
};
```

> **E-mail küldéshez Resend** ([resend.com](https://resend.com)) ingyenes szinten 3 000 e-mail/hó. Vagy SendGrid, Postmark, Mailgun — bármelyik. Kell domain-ellenőrzés (SPF/DKIM az afm.hu-n), ezt a Resend dashboard végigvezeti.

### 8. lépés — Deploy Vercelre

```bash
# Vercel CLI
npm install -g vercel
vercel login
vercel --prod
```

Vagy GitHub-on keresztül: kommitold a kódot, kösd be a Vercel dashboard-ban az afm.hu domaint. **Minden push automatikusan deployol.**

A `RESEND_API_KEY` env változót a Vercel projekt-beállításokban add hozzá.

---

## A meglévő bundle áthozható darabjai

A `Avenir_FM_Website.html` bundle-ben az alábbiak **változatlanul használhatók** a Next.js verzióban:

| Mit | Hogyan |
|---|---|
| `T` translations objektum (hu/en/de/zh) | Másold be a `lib/i18n/hu.ts`, `en.ts`, stb. fájlokba |
| Inline `style={{...}}` szabályok | Maradhatnak változatlanul a komponensekben |
| `Icon` komponens (SVG ikonok) | Másold át a `components/Icon.tsx`-be |
| Animációk (`useEffect`-tel működnek) | `"use client"` direktívával működnek a megfelelő komponensekben |
| Színkonstansok (`#0B1E3E`, `#D1172E`) | Tedd CSS változókba a `app/globals.css`-ben |

Amit **el kell hagyni** a meglévő bundle-ből:
- Custom `__bundler/manifest` és `__bundler/template` tudatos asset-bundling logika — Next.js ezt önmagától intézi
- Asset URL-feloldó script — Next.js `public/` mappa intézi
- `unpkg.com`-ról jövő React + Babel CDN-import — Next.js maga csomagolja

---

## Hosting megfontolások

### Vercel (legegyszerűbb)
- ✅ Next.js a Vercel terméke, optimalizált
- ✅ Ingyenes szint: 100 GB sávszélesség/hó (Avenir-traffic-hoz bőven elég)
- ✅ Custom domain (afm.hu), SSL, CDN ingyen
- ✅ Auto-deploy GitHub push-ra
- ⚠️ Adatok kívül EU-n: a free szinten US régióban tárol — GDPR-szempont, ha érzékeny adat (kapcsolati űrlap üzenetei) tárolásra kerül. Az űrlap üzenetét mi e-mailbe küldjük, _nem_ tároljuk → GDPR szempontjából rendben.

### Servergarden (jelenlegi tárhelyszolgáltatóban marad)
- ✅ EU-ban marad minden adat
- ✅ Magyar partner, magyar számlázás
- ⚠️ Next.js futtatáshoz kell Node.js hosting csomag (nem statikus)
- ⚠️ Build/deploy folyamat manuálisabb

> **Javaslat:** Vercel a frontend-hez (statikus + edge funkciók), és tartsd meg a Servergarden-t e-mail / DNS kezelésre. A Resend pedig az e-mail küldést intézi külön, dedikáltan.

### Önálló VPS (Hetzner, OVH)
- Csak akkor van értelme, ha mégis együtt akarsz mindent egy helyen tartani. Több munkával jár (CI/CD beállítása), egyébként nincs előnye.

---

## A pre-rendering alternatíva — őszintén

Ha **nem** akarsz Next.js-re menni, a pre-rendering így néz ki:

1. Telepíted a `puppeteer`-t
2. Írsz egy szkriptet, ami:
   - Betölti az `Avenir_FM_Website.html`-t headless Chrome-ban
   - Vár, amíg a React renderel (pl. `await page.waitForSelector('section[id="contact"]')`)
   - Kiveszi a `<div id="root">` rendererelt HTML tartalmát
   - Visszaírja a fájlba a `<div id="root">...rendererelt tartalom...</div>`-be
3. Ezt minden build-kor lefuttatod

**Miért nem jó megoldás Avenir esetében:**
- Csak EGY nyelv lesz pre-rendererelve (a nyelvváltó kliensoldali state, nem URL alapú)
- A `hreflang` SEO **nem fog működni**, mert nincs külön URL nyelvenként
- A bundle struktúrát nem érdemes megőrizni — már most is custom megoldás
- Hosszú távon karbantarthatatlan: minden változáskor manuálisan kell pre-renderelni

**Ha mégis ezt választod:** szólj és írok egy 50 soros Puppeteer szkriptet hozzá. De jobban jársz Next.js-szel.

---

## Mit tudok még csinálni a következő körben

1. **Ha Claude Code-dal csinálnád meg magad:** írok egy konkrét, lépésről-lépésre prompt-szekvenciát, amit közvetlenül beilleszthetsz a Claude Code session-be. A migráció így 4–6 óra alatt megvan, fél napos meló max.

2. **Ha junior dev-vel csináltatnád:** írok egy hivatalos technikai brief-et magyar nyelven, becsült órarátával — odaadhatod Upwork/Fiverr/magyar dev cégnek.

3. **Adatvédelmi tájékoztató + ÁSZF:** GDPR-kompatibilis sablon az Avenir tevékenységére szabva (vagyonvédelem, kameramegfigyelés, adatkezelés). Ezekre az új weboldalon mindenképpen szükség lesz.

4. **EN / DE / ZH fordítások:** ha a HU verzió véglegesedik, kiterjesztem a 4 nyelvre.

Szólj, melyik irányba mész, és segítek a konkrét következő lépésben.
