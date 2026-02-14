import { jwtVerify, SignJWT } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { randomBytes } from "node:crypto";
import { env } from "@/lib/server/env";
import { HttpError } from "@/lib/server/http";

const encoder = new TextEncoder();
const jwtKey = encoder.encode(env.jwtSecret);

type SessionPayload = {
  sub: string;
  role: "USER" | "ADMIN";
  email: string;
};

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function signAccessToken(payload: SessionPayload) {
  if (!env.jwtSecret) {
    throw new HttpError(500, "JWT configuration missing");
  }

  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(env.jwtExpiresIn)
    .sign(jwtKey);
}

export async function verifyAccessToken(token: string) {
  if (!env.jwtSecret) {
    throw new HttpError(500, "JWT configuration missing");
  }

  const { payload } = await jwtVerify(token, jwtKey);
  return payload as unknown as SessionPayload;
}

export async function createSessionCookies(payload: SessionPayload) {
  const accessToken = await signAccessToken(payload);
  const csrfToken = randomBytes(32).toString("hex");

  const cookieStore = await cookies();

  cookieStore.set(env.sessionCookieName, accessToken, {
    httpOnly: true,
    secure: env.cookieSecure,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  cookieStore.set(env.csrfCookieName, csrfToken, {
    httpOnly: false,
    secure: env.cookieSecure,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return { csrfToken };
}

export async function clearSessionCookies() {
  const cookieStore = await cookies();
  cookieStore.set(env.sessionCookieName, "", { path: "/", maxAge: 0 });
  cookieStore.set(env.csrfCookieName, "", { path: "/", maxAge: 0 });
}
