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

  const databaseUrl = process.env.DATABASE_URL;
  let message = rawMessage;
  if (databaseUrl) {
    message = message.split(databaseUrl).join("[redacted DATABASE_URL]");
  }

  return message
    .replace(/postgres(?:ql)?:\/\/[^\s"'`<>]+/gi, "postgres://[redacted]")
    .replace(/(password=)[^&\s"'`<>]+/gi, "$1[redacted]");
}
