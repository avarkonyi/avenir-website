import assert from "node:assert/strict";
import test from "node:test";
import { renderReplyEmail } from "../lib/email-templates/reply";

const props = { recipientName: '<Name & "Test">', body: '<script>alert("x")</script>\nSecond line', originalMessage: '<img src=x> & original', subject: '<unsafe subject>', originalCreatedAt: new Date("2026-07-15T10:30:00Z"), locale: "en" };

test("reply timestamp uses recipient locale and Budapest daylight saving time", () => {
  const summer = renderReplyEmail(props).text;
  const winter = renderReplyEmail({ ...props, originalCreatedAt: new Date("2026-01-15T10:30:00Z") }).text;
  assert.match(summer, /12:30/);
  assert.match(winter, /11:30/);
  assert.doesNotMatch(summer, /2026\.07\.15/);
  assert.notEqual(summer, renderReplyEmail({ ...props, locale: "hu" }).text);
  assert.match(summer, /(?:GMT\+2|CEST)/);
  assert.match(winter, /(?:GMT\+1|CET)/);
});

test("all reply locales escape name, subject, body and quote without changing plain text", () => {
  for (const locale of ["hu", "en", "de", "zh", "ko", "fr"]) {
    const email = renderReplyEmail({ ...props, locale });
    assert.doesNotMatch(email.html, /<script>|<img src=x>|<unsafe subject>|<Name/);
    assert.ok(email.html.includes('&lt;Name &amp; &quot;Test&quot;&gt;'));
    assert.ok(email.html.includes('&lt;unsafe subject&gt;'));
    assert.ok(email.html.includes('&lt;img src=x&gt; &amp; original'));
    assert.ok(email.text.includes(props.body));
  }
});
