import { prisma } from "@/lib/server/prisma";
import { ok, withErrorBoundary } from "@/lib/server/http";
import { requireUser } from "@/lib/server/request-auth";

export async function GET() {
  return withErrorBoundary(async () => {
    const user = await requireUser();

    const inquiries = await prisma.inquiry.findMany({
      where: {
        listing: {
          ownerId: user.id,
        },
      },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 200,
    });

    return ok({ items: inquiries });
  });
}
