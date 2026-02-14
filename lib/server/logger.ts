import pino from "pino";
import { env } from "@/lib/server/env";

const isProd = env.nodeEnv === "production";

export const logger = pino({
  level: env.logLevel,
  redact: {
    paths: ["req.headers.authorization", "req.headers.cookie", "password", "token", "secret"],
    remove: true,
  },
  ...(isProd ? {} : {}),
});

export function withRequestLogContext(request: Request) {
  const requestId = request.headers.get("x-request-id") ?? crypto.randomUUID();
  return logger.child({ requestId, path: new URL(request.url).pathname });
}
