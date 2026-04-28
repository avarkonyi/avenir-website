# Contact form mikroszöveg — DRAFT 2.0

**Hatály:** 2026.04.28
**Verzió:** 1.0
**Komponens:** components/Contact.tsx (kód-fázisban implementálva)

---

## VII.1 — MAGÁNNYOMOZÓI / KÜLÖNLEGES ADAT WARNING (form fölé, fix sor)

> ⚠️ **Helye a UI-ban:** a contact form `<form>` tag fölé, fix sor minden locale-en. Visual: kis amber/yellow ⚠️ ikon + szöveg.

### HU
> ⚠️ **Kérjük, az üzenetmezőben ne küldjön különleges adatot, büntetőjogi adatot, minősített adatot, üzleti titkot vagy harmadik személyre vonatkozó részletes magánéleti információt.** Ilyen ügyekben külön szerződéses és adatvédelmi egyeztetés szükséges. **A részletes feltételekért lásd: [ÁSZF 4. szakasz](/hu/aszf#magannyomozas).**

### EN
> ⚠️ **Please do not submit special categories of data, criminal-conviction data, classified data, trade secrets, or detailed private-life information about third parties via this contact form.** Such matters require a separate engagement and data-protection consultation. **For details see: [Terms of Use, section 4](/en/aszf#private-investigation).**

### DE (machine-grade — kód-fázisban véglegesítve)
> ⚠️ Bitte übermitteln Sie über das Nachrichtenfeld keine besonderen Datenkategorien, strafrechtlichen Daten, klassifizierten Daten, Geschäftsgeheimnisse oder detaillierten Privatlebensinformationen über Dritte. Solche Angelegenheiten erfordern eine gesonderte Vertrags- und Datenschutzabstimmung. Details siehe: [Nutzungsbedingungen, Abschnitt 4](/de/aszf#private-investigation).

### ZH (machine-grade — kód-fázisban véglegesítve)
> ⚠️ 请勿通过本表单提交特殊类别数据、刑事记录数据、机密数据、商业秘密或涉及第三方详细私人信息的内容。此类事项需另行签署合同并进行数据保护协商。详情请参阅：[使用条款 第4节](/zh/aszf#private-investigation)。

> *(IMP-9 megjegyzés: a DE + ZH ÁSZF page i18n-ban a §4 anchor-id `private-investigation` (egységesen az EN-nel), mert a DE/ZH gépi-fordítás az EN base-ből készül a kód-fázisban. A HU-ÁSZF page anchor-id `magannyomozas`. Ennek megfelelően a per-locale href:
> - HU: `/hu/aszf#magannyomozas`
> - EN: `/en/aszf#private-investigation`
> - DE: `/de/aszf#private-investigation`
> - ZH: `/zh/aszf#private-investigation`)*

---

## VII.2 — LAYERED NOTICE (a Send gomb felett, kétsoros mikroszöveg)

> **Helye a UI-ban:** a "Ajánlatkérés küldése" gomb FELETT, kis-betűs (12-13px) szürke szöveg.

### HU
> Az „Ajánlatkérés küldése" gombra kattintva tudomásul veszi, hogy adatait a GDPR 6. cikk (1) bek. b) pontja (szerződéskötés-előkészítés természetes személyek esetén), illetve f) pontja (jogos érdek B2B kapcsolattartók esetén), valamint visszaélés-megelőzés céljából a GDPR 6. cikk (1) bek. f) pontja alapján kezeljük. A teljes Adatvédelmi tájékoztató itt érhető el: [Adatvédelem](https://www.afm.hu/hu/adatvedelem).

### EN
> By clicking "Send Request" you acknowledge that we process your data on the basis of GDPR Art. 6(1)(b) (pre-contractual steps for natural persons) or Art. 6(1)(f) (legitimate interest for B2B contact persons), and on Art. 6(1)(f) for abuse-prevention purposes. The full Privacy Policy is available here: [Privacy Policy](https://www.afm.hu/en/adatvedelem).

### DE (machine-grade)
> Mit Klick auf „Anfrage senden" nehmen Sie zur Kenntnis, dass wir Ihre Daten gemäß DSGVO Art. 6(1)(b) (vorvertragliche Maßnahmen bei natürlichen Personen) bzw. Art. 6(1)(f) (berechtigtes Interesse bei B2B-Ansprechpartnern) sowie zur Missbrauchsverhinderung gemäß Art. 6(1)(f) verarbeiten. Vollständige Datenschutzerklärung: [Datenschutz](https://www.afm.hu/de/adatvedelem).

### ZH (machine-grade)
> 点击"发送询价"即表示您知悉我们依据GDPR第6(1)(b)条（针对自然人的合同前步骤）或第6(1)(f)条（针对B2B联系人的合法利益），以及第6(1)(f)条（用于防止滥用）来处理您的数据。完整隐私政策请参阅：[隐私政策](https://www.afm.hu/zh/adatvedelem)。

---

## VII.3 — SUCCESS-MESSAGE KIEGÉSZÍTÉS (üzenet-küldés sikere után)

> **Helye a UI-ban:** a meglévő success-message kiegészítve egy plus-mondattal.

### HU
**Eredeti:** "Üzenetét megkaptuk. 2 munkanapon belül felvesszük Önnel a kapcsolatot."

**Új:** "Üzenetét megkaptuk. 2 munkanapon belül felvesszük Önnel a kapcsolatot. Adatait az [Adatvédelmi tájékoztatóban](https://www.afm.hu/hu/adatvedelem) leírtak szerint kezeljük."

### EN
**Original:** "We have received your message! We will be in touch shortly."

**New:** "We have received your message. We will be in touch within 2 business days. Your data is processed in accordance with our [Privacy Policy](https://www.afm.hu/en/adatvedelem)."

### DE (machine-grade)
**Neu:** "Wir haben Ihre Nachricht erhalten. Wir melden uns innerhalb von 2 Werktagen. Ihre Daten werden gemäß unserer [Datenschutzerklärung](https://www.afm.hu/de/adatvedelem) verarbeitet."

### ZH (machine-grade)
**新:** "我们已收到您的留言。我们将在2个工作日内与您联系。您的数据将依据我们的[隐私政策](https://www.afm.hu/zh/adatvedelem)进行处理。"

---

## I18n-keys minta a kód-fázishoz

```ts
form: {
  // existing keys...
  warningSpecialData: "⚠️ Kérjük, az üzenetmezőben ne küldjön különleges adatot...",
  warningAszfLink: "ÁSZF 4. szakasz",  // i18n-translatable link-text
  warningAszfHref: "/hu/aszf#magannyomozas",  // locale-prefixed anchor href
  layeredConsent: "Az „Ajánlatkérés küldése\" gombra kattintva tudomásul veszi...",
  layeredConsentLink: "Adatvédelem",  // i18n-translatable link-text
  layeredConsentHref: "/hu/adatvedelem",  // locale-prefixed href
  success: "Üzenetét megkaptuk...",  // updated text
  successPrivacyLink: "Adatvédelmi tájékoztatóban",  // link-text in success
  // ...
}
```

> Megj.: a `warningAszfHref`/`layeredConsentHref` kulcsok per-locale (HU: `/hu/aszf#magannyomozas`, EN: `/en/aszf#private-investigation`, DE: `/de/aszf#magannyomozas`, ZH: `/zh/aszf#magannyomozas`).

> A `warningAszfLink`, `layeredConsentLink`, `successPrivacyLink` keys csak a link-szöveg fordítását tartalmazzák; a hosting komponens a Markdown-szerű linket inline JSX-ben render-eli.
