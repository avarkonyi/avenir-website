"use client";

import { useState } from "react";
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
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {[
              { icon: "pin", text: "1039 Budapest, Királyok útja 291." },
              { icon: "phone", text: "+36 70 316 8218" },
              { icon: "arrow", text: "info@afm.hu" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    background: "#0B1E3E",
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon name={item.icon} size={18} color="#D1172E" />
                </div>
                <span style={{ color: "#556070", fontSize: 15, fontWeight: 300 }}>{item.text}</span>
              </div>
            ))}
            <div style={{ marginTop: 8, paddingLeft: 60, color: "#8A9BB0", fontSize: 13, fontStyle: "italic" }}>
              24/7 diszpécseri ügyelet
            </div>
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
