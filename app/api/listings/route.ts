import { ListingStatus } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/server/prisma";
import { created, withErrorBoundary } from "@/lib/server/http";
import { assertCsrf } from "@/lib/server/csrf";
import { requireUser } from "@/lib/server/request-auth";
import { createUniqueListingSlug } from "@/lib/server/slug";
import { createListingSchema } from "@/lib/server/validation";
import {
  assertMonthlyListingAllowance,
  buildListingExpiry,
  calculateRanking,
  getCurrentPlanCode,
  listingOrder,
  listingSearchWhere,
  refreshExpiredStates,
} from "@/lib/server/listing-service";
import { env } from "@/lib/server/env";
import { assertApiRateLimit } from "@/lib/server/route-guards";
import { cacheGet, cacheSet } from "@/lib/server/cache";

const searchSchema = z.object({
  keyword: z.string().optional(),
  district: z.string().optional(),
  city: z.string().optional(),
  propertyType: z.string().optional(),
  furnishedStatus: z.string().optional(),
  genderPreference: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  amenities: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(48).default(12),
  sort: z.string().optional(),
});

export async function GET(request: Request) {
  return withErrorBoundary(async () => {
    await assertApiRateLimit(request, "api:listings:get");
    await refreshExpiredStates(prisma);

    const url = new URL(request.url);
    const cacheKey = `listings:search:${url.searchParams.toString()}`;
    const cached = await cacheGet<{
      total: number;
      page: number;
      totalPages: number;
      items: unknown[];
    }>(cacheKey);

    if (cached) {
      return Response.json(cached);
    }

    const parsed = searchSchema.parse(Object.fromEntries(url.searchParams));
    const amenityIds = parsed.amenities
      ? parsed.amenities
        .split(",")
        .map((x: string) => Number(x.trim()))
        .filter(Boolean)
      : [];

    const where = listingSearchWhere({ ...parsed, amenityIds });
    const [total, rows] = await prisma.$transaction([
      prisma.listing.count({ where }),
      prisma.listing.findMany({
        where,
        include: {
          district: { select: { id: true, name: true, slug: true } },
          city: { select: { id: true, name: true, slug: true } },
          images: { orderBy: { sortOrder: "asc" }, take: 1 },
          amenities: { include: { amenity: true } },
          _count: { select: { inquiries: true, favorites: true, views: true } },
        },
        orderBy: listingOrder(parsed.sort),
        skip: (parsed.page - 1) * parsed.limit,
        take: parsed.limit,
      }),
    ]);

    const payload = {
      total,
      page: parsed.page,
      totalPages: Math.ceil(total / parsed.limit),
      items: rows,
    };

    await cacheSet(cacheKey, payload, 30);

    return Response.json(payload);
  });
}

export async function POST(request: Request) {
  return withErrorBoundary(async () => {
    await assertApiRateLimit(request, "api:listings:create");
    await assertCsrf(request);
    const user = await requireUser();
    const input = createListingSchema.parse(await request.json());
    let imageUrls = input.imageUrls;

    if (input.imageUploadIds.length > 0) {
      if (!env.s3Endpoint) {
        return Response.json({ error: "S3 endpoint is not configured" }, { status: 500 });
      }

      const uploads = await prisma.uploadAsset.findMany({
        where: {
          id: { in: input.imageUploadIds },
          userId: user.id,
          isCompleted: true,
          purpose: "LISTING_IMAGE",
        },
        orderBy: { createdAt: "asc" },
      });

      imageUrls = uploads.map((upload) => `${env.s3Endpoint?.replace(/\/$/, "")}/${upload.bucket}/${upload.objectKey}`);
    }

    if (imageUrls.length < env.minListingImages || imageUrls.length > env.maxListingImages) {
      return Response.json(
        { error: `Image count must be between ${env.minListingImages} and ${env.maxListingImages}` },
        { status: 400 },
      );
    }

    const planCode = await getCurrentPlanCode(prisma, user.id);
    await assertMonthlyListingAllowance(prisma, user.id, planCode);

    const slug = await createUniqueListingSlug(input.title);
    const expiresAt = buildListingExpiry(planCode);
    const rankingWeight = calculateRanking(planCode, { isBoosted: false, isFeatured: false });

    const listing = await prisma.listing.create({
      data: {
        ownerId: user.id,
        title: input.title,
        slug,
        description: input.description,
        propertyType: input.propertyType,
        priceLkr: input.priceLkr,
        districtId: input.districtId,
        cityId: input.cityId,
        area: input.area,
        latitude: input.latitude,
        longitude: input.longitude,
        furnishedStatus: input.furnishedStatus,
        genderPreference: input.genderPreference ?? "ANY",
        contactName: input.contactName,
        contactPhone: input.contactPhone,
        contactEmail: input.contactEmail,
        rankingWeight,
        status: ListingStatus.PENDING,
        expiresAt,
        images: {
          create: imageUrls.map((url: string, index: number) => ({
            url,
            sortOrder: index,
          })),
        },
        amenities: {
          create: input.amenityIds.map((amenityId: number) => ({ amenityId })),
        },
      },
      include: {
        images: true,
        amenities: { include: { amenity: true } },
      },
    });

    return created({ listing });
  });
}
