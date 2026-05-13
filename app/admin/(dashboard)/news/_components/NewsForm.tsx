"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { createNews, updateNews, type NewsFormPayload } from "../_actions";
import { slugify } from "@/lib/utils/slugify";
import { ImageUpload } from "@/app/admin/_components/ImageUpload";
import { DeleteButton } from "./DeleteButton";

// Shared multi-locale form for /admin/news/new and /admin/news/[id]/edit.
// Client component because:
//   - Locale tab state
//   - Live slug auto-fill from titleHu (until user manually edits the slug)
//   - useTransition wraps the server-action call
//   - Confirm-on-publish modal state
//
// Per-locale model: each tab has Cím/Összefoglaló/Tartalom + a "Publikálva"
// toggle. HU title is required (DB-side NOT NULL); EN/DE/ZH variants are
// fully optional and collapse to NULL on the server when empty/whitespace.
//
// Server actions return { ok, ... } objects — no NEXT_REDIRECT to handle.
// On success we toast + router.push (create) / router.refresh (update).

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
  imageUrl: string; // empty = no image; ImageUpload converts URL ↔ ""
};

// EditInitial mirrors the DB-shaped data passed from the edit page:
// imageUrl arrives as `string | null` (the column is nullable). The
// form converts to `""` at hydration so FormState's controlled-input
// invariant (string only) holds.
type EditInitial = Omit<FormState, "imageUrl"> & {
  id: number;
  imageUrl: string | null;
};

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
  imageUrl: "",
};

type Props =
  | { mode: "create"; initial?: undefined }
  | { mode: "edit"; initial: EditInitial & { date: string } };

export function NewsForm(props: Props) {
  const router = useRouter();
  const initial: FormState =
    props.mode === "edit"
      ? {
          ...props.initial,
          date: isoToLocalInput(props.initial.date),
          imageUrl: props.initial.imageUrl ?? "",
        }
      : EMPTY_STATE;

  const [state, setState] = useState<FormState>(initial);
  const [activeTab, setActiveTab] = useState<Locale>("hu");
  const [slugTouched, setSlugTouched] = useState<boolean>(props.mode === "edit");
  const [pending, startTransition] = useTransition();
  // Pending publish confirmation. Null when no modal is open. Carries
  // the locale that triggered the toggle so the modal text can reference it.
  const [confirmingLocale, setConfirmingLocale] = useState<Locale | null>(
    null,
  );

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

  // Per-locale publish toggle. Going OFF→ON triggers the confirm modal;
  // going ON→OFF or unchanged is immediate.
  function togglePublished(locale: Locale, next: boolean) {
    const cap = locale.charAt(0).toUpperCase() + locale.slice(1);
    const pubKey = `published${cap}` as keyof FormState;
    const current = state[pubKey] === true;
    if (next && !current) {
      setConfirmingLocale(locale);
      return;
    }
    setState((prev) => ({ ...prev, [pubKey]: next }));
  }

  function confirmPublish() {
    if (!confirmingLocale) return;
    const cap =
      confirmingLocale.charAt(0).toUpperCase() + confirmingLocale.slice(1);
    const pubKey = `published${cap}` as keyof FormState;
    setState((prev) => ({ ...prev, [pubKey]: true }));
    setConfirmingLocale(null);
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
      imageUrl: state.imageUrl,
    };
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!state.titleHu.trim()) {
      toast.error("A magyar cím kötelező.");
      setActiveTab("hu");
      return;
    }

    startTransition(async () => {
      try {
        const payload = buildPayload();
        if (props.mode === "create") {
          const result = await createNews(payload);
          if (result.ok) {
            toast.success(result.message);
            router.push(`/admin/news/${result.id}/edit`);
          } else {
            toast.error(result.error);
          }
        } else {
          const result = await updateNews(id!, payload);
          if (result.ok) {
            toast.success(result.message);
            router.refresh();
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
      {/* Borítókép — Iter 3D Vercel Blob upload */}
      <section
        style={{
          background: "#fff",
          border: "1px solid #E2E8F0",
          borderRadius: 6,
          padding: "20px 24px",
        }}
      >
        <SectionLabel>Borítókép</SectionLabel>
        <ImageUpload
          folder="news"
          value={state.imageUrl.length > 0 ? state.imageUrl : null}
          onChange={(url) => update("imageUrl", url ?? "")}
        />
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
            onTogglePublished={togglePublished}
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
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          {pending ? "Mentés…" : "Mentés"}
        </button>
      </div>

      {confirmingLocale && (
        <PublishConfirmDialog
          locale={confirmingLocale}
          onCancel={() => setConfirmingLocale(null)}
          onConfirm={confirmPublish}
        />
      )}
    </form>
  );
}

function LocaleFields({
  locale,
  state,
  update,
  onTogglePublished,
}: {
  locale: Locale;
  state: FormState;
  update: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
  onTogglePublished: (locale: Locale, next: boolean) => void;
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

      <Field label="Tartalom (sima szöveg)">
        <textarea
          value={String(state[bodyKey] ?? "")}
          onChange={(e) => update(bodyKey, e.target.value as never)}
          rows={15}
          placeholder={
            isHu
              ? "A hír teljes szövege. A bekezdéseket üres sorral válaszd el."
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
          A publikus cikkoldal sima szövegként jeleníti meg a tartalmat.
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
          onChange={(e) => onTogglePublished(locale, e.target.checked)}
          style={{ width: 16, height: 16 }}
        />
        Publikálva ezen a nyelven
      </label>
    </div>
  );
}

function PublishConfirmDialog({
  locale,
  onCancel,
  onConfirm,
}: {
  locale: Locale;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="publish-confirm-title"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(11,30,62,0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
        padding: 16,
      }}
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: 6,
          maxWidth: 460,
          width: "100%",
          padding: "24px 24px 20px",
          boxShadow: "0 24px 48px rgba(11,30,62,0.25)",
        }}
      >
        <h2
          id="publish-confirm-title"
          style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 700,
            color: "#0B1E3E",
          }}
        >
          Biztosan publikálni szeretnéd?
        </h2>
        <p
          style={{
            margin: "12px 0 0",
            fontSize: 14,
            color: "#475569",
            lineHeight: 1.55,
          }}
        >
          A {LOCALE_NAME_HU[locale]} nyelvű tartalom publikálása után a
          publikus oldalon mindenki láthatja. (A publikálás csak
          mentés után válik élővé.)
        </p>
        <div
          style={{
            marginTop: 20,
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
          }}
        >
          <button
            type="button"
            onClick={onCancel}
            style={{
              background: "#fff",
              color: "#0B1E3E",
              border: "1px solid #CBD5E1",
              padding: "10px 18px",
              borderRadius: 4,
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: 0.5,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Mégse
          </button>
          <button
            type="button"
            onClick={onConfirm}
            style={{
              background: "#15803D",
              color: "#fff",
              border: "none",
              padding: "10px 18px",
              borderRadius: 4,
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: 0.5,
              textTransform: "uppercase",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Publikálás
          </button>
        </div>
      </div>
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
        marginBottom: 12,
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
