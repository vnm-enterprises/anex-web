import { cookies } from "next/headers";
import { UserRole } from "@prisma/client";
import { verifyAccessToken } from "@/lib/server/auth";
import { env } from "@/lib/server/env";
import { HttpError } from "@/lib/server/http";

export type RequestUser = {
  id: string;
  role: UserRole;
  email: string;
};

export async function getRequestUser(): Promise<RequestUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(env.sessionCookieName)?.value;

  if (!token) return null;

  try {
    const payload = await verifyAccessToken(token);
    return {
      id: payload.sub,
      role: payload.role as UserRole,
      email: payload.email,
    };
  } catch {
    return null;
  }
}

export async function requireUser() {
  const user = await getRequestUser();

  if (!user) {
    throw new HttpError(401, "Unauthorized");
  }

  return user;
}

export async function requireRole(role: UserRole) {
  const user = await requireUser();

  if (user.role !== role) {
    throw new HttpError(403, "Forbidden");
  }

  return user;
}
