import { ListingStatus } from "@prisma/client";
import { prisma } from "@/lib/server/prisma";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get("query") ?? "";
  const minPrice = Number(url.searchParams.get("minPrice") ?? "0");
  const maxPrice = Number(url.searchParams.get("maxPrice") ?? "0");
  const propertyType = url.searchParams.get("propertyType") ?? "";

  const rows = await prisma.listing.findMany({
    where: {
      status: ListingStatus.APPROVED,
      expiresAt: { gte: new Date() },
      ...(query
        ? {
            OR: [
              { title: { contains: query } },
              { description: { contains: query } },
              { area: { contains: query } },
            ],
          }
        : {}),
      ...(minPrice || maxPrice
        ? {
            priceLkr: {
              ...(minPrice ? { gte: minPrice } : {}),
              ...(maxPrice ? { lte: maxPrice } : {}),
            },
          }
        : {}),
      ...(propertyType ? { propertyType: propertyType as never } : {}),
    },
    include: { images: true, amenities: { include: { amenity: true } } },
    orderBy: [{ isFeatured: "desc" }, { isBoosted: "desc" }, { rankingWeight: "desc" }, { createdAt: "desc" }],
    take: 100,
  });

  return Response.json(
    rows.map((x) => ({
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
    })),
  );
}
