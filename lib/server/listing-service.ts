import {
  ListingStatus,
  PlanCode,
  Prisma,
  PrismaClient,
  SubscriptionStatus,
} from "@prisma/client";
import { env } from "@/lib/server/env";
import { HttpError } from "@/lib/server/http";
import { computeRankingWeight } from "@/lib/server/ranking";

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
}

function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
}

export async function getCurrentPlanCode(prisma: PrismaClient, userId: string) {
  const now = new Date();

  const sub = await prisma.subscription.findFirst({
    where: {
      userId,
      status: { in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.GRACE] },
      endsAt: { gte: now },
    },
    include: { plan: true },
    orderBy: { endsAt: "desc" },
  });

  return sub?.plan.code ?? PlanCode.FREE;
}

export async function assertMonthlyListingAllowance(prisma: PrismaClient, userId: string, planCode: PlanCode) {
  const start = startOfMonth(new Date());
  const end = endOfMonth(new Date());

  const monthlyCount = await prisma.listing.count({
    where: {
      ownerId: userId,
      createdAt: { gte: start, lte: end },
      status: { not: ListingStatus.REJECTED },
    },
  });

  if (planCode === PlanCode.FREE && monthlyCount >= env.freeListingsPerMonth) {
    throw new HttpError(403, `Free limit reached (${env.freeListingsPerMonth} listings/month)`);
  }

  if (planCode !== PlanCode.FREE) {
    const plan = await prisma.plan.findUnique({ where: { code: planCode } });
    if (plan?.listingLimitMonthly && monthlyCount >= plan.listingLimitMonthly) {
      throw new HttpError(403, `Plan limit reached (${plan.listingLimitMonthly} listings/month)`);
    }
  }
}

export function buildListingExpiry(planCode: PlanCode) {
  const now = new Date();
  if (planCode === PlanCode.FREE) {
    return addDays(now, env.freeListingExpiryDays);
  }
  return addDays(now, 45);
}

export async function refreshExpiredStates(prisma: PrismaClient) {
  const now = new Date();

  await prisma.listing.updateMany({
    where: { expiresAt: { lt: now }, status: { not: ListingStatus.EXPIRED } },
    data: { status: ListingStatus.EXPIRED, isBoosted: false, isFeatured: false, rankingWeight: 0 },
  });

  await prisma.listing.updateMany({
    where: {
      boostExpiresAt: { lt: now },
      isBoosted: true,
    },
    data: { isBoosted: false },
  });
}

export function listingSearchWhere(input: {
  keyword?: string;
  district?: string;
  city?: string;
  propertyType?: string;
  furnishedStatus?: string;
  genderPreference?: string;
  minPrice?: number;
  maxPrice?: number;
  amenityIds?: number[];
}): Prisma.ListingWhereInput {
  return {
    status: ListingStatus.APPROVED,
    expiresAt: { gte: new Date() },
    ...(input.district ? { district: { slug: input.district } } : {}),
    ...(input.city ? { city: { slug: input.city } } : {}),
    ...(input.propertyType ? { propertyType: input.propertyType as never } : {}),
    ...(input.furnishedStatus ? { furnishedStatus: input.furnishedStatus as never } : {}),
    ...(input.genderPreference ? { genderPreference: input.genderPreference as never } : {}),
    ...(input.minPrice || input.maxPrice
      ? {
          priceLkr: {
            ...(input.minPrice ? { gte: input.minPrice } : {}),
            ...(input.maxPrice ? { lte: input.maxPrice } : {}),
          },
        }
      : {}),
    ...(input.keyword
      ? {
          OR: [
            { title: { contains: input.keyword } },
            { description: { contains: input.keyword } },
            { area: { contains: input.keyword } },
          ],
        }
      : {}),
    ...(input.amenityIds?.length
      ? {
          amenities: {
            some: {
              amenityId: { in: input.amenityIds },
            },
          },
        }
      : {}),
  };
}

export function listingOrder(sort?: string): Prisma.ListingOrderByWithRelationInput[] {
  switch (sort) {
    case "price_asc":
      return [{ priceLkr: "asc" }];
    case "price_desc":
      return [{ priceLkr: "desc" }];
    case "most_viewed":
      return [{ views: { _count: "desc" } }, { createdAt: "desc" }];
    case "newest":
      return [{ createdAt: "desc" }];
    case "featured_first":
    default:
      return [
        { isFeatured: "desc" },
        { isBoosted: "desc" },
        { rankingWeight: "desc" },
        { createdAt: "desc" },
      ];
  }
}

export function calculateRanking(planCode: PlanCode, opts?: { isFeatured?: boolean; isBoosted?: boolean; views30d?: number; inquiries30d?: number; }) {
  return computeRankingWeight({
    isFeatured: Boolean(opts?.isFeatured),
    isBoosted: Boolean(opts?.isBoosted),
    planCode,
    views30d: opts?.views30d,
    inquiries30d: opts?.inquiries30d,
  });
}
