// Builds a meta / schema description from longer approved page text without
// cutting words in half. Prefers ending on a full sentence; otherwise ends on
// a word boundary with an ellipsis. Never rewrites the wording itself.

const MIN_SENTENCE_LENGTH = 70;

// Words whose trailing period is part of the word, not a sentence end
// (company forms and common HU/DE/EN abbreviations used in legal copy).
const ABBREVIATIONS = new Set([
  "kft", "zrt", "nyrt", "bt", "kkt", "ltd", "inc", "gmbh",
  "nr", "str", "bzw", "ca", "dr", "pl", "stb", "kb", "ún", "vö", "u.a", "z.b", "etc",
]);

function lastSentenceEnd(text: string, limit: number): number {
  let best = -1;
  const pattern = /([.!?])\s+(?=\S)/g;
  for (let match = pattern.exec(text); match; match = pattern.exec(text)) {
    const end = match.index + 1;
    if (end > limit) break;
    if (match[1] === ".") {
      const word = text.slice(0, match.index).split(/\s/).pop()?.toLowerCase() ?? "";
      if (ABBREVIATIONS.has(word)) continue;
    }
    best = end;
  }
  return best;
}

export function toMetaDescription(text: string, maxLength = 160): string {
  const normalized = text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .join("; ")
    .replace(/\s+/g, " ")
    .replace(/([.!?]);\s/g, "$1 ");
  if (normalized.length <= maxLength) return normalized;

  const sentenceEnd = lastSentenceEnd(normalized, maxLength);
  if (sentenceEnd >= MIN_SENTENCE_LENGTH) return normalized.slice(0, sentenceEnd);

  const wordEnd = normalized.lastIndexOf(" ", maxLength - 1);
  const cut = normalized.slice(0, wordEnd > 0 ? wordEnd : maxLength - 1);
  return `${cut.replace(/[\s,;:–—-]+$/, "")}…`;
}
