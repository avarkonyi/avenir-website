import { hu } from "./hu";
import { en } from "./en";
import { de } from "./de";
import { zh } from "./zh";
import { withLegalContent } from "../legal-content";

// Widen literal types from `as const` exports back to their general types,
// recursively, while preserving readonly modifiers. This lets us derive a
// canonical Translation shape from `typeof hu` that en/de/zh can also satisfy
// despite their values being different literal strings.
type Widen<T> = T extends readonly (infer U)[]
  ? readonly Widen<U>[]
  : T extends string
    ? string
    : T extends number
      ? number
      : T extends object
        ? { readonly [K in keyof T]: Widen<T[K]> }
        : T;

export type Translation = Widen<typeof hu>;
export type Locale = "hu" | "en" | "de" | "zh";

// Compile-time assertions that en/de/zh structurally match hu's shape.
// If a key drifts (e.g. de loses footer.impressum), tsc fails here.
const _check_en: Translation = en;
const _check_de: Translation = de;
const _check_zh: Translation = zh;
void _check_en;
void _check_de;
void _check_zh;

export const translations: Record<Locale, Translation> = { hu, en, de, zh };

export function getTranslation(locale: string): Translation {
  if (locale in translations) {
    return withLegalContent(locale, translations[locale as Locale]);
  }
  return withLegalContent(DEFAULT_LOCALE, translations.hu);
}

export const LOCALES: Locale[] = ["hu", "en", "de", "zh"];
export const DEFAULT_LOCALE: Locale = "hu";
