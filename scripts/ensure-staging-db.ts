const DEFAULT_STAGING_ENDPOINT = "ep-twilight-sound-al2b7jsb";
const DEFAULT_PRODUCTION_ENDPOINT = "ep-young-meadow-aln5ux5m";

type EnsureStagingOptions = {
  scriptName: string;
  isDryRun: boolean;
};

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

export function ensureStagingDbTarget({
  scriptName,
  isDryRun,
}: EnsureStagingOptions): void {
  const raw = process.env.DATABASE_URL;
  if (!raw) {
    console.error(`${scriptName}: DATABASE_URL is not set.`);
    process.exit(1);
  }

  const expectedStagingEndpoint =
    process.env.EXPECTED_STAGING_NEON_ENDPOINT ?? DEFAULT_STAGING_ENDPOINT;
  const productionEndpoint =
    process.env.EXPECTED_PRODUCTION_NEON_ENDPOINT ?? DEFAULT_PRODUCTION_ENDPOINT;
  const endpoint = endpointFromUrl(raw);
  const identity = redactedDbIdentity(raw);

  if (!endpoint) {
    console.error(
      `${scriptName}: cannot determine Neon endpoint from DATABASE_URL (${identity}).`,
    );
    process.exit(1);
  }

  if (endpoint !== expectedStagingEndpoint) {
    const productionHint =
      endpoint === productionEndpoint ? " This looks like the production endpoint." : "";
    console.error(
      `${scriptName}: refusing to ${isDryRun ? "read" : "write"} because ` +
        `DATABASE_URL points at endpoint=${endpoint}, expected staging ` +
        `endpoint=${expectedStagingEndpoint}. DB target: ${identity}.` +
        productionHint,
    );
    console.error(
      "Fix the active env target before running this pilot seed. Full DATABASE_URL was not printed.",
    );
    process.exit(1);
  }

  console.log(
    `DB target guard OK (${isDryRun ? "dry-run" : "write"}): ` +
      `endpoint=${endpoint} target=${identity}`,
  );
}
