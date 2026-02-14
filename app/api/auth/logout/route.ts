import { ok, withErrorBoundary } from "@/lib/server/http";
import { assertCsrf } from "@/lib/server/csrf";
import { clearSessionCookies } from "@/lib/server/auth";

export async function POST(request: Request) {
  return withErrorBoundary(async () => {
    await assertCsrf(request);
    await clearSessionCookies();
    return ok({ ok: true });
  });
}
