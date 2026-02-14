import { PaymentType } from "@prisma/client";
import { created, withErrorBoundary } from "@/lib/server/http";
import { assertCsrf } from "@/lib/server/csrf";
import { requireUser } from "@/lib/server/request-auth";
import { assertApiRateLimit } from "@/lib/server/route-guards";
import { createCheckoutSchema } from "@/lib/server/validation";
import { createCheckoutSession } from "@/lib/server/payments/service";

export async function POST(request: Request) {
  return withErrorBoundary(async () => {
    await assertApiRateLimit(request, "api:payment:checkout");
    await assertCsrf(request);
    const user = await requireUser();

    const input = createCheckoutSchema.parse(await request.json());

    const session = await createCheckoutSession({
      userId: user.id,
      type: input.type as PaymentType,
      amountLkr: input.amountLkr,
      currency: input.currency,
      listingId: input.listingId,
      subscriptionId: input.subscriptionId,
      metadata: input.metadata,
    });

    return created(session);
  });
}
