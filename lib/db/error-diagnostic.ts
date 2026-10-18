// Emit only allowlisted codes and fixed labels. Driver messages, SQL parameters,
// connection strings and server-provided detail fields must not enter this value.
const DIAGNOSTICS: Readonly<Record<string, string>> = {
  "28P01": "database authentication failed",
  "28000": "database authorization failed",
  "3D000": "database does not exist",
  "42P01": "undefined table",
  "42703": "undefined column",
  "42501": "insufficient database privilege",
  "53300": "database connection limit reached",
  "57P01": "database shutdown",
  "08001": "database connection failed",
  "08006": "database connection lost",
  ENOTFOUND: "DNS lookup failed",
  EAI_AGAIN: "temporary DNS lookup failure",
  ECONNRESET: "connection reset",
  ECONNREFUSED: "connection refused",
  ETIMEDOUT: "connection timed out",
};

export function databaseErrorDiagnostic(error: unknown): string {
  const seen = new Set<object>();
  let current = error;
  for (let depth = 0; depth < 6; depth++) {
    if (current === null || typeof current !== "object" || seen.has(current)) break;
    seen.add(current);
    const { code, cause } = current as { code?: unknown; cause?: unknown };
    if (typeof code === "string" && Object.hasOwn(DIAGNOSTICS, code)) {
      return `${code}: ${DIAGNOSTICS[code]}`;
    }
    current = cause;
  }
  return "unclassified database failure";
}
