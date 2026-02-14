import { cookies } from "next/headers";
import { env } from "@/lib/server/env";
import { HttpError } from "@/lib/server/http";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

export async function assertCsrf(request: Request) {
  if (SAFE_METHODS.has(request.method)) return;

  const cookieStore = await cookies();
  const cookieToken = cookieStore.get(env.csrfCookieName)?.value;
  const headerToken = request.headers.get("x-csrf-token");

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    throw new HttpError(403, "CSRF validation failed");
  }
}
