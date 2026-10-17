import type { Locale } from "./locales";

const COPY: Record<Locale, { title: string; body: string; home: string; contact: string; privacy: string }> = {
  hu: { title: "Az oldal nem található", body: "A keresett tartalom nem érhető el.", home: "Vissza a főoldalra", contact: "Kapcsolat", privacy: "Adatkezelési tájékoztató" },
  en: { title: "Page not found", body: "The content you are looking for is not available.", home: "Return to homepage", contact: "Contact us", privacy: "Privacy Policy" },
  de: { title: "Seite nicht gefunden", body: "Der gesuchte Inhalt ist nicht verfügbar.", home: "Zur Startseite", contact: "Kontakt", privacy: "Datenschutzerklärung" },
  zh: { title: "页面未找到", body: "您查找的内容暂不可用。", home: "返回首页", contact: "联系我们", privacy: "隐私政策（英文）" },
  ko: { title: "페이지를 찾을 수 없습니다", body: "요청하신 콘텐츠를 이용할 수 없습니다.", home: "홈으로 돌아가기", contact: "문의", privacy: "개인정보 처리방침 (영문)" },
  fr: { title: "Page introuvable", body: "Le contenu recherché n’est pas disponible.", home: "Retour à l’accueil", contact: "Nous contacter", privacy: "Confidentialité (en anglais)" },
};

export function getNotFoundCopy(locale: string) {
  return COPY[locale as Locale] ?? COPY.hu;
}
