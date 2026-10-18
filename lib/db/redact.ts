export function redactedDbIdentity(): string {
  const raw = process.env.DATABASE_URL;
  if (!raw) return "DATABASE_URL is not set";

  try {
    const url = new URL(raw);
    const database = url.pathname.replace(/^\/+/, "") || "(unknown)";
    return `host=${url.hostname} db=${database}`;
  } catch {
    return "DATABASE_URL is set but could not be parsed";
  }
}

export function sanitizeDbErrorMessage(error: unknown): string {
  const rawMessage =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : "Unknown database error";

  // drizzle-orm's DrizzleQueryError message ends with "\nparams: <bound
  // values>". Bound values are user data (contact form fields, reply bodies),
  // so everything from the params line onward is dropped before logging.
  const databaseUrl = process.env.DATABASE_URL;
  let message = rawMessage.replace(/\r?\nparams:[\s\S]*$/, "\nparams: [redacted]");
  if (databaseUrl) {
    message = message.split(databaseUrl).join("[redacted DATABASE_URL]");
  }

  return message
    .replace(/postgres(?:ql)?:\/\/[^\s"'`<>]+/gi, "postgres://[redacted]")
    .replace(/(password=)[^&\s"'`<>]+/gi, "$1[redacted]");
}
