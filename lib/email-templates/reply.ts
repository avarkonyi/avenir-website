// Reply email template. Sent FROM the admin (via the verified Resend
// notify domain) TO the customer who originally submitted the contact
// form. The Resend `replyTo` header is set to the admin's session
// email so any further customer reply lands directly in a human inbox
// — opposite direction to notification.ts, which sets replyTo to the
// visitor.
//
// Locale-aware: greeting, signature, and quote-block label switch on
// the message's stored locale (the language the visitor was browsing
// in when they submitted). Body content is verbatim from the admin's
// composed reply.
//
// HTML structure mirrors notification.ts (table-layout + inline
// styles for Outlook / Gmail / Apple Mail compat). Plain-text version
// is provided alongside so Resend serves the right MIME part to
// text-only clients.

const PLACEHOLDER = "—";

type Locale = "hu" | "en" | "de" | "zh";
const LOCALES: readonly Locale[] = ["hu", "en", "de", "zh"];

function asLocale(value: string): Locale {
  return (LOCALES as readonly string[]).includes(value)
    ? (value as Locale)
    : "hu";
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function nlToBr(s: string): string {
  return escapeHtml(s).replace(/\n/g, "<br>");
}

function formatTimestampHu(date: Date): string {
  // Same format as the admin detail view's Beérkezés cell.
  // Manual zero-padding because Intl.DateTimeFormat for hu-HU emits
  // interior spaces and an unpadded hour.
  const tz = "Europe/Budapest";
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "00";
  return `${get("year")}.${get("month")}.${get("day")}. ${get("hour")}:${get("minute")}`;
}

const GREETING: Record<Locale, (name: string) => string> = {
  hu: (n) => `Tisztelt ${n}!`,
  en: (n) => `Dear ${n},`,
  de: (n) => `Sehr geehrte/r ${n},`,
  zh: (n) => `尊敬的 ${n}：`,
};

const SIGNATURE: Record<Locale, string> = {
  hu: "Üdvözlettel,\nVárkonyi András\nAvenir Facility Management Kft.",
  en: "Best regards,\nAndrás Várkonyi\nAvenir Facility Management Kft.",
  de: "Mit freundlichen Grüßen,\nAndrás Várkonyi\nAvenir Facility Management Kft.",
  zh: "此致敬礼,\nAndrás Várkonyi\nAvenir Facility Management Kft.",
};

const QUOTE_LABEL: Record<Locale, (ts: string) => string> = {
  hu: (ts) => `Eredeti üzenet — ${ts}:`,
  en: (ts) => `Original message — ${ts}:`,
  de: (ts) => `Ursprüngliche Nachricht — ${ts}:`,
  zh: (ts) => `原始留言 — ${ts}:`,
};

const REPLY_TO_NOTE: Record<Locale, string> = {
  hu: "Válaszhoz egyszerűen feleljen erre az emailre.",
  en: "To reply, simply respond to this email.",
  de: "Um zu antworten, antworten Sie einfach auf diese E-Mail.",
  zh: "如需回复，请直接回复此邮件。",
};

export interface ReplyEmailProps {
  recipientName: string;
  locale: string;
  body: string;
  originalMessage: string | null;
  originalCreatedAt: Date;
  subject: string;
}

export function renderReplyEmail(props: ReplyEmailProps): {
  html: string;
  text: string;
} {
  const locale = asLocale(props.locale);
  const recipientName = props.recipientName.trim() || PLACEHOLDER;
  const greeting = GREETING[locale](recipientName);
  const signature = SIGNATURE[locale];
  const ts = formatTimestampHu(props.originalCreatedAt);
  const quoteLabel = QUOTE_LABEL[locale](ts);
  const replyToNote = REPLY_TO_NOTE[locale];
  const original =
    props.originalMessage && props.originalMessage.trim().length > 0
      ? props.originalMessage
      : PLACEHOLDER;

  // ── HTML ──────────────────────────────────────────────────────────
  const bodyHtml = nlToBr(props.body);
  const signatureHtml = nlToBr(signature);
  const originalHtml = nlToBr(original);

  const html = `<!DOCTYPE html>
<html lang="${locale}"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><title>${escapeHtml(props.subject)}</title></head>
<body style="margin:0;padding:0;background:#F8FAFC;font-family:Arial,sans-serif;color:#0B1E3E;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border-radius:6px;overflow:hidden;box-shadow:0 4px 20px rgba(11,30,62,0.06);">
        <tr><td style="background:#0B1E3E;padding:24px 32px;">
          <div style="height:3px;width:48px;background:#D1172E;margin-bottom:14px;"></div>
          <div style="color:#fff;font-size:18px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">Avenir Facility Management</div>
        </td></tr>
        <tr><td style="padding:28px 32px;font-size:15px;line-height:1.65;color:#0B1E3E;">
          <p style="margin:0 0 16px;">${escapeHtml(greeting)}</p>
          <div style="margin:0 0 24px;white-space:pre-wrap;">${bodyHtml}</div>
          <div style="margin:0;color:#445566;">${signatureHtml}</div>
        </td></tr>
        <tr><td style="padding:0 32px 28px;">
          <div style="font-size:12px;color:#8A9BB0;text-transform:uppercase;letter-spacing:1px;font-weight:700;margin-bottom:8px;">${escapeHtml(quoteLabel)}</div>
          <div style="background:#F5F5F5;padding:16px;border-left:3px solid #D1172E;font-size:14px;color:#445566;white-space:pre-wrap;line-height:1.6;font-style:italic;">${originalHtml}</div>
        </td></tr>
        <tr><td style="padding:20px 32px;background:#F8FAFC;border-top:1px solid #E2E8F0;font-size:12px;color:#8A9BB0;line-height:1.5;">
          ${escapeHtml(replyToNote)}
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

  // ── Plain text ────────────────────────────────────────────────────
  const text = [
    greeting,
    "",
    props.body,
    "",
    signature,
    "",
    "---",
    quoteLabel,
    "",
    original,
    "",
    "---",
    replyToNote,
  ].join("\n");

  return { html, text };
}
