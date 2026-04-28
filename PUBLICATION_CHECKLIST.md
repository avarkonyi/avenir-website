# Publication Checklist — Avenir Facility Management

**Site:** https://www.afm.hu
**Audience:** internal pre-publication QA before Vercel production deploy
**Last updated:** 2026-04-29 (18. commit)

> See `DEPLOY_CHECKLIST.md` for env + DNS + DPO + Resend operational steps.
> This file is the **content/UX/SEO/A11y publication QA**.

---

## Content QA

### Legal pages (mind 4 locale × 3 page = 12 surfaces)

- [ ] `https://www.afm.hu/{hu,en,de,zh}/adatvedelem` — privacy policy renders correctly
- [ ] `https://www.afm.hu/{hu,en,de,zh}/aszf` — terms render correctly
- [ ] `https://www.afm.hu/{hu,en,de,zh}/impresszum` — impresszum renders correctly with all 9 sections (Cégadatok / Képviselő / Általános elérhetőség / Szabályozott szakma / Engedélyek / Felügyeleti hatóságok / Felelősségbiztosítás / Tárhelyszolgáltató / Szerzői jog)

### DPO data accuracy (privacy policy §3)

- [ ] Csegény Fanni name spelled correctly (HU surname-first, EN given-first)
- [ ] dpo@afm.hu visible, links to mailto: in HU and EN
- [ ] +36 70 622 6242 telefonszám visible
- [ ] Postai elérhetőség = 1039 Budapest, Királyok útja 291. B. ép. 15. ajtó (full address)
- [ ] NAIH-bejelentés említés ("megtette / folyamatban van" wording for HU; "has notified NAIH" for EN)

### Critical-data verification

- [ ] **Cégjegyzékszám** 01-09-328046 — visible in impresszum + privacy + ÁSZF + Footer
- [ ] **Adószám** 26395124-2-41
- [ ] **EU VAT** HU26395124
- [ ] **Allianz kötvényszám** 341633910 — in privacy §5 + ÁSZF §7 + impresszum §7
- [ ] **ISO 27001 cert** 988960032 — in privacy §13 + impresszum §7
- [ ] **ISO 9001 cert** 843579099 — in impresszum §7
- [ ] **Engedélyek 3+1**:
  - 01030-822/4926-7/2023 (őrzés-védés)
  - 01030-822/4927-3/2018 (biztonságtechnika)
  - 01030-822/4925-3/2018 (magánnyomozás)
  - AH/37595-14/2024-2 (nemzetbiztonsági névjegyzék)
- [ ] **Két telefonszám pattern** working:
  - Company general `+36 70 316 8218` in Footer + Contact + impresszum §3
  - Kovács Attila ügyvezető `+36 70 312 5868` in impresszum §2
  - Csegény Fanni DPO `+36 70 622 6242` in privacy §3 + impresszum N/A (DPO not in impresszum)

### Adatfeldolgozók (privacy §5)

- [ ] **Resend** — listed as "Plus Five Five, Inc." (legal name) with trade-name "Resend"; address 2261 Market Street #5039, San Francisco
- [ ] **Vercel** — listed as Vercel Inc.; address 440 N Barranca Avenue #4133, Covina, CA (NEM "One World Trade Center NYC")
- [ ] **Neon** — listed as Neon, LLC (Databricks affiliate); address 160 Spear Street, Suite 1300, San Francisco
- [ ] All 3 marked DPF-certified with Art. 28 DPA + Art. 46 SCC fallback wording

### Contact form (`/hu#contact` etc.)

- [ ] Magánnyomozói warning visible above form (amber/yellow ⚠️ box)
- [ ] Warning links to `/hu/aszf#magannyomozas` or `/en/aszf#private-investigation` per locale
- [ ] Layered notice visible above Send button (small grey text, links to /hu/adatvedelem or /en/adatvedelem)
- [ ] Success message (after submit) mentions Privacy Policy
- [ ] sr-only labels + aria-invalid + aria-describedby + role="alert" on all 6 form fields

---

## SEO QA

### JSON-LD (verify via Google Rich Results Test)

- [ ] Organization schema: legalName, alternateName, taxID, vatID, foundingDate, address, contactPoint, hasCredential
- [ ] ProfessionalService schema: serviceType, knowsAbout, hasCredential
- [ ] ItemList schema: 8 services with positions + provider reference
- [ ] FAQPage schema: 5 Q&A pairs
- [ ] WebSite schema: publisher reference
- [ ] EducationalOccupationalCredential per ISO cert (2 items)
- [ ] **Per-page WebPage + BreadcrumbList** on /adatvedelem, /aszf, /impresszum
- [ ] No "errors" reported by Rich Results Test
- [ ] Optional non-critical issues acceptable (sameAs, postOfficeBoxNumber, etc.)

### Sitemap + robots

- [ ] `/sitemap.xml` lists 17 URLs (1 root + 4 locale homepages + 12 legal pages)
- [ ] All sitemap entries have correct hreflang alternates for legal pages
- [ ] `/robots.txt` allows AI bots (GPTBot, ClaudeBot, PerplexityBot, CCBot, Google-Extended, anthropic-ai)
- [ ] No `Disallow:` lines blocking critical content

### OG image

- [ ] `/{hu,en,de,zh}/opengraph-image` returns 1200×630 PNG
- [ ] ZH variant uses Noto Sans SC font (no �  squares)
- [ ] Dark navy background + brand-red accent visible
- [ ] Hero h1a + h1b text rendered correctly

### Canonical + hreflang

- [ ] Each locale homepage has `<link rel="canonical" href="https://www.afm.hu/{locale}">`
- [ ] hreflang alternates point to all 4 locales + x-default → /hu

---

## A11y QA

### Keyboard navigation

- [ ] Tab through homepage: Nav → CTA → Hero CTA → About → Services → ... → Footer
- [ ] Hamburger menu (mobile): aria-expanded toggles, aria-controls works
- [ ] Contact form: Tab through all 6 inputs in correct order (skip honeypot)
- [ ] Send button focusable + Enter submits

### Screen reader (test with VoiceOver / NVDA)

- [ ] Form field labels announced (sr-only labels visible to screen readers)
- [ ] Error messages announced via role="alert"
- [ ] Avenir logo has alt text "Avenir Facility Management"
- [ ] Hero background image has localized alt text (t.hero.bgAlt)

### Color contrast

- [ ] Body text meets WCAG AA (4.5:1)
- [ ] Footer fine print rgba(255,255,255,0.45) over #070F1E — borderline (M8 finding, post-deploy bump to 0.55)
- [ ] Brand-red (#D1172E) on white meets AA

---

## UX QA

### Mobile responsive

- [ ] Test at 375×667 (iPhone SE), 414×896 (iPhone XR), 768×1024 (iPad)
- [ ] No horizontal overflow on any viewport
- [ ] Hamburger menu shows correctly on <800px
- [ ] Contact form usable on mobile (touch-friendly button sizes ≥ 44px)

### Performance

- [ ] LCP target < 2.5s (mobile 4G)
- [ ] CLS < 0.1
- [ ] FID < 100ms
- [ ] Hero WebP loads under 50 KB on mobile, ~33 KB on desktop
- [ ] Fonts: Geist + Geist Mono + Barlow Condensed self-hosted via next/font

### Cross-browser

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest, including iOS 17+)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS) — autoComplete works on Contact form

---

## Compliance QA

### GDPR Art. 13 inventory

- [ ] Privacy policy §1 — Controller identified
- [ ] Privacy policy §2 — Authorised representative identified
- [ ] Privacy policy §3 — DPO identified with NAIH notification status
- [ ] Privacy policy §4 — All 3 purposes (4.1 + 4.2 + 4.3) + exclusion (4.4) listed with legal basis + retention
- [ ] Privacy policy §5 — All 3 processors with Art. 28 DPA + transfer mechanism
- [ ] Privacy policy §6 — International transfer disclosure (Schrems-II conservative)
- [ ] Privacy policy §7 — Cookie disclosure (audit-pending acknowledged)
- [ ] Privacy policy §8 — All Art. 12-22 rights listed
- [ ] Privacy policy §9 — Automated decision-making explicitly disclaimed
- [ ] Privacy policy §10 — DSAR procedure
- [ ] Privacy policy §11 — Remedies (NAIH + court)
- [ ] Privacy policy §12 — Breach notification 72h commitment
- [ ] Privacy policy §13 — ISO 27001 + Art. 32 measures
- [ ] Privacy policy §14 — Modification + version history

### Hungarian E-Commerce Act (Ekertv. 4. §)

- [ ] Impresszum §1 — Cégadatok (legal name, registration, tax, address)
- [ ] Impresszum §2 — Képviselő (representative)
- [ ] Impresszum §3 — Általános elérhetőség (general contact)
- [ ] Impresszum §4 — Szabályozott szakma (regulated profession, with BM-rendelet reference)
- [ ] Impresszum §8 — Tárhelyszolgáltató (hosting provider Vercel)
- [ ] Footer — cégjegyzékszám visible

### B2B vs B2C

- [ ] ÁSZF §1 — explicit "B2B-only client base" assertion
- [ ] ÁSZF §10 — fogyasztóvédelmi-kötelezettségek nem alkalmazandók
- [ ] Contact form — magánnyomozói warning addresses common B2B + special-data risk

---

## Sign-off

When all checkboxes above are ✅, the site is publication-ready. Sign-off rests with:

- [ ] **Andras** (project owner / managing director) — content + UX
- [ ] **Csegény Fanni** (DPO) — privacy policy review (post-NAIH-bejelentés)
- [ ] **Hungarian counsel** (post-deploy) — LEGAL_REVIEW_PENDING markers
- [ ] **Optional Codex 2** — final structured-data + JSON-LD sanity check via Rich Results Test
