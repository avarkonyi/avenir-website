// NextAuth.js v5 (Auth.js) catch-all handler. Re-exports the GET/POST
// handlers from the project-root auth.ts. This is the standard pattern
// for App Router; do not add any logic here.

import { handlers } from "@/auth";

export const { GET, POST } = handlers;
