export type RedisConfig = {
  url: string;
  token: string;
};

export function getRedisConfig(): RedisConfig | null {
  const url = firstNonEmpty(
    process.env.UPSTASH_REDIS_REST_URL,
    process.env.KV_REST_API_URL,
  );
  const token = firstNonEmpty(
    process.env.UPSTASH_REDIS_REST_TOKEN,
    process.env.KV_REST_API_TOKEN,
  );

  if (!url || !token) {
    return null;
  }

  return { url, token };
}

function firstNonEmpty(...values: Array<string | undefined>): string | null {
  for (const value of values) {
    const trimmed = value?.trim();
    if (trimmed) return trimmed;
  }
  return null;
}
