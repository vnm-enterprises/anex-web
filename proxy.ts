import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PREFIXES = ["/dashboard"];

const edgeRateStore = new Map<string, { count: number; resetAt: number }>();
const EDGE_WINDOW_MS = 60_000;
const EDGE_MAX = 180;

function applySecurityHeaders(response: NextResponse) {
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(self)");
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://accounts.google.com https://apis.google.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://api.stripe.com https://accounts.google.com",
      "frame-src 'self' https://js.stripe.com https://accounts.google.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests",
    ].join("; "),
  );
}

function enforceEdgeRateLimit(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/api")) return null;

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const key = `${ip}:${Math.floor(Date.now() / EDGE_WINDOW_MS)}`;
  const now = Date.now();
  const current = edgeRateStore.get(key);

  if (!current || current.resetAt <= now) {
    edgeRateStore.set(key, { count: 1, resetAt: now + EDGE_WINDOW_MS });
    return null;
  }

  current.count += 1;
  if (current.count > EDGE_MAX) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  return null;
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const rateLimited = enforceEdgeRateLimit(request);
  if (rateLimited) {
    applySecurityHeaders(rateLimited);
    return rateLimited;
  }

  const needsAuth = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (needsAuth) {
    const hasSession = Boolean(request.cookies.get("annex_access")?.value);
    if (!hasSession) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      const response = NextResponse.redirect(loginUrl);
      applySecurityHeaders(response);
      return response;
    }
  }

  const response = NextResponse.next();
  applySecurityHeaders(response);
  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*", "/((?!_next/static|_next/image|favicon.ico).*)"],
};
