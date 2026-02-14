import { ListingStatus } from "@prisma/client";
import { prisma } from "@/lib/server/prisma";

export async function GET() {
  const items = await prisma.listing.findMany({
    where: {
      status: ListingStatus.APPROVED,
      expiresAt: { gte: new Date() },
      isFeatured: true,
    },
    include: {
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
      city: true,
      district: true,
      _count: { select: { inquiries: true, views: true } },
    },
    orderBy: [{ rankingWeight: "desc" }, { createdAt: "desc" }],
    take: 12,
  });

  return Response.json(items);
}
