import { getRedisClient } from "@/lib/server/redis";

const localCache = new Map<string, { value: string; expiresAt: number }>();

function now() {
  return Date.now();
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  const redis = getRedisClient();

  if (redis) {
    const raw = await redis.get(key);
    return raw ? (JSON.parse(raw) as T) : null;
  }

  const record = localCache.get(key);
  if (!record || record.expiresAt < now()) {
    localCache.delete(key);
    return null;
  }

  return JSON.parse(record.value) as T;
}

export async function cacheSet<T>(key: string, value: T, ttlSeconds: number) {
  const redis = getRedisClient();
  const payload = JSON.stringify(value);

  if (redis) {
    await redis.set(key, payload, "EX", ttlSeconds);
    return;
  }

  localCache.set(key, { value: payload, expiresAt: now() + ttlSeconds * 1000 });
}

export async function cacheDelete(key: string) {
  const redis = getRedisClient();
  if (redis) {
    await redis.del(key);
    return;
  }

  localCache.delete(key);
}
