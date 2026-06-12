import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { Contact } from "../components/Contact";
import { NewsRelatedServices } from "../components/NewsRelatedServices";
import {
  SERVICE_QUOTE_COPY,
  ServiceQuoteCtaPanel,
} from "../components/ServiceQuoteCta";
import { normalizeContactService } from "../lib/contact-schema";
import { hu } from "../lib/i18n/hu";
import { en } from "../lib/i18n/en";
import { de } from "../lib/i18n/de";
import { zh } from "../lib/i18n/zh";
import { ko } from "../lib/i18n/ko";
import {
  getContactFormCopy,
  getFooterMapLinkTitle,
  getVisibleNavSectionKeys,
} from "../lib/locale-ui-helpers";

const LOCALES = { hu, en, de, zh, ko } as const;

const RESPONSE_TIME_PROMISE =
  /2\s*munkanap|2 business days|2 Werktagen|2\s*个工作日|2 영업일/i;

function renderHuContact(): string {
  return renderToStaticMarkup(
    <Contact
      t={{
        contactSub: hu.contactSub,
        contactTitle: hu.contactTitle,
        contactLabels: hu.contactLabels,
        // mirror app/[locale]/page.tsx: only the narrowed copy reaches
        // the client component
        form: getContactFormCopy(hu.form),
      }}
      locale="hu"
      serviceOptions={[
        { slug: "objektumorzes", label: "Élőerős objektumőrzés" },
        { slug: "portaszolgalat", label: "Recepciós és portaszolgálat" },
      ]}
    />,
  );
}

test("security.txt exists with Contact and Expires lines and no invented security@ alias", () => {
  const text = readFileSync(
    path.join(process.cwd(), "public", ".well-known", "security.txt"),
    "utf8",
  );

  assert.match(text, /^Contact: mailto:dpo@afm\.hu$/m);
  assert.match(text, /^Contact: mailto:info@afm\.hu$/m);
  assert.match(text, /^Expires: \d{4}-\d{2}-\d{2}T/m);
  assert.match(text, /^Canonical: https:\/\/www\.afm\.hu\/\.well-known\/security\.txt$/m);
  assert.equal(text.includes("security@afm.hu"), false);
  assert.equal(/^Policy:/m.test(text), false);
});

test("references nav section is visible only where approved references render", () => {
  for (const locale of ["hu", "en", "de"]) {
    assert.ok(
      getVisibleNavSectionKeys(locale).includes("references"),
      `references nav key must be visible for ${locale}`,
    );
  }
  for (const locale of ["zh", "ko"]) {
    assert.ok(
      !getVisibleNavSectionKeys(locale).includes("references"),
      `references nav key must stay hidden for partial locale ${locale}`,
    );
  }
  // News visibility policy is unchanged by the references removal.
  assert.ok(getVisibleNavSectionKeys("hu").includes("news"));
  assert.ok(!getVisibleNavSectionKeys("ko").includes("news"));
});

test("public contact dropdown no longer offers private investigation", () => {
  const html = renderHuContact();

  assert.equal(html.includes('value="magannyomozas"'), false);
  assert.equal(html.includes("Magánnyomozás"), false);
});

test("contact schema keeps accepting the legacy magannyomozas key server-side", () => {
  assert.equal(normalizeContactService("magannyomozas"), "magannyomozas");
});

test("contact client payload strips parked special-service strings in every locale", () => {
  for (const [locale, t] of Object.entries(LOCALES)) {
    const copy = getContactFormCopy(t.form);

    for (const parkedKey of [
      "privateInvestigation",
      "specialDataWarning",
      "specialDataWarningLink",
    ]) {
      assert.equal(
        parkedKey in copy,
        false,
        `${parkedKey} must not ship to the client for ${locale}`,
      );
    }

    // copy still carries everything the Contact component renders
    for (const neededKey of [
      "name",
      "email",
      "service",
      "send",
      "success",
      "requiredField",
      "nextStepHelper",
      "layeredNotice",
      "errors",
    ]) {
      assert.ok(
        neededKey in copy,
        `${neededKey} must stay in the client copy for ${locale}`,
      );
    }

    const serialized = JSON.stringify(copy);
    assert.equal(
      serialized.includes(t.form.privateInvestigation),
      false,
      `serialized client copy must not contain the private investigation label for ${locale}`,
    );
    assert.equal(
      serialized.includes(t.form.specialDataWarning),
      false,
      `serialized client copy must not contain the special data warning for ${locale}`,
    );
  }
});

test("footer map link title is localized per locale", () => {
  assert.equal(getFooterMapLinkTitle("hu"), "Megnyitás Google Maps-en");
  assert.equal(getFooterMapLinkTitle("en"), "Open in Google Maps");
  assert.equal(getFooterMapLinkTitle("de"), "In Google Maps öffnen");
  assert.equal(getFooterMapLinkTitle("zh"), "在 Google 地图中打开");
  assert.equal(getFooterMapLinkTitle("ko"), "Google 지도에서 열기");
  // unknown locale falls back to the site default (HU)
  assert.equal(getFooterMapLinkTitle("fr"), "Megnyitás Google Maps-en");
});

test("contact form marks only schema-required fields and shows the required legend", () => {
  const html = renderHuContact();

  assert.match(html, /id="contact-name"[^>]*required/);
  assert.match(html, /id="contact-name"[^>]*aria-required="true"/);
  assert.match(html, /id="contact-email"[^>]*required/);
  assert.match(html, /placeholder="Teljes név \*"/);
  assert.match(html, /placeholder="E-mail cím \*"/);
  // company is optional in lib/contact-schema.ts — must not be marked
  assert.equal(/id="contact-company"[^>]*aria-required/.test(html), false);
  assert.equal(html.includes('placeholder="Cégnév *"'), false);
  assert.ok(html.includes("* Kötelező mező"));
});

test("contact form renders the non-SLA next-step helper", () => {
  const html = renderHuContact();

  assert.ok(html.includes(hu.form.nextStepHelper));
  assert.equal(RESPONSE_TIME_PROMISE.test(hu.form.nextStepHelper), false);
});

test("form helper and success copy contain no response-time promise in any locale", () => {
  for (const [locale, t] of Object.entries(LOCALES)) {
    assert.equal(
      RESPONSE_TIME_PROMISE.test(t.form.nextStepHelper),
      false,
      `nextStepHelper must stay non-SLA for ${locale}`,
    );
    assert.equal(
      RESPONSE_TIME_PROMISE.test(t.form.success),
      false,
      `form.success must stay non-SLA for ${locale}`,
    );
  }
  for (const [locale, copy] of Object.entries(SERVICE_QUOTE_COPY)) {
    assert.equal(
      RESPONSE_TIME_PROMISE.test(copy.nextStepHelper),
      false,
      `service quote nextStepHelper must stay non-SLA for ${locale}`,
    );
    assert.equal(
      RESPONSE_TIME_PROMISE.test(copy.success),
      false,
      `service quote success must stay non-SLA for ${locale}`,
    );
  }
});

test("service quote form marks required fields and shows the helpers", () => {
  const html = renderToStaticMarkup(
    <ServiceQuoteCtaPanel
      copy={SERVICE_QUOTE_COPY.hu}
      form={{
        name: "",
        email: "",
        phone: "",
        company: "",
        message: "",
        _website: "",
      }}
      errors={{}}
      isOpen
      isSent={false}
      isSubmitting={false}
      nameRef={{ current: null }}
      onOpen={() => {}}
      onClose={() => {}}
      onSubmit={() => {}}
      onFieldChange={() => {}}
    />,
  );

  assert.match(html, /id="service-quote-name"[^>]*required/);
  assert.match(html, /id="service-quote-email"[^>]*aria-required="true"/);
  // optional fields stay unmarked
  assert.equal(/id="service-quote-phone"[^>]*required/.test(html), false);
  assert.equal(/id="service-quote-company"[^>]*required/.test(html), false);
  assert.ok(html.includes("* Kötelező mező"));
  assert.ok(html.includes(SERVICE_QUOTE_COPY.hu.nextStepHelper));
});

test("news article related-services block links locale service pages and contact CTA", () => {
  for (const locale of ["hu", "en", "de"] as const) {
    const html = renderToStaticMarkup(<NewsRelatedServices locale={locale} />);

    assert.ok(html.includes(`href="/${locale}/szolgaltatasok/objektumorzes"`));
    assert.ok(html.includes(`href="/${locale}/szolgaltatasok/biztonsagtechnika"`));
    assert.ok(html.includes(`href="/${locale}/szolgaltatasok/hard-fm"`));
    assert.ok(html.includes(`href="/${locale}/szolgaltatasok/soft-fm"`));
    assert.ok(html.includes(`href="/${locale}#contact"`));
  }

  const huHtml = renderToStaticMarkup(<NewsRelatedServices locale="hu" />);
  assert.ok(huHtml.includes("Kapcsolódó szolgáltatások"));
  assert.ok(huHtml.includes("Ajánlatkérés"));
  const deHtml = renderToStaticMarkup(<NewsRelatedServices locale="de" />);
  assert.ok(deHtml.includes("Verwandte Dienstleistungen"));
  assert.ok(deHtml.includes("Angebot anfordern"));
});
