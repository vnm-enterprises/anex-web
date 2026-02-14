import { prisma } from "@/lib/server/prisma";
import { withErrorBoundary } from "@/lib/server/http";
import { cacheGet, cacheSet } from "@/lib/server/cache";

export async function GET() {
  return withErrorBoundary(async () => {
    const key = "meta:districts:v1";
    const cached = await cacheGet<unknown[]>(key);
    if (cached) return Response.json(cached);

    const districts = await prisma.district.findMany({
      select: { id: true, name: true, slug: true },
      orderBy: { name: "asc" },
    });

    await cacheSet(key, districts, 3600);
    return Response.json(districts);
  });
}
