import { env } from "@/lib/server/env";
import { enforceRateLimit, ipFromRequest } from "@/lib/server/rate-limit";
import { getRequestUser } from "@/lib/server/request-auth";

export async function assertApiRateLimit(request: Request, keyPrefix = "api") {
  const user = await getRequestUser();
  await enforceRateLimit({
    keyPrefix,
    ip: ipFromRequest(request),
    userId: user?.id,
    maxRequests: env.rateLimitMaxRequests,
    windowSec: env.rateLimitWindowSec,
  });
}

export async function assertAuthRateLimit(request: Request, keyPrefix = "auth") {
  await enforceRateLimit({
    keyPrefix,
    ip: ipFromRequest(request),
    maxRequests: env.rateLimitAuthMaxRequests,
    windowSec: env.rateLimitWindowSec,
  });
}
