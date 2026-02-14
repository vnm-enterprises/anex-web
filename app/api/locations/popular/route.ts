import { prisma } from "@/lib/server/prisma";
import { cacheGet, cacheSet } from "@/lib/server/cache";

export async function GET() {
  const cacheKey = "locations:popular:v1";
  const cached = await cacheGet<unknown[]>(cacheKey);
  if (cached) {
    return Response.json(cached);
  }

  const rows = await prisma.district.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      _count: {
        select: {
          listings: {
            where: {
              status: "APPROVED",
              expiresAt: { gte: new Date() },
            },
          },
        },
      },
    },
    orderBy: {
      listings: {
        _count: "desc",
      },
    },
    take: 8,
  });

  const payload = rows.map((r: { id: number; name: string; slug: string; _count: { listings: number } }) => ({
      id: r.id,
      name: r.name,
      slug: r.slug,
      listingCount: r._count.listings,
    }));

  await cacheSet(cacheKey, payload, 300);

  return Response.json(payload);
}
