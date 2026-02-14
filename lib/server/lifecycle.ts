import { prisma } from "@/lib/server/prisma";
import { closeRedis } from "@/lib/server/redis";
import { logger } from "@/lib/server/logger";

let registered = false;

async function shutdown(signal: string) {
  logger.info({ signal }, "Shutting down gracefully");

  try {
    await Promise.allSettled([
      prisma.$disconnect(),
      closeRedis(),
    ]);
  } catch (error) {
    logger.error({ error }, "Graceful shutdown encountered errors");
  } finally {
    process.exit(0);
  }
}

export function registerGracefulShutdown() {
  if (registered) return;
  registered = true;

  process.on("SIGTERM", () => { void shutdown("SIGTERM"); });
  process.on("SIGINT", () => { void shutdown("SIGINT"); });
}
