import type { Locale } from "../i18n";

type Copy = {
  text: string;
  accept: string;
  reject: string;
  title: string;
  settings: string;
};

export const ANALYTICS_COPY: Record<Locale, Copy> = {
  fr: {
    settings: "Paramètres des cookies", title: "Paramètres d’analyse",
    text: "Nous utilisons des cookies d’analyse uniquement avec votre consentement. Ils nous aident à comprendre quelles pages et quels services intéressent les visiteurs. Nous ne transmettons pas aux outils d’analyse de noms, d’adresses e-mail, de numéros de téléphone, de messages ni d’autres contenus de formulaire.",
    accept: "Accepter l’analyse", reject: "Refuser",
  },
  zh: {
    settings: "Cookie 设置", title: "分析设置",
    text: "我们仅在您同意后使用分析 Cookie，以了解访客对哪些页面和服务感兴趣。我们不会向分析工具发送姓名、电子邮箱地址、电话号码、留言或其他表单内容。",
    accept: "同意分析", reject: "拒绝",
  },
  ko: {
    settings: "쿠키 설정", title: "분석 설정",
    text: "분석 쿠키는 동의하신 경우에만 사용합니다. 방문자가 어떤 페이지와 서비스에 관심이 있는지 파악하는 데 도움이 됩니다. 이름, 이메일 주소, 전화번호, 메시지 또는 기타 양식 내용은 분석 도구로 전송하지 않습니다.",
    accept: "분석 동의", reject: "거부",
  },
  hu: {
    settings: "Süti beállítások",
    title: "Analitikai beállítások",
    text: "Analitikai sütiket csak hozzájárulás esetén használunk. Ezek segítenek megérteni, mely oldalaink és szolgáltatásaink érdeklik a látogatókat. Nevet, e-mail-címet, telefonszámot, üzenetet vagy más űrlaptartalmat nem küldünk az analitikába.",
    accept: "Elfogadom az analitikát",
    reject: "Elutasítom",
  },
  en: {
    settings: "Cookie settings",
    title: "Analytics settings",
    text: "We use analytics cookies only with your consent. They help us understand which pages and services visitors use. We do not send names, email addresses, phone numbers, messages or other form content to analytics.",
    accept: "Accept analytics",
    reject: "Reject",
  },
  de: {
    settings: "Cookie-Einstellungen",
    title: "Analyse-Einstellungen",
    text: "Analyse-Cookies verwenden wir nur mit Ihrer Einwilligung. Sie helfen uns zu verstehen, welche Seiten und Dienstleistungen für Besucher interessant sind. Namen, E-Mail-Adressen, Telefonnummern, Nachrichten oder andere Formularinhalte übermitteln wir nicht an die Analyse.",
    accept: "Analyse akzeptieren",
    reject: "Ablehnen",
  },
};

export function getAnalyticsConsentCopy(locale: string): Copy {
  return ANALYTICS_COPY[locale as Locale] ?? ANALYTICS_COPY.en;
}
