import { ok, withErrorBoundary } from "@/lib/server/http";
import { processStripeWebhook } from "@/lib/server/payments/service";

export async function POST(request: Request) {
  return withErrorBoundary(async () => {
    const signature = request.headers.get("stripe-signature");
    if (!signature) {
      return Response.json({ error: "Missing stripe-signature" }, { status: 400 });
    }

    const rawBody = await request.text();
    const result = await processStripeWebhook(rawBody, signature);

    return ok(result);
  });
}
