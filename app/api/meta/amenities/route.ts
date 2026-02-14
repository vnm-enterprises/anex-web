import { prisma } from "@/lib/server/prisma";
import { withErrorBoundary } from "@/lib/server/http";
import { cacheGet, cacheSet } from "@/lib/server/cache";

export async function GET() {
  return withErrorBoundary(async () => {
    const key = "meta:amenities:v1";
    const cached = await cacheGet<unknown[]>(key);
    if (cached) return Response.json(cached);

    const amenities = await prisma.amenity.findMany({
      select: { id: true, name: true, slug: true },
      orderBy: { name: "asc" },
    });

    await cacheSet(key, amenities, 3600);
    return Response.json(amenities);
  });
}
