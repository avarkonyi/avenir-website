import { sanitizeDbErrorMessage } from "@/lib/db/redact";

export function safeActionError(
  action: string,
  error: unknown,
  fallbackMessage: string,
): string {
  console.error(
    `[admin-action] ${action} failed: ${sanitizeDbErrorMessage(error)}`,
  );
  return fallbackMessage;
}
