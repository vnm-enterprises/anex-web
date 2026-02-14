import { z } from "zod";
import { prisma } from "@/lib/server/prisma";
import { created, ok, withErrorBoundary } from "@/lib/server/http";
import { assertCsrf } from "@/lib/server/csrf";
import { requireRole } from "@/lib/server/request-auth";
import { adSchema } from "@/lib/server/validation";

const querySchema = z.object({
  placement: z.string().optional(),
});

export async function GET(request: Request) {
  return withErrorBoundary(async () => {
    await requireRole("ADMIN");
    const parsed = querySchema.parse(Object.fromEntries(new URL(request.url).searchParams));

    const items = await prisma.ad.findMany({
      where: {
        ...(parsed.placement ? { placement: parsed.placement as never } : {}),
      },
      include: {
        district: true,
        city: true,
        _count: { select: { impressions: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return ok({ items });
  });
}

export async function POST(request: Request) {
  return withErrorBoundary(async () => {
    await assertCsrf(request);
    await requireRole("ADMIN");
    const input = adSchema.parse(await request.json());

    const ad = await prisma.ad.create({
      data: {
        title: input.title,
        imageUrl: input.imageUrl,
        targetUrl: input.targetUrl,
        placement: input.placement,
        districtId: input.districtId,
        cityId: input.cityId,
        startsAt: new Date(input.startsAt),
        endsAt: new Date(input.endsAt),
        isActive: input.isActive,
      },
    });

    return created({ ad });
  });
}
