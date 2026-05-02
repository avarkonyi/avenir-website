"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  createPosition,
  updatePosition,
  type PositionPayload,
} from "../_actions";

// Shared form for /admin/positions/new and /admin/positions/[id]/edit.
// Mirrors the ServiceForm conventions:
//   - Controlled inputs via React state
//   - useTransition wraps the server-action call
//   - Server actions return { ok, ... } objects (no redirects)
//   - sonner toasts on success/error; router.push on success
//   - Locale fields rendered as 4 tabs (HU/EN/DE/ZH); HU is the
//     default active tab. Per-tab indicator (✓ green / — gray) shows
//     whether ALL 3 locale-required fields (title, location, type)
//     are filled (after trim). On save attempt, validation jumps to
//     the first incomplete tab and surfaces the missing-locale error
//     via toast.
//
// All 12 locale fields are NOT NULL in the DB (positions table from
// migration 0003). Empty inputs would be a constraint violation, so
// the form requires every locale to be filled before save.

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
  titleHu: string;
  titleEn: string;
  titleDe: string;
  titleZh: string;
  locationHu: string;
  locationEn: string;
  locationDe: string;
  locationZh: string;
  typeHu: string;
  typeEn: string;
  typeDe: string;
  typeZh: string;
  applyEmail: string;
  sortOrder: string;
  active: boolean;
};

const EMPTY_STATE: FormState = {
  titleHu: "",
  titleEn: "",
  titleDe: "",
  titleZh: "",
  locationHu: "",
  locationEn: "",
  locationDe: "",
  locationZh: "",
  typeHu: "",
  typeEn: "",
  typeDe: "",
  typeZh: "",
  applyEmail: "info@afm.hu",
  sortOrder: "0",
  active: true,
};

export type PositionInitial = {
  id: number;
  titleHu: string;
  titleEn: string;
  titleDe: string;
  titleZh: string;
  locationHu: string;
  locationEn: string;
  locationDe: string;
  locationZh: string;
  typeHu: string;
  typeEn: string;
  typeDe: string;
  typeZh: string;
  applyEmail: string;
  sortOrder: number;
  active: boolean;
};

type Props =
  | { mode: "create"; initial?: undefined }
  | { mode: "edit"; initial: PositionInitial };

function initialFromPosition(p: PositionInitial): FormState {
  return {
    titleHu: p.titleHu,
    titleEn: p.titleEn,
    titleDe: p.titleDe,
    titleZh: p.titleZh,
    locationHu: p.locationHu,
    locationEn: p.locationEn,
    locationDe: p.locationDe,
    locationZh: p.locationZh,
    typeHu: p.typeHu,
    typeEn: p.typeEn,
    typeDe: p.typeDe,
    typeZh: p.typeZh,
    applyEmail: p.applyEmail,
    sortOrder: String(p.sortOrder),
    active: p.active,
  };
}

export function PositionForm(props: Props) {
  const router = useRouter();
  const [state, setState] = useState<FormState>(
    props.mode === "edit" ? initialFromPosition(props.initial) : EMPTY_STATE,
  );
  const [activeTab, setActiveTab] = useState<Locale>("hu");
  const [pending, startTransition] = useTransition();

  const id = props.mode === "edit" ? props.initial.id : undefined;

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setState((prev) => ({ ...prev, [key]: value }));
  }

  // Per-tab completion: ALL 3 required fields (title, location, type)
  // for that locale must be trimmed non-empty for the tab to show ✓.
  function isLocaleComplete(loc: Locale): boolean {
    const c = cap(loc);
    const titleKey = `title${c}` as keyof FormState;
    const locationKey = `location${c}` as keyof FormState;
    const typeKey = `type${c}` as keyof FormState;
    return (
      String(state[titleKey] ?? "").trim().length > 0 &&
      String(state[locationKey] ?? "").trim().length > 0 &&
      String(state[typeKey] ?? "").trim().length > 0
    );
  }

  function firstIncompleteLocale(): Locale | null {
    for (const loc of LOCALES) {
      if (!isLocaleComplete(loc)) return loc;
    }
    return null;
  }

  function buildPayload(): PositionPayload {
    const parsedSort = Number.parseInt(state.sortOrder, 10);
    return {
      titleHu: state.titleHu,
      titleEn: state.titleEn,
      titleDe: state.titleDe,
      titleZh: state.titleZh,
      locationHu: state.locationHu,
      locationEn: state.locationEn,
      locationDe: state.locationDe,
      locationZh: state.locationZh,
      typeHu: state.typeHu,
      typeEn: state.typeEn,
      typeDe: state.typeDe,
      typeZh: state.typeZh,
      applyEmail: state.applyEmail,
      sortOrder: Number.isFinite(parsedSort) ? Math.max(0, parsedSort) : 0,
      active: state.active,
    };
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const incomplete = firstIncompleteLocale();
    if (incomplete) {
      toast.error(
        `Hiányzó mezők a(z) ${LOCALE_NAME_HU[incomplete]} nyelven (cím, helyszín és típus mind kötelező).`,
      );
      setActiveTab(incomplete);
      return;
    }

    startTransition(async () => {
      try {
        const payload = buildPayload();
        if (props.mode === "create") {
          const result = await createPosition(payload);
          if (result.ok) {
            toast.success("Pozíció létrehozva.");
            router.push("/admin/positions");
          } else {
            toast.error(result.error);
          }
        } else {
          const result = await updatePosition(id!, payload);
          if (result.ok) {
            toast.success("Pozíció mentve.");
            router.push("/admin/positions");
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
      {/* Locale tabs */}
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

      {/* Shared (locale-independent) fields */}
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
        <SectionLabel>Általános beállítások</SectionLabel>

        <Field label="Jelentkezési email">
          <input
            type="email"
            value={state.applyEmail}
            onChange={(e) => update("applyEmail", e.target.value)}
            required
            maxLength={200}
            disabled={pending}
            style={inputStyle()}
          />
          <p style={helpTextStyle}>
            A pozícióhoz tartozó jelentkezési email cím. Alapértelmezett:
            info@afm.hu.
          </p>
        </Field>

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
            Sorrend a publikus listában (alacsonyabb szám = előrébb).
          </p>
        </Field>

        <Checkbox
          label="Aktív (látható a publikus oldalon)"
          checked={state.active}
          onChange={(v) => update("active", v)}
          disabled={pending}
        />
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
          href="/admin/positions"
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
  const titleKey = `title${c}` as keyof FormState;
  const locationKey = `location${c}` as keyof FormState;
  const typeKey = `type${c}` as keyof FormState;

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <Field label="Pozíció megnevezése">
        <input
          type="text"
          value={String(state[titleKey] ?? "")}
          onChange={(e) => update(titleKey, e.target.value as never)}
          maxLength={200}
          required
          disabled={pending}
          style={inputStyle()}
          placeholder="pl. Biztonsági őr"
        />
      </Field>

      <Field label="Helyszín">
        <input
          type="text"
          value={String(state[locationKey] ?? "")}
          onChange={(e) => update(locationKey, e.target.value as never)}
          maxLength={200}
          required
          disabled={pending}
          style={inputStyle()}
          placeholder="pl. Budapest, országos"
        />
      </Field>

      <Field label="Típus">
        <input
          type="text"
          value={String(state[typeKey] ?? "")}
          onChange={(e) => update(typeKey, e.target.value as never)}
          maxLength={200}
          required
          disabled={pending}
          style={inputStyle()}
          placeholder="pl. Teljes munkaidő, Részmunkaidő, Megbízás"
        />
      </Field>
    </div>
  );
}

// ── small reusable bits (matches ServiceForm style) ────────────────────

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
