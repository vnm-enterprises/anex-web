import { prisma } from "@/lib/server/prisma";
import { withErrorBoundary } from "@/lib/server/http";

export async function GET(request: Request) {
  return withErrorBoundary(async () => {
    const url = new URL(request.url);
    const districtId = Number(url.searchParams.get("districtId"));

    if (!districtId || Number.isNaN(districtId)) {
      return Response.json({ error: "districtId query param is required" }, { status: 400 });
    }

    const cities = await prisma.city.findMany({
      where: { districtId },
      select: { id: true, name: true, slug: true },
      orderBy: { name: "asc" },
    });

    return Response.json(cities);
  });
}
