type ProcessStep = { title: string; body: string };

// HUA-004, owner approved 2026-10-18. Replace only the known legacy
// promise, preserving later CMS edits without writing to the database.
const COPY: Record<string, { previous: string; approved: string }> = {
  hu: {
    previous: "A helyszíni bejárás és az alapvető kockázati áttekintés jellemzően 1–3 munkanapon belül megszervezhető.",
    approved: "A helyszíni bejárás és az alapvető kockázati áttekintés időpontját az első egyeztetésen közösen rögzítjük.",
  },
  en: {
    previous: "An on-site visit and basic risk overview can typically be organised within 1–3 working days.",
    approved: "We agree the timing of the on-site visit and basic risk overview together during the initial consultation.",
  },
};

export function applyApprovedProcessCopy(
  slug: string,
  locale: string,
  steps: ProcessStep[],
): ProcessStep[] {
  const copy = COPY[locale];
  if (slug !== "objektumorzes" || !copy) return steps;
  return steps.map((step) => step.body === copy.previous
    ? { ...step, body: copy.approved }
    : step);
}
