export function hasAllowedAdminSession(
  session: unknown,
  allowedEmails: readonly string[],
): boolean {
  if (!session || typeof session !== "object" || !("user" in session)) return false;
  const user = session.user;
  if (!user || typeof user !== "object" || !("email" in user)) return false;
  if (typeof user.email !== "string") return false;
  const email = user.email.trim().toLowerCase();
  return email.length > 0 && allowedEmails.includes(email);
}
