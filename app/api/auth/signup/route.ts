import { prisma } from "@/lib/server/prisma";
import { created, fail, withErrorBoundary } from "@/lib/server/http";
import { hashPassword, createSessionCookies } from "@/lib/server/auth";
import { signupSchema } from "@/lib/server/validation";
import { assertAuthRateLimit } from "@/lib/server/route-guards";

export async function POST(request: Request) {
  return withErrorBoundary(async () => {
    await assertAuthRateLimit(request, "auth:signup");
    const json = await request.json();
    const input = signupSchema.parse(json);

    const existing = await prisma.user.findUnique({ where: { email: input.email.toLowerCase() } });
    if (existing) {
      return fail(409, "Email already in use");
    }

    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email.toLowerCase(),
        phone: input.phone,
        passwordHash: await hashPassword(input.password),
        provider: "CREDENTIALS",
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
