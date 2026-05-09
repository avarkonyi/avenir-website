"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { ICON_NAMES } from "@/components/Icon";
import { Icon } from "@/components/Icon";
import { slugify } from "@/lib/utils/slugify";
import { ImageUpload } from "@/app/admin/_components/ImageUpload";
import {
  createService,
  updateService,
  type ServicePayload,
} from "../_actions";

// Single shared form for /admin/services/new and /admin/services/[id]/edit.
// Mirrors NewsForm conventions:
//   - Controlled inputs via React state
//   - useTransition wraps the server-action call
//   - Server actions return { ok, ... } objects (no redirects)
//   - sonner toasts on success/error; router.push to the destination
//     advertised in the action's `redirect` field
//   - Locale fields rendered as 4 tabs (HU/EN/DE/ZH); HU is required
//     and the default active tab. Empty EN/DE/ZH inputs collapse to
//     NULL on the server.

type Locale = "hu" | "en" | "de" | "zh";
const LOCALES: readonly Locale[] = ["hu", "en", "de", "zh"];
const LOCALE_LABEL: Record<Locale, string> = {
  hu: "🇭🇺 Magyar",
  en: "🇬🇧 English",
  de: "🇩🇪 Deutsch",
  zh: "🇨🇳 中文",
};

type FormState = {
  parentId: string; // "" = top-level; else the parent service id as string
  slug: string;
  icon: string;
  imageUrl: string;

  nameHu: string;
  nameEn: string;
  nameDe: string;
  nameZh: string;

  shortDescHu: string;
  shortDescEn: string;
  shortDescDe: string;
  shortDescZh: string;

  longDescHu: string;
  longDescEn: string;
  longDescDe: string;
  longDescZh: string;

  highlightsHuRaw: string;
  highlightsEnRaw: string;
  highlightsDeRaw: string;
  highlightsZhRaw: string;

  // Service-detail-page fields (P5 Phase 1)
  seoTitleHu: string;
  seoTitleEn: string;
  seoTitleDe: string;
  seoTitleZh: string;

  seoDescriptionHu: string;
  seoDescriptionEn: string;
  seoDescriptionDe: string;
  seoDescriptionZh: string;

  valuePropositionHu: string;
  valuePropositionEn: string;
  valuePropositionDe: string;
  valuePropositionZh: string;

  useCasesHuRaw: string;
  useCasesEnRaw: string;
  useCasesDeRaw: string;
  useCasesZhRaw: string;

  includedItemsHuRaw: string;
  includedItemsEnRaw: string;
  includedItemsDeRaw: string;
  includedItemsZhRaw: string;

  processStepsHuRaw: string;
  processStepsEnRaw: string;
  processStepsDeRaw: string;
  processStepsZhRaw: string;

  trustItemsHuRaw: string;
  trustItemsEnRaw: string;
  trustItemsDeRaw: string;
  trustItemsZhRaw: string;

  faqHuRaw: string;
  faqEnRaw: string;
  faqDeRaw: string;
  faqZhRaw: string;

  relatedServiceSlugsRaw: string;

  sortOrder: string; // input type=number value comes through as string
  isFeatured: boolean;
  isPublished: boolean;
  isActive: boolean;
};

const EMPTY_STATE: FormState = {
  parentId: "",
  slug: "",
  icon: "",
  imageUrl: "",

  nameHu: "",
  nameEn: "",
  nameDe: "",
  nameZh: "",

  shortDescHu: "",
  shortDescEn: "",
  shortDescDe: "",
  shortDescZh: "",

  longDescHu: "",
  longDescEn: "",
  longDescDe: "",
  longDescZh: "",

  highlightsHuRaw: "",
  highlightsEnRaw: "",
  highlightsDeRaw: "",
  highlightsZhRaw: "",

  seoTitleHu: "",
  seoTitleEn: "",
  seoTitleDe: "",
  seoTitleZh: "",

  seoDescriptionHu: "",
  seoDescriptionEn: "",
  seoDescriptionDe: "",
  seoDescriptionZh: "",

  valuePropositionHu: "",
  valuePropositionEn: "",
  valuePropositionDe: "",
  valuePropositionZh: "",

  useCasesHuRaw: "",
  useCasesEnRaw: "",
  useCasesDeRaw: "",
  useCasesZhRaw: "",

  includedItemsHuRaw: "",
  includedItemsEnRaw: "",
  includedItemsDeRaw: "",
  includedItemsZhRaw: "",

  processStepsHuRaw: "",
  processStepsEnRaw: "",
  processStepsDeRaw: "",
  processStepsZhRaw: "",

  trustItemsHuRaw: "",
  trustItemsEnRaw: "",
  trustItemsDeRaw: "",
  trustItemsZhRaw: "",

  faqHuRaw: "",
  faqEnRaw: "",
  faqDeRaw: "",
  faqZhRaw: "",

  relatedServiceSlugsRaw: "",

  sortOrder: "0",
  isFeatured: false,
  isPublished: false,
  isActive: true,
};

export type ServiceInitial = {
  id: number;
  parentId: number | null;
  slug: string;
  icon: string | null;
  imageUrl: string | null;

  nameHu: string;
  nameEn: string | null;
  nameDe: string | null;
  nameZh: string | null;

  shortDescHu: string | null;
  shortDescEn: string | null;
  shortDescDe: string | null;
  shortDescZh: string | null;

  longDescHu: string | null;
  longDescEn: string | null;
  longDescDe: string | null;
  longDescZh: string | null;

  highlightsHu: string[];
  highlightsEn: string[];
  highlightsDe: string[];
  highlightsZh: string[];

  // Service-detail-page fields (P5 Phase 1)
  seoTitleHu: string | null;
  seoTitleEn: string | null;
  seoTitleDe: string | null;
  seoTitleZh: string | null;

  seoDescriptionHu: string | null;
  seoDescriptionEn: string | null;
  seoDescriptionDe: string | null;
  seoDescriptionZh: string | null;

  valuePropositionHu: string | null;
  valuePropositionEn: string | null;
  valuePropositionDe: string | null;
  valuePropositionZh: string | null;

  useCasesHu: string[];
  useCasesEn: string[];
  useCasesDe: string[];
  useCasesZh: string[];

  includedItemsHu: string[];
  includedItemsEn: string[];
  includedItemsDe: string[];
  includedItemsZh: string[];

  processStepsHu: { title: string; body: string }[];
  processStepsEn: { title: string; body: string }[];
  processStepsDe: { title: string; body: string }[];
  processStepsZh: { title: string; body: string }[];

  trustItemsHu: { title: string; body: string }[];
  trustItemsEn: { title: string; body: string }[];
  trustItemsDe: { title: string; body: string }[];
  trustItemsZh: { title: string; body: string }[];

  faqHu: { q: string; a: string }[];
  faqEn: { q: string; a: string }[];
  faqDe: { q: string; a: string }[];
  faqZh: { q: string; a: string }[];

  relatedServiceSlugs: string[];

  sortOrder: number;
  isFeatured: boolean;
  isPublished: boolean;
  isActive: boolean;
};

export type ParentOption = { id: number; nameHu: string };

type Props =
  | {
      mode: "create";
      parentOptions: ParentOption[];
      isParentDisabled?: false;
      initial?: undefined;
    }
  | {
      mode: "edit";
      initial: ServiceInitial;
      parentOptions: ParentOption[];
      isParentDisabled: boolean;
    };

// Compound items round-trip via "Title || Body" per line so the
// admin can edit them in a plain textarea. Empty bodies serialize to
// "Title" only (no trailing "||"), matching how the server-side
// normalizer accepts title-only lines.
function joinCompound(items: { title: string; body: string }[]): string {
  return items
    .map(({ title, body }) =>
      body.trim().length > 0 ? `${title} || ${body}` : title,
    )
    .join("\n");
}

function joinFaq(items: { q: string; a: string }[]): string {
  return items
    .map(({ q, a }) => (a.trim().length > 0 ? `${q} || ${a}` : q))
    .join("\n");
}

function initialFromService(s: ServiceInitial): FormState {
  return {
    parentId: s.parentId === null ? "" : String(s.parentId),
    slug: s.slug,
    icon: s.icon ?? "",
    imageUrl: s.imageUrl ?? "",

    nameHu: s.nameHu,
    nameEn: s.nameEn ?? "",
    nameDe: s.nameDe ?? "",
    nameZh: s.nameZh ?? "",

    shortDescHu: s.shortDescHu ?? "",
    shortDescEn: s.shortDescEn ?? "",
    shortDescDe: s.shortDescDe ?? "",
    shortDescZh: s.shortDescZh ?? "",

    longDescHu: s.longDescHu ?? "",
    longDescEn: s.longDescEn ?? "",
    longDescDe: s.longDescDe ?? "",
    longDescZh: s.longDescZh ?? "",

    highlightsHuRaw: s.highlightsHu.join("\n"),
    highlightsEnRaw: s.highlightsEn.join("\n"),
    highlightsDeRaw: s.highlightsDe.join("\n"),
    highlightsZhRaw: s.highlightsZh.join("\n"),

    seoTitleHu: s.seoTitleHu ?? "",
    seoTitleEn: s.seoTitleEn ?? "",
    seoTitleDe: s.seoTitleDe ?? "",
    seoTitleZh: s.seoTitleZh ?? "",

    seoDescriptionHu: s.seoDescriptionHu ?? "",
    seoDescriptionEn: s.seoDescriptionEn ?? "",
    seoDescriptionDe: s.seoDescriptionDe ?? "",
    seoDescriptionZh: s.seoDescriptionZh ?? "",

    valuePropositionHu: s.valuePropositionHu ?? "",
    valuePropositionEn: s.valuePropositionEn ?? "",
    valuePropositionDe: s.valuePropositionDe ?? "",
    valuePropositionZh: s.valuePropositionZh ?? "",

    useCasesHuRaw: s.useCasesHu.join("\n"),
    useCasesEnRaw: s.useCasesEn.join("\n"),
    useCasesDeRaw: s.useCasesDe.join("\n"),
    useCasesZhRaw: s.useCasesZh.join("\n"),

    includedItemsHuRaw: s.includedItemsHu.join("\n"),
    includedItemsEnRaw: s.includedItemsEn.join("\n"),
    includedItemsDeRaw: s.includedItemsDe.join("\n"),
    includedItemsZhRaw: s.includedItemsZh.join("\n"),

    processStepsHuRaw: joinCompound(s.processStepsHu),
    processStepsEnRaw: joinCompound(s.processStepsEn),
    processStepsDeRaw: joinCompound(s.processStepsDe),
    processStepsZhRaw: joinCompound(s.processStepsZh),

    trustItemsHuRaw: joinCompound(s.trustItemsHu),
    trustItemsEnRaw: joinCompound(s.trustItemsEn),
    trustItemsDeRaw: joinCompound(s.trustItemsDe),
    trustItemsZhRaw: joinCompound(s.trustItemsZh),

    faqHuRaw: joinFaq(s.faqHu),
    faqEnRaw: joinFaq(s.faqEn),
    faqDeRaw: joinFaq(s.faqDe),
    faqZhRaw: joinFaq(s.faqZh),

    relatedServiceSlugsRaw: s.relatedServiceSlugs.join("\n"),

    sortOrder: String(s.sortOrder),
    isFeatured: s.isFeatured,
    isPublished: s.isPublished,
    isActive: s.isActive,
  };
}

export function ServiceForm(props: Props) {
  const router = useRouter();
  const [state, setState] = useState<FormState>(
    props.mode === "edit" ? initialFromService(props.initial) : EMPTY_STATE,
  );
  const [activeTab, setActiveTab] = useState<Locale>("hu");
  // Slug touched once the admin manually types in the slug field, after
  // which the title→slug auto-fill stops. Edit mode starts touched
  // (preserve the existing slug unless the admin wipes it).
  const [slugTouched, setSlugTouched] = useState<boolean>(
    props.mode === "edit",
  );
  const [pending, startTransition] = useTransition();

  const id = props.mode === "edit" ? props.initial.id : undefined;
  const isParentDisabled =
    props.mode === "edit" ? props.isParentDisabled : false;

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setState((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "nameHu" && !slugTouched) {
        next.slug = slugify(String(value));
      }
      return next;
    });
  }

  function handleSlugChange(value: string) {
    setSlugTouched(true);
    setState((prev) => ({ ...prev, slug: value }));
  }

  function buildPayload(): ServicePayload {
    const parsedParentId = state.parentId.trim();
    const parentId = parsedParentId === "" ? null : Number(parsedParentId);
    const parsedSortOrder = Number.parseInt(state.sortOrder, 10);

    return {
      parentId: Number.isFinite(parentId) ? parentId : null,
      slug: state.slug,
      icon: state.icon,
      imageUrl: state.imageUrl,

      nameHu: state.nameHu,
      nameEn: state.nameEn,
      nameDe: state.nameDe,
      nameZh: state.nameZh,

      shortDescHu: state.shortDescHu,
      shortDescEn: state.shortDescEn,
      shortDescDe: state.shortDescDe,
      shortDescZh: state.shortDescZh,

      longDescHu: state.longDescHu,
      longDescEn: state.longDescEn,
      longDescDe: state.longDescDe,
      longDescZh: state.longDescZh,

      highlightsHuRaw: state.highlightsHuRaw,
      highlightsEnRaw: state.highlightsEnRaw,
      highlightsDeRaw: state.highlightsDeRaw,
      highlightsZhRaw: state.highlightsZhRaw,

      seoTitleHu: state.seoTitleHu,
      seoTitleEn: state.seoTitleEn,
      seoTitleDe: state.seoTitleDe,
      seoTitleZh: state.seoTitleZh,

      seoDescriptionHu: state.seoDescriptionHu,
      seoDescriptionEn: state.seoDescriptionEn,
      seoDescriptionDe: state.seoDescriptionDe,
      seoDescriptionZh: state.seoDescriptionZh,

      valuePropositionHu: state.valuePropositionHu,
      valuePropositionEn: state.valuePropositionEn,
      valuePropositionDe: state.valuePropositionDe,
      valuePropositionZh: state.valuePropositionZh,

      useCasesHuRaw: state.useCasesHuRaw,
      useCasesEnRaw: state.useCasesEnRaw,
      useCasesDeRaw: state.useCasesDeRaw,
      useCasesZhRaw: state.useCasesZhRaw,

      includedItemsHuRaw: state.includedItemsHuRaw,
      includedItemsEnRaw: state.includedItemsEnRaw,
      includedItemsDeRaw: state.includedItemsDeRaw,
      includedItemsZhRaw: state.includedItemsZhRaw,

      processStepsHuRaw: state.processStepsHuRaw,
      processStepsEnRaw: state.processStepsEnRaw,
      processStepsDeRaw: state.processStepsDeRaw,
      processStepsZhRaw: state.processStepsZhRaw,

      trustItemsHuRaw: state.trustItemsHuRaw,
      trustItemsEnRaw: state.trustItemsEnRaw,
      trustItemsDeRaw: state.trustItemsDeRaw,
      trustItemsZhRaw: state.trustItemsZhRaw,

      faqHuRaw: state.faqHuRaw,
      faqEnRaw: state.faqEnRaw,
      faqDeRaw: state.faqDeRaw,
      faqZhRaw: state.faqZhRaw,

      relatedServiceSlugsRaw: state.relatedServiceSlugsRaw,

      sortOrder: Number.isFinite(parsedSortOrder) ? parsedSortOrder : 0,
      isFeatured: state.isFeatured,
      isPublished: state.isPublished,
      isActive: state.isActive,
    };
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!state.nameHu.trim()) {
      toast.error("A magyar név kötelező.");
      setActiveTab("hu");
      return;
    }

    startTransition(async () => {
      try {
        const payload = buildPayload();
        if (props.mode === "create") {
          const result = await createService(payload);
          if (result.ok) {
            toast.success(result.message);
            router.push(result.redirect);
          } else {
            toast.error(result.error);
          }
        } else {
          const result = await updateService(id!, payload);
          if (result.ok) {
            toast.success(result.message);
            router.push(result.redirect);
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
      {/* Alapok card */}
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
        <SectionLabel>Alap adatok</SectionLabel>

        <Field label="Szülő szolgáltatás">
          {/* When the select is disabled, browsers omit it from
              FormData; with controlled state we send the value through
              `state.parentId` regardless, but a hidden field also
              guards future refactors and matches the spec's intent. */}
          {isParentDisabled && (
            <input type="hidden" name="parentId" value={state.parentId} />
          )}
          <select
            value={state.parentId}
            onChange={(e) => update("parentId", e.target.value)}
            disabled={isParentDisabled || pending}
            style={inputStyle()}
          >
            <option value="">— (Főszolgáltatás)</option>
            {props.parentOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.nameHu}
              </option>
            ))}
          </select>
          {isParentDisabled && (
            <p style={helpTextStyle}>
              A szülő nem módosítható, mert ennek a szolgáltatásnak
              vannak al-szolgáltatásai.
            </p>
          )}
          {!isParentDisabled && (
            <p style={helpTextStyle}>
              Üresen hagyva főszolgáltatást hozol létre. Csak
              főszolgáltatás alá hozhatsz létre al-szolgáltatást
              (2 szint maximum).
            </p>
          )}
        </Field>

        <Field label="Slug (URL)">
          <input
            type="text"
            value={state.slug}
            onChange={(e) => handleSlugChange(e.target.value)}
            placeholder="auto-generálódik a magyar névből"
            maxLength={120}
            style={inputStyle()}
            disabled={pending}
          />
          <p style={helpTextStyle}>
            A &quot;Hard FM&quot; bemenet automatikusan
            &quot;hard-fm&quot;-re alakul. Egyediségét a mentéskor
            ellenőrizzük.
          </p>
        </Field>

        <Field label="Ikon">
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <select
              value={state.icon}
              onChange={(e) => update("icon", e.target.value)}
              disabled={pending}
              style={{ ...inputStyle(), flex: 1 }}
            >
              <option value="">— Nincs ikon —</option>
              {ICON_NAMES.map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
            <div
              style={{
                width: 44,
                height: 44,
                border: "1px solid #E2E8F0",
                borderRadius: 4,
                background: "#F8FAFC",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#0B1E3E",
                flexShrink: 0,
              }}
              aria-hidden
            >
              {state.icon ? (
                <Icon name={state.icon} size={24} />
              ) : (
                <span style={{ color: "#CBD5E1", fontSize: 18 }}>—</span>
              )}
            </div>
          </div>
        </Field>

        <Field label="Borítókép">
          <ImageUpload
            folder="services"
            value={state.imageUrl.length > 0 ? state.imageUrl : null}
            onChange={(url) => update("imageUrl", url ?? "")}
          />
        </Field>

        <Field label="Sortrend">
          <input
            type="number"
            min={0}
            value={state.sortOrder}
            onChange={(e) => update("sortOrder", e.target.value)}
            disabled={pending}
            style={{ ...inputStyle(), width: 120 }}
          />
          <p style={helpTextStyle}>
            Sorrend a listában (alacsonyabb szám = előrébb).
          </p>
        </Field>

        <div
          style={{
            display: "flex",
            gap: 24,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <Checkbox
            label="Kiemelt"
            checked={state.isFeatured}
            onChange={(v) => update("isFeatured", v)}
            disabled={pending}
          />
          <Checkbox
            label="Publikálva"
            checked={state.isPublished}
            onChange={(v) => update("isPublished", v)}
            disabled={pending}
          />
          <Checkbox
            label="Aktív"
            checked={state.isActive}
            onChange={(v) => update("isActive", v)}
            disabled={pending}
          />
        </div>
      </section>

      {/* Locale tabs card */}
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
              hasContent={String(state[`name${cap(loc)}` as keyof FormState] ?? "").trim().length > 0}
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

      {/* Aloldal — locale-independent fields (P5 Phase 1) */}
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
        <SectionLabel>Aloldal — kapcsolódó szolgáltatások</SectionLabel>
        <Field label="Kapcsolódó szolgáltatások (slugok, soronként vagy vesszővel)">
          <textarea
            value={state.relatedServiceSlugsRaw}
            onChange={(e) => update("relatedServiceSlugsRaw", e.target.value)}
            rows={3}
            placeholder={"portaszolgalat\nmystery"}
            style={{ ...inputStyle(), resize: "vertical", lineHeight: 1.55 }}
            disabled={pending}
          />
          <p style={helpTextStyle}>
            A nem létező vagy nem-publikált slugok automatikusan kimaradnak
            a publikus oldalon. A slugok közösek minden nyelvre.
          </p>
        </Field>
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
          href="/admin/services"
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

// ── locale fields ──────────────────────────────────────────────────────

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
  const nameKey = `name${c}` as keyof FormState;
  const shortKey = `shortDesc${c}` as keyof FormState;
  const longKey = `longDesc${c}` as keyof FormState;
  const highlightsKey = `highlights${c}Raw` as keyof FormState;
  const seoTitleKey = `seoTitle${c}` as keyof FormState;
  const seoDescriptionKey = `seoDescription${c}` as keyof FormState;
  const valuePropKey = `valueProposition${c}` as keyof FormState;
  const useCasesKey = `useCases${c}Raw` as keyof FormState;
  const includedKey = `includedItems${c}Raw` as keyof FormState;
  const processKey = `processSteps${c}Raw` as keyof FormState;
  const trustKey = `trustItems${c}Raw` as keyof FormState;
  const faqKey = `faq${c}Raw` as keyof FormState;
  const isHu = locale === "hu";
  const compoundHelp =
    "Soronként egy elem. Cím és törzs a „||” elválasztóval: " +
    "Cím || Részletes leírás. Törzs nélkül csak a címet írd.";
  const faqHelp =
    "Soronként egy kérdés-válasz pár, „||” elválasztóval: " +
    "Kérdés || Válasz.";

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <Field label={`Név${isHu ? " (kötelező)" : " (opcionális)"}`}>
        <input
          type="text"
          value={String(state[nameKey] ?? "")}
          onChange={(e) => update(nameKey, e.target.value as never)}
          maxLength={200}
          required={isHu}
          placeholder={
            isHu ? "" : "Üresen hagyva nincs fordítás ezen a nyelven"
          }
          style={inputStyle()}
          disabled={pending}
        />
      </Field>

      <Field label="Rövid leírás (1–2 mondat)">
        <textarea
          value={String(state[shortKey] ?? "")}
          onChange={(e) => update(shortKey, e.target.value as never)}
          rows={3}
          maxLength={400}
          placeholder={
            isHu ? "Rövid összefoglaló a kártyán." : "Opcionális"
          }
          style={{ ...inputStyle(), resize: "vertical", lineHeight: 1.5 }}
          disabled={pending}
        />
      </Field>

      <Field label={`Hosszú leírás${isHu ? " (kötelező a publikáláshoz)" : ""}`}>
        <textarea
          value={String(state[longKey] ?? "")}
          onChange={(e) => update(longKey, e.target.value as never)}
          rows={10}
          placeholder={
            isHu
              ? "Részletes szolgáltatás-leírás. Egyszerű szöveg vagy Markdown."
              : "Opcionális"
          }
          style={{
            ...inputStyle(),
            resize: "vertical",
            fontFamily: "var(--font-geist-mono, monospace)",
            fontSize: 13,
            lineHeight: 1.6,
          }}
          disabled={pending}
        />
        <p style={helpTextStyle}>
          A Markdown előnézet egy következő iterációban érkezik.
        </p>
      </Field>

      <Field label="Kiemelések (max 6 sor, soronként max 160 karakter)">
        <textarea
          value={String(state[highlightsKey] ?? "")}
          onChange={(e) => update(highlightsKey, e.target.value as never)}
          rows={6}
          placeholder={
            isHu
              ? "Egy kiemelés soronként.\nPélda:\n24/7 ügyelet\nISO 9001 certifikált"
              : "Opcionális — egy kiemelés soronként"
          }
          style={{ ...inputStyle(), resize: "vertical", lineHeight: 1.55 }}
          disabled={pending}
        />
      </Field>

      <SubSectionLabel>Aloldal — SEO</SubSectionLabel>

      <Field label={`SEO cím${isHu ? " (kötelező a publikáláshoz)" : ""}`}>
        <input
          type="text"
          value={String(state[seoTitleKey] ?? "")}
          onChange={(e) => update(seoTitleKey, e.target.value as never)}
          maxLength={120}
          placeholder={
            isHu
              ? "Meta <title> — pl. „Élőerős objektumőrzés | Avenir”"
              : "Opcionális"
          }
          style={inputStyle()}
          disabled={pending}
        />
      </Field>

      <Field label={`SEO leírás${isHu ? " (kötelező a publikáláshoz)" : ""}`}>
        <textarea
          value={String(state[seoDescriptionKey] ?? "")}
          onChange={(e) => update(seoDescriptionKey, e.target.value as never)}
          rows={3}
          maxLength={300}
          placeholder={
            isHu
              ? "Meta description — 150–160 karakter ideális."
              : "Opcionális"
          }
          style={{ ...inputStyle(), resize: "vertical", lineHeight: 1.5 }}
          disabled={pending}
        />
      </Field>

      <SubSectionLabel>Aloldal — tartalom</SubSectionLabel>

      <Field
        label={`Értékajánlat (hero alá)${isHu ? " (kötelező a publikáláshoz)" : ""}`}
      >
        <textarea
          value={String(state[valuePropKey] ?? "")}
          onChange={(e) => update(valuePropKey, e.target.value as never)}
          rows={3}
          maxLength={400}
          placeholder={
            isHu
              ? "1–2 mondat arról, mit nyer az ügyfél."
              : "Opcionális"
          }
          style={{ ...inputStyle(), resize: "vertical", lineHeight: 1.55 }}
          disabled={pending}
        />
      </Field>

      <Field label="Kinek jó (use cases) — egy sor egy elem">
        <textarea
          value={String(state[useCasesKey] ?? "")}
          onChange={(e) => update(useCasesKey, e.target.value as never)}
          rows={5}
          placeholder={
            isHu
              ? "Logisztikai központok\nIrodaházak\nIpari parkok"
              : "Opcionális"
          }
          style={{ ...inputStyle(), resize: "vertical", lineHeight: 1.55 }}
          disabled={pending}
        />
      </Field>

      <Field label="Mit tartalmaz — egy sor egy elem">
        <textarea
          value={String(state[includedKey] ?? "")}
          onChange={(e) => update(includedKey, e.target.value as never)}
          rows={5}
          placeholder={
            isHu
              ? "Képzett vagyonőrök\nDokumentált szolgálati napló\nNapi/heti riport"
              : "Opcionális"
          }
          style={{ ...inputStyle(), resize: "vertical", lineHeight: 1.55 }}
          disabled={pending}
        />
      </Field>

      <Field label="Hogyan indul az együttműködés (cím || leírás soronként)">
        <textarea
          value={String(state[processKey] ?? "")}
          onChange={(e) => update(processKey, e.target.value as never)}
          rows={6}
          placeholder={
            isHu
              ? "Felmérés || Helyszíni bejárás és kockázatelemzés.\nAjánlat || Testre szabott szolgáltatási csomag és árazás.\nIndulás || Csapat-felállás és protokollok bevezetése."
              : "Opcionális"
          }
          style={{ ...inputStyle(), resize: "vertical", lineHeight: 1.55 }}
          disabled={pending}
        />
        <p style={helpTextStyle}>{compoundHelp}</p>
      </Field>

      <Field label="Bizalmi elemek (cím || leírás soronként)">
        <textarea
          value={String(state[trustKey] ?? "")}
          onChange={(e) => update(trustKey, e.target.value as never)}
          rows={4}
          placeholder={
            isHu
              ? "ISO 9001 + ISO 27001 || Tanúsított minőségirányítás és információbiztonság.\nMűködési megbízhatóság || 30+ aktív helyszín, 24/7 diszpécseri háttér.\nEgy felelős kapcsolattartó || Egyszerű döntéshozatal, gyors reagálás."
              : "Opcionális"
          }
          style={{ ...inputStyle(), resize: "vertical", lineHeight: 1.55 }}
          disabled={pending}
        />
        <p style={helpTextStyle}>{compoundHelp}</p>
      </Field>

      <Field label="GYIK / FAQ (kérdés || válasz soronként)">
        <textarea
          value={String(state[faqKey] ?? "")}
          onChange={(e) => update(faqKey, e.target.value as never)}
          rows={6}
          placeholder={
            isHu
              ? "Hogyan kérhetek ajánlatot? || Telefonon, e-mailben vagy az űrlapon. 2 munkanapon belül visszajelzünk.\nMilyen rendszerességgel kapok riportot? || Heti írásos riport és havi áttekintés."
              : "Opcionális"
          }
          style={{ ...inputStyle(), resize: "vertical", lineHeight: 1.55 }}
          disabled={pending}
        />
        <p style={helpTextStyle}>{faqHelp}</p>
      </Field>
    </div>
  );
}

// ── small reusable bits ────────────────────────────────────────────────

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

function SubSectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3
      style={{
        margin: "8px 0 -4px",
        fontSize: 11,
        letterSpacing: 1,
        textTransform: "uppercase",
        fontWeight: 700,
        color: "#94A3B8",
        borderTop: "1px solid #F1F5F9",
        paddingTop: 14,
      }}
    >
      {children}
    </h3>
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
