"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { createNews, updateNews, type NewsFormPayload } from "../_actions";
import { slugify } from "@/lib/utils/slugify";
import { DeleteButton } from "./DeleteButton";

// Shared multi-locale form for /admin/news/new and /admin/news/[id]/edit.
// Client component because:
//   - Locale tab state
//   - Live slug auto-fill from titleHu (until user manually edits the slug)
//   - useTransition wraps the server-action call
//
// Per-locale model: each tab has Cím/Összefoglaló/Tartalom + a "Publikálva"
// toggle. HU title is required (DB-side NOT NULL); EN/DE/ZH variants are
// fully optional and collapse to NULL on the server when empty/whitespace.

type Locale = "hu" | "en" | "de" | "zh";
const LOCALES: readonly Locale[] = ["hu", "en", "de", "zh"];
const LOCALE_LABEL: Record<Locale, string> = {
  hu: "🇭🇺 Magyar",
  en: "🇬🇧 English",
  de: "🇩🇪 Deutsch",
  zh: "🇨🇳 中文",
};

type FormState = {
  titleHu: string;
  titleEn: string;
  titleDe: string;
  titleZh: string;
  leadHu: string;
  leadEn: string;
  leadDe: string;
  leadZh: string;
  bodyHu: string;
  bodyEn: string;
  bodyDe: string;
  bodyZh: string;
  slug: string;
  publishedHu: boolean;
  publishedEn: boolean;
  publishedDe: boolean;
  publishedZh: boolean;
  date: string; // datetime-local format: YYYY-MM-DDTHH:mm
};

type EditInitial = FormState & { id: number; imageUrl: string | null };

const EMPTY_STATE: FormState = {
  titleHu: "",
  titleEn: "",
  titleDe: "",
  titleZh: "",
  leadHu: "",
  leadEn: "",
  leadDe: "",
  leadZh: "",
  bodyHu: "",
  bodyEn: "",
  bodyDe: "",
  bodyZh: "",
  slug: "",
  publishedHu: false,
  publishedEn: false,
  publishedDe: false,
  publishedZh: false,
  date: toLocalInput(new Date()),
};

type Props =
  | { mode: "create"; initial?: undefined }
  | { mode: "edit"; initial: EditInitial & { date: string } };

export function NewsForm(props: Props) {
  const initial: FormState =
    props.mode === "edit"
      ? { ...props.initial, date: isoToLocalInput(props.initial.date) }
      : EMPTY_STATE;

  const [state, setState] = useState<FormState>(initial);
  const [activeTab, setActiveTab] = useState<Locale>("hu");
  // Slug touched once the user manually types in the slug field, after which
  // the title→slug auto-fill stops. Edit mode starts touched (preserve
  // the existing slug unless user wipes it).
  const [slugTouched, setSlugTouched] = useState<boolean>(props.mode === "edit");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const id = props.mode === "edit" ? props.initial.id : undefined;

  const tabsStatus = useMemo(() => {
    const fromState = (loc: Locale) => {
      const titleKey = `title${loc.charAt(0).toUpperCase() + loc.slice(1)}` as keyof FormState;
      const pubKey = `published${loc.charAt(0).toUpperCase() + loc.slice(1)}` as keyof FormState;
      const hasTitle = String(state[titleKey] ?? "").trim().length > 0;
      const isPub = state[pubKey] === true;
      if (!hasTitle) return "empty" as const;
      return isPub ? "published" : ("draft" as const);
    };
    return Object.fromEntries(LOCALES.map((l) => [l, fromState(l)])) as Record<
      Locale,
      "empty" | "draft" | "published"
    >;
  }, [state]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setState((prev) => {
      const next = { ...prev, [key]: value };
      // Live slug auto-fill from titleHu if user hasn't manually edited slug
      if (key === "titleHu" && !slugTouched) {
        next.slug = slugify(String(value));
      }
      return next;
    });
  }

  function handleSlugChange(value: string) {
    setSlugTouched(true);
    setState((prev) => ({ ...prev, slug: value }));
  }

  function buildPayload(): NewsFormPayload {
    return {
      titleHu: state.titleHu,
      titleEn: state.titleEn,
      titleDe: state.titleDe,
      titleZh: state.titleZh,
      leadHu: state.leadHu,
      leadEn: state.leadEn,
      leadDe: state.leadDe,
      leadZh: state.leadZh,
      bodyHu: state.bodyHu,
      bodyEn: state.bodyEn,
      bodyDe: state.bodyDe,
      bodyZh: state.bodyZh,
      slug: state.slug,
      publishedHu: state.publishedHu,
      publishedEn: state.publishedEn,
      publishedDe: state.publishedDe,
      publishedZh: state.publishedZh,
      date: localInputToDate(state.date),
    };
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!state.titleHu.trim()) {
      setError("A magyar cím kötelező.");
      setActiveTab("hu");
      return;
    }

    startTransition(async () => {
      try {
        const payload = buildPayload();
        if (props.mode === "create") {
          await createNews(payload);
        } else {
          await updateNews(id!, payload);
        }
      } catch (err) {
        // NEXT_REDIRECT propagates through useTransition; only legit
        // app errors land here.
        if (err instanceof Error && err.message !== "NEXT_REDIRECT") {
          setError(err.message);
        }
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: 24 }}
    >
      {/* Cover image (Iter 3B placeholder) */}
      <section
        style={{
          background: "#fff",
          border: "1px solid #E2E8F0",
          borderRadius: 6,
          padding: "20px 24px",
        }}
      >
        <SectionLabel>Borítókép</SectionLabel>
        {/* TODO: Iter 3B Vercel Blob upload */}
        {props.mode === "edit" && props.initial.imageUrl ? (
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={props.initial.imageUrl}
              alt=""
              style={{
                width: 120,
                height: 80,
                objectFit: "cover",
                borderRadius: 4,
                background: "#F1F5F9",
              }}
            />
            <div style={{ color: "#64748B", fontSize: 13 }}>
              <p style={{ margin: 0 }}>Jelenlegi borítókép</p>
              <p style={{ margin: "4px 0 0", fontSize: 12 }}>
                A feltöltési felület a következő iterációban érkezik.
              </p>
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "16px",
              border: "1px dashed #CBD5E1",
              borderRadius: 4,
              background: "#F8FAFC",
              color: "#94A3B8",
              fontSize: 13,
            }}
          >
            <input type="file" accept="image/*" disabled />
            <span>(A borítókép-feltöltés a következő iterációban érkezik.)</span>
          </div>
        )}
      </section>

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
              status={tabsStatus[loc]}
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
          />
        </div>
      </section>

      {/* Shared fields */}
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
        <Field label="Slug (URL)">
          <input
            type="text"
            value={state.slug}
            onChange={(e) => handleSlugChange(e.target.value)}
            placeholder="auto-generálódik a magyar címből"
            maxLength={120}
            style={inputStyle()}
          />
          <p
            style={{
              margin: "6px 0 0",
              fontSize: 12,
              color: "#94A3B8",
            }}
          >
            Egyediségét a mentéskor ellenőrizzük; ütközés esetén
            -2/-3 utótaggal egészítjük ki.
          </p>
        </Field>

        <Field label="Dátum">
          <input
            type="datetime-local"
            value={state.date}
            onChange={(e) => update("date", e.target.value)}
            style={inputStyle()}
          />
        </Field>
      </section>

      {error && (
        <div
          role="alert"
          style={{
            background: "rgba(209,23,46,0.08)",
            border: "1px solid rgba(209,23,46,0.3)",
            borderRadius: 4,
            padding: "10px 14px",
            fontSize: 13,
            color: "#B91C1C",
          }}
        >
          {error}
        </div>
      )}

      {/* Action bar */}
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {props.mode === "edit" && id !== undefined && (
          <DeleteButton newsId={id} />
        )}
        <div style={{ flex: 1 }} />
        <Link
          href="/admin/news"
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
          {pending ? "Mentés…" : "Mentés"}
        </button>
      </div>
    </form>
  );
}

function LocaleFields({
  locale,
  state,
  update,
}: {
  locale: Locale;
  state: FormState;
  update: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
}) {
  const cap = locale.charAt(0).toUpperCase() + locale.slice(1);
  const titleKey = `title${cap}` as keyof FormState;
  const leadKey = `lead${cap}` as keyof FormState;
  const bodyKey = `body${cap}` as keyof FormState;
  const pubKey = `published${cap}` as keyof FormState;
  const isHu = locale === "hu";

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <Field label={`Cím${isHu ? " (kötelező)" : " (opcionális)"}`}>
        <input
          type="text"
          value={String(state[titleKey] ?? "")}
          onChange={(e) => update(titleKey, e.target.value as never)}
          maxLength={200}
          required={isHu}
          placeholder={isHu ? "" : "Üresen hagyva nincs fordítás ezen a nyelven"}
          style={inputStyle()}
        />
      </Field>

      <Field label="Összefoglaló">
        <textarea
          value={String(state[leadKey] ?? "")}
          onChange={(e) => update(leadKey, e.target.value as never)}
          rows={3}
          maxLength={500}
          placeholder={
            isHu ? "Rövid összefoglaló a hír alatt." : "Opcionális"
          }
          style={{ ...inputStyle(), resize: "vertical", lineHeight: 1.5 }}
        />
      </Field>

      <Field label="Tartalom (Markdown)">
        <textarea
          value={String(state[bodyKey] ?? "")}
          onChange={(e) => update(bodyKey, e.target.value as never)}
          rows={15}
          placeholder={
            isHu
              ? "## Bevezetés\n\nA hír teljes szövege Markdown formátumban."
              : "Opcionális"
          }
          style={{
            ...inputStyle(),
            resize: "vertical",
            fontFamily: "var(--font-geist-mono, monospace)",
            fontSize: 13,
            lineHeight: 1.6,
          }}
        />
        <p style={{ margin: "6px 0 0", fontSize: 12, color: "#94A3B8" }}>
          A Markdown előnézet a következő iterációban érkezik.
        </p>
      </Field>

      <label
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          fontSize: 13,
          color: "#0B1E3E",
          fontWeight: 600,
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        <input
          type="checkbox"
          checked={state[pubKey] === true}
          onChange={(e) => update(pubKey, e.target.checked as never)}
          style={{ width: 16, height: 16 }}
        />
        Publikálva ezen a nyelven
      </label>
    </div>
  );
}

function TabButton({
  active,
  status,
  onClick,
  children,
}: {
  active: boolean;
  status: "empty" | "draft" | "published";
  onClick: () => void;
  children: React.ReactNode;
}) {
  const dot =
    status === "published" ? (
      <span style={{ color: "#15803D" }}>✓</span>
    ) : status === "draft" ? (
      <span style={{ color: "#A16207" }}>●</span>
    ) : (
      <span style={{ color: "#94A3B8" }}>—</span>
    );

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
      {dot}
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

// `<input type="datetime-local">` requires a value in the form
// "YYYY-MM-DDTHH:mm" in the local timezone (no Z, no seconds). These
// helpers round-trip between that string and a Date.
function toLocalInput(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function isoToLocalInput(iso: string): string {
  const d = new Date(iso);
  return Number.isFinite(d.getTime()) ? toLocalInput(d) : toLocalInput(new Date());
}

function localInputToDate(value: string): Date {
  if (!value) return new Date();
  const d = new Date(value);
  return Number.isFinite(d.getTime()) ? d : new Date();
}
