import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL env var is not set");
}

// Local name is `neonSql` (not just `sql`) to avoid colliding with
// drizzle-orm's `sql` template tag when both are imported in the same
// file. Exported alongside `db` so a server action can opt into the
// Neon HTTP non-interactive transaction API
// (`neonSql.transaction([...])`) for atomic batched statements —
// drizzle-orm/neon-http itself doesn't support callback-style
// transactions.
const neonSql = neon(process.env.DATABASE_URL);

export const db = drizzle(neonSql, { schema });
export { neonSql };

// Re-export tables for ergonomic usage:
//   import { db, news, positions, messages, clientReferences } from "@/lib/db";
export * from "./schema";
