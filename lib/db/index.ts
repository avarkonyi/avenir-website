import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL env var is not set");
}

const sql = neon(process.env.DATABASE_URL);

export const db = drizzle(sql, { schema });

// Re-export tables for ergonomic usage:
//   import { db, news, positions, messages, clientReferences } from "@/lib/db";
export * from "./schema";
