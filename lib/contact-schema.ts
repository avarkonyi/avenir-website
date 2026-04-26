// Shared Zod schema for the contact form. Lives in lib/ so both the
// client (Contact.tsx) and the server (app/api/contact/route.ts) parse
// against the same definition. Issue messages are i18n keys, mapped on
// the client to t.form.errors.* localized strings.

import { z } from "zod";

export const ContactPayloadSchema = z.object({
  name: z.string().trim().min(1, "nameRequired").max(120),
  company: z.string().trim().max(120).optional(),
  email: z
    .string()
    .trim()
    .min(1, "emailRequired")
    .email("emailInvalid")
    .max(200),
  phone: z.string().trim().max(40).optional(),
  service: z.string().max(50).optional(),
  message: z.string().trim().max(4000).optional(),
  locale: z.enum(["hu", "en", "de", "zh"]),
  // Honeypot: hidden field that humans don't see. Bots fill every input.
  // Schema accepts any string — the route handler checks if non-empty
  // and returns a silent 200 (no validation error revealed to the bot).
  _website: z.string(),
});

export type ContactPayload = z.infer<typeof ContactPayloadSchema>;
