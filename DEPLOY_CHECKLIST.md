# Deploy Checklist — Avenir Facility Management

**Site:** https://www.afm.hu
**Stack:** Next.js 16 + React 19 + Drizzle (Neon Postgres) + Resend (email) + Vercel (hosting)
**Last updated:** 2026-04-29 (18. commit)

---

## PRE-DEPLOY (the user / Andras must do BEFORE production deploy)

### Email + DPO

- [x] `dpo@afm.hu` email-alias beállítva az email-szolgáltatónál (redirect Csegény Fanni inboxára) — done 2026-04-29
- [ ] **NAIH-bejelentés** Csegény Fanni mint DPO-ról az Infotv. 25/L. § szerint, Ügyfélkapun (`https://www.naih.hu/online`) — folyamatban 2026-04-29
- [ ] Csegény Fanni GDPR-tanfolyam — 2026 június (Art. 37(5) "szakértői szint" gyakorlati alapú; a tanfolyam BONUS, NEM feltétel)

### Resend transactional email setup

Lásd `ENV.md` "Resend setup (production)" szakasz.

- [ ] Resend dashboard: Domain `notify.afm.hu` hozzáadva (Domains tab)
- [ ] Servergarden DNS Zone Editor: SPF + DKIM + DMARC records `notify.afm.hu` subdomain-re (NEM root!)
- [ ] Resend domain verified state (✓ green)
- [ ] Vercel Project Settings → Environment Variables (Production scope):
  - [ ] `RESEND_API_KEY` = (production key)
  - [ ] `RESEND_FROM_EMAIL` = `notify@notify.afm.hu`
  - [ ] `RESEND_NOTIFY_TO` = `info@afm.hu`
  - [ ] `DATABASE_URL` = Neon production pooled URL
  - [ ] `DATABASE_URL_UNPOOLED` = Neon production unpooled URL (drizzle-kit migrations)
  - [ ] `ALLOWED_ORIGINS` = (optional override; default `https://www.afm.hu, https://afm.hu`)

### Vercel + DNS

- [x] `vercel.json` includes `{"regions": ["fra1"]}` — done in 18. commit
- [ ] Vercel Project link to GitHub repo `avarkonyi/avenir-website`
- [ ] Vercel Production branch = `main`
- [ ] Custom domain `www.afm.hu` linked
- [ ] Apex domain `afm.hu` redirects to `www.afm.hu`
- [ ] DNS A/CNAME records propagated (24-48h after change)
- [ ] HTTPS cert auto-provisioned by Vercel (Let's Encrypt)

### Database

- [ ] Neon production project provisioned (EU AWS Frankfurt region — `eu-central-1`)
- [ ] Drizzle migrations applied to production: `npm run db:migrate` (with `DATABASE_URL_UNPOOLED` pointing at production)
- [ ] Seed data applied: `npm run db:seed` (1×, idempotent)
- [ ] Certifications data verified: `npm run db:update-certs` (if any cert metadata changed since last seed)

---

## POST-DEPLOY VERIFY (within 1 hour of go-live)

### Smoke tests

- [ ] `curl -I https://www.afm.hu` → 200, security headers present (X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy)
- [ ] `curl https://www.afm.hu/sitemap.xml` → 17 URLs (1 root + 4 locales + 12 legal pages)
- [ ] `curl https://www.afm.hu/robots.txt` → AI bot allowlist present
- [ ] Browse https://www.afm.hu/hu — homepage renders, Hero WebP loads, JSON-LD validates in Google Rich Results Test
- [ ] Browse https://www.afm.hu/hu/adatvedelem, /aszf, /impresszum — all 200, content correct
- [ ] Browse https://www.afm.hu/foo (no-match) → branded 404
- [ ] Browse https://www.afm.hu/xx/adatvedelem (invalid locale) → branded 404
- [ ] Submit a test message via the contact form (real email expected at info@afm.hu)
- [ ] Verify message appears in Neon DB `messages` table

### P-actions (per privacy policy 6. szakasz Schrems-II claim)

- [ ] **P1 — DPF on-screen verify** for all 3 processors at https://www.dataprivacyframework.gov/list:
  - [ ] Plus Five Five, Inc. ("Resend") — active certification, HR/non-HR scope as needed
  - [ ] Vercel Inc. — active certification
  - [ ] Databricks, Inc. (covering Neon, LLC) — active certification
- [ ] **P2 — Vercel EU-region verify** in Vercel dashboard (Project → Functions → Region: Frankfurt fra1)
- [ ] **P3 — Real cookie audit** in browser DevTools:
  - [ ] Open https://www.afm.hu/hu in Chrome/Firefox
  - [ ] DevTools → Application → Cookies
  - [ ] Document all cookies set (name, domain, expiry, secure/httpOnly flags)
  - [ ] Update `lib/i18n/{hu,en,de,zh}.ts` privacy policy §7 cookie section if any analytics/marketing cookies appear
- [ ] **P4 — Consistency review** — read through all 4 locale × 3 legal page surfaces; ensure §6 third-country wording matches actual provider configuration

### SEO

- [ ] Submit https://www.afm.hu/sitemap.xml to Google Search Console
- [ ] Submit to Bing Webmaster Tools
- [ ] Verify hreflang tags via Search Console "International Targeting" report
- [ ] Trigger Google's mobile-friendly test (PageSpeed Insights)
- [ ] Lighthouse audit: target Performance ≥ 90, Accessibility ≥ 95, Best Practices = 100, SEO = 100

---

## LEGAL_REVIEW_PENDING markers (post-deploy lawyer review)

The following content is published with `LEGAL_REVIEW_PENDING_*` annotations in i18n source comments and **may need refinement** based on counsel review post-deploy:

- **`LEGAL_REVIEW_PENDING_DE`** in `lib/i18n/de.ts` — DE machine-grade translations of privacy policy + terms + impresszum + 404/error. Authoritative text remains Hungarian per privacy policy §intro.
- **`LEGAL_REVIEW_PENDING_ZH`** in `lib/i18n/zh.ts` — same for Chinese.
- **`LEGAL_REVIEW_PENDING`** general flag for HU + EN privacy policy 1.0 — the entire structure was drafted in a 4-AI synthesis (Claude + 2× ChatGPT Codex + parallel review). Publishable but a Hungarian data-protection lawyer review post-deploy is recommended for:
  - DPO independence assessment (Csegény Fanni — non-executive non-decision-maker, Art. 38(6) clear, but document the assessment)
  - Retention-clock interpretive choices (Ptk. 6:22 vs sector-specific limitations)
  - Schrems-II §6 text (currently conservative DPF + SCC + supplementary measures — counsel may want narrower or broader scope per actual data flows)
  - ÁSZF §10 + §12 B2B-only assertions (potential corner cases with sole-trader prospects)

These are NOT deploy-blockers — they are content refinements that strengthen legal posture.

---

## POST-DEPLOY 19. commit candidates

**Separate notices** (privacy policy §intro mentions "separate notices"):

- [ ] CCTV privacy notice (clients' premises) — required for ongoing on-site monitoring
- [ ] Private investigation privacy notice (Art. 9 + 10 special-category processing)
- [ ] Employee privacy notice (HR data processing)

**Internal records:**

- [ ] ROPA / belső adatkezelési nyilvántartás (Art. 30) — Word/PDF
- [ ] DPIA template for CCTV + private investigation (Art. 35)

**Asset uploads:**

- [ ] 4 hatósági PDF feltöltés `public/legal/` mappába (B2B procurement trust signal):
  - vagyonvedelmi-engedely-2023.pdf
  - biztonsagtechnika-bejelentes-2018.pdf
  - magannyomozas-bejelentes-2018.pdf
  - ah-nemzetbiztonsagi-2024.pdf
- [ ] ISO 9001 + ISO 27001 PDF mind a 17. commit-ban van, megerősítve
- [ ] Allianz felelősségbiztosítás kötvény PDF (opcionális, a kötvényszám 341633910 már szerepel)

**Other refinements:**

- [ ] Layered notice design: short (Contact form) + detailed (privacy page) — already done; review post-deploy if user feedback indicates
- [ ] News modal keyboard a11y refactor (Codex deferred finding)
- [ ] Footer color-contrast bump (M8: 0.45 → 0.55 for AAA-safe)
- [ ] CSP header (next.config.ts comment notes deferred for post-deploy commit)
- [ ] Bundle analyzer + per-route LCP measurement
