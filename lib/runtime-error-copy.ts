import { DEFAULT_LOCALE, LOCALES, type Locale } from "./locales";

export function getRecoveryLocale(value: unknown): Locale {
  return typeof value === "string" && LOCALES.includes(value as Locale) ? value as Locale : DEFAULT_LOCALE;
}

const COPY = {
  hu: { title: "Hiba történt", body: "Sajnáljuk, váratlan hiba lépett fel.", retry: "Újrapróbálkozás", home: "Vissza a főoldalra" },
  en: { title: "Something went wrong", body: "We apologise — an unexpected error occurred.", retry: "Try again", home: "Back to home" },
  de: { title: "Ein Fehler ist aufgetreten", body: "Es tut uns leid, ein unerwarteter Fehler ist aufgetreten.", retry: "Erneut versuchen", home: "Zur Startseite" },
  zh: { title: "出现错误", body: "抱歉，发生了意外错误。", retry: "重试", home: "返回首页" },
  ko: { title: "오류가 발생했습니다", body: "죄송합니다. 예기치 않은 오류가 발생했습니다.", retry: "다시 시도", home: "홈으로 돌아가기" },
  fr: { title: "Une erreur est survenue", body: "Nous sommes désolés, une erreur inattendue est survenue.", retry: "Réessayer", home: "Retour à l’accueil" },
} satisfies Record<Locale, { title: string; body: string; retry: string; home: string }>;

export function getRuntimeErrorCopy(locale: string) {
  return COPY[getRecoveryLocale(locale)];
}
