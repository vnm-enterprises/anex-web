import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("auth-storage")?.value;

  const protectedRoutes = ["/dashboards", "/lists", "/settingss"];

  if (
    protectedRoutes.some((path) =>
      req.nextUrl.pathname.startsWith(path)
    ) &&
    !token
  ) {
    return NextResponse.redirect(
      new URL("/auth/login", req.url)
    );
  }

  return NextResponse.next();
}
