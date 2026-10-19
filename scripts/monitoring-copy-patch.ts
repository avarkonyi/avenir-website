// Pure plan for the owner-approved monitoring copy alignment (2026-10-19).
// No environment loading or database imports: this module is safe to unit-test.
export const MONITORING_SERVICE_ID = 6;
export const MONITORING_SERVICE_SLUG = "tavfelugyelet-vonuloszolgalat";

type TextField = "valuePropositionHu" | "valuePropositionEn" | "longDescHu" | "longDescEn";
type FaqField = "faqHu" | "faqEn";
type FaqItem = { q: string; a: string };

export type MonitoringCopyValues = Record<TextField, string> & Record<FaqField, FaqItem[]>;
export type MonitoringCopyRow = MonitoringCopyValues & { id: number; slug: string };
export type MonitoringCopyFragment = {
  path: string;
  before: string;
  after: string;
  state: "replace" | "already-applied";
};
export type MonitoringCopyPatchPlan = {
  status: "apply" | "already-applied";
  before: MonitoringCopyRow;
  values: Partial<MonitoringCopyValues>;
  fragments: MonitoringCopyFragment[];
};

export class MonitoringCopyPatchError extends Error {}

type Replacement = {
  before: string;
  after: string;
} & ({ field: TextField } | { field: FaqField; index: 3 | 8; question: string });

const REPLACEMENTS: readonly Replacement[] = [
  {
    field: "valuePropositionHu",
    before: "Az Avenir 24/7 diszpécseri háttérrel kezeli a csatlakoztatott helyszínekről érkező riasztási, behatolásjelzési és kamerajelzéseket",
    after: "Az Avenir saját felügyeleti központja 24/7 fogadja és kezeli a csatlakoztatott helyszínekről érkező riasztási, behatolásjelzési és kamerajelzéseket",
  },
  {
    field: "valuePropositionEn",
    before: "Avenir operates 24/7 monitoring of intrusion, alarm and CCTV signals from connected sites",
    after: "Avenir’s own monitoring centre receives and handles intrusion, alarm and CCTV signals from connected sites 24/7",
  },
  {
    field: "longDescHu",
    before: "A téves jelzések naplózhatók és elemezhetők",
    after: "A téves jelzéseket naplózzuk, és azok elemezhetők",
  },
  {
    field: "longDescEn",
    before: "False alarms are logged and analysed",
    after: "False alarms are logged and can be analysed",
  },
  {
    field: "faqHu",
    index: 3,
    question: "Hogyan történik a riasztás ellenőrzése az eszkaláció előtt?",
    before: "A téves jelzések naplózhatók és visszanézhetők",
    after: "A téves jelzéseket naplózzuk, és azok visszanézhetők",
  },
  {
    field: "faqEn",
    index: 3,
    question: "How is an alarm verified before escalation?",
    before: "False alarms are logged and reviewed",
    after: "False alarms are logged and can be reviewed",
  },
  {
    field: "faqHu",
    index: 8,
    question: "Hogyan dokumentálhatók a riasztási jelzések és események?",
    before: "A jelzések időbélyegzett eseménynaplóban rögzíthetők:",
    after: "A jelzéseket időbélyegzett eseménynaplóban rögzítjük:",
  },
  {
    field: "faqEn",
    index: 8,
    question: "How can alarm signals and events be documented?",
    before: "Signals can be recorded in a timestamped operations log:",
    after: "Signals are recorded in a timestamped operations log:",
  },
];

function requireText(value: unknown, field: TextField): string {
  if (typeof value !== "string") {
    throw new MonitoringCopyPatchError(`${field}: expected a string.`);
  }
  return value;
}

function requireFaq(value: unknown, field: FaqField): FaqItem[] {
  if (!Array.isArray(value) || value.some((item) =>
    !item || typeof item !== "object" || typeof item.q !== "string" || typeof item.a !== "string"
  )) {
    throw new MonitoringCopyPatchError(`${field}: expected an array of question/answer strings.`);
  }
  // Preserve every JSON property, including properties not used by this patch.
  return structuredClone(value) as FaqItem[];
}

function readRow(row: unknown): MonitoringCopyRow {
  if (!row || typeof row !== "object" || Array.isArray(row)) {
    throw new MonitoringCopyPatchError("Expected one service row.");
  }
  const record = row as Record<string, unknown>;
  if (record.id !== MONITORING_SERVICE_ID || record.slug !== MONITORING_SERVICE_SLUG) {
    throw new MonitoringCopyPatchError("Unexpected target identity; expected the canonical monitoring service id and slug.");
  }
  return {
    id: MONITORING_SERVICE_ID,
    slug: MONITORING_SERVICE_SLUG,
    valuePropositionHu: requireText(record.valuePropositionHu, "valuePropositionHu"),
    valuePropositionEn: requireText(record.valuePropositionEn, "valuePropositionEn"),
    longDescHu: requireText(record.longDescHu, "longDescHu"),
    longDescEn: requireText(record.longDescEn, "longDescEn"),
    faqHu: requireFaq(record.faqHu, "faqHu"),
    faqEn: requireFaq(record.faqEn, "faqEn"),
  };
}

function planFragment(text: string, rule: Replacement, path: string): MonitoringCopyFragment {
  const oldCount = text.split(rule.before).length - 1;
  const newCount = text.split(rule.after).length - 1;
  if (oldCount === 1 && newCount === 0) {
    return { path, before: rule.before, after: rule.after, state: "replace" };
  }
  if (oldCount === 0 && newCount === 1) {
    return { path, before: rule.before, after: rule.after, state: "already-applied" };
  }
  throw new MonitoringCopyPatchError(`${path}: expected exactly one old fragment or one already-applied fragment.`);
}

export function planMonitoringCopyPatch(row: unknown): MonitoringCopyPatchPlan {
  const before = readRow(row);
  const next = structuredClone(before);
  const fragments = REPLACEMENTS.map((rule) => {
    if ("index" in rule) {
      const faq = next[rule.field];
      if (faq.filter((item) => item.q === rule.question).length !== 1) {
        throw new MonitoringCopyPatchError(`${rule.field}[${rule.index}]: expected a unique question.`);
      }
      const item = faq[rule.index];
      if (!item || item.q !== rule.question) {
        throw new MonitoringCopyPatchError(`${rule.field}[${rule.index}]: question is not at the approved index.`);
      }
      const fragment = planFragment(item.a, rule, `${rule.field}[${rule.index}].a`);
      if (fragment.state === "replace") item.a = item.a.replace(rule.before, rule.after);
      return fragment;
    }
    const fragment = planFragment(next[rule.field], rule, rule.field);
    if (fragment.state === "replace") next[rule.field] = next[rule.field].replace(rule.before, rule.after);
    return fragment;
  });

  const changed = fragments.filter((fragment) => fragment.state === "replace").length;
  if (changed !== 0 && changed !== REPLACEMENTS.length) {
    throw new MonitoringCopyPatchError("Monitoring copy is partially applied; review the full row before continuing.");
  }
  return {
    status: changed === 0 ? "already-applied" : "apply",
    before,
    values: changed === 0 ? {} : {
      valuePropositionHu: next.valuePropositionHu,
      valuePropositionEn: next.valuePropositionEn,
      longDescHu: next.longDescHu,
      longDescEn: next.longDescEn,
      faqHu: next.faqHu,
      faqEn: next.faqEn,
    },
    fragments,
  };
}
