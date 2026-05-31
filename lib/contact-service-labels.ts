export const CONTACT_SERVICE_LABELS_HU: Record<string, string> = {
  security: "Élőerős objektumőrzés",
  objektumorzes: "Élőerős objektumőrzés",
  cleaning: "Rendezvénybiztosítás",
  rendezvenybiztositas: "Rendezvénybiztosítás",
  building: "Biztonságtechnika",
  biztonsagtechnika: "Biztonságtechnika",
  reception: "Recepciós és portaszolgálat",
  portaszolgalat: "Recepciós és portaszolgálat",
  green: "Soft FM",
  "soft-fm": "Soft FM",
  technical: "Távfelügyelet és vonulószolgálat",
  "tavfelugyelet-vonuloszolgalat": "Távfelügyelet és vonulószolgálat",
  mystery: "Próbavásárlás és szolgáltatásaudit",
  "mystery-shopping-helyszini-audit": "Próbavásárlás és szolgáltatásaudit",
  hardfm: "Hard FM",
  "hard-fm": "Hard FM",
  magannyomozas: "Magánnyomozás",
};

export function getContactServiceLabel(
  service: string | null | undefined,
): string {
  if (!service) return "—";
  return CONTACT_SERVICE_LABELS_HU[service] ?? service;
}
