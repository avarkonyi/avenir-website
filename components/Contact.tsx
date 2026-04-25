"use client";

import { type ReactElement, useState } from "react";
import type { Translation } from "@/lib/i18n";
import { Icon } from "./Icon";

type FormState = {
  name: string;
  company: string;
  email: string;
  phone: string;
  service: string;
  message: string;
};

type Errors = {
  name?: string;
  email?: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ContactRowKind = "address" | "phone" | "email";

const ContactSVG: Record<ContactRowKind, ReactElement> = {
  address: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="22"
      height="22"
    >
      <path d="M12 22s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  ),
  phone: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="22"
      height="22"
    >
      <path d="M21 16.5v2.6a2 2 0 0 1-2.2 2 19.5 19.5 0 0 1-8.5-3.1 19.2 19.2 0 0 1-5.9-5.9A19.5 19.5 0 0 1 1.3 3.6 2 2 0 0 1 3.3 1.4h2.6a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L7 9a16 16 0 0 0 6 6l1.2-1.4a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2z" />
    </svg>
  ),
  email: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="22"
      height="22"
    >
      <rect x="2.5" y="4.5" width="19" height="15" rx="2" />
      <path d="M3 6.5l9 6.5 9-6.5" />
    </svg>
  ),
};

type ContactRowProps = {
  kind: ContactRowKind;
  label: string;
  text: string;
  href: string;
};

function ContactRow({ kind, label, text, href }: ContactRowProps) {
  const [hover, setHover] = useState(false);
  return (
    <a
      href={href}
      target={kind === "address" ? "_blank" : undefined}
      rel="noopener noreferrer"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 18,
        padding: "10px 12px",
        marginLeft: -12,
        textDecoration: "none",
        borderRadius: 3,
        background: hover ? "rgba(209,23,46,0.04)" : "transparent",
        transform: hover ? "translateX(4px)" : "translateX(0)",
        transition: "background 0.25s ease, transform 0.25s ease",
      }}
    >
      <div
        style={{
          position: "relative",
          width: 52,
          height: 52,
          flexShrink: 0,
          borderRadius: 3,
          background: hover ? "#D1172E" : "#0B1E3E",
          color: hover ? "#fff" : "#D1172E",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: hover
            ? "0 8px 22px rgba(209,23,46,0.35)"
            : "0 2px 6px rgba(11,30,62,0.15)",
          transition:
            "background 0.25s ease, color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease",
          transform: hover ? "translateY(-2px)" : "translateY(0)",
          overflow: "hidden",
        }}
      >
        <span
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 60%)",
            opacity: hover ? 1 : 0,
            transition: "opacity 0.25s ease",
          }}
        />
        <span
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: hover ? "scale(1.08)" : "scale(1)",
            transition: "transform 0.25s ease",
            position: "relative",
            zIndex: 1,
          }}
        >
          {ContactSVG[kind]}
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
        <span
          style={{
            fontFamily: "var(--font-head)",
            fontSize: 11,
            letterSpacing: 1.8,
            textTransform: "uppercase",
            fontWeight: 700,
            color: hover ? "#D1172E" : "#8A9BB0",
            transition: "color 0.25s ease",
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontSize: 16,
            fontWeight: 400,
            color: hover ? "#0B1E3E" : "#556070",
            transition: "color 0.25s ease",
          }}
        >
          {text}
        </span>
      </div>
    </a>
  );
}

export function Contact({ t }: { t: Translation }) {
  const [form, setForm] = useState<FormState>({
    name: "",
    company: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Errors = {};
    if (!form.name.trim()) newErrors.name = "Adja meg a teljes nevét";
    if (!form.email.trim()) newErrors.email = "Adja meg az e-mail címét";
    else if (!EMAIL_REGEX.test(form.email.trim())) newErrors.email = "Érvénytelen e-mail cím";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setSubmitting(true);
    // Frontend-only fake submit; real Resend + DB integration is added when the contact API is wired.
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
    setSent(true);
  };

  const inputStyle = (hasError: boolean): React.CSSProperties => ({
    border: `1px solid ${hasError ? "#D1172E" : "#E2E8F0"}`,
    borderRadius: 2,
    padding: "12px 16px",
    fontSize: 14,
    color: "#0B1E3E",
    outline: "none",
    transition: "border-color 0.2s",
    background: "#FAFBFC",
    width: "100%",
    boxSizing: "border-box",
  });

  return (
    <section id="contact" style={{ padding: "100px 5vw", background: "#F8FAFC" }}>
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 80,
          alignItems: "start",
        }}
        className="contact-grid"
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 40, height: 3, background: "#D1172E" }} />
            <span
              style={{
                fontSize: 13,
                letterSpacing: 2.5,
                color: "#D1172E",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              {t.contactSub}
            </span>
          </div>
          <h2
            style={{
              fontWeight: 800,
              fontSize: "clamp(36px, 4vw, 54px)",
              color: "#0B1E3E",
              lineHeight: 1.1,
              marginBottom: 32,
            }}
          >
            {t.contactTitle}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              {
                kind: "address" as const,
                label: t.contactLabels.address,
                text: "1039 Budapest, Királyok útja 291.",
                href:
                  "https://maps.google.com/?q=" +
                  encodeURIComponent("1039 Budapest, Királyok útja 291."),
              },
              {
                kind: "phone" as const,
                label: t.contactLabels.phone,
                text: "+36 70 316 8218",
                href: "tel:+36703168218",
              },
              {
                kind: "email" as const,
                label: t.contactLabels.email,
                text: "info@afm.hu",
                href: "mailto:info@afm.hu",
              },
            ].map((item) => (
              <ContactRow key={item.kind} {...item} />
            ))}
          </div>
          <div
            style={{
              marginTop: 24,
              paddingLeft: 12,
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: "#8A9BB0",
              fontSize: 13,
              fontStyle: "italic",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#22C55E",
                flexShrink: 0,
              }}
            />
            {t.contactLabels.hours}
          </div>
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: 4,
            padding: "44px 40px",
            boxShadow: "0 4px 30px rgba(0,0,0,0.06)",
          }}
        >
          {sent ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  background: "rgba(209,23,46,0.1)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                }}
              >
                <Icon name="check" size={28} color="#D1172E" />
              </div>
              <p
                style={{
                  fontSize: 18,
                  color: "#0B1E3E",
                  fontWeight: 700,
                  lineHeight: 1.5,
                }}
              >
                {t.form.success}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }} noValidate>
              <div>
                <input
                  type="text"
                  placeholder={t.form.name}
                  value={form.name}
                  onChange={(e) => {
                    setForm({ ...form, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: undefined });
                  }}
                  style={inputStyle(!!errors.name)}
                  aria-invalid={!!errors.name}
                />
                {errors.name && (
                  <div style={{ color: "#D1172E", fontSize: 12, marginTop: 4 }}>{errors.name}</div>
                )}
              </div>
              <input
                type="text"
                placeholder={t.form.company}
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                style={inputStyle(false)}
              />
              <div>
                <input
                  type="email"
                  placeholder={t.form.email}
                  value={form.email}
                  onChange={(e) => {
                    setForm({ ...form, email: e.target.value });
                    if (errors.email) setErrors({ ...errors, email: undefined });
                  }}
                  style={inputStyle(!!errors.email)}
                  aria-invalid={!!errors.email}
                />
                {errors.email && (
                  <div style={{ color: "#D1172E", fontSize: 12, marginTop: 4 }}>{errors.email}</div>
                )}
              </div>
              <input
                type="tel"
                placeholder={t.form.phone}
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                style={inputStyle(false)}
              />
              <select
                value={form.service}
                onChange={(e) => setForm({ ...form, service: e.target.value })}
                style={{
                  ...inputStyle(false),
                  color: form.service ? "#0B1E3E" : "#9BA8B5",
                  appearance: "none",
                }}
              >
                <option value="">{t.form.service}</option>
                {t.services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.t}
                  </option>
                ))}
              </select>
              <textarea
                placeholder={t.form.message}
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                style={{ ...inputStyle(false), resize: "vertical" }}
              />
              <button
                type="submit"
                disabled={submitting}
                style={{
                  background: submitting ? "#8A1320" : "#D1172E",
                  border: "none",
                  cursor: submitting ? "wait" : "pointer",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 14,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                  padding: "16px",
                  borderRadius: 2,
                  marginTop: 4,
                  transition: "background 0.2s",
                }}
              >
                {submitting ? "Küldés folyamatban…" : t.form.send}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
