// Lowercases ASCII letters in a URL path while leaving percent-escapes
// (e.g. %C3%A9) untouched. Public locale paths and CMS slugs are lowercase
// ASCII, so the proxy redirects any other casing to this form.
export function lowercaseAsciiPath(pathname: string): string {
  return pathname.replace(/%[0-9A-Fa-f]{2}|[A-Z]/g, (match) =>
    match.length === 1 ? match.toLowerCase() : match,
  );
}
