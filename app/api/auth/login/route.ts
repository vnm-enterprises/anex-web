import { prisma } from "@/lib/server/prisma";
import { fail, ok, withErrorBoundary } from "@/lib/server/http";
import { createSessionCookies, verifyPassword } from "@/lib/server/auth";
import { loginSchema } from "@/lib/server/validation";
import { assertAuthRateLimit } from "@/lib/server/route-guards";

export async function POST(request: Request) {
  return withErrorBoundary(async () => {
    await assertAuthRateLimit(request, "auth:login");
    const input = loginSchema.parse(await request.json());

    const user = await prisma.user.findUnique({ where: { email: input.email.toLowerCase() } });
    if (!user?.passwordHash) {
      return fail(401, "Invalid credentials");
    }

    const valid = await verifyPassword(input.password, user.passwordHash);
    if (!valid) return fail(401, "Invalid credentials");

    const { csrfToken } = await createSessionCookies({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return ok({ ok: true, csrfToken });
  });
}
