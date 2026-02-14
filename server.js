/* eslint-disable @typescript-eslint/no-require-imports */
const http = require("node:http");
const next = require("next");
const express = require("express");
const compression = require("compression");
const helmet = require("helmet");
const pino = require("pino");
const pinoHttp = require("pino-http");

// ✅ Import Prisma + Redis directly here (Node runtime safe)
const { prisma } = require("./lib/server/prisma");
const { closeRedis } = require("./lib/server/redis");

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "0.0.0.0";
const port = Number(process.env.PORT || 3000);
const logger = pino({ level: process.env.LOG_LEVEL || "info" });

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

function buildCsp() {
  return [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://accounts.google.com https://apis.google.com https://js.stripe.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://api.stripe.com https://accounts.google.com",
    "frame-src 'self' https://accounts.google.com https://js.stripe.com",
    "object-src 'none'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ].join("; ");
}

async function bootstrap() {
  await app.prepare();

  const server = express();
  server.set("trust proxy", 1);
  server.use(compression());
  server.use(pinoHttp({ logger }));

  server.use(
    helmet({
      contentSecurityPolicy: false, // handled manually
      crossOriginEmbedderPolicy: false,
    }),
  );

  server.use((req, res, nextFn) => {
    res.setHeader("Content-Security-Policy", buildCsp());
    nextFn();
  });

  server.get("/healthz", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  server.all("*", (req, res) => handle(req, res));

  const httpServer = http.createServer(server);

  // ✅ Proper graceful shutdown
  const shutdown = async (signal) => {
    logger.info({ signal }, "Shutting down gracefully");

    try {
      httpServer.close(async () => {
        logger.info("HTTP server closed");

        await Promise.allSettled([
          prisma.$disconnect(),
          closeRedis(),
        ]);

        logger.info("Resources cleaned up");
        process.exit(0);
      });

      // Force exit after timeout
      setTimeout(() => {
        logger.error("Forced shutdown after timeout");
        process.exit(1);
      }, 10_000).unref();
    } catch (error) {
      logger.error({ error }, "Shutdown error");
      process.exit(1);
    }
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));

  httpServer.listen(port, hostname, () => {
    logger.info({ port, hostname }, "Annex.lk server started");
  });
}

bootstrap().catch((error) => {
  logger.error({ error }, "Failed to bootstrap server");
  process.exit(1);
});
