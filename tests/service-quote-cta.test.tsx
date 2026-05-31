import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import {
  SERVICE_QUOTE_COPY,
  buildServiceQuotePayload,
  ServiceQuoteCtaPanel,
  ServiceQuoteCta,
} from "../components/ServiceQuoteCta";

test("service quote CTA collapsed state keeps intro copy visually hidden and renders only the button", () => {
  const html = renderToStaticMarkup(
    <ServiceQuoteCta
      locale="hu"
      serviceSlug="objektumorzes"
      serviceLabel="Élőerős objektumőrzés"
    />,
  );

  assert.match(html, />Ajánlatkérés<\/button>/);
  assert.match(html, /<h2[^>]*class="sr-only"[^>]*>Ajánlatkérés<\/h2>/);
  assert.equal(
    html.includes(
      "Írja le röviden az igényt, és munkatársunk visszajelez a megadott elérhetőségen.",
    ),
    false,
  );
});

test("service quote CTA uses short message labels and placeholders", () => {
  assert.equal(SERVICE_QUOTE_COPY.hu.message, "Üzenet");
  assert.equal(
    SERVICE_QUOTE_COPY.hu.messagePlaceholder,
    "Írja le röviden, miben segíthetünk.",
  );
  assert.equal(SERVICE_QUOTE_COPY.en.message, "Message");
  assert.equal(
    SERVICE_QUOTE_COPY.en.messagePlaceholder,
    "Briefly describe how we can help.",
  );
});

test("service quote CTA expanded state shows a visible heading above the form", () => {
  const html = renderToStaticMarkup(
    <ServiceQuoteCtaPanel
      copy={SERVICE_QUOTE_COPY.en}
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

  assert.match(
    html,
    /<h2[^>]*id="service-quote-title"[^>]*class="service-quote-form__title"[^>]*>Request a quote<\/h2>/,
  );
  assert.equal(html.includes('class="sr-only">Request a quote</h2>'), false);
  assert.match(html, /<form[^>]*class="service-quote-form"/);
});

test("service quote CTA expanded state keeps the cancel action available", () => {
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

  assert.match(html, /<button[^>]*type="button"[^>]*class="service-quote-form__secondary"[^>]*>Mégsem<\/button>/);
});

test("service quote payload includes canonical service context and embedded variant metadata", () => {
  const payload = buildServiceQuotePayload({
    form: {
      name: " Teszt Elek ",
      email: " teszt@example.com ",
      phone: " +36 70 000 0000 ",
      company: " Avenir QA ",
      message: " Teszt üzenet ",
      _website: "",
    },
    locale: "hu",
    serviceSlug: "objektumorzes",
    sourcePath: "/hu/szolgaltatasok/objektumorzes",
  });

  assert.deepEqual(payload, {
    name: "Teszt Elek",
    email: "teszt@example.com",
    phone: "+36 70 000 0000",
    company: "Avenir QA",
    message: "Teszt üzenet",
    service: "objektumorzes",
    locale: "hu",
    _website: "",
    form_variant: "service_embedded",
    source_path: "/hu/szolgaltatasok/objektumorzes",
  });
});
