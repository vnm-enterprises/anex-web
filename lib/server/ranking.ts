import { Listing, PlanCode } from "@prisma/client";

const PLAN_WEIGHT: Record<PlanCode, number> = {
  FREE: 0,
  BASIC: 10,
  PRO: 25,
  BUSINESS: 40,
};

export function computeRankingWeight(input: {
  isFeatured: boolean;
  isBoosted: boolean;
  planCode: PlanCode;
  views30d?: number;
  inquiries30d?: number;
}) {
  const featureBoost = input.isFeatured ? 1000 : 0;
  const paidBoost = input.isBoosted ? 600 : 0;
  const planPriority = PLAN_WEIGHT[input.planCode] ?? 0;
  const engagement = Math.min((input.views30d ?? 0) * 0.1 + (input.inquiries30d ?? 0) * 3, 120);

  return Math.round(featureBoost + paidBoost + planPriority + engagement);
}

export function sortListings<T extends Pick<Listing, "isFeatured" | "isBoosted" | "rankingWeight" | "createdAt">>(
  listings: T[],
) {
  return [...listings].sort((a, b) => {
    if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
    if (a.isBoosted !== b.isBoosted) return a.isBoosted ? -1 : 1;
    if (a.rankingWeight !== b.rankingWeight) return b.rankingWeight - a.rankingWeight;
    return b.createdAt.getTime() - a.createdAt.getTime();
  });
}
