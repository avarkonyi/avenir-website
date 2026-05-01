# Admin Setup — Microsoft 365 OAuth

Avenir's `/admin` tool authenticates managers via the company Microsoft
365 tenant (Microsoft Entra ID, formerly Azure AD). Only emails on the
hard-coded allowlist (in `auth.ts`) can sign in — even if M365 OAuth
succeeds for any other M365 account.

## Required environment variables

| Var | Notes |
|---|---|
| `AUTH_SECRET` | 32-byte random secret. Generate with `openssl rand -base64 32`. |
| `AUTH_MICROSOFT_ENTRA_ID_ID` | Application (client) ID from the Azure App Registration. |
| `AUTH_MICROSOFT_ENTRA_ID_SECRET` | Client secret value (NOT the secret ID). |
| `AUTH_MICROSOFT_ENTRA_ID_ISSUER` | `https://login.microsoftonline.com/<tenant-id>/v2.0` |

For local dev, set them in `.env.local`. For Vercel, add them to the
Project Settings → Environment Variables for `Preview` and `Production`
(NOT Development unless you want to test against a real Azure tenant
locally).

## Azure AD App Registration — step-by-step

### 1. Create the registration

1. Go to https://portal.azure.com → **Microsoft Entra ID** → **App registrations** → **New registration**.
2. Fill in:
   - **Name:** `Avenir Admin`
   - **Supported account types:** *Accounts in this organizational directory only* (single tenant — `afm.hu`).
   - **Redirect URI:**
     - Type: **Web**
     - URL: `https://staging.afm.hu/api/auth/callback/microsoft-entra-id`
3. After creation, on the **Overview** tab, note:
   - **Application (client) ID** → `AUTH_MICROSOFT_ENTRA_ID_ID`
   - **Directory (tenant) ID** → goes into `AUTH_MICROSOFT_ENTRA_ID_ISSUER` per the pattern above.

### 2. Add a localhost redirect (dev)

Still on the registration:
1. **Authentication** → **Add a platform** → **Web** (or use the existing platform).
2. Add the URL: `http://localhost:3000/api/auth/callback/microsoft-entra-id`.
3. **Save**.

### 3. Add a production redirect (when going live)

When the production domain is wired:
1. **Authentication** → **Web** → **Add URI**.
2. Add: `https://www.afm.hu/api/auth/callback/microsoft-entra-id`.
3. **Save**.

### 4. Create a client secret

1. **Certificates & secrets** → **Client secrets** → **New client secret**.
2. **Description:** `Avenir Admin — staging`
3. **Expires:** **24 months** (set a calendar reminder to rotate before expiry).
4. **Add**.
5. Copy the **Value** column (shown only once). This is `AUTH_MICROSOFT_ENTRA_ID_SECRET`.

> ⚠️ Do NOT copy the *Secret ID* — that's the metadata identifier, not the secret itself.

### 5. (Optional) Restrict to specific groups

By default, single-tenant means *any* user in the `afm.hu` directory can
attempt to sign in. The application-level allowlist in `auth.ts`
(`ALLOWED_ADMIN_EMAILS`) blocks non-listed users. If a stricter Azure-side
gate is desired:

1. **Manage** → **Properties** → **Assignment required?** → **Yes**.
2. **Manage** → **Users and groups** → **Add user/group**.
3. Add only the admins.

This is double-protection but adds operational overhead. Phase 2.x
candidate, not required for Iter 1.

## Allowed admin emails (in code)

See `auth.ts`:

```typescript
const ALLOWED_ADMIN_EMAILS = [
  "varkonyi@afm.hu",     // András Várkonyi (managing director / project lead)
  "fanni.csegeny@afm.hu",// Csegény Fanni (Data Protection Officer)
  "peter.vagi@afm.hu",   // Vági Péter
] as const;
```

Comparison is case-insensitive (lowercased on both sides). To add a new
admin: append to the array, commit, redeploy. Removal is the same in
reverse — git history serves as the audit log.

## Local dev quick start

```bash
# 1. Copy and fill .env.local
cp .env.example .env.local
# Edit .env.local with the 4 AUTH_* vars

# 2. Run dev server
npm run dev

# 3. Visit
open http://localhost:3000/admin
# → redirects to /admin/login
# → click "Bejelentkezés Microsoft fiókkal"
# → completes M365 flow if your email is on the allowlist
```

## Vercel deploy

Each branch on Vercel gets a preview URL. To make M365 sign-in work on a
preview deploy, you need to add the preview URL to the Azure App
Registration's redirect URIs (**Authentication** → add Web URI like
`https://avenir-website-git-feature-admin-mvp-...vercel.app/api/auth/callback/microsoft-entra-id`).

For staging/production:
- staging: `https://staging.afm.hu/api/auth/callback/microsoft-entra-id`
- production (eventually): `https://www.afm.hu/api/auth/callback/microsoft-entra-id`

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `Configuration error` on /admin/login | One of the 4 env vars missing | Check Vercel env vars + redeploy |
| `Invalid redirect_uri` from Microsoft | Redirect URI not registered in Azure | Add the exact URL to App Registration → Authentication |
| `Hozzáférés megtagadva` (red banner) | Email not in allowlist | Add to `ALLOWED_ADMIN_EMAILS` in `auth.ts` |
| Sign-in completes then immediately logs out | `AUTH_SECRET` mismatch between request + cookie | Regenerate, set ONE value across all envs |

## Phase 2 roadmap

- **Iteration 1 (this commit):** NextAuth + login + dashboard skeleton.
- **Iteration 2:** Messages CRUD (DB inbox of contact form submissions).
- **Iteration 3:** News CRUD (multi-locale).
- **Iteration 4:** Career positions CRUD.
- **Iteration 5:** Partners + Certifications CRUD.
- **Iteration 6:** Settings + audit log + role-based access (if 2-tier
  needed beyond the flat allowlist).
