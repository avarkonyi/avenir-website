"use client";

import { useEffect, useRef, useState } from "react";
import { trackAnalyticsEvent } from "@/lib/analytics/events";

const CANONICAL_SERVICE_SLUGS = new Set([
  "objektumorzes",
  "portaszolgalat",
  "biztonsagtechnika",
  "tavfelugyelet-vonuloszolgalat",
  "mystery-shopping-helyszini-audit",
  "rendezvenybiztositas",
  "hard-fm",
  "soft-fm",
]);

type FormState = {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  _website: string;
};

type Errors = {
  name?: string;
  email?: string;
  general?: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FORM_VARIANT = "service_embedded" as const;

const COPY = {
  hu: {
    title: "Ajánlatkérés",
    body: "Írja le röviden az igényt, és munkatársunk visszajelez a megadott elérhetőségen.",
    button: "Ajánlatkérés",
    close: "Mégsem",
    name: "Név",
    email: "E-mail",
    phone: "Telefon",
    company: "Cég (opcionális)",
    message: "Igény rövid leírása",
    send: "Küldés",
    sending: "Küldés folyamatban...",
    success:
      "Köszönjük, megkaptuk a megkeresést. Munkatársunk a megadott elérhetőségen visszajelez.",
    error:
      "Hiba történt a küldés során. Kérjük, próbálja újra később, vagy hívjon minket.",
    nameRequired: "Kérjük, adja meg a nevét.",
    emailRequired: "Kérjük, adja meg az e-mail címét.",
    emailInvalid: "Kérjük, érvényes e-mail címet adjon meg.",
  },
  en: {
    title: "Request a quote",
    body: "Briefly describe your request and our team will respond using the contact details provided.",
    button: "Request a quote",
    close: "Cancel",
    name: "Name",
    email: "Email",
    phone: "Phone",
    company: "Company (optional)",
    message: "Request summary",
    send: "Send",
    sending: "Sending...",
    success:
      "Thank you, we have received your request. Our team will respond using the contact details provided.",
    error:
      "There was an error sending your request. Please try again later or contact us by phone.",
    nameRequired: "Please enter your name.",
    emailRequired: "Please enter your email address.",
    emailInvalid: "Please enter a valid email address.",
  },
} as const;

export function ServiceQuoteCta({
  locale,
  serviceSlug,
  serviceLabel,
}: {
  locale: string;
  serviceSlug: string;
  serviceLabel: string;
}) {
  const copy = locale === "hu" ? COPY.hu : COPY.en;
  const safeServiceSlug = CANONICAL_SERVICE_SLUGS.has(serviceSlug)
    ? serviceSlug
    : "";
  const nameRef = useRef<HTMLInputElement>(null);
  const formStartedRef = useRef(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
    _website: "",
  });

  useEffect(() => {
    if (!isOpen || isSent) return;
    nameRef.current?.focus();
  }, [isOpen, isSent]);

  if (!safeServiceSlug) return null;

  const analyticsParams = () => ({
    locale,
    service_slug: safeServiceSlug,
    service_label: serviceLabel,
    form_variant: FORM_VARIANT,
  });

  const openForm = () => {
    trackAnalyticsEvent("service_quote_cta_click", analyticsParams());
    if (!isOpen) {
      trackAnalyticsEvent("service_quote_form_open", analyticsParams());
    }
    setIsOpen(true);
    setIsSent(false);
  };

  const closeForm = () => {
    setIsOpen(false);
    setErrors({});
  };

  const updateField = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (!formStartedRef.current && field !== "_website") {
      formStartedRef.current = true;
      trackAnalyticsEvent("service_quote_form_start", analyticsParams());
    }
    if (field === "name" && errors.name) {
      setErrors((current) => ({ ...current, name: undefined }));
    }
    if (field === "email" && errors.email) {
      setErrors((current) => ({ ...current, email: undefined }));
    }
    if (errors.general) {
      setErrors((current) => ({ ...current, general: undefined }));
    }
  };

  const validate = (): Errors => {
    const nextErrors: Errors = {};
    if (!form.name.trim()) nextErrors.name = copy.nameRequired;
    if (!form.email.trim()) nextErrors.email = copy.emailRequired;
    else if (!EMAIL_REGEX.test(form.email.trim())) {
      nextErrors.email = copy.emailInvalid;
    }
    return nextErrors;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      trackAnalyticsEvent("service_quote_form_submit_error", {
        ...analyticsParams(),
        event_type: "client_validation",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const sourcePath =
        window.location.pathname + window.location.search + window.location.hash;
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          company: form.company.trim(),
          message: form.message.trim(),
          service: safeServiceSlug,
          locale,
          _website: form._website,
          form_variant: FORM_VARIANT,
          source_path: sourcePath,
        }),
      });

      if (response.ok) {
        trackAnalyticsEvent(
          "service_quote_form_submit_success",
          analyticsParams(),
        );
        setIsSent(true);
        return;
      }

      trackAnalyticsEvent("service_quote_form_submit_error", {
        ...analyticsParams(),
        event_type: `http_${response.status}`,
      });
      setErrors({ general: copy.error });
    } catch {
      trackAnalyticsEvent("service_quote_form_submit_error", {
        ...analyticsParams(),
        event_type: "network",
      });
      setErrors({ general: copy.error });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="service-quote"
      className="service-quote-cta-section"
      aria-labelledby="service-quote-title"
    >
      <div className="service-quote-cta">
        <div className="service-quote-cta__intro">
          <h2 id="service-quote-title">{copy.title}</h2>
          <p>{copy.body}</p>
        </div>

        {!isOpen && !isSent && (
          <button
            type="button"
            className="service-quote-cta__button"
            aria-expanded={isOpen}
            aria-controls="service-quote-form-panel"
            onClick={openForm}
          >
            {copy.button}
          </button>
        )}

        {isSent && (
          <div className="service-quote-cta__status" role="status" aria-live="polite">
            {copy.success}
          </div>
        )}

        {isOpen && !isSent && (
          <form
            id="service-quote-form-panel"
            className="service-quote-form"
            onSubmit={handleSubmit}
            noValidate
          >
            <input
              type="text"
              name="_website"
              value={form._website}
              onChange={(event) => updateField("_website", event.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="service-quote-form__honeypot"
            />

            <div className="service-quote-form__grid">
              <Field
                id="service-quote-name"
                label={copy.name}
                error={errors.name}
              >
                <input
                  ref={nameRef}
                  id="service-quote-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  aria-invalid={!!errors.name}
                  aria-describedby={
                    errors.name ? "service-quote-name-error" : undefined
                  }
                />
              </Field>

              <Field
                id="service-quote-email"
                label={copy.email}
                error={errors.email}
              >
                <input
                  id="service-quote-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  aria-invalid={!!errors.email}
                  aria-describedby={
                    errors.email ? "service-quote-email-error" : undefined
                  }
                />
              </Field>

              <Field id="service-quote-phone" label={copy.phone}>
                <input
                  id="service-quote-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={(event) => updateField("phone", event.target.value)}
                />
              </Field>

              <Field id="service-quote-company" label={copy.company}>
                <input
                  id="service-quote-company"
                  name="company"
                  type="text"
                  autoComplete="organization"
                  value={form.company}
                  onChange={(event) => updateField("company", event.target.value)}
                />
              </Field>
            </div>

            <Field id="service-quote-message" label={copy.message}>
              <textarea
                id="service-quote-message"
                name="message"
                rows={4}
                value={form.message}
                onChange={(event) => updateField("message", event.target.value)}
              />
            </Field>

            {errors.general && (
              <div
                className="service-quote-form__error"
                role="alert"
                aria-live="assertive"
              >
                {errors.general}
              </div>
            )}

            <div className="service-quote-form__actions">
              <button
                type="submit"
                className="service-quote-cta__button"
                disabled={isSubmitting}
              >
                {isSubmitting ? copy.sending : copy.send}
              </button>
              <button
                type="button"
                className="service-quote-form__secondary"
                onClick={closeForm}
              >
                {copy.close}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="service-quote-form__field">
      <label htmlFor={id}>{label}</label>
      {children}
      {error && (
        <div
          id={`${id}-error`}
          className="service-quote-form__field-error"
          role="alert"
        >
          {error}
        </div>
      )}
    </div>
  );
}
