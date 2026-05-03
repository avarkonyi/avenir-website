"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { ImageUpload } from "@/app/admin/_components/ImageUpload";
import { PdfUpload } from "@/app/admin/_components/PdfUpload";
import {
  createCertification,
  updateCertification,
  type CertificationPayload,
} from "../_actions";

// Shared form for /admin/certifications/new and
// /admin/certifications/[id]/edit. Hybrid pattern:
//   - Locale tabs (HU/EN/DE/ZH) for fullName + description + scope
//     (mirrors PositionForm). Per-tab indicator: ✓ if fullName is
//     filled (since fullName is the only NOT-NULL across tabs;
//     description + scope are nullable but description for HU is
//     required at publish time).
//   - Single-locale shared sections for identity, issuer chain,
//     validity, assets, and listing controls.
//
// Slug is NOT in the form — auto-derived server-side on create
// from `name` (e.g. "ISO 9001" → "iso-9001") with a `-2`/`-3`/…
// collision suffix. Stays stable on edit.
//
// Publish guard surfaced server-side: setting isPublished=true
// without name + fullNameHu + descriptionHu + pdfUrl all present
// returns "Publikáláshoz név, magyar teljes cím, magyar leírás és
// PDF kötelező." via toast.

type Locale = "hu" | "en" | "de" | "zh";
const LOCALES: readonly Locale[] = ["hu", "en", "de", "zh"];
const LOCALE_LABEL: Record<Locale, string> = {
  hu: "🇭🇺 Magyar",
  en: "🇬🇧 English",
  de: "🇩🇪 Deutsch",
  zh: "🇨🇳 中文",
};
const LOCALE_NAME_HU: Record<Locale, string> = {
  hu: "magyar",
  en: "angol",
  de: "német",
  zh: "kínai",
};

type FormState = {
  name: string;
  standardCode: string;
  certificateNumber: string;

  fullNameHu: string;
  fullNameEn: string;
  fullNameDe: string;
  fullNameZh: string;

  descriptionHu: string;
  descriptionEn: string;
  descriptionDe: string;
  descriptionZh: string;

  scopeHu: string;
  scopeEn: string;
  scopeDe: string;
  scopeZh: string;

  issuer: string;
  issuerUrl: string;
  accreditationBody: string;
  accreditationNumber: string;
  iafMlaMember: boolean;
  verifyUrl: string;

  issuedDate: string;
  expiresDate: string;

  credentialCategory: string;

  logoUrl: string | null;
  pdfUrl: string | null;

  sortOrder: string;
  active: boolean;
  isPublished: boolean;
};

const EMPTY_STATE: FormState = {
  name: "",
  standardCode: "",
  certificateNumber: "",

  fullNameHu: "",
  fullNameEn: "",
  fullNameDe: "",
  fullNameZh: "",

  descriptionHu: "",
  descriptionEn: "",
  descriptionDe: "",
  descriptionZh: "",

  scopeHu: "",
  scopeEn: "",
  scopeDe: "",
  scopeZh: "",

  issuer: "",
  issuerUrl: "",
  accreditationBody: "",
  accreditationNumber: "",
  iafMlaMember: false,
  verifyUrl: "",

  issuedDate: "",
  expiresDate: "",

  credentialCategory: "",

  logoUrl: null,
  pdfUrl: null,

  sortOrder: "0",
  active: true,
  // Per spec: new certs default to draft (isPublished=false) so a
  // partial save without PDF/full description succeeds without
  // tripping the publish guard.
  isPublished: false,
};

export type CertificationInitial = {
  id: number;
  name: string;
  standardCode: string | null;
  certificateNumber: string | null;

  fullNameHu: string;
  fullNameEn: string;
  fullNameDe: string;
  fullNameZh: string;

  descriptionHu: string | null;
  descriptionEn: string | null;
  descriptionDe: string | null;
  descriptionZh: string | null;

  scopeHu: string | null;
  scopeEn: string | null;
  scopeDe: string | null;
  scopeZh: string | null;

  issuer: string;
  issuerUrl: string | null;
  accreditationBody: string | null;
  accreditationNumber: string | null;
  iafMlaMember: boolean;
  verifyUrl: string | null;

  issuedDate: string | null;
  expiresDate: string | null;

  credentialCategory: string | null;

  logoUrl: string | null;
  pdfUrl: string | null;

  sortOrder: number;
  active: boolean;
  isPublished: boolean;
};

type Props =
  | { mode: "create"; initial?: undefined }
  | { mode: "edit"; initial: CertificationInitial };

function initialFromCert(c: CertificationInitial): FormState {
  return {
    name: c.name,
    standardCode: c.standardCode ?? "",
    certificateNumber: c.certificateNumber ?? "",

    fullNameHu: c.fullNameHu,
    fullNameEn: c.fullNameEn,
    fullNameDe: c.fullNameDe,
    fullNameZh: c.fullNameZh,

    descriptionHu: c.descriptionHu ?? "",
    descriptionEn: c.descriptionEn ?? "",
    descriptionDe: c.descriptionDe ?? "",
    descriptionZh: c.descriptionZh ?? "",

    scopeHu: c.scopeHu ?? "",
    scopeEn: c.scopeEn ?? "",
    scopeDe: c.scopeDe ?? "",
    scopeZh: c.scopeZh ?? "",

    issuer: c.issuer,
    issuerUrl: c.issuerUrl ?? "",
    accreditationBody: c.accreditationBody ?? "",
    accreditationNumber: c.accreditationNumber ?? "",
    iafMlaMember: c.iafMlaMember,
    verifyUrl: c.verifyUrl ?? "",

    issuedDate: c.issuedDate ?? "",
    expiresDate: c.expiresDate ?? "",

    credentialCategory: c.credentialCategory ?? "",

    logoUrl: c.logoUrl,
    pdfUrl: c.pdfUrl,

    sortOrder: String(c.sortOrder),
    active: c.active,
    isPublished: c.isPublished,
  };
}

export function CertificationForm(props: Props) {
  const router = useRouter();
  const [state, setState] = useState<FormState>(
    props.mode === "edit" ? initialFromCert(props.initial) : EMPTY_STATE,
  );
  const [activeTab, setActiveTab] = useState<Locale>("hu");
  const [pending, startTransition] = useTransition();

  const id = props.mode === "edit" ? props.initial.id : undefined;

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setState((prev) => ({ ...prev, [key]: value }));
  }

  // Per-tab completion: fullName is the only NOT-NULL field across
  // locale tabs, so it's the gate for the ✓/— indicator. Description
  // + scope are nullable and intentionally not required for save
  // (they're optional translations).
  function isLocaleComplete(loc: Locale): boolean {
    const c = cap(loc);
    const titleKey = `fullName${c}` as keyof FormState;
    return String(state[titleKey] ?? "").trim().length > 0;
  }

  function firstIncompleteLocale(): Locale | null {
    for (const loc of LOCALES) {
      if (!isLocaleComplete(loc)) return loc;
    }
    return null;
  }

  function buildPayload(): CertificationPayload {
    const parsedSort = Number.parseInt(state.sortOrder, 10);
    return {
      name: state.name,
      standardCode: state.standardCode,
      certificateNumber: state.certificateNumber,

      fullNameHu: state.fullNameHu,
      fullNameEn: state.fullNameEn,
      fullNameDe: state.fullNameDe,
      fullNameZh: state.fullNameZh,

      descriptionHu: state.descriptionHu,
      descriptionEn: state.descriptionEn,
      descriptionDe: state.descriptionDe,
      descriptionZh: state.descriptionZh,

      scopeHu: state.scopeHu,
      scopeEn: state.scopeEn,
      scopeDe: state.scopeDe,
      scopeZh: state.scopeZh,

      issuer: state.issuer,
      issuerUrl: state.issuerUrl,
      accreditationBody: state.accreditationBody,
      accreditationNumber: state.accreditationNumber,
      iafMlaMember: state.iafMlaMember,
      verifyUrl: state.verifyUrl,

      issuedDate: state.issuedDate,
      expiresDate: state.expiresDate,

      credentialCategory: state.credentialCategory,

      logoUrl: state.logoUrl,
      pdfUrl: state.pdfUrl,

      sortOrder: Number.isFinite(parsedSort) ? Math.max(0, parsedSort) : 0,
      active: state.active,
      isPublished: state.isPublished,
    };
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (state.name.trim().length === 0) {
      toast.error("A rövid név (pl. ISO 9001) kötelező.");
      return;
    }
    if (state.issuer.trim().length === 0) {
      toast.error("A kiállító (issuer) kötelező.");
      return;
    }

    const incomplete = firstIncompleteLocale();
    if (incomplete) {
      toast.error(
        `Hiányzó teljes cím a(z) ${LOCALE_NAME_HU[incomplete]} nyelven.`,
      );
      setActiveTab(incomplete);
      return;
    }

    startTransition(async () => {
      try {
        const payload = buildPayload();
        if (props.mode === "create") {
          const result = await createCertification(payload);
          if (result.ok) {
            toast.success("Tanúsítvány létrehozva.");
            router.push("/admin/certifications");
          } else {
            toast.error(result.error);
          }
        } else {
          const result = await updateCertification(id!, payload);
          if (result.ok) {
            toast.success("Tanúsítvány mentve.");
            router.push("/admin/certifications");
          } else {
            toast.error(result.error);
          }
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
      {/* Identity (single-locale) */}
      <section
        style={{
          background: "#fff",
          border: "1px solid #E2E8F0",
          borderRadius: 6,
          padding: "20px 24px",
          display: "grid",
          gap: 16,
        }}
      >
        <SectionLabel>Azonosítás</SectionLabel>

        <Field label="Rövid név">
          <input
            type="text"
            value={state.name}
            onChange={(e) => update("name", e.target.value)}
            maxLength={100}
            required
            disabled={pending}
            style={inputStyle()}
            placeholder="pl. ISO 9001"
          />
          {props.mode === "create" && (
            <p style={helpTextStyle}>
              A slug a rövid névből generálódik automatikusan. Mentés
              után már nem szerkeszthető.
            </p>
          )}
        </Field>

        <Field label="Szabvány kód (opcionális)">
          <input
            type="text"
            value={state.standardCode}
            onChange={(e) => update("standardCode", e.target.value)}
            maxLength={100}
            disabled={pending}
            style={inputStyle()}
            placeholder="pl. ISO 9001:2015"
          />
        </Field>

        <Field label="Tanúsítvány száma (opcionális)">
          <input
            type="text"
            value={state.certificateNumber}
            onChange={(e) => update("certificateNumber", e.target.value)}
            maxLength={100}
            disabled={pending}
            style={inputStyle()}
            placeholder="pl. 843579099"
          />
        </Field>
      </section>

      {/* Locale tabs: fullName + description + scope */}
      <section
        style={{
          background: "#fff",
          border: "1px solid #E2E8F0",
          borderRadius: 6,
          overflow: "hidden",
        }}
      >
        <div
          role="tablist"
          style={{
            display: "flex",
            gap: 0,
            borderBottom: "1px solid #E2E8F0",
            background: "#F8FAFC",
          }}
        >
          {LOCALES.map((loc) => (
            <TabButton
              key={loc}
              active={activeTab === loc}
              hasContent={isLocaleComplete(loc)}
              onClick={() => setActiveTab(loc)}
            >
              {LOCALE_LABEL[loc]}
            </TabButton>
          ))}
        </div>
        <div style={{ padding: "20px 24px" }}>
          <LocaleFields
            locale={activeTab}
            state={state}
            update={update}
            pending={pending}
          />
        </div>
      </section>

      {/* Issuer chain (single-locale) */}
      <section
        style={{
          background: "#fff",
          border: "1px solid #E2E8F0",
          borderRadius: 6,
          padding: "20px 24px",
          display: "grid",
          gap: 16,
        }}
      >
        <SectionLabel>Kiállító & akkreditáció</SectionLabel>

        <Field label="Kiállító">
          <input
            type="text"
            value={state.issuer}
            onChange={(e) => update("issuer", e.target.value)}
            maxLength={300}
            required
            disabled={pending}
            style={inputStyle()}
            placeholder="pl. MARTON Szakértő Iroda Kft."
          />
        </Field>

        <Field label="Kiállító URL (opcionális)">
          <input
            type="url"
            value={state.issuerUrl}
            onChange={(e) => update("issuerUrl", e.target.value)}
            maxLength={500}
            disabled={pending}
            style={inputStyle()}
            placeholder="https://martoncert.hu"
          />
          <p style={helpTextStyle}>HTTPS protokoll kötelező, ha kitöltöd.</p>
        </Field>

        <Field label="Akkreditáló testület (opcionális)">
          <input
            type="text"
            value={state.accreditationBody}
            onChange={(e) => update("accreditationBody", e.target.value)}
            maxLength={50}
            disabled={pending}
            style={inputStyle()}
            placeholder="pl. NAH"
          />
        </Field>

        <Field label="Akkreditációs szám (opcionális)">
          <input
            type="text"
            value={state.accreditationNumber}
            onChange={(e) => update("accreditationNumber", e.target.value)}
            maxLength={50}
            disabled={pending}
            style={inputStyle()}
            placeholder="pl. NAH-4-0001/2023"
          />
        </Field>

        <Checkbox
          label="IAF MLA tag (nemzetközileg elismert akkreditáció)"
          checked={state.iafMlaMember}
          onChange={(v) => update("iafMlaMember", v)}
          disabled={pending}
        />

        <Field label="Ellenőrző URL (opcionális)">
          <input
            type="url"
            value={state.verifyUrl}
            onChange={(e) => update("verifyUrl", e.target.value)}
            maxLength={500}
            disabled={pending}
            style={inputStyle()}
            placeholder="https://iafcertsearch.org/..."
          />
          <p style={helpTextStyle}>
            HTTPS protokoll kötelező, ha kitöltöd. Pl. IAF CertSearch
            közvetlen link.
          </p>
        </Field>
      </section>

      {/* Validity */}
      <section
        style={{
          background: "#fff",
          border: "1px solid #E2E8F0",
          borderRadius: 6,
          padding: "20px 24px",
          display: "grid",
          gap: 16,
        }}
      >
        <SectionLabel>Érvényesség</SectionLabel>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
          }}
        >
          <Field label="Kiállítás dátuma (opcionális)">
            <input
              type="date"
              value={state.issuedDate}
              onChange={(e) => update("issuedDate", e.target.value)}
              disabled={pending}
              style={inputStyle()}
            />
          </Field>

          <Field label="Lejárat dátuma (opcionális)">
            <input
              type="date"
              value={state.expiresDate}
              onChange={(e) => update("expiresDate", e.target.value)}
              disabled={pending}
              style={inputStyle()}
            />
          </Field>
        </div>

        <Field label="Schema.org credentialCategory (opcionális)">
          <input
            type="text"
            value={state.credentialCategory}
            onChange={(e) => update("credentialCategory", e.target.value)}
            maxLength={100}
            disabled={pending}
            style={inputStyle()}
            placeholder="pl. ManagementSystem"
          />
        </Field>
      </section>

      {/* Assets: logo + PDF */}
      <section
        style={{
          background: "#fff",
          border: "1px solid #E2E8F0",
          borderRadius: 6,
          padding: "20px 24px",
          display: "grid",
          gap: 24,
        }}
      >
        <SectionLabel>Fájlok</SectionLabel>

        <div>
          <span
            style={{
              display: "block",
              fontSize: 12,
              fontWeight: 700,
              color: "#475569",
              textTransform: "uppercase",
              letterSpacing: 0.5,
              marginBottom: 6,
            }}
          >
            Logo (opcionális)
          </span>
          <ImageUpload
            value={state.logoUrl}
            folder="certifications"
            onChange={(url) => update("logoUrl", url)}
            label="Logo feltöltése"
          />
          <p style={helpTextStyle}>
            JPEG, PNG vagy WebP, max. 5 MB. Ha üres, a publikus oldal
            inline SVG fallback logót renderel.
          </p>
        </div>

        <div>
          <span
            style={{
              display: "block",
              fontSize: 12,
              fontWeight: 700,
              color: "#475569",
              textTransform: "uppercase",
              letterSpacing: 0.5,
              marginBottom: 6,
            }}
          >
            PDF
          </span>
          <PdfUpload
            value={state.pdfUrl}
            folder="certifications"
            onChange={(url) => update("pdfUrl", url)}
            label="PDF feltöltése"
          />
          <p style={helpTextStyle}>
            A tanúsítvány PDF-je. A publikáláshoz kötelező.
          </p>
        </div>
      </section>

      {/* Listing controls */}
      <section
        style={{
          background: "#fff",
          border: "1px solid #E2E8F0",
          borderRadius: 6,
          padding: "20px 24px",
          display: "grid",
          gap: 16,
        }}
      >
        <SectionLabel>Listázás</SectionLabel>

        <Field label="Sorrend">
          <input
            type="number"
            min={0}
            value={state.sortOrder}
            onChange={(e) => update("sortOrder", e.target.value)}
            disabled={pending}
            style={{ ...inputStyle(), width: 120 }}
          />
          <p style={helpTextStyle}>
            Sorrend a listában (alacsonyabb szám = előrébb). A
            drag-drop újrarendezés is ezt frissíti.
          </p>
        </Field>

        <Checkbox
          label="Aktív (megjelenik a publikus oldalon)"
          checked={state.active}
          onChange={(v) => update("active", v)}
          disabled={pending}
        />

        <Checkbox
          label="Publikálva (Iter 6B-től a publikus felület csak ezeket jeleníti meg)"
          checked={state.isPublished}
          onChange={(v) => update("isPublished", v)}
          disabled={pending}
        />
        <p style={{ ...helpTextStyle, marginTop: -8 }}>
          A publikáláshoz név, magyar teljes cím, magyar leírás és PDF
          mind kötelező. Iter 6A-ban a publikus oldal még csak az
          aktív flagre szűr — a publikálás flag a 6B előkészítése.
        </p>
      </section>

      {/* Action bar */}
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          flexWrap: "wrap",
          justifyContent: "flex-end",
        }}
      >
        <Link
          href="/admin/certifications"
          style={{
            color: "#0B1E3E",
            textDecoration: "none",
            fontSize: 13,
            fontWeight: 600,
            padding: "10px 18px",
            borderRadius: 4,
            border: "1px solid #CBD5E1",
            background: "#fff",
          }}
        >
          Mégse
        </Link>
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
          {pending ? "Mentés folyamatban…" : "Mentés"}
        </button>
      </div>
    </form>
  );
}

// ── locale-specific fields ─────────────────────────────────────────────

function LocaleFields({
  locale,
  state,
  update,
  pending,
}: {
  locale: Locale;
  state: FormState;
  update: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
  pending: boolean;
}) {
  const c = cap(locale);
  const titleKey = `fullName${c}` as keyof FormState;
  const descKey = `description${c}` as keyof FormState;
  const scopeKey = `scope${c}` as keyof FormState;

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <Field label="Teljes cím (kötelező)">
        <input
          type="text"
          value={String(state[titleKey] ?? "")}
          onChange={(e) => update(titleKey, e.target.value as never)}
          maxLength={500}
          required
          disabled={pending}
          style={inputStyle()}
          placeholder="pl. ISO 9001:2015 Minőségirányítási rendszer"
        />
      </Field>

      <Field label="Leírás (opcionális, magyarra publikáláshoz kötelező)">
        <textarea
          value={String(state[descKey] ?? "")}
          onChange={(e) => update(descKey, e.target.value as never)}
          rows={5}
          maxLength={2000}
          disabled={pending}
          style={{ ...inputStyle(), resize: "vertical", fontFamily: "inherit" }}
          placeholder="A tanúsítvány hatálya és jelentősége…"
        />
      </Field>

      <Field label="Hatály / scope (opcionális)">
        <textarea
          value={String(state[scopeKey] ?? "")}
          onChange={(e) => update(scopeKey, e.target.value as never)}
          rows={3}
          maxLength={1000}
          disabled={pending}
          style={{ ...inputStyle(), resize: "vertical", fontFamily: "inherit" }}
          placeholder="pl. teljeskörű biztonsági szolgáltatás"
        />
      </Field>
    </div>
  );
}

// ── small reusable bits (matches PositionForm style) ──────────────────

function TabButton({
  active,
  hasContent,
  onClick,
  children,
}: {
  active: boolean;
  hasContent: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      style={{
        flex: 1,
        padding: "12px 16px",
        background: active ? "#fff" : "transparent",
        color: "#0B1E3E",
        border: "none",
        borderBottom: active ? "2px solid #D1172E" : "2px solid transparent",
        fontWeight: 600,
        fontSize: 13,
        cursor: "pointer",
        fontFamily: "inherit",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
      }}
    >
      <span>{children}</span>
      <span aria-hidden style={{ color: hasContent ? "#15803D" : "#94A3B8" }}>
        {hasContent ? "✓" : "—"}
      </span>
    </button>
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
    <label style={{ display: "block" }}>
      <span
        style={{
          display: "block",
          fontSize: 12,
          fontWeight: 700,
          color: "#475569",
          textTransform: "uppercase",
          letterSpacing: 0.5,
          marginBottom: 6,
        }}
      >
        {label}
      </span>
      {children}
    </label>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        margin: 0,
        marginBottom: 4,
        fontSize: 12,
        letterSpacing: 0.8,
        textTransform: "uppercase",
        fontWeight: 700,
        color: "#64748B",
      }}
    >
      {children}
    </h2>
  );
}

function Checkbox({
  label,
  checked,
  onChange,
  disabled,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <label
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        fontSize: 13,
        fontWeight: 600,
        color: "#0B1E3E",
        cursor: disabled ? "not-allowed" : "pointer",
        userSelect: "none",
        opacity: disabled ? 0.7 : 1,
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        style={{ width: 16, height: 16 }}
      />
      {label}
    </label>
  );
}

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

const helpTextStyle: React.CSSProperties = {
  margin: "6px 0 0",
  fontSize: 12,
  color: "#94A3B8",
};

function cap<S extends string>(s: S): Capitalize<S> {
  return (s.charAt(0).toUpperCase() + s.slice(1)) as Capitalize<S>;
}
