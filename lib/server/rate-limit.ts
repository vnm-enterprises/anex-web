import { createHash } from "node:crypto";
import { env } from "@/lib/server/env";
import { HttpError } from "@/lib/server/http";
import { getRedisClient } from "@/lib/server/redis";

type RateLimitOptions = {
  keyPrefix: string;
  maxRequests?: number;
  windowSec?: number;
  ip?: string;
  userId?: string;
};

const memoryStore = new Map<string, { count: number; resetAt: number }>();

function buildIdentifier(input: string) {
  return createHash("sha256").update(input).digest("hex").slice(0, 24);
}

function keyFromOpts(opts: RateLimitOptions) {
  const subject = opts.userId ?? opts.ip ?? "anonymous";
  return `${opts.keyPrefix}:${buildIdentifier(subject)}`;
}

export async function enforceRateLimit(opts: RateLimitOptions) {
  const windowSec = opts.windowSec ?? env.rateLimitWindowSec;
  const maxRequests = opts.maxRequests ?? env.rateLimitMaxRequests;
  const key = keyFromOpts(opts);
  const redis = getRedisClient();

  if (redis) {
    const count = await redis.incr(key);
    if (count === 1) {
      await redis.expire(key, windowSec);
    }

    if (count > maxRequests) {
      throw new HttpError(429, "Too many requests");
    }

    return;
  }

  const now = Date.now();
  const existing = memoryStore.get(key);

  if (!existing || existing.resetAt <= now) {
    memoryStore.set(key, { count: 1, resetAt: now + windowSec * 1000 });
    return;
  }

  existing.count += 1;
  if (existing.count > maxRequests) {
    throw new HttpError(429, "Too many requests");
  }
}

export function ipFromRequest(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? request.headers.get("x-real-ip")
    ?? "0.0.0.0";
}
