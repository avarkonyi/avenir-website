"use client";

import { useEffect, useRef, useState } from "react";
import { trackAnalyticsEvent } from "@/lib/analytics/events";
import { DE_REVIEW_SERVICE_QUOTE_COPY } from "@/lib/services/de-service-shared-copy";

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
const EVENT_TYPE = "service_quote" as const;

export const SERVICE_QUOTE_COPY = {
  hu: {
    title: "Ajánlatkérés",
    button: "Ajánlatkérés",
    close: "Mégsem",
    name: "Név",
    email: "E-mail",
    phone: "Telefon",
    company: "Cég (opcionális)",
    message: "Üzenet",
    messagePlaceholder: "Írja le röviden, miben segíthetünk.",
    send: "Küldés",
    sending: "Küldés folyamatban...",
    success:
      "Köszönjük, megkaptuk a megkeresést. Munkatársunk a megadott elérhetőségen visszajelez.",
    error:
      "Hiba történt a küldés során. Kérjük, próbálja újra később, vagy hívjon minket.",
    nameRequired: "Kérjük, adja meg a nevét.",
    emailRequired: "Kérjük, adja meg az e-mail címét.",
    emailInvalid: "Kérjük, érvényes e-mail címet adjon meg.",
    requiredField: "* Kötelező mező",
    nextStepHelper:
      "Munkaidőben többnyire még aznap visszajelzünk, de legkésőbb a következő munkanapon felvesszük Önnel a kapcsolatot. Az ajánlat elkészítésének ideje az igény összetettségétől függ.",
  },
  en: {
    title: "Request a quote",
    button: "Request a quote",
    close: "Cancel",
    name: "Name",
    email: "Email",
    phone: "Phone",
    company: "Company (optional)",
    message: "Message",
    messagePlaceholder: "Briefly describe how we can help.",
    send: "Send",
    sending: "Sending...",
    success:
      "Thank you, we have received your request. Our team will respond using the contact details provided.",
    error:
      "There was an error sending your request. Please try again later or contact us by phone.",
    nameRequired: "Please enter your name.",
    emailRequired: "Please enter your email address.",
    emailInvalid: "Please enter a valid email address.",
    requiredField: "* Required field",
    nextStepHelper:
      "Within business hours we usually reply the same day, and in any case we'll be in touch by the next business day. The time needed to prepare a quote depends on the scope and complexity of your request.",
  },
  de: DE_REVIEW_SERVICE_QUOTE_COPY,
} as const;

type ServiceQuoteCopy = (typeof SERVICE_QUOTE_COPY)[keyof typeof SERVICE_QUOTE_COPY];

export function buildServiceQuotePayload({
  form,
  locale,
  serviceSlug,
  sourcePath,
}: {
  form: FormState;
  locale: string;
  serviceSlug: string;
  sourcePath: string;
}) {
  return {
    name: form.name.trim(),
    email: form.email.trim(),
    phone: form.phone.trim(),
    company: form.company.trim(),
    message: form.message.trim(),
    service: serviceSlug,
    locale,
    _website: form._website,
    form_variant: FORM_VARIANT,
    source_path: sourcePath,
  };
}

export function ServiceQuoteCta({
  locale,
  serviceSlug,
  serviceLabel,
}: {
  locale: string;
  serviceSlug: string;
  serviceLabel: string;
}) {
  const copy =
    locale === "hu"
      ? SERVICE_QUOTE_COPY.hu
      : locale === "de"
        ? SERVICE_QUOTE_COPY.de
        : SERVICE_QUOTE_COPY.en;
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
    event_type: EVENT_TYPE,
  });

  const openForm = () => {
    trackAnalyticsEvent("service_quote_cta_click", analyticsParams());
    if (!isOpen) {
      formStartedRef.current = false;
      trackAnalyticsEvent("service_quote_form_open", analyticsParams());
    }
    setIsOpen(true);
    setIsSent(false);
  };

  const closeForm = () => {
    setIsOpen(false);
    formStartedRef.current = false;
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
      trackAnalyticsEvent("service_quote_form_submit_error", analyticsParams());
      return;
    }

    setIsSubmitting(true);
    try {
      const sourcePath = window.location.pathname + window.location.search;
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          buildServiceQuotePayload({
            form,
            locale,
            serviceSlug: safeServiceSlug,
            sourcePath,
          }),
        ),
      });

      if (response.ok) {
        trackAnalyticsEvent(
          "service_quote_form_submit_success",
          analyticsParams(),
        );
        setIsSent(true);
        return;
      }

      trackAnalyticsEvent("service_quote_form_submit_error", analyticsParams());
      setErrors({ general: copy.error });
    } catch {
      trackAnalyticsEvent("service_quote_form_submit_error", analyticsParams());
      setErrors({ general: copy.error });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ServiceQuoteCtaPanel
      copy={copy}
      form={form}
      errors={errors}
      isOpen={isOpen}
      isSent={isSent}
      isSubmitting={isSubmitting}
      nameRef={nameRef}
      onOpen={openForm}
      onClose={closeForm}
      onSubmit={handleSubmit}
      onFieldChange={updateField}
    />
  );
}

export function ServiceQuoteCtaPanel({
  copy,
  form,
  errors,
  isOpen,
  isSent,
  isSubmitting,
  nameRef,
  onOpen,
  onClose,
  onSubmit,
  onFieldChange,
}: {
  copy: ServiceQuoteCopy;
  form: FormState;
  errors: Errors;
  isOpen: boolean;
  isSent: boolean;
  isSubmitting: boolean;
  nameRef: React.RefObject<HTMLInputElement | null>;
  onOpen: () => void;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onFieldChange: (field: keyof FormState, value: string) => void;
}) {
  return (
    <section
      id="service-quote"
      className="service-quote-cta-section"
      aria-labelledby="service-quote-title"
    >
      <div
        className={`service-quote-cta${
          !isOpen && !isSent ? " service-quote-cta--collapsed" : ""
        }`}
      >
        {(!isOpen || isSent) && (
          <h2 id="service-quote-title" className="sr-only">
            {copy.title}
          </h2>
        )}

        {!isOpen && !isSent && (
          <button
            type="button"
            className="service-quote-cta__button"
            aria-expanded={isOpen}
            aria-controls="service-quote-form-panel"
            onClick={onOpen}
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
          <>
            <h2 id="service-quote-title" className="service-quote-form__title">
              {copy.title}
            </h2>
            <form
              id="service-quote-form-panel"
              className="service-quote-form"
              onSubmit={onSubmit}
              noValidate
            >
              <input
                type="text"
                name="_website"
                value={form._website}
                onChange={(event) =>
                  onFieldChange("_website", event.target.value)
                }
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="service-quote-form__honeypot"
              />

              {/* required markers follow the shared Zod schema
                  (lib/contact-schema.ts): only name and email are required.
                  The form keeps noValidate, so the required attribute is an
                  a11y/visual signal, not a validation change. */}
              <div className="service-quote-form__grid">
                <Field
                  id="service-quote-name"
                  label={copy.name}
                  required
                  error={errors.name}
                >
                  <input
                    ref={nameRef}
                    id="service-quote-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    aria-required="true"
                    value={form.name}
                    onChange={(event) =>
                      onFieldChange("name", event.target.value)
                    }
                    aria-invalid={!!errors.name}
                    aria-describedby={
                      errors.name ? "service-quote-name-error" : undefined
                    }
                  />
                </Field>

                <Field
                  id="service-quote-email"
                  label={copy.email}
                  required
                  error={errors.email}
                >
                  <input
                    id="service-quote-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    aria-required="true"
                    value={form.email}
                    onChange={(event) =>
                      onFieldChange("email", event.target.value)
                    }
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
                    onChange={(event) =>
                      onFieldChange("phone", event.target.value)
                    }
                  />
                </Field>

                <Field id="service-quote-company" label={copy.company}>
                  <input
                    id="service-quote-company"
                    name="company"
                    type="text"
                    autoComplete="organization"
                    value={form.company}
                    onChange={(event) =>
                      onFieldChange("company", event.target.value)
                    }
                  />
                </Field>
              </div>

              <Field id="service-quote-message" label={copy.message}>
                <textarea
                  id="service-quote-message"
                  name="message"
                  rows={4}
                  placeholder={copy.messagePlaceholder}
                  value={form.message}
                  onChange={(event) =>
                    onFieldChange("message", event.target.value)
                  }
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

              {/* Required-field legend + non-SLA "what happens next" helper.
                  No response-time promise — see docs/copy_strategy.md. */}
              <p className="service-quote-form__hint">{copy.requiredField}</p>
              <p className="service-quote-form__hint">{copy.nextStepHelper}</p>

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
                  onClick={onClose}
                >
                  {copy.close}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </section>
  );
}

function Field({
  id,
  label,
  required = false,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="service-quote-form__field">
      <label htmlFor={id}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
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
