import { PlanCode, SubscriptionStatus } from "@prisma/client";
import { prisma } from "@/lib/server/prisma";
import { created, fail, withErrorBoundary } from "@/lib/server/http";
import { assertCsrf } from "@/lib/server/csrf";
import { requireUser } from "@/lib/server/request-auth";
import { subscribeSchema } from "@/lib/server/validation";
import { computeSubscriptionWindow } from "@/lib/server/subscription";
import { assertApiRateLimit } from "@/lib/server/route-guards";

export async function POST(request: Request) {
  return withErrorBoundary(async () => {
    await assertApiRateLimit(request, "api:subscription:subscribe");
    await assertCsrf(request);
    const user = await requireUser();
    const input = subscribeSchema.parse(await request.json());

    const plan = await prisma.plan.findUnique({ where: { code: input.planCode as PlanCode } });
    if (!plan || !plan.isActive) return fail(404, "Plan not found");

    const now = new Date();

    await prisma.subscription.updateMany({
      where: { userId: user.id, status: { in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.GRACE] } },
      data: { status: SubscriptionStatus.CANCELED, canceledAt: now },
    });

    const period = computeSubscriptionWindow(now, input.months);

    const subscription = await prisma.subscription.create({
      data: {
        userId: user.id,
        planId: plan.id,
        status: SubscriptionStatus.ACTIVE,
        startedAt: period.startedAt,
        endsAt: period.endsAt,
        graceEndsAt: period.graceEndsAt,
      },
      include: { plan: true },
    });

    return created({
      subscription,
      paymentStatus: "pending_gateway_integration",
    });
  });
}
