import { ListingStatus } from "@prisma/client";
import { prisma } from "@/lib/server/prisma";
import { fail, ok, withErrorBoundary } from "@/lib/server/http";

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  return withErrorBoundary(async () => {
    const { slug } = await context.params;

    const listing = await prisma.listing.findUnique({
      where: { slug },
      include: {
        owner: { select: { id: true, name: true, phone: true } },
        district: true,
        city: true,
        images: { orderBy: { sortOrder: "asc" } },
        amenities: { include: { amenity: true } },
        _count: { select: { inquiries: true, favorites: true, views: true } },
      },
    });

    if (!listing || listing.status !== ListingStatus.APPROVED || listing.expiresAt < new Date()) {
      return fail(404, "Listing not found");
    }

    await prisma.$transaction([
      prisma.listingView.create({ data: { listingId: listing.id, userAgent: null } }),
      prisma.listingAnalyticsDaily.upsert({
        where: {
          listingId_date: { listingId: listing.id, date: new Date(new Date().toDateString()) },
        },
        update: { viewCount: { increment: 1 } },
        create: {
          listingId: listing.id,
          date: new Date(new Date().toDateString()),
          viewCount: 1,
        },
      }),
    ]);

    return ok(listing);
  });
}
