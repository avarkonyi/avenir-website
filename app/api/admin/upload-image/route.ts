// Generic image upload endpoint shared by all admin forms (News,
// Services, future modules). Uploads to Vercel Blob with a UUID
// filename and a MIME-derived extension; the original filename is
// never used in the destination path (prevents double-extension and
// Unicode-tricks). Returns the public URL on success.
//
// Auth: middleware (proxy.ts) gates /api/admin/* by session, but
// route handlers are also reachable via direct POST, so we check
// the session inline as defense in depth and respond with 401 JSON
// instead of a redirect (which a fetch() caller cannot follow).
//
// Folder whitelist: only accepts known subtrees ("news", "services",
// "partners", "certifications"). Adding a new module to the whitelist
// is a one-line change. PDFs go through a separate route
// (/api/admin/upload-pdf) — the MIME validation here is image-only.

import { put } from "@vercel/blob";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

const ALLOWED_FOLDERS = new Set([
  "news",
  "services",
  "partners",
  "certifications",
]);
const ALLOWED_MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
const MAX_BYTES = 5 * 1024 * 1024;

export async function POST(req: NextRequest): Promise<NextResponse> {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json(
      { ok: false, error: "Nincs jogosultság." },
      { status: 401 },
    );
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Hibás kérés." },
      { status: 400 },
    );
  }

  const file = formData.get("file");
  const folderRaw = formData.get("folder");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { ok: false, error: "Nincs feltöltendő fájl." },
      { status: 400 },
    );
  }

  const folder = typeof folderRaw === "string" ? folderRaw : "";
  if (!ALLOWED_FOLDERS.has(folder)) {
    return NextResponse.json(
      { ok: false, error: "Érvénytelen mappa." },
      { status: 400 },
    );
  }

  if (file.size === 0) {
    return NextResponse.json(
      { ok: false, error: "Üres fájl." },
      { status: 400 },
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { ok: false, error: "A fájl mérete maximum 5 MB lehet." },
      { status: 413 },
    );
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json(
      { ok: false, error: "Csak képfájl tölthető fel." },
      { status: 415 },
    );
  }
  const ext = ALLOWED_MIME_TO_EXT[file.type];
  if (!ext) {
    return NextResponse.json(
      {
        ok: false,
        error: "Csak JPEG, PNG vagy WebP formátum engedélyezett.",
      },
      { status: 415 },
    );
  }

  // Filename is derived entirely from validated MIME — never from
  // the user-supplied file.name. Prevents double-extension attacks
  // (foo.jpg.exe), inconsistent extensions, and Unicode shenanigans.
  const pathname = `${folder}/${crypto.randomUUID()}.${ext}`;

  try {
    const blob = await put(pathname, file, { access: "public" });
    return NextResponse.json({ ok: true, url: blob.url });
  } catch (err) {
    // Most likely failure mode: missing BLOB_READ_WRITE_TOKEN env or
    // a Blob store not provisioned in the Vercel project. Surface a
    // generic operator-facing message; the underlying error is
    // logged server-side for debugging.
    console.error("[upload-image] Vercel Blob put() failed:", err);
    return NextResponse.json(
      { ok: false, error: "Vercel Blob konfigurációs hiba." },
      { status: 500 },
    );
  }
}
