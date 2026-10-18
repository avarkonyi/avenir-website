export const LOCALES = ["hu", "en", "de", "zh", "ko", "fr"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "hu";
