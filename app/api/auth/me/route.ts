import { prisma } from "@/lib/server/prisma";
import { fail, ok, withErrorBoundary } from "@/lib/server/http";
import { getRequestUser } from "@/lib/server/request-auth";

export async function GET() {
  return withErrorBoundary(async () => {
    const tokenUser = await getRequestUser();
    if (!tokenUser) return fail(401, "Unauthorized");

    const user = await prisma.user.findUnique({
      where: { id: tokenUser.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        avatarUrl: true,
        emailVerifiedAt: true,
      },
    });

    if (!user) return fail(401, "Unauthorized");
    return ok({
      ...user,
      emailVerified: Boolean(user.emailVerifiedAt),
    });
  });
}
