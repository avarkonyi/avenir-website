import type { Locale } from "./i18n";

const COPY = {
  hu: { breadcrumb: "Navigációs útvonal", skip: "Ugrás a tartalomhoz", menu: "Menü megnyitása vagy bezárása", language: "Nyelvváltás", home: "Avenir főoldal", linkedIn: "Avenir a LinkedInen" },
  en: { breadcrumb: "Breadcrumb", skip: "Skip to content", menu: "Toggle menu", language: "Change language", home: "Avenir home", linkedIn: "Avenir on LinkedIn" },
  de: { breadcrumb: "Brotkrümelnavigation", skip: "Zum Inhalt springen", menu: "Menü öffnen oder schließen", language: "Sprache wechseln", home: "Avenir-Startseite", linkedIn: "Avenir auf LinkedIn" },
  zh: { breadcrumb: "面包屑导航", skip: "跳转到正文", menu: "打开或关闭菜单", language: "切换语言", home: "Avenir 首页", linkedIn: "Avenir 的 LinkedIn 主页" },
  ko: { breadcrumb: "탐색 경로", skip: "본문으로 건너뛰기", menu: "메뉴 열기 또는 닫기", language: "언어 변경", home: "Avenir 홈", linkedIn: "Avenir LinkedIn 페이지" },
  fr: { breadcrumb: "Fil d’Ariane", skip: "Aller au contenu", menu: "Ouvrir ou fermer le menu", language: "Changer de langue", home: "Accueil Avenir", linkedIn: "Avenir sur LinkedIn" },
} as const;

export const LANGUAGE_NAMES: Record<Locale, string> = { hu: "Magyar", en: "English", de: "Deutsch", zh: "中文", ko: "한국어", fr: "Français" };

export function getLocaleAccessibility(locale: string) {
  return COPY[locale as Locale] ?? COPY.hu;
}
