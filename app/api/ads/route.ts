import { z } from "zod";
import { prisma } from "@/lib/server/prisma";

const querySchema = z.object({
  placement: z.enum(["HOME_HERO", "HOME_INLINE", "DISTRICT_TOP", "CITY_TOP", "SEARCH_INLINE"]),
  districtSlug: z.string().optional(),
  citySlug: z.string().optional(),
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const input = querySchema.parse(Object.fromEntries(url.searchParams));

  const district = input.districtSlug
    ? await prisma.district.findUnique({ where: { slug: input.districtSlug }, select: { id: true } })
    : null;

  const city = input.citySlug
    ? await prisma.city.findFirst({ where: { slug: input.citySlug }, select: { id: true } })
    : null;

  const now = new Date();
  const ads = await prisma.ad.findMany({
    where: {
      placement: input.placement,
      isActive: true,
      startsAt: { lte: now },
      endsAt: { gte: now },
      ...(district ? { districtId: district.id } : {}),
      ...(city ? { cityId: city.id } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return Response.json({ items: ads });
}
