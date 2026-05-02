"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { sendReply } from "../../_actions";

// Inline reply form rendered inside Card 3 of the detail view.
// Branched on isArchived: when true, the form is replaced with a
// notice (server action also enforces this — defense in depth).
//
// On success: toast + router.refresh() so Card 1's status badge flips
// to "Megválaszolva" without a manual reload. Form clears (textarea
// empty, subject reset to default) so an accidental double-click
// doesn't resend the same body.
//
// On error: toast surfaces the actual server-returned error string so
// an operator can debug (Resend rate limits, missing env vars, etc.).
// Form values are preserved so the admin can retry without retyping.

type Locale = "hu" | "en" | "de" | "zh";

const SUBJECT_PREFILL: Record<Locale, string> = {
  hu: "Re: Megkeresés az afm.hu-ról",
  en: "Re: Inquiry from afm.hu",
  de: "Re: Anfrage von afm.hu",
  zh: "回复:来自 afm.hu 的询问",
};

function asLocale(value: string): Locale {
  if (value === "hu" || value === "en" || value === "de" || value === "zh") {
    return value;
  }
  return "hu";
}

export function ReplyForm({
  messageId,
  recipientEmail,
  recipientLocale,
  isArchived,
}: {
  messageId: number;
  recipientEmail: string;
  // recipientName: accepted by the spec (Card 1 already displays it);
  // not rendered in this form. Kept in the prop API for future use.
  recipientName: string;
  recipientLocale: string;
  isArchived: boolean;
}) {
  const router = useRouter();
  const locale = asLocale(recipientLocale);
  const defaultSubject = SUBJECT_PREFILL[locale];
  const [subject, setSubject] = useState(defaultSubject);
  const [body, setBody] = useState("");
  const [pending, startTransition] = useTransition();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  if (isArchived) {
    return (
      <div
        role="status"
        style={{
          background: "#F8FAFC",
          border: "1px dashed #CBD5E1",
          borderRadius: 4,
          padding: "16px 20px",
          color: "#64748B",
          fontSize: 14,
          lineHeight: 1.55,
        }}
      >
        Az archivált üzenetekre nem lehet közvetlenül válaszolni. Állítsd
        vissza az üzenetet a válaszhoz.
      </div>
    );
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pending) return;
    startTransition(async () => {
      const result = await sendReply(messageId, subject, body);
      if (result.ok) {
        toast.success("Válasz elküldve.");
        // Reset form after successful send so an accidental re-submit
        // doesn't resend identical content. Card 1's status badge
        // updates via router.refresh() below.
        setSubject(defaultSubject);
        setBody("");
        if (textareaRef.current) {
          textareaRef.current.style.height = "";
        }
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  // Auto-grow textarea between min (~6 rows) and max (~20 rows). The
  // initial height comes from the rows attribute; subsequent typing
  // resizes via scrollHeight measurement.
  function handleBodyChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setBody(e.target.value);
    const ta = e.currentTarget;
    ta.style.height = "auto";
    const lineHeight = 22; // matches the textarea's line-height: 1.55 * 14px font-size
    const minPx = 6 * lineHeight;
    const maxPx = 20 * lineHeight;
    const next = Math.min(Math.max(ta.scrollHeight, minPx), maxPx);
    ta.style.height = `${next}px`;
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: 14 }}
    >
      {/* Read-only Címzett — informational. The actual SMTP envelope
          is decided server-side by the VERCEL_ENV gate; in non-prod
          environments REPLY_TEST_RECIPIENT receives the mail instead.
          The UI shows the customer's email so the admin's mental
          model stays "I'm replying to this person". */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "100px 1fr",
          alignItems: "baseline",
          gap: 8,
          fontSize: 13,
          color: "#64748B",
        }}
      >
        <span style={{ fontWeight: 600 }}>Címzett</span>
        <span style={{ color: "#0B1E3E", fontWeight: 500 }}>
          {recipientEmail}
        </span>
      </div>

      <label style={{ display: "block" }}>
        <span style={labelStyle}>Tárgy</span>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
          maxLength={200}
          style={inputStyle()}
          disabled={pending}
        />
      </label>

      <label style={{ display: "block" }}>
        <span style={labelStyle}>Üzenet</span>
        <textarea
          ref={textareaRef}
          value={body}
          onChange={handleBodyChange}
          rows={6}
          required
          maxLength={10_000}
          placeholder="Írd ide a válaszodat…"
          style={{
            ...inputStyle(),
            resize: "vertical",
            lineHeight: 1.55,
            minHeight: 6 * 22,
            maxHeight: 20 * 22,
            fontFamily: "inherit",
          }}
          disabled={pending}
        />
      </label>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 12,
          marginTop: 4,
        }}
      >
        <button
          type="submit"
          disabled={pending}
          style={{
            background: "#0B1E3E",
            color: "#fff",
            border: "none",
            padding: "10px 22px",
            borderRadius: 4,
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: 0.5,
            textTransform: "uppercase",
            cursor: pending ? "wait" : "pointer",
            fontFamily: "inherit",
            opacity: pending ? 0.7 : 1,
          }}
        >
          {pending ? "Küldés folyamatban…" : "Válasz küldése"}
        </button>
      </div>
    </form>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 700,
  color: "#475569",
  textTransform: "uppercase",
  letterSpacing: 0.5,
  marginBottom: 6,
};

function inputStyle(): React.CSSProperties {
  return {
    width: "100%",
    padding: "10px 14px",
    fontSize: 14,
    border: "1px solid #CBD5E1",
    borderRadius: 4,
    outline: "none",
    background: "#fff",
    color: "#0B1E3E",
    fontFamily: "inherit",
    boxSizing: "border-box",
  };
}
