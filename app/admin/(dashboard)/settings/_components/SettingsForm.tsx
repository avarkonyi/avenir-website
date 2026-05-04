"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  updateSiteSettings,
  type SiteSettingsPayload,
} from "../_actions";

type Props = {
  initial: SiteSettingsPayload;
};

export function SettingsForm({ initial }: Props) {
  const router = useRouter();
  const [state, setState] = useState<SiteSettingsPayload>(initial);
  const [pending, startTransition] = useTransition();

  function update<K extends keyof SiteSettingsPayload>(
    key: K,
    value: SiteSettingsPayload[K],
  ) {
    setState((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    startTransition(async () => {
      try {
        const result = await updateSiteSettings(state);
        if (result.ok) {
          toast.success("Beállítások mentve.");
          router.refresh();
        } else {
          toast.error(result.error);
        }
      } catch (err) {
        toast.error(
          err instanceof Error
            ? err.message
            : "Váratlan hiba történt. Próbáld újra.",
        );
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: 24 }}
    >
      <section style={sectionStyle}>
        <SectionLabel>Cégadatok</SectionLabel>
        <Field label="Hivatalos cégnév">
          <TextInput
            value={state.legalName}
            onChange={(value) => update("legalName", value)}
            disabled={pending}
            required
          />
        </Field>
        <Field label="Rövid cégnév">
          <TextInput
            value={state.legalNameShort}
            onChange={(value) => update("legalNameShort", value)}
            disabled={pending}
            required
          />
        </Field>
        <Field label="Alternatív / cégbírósági név">
          <TextInput
            value={state.alternateName}
            onChange={(value) => update("alternateName", value)}
            disabled={pending}
            required
          />
        </Field>
        <TwoColumn>
          <Field label="Cégjegyzékszám">
            <TextInput
              value={state.registrationId}
              onChange={(value) => update("registrationId", value)}
              disabled={pending}
              required
            />
          </Field>
          <Field label="Adószám">
            <TextInput
              value={state.taxId}
              onChange={(value) => update("taxId", value)}
              disabled={pending}
              required
            />
          </Field>
        </TwoColumn>
        <Field label="EU VAT azonosító">
          <TextInput
            value={state.vatId}
            onChange={(value) => update("vatId", value)}
            disabled={pending}
            required
          />
        </Field>
      </section>

      <section style={sectionStyle}>
        <SectionLabel>Cím</SectionLabel>
        <Field label="Székhely utca, házszám">
          <TextInput
            value={state.addressStreet}
            onChange={(value) => update("addressStreet", value)}
            disabled={pending}
            required
          />
        </Field>
        <TwoColumn>
          <Field label="Irányítószám">
            <TextInput
              value={state.addressPostalCode}
              onChange={(value) => update("addressPostalCode", value)}
              disabled={pending}
              required
            />
          </Field>
          <Field label="Település">
            <TextInput
              value={state.addressLocality}
              onChange={(value) => update("addressLocality", value)}
              disabled={pending}
              required
            />
          </Field>
        </TwoColumn>
        <Field label="Országkód">
          <TextInput
            value={state.addressCountry}
            onChange={(value) => update("addressCountry", value)}
            disabled={pending}
            required
            maxLength={2}
          />
        </Field>
        <Field label="Rövid cím">
          <TextInput
            value={state.addressShort}
            onChange={(value) => update("addressShort", value)}
            disabled={pending}
            required
          />
        </Field>
        <Field label="Google Maps URL">
          <TextInput
            type="url"
            value={state.mapsUrl}
            onChange={(value) => update("mapsUrl", value)}
            disabled={pending}
            required
          />
        </Field>
      </section>

      <section style={sectionStyle}>
        <SectionLabel>Kapcsolat</SectionLabel>
        <TwoColumn>
          <Field label="Telefonszám (gépi forma)">
            <TextInput
              value={state.phone}
              onChange={(value) => update("phone", value)}
              disabled={pending}
              required
              placeholder="+36-70-316-8218"
            />
          </Field>
          <Field label="Telefonszám (megjelenítés)">
            <TextInput
              value={state.phoneDisplay}
              onChange={(value) => update("phoneDisplay", value)}
              disabled={pending}
              required
              placeholder="+36 70 316 8218"
            />
          </Field>
        </TwoColumn>
        <Field label="Email cím">
          <TextInput
            type="email"
            value={state.email}
            onChange={(value) => update("email", value)}
            disabled={pending}
            required
          />
        </Field>
        <Field label="Nyitvatartás / rendelkezésre állás (opcionális)">
          <textarea
            value={state.officeHoursHu}
            onChange={(e) => update("officeHoursHu", e.target.value)}
            disabled={pending}
            rows={3}
            style={{ ...inputStyle(), resize: "vertical" }}
            placeholder="pl. H-P 9:00-17:00, diszpécseri készenlét 24/7"
          />
        </Field>
      </section>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          type="submit"
          disabled={pending}
          style={{
            background: pending ? "#8A1320" : "#D1172E",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            padding: "12px 22px",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: 0.5,
            textTransform: "uppercase",
            cursor: pending ? "wait" : "pointer",
          }}
        >
          {pending ? "Mentés..." : "Beállítások mentése"}
        </button>
      </div>
    </form>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontSize: 16,
        fontWeight: 700,
        color: "#0B1E3E",
        margin: 0,
        paddingBottom: 10,
        borderBottom: "1px solid #E2E8F0",
      }}
    >
      {children}
    </h2>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label style={{ display: "grid", gap: 6 }}>
      <span style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>
        {label}
      </span>
      {children}
    </label>
  );
}

function TwoColumn({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 16,
      }}
    >
      {children}
    </div>
  );
}

function TextInput({
  value,
  onChange,
  disabled,
  required,
  type = "text",
  maxLength,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  required?: boolean;
  type?: string;
  maxLength?: number;
  placeholder?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      required={required}
      maxLength={maxLength}
      placeholder={placeholder}
      style={inputStyle()}
    />
  );
}

function inputStyle(): React.CSSProperties {
  return {
    border: "1px solid #CBD5E1",
    borderRadius: 4,
    padding: "11px 13px",
    fontSize: 14,
    color: "#0B1E3E",
    outline: "none",
    background: "#fff",
    width: "100%",
    boxSizing: "border-box",
  };
}

const sectionStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #E2E8F0",
  borderRadius: 6,
  padding: "20px 24px",
  display: "grid",
  gap: 16,
};
