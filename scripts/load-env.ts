// Side-effect import that loads .env.local before any module that reads
// process.env. Use as: `import "./load-env";` at the top of any CLI script
// (seed, verify, etc.) that needs DATABASE_URL injected before importing
// `lib/db` (which throws at module-load if DATABASE_URL is unset).

import { config } from "dotenv";

config({ path: ".env.local" });
