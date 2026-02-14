import { OAuth2Client } from "google-auth-library";
import { prisma } from "@/lib/server/prisma";
import { created, fail, withErrorBoundary } from "@/lib/server/http";
import { createSessionCookies } from "@/lib/server/auth";
import { env } from "@/lib/server/env";
import { googleSchema } from "@/lib/server/validation";
import { assertAuthRateLimit } from "@/lib/server/route-guards";

const googleClient = new OAuth2Client(env.googleClientId);

export async function POST(request: Request) {
  return withErrorBoundary(async () => {
    await assertAuthRateLimit(request, "auth:google");
    const input = googleSchema.parse(await request.json());

    if (!env.googleClientId) {
      return fail(500, "Google auth not configured");
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: input.idToken,
      audience: env.googleClientId,
    });

    const payload = ticket.getPayload();
    if (!payload?.sub || !payload.email) {
      return fail(401, "Invalid Google token");
    }

    const user = await prisma.user.upsert({
      where: { email: payload.email.toLowerCase() },
      update: {
        name: payload.name,
        avatarUrl: payload.picture,
        provider: "GOOGLE",
        providerSub: payload.sub,
        emailVerifiedAt: new Date(),
      },
      create: {
        email: payload.email.toLowerCase(),
        name: payload.name,
        avatarUrl: payload.picture,
        provider: "GOOGLE",
        providerSub: payload.sub,
        emailVerifiedAt: new Date(),
      },
      select: { id: true, email: true, role: true },
    });

    const { csrfToken } = await createSessionCookies({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return created({ ok: true, csrfToken });
  });
}
