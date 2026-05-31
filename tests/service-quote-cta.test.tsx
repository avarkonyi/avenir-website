import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import {
  SERVICE_QUOTE_COPY,
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
