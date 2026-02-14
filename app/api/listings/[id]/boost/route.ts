import { PlanCode } from "@prisma/client";
import { prisma } from "@/lib/server/prisma";
import { fail, ok, withErrorBoundary } from "@/lib/server/http";
import { assertCsrf } from "@/lib/server/csrf";
import { requireUser } from "@/lib/server/request-auth";
import { boostSchema } from "@/lib/server/validation";
import { calculateRanking, getCurrentPlanCode } from "@/lib/server/listing-service";

function plusDays(days: number) {
  const now = new Date();
  now.setDate(now.getDate() + days);
  return now;
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  return withErrorBoundary(async () => {
    await assertCsrf(request);
    const user = await requireUser();
    const { id } = await context.params;
    const input = boostSchema.parse(await request.json());

    const listing = await prisma.listing.findUnique({ where: { id } });
    if (!listing || listing.ownerId !== user.id) return fail(404, "Listing not found");

    const planCode = await getCurrentPlanCode(prisma, user.id);
    if (planCode === PlanCode.FREE) {
      return fail(403, "Free listings cannot be boosted");
    }

    const boostEndsAt = plusDays(input.days);

    await prisma.$transaction([
      prisma.boost.create({
        data: {
          listingId: listing.id,
          startsAt: new Date(),
          endsAt: boostEndsAt,
          durationDays: input.days,
        },
      }),
      prisma.listing.update({
        where: { id: listing.id },
        data: {
          isBoosted: true,
          boostExpiresAt: boostEndsAt,
          rankingWeight: calculateRanking(planCode, {
            isBoosted: true,
            isFeatured: listing.isFeatured,
          }),
        },
      }),
    ]);

    return ok({ ok: true, boostEndsAt });
  });
}
