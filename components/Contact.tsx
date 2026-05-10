"use client";

import { type ReactElement, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import type { Translation } from "@/lib/i18n";
import { Icon } from "./Icon";

// Per-locale anchor target for the ÁSZF section #4 deep-link from the
// magánnyomozói warning. HU keeps the Hungarian slug; EN/DE/ZH use the
// English slug since the DE/ZH ÁSZF page reuses the EN section IDs.
function getAszfPrivateInvestigationHref(locale: string): string {
  const anchor = locale === "hu" ? "magannyomozas" : "private-investigation";
  return `/${locale}/aszf#${anchor}`;
}

type FormState = {
  name: string;
  company: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  // Honeypot: must stay empty; bots fill this and trigger silent reject
  _website: string;
};

// All form fields are listed for forward-compatibility: when the Zod
// schema grows new validators (e.g., phone-format), the matching error
// markup + aria-describedby wiring is already in place.
type Errors = {
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  service?: string;
  message?: string;
  // Server-side and network errors that aren't tied to a specific field
  general?: string;
};

const FORM_FIELDS = [
  "name",
  "company",
  "email",
  "phone",
  "service",
  "message",
] as const;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function subscribeToServiceQuery(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("popstate", onStoreChange);
  return () => window.removeEventListener("popstate", onStoreChange);
}

function getServiceQuerySnapshot(): string {
  if (typeof window === "undefined") return "";
  return new URLSearchParams(window.location.search).get("service")?.trim() ?? "";
}

function getEmptyServiceQuerySnapshot(): string {
  return "";
}

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

// serviceOptions is fetched server-side in app/[locale]/page.tsx
// (Contact stays a client component; it can't import db itself).
// Wire-format contract: opt.slug becomes the <option value>, which
// /api/contact validates and notification.ts SERVICE_LABELS_HU keys
// off — never substitute services.id (numeric) here.
export type ServiceOption = { slug: string; label: string };

const SERVICE_SLUG_ALIASES: Record<string, string> = {
  security: "objektumorzes",
  reception: "portaszolgalat",
  building: "biztonsagtechnika",
  technical: "tavfelugyelet-vonuloszolgalat",
  mystery: "mystery-shopping-helyszini-audit",
  cleaning: "rendezvenybiztositas",
  hardfm: "hard-fm",
  green: "soft-fm",
};

const SERVICE_PREFILL_FALLBACKS: Record<string, ServiceOption> = {
  objektumorzes: {
    slug: "objektumorzes",
    label: "Élőerős objektumőrzés",
  },
  portaszolgalat: {
    slug: "portaszolgalat",
    label: "Recepciós és portaszolgálat",
  },
  biztonsagtechnika: {
    slug: "biztonsagtechnika",
    label: "Biztonságtechnika",
  },
  "tavfelugyelet-vonuloszolgalat": {
    slug: "tavfelugyelet-vonuloszolgalat",
    label: "Távfelügyelet és vonulószolgálat",
  },
  "mystery-shopping-helyszini-audit": {
    slug: "mystery-shopping-helyszini-audit",
    label: "Mystery Shopping és helyszíni audit",
  },
  "hard-fm": {
    slug: "hard-fm",
    label: "Hard FM",
  },
  "soft-fm": {
    slug: "soft-fm",
    label: "Soft FM",
  },
  rendezvenybiztositas: {
    slug: "rendezvenybiztositas",
    label: "Rendezvénybiztosítás",
  },
};

function canonicalServiceSlug(slug: string): string {
  return SERVICE_SLUG_ALIASES[slug] ?? slug;
}

function canonicalServiceOptions(
  options: ServiceOption[],
  requestedCanonicalSlug: string,
): ServiceOption[] {
  const bySlug = new Map<string, ServiceOption>();

  for (const option of options) {
    const slug = canonicalServiceSlug(option.slug);
    if (!bySlug.has(slug)) {
      bySlug.set(slug, { ...option, slug });
    }
  }

  const fallback = SERVICE_PREFILL_FALLBACKS[requestedCanonicalSlug];
  if (fallback && !bySlug.has(fallback.slug)) {
    bySlug.set(fallback.slug, fallback);
  }

  return [...bySlug.values()];
}

export function Contact({
  t,
  locale,
  serviceOptions,
}: {
  t: Pick<Translation, "contactSub" | "contactTitle" | "contactLabels" | "form">;
  locale: string;
  serviceOptions: ServiceOption[];
}) {
  const [form, setForm] = useState<FormState>({
    name: "",
    company: "",
    email: "",
    phone: "",
    service: "",
    message: "",
    _website: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [serviceTouched, setServiceTouched] = useState(false);

  const requestedService = useSyncExternalStore(
    subscribeToServiceQuery,
    getServiceQuerySnapshot,
    getEmptyServiceQuerySnapshot,
  );
  const canonicalRequestedService = canonicalServiceSlug(requestedService);
  const normalizedServiceOptions = canonicalServiceOptions(
    serviceOptions,
    canonicalRequestedService,
  );
  const prefilledService =
    canonicalRequestedService &&
    normalizedServiceOptions.some(
      (option) => option.slug === canonicalRequestedService,
    )
      ? canonicalRequestedService
      : "";
  const selectedService = serviceTouched ? form.service : prefilledService;

  // Map a Zod issue code (returned by /api/contact for 400 responses) to
  // the localized error string under t.form.errors. Falls back to the
  // generic server-error string if the code is unknown.
  const errorText = (code: string): string => {
    const fallback = t.form.errors.server;
    if (code === "nameRequired") return t.form.errors.nameRequired;
    if (code === "emailRequired") return t.form.errors.emailRequired;
    if (code === "emailInvalid") return t.form.errors.emailInvalid;
    return fallback;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation mirrors the server Zod schema for fast UX
    const newErrors: Errors = {};
    if (!form.name.trim()) newErrors.name = t.form.errors.nameRequired;
    if (!form.email.trim()) newErrors.email = t.form.errors.emailRequired;
    else if (!EMAIL_REGEX.test(form.email.trim()))
      newErrors.email = t.form.errors.emailInvalid;
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          company: form.company.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          service: selectedService,
          message: form.message.trim(),
          locale,
          _website: form._website,
        }),
      });

      if (res.ok) {
        setSent(true);
        return;
      }

      if (res.status === 429) {
        setErrors({ general: t.form.errors.throttled });
        return;
      }

      if (res.status === 400) {
        const body = (await res.json().catch(() => null)) as
          | { errors?: Record<string, string> }
          | null;
        if (body?.errors) {
          const mapped: Errors = {};
          for (const field of FORM_FIELDS) {
            const code = body.errors[field];
            if (code) mapped[field] = errorText(code);
          }
          if (Object.keys(mapped).length === 0) mapped.general = t.form.errors.server;
          setErrors(mapped);
          return;
        }
        setErrors({ general: t.form.errors.server });
        return;
      }

      setErrors({ general: t.form.errors.server });
    } catch {
      setErrors({ general: t.form.errors.server });
    } finally {
      setSubmitting(false);
    }
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
                fontFamily: "var(--font-head)",
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
              fontFamily: "var(--font-head)",
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
              {/* Magánnyomozói / különleges adat warning — CONDITIONAL:
                  csak akkor jelenik meg, ha a "Magánnyomozás" opció van
                  kiválasztva a service dropdown-ban (form.service ===
                  "magannyomozas"). Az érzékeny-adat tilalom kifejezetten
                  a magánnyomozói tevékenységhez kapcsolódó B2B-megkeresések
                  esetén releváns. */}
              {selectedService === "magannyomozas" && (
                <div
                  style={{
                    background: "rgba(251,191,36,0.08)",
                    border: "1px solid rgba(251,191,36,0.35)",
                    borderRadius: 3,
                    padding: "12px 14px",
                    fontSize: 12,
                    lineHeight: 1.55,
                    color: "rgba(11,30,62,0.85)",
                  }}
                  role="note"
                  aria-label="Special data warning"
                >
                  <strong style={{ color: "#92400e" }}>⚠️ </strong>
                  {t.form.specialDataWarning}{" "}
                  <Link
                    href={getAszfPrivateInvestigationHref(locale)}
                    style={{ color: "#D1172E", fontWeight: 600, textDecoration: "underline" }}
                  >
                    {t.form.specialDataWarningLink}
                  </Link>
                  .
                </div>
              )}

              {/* Honeypot — visually hidden, off the keyboard tab order. Bots
                  fill every input; humans don't see this. Server treats a
                  non-empty value as silent success (no DB write, no email). */}
              <input
                type="text"
                name="_website"
                value={form._website}
                onChange={(e) => setForm({ ...form, _website: e.target.value })}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: "-9999px",
                  width: 1,
                  height: 1,
                  opacity: 0,
                  pointerEvents: "none",
                }}
              />
              <div>
                <label htmlFor="contact-name" className="sr-only">
                  {t.form.name}
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder={t.form.name}
                  value={form.name}
                  onChange={(e) => {
                    setForm({ ...form, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: undefined });
                  }}
                  style={inputStyle(!!errors.name)}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "contact-name-error" : undefined}
                />
                {errors.name && (
                  <div id="contact-name-error" role="alert" style={{ color: "#D1172E", fontSize: 12, marginTop: 4 }}>
                    {errors.name}
                  </div>
                )}
              </div>
              <div>
                <label htmlFor="contact-company" className="sr-only">
                  {t.form.company}
                </label>
                <input
                  id="contact-company"
                  name="organization"
                  type="text"
                  autoComplete="organization"
                  placeholder={t.form.company}
                  value={form.company}
                  onChange={(e) => {
                    setForm({ ...form, company: e.target.value });
                    if (errors.company) setErrors({ ...errors, company: undefined });
                  }}
                  style={inputStyle(!!errors.company)}
                  aria-invalid={!!errors.company}
                  aria-describedby={errors.company ? "contact-company-error" : undefined}
                />
                {errors.company && (
                  <div id="contact-company-error" role="alert" style={{ color: "#D1172E", fontSize: 12, marginTop: 4 }}>
                    {errors.company}
                  </div>
                )}
              </div>
              <div>
                <label htmlFor="contact-email" className="sr-only">
                  {t.form.email}
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder={t.form.email}
                  value={form.email}
                  onChange={(e) => {
                    setForm({ ...form, email: e.target.value });
                    if (errors.email) setErrors({ ...errors, email: undefined });
                  }}
                  style={inputStyle(!!errors.email)}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "contact-email-error" : undefined}
                />
                {errors.email && (
                  <div id="contact-email-error" role="alert" style={{ color: "#D1172E", fontSize: 12, marginTop: 4 }}>
                    {errors.email}
                  </div>
                )}
              </div>
              <div>
                <label htmlFor="contact-phone" className="sr-only">
                  {t.form.phone}
                </label>
                <input
                  id="contact-phone"
                  name="tel"
                  type="tel"
                  autoComplete="tel"
                  placeholder={t.form.phone}
                  value={form.phone}
                  onChange={(e) => {
                    setForm({ ...form, phone: e.target.value });
                    if (errors.phone) setErrors({ ...errors, phone: undefined });
                  }}
                  style={inputStyle(!!errors.phone)}
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? "contact-phone-error" : undefined}
                />
                {errors.phone && (
                  <div id="contact-phone-error" role="alert" style={{ color: "#D1172E", fontSize: 12, marginTop: 4 }}>
                    {errors.phone}
                  </div>
                )}
              </div>
              <div>
                <label htmlFor="contact-service" className="sr-only">
                  {t.form.service}
                </label>
                <select
                  id="contact-service"
                  name="service"
                  value={selectedService}
                  onChange={(e) => {
                    setServiceTouched(true);
                    setForm({ ...form, service: e.target.value });
                    if (errors.service) setErrors({ ...errors, service: undefined });
                  }}
                  style={{
                    ...inputStyle(!!errors.service),
                    color: selectedService ? "#0B1E3E" : "#9BA8B5",
                    appearance: "none",
                  }}
                  aria-invalid={!!errors.service}
                  aria-describedby={errors.service ? "contact-service-error" : undefined}
                >
                  <option value="">{t.form.service}</option>
                  {/* DB-backed since P2 C4. opt.slug (string) becomes the
                      <option value> — wire-format contract with
                      /api/contact + notification.ts SERVICE_LABELS_HU. */}
                  {normalizedServiceOptions.map((opt) => (
                    <option key={opt.slug} value={opt.slug}>
                      {opt.label}
                    </option>
                  ))}
                  {/* 9th option — magánnyomozás. Tartja a hatósági engedély
                      (01030-822/4925-3/2018) szerinti tevékenység transzparens
                      megjelenítését. Választáskor a fenti specialDataWarning
                      conditional render aktiválódik. Hardcoded — nem a services
                      táblában él, regulált tevékenység. */}
                  <option value="magannyomozas">{t.form.privateInvestigation}</option>
                </select>
                {errors.service && (
                  <div id="contact-service-error" role="alert" style={{ color: "#D1172E", fontSize: 12, marginTop: 4 }}>
                    {errors.service}
                  </div>
                )}
              </div>
              <div>
                <label htmlFor="contact-message" className="sr-only">
                  {t.form.message}
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  autoComplete="off"
                  placeholder={t.form.message}
                  rows={4}
                  value={form.message}
                  onChange={(e) => {
                    setForm({ ...form, message: e.target.value });
                    if (errors.message) setErrors({ ...errors, message: undefined });
                  }}
                  style={{ ...inputStyle(!!errors.message), resize: "vertical" }}
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? "contact-message-error" : undefined}
                />
                {errors.message && (
                  <div id="contact-message-error" role="alert" style={{ color: "#D1172E", fontSize: 12, marginTop: 4 }}>
                    {errors.message}
                  </div>
                )}
              </div>
              {errors.general && (
                <div
                  role="alert"
                  style={{
                    color: "#D1172E",
                    fontSize: 13,
                    lineHeight: 1.5,
                    padding: "10px 14px",
                    background: "rgba(209,23,46,0.06)",
                    border: "1px solid rgba(209,23,46,0.25)",
                    borderRadius: 2,
                  }}
                >
                  {errors.general}
                </div>
              )}
              {/* Layered notice — short summary above Send button + link
                  to full Privacy Policy (Codex 2 IMP-10: "notice" not
                  "consent" because basis is Art. 6(1)(b)/(f), not consent). */}
              <p
                style={{
                  fontSize: 11,
                  lineHeight: 1.55,
                  color: "rgba(11,30,62,0.55)",
                  margin: "8px 0 0",
                }}
              >
                {t.form.layeredNotice}{" "}
                <Link
                  href={`/${locale}/adatvedelem`}
                  style={{ color: "#D1172E", textDecoration: "underline", fontWeight: 500 }}
                >
                  {t.form.layeredNoticeLink}
                </Link>
                .
              </p>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  background: submitting ? "#8A1320" : "#D1172E",
                  border: "none",
                  cursor: submitting ? "wait" : "pointer",
                  color: "#fff",
                  fontFamily: "var(--font-head)",
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
                {submitting ? t.form.sending : t.form.send}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
