type Schema = Record<string, unknown>;

// HTML-safe JSON.stringify: escapes characters that would break out of
// a <script> tag (`<`, `>`) or be misinterpreted by HTML/JS parsers
// (`&`, U+2028 LINE SEPARATOR, U+2029 PARAGRAPH SEPARATOR — both
// treated as line terminators in legacy ES parsers despite being
// valid inside JSON). Required because schema content may include
// DB-sourced fields (admin CRUD); a malicious value containing
// `</script>` would otherwise terminate the JSON-LD script tag and
// enable XSS.
//
// U+2028/U+2029 are constructed at runtime via fromCharCode so the
// source file contains only ASCII (literal U+2028/U+2029 in source
// would be normalised by some editors/tools to regular whitespace).
const LINE_SEP = String.fromCharCode(0x2028);
const PARA_SEP = String.fromCharCode(0x2029);

function safeJsonLdStringify(obj: unknown): string {
  return JSON.stringify(obj)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .split(LINE_SEP)
    .join("\\u2028")
    .split(PARA_SEP)
    .join("\\u2029");
}

export function JsonLd({ schemas }: { schemas: Schema[] }) {
  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(schema) }}
        />
      ))}
    </>
  );
}
