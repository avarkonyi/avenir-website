// HU notification template for the contact-form email sent to
// RESEND_NOTIFY_TO. The recipient is HU-native; the visitor's locale
// is included as a body field so the responder knows which language
// to reply in. HTML uses table-layout + inline styles for email-client
// compatibility (Outlook, Gmail, Apple Mail). Arial fallback because
// custom fonts don't render reliably in mail clients.

import type { ContactPayload } from "../contact-schema";

const SERVICE_LABELS_HU: Record<string, string> = {
  // P5 Phase 1: "security" → "objektumorzes" rename for the public
  // detail-page URL. Both keys map to the same Hungarian label so any
  // in-flight contact submissions or sites still posting the legacy
  // slug keep rendering correctly in the notification email.
  security: "Élőerős objektumőrzés",
  objektumorzes: "Élőerős objektumőrzés",
  cleaning: "Rendezvénybiztosítás",
  rendezvenybiztositas: "Rendezvénybiztosítás",
  building: "Biztonságtechnika",
  biztonsagtechnika: "Biztonságtechnika",
  reception: "Recepciós és portaszolgálat",
  portaszolgalat: "Recepciós és portaszolgálat",
  green: "Soft FM",
  technical: "Távfelügyelet és vonulószolgálat",
  "tavfelugyelet-vonuloszolgalat": "Távfelügyelet és vonulószolgálat",
  mystery: "Mystery Shopping és helyszíni audit",
  "mystery-shopping-helyszini-audit": "Mystery Shopping és helyszíni audit",
  hardfm: "Hard FM",
};

function formatTimestamp(date: Date): string {
  return new Intl.DateTimeFormat("hu-HU", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Budapest",
  }).format(date);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function buildNotificationEmail(
  payload: ContactPayload,
  createdAt: Date,
): { subject: string; html: string; text: string } {
  const serviceLabel = payload.service
    ? (SERVICE_LABELS_HU[payload.service] ?? payload.service)
    : "—";
  const company = payload.company || "";
  const subject = `Új ajánlatkérés — ${payload.name}${company ? ` (${company})` : ""}`;
  const dt = formatTimestamp(createdAt);

  const text = [
    "Új ajánlatkérés érkezett az afm.hu honlap kapcsolati űrlapján keresztül.",
    "",
    "Beküldő:",
    `  Név:            ${payload.name}`,
    `  Cég:            ${company || "—"}`,
    `  E-mail:         ${payload.email}`,
    `  Telefon:        ${payload.phone || "—"}`,
    `  Érdeklődés:     ${serviceLabel}`,
    `  Felület nyelve: ${payload.locale}`,
    `  Beküldés ideje: ${dt}`,
    "",
    "Üzenet:",
    payload.message || "(üres)",
    "",
    "---",
    "Az adatok eltárolásra kerültek az adminisztrátori felületen.",
    "Válaszhoz egyszerűen feleljen erre az emailre — a Reply-To mezőben",
    "a beküldő címe szerepel.",
  ].join("\n");

  const row = (label: string, value: string) =>
    `<tr>
       <td style="padding:8px 0;color:#8A9BB0;width:130px;font-size:12px;text-transform:uppercase;letter-spacing:1px;font-weight:700;vertical-align:top;">${escapeHtml(label)}</td>
       <td style="padding:8px 0;color:#0B1E3E;font-weight:600;">${escapeHtml(value)}</td>
     </tr>`;

  const messageBlock = payload.message
    ? `<div style="margin-top:24px;">
         <div style="font-size:12px;color:#8A9BB0;text-transform:uppercase;letter-spacing:1px;font-weight:700;margin-bottom:8px;">Üzenet</div>
         <div style="background:#F8FAFC;padding:16px;border-left:3px solid #D1172E;font-size:14px;color:#445566;white-space:pre-wrap;line-height:1.65;">${escapeHtml(payload.message)}</div>
       </div>`
    : "";

  const html = `<!DOCTYPE html>
<html lang="hu"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><title>${escapeHtml(subject)}</title></head>
<body style="margin:0;padding:0;background:#F8FAFC;font-family:Arial,sans-serif;color:#0B1E3E;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border-radius:6px;overflow:hidden;box-shadow:0 4px 20px rgba(11,30,62,0.06);">
        <tr><td style="background:#0B1E3E;padding:24px 32px;">
          <div style="height:3px;width:48px;background:#D1172E;margin-bottom:14px;"></div>
          <div style="color:#fff;font-size:18px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">Avenir Facility Management</div>
          <div style="color:rgba(255,255,255,0.7);font-size:13px;margin-top:4px;">Új ajánlatkérés érkezett</div>
        </td></tr>
        <tr><td style="padding:28px 32px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;line-height:1.6;">
            ${row("Név", payload.name)}
            ${row("Cég", company || "—")}
            ${row("E-mail", payload.email)}
            ${row("Telefon", payload.phone || "—")}
            ${row("Érdeklődés", serviceLabel)}
            ${row("Felület nyelve", payload.locale)}
            ${row("Beküldés ideje", dt)}
          </table>
          ${messageBlock}
        </td></tr>
        <tr><td style="padding:20px 32px;background:#F8FAFC;border-top:1px solid #E2E8F0;font-size:12px;color:#8A9BB0;line-height:1.5;">
          Válaszhoz egyszerűen feleljen erre az emailre — a Reply-To mezőben a beküldő címe szerepel.<br/>
          Az ajánlatkérés mentésre került az adminisztrátori felületen is.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

  return { subject, html, text };
}
