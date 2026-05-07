export const LEAD_STATUS_OPTIONS = [
  {
    value: "new",
    label: "Uj lead",
    shortLabel: "Uj",
    color: "#D1172E",
  },
  {
    value: "contacted",
    label: "Kapcsolat felveve",
    shortLabel: "Felveve",
    color: "#2563EB",
  },
  {
    value: "qualified",
    label: "Minositett",
    shortLabel: "Minositett",
    color: "#7C3AED",
  },
  {
    value: "proposal",
    label: "Ajanlat alatt",
    shortLabel: "Ajanlat",
    color: "#C2410C",
  },
  {
    value: "won",
    label: "Nyert",
    shortLabel: "Nyert",
    color: "#15803D",
  },
  {
    value: "lost",
    label: "Elveszett",
    shortLabel: "Elveszett",
    color: "#64748B",
  },
  {
    value: "parked",
    label: "Parkoltatva",
    shortLabel: "Parkoltatva",
    color: "#A16207",
  },
] as const;

export type LeadStatus = (typeof LEAD_STATUS_OPTIONS)[number]["value"];

const LEAD_STATUS_VALUES = new Set<string>(
  LEAD_STATUS_OPTIONS.map((status) => status.value),
);

export function isLeadStatus(value: string): value is LeadStatus {
  return LEAD_STATUS_VALUES.has(value);
}

export function leadStatusMeta(value: string) {
  return (
    LEAD_STATUS_OPTIONS.find((status) => status.value === value) ??
    LEAD_STATUS_OPTIONS[0]
  );
}
