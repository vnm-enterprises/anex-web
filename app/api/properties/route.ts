import { ListingStatus } from "@prisma/client";
import { prisma } from "@/lib/server/prisma";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page") ?? "1");
  const limit = Number(url.searchParams.get("limit") ?? "12");

  const where = { status: ListingStatus.APPROVED, expiresAt: { gte: new Date() } };
  const [total, items] = await prisma.$transaction([
    prisma.listing.count({ where }),
    prisma.listing.findMany({
      where,
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        amenities: { include: { amenity: true } },
      },
      orderBy: [{ isFeatured: "desc" }, { isBoosted: "desc" }, { rankingWeight: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  const properties = items.map((x) => ({
    id: x.id,
    title: x.title,
    description: x.description,
    price: x.priceLkr,
    bedrooms: 1,
    bathrooms: 1,
    sizeSqft: 0,
    propertyType: x.propertyType,
    city: x.cityId,
    district: x.districtId,
    amenities: x.amenities.map((a: { amenity: { name: string } }) => ({ name: a.amenity.name })),
    propertyImages: x.images.map((i: { url: string }) => i.url),
    isActive: x.status === ListingStatus.APPROVED,
  }));

  return Response.json({
    properties,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  });
}
