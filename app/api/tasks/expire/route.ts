import { ok, withErrorBoundary } from "@/lib/server/http";
import { prisma } from "@/lib/server/prisma";
import { refreshExpiredStates } from "@/lib/server/listing-service";
import { env } from "@/lib/server/env";
import { assertApiRateLimit } from "@/lib/server/route-guards";

export async function POST(request: Request) {
  return withErrorBoundary(async () => {
    await assertApiRateLimit(request, "api:tasks:expire");
    const authHeader = request.headers.get("authorization");
    if (!env.cronSecret || authHeader !== `Bearer ${env.cronSecret}`) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await refreshExpiredStates(prisma);

    return ok({ ok: true, ranAt: new Date().toISOString() });
  });
}
