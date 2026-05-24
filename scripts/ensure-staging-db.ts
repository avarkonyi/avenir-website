const DEFAULT_STAGING_ENDPOINT = "ep-twilight-sound-al2b7jsb";
const DEFAULT_PRODUCTION_ENDPOINT = "ep-young-meadow-aln5ux5m";

type DbTarget = "staging" | "production";

type EnsureStagingOptions = {
  scriptName: string;
  isDryRun: boolean;
};

type EnsureDbTargetOptions = EnsureStagingOptions & {
  target: DbTarget;
  allowProduction: boolean;
};

export function readDbTargetArgs(argv = process.argv): {
  target: DbTarget;
  allowProduction: boolean;
} {
  const targetIndex = argv.indexOf("--target");
  const rawTarget = targetIndex === -1 ? "staging" : argv[targetIndex + 1];

  if (rawTarget !== "staging" && rawTarget !== "production") {
    console.error(`Unknown DB target "${rawTarget ?? ""}". Use "staging" or "production".`);
    process.exit(1);
  }

  return {
    target: rawTarget,
    allowProduction: argv.includes("--allow-production"),
  };
}

function endpointFromUrl(url: string): string | null {
  try {
    const host = new URL(url).hostname;
    const match = host.match(/^(ep-[a-z0-9-]+?)(?:-pooler)?\./i);
    return match?.[1] ?? null;
  } catch {
    return null;
  }
}

function redactedDbIdentity(url: string): string {
  try {
    const parsed = new URL(url);
    const host = parsed.host || "<no-host>";
    const dbName = parsed.pathname.replace(/^\//, "") || "<no-db>";
    return `${host}/${dbName}`;
  } catch {
    return "<unparseable DATABASE_URL>";
  }
}

export function ensureDbTarget({
  scriptName,
  isDryRun,
  target,
  allowProduction,
}: EnsureDbTargetOptions): void {
  const raw = process.env.DATABASE_URL;
  if (!raw) {
    console.error(`${scriptName}: DATABASE_URL is not set.`);
    process.exit(1);
  }

  const expectedStagingEndpoint =
    process.env.EXPECTED_STAGING_NEON_ENDPOINT ?? DEFAULT_STAGING_ENDPOINT;
  const expectedProductionEndpoint =
    process.env.EXPECTED_PRODUCTION_NEON_ENDPOINT ?? DEFAULT_PRODUCTION_ENDPOINT;
  const expectedEndpoint =
    target === "staging" ? expectedStagingEndpoint : expectedProductionEndpoint;
  const endpoint = endpointFromUrl(raw);
  const identity = redactedDbIdentity(raw);

  if (target === "production" && !allowProduction) {
    console.error(`${scriptName}: production DB target requires --allow-production.`);
    process.exit(1);
  }

  if (!endpoint) {
    console.error(
      `${scriptName}: cannot determine Neon endpoint from DATABASE_URL (${identity}).`,
    );
    process.exit(1);
  }

  if (endpoint !== expectedEndpoint) {
    const productionHint =
      endpoint === expectedProductionEndpoint && target !== "production"
        ? " This looks like the production endpoint."
        : "";
    console.error(
      `${scriptName}: refusing to ${isDryRun ? "read" : "write"} because ` +
        `DATABASE_URL points at endpoint=${endpoint}, expected ${target} ` +
        `endpoint=${expectedEndpoint}. DB target: ${identity}.` +
        productionHint,
    );
    console.error(
      "Fix the active env target before running this command. Full DATABASE_URL was not printed.",
    );
    process.exit(1);
  }

  console.log(
    `DB target guard OK (${isDryRun ? "dry-run" : "write"}): ` +
      `target=${target} endpoint=${endpoint} db=${identity}`,
  );

  if (target === "production") {
    console.log(`${scriptName}: production DB target explicitly allowed.`);
  }
}

export function ensureStagingDbTarget({
  scriptName,
  isDryRun,
}: EnsureStagingOptions): void {
  ensureDbTarget({
    scriptName,
    isDryRun,
    target: "staging",
    allowProduction: false,
  });
}
