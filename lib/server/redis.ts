import Redis from "ioredis";
import { env } from "@/lib/server/env";
import { logger } from "@/lib/server/logger";

let redis: Redis | null = null;

export function getRedisClient() {
  if (!env.redisUrl) return null;

  if (!redis) {
    redis = new Redis(env.redisUrl, {
      maxRetriesPerRequest: 1,
      enableReadyCheck: true,
      lazyConnect: true,
    });

    redis.on("error", (error) => {
      logger.error({ error }, "Redis error");
    });
  }

  return redis;
}

export async function connectRedis() {
  const client = getRedisClient();
  if (!client) return;

  if (client.status === "ready" || client.status === "connecting") return;
  await client.connect();
}

export async function closeRedis() {
  if (!redis) return;
  await redis.quit();
  redis = null;
}
