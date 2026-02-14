import { prisma } from "@/lib/server/prisma";
import { getRedisClient } from "@/lib/server/redis";
import { withErrorBoundary } from "@/lib/server/http";

export async function GET() {
  return withErrorBoundary(async () => {
    const startedAt = process.uptime();

    let database = "down";
    try {
      await prisma.$queryRaw`SELECT 1`;
      database = "up";
    } catch {
      database = "down";
    }

    let redis = "not-configured";
    const redisClient = getRedisClient();
    if (redisClient) {
      try {
        await redisClient.ping();
        redis = "up";
      } catch {
        redis = "down";
      }
    }

    const status = database === "up" && redis !== "down" ? "ok" : "degraded";

    return Response.json(
      {
        status,
        timestamp: new Date().toISOString(),
        uptimeSeconds: Math.floor(startedAt),
        services: { database, redis },
      },
      {
        status: status === "ok" ? 200 : 503,
      },
    );
  });
}
