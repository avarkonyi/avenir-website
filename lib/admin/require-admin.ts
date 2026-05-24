import "server-only";

import { ALLOWED_ADMIN_EMAILS, auth } from "@/auth";

export type AdminUser = {
  email: string;
  name: string | null;
};

export class AdminUnauthorizedError extends Error {
  constructor() {
    super("Unauthorized");
    this.name = "AdminUnauthorizedError";
  }
}

export function isAllowedAdminEmail(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  return ALLOWED_ADMIN_EMAILS.includes(
    normalized as (typeof ALLOWED_ADMIN_EMAILS)[number],
  );
}

export function isAdminUnauthorizedError(
  error: unknown,
): error is AdminUnauthorizedError {
  return (
    error instanceof AdminUnauthorizedError ||
    (error instanceof Error && error.name === "AdminUnauthorizedError")
  );
}

export async function requireAdmin(): Promise<AdminUser> {
  const session = await auth();
  const email = session?.user?.email?.trim().toLowerCase();

  if (!email || !isAllowedAdminEmail(email)) {
    throw new AdminUnauthorizedError();
  }

  return {
    email,
    name: session?.user?.name ?? null,
  };
}
