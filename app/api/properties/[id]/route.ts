import { prisma } from "@/lib/server/prisma";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  const x = await prisma.listing.findUnique({
    where: { id },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      amenities: { include: { amenity: true } },
      district: true,
      city: true,
      owner: true,
    },
  });

  if (!x) return Response.json({ error: "Not found" }, { status: 404 });

  return Response.json({
    id: x.id,
    title: x.title,
    description: x.description,
    price: x.priceLkr,
    bedrooms: 1,
    bathrooms: 1,
    sizeSqft: 0,
    propertyType: x.propertyType,
    city: x.city.name,
    district: x.district.name,
    amenities: x.amenities.map((a: { amenity: { name: string } }) => ({ name: a.amenity.name })),
    propertyImages: x.images.map((i: { url: string }) => i.url),
    isActive: x.status === "APPROVED" && x.expiresAt >= new Date(),
  });
}
