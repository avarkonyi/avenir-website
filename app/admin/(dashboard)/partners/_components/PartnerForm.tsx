"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { ImageUpload } from "@/app/admin/_components/ImageUpload";
import {
  createPartner,
  updatePartner,
  type PartnerPayload,
} from "../_actions";

// Shared form for /admin/partners/new and /admin/partners/[id]/edit.
// Conventions match PositionForm / ServiceForm:
//   - Controlled inputs via React state
//   - useTransition wraps the server-action call
//   - Server actions return { ok, ... } objects (no redirects)
//   - sonner toasts on success/error; router.push on success
//
// Single-locale per Iter 5 decision (company names typically don't
// translate). No locale tabs.
//
// Slug is NOT in the form — auto-derived server-side on create
// (from `name` via slugify, with `-2`/`-3`/… collision-suffix) and
// stays stable on edit. Spec: slug is internal-stable in Iter 5.
//
// Publish guard surfaced server-side: setting isPublished=true
// without a logo or with empty name returns
// "Publikáláshoz logo és név kötelező." via toast.

type FormState = {
  name: string;
  websiteUrl: string;
  logoUrl: string | null;
  sortOrder: string;
  isActive: boolean;
  isPublished: boolean;
  showInLogoStrip: boolean;
  logoUsageApprovedAt: string;
  logoUsageApprovedBy: string;
  logoUsageScope: string;
};

const EMPTY_STATE: FormState = {
  name: "",
  websiteUrl: "",
  logoUrl: null,
  sortOrder: "0",
  isActive: true,
  // Per spec: new partner records default to draft (isPublished=false)
  // so a name-only save succeeds without tripping the publish guard.
  isPublished: false,
  showInLogoStrip: false,
  logoUsageApprovedAt: "",
  logoUsageApprovedBy: "",
  logoUsageScope: "",
};

export type PartnerInitial = {
  id: number;
  name: string;
  websiteUrl: string | null;
  logoUrl: string | null;
  sortOrder: number;
  isActive: boolean;
  isPublished: boolean;
  showInLogoStrip: boolean;
  logoUsageApprovedAt: string | null;
  logoUsageApprovedBy: string | null;
  logoUsageScope: string | null;
};

type Props =
  | { mode: "create"; initial?: undefined }
  | { mode: "edit"; initial: PartnerInitial };

function initialFromPartner(p: PartnerInitial): FormState {
  return {
    name: p.name,
    websiteUrl: p.websiteUrl ?? "",
    logoUrl: p.logoUrl,
    sortOrder: String(p.sortOrder),
    isActive: p.isActive,
    isPublished: p.isPublished,
    showInLogoStrip: p.showInLogoStrip,
    logoUsageApprovedAt: p.logoUsageApprovedAt ?? "",
    logoUsageApprovedBy: p.logoUsageApprovedBy ?? "",
    logoUsageScope: p.logoUsageScope ?? "",
  };
}

export function PartnerForm(props: Props) {
  const router = useRouter();
  const [state, setState] = useState<FormState>(
    props.mode === "edit" ? initialFromPartner(props.initial) : EMPTY_STATE,
  );
  const [pending, startTransition] = useTransition();

  const id = props.mode === "edit" ? props.initial.id : undefined;

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setState((prev) => ({ ...prev, [key]: value }));
  }

  function buildPayload(): PartnerPayload {
    const parsedSort = Number.parseInt(state.sortOrder, 10);
    return {
      name: state.name,
      websiteUrl: state.websiteUrl,
      logoUrl: state.logoUrl,
      sortOrder: Number.isFinite(parsedSort) ? Math.max(0, parsedSort) : 0,
      isActive: state.isActive,
      isPublished: state.isPublished,
      showInLogoStrip: state.showInLogoStrip,
      logoUsageApprovedAt: state.logoUsageApprovedAt,
      logoUsageApprovedBy: state.logoUsageApprovedBy,
      logoUsageScope: state.logoUsageScope,
    };
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (state.name.trim().length === 0) {
      toast.error("A név kötelező.");
      return;
    }

    startTransition(async () => {
      try {
        const payload = buildPayload();
        if (props.mode === "create") {
          const result = await createPartner(payload);
          if (result.ok) {
            toast.success("Partner létrehozva.");
            router.push("/admin/partners");
          } else {
            toast.error(result.error);
          }
        } else {
          const result = await updatePartner(id!, payload);
          if (result.ok) {
            toast.success("Partner mentve.");
            router.push("/admin/partners");
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
      {/* Name + website */}
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
        <SectionLabel>Alapadatok</SectionLabel>

        <Field label="Partner neve">
          <input
            type="text"
            value={state.name}
            onChange={(e) => update("name", e.target.value)}
            maxLength={200}
            required
            disabled={pending}
            style={inputStyle()}
            placeholder="pl. Magyar Telekom Nyrt."
          />
          {props.mode === "create" && (
            <p style={helpTextStyle}>
              A slug a névből generálódik automatikusan a mentéskor.
              Mentés után már nem szerkeszthető.
            </p>
          )}
        </Field>

        <Field label="Weboldal (opcionális)">
          <input
            type="url"
            value={state.websiteUrl}
            onChange={(e) => update("websiteUrl", e.target.value)}
            maxLength={500}
            disabled={pending}
            style={inputStyle()}
            placeholder="https://example.com"
          />
          <p style={helpTextStyle}>
            Ha megadsz weboldalt, annak HTTPS protokollt kell használnia.
            Üresen hagyva a mező nem jelenik meg.
          </p>
        </Field>
      </section>

      {/* Logo upload */}
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
        <SectionLabel>Logo</SectionLabel>
        <ImageUpload
          value={state.logoUrl}
          folder="partners"
          onChange={(url) => update("logoUrl", url)}
          label="Partner logo feltöltése"
        />
        <p style={helpTextStyle}>
          A logo opcionális, de a publikáláshoz kötelező. JPEG, PNG vagy
          WebP, max. 5 MB. SVG támogatás később érkezik.
        </p>
      </section>

      {/* Homepage logo strip approval */}
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
        <SectionLabel>Főoldali logósáv</SectionLabel>

        <Checkbox
          label="Megjelenítés a főoldali partnerlogó sávban"
          checked={state.showInLogoStrip}
          onChange={(v) => update("showInLogoStrip", v)}
          disabled={pending}
        />
        <p style={{ ...helpTextStyle, marginTop: -8 }}>
          Csak akkor kapcsold be, ha a nyilvános logóhasználat kifejezetten
          jóvá van hagyva a főoldalra. A publikálás önmagában nem kapcsolja be.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
          }}
        >
          <Field label="Jóváhagyás dátuma">
            <input
              type="date"
              value={state.logoUsageApprovedAt}
              onChange={(e) => update("logoUsageApprovedAt", e.target.value)}
              disabled={pending}
              style={inputStyle()}
            />
          </Field>

          <Field label="Jóváhagyó / proof owner">
            <input
              type="text"
              value={state.logoUsageApprovedBy}
              onChange={(e) => update("logoUsageApprovedBy", e.target.value)}
              maxLength={200}
              disabled={pending}
              style={inputStyle()}
              placeholder="belső felelős vagy jóváhagyó"
            />
          </Field>
        </div>

        <Field label="Használati scope / megjegyzés">
          <textarea
            value={state.logoUsageScope}
            onChange={(e) => update("logoUsageScope", e.target.value)}
            maxLength={1000}
            disabled={pending}
            style={{ ...inputStyle(), minHeight: 88, resize: "vertical" }}
            placeholder="pl. főoldali logósáv, belső proof alapján; lejárat vagy korlátozás, ha van"
          />
          <p style={helpTextStyle}>
            Rögzítsd, hogy hol használható a logó. A publikus felület csak
            aktív, publikált, logóval rendelkező, jóváhagyott sorokat jelenít meg.
          </p>
        </Field>
      </section>

      {/* Settings */}
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
        <SectionLabel>Beállítások</SectionLabel>

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
            Sorrend a listában (alacsonyabb szám = előrébb). A drag-drop
            újrarendezés is ezt frissíti.
          </p>
        </Field>

        <Checkbox
          label="Aktív (megjeleníthető a publikus oldalon)"
          checked={state.isActive}
          onChange={(v) => update("isActive", v)}
          disabled={pending}
        />

        <Checkbox
          label="Publikálva (publikus felületen való megjelenítésre kész)"
          checked={state.isPublished}
          onChange={(v) => update("isPublished", v)}
          disabled={pending}
        />
        <p style={{ ...helpTextStyle, marginTop: -8 }}>
          A publikáláshoz név és logo kötelező. A főoldali logósávban csak
          külön bekapcsolt és jóváhagyott logók jelenhetnek meg.
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
          href="/admin/partners"
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

// ── small reusable bits (matches PositionForm style) ──────────────────

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
